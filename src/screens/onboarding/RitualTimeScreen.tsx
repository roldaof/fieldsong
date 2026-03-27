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
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, fonts, spacing, typography, borderRadius } from '../../config/theme';
import { Button } from '../../components/Button';

const PRESET_TIMES = [
  { label: '6:00', period: 'AM', hour: 6, minute: 0 },
  { label: '6:30', period: 'AM', hour: 6, minute: 30 },
  { label: '7:00', period: 'AM', hour: 7, minute: 0 },
  { label: '7:30', period: 'AM', hour: 7, minute: 30 },
  { label: '8:00', period: 'AM', hour: 8, minute: 0 },
  { label: '8:30', period: 'AM', hour: 8, minute: 30 },
];

export function RitualTimeScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const intents = route.params?.intents ?? [];

  const [selectedHour, setSelectedHour] = useState(7);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isCustom, setIsCustom] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [emailReminder, setEmailReminder] = useState(true);

  const customTime = new Date();
  customTime.setHours(selectedHour, selectedMinute, 0, 0);

  const selectPreset = (hour: number, minute: number) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    setIsCustom(false);
    setShowPicker(false);
  };

  const handleCustomPress = () => {
    setIsCustom(true);
    setShowPicker(true);
  };

  const onTimeChange = (_event: any, selectedTime: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedTime) {
      setSelectedHour(selectedTime.getHours());
      setSelectedMinute(selectedTime.getMinutes());
      setIsCustom(true);
    }
  };

  const formatTime = () => {
    const period = selectedHour >= 12 ? 'PM' : 'AM';
    const displayHour = selectedHour % 12 || 12;
    return `${displayHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')} ${period}`;
  };

  const isPresetSelected = (hour: number, minute: number) =>
    !isCustom && selectedHour === hour && selectedMinute === minute;

  const customDisplayTime = () => {
    const period = selectedHour >= 12 ? 'PM' : 'AM';
    const displayHour = selectedHour % 12 || 12;
    return `${displayHour}:${selectedMinute.toString().padStart(2, '0')} ${period}`;
  };

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

        <View style={styles.grid}>
          {PRESET_TIMES.map(({ label, period, hour, minute }) => {
            const selected = isPresetSelected(hour, minute);
            return (
              <TouchableOpacity
                key={`${hour}-${minute}`}
                style={[styles.timeCard, selected && styles.timeCardSelected]}
                onPress={() => selectPreset(hour, minute)}
                activeOpacity={0.7}
              >
                <Text style={[styles.timeLabel, selected && styles.timeLabelSelected]}>{label}</Text>
                <Text style={[styles.timePeriod, selected && styles.timePeriodSelected]}>{period}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.customCard, isCustom && styles.timeCardSelected]}
          onPress={handleCustomPress}
          activeOpacity={0.7}
        >
          <Text style={[styles.customLabel, isCustom && styles.timeLabelSelected]}>
            {isCustom ? customDisplayTime() : 'Other time...'}
          </Text>
        </TouchableOpacity>

        {showPicker && Platform.OS === 'ios' && (
          <DateTimePicker
            value={customTime}
            mode="time"
            is24Hour={false}
            display="spinner"
            onValueChange={onTimeChange}
            themeVariant="dark"
          />
        )}

        {showPicker && Platform.OS === 'android' && (
          <DateTimePicker
            value={customTime}
            mode="time"
            is24Hour={false}
            display="default"
            onValueChange={onTimeChange}
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
    marginBottom: spacing['2xl'],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  timeCard: {
    width: '30%',
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceContainerHighest,
  },
  timeLabel: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 20,
    color: colors.textPrimary,
  },
  timeLabelSelected: {
    color: colors.primary,
  },
  timePeriod: {
    fontFamily: fonts.sans.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  timePeriodSelected: {
    color: colors.primary,
  },
  customCard: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: spacing['3xl'],
  },
  customLabel: {
    fontFamily: fonts.sans.medium,
    fontSize: 15,
    color: colors.textSecondary,
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
