import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing, typography } from '../../config/theme';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useVerse } from '../../hooks/useVerse';
import { useProfile } from '../../hooks/useProfile';
import { IntentPills } from '../../components/IntentPills';
import { VerseCard } from '../../components/VerseCard';
import { InterpretationCard } from '../../components/InterpretationCard';
import { StoicCard } from '../../components/StoicCard';
import { ActionStep } from '../../components/ActionStep';
import { ReflectionInput } from '../../components/ReflectionInput';
import { FeedbackWidget } from '../../components/FeedbackWidget';
import { Intent } from '../../types';

export function TodayScreen() {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const { verse, loading, fetchTodayVerse, bookmarkVerse, removeBookmark, isBookmarked } =
    useVerse();
  const [selectedIntent, setSelectedIntent] = useState<Intent>('clarity');
  const [bookmarked, setBookmarked] = useState(false);
  const dayCount = profile?.day_count ?? 1;

  useEffect(() => {
    if (profile?.onboarding_intents?.length) {
      setSelectedIntent(profile.onboarding_intents[0]);
    }
  }, [profile]);

  useEffect(() => {
    if (user?.id && selectedIntent) {
      fetchTodayVerse(user.id, selectedIntent);
    }
  }, [user?.id, selectedIntent]);

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
      await bookmarkVerse(user.id, verse.id);
      setBookmarked(true);
    }
  };

  const handleSaveReflection = async (text: string) => {
    if (!user?.id || !verse) return;
    const { error } = await supabase.from('daily_entries').insert({
      user_id: user.id,
      verse_id: verse.id,
      journal_text: text,
      intent: selectedIntent,
    });
    if (error) {
      Alert.alert('Error', 'Could not save your reflection.');
    } else {
      Alert.alert('Saved', 'Your reflection has been saved.');
    }
  };

  const handleFeedback = async (value: 'up' | 'down') => {
    if (!user?.id || !verse) return;
    await supabase
      .from('daily_entries')
      .update({ feedback: value })
      .eq('user_id', user.id)
      .eq('verse_id', verse.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>FieldSong</Text>
          <TouchableOpacity onPress={handleBookmark} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={[styles.bookmarkIcon, bookmarked && styles.bookmarkActive]}>
              {bookmarked ? '\uD83D\uDD16' : '\uD83C\uDFF7\uFE0F'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.dayLabel}>
          DAY {dayCount} OF YOUR CLARITY PRACTICE
        </Text>
        <Text style={styles.headline}>
          What do you need{'\n'}most today?
        </Text>

        <IntentPills selected={selectedIntent} onSelect={setSelectedIntent} />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>Loading today's verse...</Text>
          </View>
        )}

        {verse && !loading && (
          <>
            <VerseCard
              sanskritLine={verse.sanskrit_line}
              translation={verse.translation}
              chapter={verse.chapter}
              verse={verse.verse}
            />
            <InterpretationCard text={verse.in_plain_terms} />
            <StoicCard
              quote={verse.stoic_parallel_quote}
              source={verse.stoic_parallel_source}
              bridge={verse.stoic_bridge}
            />
            <ActionStep text={verse.action_step} />
            <ReflectionInput
              prompt={verse.reflection_prompt}
              onSave={handleSaveReflection}
            />
            {dayCount <= 3 && <FeedbackWidget onFeedback={handleFeedback} />}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
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
    fontFamily: fonts.serif.bold,
    fontSize: 24,
    color: colors.primary,
    fontStyle: 'italic',
  },
  bookmarkIcon: {
    fontSize: 24,
  },
  bookmarkActive: {
    opacity: 1,
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
});
