import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, findNodeHandle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, spacing, typography, borderRadius, gradients } from '../config/theme';

interface ReflectionInputProps {
  prompt: string;
  onSave: (text: string) => void;
  maxLength?: number;
}

export function ReflectionInput({ prompt, onSave, maxLength = 280 }: ReflectionInputProps) {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (text.trim()) {
      onSave(text.trim());
      setSaved(true);
    }
  };

  const handleTapInput = () => {
    if (saved) {
      setSaved(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Ionicons name="pencil-outline" size={14} color={colors.primary} />
        <Text style={styles.label}>REFLECT</Text>
      </View>
      <Text style={styles.prompt}>{prompt}</Text>
      <TouchableOpacity activeOpacity={1} onPress={handleTapInput}>
        <TextInput
          style={[styles.input, saved && { opacity: 0.7 }]}
          multiline
          maxLength={maxLength}
          value={text}
          onChangeText={setText}
          placeholder="Write your thoughts here..."
          placeholderTextColor={colors.textMuted}
          textAlignVertical="top"
          autoComplete="off"
          autoCorrect={true}
          importantForAutofill="no"
          textContentType="none"
          keyboardType="default"
          scrollEnabled={false}
          blurOnSubmit={false}
          editable={!saved}
          pointerEvents={saved ? 'none' : 'auto'}
        />
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.charCount}>
          {text.length}/{maxLength}
        </Text>
        {saved ? (
          <Text style={styles.savedText}>Saved ✓</Text>
        ) : (
          <TouchableOpacity onPress={handleSave} activeOpacity={0.8}>
            <LinearGradient
              colors={[...gradients.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButton}
            >
              <Text style={styles.saveText}>SAVE</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginVertical: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.labelMd,
    color: colors.primary,
  },
  prompt: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  input: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceContainerHigh,
    padding: spacing.md,
    marginBottom: spacing.md,
    minHeight: 60,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    fontFamily: fonts.sans.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  saveButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
  },
  saveText: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 12,
    color: colors.onPrimary,
    letterSpacing: 0.8,
  },
  savedText: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 0.8,
  },
});
