import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing } from '../../config/theme';
import { Button } from '../../components/Button';
import { VerseCard } from '../../components/VerseCard';
import { InterpretationCard } from '../../components/InterpretationCard';
import { StoicCard } from '../../components/StoicCard';
import { ActionStep } from '../../components/ActionStep';
import { supabase } from '../../config/supabase';
import { Intent, Verse } from '../../types';

const FALLBACK_VERSE = {
  id: 0,
  chapter: 2,
  verse_number: 47,
  sanskrit_line: 'karma\u1E47y ev\u0101dhik\u0101ras te m\u0101 phale\u1E63u kad\u0101cana',
  translation:
    'Thy right is to work only, but never with its fruits; let not the fruits of actions be thy motive, nor let thy attachment be to inaction.',
  modern_interpretation:
    "This is probably the most famous verse in the Gita, and it's famous because it solves about half of your problems in one line. You get to do the work. You don't get to control the results. The second you start working for the outcome instead of the work itself, you've lost the thread.",
  stoic_parallel_quote:
    'Externals are not in my power: will is in my power. Where shall I seek the good and the bad? Within, in the things which are my own.',
  stoic_parallel_source: 'Epictetus, Discourses 2.5',
  stoic_bridge: '',
  action_step:
    "Pick one thing you've been agonizing over today. Do the part that's yours. Then put it down.",
  reflection_prompt: 'Where in your life are you frozen between two choices right now?',
};

export function FirstVerseScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const intents: Intent[] = route.params?.intents ?? [];
  const [verse, setVerse] = useState<Verse | typeof FALLBACK_VERSE | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchVerse() {
      try {
        const intent = intents.length > 0 ? intents[0] : 'clarity';
        const { data, error } = await supabase.rpc('get_next_verse', {
          p_user_id: null,
          p_intent: intent,
        });
        if (error) throw error;
        if (data && data.length > 0 && mounted) {
          setVerse(data[0]);
        } else if (mounted) {
          setVerse(FALLBACK_VERSE);
        }
      } catch {
        if (mounted) setVerse(FALLBACK_VERSE);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchVerse();
    return () => { mounted = false; };
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>fieldsong</Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : verse ? (
        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner}>
          <VerseCard
            sanskritLine={verse.sanskrit_line}
            translation={verse.translation}
            chapter={verse.chapter}
            verseNumber={verse.verse_number}
          />
          <InterpretationCard text={verse.modern_interpretation} />
          <StoicCard
            quote={verse.stoic_parallel_quote}
            source={verse.stoic_parallel_source}
            bridge={verse.stoic_bridge}
          />
          <ActionStep text={verse.action_step} />
          <Button
            title="Continue"
            onPress={() =>
              navigation.navigate('MicroReflection', {
                intents,
                verseId: verse.id,
                reflectionPrompt: verse.reflection_prompt || '',
              })
            }
            style={styles.continueButton}
          />
        </ScrollView>
      ) : null}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['4xl'],
  },
  continueButton: {
    marginTop: spacing.xl,
  },
});
