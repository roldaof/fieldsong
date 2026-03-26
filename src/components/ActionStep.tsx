import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, typography } from '../config/theme';

interface ActionStepProps {
  text: string;
}

export function ActionStep({ text }: ActionStepProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{'\uD83D\uDD25'} TRY THIS TODAY</Text>
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
    fontFamily: fonts.sans.semiBold,
    fontSize: 18,
    lineHeight: 28,
    color: colors.textPrimary,
  },
});
