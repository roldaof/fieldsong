import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, spacing, typography, borderRadius } from '../../config/theme';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../hooks/useAuth';
import { DailyEntry } from '../../types';

export function JournalScreen() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEntries = useCallback(async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from('daily_entries')
      .select('*, verse:verses(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setEntries(data);
  }, [user?.id]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEntries();
    setRefreshing(false);
  };

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
            Bhagavad Gita {item.verse.chapter}.{item.verse.verse}
          </Text>
        )}
        <Text style={styles.entryPreview} numberOfLines={isExpanded ? undefined : 2}>
          {item.journal_text || 'No reflection saved'}
        </Text>
        {isExpanded && item.verse && (
          <View style={styles.expandedContent}>
            <Text style={styles.expandedTranslation}>
              {`\u201C${item.verse.translation}\u201D`}
            </Text>
            <Text style={styles.expandedInterpretation}>
              {item.verse.in_plain_terms}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Journal</Text>
      </View>
      <FlatList
        data={entries}
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
      />
    </SafeAreaView>
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
    fontFamily: fonts.serif.semiBold,
    fontSize: 28,
    color: colors.textPrimary,
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
    fontFamily: fonts.sans.semiBold,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  entryRef: {
    ...typography.labelSm,
    color: colors.primary,
    marginBottom: spacing.md,
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
    fontFamily: fonts.serif.italic,
    fontSize: 16,
    lineHeight: 26,
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
});
