import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { colors, fonts, spacing, typography, borderRadius } from '../../config/theme';
import { Button } from '../../components/Button';

export function RitualTimeScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const intents = route.params?.intents ?? [];

  const defaultTime = new Date();
  defaultTime.setHours(7, 0, 0, 0);
  const [time, setTime] = useState(defaultTime);
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');
  const [emailReminder, setEmailReminder] = useState(true);

  const onTimeChange = (_event: any, selectedTime: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const formatTime = () => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const displayHour = (time.getHours() % 12 || 12).toString().padStart(2, '0');
  const displayMinute = time.getMinutes().toString().padStart(2, '0');
  const displayPeriod = time.getHours() >= 12 ? 'PM' : 'AM';

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>fieldsong</Text>
      </View>
      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner}>
        <Text style={styles.step}>STEP 2 OF 3</Text>
        <Text style={styles.headline}>
          When shall we{'\n'}meet?
        </Text>
        <Text style={styles.description}>
          Choose a moment in your day to pause and reflect.
        </Text>

        <TouchableOpacity
          style={styles.timeDisplay}
          onPress={() => setShowPicker(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.timeText}>{displayHour}:{displayMinute}</Text>
          <Text style={styles.periodText}>{displayPeriod}</Text>
        </TouchableOpacity>

        <Text style={styles.tapHint}>Tap to change</Text>

        {showPicker && (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onValueChange={onTimeChange}
            themeVariant="dark"
          />
        )}

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
            {'\u201CIt\u2019s not at all that we have too short a time to live, but that we squander a great deal of it.\u201D'}
          </Text>
          <Text style={styles.quoteAttribution}>Seneca, On the Brevity of Life</Text>
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
  step: {
    ...typography.labelMd,
    color: colors.textMuted,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
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
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  timeText: {
    fontFamily: fonts.sans.bold,
    fontSize: 56,
    color: colors.primary,
  },
  periodText: {
    fontFamily: fonts.sans.medium,
    fontSize: 24,
    color: colors.textSecondary,
  },
  tapHint: {
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing['3xl'],
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
    marginBottom: spacing.sm,
  },
  quoteAttribution: {
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    color: colors.textMuted,
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
