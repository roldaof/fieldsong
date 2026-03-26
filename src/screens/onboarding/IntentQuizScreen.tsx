import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing, typography, borderRadius } from '../../config/theme';
import { Button } from '../../components/Button';
import { Intent } from '../../types';

const INTENT_OPTIONS: { intent: Intent; label: string; icon: string }[] = [
  { intent: 'clarity', label: 'Clarity in\ndecisions', icon: '\uD83D\uDC41' },
  { intent: 'courage', label: 'Courage to act', icon: '\u26A1' },
  { intent: 'patience', label: 'Patience with\nuncertainty', icon: '\u23F3' },
  { intent: 'acceptance', label: "Acceptance of\nwhat I can't\ncontrol", icon: '\u270B' },
  { intent: 'discipline', label: 'Discipline and\nfocus', icon: '\uD83C\uDFAF' },
  { intent: 'perspective', label: 'Perspective on\nwhat matters', icon: '\u26F0\uFE0F' },
];

export function IntentQuizScreen({ navigation }: any) {
  const [selected, setSelected] = useState<Intent[]>([]);

  const toggleIntent = (intent: Intent) => {
    setSelected((prev) => {
      if (prev.includes(intent)) return prev.filter((i) => i !== intent);
      if (prev.length >= 3) return prev;
      return [...prev, intent];
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>fieldsong</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner}>
        <Text style={styles.step}>STEP 1 OF 3</Text>
        <Text style={styles.headline}>
          What are you seeking{'\n'}most{' '}
          <Text style={styles.headlineGold}>right now?</Text>
        </Text>
        <Text style={styles.subtext}>Pick up to 3. This shapes your first week.</Text>

        <View style={styles.grid}>
          {INTENT_OPTIONS.map(({ intent, label, icon }) => {
            const isSelected = selected.includes(intent);
            return (
              <TouchableOpacity
                key={intent}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => toggleIntent(intent)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardIcon}>{icon}</Text>
                  {isSelected && <Text style={styles.checkmark}>{'\u2713'}</Text>}
                </View>
                <Text style={styles.cardLabel}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={'CONTINUE  \u2192'}
          onPress={() => navigation.navigate('RitualTime', { intents: selected })}
          disabled={selected.length === 0}
          style={styles.continueButton}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('RitualTime', { intents: [] })}
        >
          <Text style={styles.skipText}>SKIP FOR NOW</Text>
        </TouchableOpacity>
      </View>
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
  backArrow: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  headerTitle: {
    fontFamily: fonts.serif.italic,
    fontSize: 20,
    color: colors.primary,
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  step: {
    ...typography.labelMd,
    color: colors.textMuted,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  headline: {
    fontFamily: fonts.serif.regular,
    fontSize: 32,
    lineHeight: 40,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  headlineGold: {
    fontFamily: fonts.serif.italic,
    color: colors.primary,
  },
  subtext: {
    fontFamily: fonts.sans.regular,
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing['2xl'],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  card: {
    width: '47%',
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    minHeight: 120,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardIcon: {
    fontSize: 20,
  },
  checkmark: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
  },
  cardLabel: {
    fontFamily: fonts.sans.regular,
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['2xl'],
    backgroundColor: colors.surface,
  },
  continueButton: {
    marginBottom: spacing.md,
  },
  skipText: {
    ...typography.labelMd,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});
