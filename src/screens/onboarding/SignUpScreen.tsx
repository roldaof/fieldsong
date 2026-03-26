import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing, typography, borderRadius } from '../../config/theme';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';

export function SignUpScreen({ navigation, route }: any) {
  const { signUp, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    const { error } = isSignIn
      ? await signIn(email, password)
      : await signUp(email, password);
    setIsLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      navigation.navigate('AllSet');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>fieldsong</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollInner}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.step}>STEP 02 OF 03</Text>
        <Text style={styles.headline}>Create your{'\n'}space.</Text>
        <Text style={styles.description}>
          A sanctuary for your thoughts and digital curation.
        </Text>

        <TouchableOpacity style={styles.oauthButton} activeOpacity={0.7}>
          <Text style={styles.oauthText}>Continue with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.oauthButton} activeOpacity={0.7}>
          <Text style={styles.oauthText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR USE EMAIL</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="curator@fieldsong.io"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <Button
          title={
            isLoading ? 'Creating...' : isSignIn ? 'Sign In' : 'Create Account'
          }
          onPress={handleSubmit}
          disabled={isLoading}
          style={styles.submitButton}
        />

        <TouchableOpacity
          onPress={() => setIsSignIn(!isSignIn)}
          style={styles.toggleAuth}
        >
          <Text style={styles.toggleAuthText}>
            {isSignIn
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Sign In'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerQuote}>
          {'\u201CThe slow path is the surest way home.\u201D'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  backArrow: {
    fontSize: 24,
    color: colors.textPrimary,
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
    paddingBottom: spacing['4xl'],
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
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  description: {
    fontFamily: fonts.sans.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    marginBottom: spacing['3xl'],
  },
  oauthButton: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  oauthText: {
    fontFamily: fonts.sans.medium,
    fontSize: 16,
    color: colors.textPrimary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing['2xl'],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.outlineVariant,
  },
  dividerText: {
    ...typography.labelSm,
    color: colors.textMuted,
    marginHorizontal: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.xl,
  },
  inputLabel: {
    ...typography.labelMd,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    fontFamily: fonts.sans.regular,
    fontSize: 16,
    color: colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    paddingVertical: spacing.md,
  },
  submitButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  toggleAuth: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing['3xl'],
  },
  toggleAuthText: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    color: colors.primary,
  },
  footerQuote: {
    fontFamily: fonts.serif.italic,
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
