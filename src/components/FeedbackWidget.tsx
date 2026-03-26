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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSelected: {
    backgroundColor: colors.surfaceContainerHighest,
  },
  emoji: {
    fontSize: 24,
  },
});
