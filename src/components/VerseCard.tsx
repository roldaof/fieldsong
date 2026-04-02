import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, typography } from '../config/theme';

interface VerseCardProps {
  sanskritLine: string;
  translation: string;
  chapter: number;
  verseNumber: number;
}

export function VerseCard({ sanskritLine, translation, chapter, verseNumber }: VerseCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sanskrit}>{sanskritLine}</Text>
      <Text style={styles.translation}>{`\u201C${translation}\u201D`}</Text>
      <Text style={styles.reference}>
        BHAGAVAD GITA {chapter}.{verseNumber}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xl,
  },
  sanskrit: {
    fontFamily: fonts.serif.italic,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  translation: {
    fontFamily: fonts.serif.semiBold,
    fontSize: 18,
    lineHeight: 28,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  reference: {
    ...typography.labelSm,
    color: colors.textSecondary,
  },
});
