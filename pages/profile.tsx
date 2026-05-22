import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import TraitRadar from '@/components/TraitRadar';
import ScoreBar from '@/components/ScoreBar';
import type { TraitScores } from '@/lib/scoring';
import Link from 'next/link';

function getAttachmentStyle(anxiety: number, avoidance: number) {
  const anxHigh = anxiety > 65;
  const avHigh = avoidance > 65;
  if (!anxHigh && !avHigh) return { style: 'Secure', color: 'bg-success/20 text-success', desc: 'Comfortable with intimacy and independence. Healthy baseline.' };
  if (anxHigh && !avHigh) return { style: 'Anxious-Preoccupied', color: 'bg-accent/20 text-accent', desc: 'Craves closeness, fears abandonment. May need extra reassurance.' };
  if (!anxHigh && avHigh) return { style: 'Dismissive-Avoidant', color: 'bg-accent/20 text-accent', desc: 'Values independence highly, may suppress emotional needs.' };
  return { style: 'Fearful-Avoidant', color: 'bg-danger/20 text-danger', desc: 'Desires closeness but fears it. May indicate unresolved relational trauma.' };
}

export default function Profile() {
  const { user } = useAuth();
  const [traits, setTraits] = useState<TraitScores | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  async function loadProfile() {
    const { data } = await supabase.from('psych_profiles').select('trait_scores').eq('user_id', user!.id).single();
    setTraits(data?.trait_scores || null);
    setLoading(false);
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          <h1 className="text-3xl font-bold text-center">Your Psychological Profile</h1>
          <p className="text-center text-text-muted text-sm">Based on 265 psychometric items across 6 validated instruments</p>

          {loading ? (
            <div className="text-center text-text-muted animate-pulse">Loading...</div>
          ) : !traits ? (
            <div className="text-center space-y-4">
              <p className="text-text-muted">You haven&apos;t completed the assessment yet.</p>
              <Link href="/assessment" className="inline-block px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition">Take Assessment</Link>
            </div>
          ) : (
            <>
              {/* Big Five Radar */}
              <TraitRadar
                title="Core Personality (Big Five)"
                data={[
                  { dimension: 'Openness', value: traits.openness },
                  { dimension: 'Conscientiousness', value: traits.conscientiousness },
                  { dimension: 'Extraversion', value: traits.extraversion },
                  { dimension: 'Agreeableness', value: traits.agreeableness },
                  { dimension: 'Emotional Stability', value: 100 - traits.neuroticism },
                ]}
              />

              <div className="bg-surface rounded-2xl p-6 border border-surface-light space-y-4">
                <h3 className="text-lg font-semibold">Personality Dimensions</h3>
                <ScoreBar label="Openness" score={traits.openness} description="Curiosity, creativity, preference for novelty" />
                <ScoreBar label="Conscientiousness" score={traits.conscientiousness} description="Organization, dependability, self-discipline" />
                <ScoreBar label="Extraversion" score={traits.extraversion} description="Sociability, assertiveness, positive energy" />
                <ScoreBar label="Agreeableness" score={traits.agreeableness} description="Cooperation, trust, empathy" />
                <ScoreBar label="Neuroticism" score={traits.neuroticism} description="Emotional instability, anxiety, moodiness" colorClass={traits.neuroticism > 65 ? 'bg-danger' : traits.neuroticism > 40 ? 'bg-accent' : 'bg-success'} />
              </div>

              {/* Attachment */}
              {(() => {
                const { style, color, desc } = getAttachmentStyle(traits.attachment_anxiety, traits.attachment_avoidance);
                return (
                  <div className="bg-surface rounded-2xl p-6 border border-surface-light">
                    <h3 className="text-lg font-semibold mb-3">Attachment Style</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>{style}</span>
                    <p className="text-text-muted text-sm mt-3 mb-4">{desc}</p>
                    <div className="space-y-3">
                      <ScoreBar label="Attachment Anxiety" score={traits.attachment_anxiety} colorClass="bg-accent" />
                      <ScoreBar label="Attachment Avoidance" score={traits.attachment_avoidance} colorClass="bg-accent" />
                    </div>
                  </div>
                );
              })()}

              {/* Emotional Intelligence */}
              <TraitRadar
                title="Emotional Intelligence"
                data={[
                  { dimension: 'Well-being', value: traits.eq_wellbeing },
                  { dimension: 'Self-Control', value: traits.eq_self_control },
                  { dimension: 'Emotionality', value: traits.eq_emotionality },
                  { dimension: 'Sociability', value: traits.eq_sociability },
                ]}
                color="#0891b2"
              />

              <div className="bg-surface rounded-2xl p-6 border border-surface-light space-y-4">
                <h3 className="text-lg font-semibold">Emotional Intelligence Breakdown</h3>
                <ScoreBar label="Well-being" score={traits.eq_wellbeing} description="Optimism, self-esteem, life satisfaction" colorClass="bg-secondary" />
                <ScoreBar label="Self-Control" score={traits.eq_self_control} description="Emotion regulation, stress management, impulse control" colorClass="bg-secondary" />
                <ScoreBar label="Emotionality" score={traits.eq_emotionality} description="Empathy, emotional perception, expression" colorClass="bg-secondary" />
                <ScoreBar label="Sociability" score={traits.eq_sociability} description="Social competence, assertiveness, influence" colorClass="bg-secondary" />
              </div>

              {/* Dark Traits */}
              <div className="bg-surface rounded-2xl p-6 border border-surface-light space-y-4">
                <h3 className="text-lg font-semibold">Protective Filter (Dark Traits)</h3>
                <p className="text-text-muted text-xs">Lower scores are healthier. Scores above 65 indicate elevated risk for manipulative dynamics.</p>
                <ScoreBar label="Machiavellianism" score={traits.machiavellianism} colorClass={traits.machiavellianism > 65 ? 'bg-danger' : traits.machiavellianism > 40 ? 'bg-accent' : 'bg-success'} />
                <ScoreBar label="Narcissism" score={traits.narcissism} colorClass={traits.narcissism > 65 ? 'bg-danger' : traits.narcissism > 40 ? 'bg-accent' : 'bg-success'} />
                <ScoreBar label="Psychopathy" score={traits.psychopathy} colorClass={traits.psychopathy > 65 ? 'bg-danger' : traits.psychopathy > 40 ? 'bg-accent' : 'bg-success'} />
              </div>

              {/* Coping */}
              <div className="bg-surface rounded-2xl p-6 border border-surface-light space-y-4">
                <h3 className="text-lg font-semibold">Coping Mechanisms</h3>
                <ScoreBar label="Active/Problem-Focused" score={traits.coping_active} description="Takes action, strategizes, reframes positively" colorClass="bg-success" />
                <ScoreBar label="Avoidant/Disengagement" score={traits.coping_avoidant} description="Denial, substance use, self-blame, giving up" colorClass={traits.coping_avoidant > 60 ? 'bg-danger' : 'bg-accent'} />
                <ScoreBar label="Support-Seeking" score={traits.coping_support} description="Reaches out for emotional/practical help" colorClass="bg-secondary" />
              </div>

              {/* Need for Cognition */}
              <div className="bg-surface rounded-2xl p-6 border border-surface-light space-y-4">
                <h3 className="text-lg font-semibold">Intellectual Match</h3>
                <ScoreBar label="Need for Cognition" score={traits.need_for_cognition} description="Enjoyment of deep thinking, complex problems, abstract ideas" colorClass="bg-primary" />
                <p className="text-text-muted text-xs mt-2">
                  {traits.need_for_cognition > 70 ? 'You strongly enjoy intellectual challenges and deep conversations.' :
                   traits.need_for_cognition > 40 ? 'You have a moderate preference for intellectual engagement.' :
                   'You prefer practical, straightforward thinking over abstract deliberation.'}
                </p>
              </div>

              <p className="text-center text-text-muted text-xs">
                Scores derived from IPIP-NEO, ECR-R, SD3, TEIQue-SF, Brief COPE, and NFC-18. Not a clinical diagnosis.
              </p>
            </>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
