import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import TraitRadar from '@/components/TraitRadar';
import ScoreBar from '@/components/ScoreBar';
import type { MatchResult } from '@/lib/scoring';
import type { LifestyleResult } from '@/lib/lifestyle-scoring';

interface MatchData {
  match_result: MatchResult & { lifestyle?: LifestyleResult | null };
  sender_username: string;
  receiver_username: string;
}

export default function MatchView() {
  const { user, username } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && username) loadMatch();
  }, [id, username]);

  async function loadMatch() {
    const { data: match } = await supabase
      .from('match_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (!match || (match.sender_username !== username && match.receiver_username !== username)) {
      router.push('/dashboard');
      return;
    }
    setData(match);
    setLoading(false);
  }

  if (loading) return (
    <ProtectedRoute>
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh] text-text-muted animate-pulse">Loading blueprint...</div>
      </Layout>
    </ProtectedRoute>
  );

  if (!data?.match_result) return (
    <ProtectedRoute>
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh] text-text-muted">No match data available.</div>
      </Layout>
    </ProtectedRoute>
  );

  const result = data.match_result;
  const partner = data.sender_username === username ? data.receiver_username : data.sender_username;

  const radarData = Object.entries(result.dimensionScores || {}).map(([, val]) => ({
    dimension: val.label.length > 15 ? val.label.slice(0, 15) + '…' : val.label,
    value: val.score,
  }));

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Relational Blueprint</h1>
            <p className="text-text-muted">@{data.sender_username} × @{data.receiver_username}</p>
          </div>

          {/* Overall Score */}
          <div className="bg-surface rounded-2xl p-8 border border-surface-light text-center">
            <div className={`text-7xl font-bold mb-2 ${
              result.overallScore >= 70 ? 'text-success' :
              result.overallScore >= 45 ? 'text-accent' : 'text-danger'
            }`}>
              {result.overallScore}%
            </div>
            <p className="text-text-muted text-lg">Overall Compatibility</p>
            {!result.dealbreakersPass && (
              <div className="mt-4 px-4 py-2 rounded-lg bg-danger/10 border border-danger/30 inline-block">
                <p className="text-danger font-semibold">⚠️ Blocked by fundamental incompatibilities</p>
              </div>
            )}
            <div className="mt-3 flex justify-center gap-4 text-sm text-text-muted">
              <span>Attachment: <span className="text-text">{result.attachmentCombo}</span></span>
            </div>
          </div>

          {/* Category Scores */}
          {result.categoryScores && (
            <div className="bg-surface rounded-2xl p-6 border border-surface-light">
              <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Personality Match', score: result.categoryScores.personality, icon: '🧠' },
                  { label: 'Emotional Intelligence', score: result.categoryScores.emotionalIntelligence, icon: '💚' },
                  { label: 'Coping Compatibility', score: result.categoryScores.copingCompatibility, icon: '🛡️' },
                  { label: 'Intellectual Match', score: result.categoryScores.intellectualMatch, icon: '📚' },
                  ...(result.categoryScores.secureBonus > 0 ? [{ label: 'Secure Attachment Bonus', score: result.categoryScores.secureBonus, icon: '💞' }] : []),
                ].map(cat => (
                  <div key={cat.label} className="flex items-center gap-3 p-3 rounded-lg bg-bg border border-surface-light">
                    <span className="text-2xl">{cat.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span>{cat.label}</span>
                        <span className={`font-bold ${
                          cat.score >= 70 ? 'text-success' : cat.score >= 45 ? 'text-accent' : 'text-danger'
                        }`}>{cat.score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-light rounded-full mt-1 overflow-hidden">
                        <div className={`h-full rounded-full ${
                          cat.score >= 70 ? 'bg-success' : cat.score >= 45 ? 'bg-accent' : 'bg-danger'
                        }`} style={{ width: `${cat.score}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dimension Radar */}
          {radarData.length > 0 && (
            <TraitRadar title="Dimension Proximity Map" data={radarData} />
          )}

          {/* Dimension Breakdown */}
          {Object.keys(result.dimensionScores || {}).length > 0 && (
            <div className="bg-surface rounded-2xl p-6 border border-surface-light space-y-4">
              <h3 className="text-lg font-semibold">Dimension Scores</h3>
              {Object.entries(result.dimensionScores).map(([key, val]) => (
                <ScoreBar key={key} label={val.label} score={val.score} />
              ))}
            </div>
          )}

          {/* Synergies */}
          {result.synergies.length > 0 && (
            <div className="bg-surface rounded-2xl p-6 border border-success/20">
              <h3 className="text-lg font-semibold mb-3 text-success">✓ Synergies — Areas of Strong Alignment</h3>
              <ul className="space-y-2">
                {result.synergies.map((s, i) => (
                  <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                    <span className="text-success mt-0.5">●</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Friction Points */}
          {result.frictionPoints.length > 0 && (
            <div className="bg-surface rounded-2xl p-6 border border-accent/20">
              <h3 className="text-lg font-semibold mb-3 text-accent">⚡ Friction Points — Areas Needing Discussion</h3>
              <ul className="space-y-2">
                {result.frictionPoints.map((f, i) => (
                  <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                    <span className="text-accent mt-0.5">●</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risk Warnings */}
          {result.riskWarnings.length > 0 && (
            <div className="bg-surface rounded-2xl p-6 border border-danger/30">
              <h3 className="text-lg font-semibold mb-3 text-danger">⚠️ Risk Warnings</h3>
              <ul className="space-y-3">
                {result.riskWarnings.map((w, i) => (
                  <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                    <span className="text-danger mt-0.5">●</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dealbreaker Conflicts */}
          {result.dealbreakConflicts.length > 0 && (
            <div className="bg-surface rounded-2xl p-6 border border-danger/50">
              <h3 className="text-lg font-semibold mb-3 text-danger">🚫 Dealbreaker Conflicts</h3>
              <p className="text-sm text-text-muted mb-3">These are non-negotiable incompatibilities that cannot be resolved through compromise.</p>
              <ul className="space-y-2">
                {result.dealbreakConflicts.map((c, i) => (
                  <li key={i} className="text-sm font-medium text-danger flex items-start gap-2">
                    <span>✕</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Lifestyle & Hobbies */}
          {result.lifestyle && (
            <div className="bg-surface rounded-2xl p-6 border border-secondary/20 space-y-5">
              <h3 className="text-lg font-semibold">🎨 Lifestyle Alignment — <span className={`${
                result.lifestyle.overallScore >= 60 ? 'text-success' : result.lifestyle.overallScore >= 40 ? 'text-accent' : 'text-danger'
              }`}>{result.lifestyle.overallScore}%</span></h3>

              {/* Hard Gate Flags */}
              {result.lifestyle.hardGateFlags.length > 0 && (
                <div className="p-3 rounded-lg bg-danger/10 border border-danger/30">
                  <h4 className="text-sm font-semibold text-danger mb-2">🚫 Lifestyle Dealbreakers</h4>
                  {result.lifestyle.hardGateFlags.map((f, i) => (
                    <p key={i} className="text-xs text-text-muted">• {f}</p>
                  ))}
                </div>
              )}

              {/* Friction Penalties */}
              {result.lifestyle.frictionPenalties.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-accent mb-2">⚡ Daily Friction Points</h4>
                  {result.lifestyle.frictionPenalties.map((f, i) => (
                    <p key={i} className="text-xs text-text-muted mb-1">• {f}</p>
                  ))}
                </div>
              )}

              {/* Shared Vibe Tags */}
              {result.lifestyle.sharedVibeTags.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-success mb-2">✓ Shared Vibes</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.lifestyle.sharedVibeTags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs bg-success/10 text-success border border-success/20">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Conversation Hooks */}
              {result.lifestyle.conversationHooks.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-secondary mb-2">💬 Conversation Starters</h4>
                  {result.lifestyle.conversationHooks.map((h, i) => (
                    <p key={i} className="text-xs text-text-muted mb-1">• {h}</p>
                  ))}
                </div>
              )}

              {/* Icebreaker Table */}
              {result.lifestyle.icebreakerTable.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3">🧠 Icebreaker Cheat Sheet</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-surface-light">
                          <th className="text-left py-2 text-text-muted font-normal">Category</th>
                          <th className="text-left py-2 text-text-muted font-normal">@{data.sender_username}</th>
                          <th className="text-left py-2 text-text-muted font-normal">@{data.receiver_username}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.lifestyle.icebreakerTable.map((row, i) => (
                          <tr key={i} className="border-b border-surface-light/50">
                            <td className="py-2">{row.icon} {row.category}</td>
                            <td className="py-2 text-text-muted">{row.userA}</td>
                            <td className="py-2 text-text-muted">{row.userB}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Love Languages */}
              {result.lifestyle.loveLanguages && (
                <div className="p-4 rounded-lg bg-bg border border-surface-light">
                  <h4 className="text-sm font-semibold mb-3">💕 Love Languages</h4>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-text-muted mb-1">@{data.sender_username}&apos;s top:</p>
                      {result.lifestyle.loveLanguages.userA.map((l, i) => (
                        <p key={i} className="text-xs">{i + 1}. {l.split('(')[0].trim()}</p>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-1">@{data.receiver_username}&apos;s top:</p>
                      {result.lifestyle.loveLanguages.userB.map((l, i) => (
                        <p key={i} className="text-xs">{i + 1}. {l.split('(')[0].trim()}</p>
                      ))}
                    </div>
                  </div>
                  {result.lifestyle.loveLanguages.tip && (
                    <p className="text-xs text-secondary bg-secondary/5 p-2 rounded">💡 {result.lifestyle.loveLanguages.tip}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-surface-light rounded-xl p-4 text-center">
            <p className="text-text-muted text-xs">
              This report is generated from validated public-domain psychometric instruments.
              It is not a clinical diagnosis and should not replace professional premarital counseling.
              Use this as a starting point for deeper, honest conversation.
            </p>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
