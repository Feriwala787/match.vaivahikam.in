import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import type { MatchResult } from '@/lib/scoring';

interface MatchData {
  match_result: MatchResult;
  sender_username: string;
  receiver_username: string;
}

export default function MatchView() {
  const { user, username, loading: authLoading } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
    if (id && username) loadMatch();
  }, [authLoading, user, id, username]);

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

  if (loading || !data?.match_result) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const result = data.match_result;
  const radarData = Object.entries(result.dimensionScores || {}).map(([key, val]) => ({
    dimension: val.label,
    score: val.score,
  }));

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-surface-light">
        <span className="text-xl font-bold text-primary-light">🧬 Relational Blueprint</span>
        <button onClick={() => router.push('/dashboard')} className="text-sm text-text-muted hover:text-text">← Dashboard</button>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Relational Blueprint</h1>
          <p className="text-text-muted">
            @{data.sender_username} × @{data.receiver_username}
          </p>
        </div>

        {/* Overall Score */}
        <div className="bg-surface rounded-2xl p-8 border border-surface-light text-center">
          <div className={`text-6xl font-bold mb-2 ${
            result.overallScore >= 70 ? 'text-success' :
            result.overallScore >= 45 ? 'text-accent' : 'text-danger'
          }`}>
            {result.overallScore}%
          </div>
          <p className="text-text-muted">Overall Compatibility Score</p>
          {!result.dealbreakersPass && (
            <p className="text-danger mt-2 font-semibold">⚠️ Blocked by dealbreaker incompatibilities</p>
          )}
          <p className="text-sm text-text-muted mt-1">Attachment: {result.attachmentCombo}</p>
        </div>

        {/* Radar Chart */}
        {radarData.length > 0 && (
          <div className="bg-surface rounded-2xl p-6 border border-surface-light">
            <h2 className="text-lg font-semibold mb-4 text-center">Dimension Proximity Map</h2>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#25253d" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                <Radar name="Proximity" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Synergies */}
        {result.synergies.length > 0 && (
          <div className="bg-surface rounded-2xl p-6 border border-surface-light">
            <h2 className="text-lg font-semibold mb-3 text-success">✓ Synergies</h2>
            <ul className="space-y-2">
              {result.synergies.map((s, i) => (
                <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                  <span className="text-success">•</span> {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Friction Points */}
        {result.frictionPoints.length > 0 && (
          <div className="bg-surface rounded-2xl p-6 border border-surface-light">
            <h2 className="text-lg font-semibold mb-3 text-accent">⚡ Friction Points</h2>
            <ul className="space-y-2">
              {result.frictionPoints.map((f, i) => (
                <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                  <span className="text-accent">•</span> {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risk Warnings */}
        {result.riskWarnings.length > 0 && (
          <div className="bg-surface rounded-2xl p-6 border border-danger/30">
            <h2 className="text-lg font-semibold mb-3 text-danger">⚠️ Risk Warnings</h2>
            <ul className="space-y-2">
              {result.riskWarnings.map((w, i) => (
                <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                  <span className="text-danger">•</span> {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Dealbreaker Conflicts */}
        {result.dealbreakConflicts.length > 0 && (
          <div className="bg-surface rounded-2xl p-6 border border-danger/30">
            <h2 className="text-lg font-semibold mb-3 text-danger">🚫 Dealbreaker Conflicts</h2>
            <ul className="space-y-2">
              {result.dealbreakConflicts.map((c, i) => (
                <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                  <span className="text-danger">•</span> {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-center text-text-muted text-xs">
          This report is not a diagnosis. It is a data-driven starting point for deeper conversation.
          Professional premarital counseling is always recommended.
        </p>
      </main>
    </div>
  );
}
