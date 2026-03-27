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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fonts, spacing, typography, borderRadius } from '../../config/theme';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../hooks/useAuth';

import { VerseCard } from '../../components/VerseCard';
import { InterpretationCard } from '../../components/InterpretationCard';
import { StoicCard } from '../../components/StoicCard';
import { ActionStep } from '../../components/ActionStep';
import { ReflectionInput } from '../../components/ReflectionInput';
import { Verse, Journey, UserJourney, MainStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<MainStackParamList>;
type RouteProps = RouteProp<MainStackParamList, 'JourneyDay'>;

export function JourneyDayScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const { journeyId, userJourneyId } = route.params;
  const { user } = useAuth();

  const [journey, setJourney] = useState<Journey | null>(null);
  const [userJourney, setUserJourney] = useState<UserJourney | null>(null);
  const [verse, setVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [journeyId, userJourneyId]);

  const fetchData = async () => {
    setLoading(true);

    const { data: jData } = await supabase
      .from('journeys')
      .select('*')
      .eq('id', journeyId)
      .single();
    if (jData) setJourney(jData);

    let uj: UserJourney | null = null;
    if (userJourneyId) {
      const { data: ujData } = await supabase
        .from('user_journeys')
        .select('*')
        .eq('id', userJourneyId)
        .single();
      if (ujData) uj = ujData;
    } else if (user?.id) {
      const { data: ujData } = await supabase
        .from('user_journeys')
        .select('*')
        .eq('user_id', user.id)
        .eq('journey_id', journeyId)
        .is('completed_at', null)
        .maybeSingle();
      if (ujData) uj = ujData;
    }
    setUserJourney(uj);

    if (jData && uj) {
      const dayIndex = Math.min(uj.current_day - 1, jData.verse_ids.length - 1);
      const verseId = jData.verse_ids[dayIndex];
      const { data: vData } = await supabase
        .from('verses')
        .select('*')
        .eq('id', verseId)
        .single();
      if (vData) setVerse(vData);
    }

    setLoading(false);
  };

  const handleSaveReflection = async (text: string) => {
    if (!user?.id || !verse) return;
    const { error } = await supabase.from('daily_entries').insert({
      user_id: user.id,
      verse_id: verse.id,
      reflection_text: text,
      source_channel: 'journey',
    });
    if (error) {
      Alert.alert('Error', 'Could not save your reflection.');
    } else {
      Alert.alert('Saved', 'Your reflection has been saved.');
      advanceDay();
    }
  };

  const advanceDay = async () => {
    if (!userJourney || !journey) return;
    const nextDay = userJourney.current_day + 1;
    if (nextDay > journey.duration_days) {
      await supabase
        .from('user_journeys')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', userJourney.id);
      Alert.alert('Journey Complete', `You have completed "${journey.title}".`);
    } else {
      await supabase
        .from('user_journeys')
        .update({ current_day: nextDay })
        .eq('id', userJourney.id);
      setUserJourney((prev) => prev ? { ...prev, current_day: nextDay } : null);
    }
  };

  const currentDay = userJourney?.current_day ?? 1;
  const totalDays = journey?.duration_days ?? 7;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>fieldsong</Text>
          <View style={{ width: 24 }} />
        </View>

        {journey && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>
              DAY {currentDay} OF {totalDays}
            </Text>
            <Text style={styles.journeyTitle}>{journey.title}</Text>
            <View style={styles.progressBar}>
              {Array.from({ length: totalDays }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.progressDot,
                    i < currentDay && styles.progressDotFilled,
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size="large" />
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
            <View style={styles.continueContainer}>
              <Text style={styles.continueText}>
                Continue tomorrow for Day {Math.min(currentDay + 1, totalDays)} of {totalDays}
              </Text>
            </View>
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
  progressContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  progressLabel: {
    ...typography.labelMd,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  journeyTitle: {
    fontFamily: fonts.serif.semiBold,
    fontSize: 22,
    lineHeight: 30,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  progressBar: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  progressDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceContainerHighest,
  },
  progressDotFilled: {
    backgroundColor: colors.primary,
  },
  loadingContainer: {
    paddingVertical: spacing['4xl'],
    alignItems: 'center',
    gap: spacing.md,
  },
  continueContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  continueText: {
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
