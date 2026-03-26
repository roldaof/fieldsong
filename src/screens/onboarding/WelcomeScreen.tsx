import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing, typography } from '../../config/theme';
import { Button } from '../../components/Button';

export function WelcomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.topLine} />
      <View style={styles.content}>
        <Text style={styles.wordmark}>FieldSong</Text>
        <Text style={styles.subtitle}>Ancient clarity for modern decisions.</Text>
        <Button
          title="Begin"
          onPress={() => navigation.navigate('IntentQuiz')}
          style={styles.button}
        />
      </View>
      <View style={styles.footer}>
        <View style={styles.bottomLine} />
        <Text style={styles.footerBrand}>fieldsong.</Text>
        <Text style={styles.copyright}>
          {'\u00A9 2026 FIELDSONG ARCHIVE. ALL RIGHTS RESERVED.'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topLine: {
    height: 2,
    backgroundColor: colors.primary,
    marginHorizontal: spacing['3xl'],
    marginTop: spacing.xl,
    opacity: 0.6,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['3xl'],
  },
  wordmark: {
    fontFamily: fonts.serif.bold,
    fontSize: 56,
    color: colors.primary,
    fontStyle: 'italic',
    marginBottom: spacing.lg,
  },
  subtitle: {
    fontFamily: fonts.serif.regular,
    fontSize: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing['4xl'],
  },
  button: {
    width: '100%',
  },
  footer: {
    paddingHorizontal: spacing['3xl'],
    paddingBottom: spacing['3xl'],
  },
  bottomLine: {
    height: 1,
    backgroundColor: colors.textMuted,
    marginBottom: spacing.lg,
    opacity: 0.3,
  },
  footerBrand: {
    fontFamily: fonts.serif.italic,
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  copyright: {
    ...typography.labelSm,
    color: colors.textMuted,
  },
});
