import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, typography, borderRadius, gradients } from '../../config/theme';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { Intent } from '../../types';

const FEATURES = [
  'Unlimited journal history + search',
  'Unlimited bookmarks',
  'Theme journeys (7-day sequences)',
  'Cross-tradition deep-dives',
  'Weekly wisdom digest',
];

export function PaywallScreen({ route }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { updateIntents } = useProfile(user?.id);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');
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
    Alert.alert(
      'Coming soon',
      'Subscriptions will be available at launch. Starting free instead.',
      [{ text: 'OK', onPress: handleStartFree }],
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>fieldsong</Text>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner}>
        <Text style={styles.headline}>Your practice begins.</Text>
        <Text style={styles.subtext}>FieldSong is free. FieldSong+ adds depth.</Text>

        {/* FieldSong+ Hero Card */}
        <View style={styles.plusCard}>
          <Text style={styles.plusLabel}>FIELDSONG+</Text>

          {/* Price Toggle */}
          <View style={styles.priceToggle}>
            <TouchableOpacity
              style={[styles.pill, selectedPlan === 'annual' && styles.pillSelected]}
              onPress={() => setSelectedPlan('annual')}
              activeOpacity={0.8}
            >
              <Text style={[styles.pillText, selectedPlan === 'annual' && styles.pillTextSelected]}>
                Annual $34.99/yr
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pill, selectedPlan === 'monthly' && styles.pillSelected]}
              onPress={() => setSelectedPlan('monthly')}
              activeOpacity={0.8}
            >
              <Text style={[styles.pillText, selectedPlan === 'monthly' && styles.pillTextSelected]}>
                Monthly $4.99/mo
              </Text>
            </TouchableOpacity>
          </View>

          {selectedPlan === 'annual' && (
            <Text style={styles.savingsText}>Save 42% vs monthly</Text>
          )}

          {/* Feature List */}
          <View style={styles.featureList}>
            {FEATURES.map((feature) => (
              <View key={feature} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* CTA */}
          <TouchableOpacity
            onPress={handlePaidOption}
            activeOpacity={0.8}
            style={styles.ctaWrap}
          >
            <LinearGradient
              colors={[...gradients.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaButton}
            >
              <Text style={styles.ctaText}>Start 7-day free trial</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.trialNote}>Cancel anytime. No charge until trial ends.</Text>

          {/* Lifetime Option */}
          <TouchableOpacity onPress={handlePaidOption} activeOpacity={0.7} style={styles.lifetimeRow}>
            <Text style={styles.lifetimeText}>Or $99 one-time. Access forever.</Text>
          </TouchableOpacity>
        </View>

        {/* Free Option */}
        <View style={styles.divider} />
        <Text style={styles.freeText}>Or start free with the complete daily ritual.</Text>
        <TouchableOpacity
          onPress={handleStartFree}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text style={styles.continueFreeLink}>
            {isLoading ? 'Loading...' : 'Continue free'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleStartFree} disabled={isLoading} activeOpacity={0.7}>
          <Text style={styles.footerFreeText}>
            {isLoading ? 'Loading...' : 'Continue free'}
          </Text>
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
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  subtext: {
    fontFamily: fonts.sans.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  plusCard: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  plusLabel: {
    ...typography.labelMd,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  priceToggle: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  pill: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    backgroundColor: colors.surfaceContainer,
  },
  pillSelected: {
    backgroundColor: colors.primary,
  },
  pillText: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 13,
    color: colors.textSecondary,
  },
  pillTextSelected: {
    color: colors.onPrimary,
  },
  savingsText: {
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  featureList: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  ctaWrap: {
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  ctaButton: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderRadius: borderRadius.full,
  },
  ctaText: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 16,
    color: colors.onPrimary,
  },
  trialNote: {
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  lifetimeRow: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  lifetimeText: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.outlineVariant,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  freeText: {
    fontFamily: fonts.sans.regular,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  continueFreeLink: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['2xl'],
    alignItems: 'center',
  },
  footerFreeText: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    color: colors.primary,
    paddingVertical: spacing.sm,
  },
});
