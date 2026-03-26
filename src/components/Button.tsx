import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, fonts, borderRadius, spacing } from '../config/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  disabled,
}: ButtonProps) {
  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[styles.container, disabled && styles.disabled, style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[...gradients.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={[styles.primaryText, textStyle]}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[styles.secondary, style]}
        activeOpacity={0.8}
      >
        <Text style={[styles.secondaryText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={style} activeOpacity={0.6}>
      <Text style={[styles.tertiaryText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
  gradient: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['3xl'],
    alignItems: 'center',
    borderRadius: borderRadius.full,
  },
  primaryText: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 16,
    color: colors.onPrimary,
  },
  secondary: {
    backgroundColor: colors.secondaryContainer,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['3xl'],
    borderRadius: borderRadius.full,
    alignItems: 'center',
  },
  secondaryText: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 16,
    color: colors.onSecondaryContainer,
  },
  tertiaryText: {
    fontFamily: fonts.sans.medium,
    fontSize: 14,
    color: colors.primary,
  },
});
