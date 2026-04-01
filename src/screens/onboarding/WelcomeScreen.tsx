import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing, typography } from '../../config/theme';
import { Button } from '../../components/Button';

export function WelcomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl }]}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Text style={styles.wordmark}>Field{'\n'}Song</Text>
        <Text style={styles.subtitle}>Ancient clarity for modern decisions.</Text>
        <Text style={styles.description}>
          A 2-minute daily ritual pairing the Bhagavad Gita with Stoic philosophy.{'\n'}No religion.{'\n'}Just wisdom that works.
        </Text>
        <Button
          title="Begin"
          onPress={() => navigation.navigate('IntentQuiz')}
          style={styles.button}
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerBrand}>fieldsong.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing['3xl'],
  },
  wordmark: {
    fontFamily: fonts.serif.semiBold,
    fontSize: 64,
    lineHeight: 72,
    color: colors.primary,
    marginBottom: spacing.xl,
  },
  subtitle: {
    fontFamily: fonts.serif.regular,
    fontSize: 22,
    lineHeight: 30,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  description: {
    fontFamily: fonts.sans.regular,
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary,
    marginBottom: spacing['4xl'],
  },
  button: {
    width: '100%',
  },
  footer: {
    paddingHorizontal: spacing['3xl'],
  },
  footerBrand: {
    fontFamily: fonts.serif.italic,
    fontSize: 20,
    color: colors.primary,
    textAlign: 'center',
  },
});
