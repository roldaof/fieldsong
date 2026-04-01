import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing, typography, borderRadius } from '../../config/theme';
import { Button } from '../../components/Button';
import { VerseCard } from '../../components/VerseCard';
import { ActionStep } from '../../components/ActionStep';
import { supabase } from '../../config/supabase';
import { Intent, Verse } from '../../types';

const MAX_LENGTH = 280;

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

function AccordionSection({
  label,
  expanded,
  onToggle,
  children,
}: {
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.accordionLabel}>{label}</Text>
        <Text style={styles.accordionChevron}>{expanded ? '▴' : '▾'}</Text>
      </TouchableOpacity>
      {expanded && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
}

export function FirstVerseScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const intents: Intent[] = route.params?.intents ?? [];
  const [verse, setVerse] = useState<Verse | typeof FALLBACK_VERSE | null>(null);
  const [loading, setLoading] = useState(true);
  const [interpretationOpen, setInterpretationOpen] = useState(false);
  const [stoicOpen, setStoicOpen] = useState(false);
  const [reflectionText, setReflectionText] = useState('');

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

  const toggleInterpretation = () => {
    
    setInterpretationOpen((prev) => !prev);
  };

  const toggleStoic = () => {
    
    setStoicOpen((prev) => !prev);
  };

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
        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollInner}
          keyboardShouldPersistTaps="handled"
        >
          <VerseCard
            sanskritLine={verse.sanskrit_line}
            translation={verse.translation}
            chapter={verse.chapter}
            verseNumber={verse.verse_number}
          />

          <AccordionSection
            label="IN PLAIN TERMS"
            expanded={interpretationOpen}
            onToggle={toggleInterpretation}
          >
            <Text style={styles.interpretationBody}>
              {verse.modern_interpretation}
            </Text>
          </AccordionSection>

          <AccordionSection
            label="STOIC PARALLEL"
            expanded={stoicOpen}
            onToggle={toggleStoic}
          >
            <Text style={styles.stoicQuote}>
              {`\u201C${verse.stoic_parallel_quote}\u201D`}
            </Text>
            <Text style={styles.stoicSource}>{verse.stoic_parallel_source}</Text>
            <Text style={styles.stoicBridge}>{verse.stoic_bridge}</Text>
          </AccordionSection>

          <ActionStep text={verse.action_step} />

          <View style={styles.reflectionCard}>
            <Text style={styles.reflectionLabel}>REFLECT</Text>
            <Text style={styles.reflectionPrompt}>
              {verse.reflection_prompt || 'Where in your life are you frozen between two choices right now?'}
            </Text>
            <TextInput
              style={styles.reflectionInput}
              multiline
              maxLength={MAX_LENGTH}
              value={reflectionText}
              onChangeText={setReflectionText}
              placeholder="Write your thoughts here..."
              placeholderTextColor={colors.textMuted}
              textAlignVertical="top"
              autoCorrect={true}
              scrollEnabled={false}
              blurOnSubmit={false}
            />
            <Text style={styles.charCount}>
              {reflectionText.length}/{MAX_LENGTH}
            </Text>
          </View>
          <Text style={styles.privacyNote}>Your reflections are private. Always.</Text>

          <Button
            title="Continue"
            onPress={() =>
              navigation.navigate('SignUp', {
                intents,
                reflectionText: reflectionText.trim(),
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

  // Accordion
  accordionContainer: {
    marginVertical: spacing.md,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  accordionLabel: {
    ...typography.labelMd,
    color: colors.primary,
  },
  accordionChevron: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  accordionContent: {
    padding: spacing.lg,
  },

  // Interpretation content
  interpretationBody: {
    fontFamily: fonts.sans.regular,
    fontSize: 16,
    lineHeight: 26,
    color: colors.textPrimary,
  },

  // Stoic content
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
    marginBottom: spacing.lg,
  },
  stoicBridge: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },

  // Reflection
  reflectionCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginTop: spacing.md,
  },
  reflectionLabel: {
    ...typography.labelMd,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  reflectionPrompt: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  reflectionInput: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    minHeight: 80,
  },
  charCount: {
    fontFamily: fonts.sans.regular,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
  },
  privacyNote: {
    fontFamily: fonts.sans.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },

  continueButton: {
    marginTop: spacing.xl,
  },
});
