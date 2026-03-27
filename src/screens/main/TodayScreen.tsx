import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, typography } from '../../config/theme';
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
import { Intent } from '../../types';

export function TodayScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const { verse, loading, fetchTodayVerse, bookmarkVerse, removeBookmark, isBookmarked } =
    useVerse();
  const selectedIntent: Intent = profile?.onboarding_intents?.[0] ?? 'clarity';
  const [bookmarked, setBookmarked] = useState(false);
  const dayCount = Math.max(profile?.practice_day_count ?? 0, 1);

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
      await bookmarkVerse(user.id, verse.id);
      setBookmarked(true);
    }
  };

  const handleSaveReflection = async (text: string) => {
    if (!user?.id || !verse) return;
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
  };

  const handleFeedback = async (value: 'up' | 'down') => {
    if (!user?.id || !verse) return;
    const quality = value === 'up' ? 1 : -1;
    // Upsert: create entry if it doesn't exist, update if it does
    const { error } = await supabase.from('daily_entries').upsert({
      user_id: user.id,
      verse_id: verse.id,
      intent_selected: selectedIntent,
      match_quality: quality,
    }, { onConflict: 'user_id,verse_id' }).select();
    // If upsert fails (no unique constraint), try insert then update
    if (error) {
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
            <VerseCard
              sanskritLine={verse.sanskrit_line}
              translation={verse.translation}
              chapter={verse.chapter}
              verseNumber={verse.verse_number}
            />
            <InterpretationCard text={verse.modern_interpretation} />
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
});
