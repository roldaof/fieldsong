import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../config/theme';
import { Intent } from '../types';

interface IntentPillsProps {
  selected: Intent;
  onSelect: (intent: Intent) => void;
}

const INTENTS: Intent[] = [
  'clarity',
  'courage',
  'patience',
  'acceptance',
  'discipline',
  'perspective',
];

export function IntentPills({ selected, onSelect }: IntentPillsProps) {
  return (
    <View style={styles.container}>
      {INTENTS.map((intent) => (
        <TouchableOpacity
          key={intent}
          onPress={() => onSelect(intent)}
          style={[styles.pill, selected === intent && styles.pillSelected]}
          activeOpacity={0.7}
        >
          <Text style={[styles.pillText, selected === intent && styles.pillTextSelected]}>
            {intent}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginVertical: spacing.lg,
  },
  pill: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: 'transparent',
  },
  pillSelected: {
    backgroundColor: colors.surfaceContainerHighest,
    borderColor: colors.primary,
  },
  pillText: {
    fontFamily: fonts.sans.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  pillTextSelected: {
    color: colors.textPrimary,
  },
});
