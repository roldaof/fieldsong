import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fonts, spacing, typography, borderRadius } from '../../config/theme';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { Journey, UserJourney, MainStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<MainStackParamList>;

export function JourneysScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [userJourneys, setUserJourneys] = useState<UserJourney[]>([]);
  const [loading, setLoading] = useState(true);

  const isPaid = profile?.subscription_tier !== 'free';

  const fetchData = useCallback(async () => {
    const { data: jData } = await supabase
      .from('journeys')
      .select('*')
      .order('id');
    if (jData) setJourneys(jData);

    if (user?.id) {
      const { data: ujData } = await supabase
        .from('user_journeys')
        .select('*')
        .eq('user_id', user.id)
        .is('completed_at', null);
      if (ujData) setUserJourneys(ujData);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const startJourney = async (journeyId: number) => {
    if (!user?.id) return;

    const existing = userJourneys.find((uj) => uj.journey_id === journeyId);
    if (existing) {
      navigation.navigate('JourneyDay', { journeyId, userJourneyId: existing.id });
      return;
    }

    const { data, error } = await supabase
      .from('user_journeys')
      .insert({ user_id: user.id, journey_id: journeyId, current_day: 1 })
      .select()
      .single();

    if (error) {
      Alert.alert('Error', 'Could not start this journey.');
      return;
    }
    if (data) {
      setUserJourneys((prev) => [...prev, data]);
      navigation.navigate('JourneyDay', { journeyId, userJourneyId: data.id });
    }
  };

  const handleJourneyTap = (journey: Journey) => {
    if (!isPaid) {
      Alert.alert('FieldSong+ Feature', 'Upgrade to FieldSong+ to start theme journeys.');
      return;
    }
    startJourney(journey.id);
  };

  const renderJourney = ({ item }: { item: Journey }) => {
    const activeUj = userJourneys.find((uj) => uj.journey_id === item.id);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleJourneyTap(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.duration_days} DAYS</Text>
          </View>
          {!isPaid && (
            <Ionicons name="lock-closed" size={16} color={colors.textMuted} />
          )}
          {activeUj && isPaid && (
            <Text style={styles.progressLabel}>
              Day {activeUj.current_day} of {item.duration_days}
            </Text>
          )}
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.subtitle && (
          <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
        )}
        {item.description && (
          <Text style={styles.cardDescription} numberOfLines={3}>
            {item.description}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Theme Journeys</Text>
        <View style={{ width: 24 }} />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={journeys}
          renderItem={renderJourney}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
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
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    fontFamily: fonts.serif.semiBold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['4xl'],
  },
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  badge: {
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    ...typography.labelSm,
    color: colors.primary,
  },
  progressLabel: {
    ...typography.labelSm,
    color: colors.primary,
  },
  cardTitle: {
    fontFamily: fonts.serif.semiBold,
    fontSize: 18,
    lineHeight: 24,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    fontFamily: fonts.sans.medium,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  cardDescription: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
});
