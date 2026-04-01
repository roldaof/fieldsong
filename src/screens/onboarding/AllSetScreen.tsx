import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing, typography, borderRadius } from '../../config/theme';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';

const PREVIEW_VERSE = {
  sanskrit_line: 'karma\u1E47y ev\u0101dhik\u0101ras te m\u0101 phale\u1E63u kad\u0101cana',
  translation:
    'Thy right is to work only, but never with its fruits; let not the fruits of actions be thy motive, nor let thy attachment be to inaction.',
  chapter: 2,
  verse: 47,
  in_plain_terms:
    "This is probably the most famous verse in the Gita, and it's famous because it solves about half of your problems in one line. You get to do the work. You don't get to control the results. The second you start working for the outcome instead of the work itself, you've lost the thread.",
  stoic_quote:
    '\u201CExternals are not in my power: will is in my power. Where shall I seek the good and the bad? Within, in the things which are my own.\u201D',
  stoic_source: 'Epictetus, Discourses 2.5',
  action_step:
    "Pick one thing you've been agonizing over today. Do the part that's yours. Then put it down.",
};

export function AllSetScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { updateIntents, updateRitualTime } = useProfile(user?.id);
  const [isLoading, setIsLoading] = useState(false);

  const intents = route.params?.intents ?? ['clarity'];
  const ritualTime = route.params?.ritualTime ?? '07:30 AM';

  const convertTo24h = (timeStr: string): string => {
    // Convert "07:00 AM" or "02:30 PM" to "07:00:00" or "14:30:00"
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return '07:00:00';
    let hour = parseInt(match[1], 10);
    const min = match[2];
    const period = match[3].toUpperCase();
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${min}:00`;
  };

  const handleOpenApp = async () => {
    setIsLoading(true);
    try {
      // Save ritual time (non-blocking, don't fail onboarding if this fails)
      await updateRitualTime(convertTo24h(ritualTime), true).catch(() => {});

      // Save intents — this triggers RootNavigator to switch to MainNavigator
      const finalIntents = intents.length > 0 ? intents : ['clarity'];
      const result = await updateIntents(finalIntents);
      if (result?.error) {
        Alert.alert('Error', 'Could not save your preferences. Please try again.');
        setIsLoading(false);
      }
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>fieldsong</Text>
      </View>
      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner}>
        <Text style={styles.headline}>
          Your first ritual{'\n'}awaits.
        </Text>
        <Text style={styles.description}>
          Everything's ready. I'll be quiet for the first few days while I learn what resonates with you.
        </Text>

        <View style={styles.previewCard}>
          <Text style={styles.sanskrit}>{PREVIEW_VERSE.sanskrit_line}</Text>
          <Text style={styles.translation}>
            {`\u201C${PREVIEW_VERSE.translation}\u201D`}
          </Text>
          <Text style={styles.reference}>
            BHAGAVAD GITA {PREVIEW_VERSE.chapter}.{PREVIEW_VERSE.verse}
          </Text>

          <Text style={styles.sectionLabel}>IN PLAIN TERMS</Text>
          <Text style={styles.bodyText}>{PREVIEW_VERSE.in_plain_terms}</Text>

          <Text style={styles.sectionLabel}>STOIC PARALLEL</Text>
          <Text style={styles.stoicQuote}>{PREVIEW_VERSE.stoic_quote}</Text>
          <Text style={styles.stoicSource}>{PREVIEW_VERSE.stoic_source}</Text>

          <Text style={styles.sectionLabel}>TRY THIS TODAY</Text>
          <Text style={styles.bodyText}>{PREVIEW_VERSE.action_step}</Text>
        </View>

        <Button
          title={isLoading ? 'Loading...' : 'Open FieldSong'}
          onPress={handleOpenApp}
          disabled={isLoading}
          style={styles.openButton}
        />
        <Text style={styles.dayLabel}>DAY 1 OF YOUR CLARITY PRACTICE</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontFamily: fonts.serif.italic,
    fontSize: 20,
    color: colors.primary,
  },
  complete: {
    ...typography.labelSm,
    color: colors.textMuted,
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['4xl'],
  },
  headline: {
    fontFamily: fonts.serif.italic,
    fontSize: 36,
    lineHeight: 44,
    color: colors.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  description: {
    fontFamily: fonts.sans.regular,
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary,
    marginBottom: spacing['2xl'],
  },
  previewCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing['2xl'],
  },
  previewLabel: {
    ...typography.labelMd,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  previewTitle: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  sanskrit: {
    fontFamily: fonts.serif.italic,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  translation: {
    fontFamily: fonts.serif.semiBold,
    fontSize: 22,
    lineHeight: 32,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  reference: {
    ...typography.labelSm,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    ...typography.labelMd,
    color: colors.primary,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  bodyText: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  stoicQuote: {
    fontFamily: fonts.serif.italic,
    fontSize: 18,
    lineHeight: 28,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  stoicSource: {
    ...typography.labelSm,
    color: colors.textSecondary,
  },
  openButton: {
    marginBottom: spacing.md,
  },
  dayLabel: {
    ...typography.labelMd,
    color: colors.primary,
    textAlign: 'center',
  },
});
