import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing, typography, borderRadius } from '../../config/theme';
import { Button } from '../../components/Button';
import { Intent } from '../../types';

const INTENT_OPTIONS: { intent: Intent; label: string }[] = [
  { intent: 'clarity', label: 'Clarity in\ndecisions' },
  { intent: 'courage', label: 'Courage\nto act' },
  { intent: 'patience', label: 'Patience with\nuncertainty' },
  { intent: 'acceptance', label: "Acceptance of\nwhat I can't control" },
  { intent: 'discipline', label: 'Discipline\nand focus' },
  { intent: 'perspective', label: 'Perspective on\nwhat matters' },
];

export function IntentQuizScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<Intent[]>([]);

  const toggleIntent = (intent: Intent) => {
    setSelected((prev) => {
      if (prev.includes(intent)) return prev.filter((i) => i !== intent);
      if (prev.length >= 3) return prev;
      return [...prev, intent];
    });
  };

  const handleSkip = () => {
    navigation.navigate('Mirror', { intents: [] });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>fieldsong</Text>
      </View>
      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner}>
        <Text style={styles.problemFraming}>
          For those mornings that start with scrolling instead of clarity.
        </Text>
        <Text style={styles.headline}>
          What are you seeking{'\n'}most{' '}
          <Text style={styles.headlineGold}>right now?</Text>
        </Text>
        <Text style={styles.subtext}>Pick up to 3. This shapes your first week.</Text>

        <View style={styles.grid}>
          {INTENT_OPTIONS.map(({ intent, label }) => {
            const isSelected = selected.includes(intent);
            return (
              <TouchableOpacity
                key={intent}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => toggleIntent(intent)}
                activeOpacity={0.7}
              >
                {isSelected && (
                  <View style={styles.checkmarkContainer}>
                    <Text style={styles.checkmark}>{'\u2713'}</Text>
                  </View>
                )}
                <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          title="Continue"
          onPress={() => navigation.navigate('Mirror', { intents: selected })}
          disabled={selected.length === 0}
          style={styles.continueButton}
        />
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
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
  problemFraming: {
    fontFamily: fonts.sans.regular,
    fontSize: 15,
    color: colors.textSecondary,
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.lg,
    minHeight: 110,
    justifyContent: 'flex-end',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceContainerHighest,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.lg,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 14,
    color: colors.surface,
    fontWeight: '700',
  },
  cardLabel: {
    fontFamily: fonts.sans.medium,
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  cardLabelSelected: {
    color: colors.primary,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.surface,
  },
  continueButton: {
    marginBottom: spacing.md,
  },
  skipText: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});
