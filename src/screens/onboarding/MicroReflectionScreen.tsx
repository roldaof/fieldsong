import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing, typography, borderRadius } from '../../config/theme';
import { Button } from '../../components/Button';
import { Intent } from '../../types';

const DEFAULT_PROMPT = 'Where in your life are you frozen between two choices right now?';
const MAX_LENGTH = 280;

export function MicroReflectionScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const intents: Intent[] = route.params?.intents ?? [];
  const verseId: number = route.params?.verseId ?? 0;
  const reflectionPrompt: string = route.params?.reflectionPrompt || DEFAULT_PROMPT;
  const [text, setText] = useState('');

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>fieldsong</Text>
      </View>
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollInner}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.label}>REFLECT</Text>
          <Text style={styles.prompt}>{reflectionPrompt}</Text>
          <TextInput
            style={styles.input}
            multiline
            maxLength={MAX_LENGTH}
            value={text}
            onChangeText={setText}
            placeholder="Write your thoughts here..."
            placeholderTextColor={colors.textMuted}
            textAlignVertical="top"
            autoCorrect={true}
            scrollEnabled={false}
            blurOnSubmit={false}
          />
          <Text style={styles.charCount}>
            {text.length}/{MAX_LENGTH}
          </Text>
        </View>
        <Text style={styles.privacyNote}>Your reflections are private. Always.</Text>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={() =>
            navigation.navigate('SignUp', {
              intents,
              verseId,
              reflectionText: text.trim(),
            })
          }
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
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginTop: spacing.xl,
  },
  label: {
    ...typography.labelMd,
    color: colors.primary,
    marginBottom: spacing.md,
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
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    minHeight: 80,
  },
  charCount: {
    fontFamily: fonts.sans.regular,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
  },
  privacyNote: {
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
});
