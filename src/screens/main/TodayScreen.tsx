import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fonts, spacing, typography, borderRadius } from '../../config/theme';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useVerse } from '../../hooks/useVerse';
import { useProfile } from '../../hooks/useProfile';

import { VerseCard } from '../../components/VerseCard';
import { InterpretationCard } from '../../components/InterpretationCard';
import { StoicCard } from '../../components/StoicCard';
import { ActionStep } from '../../components/ActionStep';
import { ReflectionInput } from '../../components/ReflectionInput';
import { FeedbackWidget } from '../../components/FeedbackWidget';
import { Intent, Journey, UserJourney, MainStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<MainStackParamList>;

export function TodayScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const { verse, loading, fetchTodayVerse, bookmarkVerse, removeBookmark, isBookmarked } =
    useVerse();
  const selectedIntent: Intent = profile?.onboarding_intents?.[0] ?? 'clarity';
  const [bookmarked, setBookmarked] = useState(false);
  const dayCount = Math.max(profile?.practice_day_count ?? 0, 1);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [userJourneys, setUserJourneys] = useState<UserJourney[]>([]);
  const isPaid = profile?.subscription_tier !== 'free';

  const fetchJourneys = useCallback(async () => {
    const { data: jData } = await supabase
      .from('journeys')
      .select('*')
      .order('id')
      .limit(3);
    if (jData) setJourneys(jData);

    if (user?.id) {
      const { data: ujData } = await supabase
        .from('user_journeys')
        .select('*')
        .eq('user_id', user.id)
        .is('completed_at', null);
      if (ujData) setUserJourneys(ujData);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchJourneys();
  }, [fetchJourneys]);

  useEffect(() => {
    if (user?.id && selectedIntent) {
      fetchTodayVerse(user.id, selectedIntent);
    }
    // Only fetch on mount, not on intent change. Today's verse is fixed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (user?.id && verse?.id) {
      isBookmarked(user.id, verse.id).then(setBookmarked);
    }
  }, [user?.id, verse?.id]);

  const handleBookmark = async () => {
    if (!user?.id || !verse?.id) return;
    if (bookmarked) {
      await removeBookmark(user.id, verse.id);
      setBookmarked(false);
    } else {
      const tier = profile?.subscription_tier ?? 'free';
      const result = await bookmarkVerse(user.id, verse.id, tier);
      if (result.error?.message?.includes('Upgrade')) {
        Alert.alert('Bookmark Limit Reached', result.error.message);
      } else if (!result.error) {
        setBookmarked(true);
      }
    }
  };

  const getTodayEntryId = async (): Promise<string | null> => {
    if (!user?.id || !verse) return null;
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('daily_entries')
      .select('id')
      .eq('user_id', user.id)
      .eq('verse_id', verse.id)
      .gte('created_at', today)
      .limit(1)
      .maybeSingle();
    return data?.id ?? null;
  };

  const handleSaveReflection = async (text: string) => {
    if (!user?.id || !verse) return;
    const existingId = await getTodayEntryId();
    if (existingId) {
      const { error } = await supabase
        .from('daily_entries')
        .update({ reflection_text: text })
        .eq('id', existingId);
      if (error) {
        Alert.alert('Error', 'Could not save your reflection.');
      } else {
        Alert.alert('Saved', 'Your reflection has been saved.');
      }
    } else {
      const { error } = await supabase.from('daily_entries').insert({
        user_id: user.id,
        verse_id: verse.id,
        reflection_text: text,
        intent_selected: selectedIntent,
      });
      if (error) {
        Alert.alert('Error', 'Could not save your reflection.');
      } else {
        Alert.alert('Saved', 'Your reflection has been saved.');
      }
    }
  };

  const handleJourneyTap = async (journey: Journey) => {
    if (!isPaid) {
      Alert.alert('FieldSong+ Feature', 'Upgrade to FieldSong+ to start theme journeys.');
      return;
    }
    if (!user?.id) return;
    const existing = userJourneys.find((uj) => uj.journey_id === journey.id);
    if (existing) {
      navigation.navigate('JourneyDay', { journeyId: journey.id, userJourneyId: existing.id });
      return;
    }
    const { data, error } = await supabase
      .from('user_journeys')
      .insert({ user_id: user.id, journey_id: journey.id, current_day: 1 })
      .select()
      .single();
    if (error) {
      Alert.alert('Error', 'Could not start this journey.');
      return;
    }
    if (data) {
      setUserJourneys((prev) => [...prev, data]);
      navigation.navigate('JourneyDay', { journeyId: journey.id, userJourneyId: data.id });
    }
  };

  const handleFeedback = async (value: 'up' | 'down') => {
    if (!user?.id || !verse) return;
    const quality = value === 'up' ? 1 : -1;
    const existingId = await getTodayEntryId();
    if (existingId) {
      await supabase
        .from('daily_entries')
        .update({ match_quality: quality })
        .eq('id', existingId);
    } else {
      await supabase.from('daily_entries').insert({
        user_id: user.id,
        verse_id: verse.id,
        intent_selected: selectedIntent,
        match_quality: quality,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar style="light" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>fieldsong</Text>
          <TouchableOpacity onPress={handleBookmark} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons
              name={bookmarked ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={bookmarked ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.dayLabel}>
          DAY {dayCount} OF YOUR CLARITY PRACTICE
        </Text>


        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>Loading today's verse...</Text>
          </View>
        )}

        {verse && !loading && (
          <>
            <View style={{ marginBottom: spacing['2xl'] }}>
              <VerseCard
                sanskritLine={verse.sanskrit_line}
                translation={verse.translation}
                chapter={verse.chapter}
                verseNumber={verse.verse_number}
              />
            </View>
            <View style={{ marginBottom: spacing['2xl'] }}>
              <InterpretationCard text={verse.modern_interpretation} />
            </View>
            <View style={{ marginBottom: spacing['2xl'] }}>
              <StoicCard
                quote={verse.stoic_parallel_quote}
                source={verse.stoic_parallel_source}
                bridge={verse.stoic_bridge}
              />
            </View>
            <View style={{ marginBottom: spacing['2xl'] }}>
              <ActionStep text={verse.action_step} />
            </View>
            <ReflectionInput
              prompt={verse.reflection_prompt}
              onSave={handleSaveReflection}
            />
            {dayCount <= 3 && <FeedbackWidget onFeedback={handleFeedback} />}
          </>
        )}

        {journeys.length > 0 && (
          <View style={styles.journeysSection}>
            <View style={styles.journeysSectionHeader}>
              <Text style={styles.journeysSectionTitle}>THEME JOURNEYS</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Journeys')}>
                <Text style={styles.journeysSeeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.journeysScroll}
            >
              {journeys.map((j) => {
                const activeUj = userJourneys.find((uj) => uj.journey_id === j.id);
                return (
                  <TouchableOpacity
                    key={j.id}
                    style={styles.journeyCard}
                    onPress={() => handleJourneyTap(j)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.journeyCardBadgeRow}>
                      <View style={styles.journeyCardBadge}>
                        <Text style={styles.journeyCardBadgeText}>{j.duration_days} DAYS</Text>
                      </View>
                      {!isPaid && (
                        <Ionicons name="lock-closed" size={14} color={colors.textMuted} />
                      )}
                    </View>
                    <Text style={styles.journeyCardTitle}>{j.title}</Text>
                    {j.subtitle && (
                      <Text style={styles.journeyCardSubtitle}>{j.subtitle}</Text>
                    )}
                    {activeUj && isPaid && (
                      <Text style={styles.journeyCardProgress}>
                        Day {activeUj.current_day} of {j.duration_days}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['5xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontFamily: fonts.serif.italic,
    fontSize: 20,
    color: colors.primary,
  },
  bookmarkIcon: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  bookmarkActive: {
    color: colors.primary,
  },
  dayLabel: {
    ...typography.labelMd,
    color: colors.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  headline: {
    fontFamily: fonts.serif.semiBold,
    fontSize: 28,
    lineHeight: 36,
    color: colors.textPrimary,
    fontStyle: 'italic',
  },
  loadingContainer: {
    paddingVertical: spacing['4xl'],
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  journeysSection: {
    marginTop: spacing['3xl'],
  },
  journeysSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  journeysSectionTitle: {
    ...typography.labelMd,
    color: colors.primary,
  },
  journeysSeeAll: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  journeysScroll: {
    gap: spacing.md,
  },
  journeyCard: {
    width: 200,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  journeyCardBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  journeyCardBadge: {
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  journeyCardBadgeText: {
    ...typography.labelSm,
    color: colors.primary,
  },
  journeyCardTitle: {
    fontFamily: fonts.serif.semiBold,
    fontSize: 18,
    lineHeight: 24,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  journeyCardSubtitle: {
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  journeyCardProgress: {
    ...typography.labelSm,
    color: colors.primary,
    marginTop: spacing.sm,
  },
});
