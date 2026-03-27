import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../config/theme';

interface FeedbackWidgetProps {
  onFeedback: (value: 'up' | 'down') => void;
}

export function FeedbackWidget({ onFeedback }: FeedbackWidgetProps) {
  const [selected, setSelected] = useState<'up' | 'down' | null>(null);

  const handlePress = (value: 'up' | 'down') => {
    setSelected(value);
    onFeedback(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>DID TODAY'S VERSE LAND?</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => handlePress('up')}
          style={[styles.button, selected === 'up' && styles.buttonSelected]}
          activeOpacity={0.7}
        >
          <Text style={styles.emoji}>{'\uD83D\uDC4D'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handlePress('down')}
          style={[styles.button, selected === 'down' && styles.buttonSelected]}
          activeOpacity={0.7}
        >
          <Text style={styles.emoji}>{'\uD83D\uDC4E'}</Text>
        </TouchableOpacity>
      </View>
      {selected && (
        <Text style={styles.selectedText}>
          {selected === 'up' ? 'Thanks! Glad it resonated.' : 'Noted. Tomorrow will be better.'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  label: {
    ...typography.labelMd,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  buttonSelected: {
    backgroundColor: colors.surfaceContainerHighest,
    borderColor: colors.primary,
  },
  emoji: {
    fontSize: 24,
  },
  selectedText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
});
