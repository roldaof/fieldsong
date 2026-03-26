import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing, typography, borderRadius } from '../../config/theme';
import { Button } from '../../components/Button';

export function RitualTimeScreen({ navigation, route }: any) {
  const intents = route.params?.intents ?? [];
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(30);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [emailReminder, setEmailReminder] = useState(true);

  const formatTime = () => {
    const h = hour.toString().padStart(2, '0');
    const m = minute.toString().padStart(2, '0');
    return `${h}:${m} ${period}`;
  };

  const cycleHour = () => setHour((prev) => (prev % 12) + 1);
  const cycleMinute = () => setMinute((prev) => (prev + 5) % 60);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>fieldsong</Text>
      </View>
      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner}>
        <Text style={styles.headline}>
          When shall we{'\n'}meet?
        </Text>
        <Text style={styles.description}>
          Choose a moment in your daily journey to pause and reflect with the fields.
        </Text>

        <View style={styles.timePickerRow}>
          <TouchableOpacity style={styles.timeBox} onPress={cycleHour} activeOpacity={0.7}>
            <Text style={styles.timeValue}>{hour.toString().padStart(2, '0')}</Text>
            <Text style={styles.timeLabel}>HOUR</Text>
          </TouchableOpacity>
          <Text style={styles.timeSeparator}>:</Text>
          <TouchableOpacity style={styles.timeBox} onPress={cycleMinute} activeOpacity={0.7}>
            <Text style={styles.timeValue}>{minute.toString().padStart(2, '0')}</Text>
            <Text style={styles.timeLabel}>MINUTE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.periodRow}>
          <TouchableOpacity
            style={[styles.periodButton, period === 'AM' && styles.periodActive]}
            onPress={() => setPeriod('AM')}
          >
            <Text style={[styles.periodText, period === 'AM' && styles.periodTextActive]}>
              AM
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, period === 'PM' && styles.periodActive]}
            onPress={() => setPeriod('PM')}
          >
            <Text style={[styles.periodText, period === 'PM' && styles.periodTextActive]}>
              PM
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emailRow}>
          <View style={styles.emailTextContainer}>
            <Text style={styles.emailTitle}>Send me a daily email reminder</Text>
            <Text style={styles.emailSubtext}>
              Receive a morning reflection directly in your inbox.
            </Text>
          </View>
          <Switch
            value={emailReminder}
            onValueChange={setEmailReminder}
            trackColor={{ false: colors.surfaceContainerHigh, true: colors.primary }}
            thumbColor={colors.textPrimary}
          />
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            {'\u201CIt\u2019s not at all that we have too short a time to live, but that we squander a great deal of it.\u201D \u2014 Seneca, On the Brevity of Life'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Next"
          onPress={() =>
            navigation.navigate('SignUp', { intents, ritualTime: formatTime() })
          }
          style={styles.nextButton}
        />
      </View>
    </SafeAreaView>
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
    fontSize: 36,
    lineHeight: 44,
    color: colors.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  description: {
    fontFamily: fonts.sans.regular,
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary,
    marginBottom: spacing['3xl'],
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  timeBox: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing['3xl'],
    alignItems: 'center',
    minWidth: 100,
  },
  timeValue: {
    fontFamily: fonts.sans.bold,
    fontSize: 40,
    color: colors.textPrimary,
  },
  timeLabel: {
    ...typography.labelSm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  timeSeparator: {
    fontFamily: fonts.sans.bold,
    fontSize: 40,
    color: colors.textPrimary,
  },
  periodRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing['3xl'],
  },
  periodButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceContainerHigh,
  },
  periodActive: {
    backgroundColor: colors.surfaceContainerHighest,
  },
  periodText: {
    fontFamily: fonts.sans.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  periodTextActive: {
    color: colors.textPrimary,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing['3xl'],
  },
  emailTextContainer: {
    flex: 1,
    marginRight: spacing.lg,
  },
  emailTitle: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emailSubtext: {
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  quoteCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
  },
  quoteText: {
    fontFamily: fonts.serif.italic,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  nextButton: {
    width: '100%',
  },
});
