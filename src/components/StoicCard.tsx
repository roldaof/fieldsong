import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, typography, borderRadius } from '../config/theme';

interface StoicCardProps {
  quote: string;
  source: string;
  bridge: string;
}

export function StoicCard({ quote, source, bridge }: StoicCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>STOIC PARALLEL</Text>
      <Text style={styles.quote}>{`\u201C${quote}\u201D`}</Text>
      <Text style={styles.source}>{source}</Text>
      <Text style={styles.bridge}>{bridge}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginVertical: spacing.md,
  },
  label: {
    ...typography.labelMd,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  quote: {
    fontFamily: fonts.serif.italic,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  source: {
    ...typography.labelSm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  bridge: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
});
