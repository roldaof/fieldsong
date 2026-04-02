import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, fonts, spacing, typography, borderRadius } from '../../config/theme';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { VerseBookmark } from '../../types';

const FREE_BOOKMARK_LIMIT = 5;

export function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const [bookmarks, setBookmarks] = useState<VerseBookmark[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const isPaid = profile?.subscription_tier !== 'free';

  const fetchBookmarks = useCallback(async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from('verse_bookmarks')
      .select('*, verse:verses(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setBookmarks(data);
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchBookmarks();
    }, [fetchBookmarks])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookmarks();
    setRefreshing(false);
  };

  const renderBookmark = ({ item }: { item: VerseBookmark }) => {
    const isExpanded = expandedId === item.id;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
        activeOpacity={0.7}
      >
        {item.verse && (
          <>
            <Text style={styles.ref}>
              Bhagavad Gita {item.verse.chapter}.{item.verse.verse_number}
            </Text>
            <Text style={styles.sanskrit}>{item.verse.sanskrit_line}</Text>
            <Text style={styles.preview} numberOfLines={isExpanded ? undefined : 2}>
              {item.verse.modern_interpretation}
            </Text>
            {isExpanded && (
              <View style={styles.expanded}>
                <Text style={styles.translation}>
                  {`\u201C${item.verse.translation}\u201D`}
                </Text>
                <Text style={styles.stoicQuote}>
                  {`\u201C${item.verse.stoic_parallel_quote}\u201D`}
                </Text>
                <Text style={styles.stoicSource}>
                  {item.verse.stoic_parallel_source}
                </Text>
              </View>
            )}
          </>
        )}
      </TouchableOpacity>
    );
  };

  const showLimitBanner = !isPaid && bookmarks.length >= FREE_BOOKMARK_LIMIT;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>fieldsong</Text>
      </View>
      {showLimitBanner && (
        <View style={styles.limitBanner}>
          <Text style={styles.limitText}>
            {FREE_BOOKMARK_LIMIT}/{FREE_BOOKMARK_LIMIT} bookmarks used. Upgrade for unlimited.
          </Text>
        </View>
      )}
      <FlatList
        data={bookmarks}
        renderItem={renderBookmark}
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
              Bookmark verses during your daily ritual to revisit them here.
            </Text>
          </View>
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
  limitBanner: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.md,
  },
  limitText: {
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
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
  ref: {
    ...typography.labelSm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  sanskrit: {
    fontFamily: fonts.serif.italic,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  preview: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  expanded: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  translation: {
    fontFamily: fonts.serif.semiBold,
    fontSize: 22,
    lineHeight: 32,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  stoicQuote: {
    fontFamily: fonts.serif.italic,
    fontSize: 18,
    lineHeight: 28,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  stoicSource: {
    ...typography.labelSm,
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
