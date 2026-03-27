import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing, typography, borderRadius } from '../../config/theme';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { Button } from '../../components/Button';
import { supabase } from '../../config/supabase';

function formatTimeDisplay(time: string | null | undefined): string {
  if (!time) return '7:00 AM';
  // Handle "HH:MM:SS" format from Postgres TIME column
  const match = time.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return time;
  const hour = parseInt(match[1], 10);
  const minute = match[2];
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute} ${period}`;
}

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { profile } = useProfile(user?.id);
  const [quietHours, setQuietHours] = useState(false);

  const dayCount = Math.max(profile?.practice_day_count ?? 0, 1);

  const handleQuietHoursToggle = async (value: boolean) => {
    setQuietHours(value);
    if (user?.id) {
      // Store quiet hours preference in profile
      // For MVP, this just controls the local UI state
      // When email pipeline is added, this will suppress email delivery
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>fieldsong</Text>

        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>PRACTICE DAYS</Text>
            <Text style={styles.statValue}>{dayCount}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>SUBSCRIPTION</Text>
            <Text style={styles.statValue}>
              {(profile?.subscription_tier ?? 'free').toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SETTINGS</Text>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Daily verse time</Text>
              <Text style={styles.settingValue}>
                {formatTimeDisplay(profile?.preferred_send_time)}
              </Text>
            </View>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextWrap}>
              <Text style={styles.settingLabel}>Quiet hours</Text>
              <Text style={styles.settingSubtext}>
                Pause notifications between 10 PM and 7 AM
              </Text>
            </View>
            <Switch
              value={quietHours}
              onValueChange={handleQuietHoursToggle}
              trackColor={{ false: colors.surfaceContainerHigh, true: colors.primary }}
              thumbColor={colors.textPrimary}
            />
          </View>
        </View>

        <View style={styles.accountSection}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <Text style={styles.emailText}>{user?.email}</Text>
          <Button
            title="Sign Out"
            variant="secondary"
            onPress={handleSignOut}
            style={styles.signOutButton}
          />
        </View>

        <Text style={styles.version}>FieldSong v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['4xl'],
  },
  headerTitle: {
    fontFamily: fonts.serif.italic,
    fontSize: 20,
    color: colors.primary,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
  statsCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing['2xl'],
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statLabel: {
    ...typography.labelMd,
    color: colors.textSecondary,
  },
  statValue: {
    fontFamily: fonts.sans.bold,
    fontSize: 18,
    color: colors.primary,
  },
  section: {
    marginBottom: spacing['2xl'],
  },
  sectionTitle: {
    ...typography.labelMd,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  settingTextWrap: {
    flex: 1,
    marginRight: spacing.lg,
  },
  settingLabel: {
    fontFamily: fonts.sans.medium,
    fontSize: 15,
    color: colors.textPrimary,
  },
  settingValue: {
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  settingSubtext: {
    fontFamily: fonts.sans.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  accountSection: {
    marginBottom: spacing['2xl'],
  },
  emailText: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  signOutButton: {
    marginTop: spacing.sm,
  },
  version: {
    fontFamily: fonts.sans.regular,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
