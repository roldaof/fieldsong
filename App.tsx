import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Linking from 'expo-linking';
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
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { OfflineBanner } from './src/components/OfflineBanner';
import { SubscriptionProvider, useSubscription } from './src/hooks/useSubscription';

import { WelcomeScreen } from './src/screens/onboarding/WelcomeScreen';
import { IntentQuizScreen } from './src/screens/onboarding/IntentQuizScreen';
import { MirrorScreen } from './src/screens/onboarding/MirrorScreen';
import { FirstVerseScreen } from './src/screens/onboarding/FirstVerseScreen';
import { ReviewPromptScreen } from './src/screens/onboarding/ReviewPromptScreen';
import { SignUpScreen } from './src/screens/onboarding/SignUpScreen';
import { PaywallScreen } from './src/screens/onboarding/PaywallScreen';

import { TodayScreen } from './src/screens/main/TodayScreen';
import { JournalScreen } from './src/screens/main/JournalScreen';
import { SavedScreen } from './src/screens/main/SavedScreen';
import { ProfileScreen } from './src/screens/main/ProfileScreen';
import { JourneysScreen } from './src/screens/main/JourneysScreen';
import { JourneyDayScreen } from './src/screens/main/JourneyDayScreen';

const linking: LinkingOptions<{}> = {
  prefixes: [Linking.createURL('/'), 'fieldsong://', 'https://fieldsong.app'],
  config: {
    screens: {
      Main: {
        screens: {
          Tabs: {
            screens: {
              Today: 'today',
              Journal: 'journal',
              Saved: 'saved',
              Profile: 'profile',
            },
          },
          Journeys: 'journeys',
        },
      },
    },
  },
};

const sentryDsn = Constants.expoConfig?.extra?.sentryDsn as string;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    tracesSampleRate: 0.2,
  });
}

const RootStack = createNativeStackNavigator();
const OnboardingStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
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
      <OnboardingStack.Screen name="Mirror" component={MirrorScreen} />
      <OnboardingStack.Screen name="FirstVerse" component={FirstVerseScreen} />
      <OnboardingStack.Screen name="ReviewPrompt" component={ReviewPromptScreen} />
      <OnboardingStack.Screen name="SignUp" component={SignUpScreen} />
      <OnboardingStack.Screen name="Paywall" component={PaywallScreen} />
    </OnboardingStack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.surfaceContainerLow,
          borderTopWidth: 0,
          elevation: 0,
          paddingTop: 10,
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
          tabBarIcon: ({ color, size }) => <Ionicons name="sunny-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          tabBarLabel: 'JOURNAL',
          tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarLabel: 'SAVED',
          tabBarIcon: ({ color, size }) => <Ionicons name="bookmark-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'PROFILE',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function MainNavigator() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface },
      }}
    >
      <MainStack.Screen name="Tabs" component={TabNavigator} />
      <MainStack.Screen name="Journeys" component={JourneysScreen} />
      <MainStack.Screen name="JourneyDay" component={JourneyDayScreen} />
    </MainStack.Navigator>
  );
}

function RootNavigator() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile(user?.id);
  const { identify } = useSubscription();

  // Identify user with RevenueCat when authenticated
  useEffect(() => {
    if (user?.id) {
      identify(user.id);
    }
  }, [user?.id, identify]);

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

function App() {
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
      <ErrorBoundary>
        <AuthProvider>
          <SubscriptionProvider>
            <NavigationContainer linking={linking}>
              <StatusBar style="light" />
              <OfflineBanner />
              <RootNavigator />
            </NavigationContainer>
          </SubscriptionProvider>
        </AuthProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

export default Sentry.wrap(App);

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
