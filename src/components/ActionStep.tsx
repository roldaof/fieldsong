import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, typography } from '../config/theme';

interface ActionStepProps {
  text: string;
}

export function ActionStep({ text }: ActionStepProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>TRY THIS TODAY</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xl,
  },
  label: {
    ...typography.labelMd,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  text: {
    fontFamily: fonts.sans.regular,
    fontSize: 16,
    lineHeight: 26,
    color: colors.textPrimary,
  },
});
