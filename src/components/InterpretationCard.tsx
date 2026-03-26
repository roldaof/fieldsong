import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, typography, borderRadius } from '../config/theme';

interface InterpretationCardProps {
  text: string;
}

export function InterpretationCard({ text }: InterpretationCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>IN PLAIN TERMS</Text>
      <Text style={styles.body}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.xl,
    marginVertical: spacing.md,
  },
  label: {
    ...typography.labelMd,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  body: {
    fontFamily: fonts.sans.regular,
    fontSize: 16,
    lineHeight: 26,
    color: colors.textPrimary,
  },
});
