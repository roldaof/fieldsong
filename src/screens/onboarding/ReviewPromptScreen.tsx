import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as StoreReview from 'expo-store-review';
import { colors, fonts, spacing, typography, borderRadius } from '../../config/theme';
import { Button } from '../../components/Button';
import { Intent } from '../../types';

export function ReviewPromptScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const intents: Intent[] = route.params?.intents ?? [];
  const reflectionText: string = route.params?.reflectionText ?? '';

  const handleReview = useCallback(async () => {
    try {
      const available = await StoreReview.isAvailableAsync();
      if (available) {
        await StoreReview.requestReview();
      }
    } catch {
      // Silently continue — review prompt is optional
    }
    navigation.navigate('SignUp', { intents, reflectionText });
  }, [navigation, intents, reflectionText]);

  const handleSkip = useCallback(() => {
    navigation.navigate('SignUp', { intents, reflectionText });
  }, [navigation, intents, reflectionText]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>fieldsong</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.emoji}>&#10024;</Text>
        <Text style={styles.headline}>
          That was your first{'\n'}clarity moment.
        </Text>
        <Text style={styles.body}>
          If this felt like the kind of thing you'd want every morning, a quick rating helps others find it too.
        </Text>

        <View style={styles.buttons}>
          <Button
            title="Rate FieldSong"
            onPress={handleReview}
            style={styles.rateButton}
          />
          <Text style={styles.skip} onPress={handleSkip}>
            Not now
          </Text>
        </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['6xl'],
  },
  emoji: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  headline: {
    fontFamily: fonts.serif.italic,
    fontSize: 30,
    lineHeight: 40,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  body: {
    fontFamily: fonts.sans.regular,
    fontSize: 16,
    lineHeight: 26,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  buttons: {
    marginTop: spacing['3xl'],
  },
  rateButton: {
    marginBottom: spacing.lg,
  },
  skip: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});
