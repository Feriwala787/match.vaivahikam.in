import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import TraitRadar from '@/components/TraitRadar';
import ScoreBar from '@/components/ScoreBar';
import type { TraitScores } from '@/lib/scoring';
import Link from 'next/link';

const traitDescriptions: Record<string, string> = {
  openness: 'Curiosity, creativity, and preference for novelty',
  conscientiousness: 'Organization, dependability, and self-discipline',
  extraversion: 'Sociability, assertiveness, and positive emotionality',
  agreeableness: 'Cooperation, trust, and empathy toward others',
  neuroticism: 'Emotional instability, anxiety, and moodiness',
  attachment_anxiety: 'Fear of abandonment and need for reassurance',
  attachment_avoidance: 'Discomfort with closeness and emotional suppression',
  machiavellianism: 'Strategic manipulation and cynical worldview',
  narcissism: 'Grandiosity, entitlement, and need for admiration',
  psychopathy: 'Callousness, impulsivity, and lack of remorse',
  emotional_intelligence: 'Ability to perceive, manage, and regulate emotions',
  family_values: 'Importance placed on family cohesion and duty',
  gender_roles: 'Belief in egalitarian gender dynamics',
  financial_values: 'Orientation toward saving vs. spending',
  spirituality: 'Importance of religious/spiritual practice',
  autonomy: 'Value placed on personal freedom and independence',
  tradition: 'Respect for cultural customs and social reputation',
  stability: 'Preference for routine and predictability',
};

function getAttachmentStyle(anxiety: number, avoidance: number): { style: string; description: string } {
  const anxHigh = anxiety > 50;
  const avHigh = avoidance > 50;
  if (!anxHigh && !avHigh) return { style: 'Secure', description: 'Comfortable with intimacy and independence. Healthy baseline for relationships.' };
  if (anxHigh && !avHigh) return { style: 'Anxious-Preoccupied', description: 'Craves closeness, fears abandonment. May need extra reassurance from partner.' };
  if (!anxHigh && avHigh) return { style: 'Dismissive-Avoidant', description: 'Values independence highly, may suppress emotional needs.' };
  return { style: 'Fearful-Avoidant', description: 'Desires closeness but fears it. May indicate unresolved relational trauma.' };
}

export default function Profile() {
  const { user } = useAuth();
  const [traits, setTraits] = useState<TraitScores | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  async function loadProfile() {
    const { data } = await supabase
      .from('psych_profiles')
      .select('trait_scores')
      .eq('user_id', user!.id)
      .single();
    setTraits(data?.trait_scores || null);
    setLoading(false);
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          <h1 className="text-3xl font-bold text-center">Your Psychological Profile</h1>

          {loading ? (
            <div className="text-center text-text-muted animate-pulse">Loading your profile...</div>
          ) : !traits ? (
            <div className="text-center space-y-4">
              <p className="text-text-muted">You haven&apos;t completed the assessment yet.</p>
              <Link href="/assessment" className="inline-block px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition">
                Take Assessment
              </Link>
            </div>
          ) : (
            <>
              {/* Big Five Radar */}
              <TraitRadar
                title="Big Five Personality"
                data={[
                  { dimension: 'Openness', value: traits.openness },
                  { dimension: 'Conscientiousness', value: traits.conscientiousness },
                  { dimension: 'Extraversion', value: traits.extraversion },
                  { dimension: 'Agreeableness', value: traits.agreeableness },
                  { dimension: 'Emotional Stability', value: 100 - traits.neuroticism },
                ]}
              />

              {/* Big Five Bars */}
              <div className="bg-surface rounded-2xl p-6 border border-surface-light space-y-4">
                <h3 className="text-lg font-semibold">Personality Dimensions</h3>
                {(['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'] as const).map(k => (
                  <ScoreBar key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} score={traits[k]} description={traitDescriptions[k]} />
                ))}
              </div>

              {/* Attachment Style */}
              {(() => {
                const { style, description } = getAttachmentStyle(traits.attachment_anxiety, traits.attachment_avoidance);
                return (
                  <div className="bg-surface rounded-2xl p-6 border border-surface-light">
                    <h3 className="text-lg font-semibold mb-3">Attachment Style</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        style === 'Secure' ? 'bg-success/20 text-success' : 'bg-accent/20 text-accent'
                      }`}>{style}</span>
                    </div>
                    <p className="text-text-muted text-sm mb-4">{description}</p>
                    <div className="space-y-3">
                      <ScoreBar label="Attachment Anxiety" score={traits.attachment_anxiety} description={traitDescriptions.attachment_anxiety} colorClass="bg-accent" />
                      <ScoreBar label="Attachment Avoidance" score={traits.attachment_avoidance} description={traitDescriptions.attachment_avoidance} colorClass="bg-accent" />
                    </div>
                  </div>
                );
              })()}

              {/* Dark Traits */}
              <div className="bg-surface rounded-2xl p-6 border border-surface-light space-y-4">
                <h3 className="text-lg font-semibold">Interpersonal Style (Dark Traits)</h3>
                <p className="text-text-muted text-xs">Lower scores are healthier. High scores (&gt;65) indicate potential for manipulative dynamics.</p>
                {(['machiavellianism', 'narcissism', 'psychopathy'] as const).map(k => (
                  <ScoreBar key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} score={traits[k]} description={traitDescriptions[k]} colorClass={traits[k] > 65 ? 'bg-danger' : traits[k] > 40 ? 'bg-accent' : 'bg-success'} />
                ))}
              </div>

              {/* Values & EQ */}
              <TraitRadar
                title="Values & Emotional Intelligence"
                data={[
                  { dimension: 'EQ', value: traits.emotional_intelligence },
                  { dimension: 'Family', value: traits.family_values },
                  { dimension: 'Gender Equality', value: traits.gender_roles },
                  { dimension: 'Financial', value: traits.financial_values },
                  { dimension: 'Spirituality', value: traits.spirituality },
                  { dimension: 'Autonomy', value: traits.autonomy },
                  { dimension: 'Tradition', value: traits.tradition },
                  { dimension: 'Stability', value: traits.stability },
                ]}
                color="#0891b2"
              />

              <div className="bg-surface rounded-2xl p-6 border border-surface-light space-y-4">
                <h3 className="text-lg font-semibold">Values Breakdown</h3>
                {(['emotional_intelligence', 'family_values', 'gender_roles', 'financial_values', 'spirituality', 'autonomy', 'tradition', 'stability'] as const).map(k => (
                  <ScoreBar key={k} label={traitDescriptions[k]?.split('.')[0] || k} score={traits[k]} colorClass="bg-secondary" />
                ))}
              </div>

              <p className="text-center text-text-muted text-xs">
                These scores are derived from validated public-domain instruments. They are not clinical diagnoses.
              </p>
            </>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
