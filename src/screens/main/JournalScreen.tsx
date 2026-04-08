import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, typography, borderRadius } from '../../config/theme';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { useSubscription } from '../../hooks/useSubscription';
import { DailyEntry } from '../../types';

export function JournalScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const { isPaid } = useSubscription();
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchEntries = useCallback(async () => {
    if (!user?.id) return;
    let query = supabase
      .from('daily_entries')
      .select('*, verse:verses(*)')
      .eq('user_id', user.id)
      .not('reflection_text', 'is', null)
      .order('created_at', { ascending: false });

    if (!isPaid) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query = query.gte('created_at', thirtyDaysAgo.toISOString());
    }

    const { data } = await query;
    if (data) setEntries(data);
  }, [user?.id, isPaid]);

  useFocusEffect(
    useCallback(() => {
      fetchEntries();
    }, [fetchEntries])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEntries();
    setRefreshing(false);
  };

  const filteredEntries = useMemo(() => {
    if (!isPaid || !searchText.trim()) return entries;
    const term = searchText.toLowerCase();
    return entries.filter(
      (e) => e.reflection_text && e.reflection_text.toLowerCase().includes(term),
    );
  }, [entries, searchText, isPaid]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderEntry = ({ item }: { item: DailyEntry }) => {
    const isExpanded = expandedId === item.id;
    return (
      <TouchableOpacity
        style={styles.entry}
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.entryDate}>{formatDate(item.created_at)}</Text>
        {item.verse && (
          <Text style={styles.entryRef}>
            Bhagavad Gita {item.verse.chapter}.{item.verse.verse_number}
          </Text>
        )}
        {item.followup_question ? (
          <Text style={styles.entryPrompt}>{item.followup_question}</Text>
        ) : null}
        <Text style={styles.entryPreview} numberOfLines={isExpanded ? undefined : 2}>
          {item.reflection_text || 'No reflection saved'}
        </Text>
        {isExpanded && item.verse && (
          <View style={styles.expandedContent}>
            <Text style={styles.expandedTranslation}>
              {`\u201C${item.verse.translation}\u201D`}
            </Text>
            <Text style={styles.expandedInterpretation}>
              {item.verse.modern_interpretation}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>fieldsong</Text>
      </View>
      {isPaid && (
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reflections..."
            placeholderTextColor={colors.textMuted}
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      )}
      <FlatList
        data={filteredEntries}
        renderItem={renderEntry}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Your reflections will appear here after your first ritual.
            </Text>
          </View>
        }
        ListFooterComponent={
          !isPaid && entries.length > 0 ? (
            <View style={styles.upgradeFooter}>
              <Text style={styles.upgradeText}>
                Upgrade to FieldSong+ for your complete journal history
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    fontFamily: fonts.serif.italic,
    fontSize: 20,
    color: colors.primary,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    height: 44,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.sans.regular,
    fontSize: 15,
    color: colors.textPrimary,
    height: 44,
    padding: 0,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['4xl'],
  },
  entry: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  entryDate: {
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  entryRef: {
    ...typography.labelSm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  entryPrompt: {
    fontFamily: fonts.serif.italic,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  entryPreview: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  expandedContent: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  expandedTranslation: {
    fontFamily: fonts.serif.semiBold,
    fontSize: 22,
    lineHeight: 32,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  expandedInterpretation: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  empty: {
    paddingVertical: spacing['5xl'],
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fonts.sans.regular,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing['3xl'],
  },
  upgradeFooter: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  upgradeText: {
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
