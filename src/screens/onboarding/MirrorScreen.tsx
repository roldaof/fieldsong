import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing } from '../../config/theme';
import { Button } from '../../components/Button';
import { Intent } from '../../types';

const INTENT_LABELS: Record<Intent, string> = {
  clarity: 'clarity in decisions',
  courage: 'courage to act',
  patience: 'patience with uncertainty',
  acceptance: 'acceptance of what you cannot control',
  discipline: 'discipline and focus',
  perspective: 'perspective on what matters',
};

function buildMirrorText(intents: Intent[]): string {
  if (!intents || intents.length === 0) {
    return "You're looking for clarity in a season where most mornings start with noise.";
  }
  const labels = intents.map((i) => INTENT_LABELS[i]);
  let intentPhrase: string;
  if (labels.length === 1) {
    intentPhrase = labels[0];
  } else if (labels.length === 2) {
    intentPhrase = `${labels[0]} and ${labels[1]}`;
  } else {
    intentPhrase = `${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}`;
  }
  return `You're seeking ${intentPhrase} in a season where most mornings start with scrolling.`;
}

export function MirrorScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const intents: Intent[] = route.params?.intents ?? [];

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>fieldsong</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.mirrorText}>{buildMirrorText(intents)}</Text>
        <Text style={styles.affirmation}>That's exactly what this practice is built for.</Text>
      </View>
      <View style={styles.footer}>
        <Button
          title="Show me"
          onPress={() => navigation.navigate('FirstVerse', { intents })}
        />
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
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing['3xl'],
  },
  mirrorText: {
    fontFamily: fonts.serif.regular,
    fontSize: 28,
    lineHeight: 40,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing['3xl'],
  },
  affirmation: {
    fontFamily: fonts.sans.regular,
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
});
