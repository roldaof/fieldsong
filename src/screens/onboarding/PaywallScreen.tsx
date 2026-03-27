import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing, typography, borderRadius, gradients } from '../../config/theme';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { Intent } from '../../types';

export function PaywallScreen({ route }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { updateIntents } = useProfile(user?.id);
  const [isLoading, setIsLoading] = useState(false);
  const intents: Intent[] = route.params?.intents ?? [];

  const handleStartFree = async () => {
    setIsLoading(true);
    try {
      const finalIntents = intents.length > 0 ? intents : ['clarity'] as Intent[];
      const result = await updateIntents(finalIntents);
      if (result?.error) {
        Alert.alert('Error', 'Could not save your preferences. Please try again.');
        setIsLoading(false);
      }
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const handlePaidOption = () => {
    Alert.alert('Coming soon', 'Subscriptions will be available at launch.');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>fieldsong</Text>
      </View>
      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner}>
        <Text style={styles.headline}>Your practice{'\n'}begins.</Text>
        <Text style={styles.subtext}>FieldSong is free. FieldSong+ adds depth.</Text>

        <View style={styles.freeCard}>
          <Text style={styles.cardLabel}>FREE</Text>
          <Text style={styles.cardFeatures}>
            The complete daily clarity ritual. 30-day journal history. 5 bookmarks.
          </Text>
          <TouchableOpacity
            onPress={handleStartFree}
            disabled={isLoading}
            activeOpacity={0.8}
            style={[styles.outlineButton, isLoading && styles.disabled]}
          >
            <Text style={styles.outlineButtonText}>
              {isLoading ? 'Loading...' : 'Start free'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.plusCard}>
          <Text style={styles.plusLabel}>FIELDSONG+</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>$34.99</Text>
            <Text style={styles.priceUnit}>/year</Text>
            <Text style={styles.priceNote}>($2.92/mo)</Text>
          </View>
          <Text style={styles.plusFeatures}>
            Everything in free, plus:
          </Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>Unlimited journal history + search</Text>
            <Text style={styles.featureItem}>Unlimited bookmarks</Text>
            <Text style={styles.featureItem}>Theme journeys (7-day sequences)</Text>
            <Text style={styles.featureItem}>Cross-tradition deep-dives</Text>
            <Text style={styles.featureItem}>Weekly wisdom digest</Text>
          </View>
          <TouchableOpacity onPress={handlePaidOption} activeOpacity={0.8} style={styles.primaryButtonWrap}>
            <LinearGradient
              colors={[...gradients.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Get FieldSong+</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handlePaidOption} activeOpacity={0.7} style={styles.lifetimeRow}>
          <Text style={styles.lifetimeText}>$99 one-time. Access forever.</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleStartFree} disabled={isLoading} activeOpacity={0.7}>
          <Text style={styles.continueFreeText}>Continue free</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontFamily: fonts.serif.italic,
    fontSize: 20,
    color: colors.primary,
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  headline: {
    fontFamily: fonts.serif.italic,
    fontSize: 32,
    lineHeight: 40,
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  subtext: {
    fontFamily: fonts.sans.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    marginBottom: spacing['3xl'],
  },
  freeCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  cardLabel: {
    ...typography.labelMd,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  cardFeatures: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  outlineButtonText: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 15,
    color: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  plusCard: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  plusLabel: {
    ...typography.labelMd,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.lg,
  },
  price: {
    fontFamily: fonts.serif.semiBold,
    fontSize: 28,
    color: colors.primary,
  },
  priceUnit: {
    fontFamily: fonts.sans.regular,
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  priceNote: {
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginLeft: spacing.md,
  },
  plusFeatures: {
    fontFamily: fonts.sans.medium,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  featureList: {
    marginBottom: spacing.xl,
  },
  featureItem: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    lineHeight: 24,
    color: colors.textSecondary,
    paddingLeft: spacing.md,
  },
  primaryButtonWrap: {
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  primaryButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['3xl'],
    alignItems: 'center',
    borderRadius: borderRadius.full,
  },
  primaryButtonText: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 16,
    color: colors.onPrimary,
  },
  lifetimeRow: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  lifetimeText: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['2xl'],
    alignItems: 'center',
  },
  continueFreeText: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    color: colors.textSecondary,
    paddingVertical: spacing.sm,
  },
});
