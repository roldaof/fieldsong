import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing, typography, borderRadius } from '../../config/theme';
import { Button } from '../../components/Button';

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

export function AllSetScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>fieldsong</Text>
        <Text style={styles.complete}>100% COMPLETE</Text>
      </View>
      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner}>
        <Text style={styles.headline}>
          Your first ritual{'\n'}awaits.
        </Text>
        <Text style={styles.description}>
          Everything is ready for your first daily clarity session. We've curated a space
          just for your thoughts.
        </Text>

        <View style={styles.previewCard}>
          <Text style={styles.previewLabel}>TODAY'S WISDOM</Text>
          <Text style={styles.previewTitle}>Daily Ritual Preview</Text>

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
          title={'Open FieldSong  \u2192'}
          onPress={() => navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Main' }] })}
          style={styles.openButton}
        />
        <Text style={styles.dayLabel}>DAY 1 OF YOUR CLARITY PRACTICE</Text>
      </ScrollView>
    </SafeAreaView>
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
    fontSize: 16,
    color: colors.textSecondary,
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
    fontFamily: fonts.serif.bold,
    fontSize: 32,
    lineHeight: 40,
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  description: {
    fontFamily: fonts.sans.regular,
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary,
    marginBottom: spacing['2xl'],
    textAlign: 'center',
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
    fontSize: 18,
    lineHeight: 28,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  reference: {
    ...typography.labelSm,
    color: colors.textMuted,
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
    fontSize: 15,
    lineHeight: 24,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  stoicSource: {
    ...typography.labelSm,
    color: colors.textMuted,
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
