import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  TouchableOpacity,
  Linking,
  Platform,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  colors,
  fonts,
  spacing,
  typography,
  borderRadius,
} from '../../config/theme';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { useSubscription } from '../../hooks/useSubscription';
import { Button } from '../../components/Button';
import { supabase } from '../../config/supabase';
import { Intent } from '../../types';

const INTENT_OPTIONS: { intent: Intent; label: string }[] = [
  { intent: 'clarity', label: 'Clarity' },
  { intent: 'courage', label: 'Courage' },
  { intent: 'patience', label: 'Patience' },
  { intent: 'acceptance', label: 'Acceptance' },
  { intent: 'discipline', label: 'Discipline' },
  { intent: 'perspective', label: 'Perspective' },
];

function formatTimeDisplay(time: string | null | undefined): string {
  if (!time) return '7:00 AM';
  const match = time.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return time;
  const hour = parseInt(match[1], 10);
  const minute = match[2];
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute} ${period}`;
}

function parseTimeToDate(time: string | null | undefined): Date {
  const d = new Date();
  if (!time) {
    d.setHours(7, 0, 0, 0);
    return d;
  }
  const match = time.match(/^(\d{1,2}):(\d{2})/);
  if (!match) {
    d.setHours(7, 0, 0, 0);
    return d;
  }
  d.setHours(parseInt(match[1], 10), parseInt(match[2], 10), 0, 0);
  return d;
}

function formatJoinedDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { profile, practiceDays, updateRitualTime, updateEmailsPaused, updatePushNotifications, updateIntents } = useProfile(user?.id);
  const { isPaid, restore } = useSubscription();

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showIntentEditor, setShowIntentEditor] = useState(false);
  const [editingIntents, setEditingIntents] = useState<Intent[]>([]);
  const [selectedTime, setSelectedTime] = useState<Date>(
    parseTimeToDate(profile?.preferred_send_time),
  );

  const intents = profile?.onboarding_intents ?? [];
  const isFree = !isPaid;
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  const handleTimeChange = useCallback(
    async (_event: DateTimePickerEvent, date?: Date) => {
      if (Platform.OS === 'android') {
        setShowTimePicker(false);
      }
      if (!date) return;
      setSelectedTime(date);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;
      await updateRitualTime(timeStr, false);
    },
    [updateRitualTime],
  );

  const handleTimePickerDone = useCallback(() => {
    setShowTimePicker(false);
  }, []);

  const handleEditIntents = useCallback(() => {
    setEditingIntents([...intents]);
    setShowIntentEditor(true);
  }, [intents]);

  const toggleEditingIntent = useCallback((intent: Intent) => {
    setEditingIntents((prev) => {
      if (prev.includes(intent)) return prev.filter((i) => i !== intent);
      if (prev.length >= 3) return prev;
      return [...prev, intent];
    });
  }, []);

  const handleSaveIntents = useCallback(async () => {
    if (editingIntents.length === 0) return;
    const { error } = await updateIntents(editingIntents);
    if (error) {
      Alert.alert('Error', 'Could not update intents. Please try again.');
    }
    setShowIntentEditor(false);
  }, [editingIntents, updateIntents]);

  const handlePauseToggle = useCallback(async (value: boolean) => {
    await updateEmailsPaused(value);
  }, [updateEmailsPaused]);

  const handlePushToggle = useCallback(async (value: boolean) => {
    await updatePushNotifications(value);
  }, [updatePushNotifications]);

  const handleUpgrade = useCallback(() => {
    Alert.alert(
      'FieldSong+',
      'Subscriptions are not yet available. You\'ll be notified when FieldSong+ launches.',
    );
  }, []);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert('Are you sure?', 'This will delete your account.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Alert.alert(
            'This cannot be undone',
            'All your data will be permanently deleted.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete permanently',
                style: 'destructive',
                onPress: async () => {
                  const { error } = await supabase.rpc('delete_user');
                  if (error) {
                    Alert.alert('Error', 'Could not delete account. Please try again.');
                  } else {
                    Alert.alert('Account deleted', 'Your account has been deleted.');
                    signOut();
                  }
                },
              },
            ],
          );
        },
      },
    ]);
  }, [signOut]);

  const handleSignOut = useCallback(() => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: signOut },
    ]);
  }, [signOut]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <Text style={styles.headerTitle}>fieldsong</Text>

        {/* YOUR PRACTICE */}
        <Text style={styles.sectionTitle}>YOUR PRACTICE</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>YOUR PRACTICE</Text>
            <Text style={styles.rowValueBold}>Day {practiceDays}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>INTENTS</Text>
            <TouchableOpacity onPress={handleEditIntents}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          {intents.length > 0 && (
            <View style={styles.pillRow}>
              {intents.map((intent) => (
                <View key={intent} style={styles.pill}>
                  <Text style={styles.pillText}>{intent}</Text>
                </View>
              ))}
            </View>
          )}
          {profile?.created_at && (
            <Text style={styles.sinceText}>
              Since {formatJoinedDate(profile.created_at)}
            </Text>
          )}
        </View>

        {/* DELIVERY */}
        <Text style={styles.sectionTitle}>DELIVERY</Text>
        <TouchableOpacity
          style={styles.settingCard}
          onPress={() => setShowTimePicker(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.settingLabel}>Daily verse time</Text>
          <View style={styles.settingRight}>
            <Text style={styles.settingValue}>
              {formatTimeDisplay(profile?.preferred_send_time)}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textMuted}
              style={styles.chevron}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.settingCard}>
          <View style={styles.settingTextWrap}>
            <Text style={styles.settingLabel}>Pause daily emails</Text>
            <Text style={styles.settingSubtext}>
              Take a break from verse delivery
            </Text>
          </View>
          <Switch
            value={profile?.emails_paused ?? false}
            onValueChange={handlePauseToggle}
            trackColor={{
              false: colors.surfaceContainerHigh,
              true: colors.primary,
            }}
            thumbColor={colors.textPrimary}
          />
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingTextWrap}>
            <Text style={styles.settingLabel}>Push notifications</Text>
            <Text style={styles.settingSubtext}>
              Get notified when your verse is ready
            </Text>
          </View>
          <Switch
            value={profile?.push_notifications_enabled ?? true}
            onValueChange={handlePushToggle}
            trackColor={{
              false: colors.surfaceContainerHigh,
              true: colors.primary,
            }}
            thumbColor={colors.textPrimary}
          />
        </View>

        {/* Time Picker */}
        {Platform.OS === 'ios' && (
          <Modal
            visible={showTimePicker}
            transparent
            animationType="slide"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={handleTimePickerDone}>
                    <Text style={styles.modalDone}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  display="spinner"
                  onChange={handleTimeChange}
                  textColor={colors.textPrimary}
                />
              </View>
            </View>
          </Modal>
        )}
        {Platform.OS === 'android' && showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            onChange={handleTimeChange}
          />
        )}

        {/* Intent Editor Modal */}
        <Modal
          visible={showIntentEditor}
          transparent
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.intentModalContent}>
              <View style={styles.intentModalHeader}>
                <TouchableOpacity onPress={() => setShowIntentEditor(false)}>
                  <Text style={styles.intentModalCancel}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.intentModalTitle}>Edit Intents</Text>
                <TouchableOpacity onPress={handleSaveIntents}>
                  <Text style={styles.modalDone}>Save</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.intentModalSubtext}>Pick up to 3. This shapes your daily verses.</Text>
              <View style={styles.intentGrid}>
                {INTENT_OPTIONS.map(({ intent, label }) => {
                  const isSelected = editingIntents.includes(intent);
                  return (
                    <TouchableOpacity
                      key={intent}
                      style={[styles.intentChip, isSelected && styles.intentChipSelected]}
                      onPress={() => toggleEditingIntent(intent)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.intentChipText, isSelected && styles.intentChipTextSelected]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </Modal>

        {/* SUBSCRIPTION */}
        <Text style={styles.sectionTitle}>SUBSCRIPTION</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>PLAN</Text>
            <Text style={styles.rowValueBold}>
              {isFree ? 'FREE' : 'FIELDSONG+'}
            </Text>
          </View>
          {isFree ? (
            <>
              <Button
                title="Upgrade to FieldSong+"
                onPress={handleUpgrade}
                style={styles.upgradeButton}
              />
              <TouchableOpacity
                style={styles.manageSub}
                onPress={restore}
              >
                <Text style={styles.editLink}>Restore purchases</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.manageSub}
              onPress={() => Linking.openURL(
                Platform.OS === 'ios'
                  ? 'https://apps.apple.com/account/subscriptions'
                  : 'https://play.google.com/store/account/subscriptions'
              )}
            >
              <Text style={styles.editLink}>Manage subscription</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ACCOUNT */}
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.cardNoPad}>
          <View style={styles.accountRow}>
            <Ionicons
              name="mail-outline"
              size={16}
              color={colors.textSecondary}
              style={styles.rowIcon}
            />
            <Text style={styles.accountText}>{user?.email}</Text>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.accountRow}
            onPress={handleDeleteAccount}
          >
            <Ionicons
              name="trash-outline"
              size={16}
              color="#E57373"
              style={styles.rowIcon}
            />
            <Text style={styles.deleteText}>Delete account</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.accountRow}
            onPress={handleSignOut}
          >
            <Ionicons
              name="log-out-outline"
              size={16}
              color={colors.textSecondary}
              style={styles.rowIcon}
            />
            <Text style={styles.accountText}>Sign out</Text>
          </TouchableOpacity>
        </View>

        {/* ABOUT */}
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.cardNoPad}>
          <TouchableOpacity
            style={styles.aboutRow}
            onPress={() =>
              Linking.openURL('https://fieldsong.app/privacy')
            }
          >
            <View style={styles.aboutLeft}>
              <Ionicons
                name="shield-outline"
                size={16}
                color={colors.textPrimary}
                style={styles.rowIcon}
              />
              <Text style={styles.aboutText}>Privacy Policy</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textMuted}
            />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.aboutRow}
            onPress={() =>
              Linking.openURL('https://fieldsong.app/terms')
            }
          >
            <View style={styles.aboutLeft}>
              <Ionicons
                name="document-text-outline"
                size={16}
                color={colors.textPrimary}
                style={styles.rowIcon}
              />
              <Text style={styles.aboutText}>Terms of Service</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textMuted}
            />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.aboutRow}
            onPress={() =>
              Linking.openURL(
                'mailto:hello@fieldsong.app?subject=FieldSong Feedback',
              )
            }
          >
            <View style={styles.aboutLeft}>
              <Ionicons
                name="chatbubble-outline"
                size={16}
                color={colors.textPrimary}
                style={styles.rowIcon}
              />
              <Text style={styles.aboutText}>Send Feedback</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* VERSION */}
        <Text style={styles.version}>FieldSong v{appVersion}</Text>
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
  sectionTitle: {
    ...typography.labelMd,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    marginTop: spacing['2xl'],
  },
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  cardNoPad: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    ...typography.labelMd,
    color: colors.textSecondary,
  },
  rowValueBold: {
    fontFamily: fonts.sans.bold,
    fontSize: 18,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.outlineVariant,
    marginVertical: spacing.md,
  },
  editLink: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    color: colors.primary,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  pill: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    marginTop: spacing.sm,
  },
  pillText: {
    fontFamily: fonts.sans.medium,
    fontSize: 13,
    color: colors.primary,
  },
  sinceText: {
    fontFamily: fonts.sans.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  settingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontFamily: fonts.sans.medium,
    fontSize: 15,
    color: colors.textPrimary,
  },
  settingValue: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  settingTextWrap: {
    flex: 1,
    marginRight: spacing.lg,
  },
  settingSubtext: {
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  chevron: {
    marginLeft: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.surfaceContainerLow,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingBottom: spacing['3xl'],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  modalDone: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 16,
    color: colors.primary,
  },
  upgradeButton: {
    marginTop: spacing.lg,
  },
  manageSub: {
    marginTop: spacing.lg,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  rowIcon: {
    marginRight: spacing.md,
  },
  accountText: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  deleteText: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    color: '#E57373',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  aboutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aboutText: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    color: colors.textPrimary,
  },
  version: {
    fontFamily: fonts.sans.regular,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  intentModalContent: {
    backgroundColor: colors.surfaceContainerLow,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingBottom: spacing['4xl'],
  },
  intentModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  intentModalTitle: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  intentModalCancel: {
    fontFamily: fonts.sans.regular,
    fontSize: 16,
    color: colors.textSecondary,
  },
  intentModalSubtext: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  intentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  intentChip: {
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  intentChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceContainerHighest,
  },
  intentChipText: {
    fontFamily: fonts.sans.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  intentChipTextSelected: {
    color: colors.primary,
  },
});
