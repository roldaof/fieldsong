import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import {
  Newsreader_400Regular,
  Newsreader_400Regular_Italic,
  Newsreader_600SemiBold,
  Newsreader_700Bold,
} from '@expo-google-fonts/newsreader';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/hooks/useAuth';
import { useProfile } from './src/hooks/useProfile';
import { colors, fonts, typography } from './src/config/theme';

import { WelcomeScreen } from './src/screens/onboarding/WelcomeScreen';
import { IntentQuizScreen } from './src/screens/onboarding/IntentQuizScreen';
import { RitualTimeScreen } from './src/screens/onboarding/RitualTimeScreen';
import { SignUpScreen } from './src/screens/onboarding/SignUpScreen';
import { AllSetScreen } from './src/screens/onboarding/AllSetScreen';

import { TodayScreen } from './src/screens/main/TodayScreen';
import { JournalScreen } from './src/screens/main/JournalScreen';
import { SavedScreen } from './src/screens/main/SavedScreen';
import { ProfileScreen } from './src/screens/main/ProfileScreen';

const RootStack = createNativeStackNavigator();
const OnboardingStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: colors.surface },
      }}
    >
      <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
      <OnboardingStack.Screen name="IntentQuiz" component={IntentQuizScreen} />
      <OnboardingStack.Screen name="RitualTime" component={RitualTimeScreen} />
      <OnboardingStack.Screen name="SignUp" component={SignUpScreen} />
      <OnboardingStack.Screen name="AllSet" component={AllSetScreen} />
    </OnboardingStack.Navigator>
  );
}

function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surfaceContainerLow,
          borderTopWidth: 0,
          elevation: 0,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: fonts.sans.semiBold,
          fontSize: 10,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{
          tabBarLabel: 'TODAY',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>{'\u2022'}</Text>,
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          tabBarLabel: 'JOURNAL',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>{'\u2261'}</Text>,
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarLabel: 'SAVED',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>{'\u2605'}</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'PROFILE',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>{'\u25CB'}</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile(user?.id);

  if (authLoading || (user && profileLoading)) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const hasCompletedOnboarding =
    !!user && profile?.onboarding_intents != null;

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {hasCompletedOnboarding ? (
        <RootStack.Screen name="Main" component={MainNavigator} />
      ) : (
        <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
      )}
    </RootStack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Newsreader_400Regular,
    Newsreader_400Regular_Italic,
    Newsreader_600SemiBold,
    Newsreader_700Bold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
