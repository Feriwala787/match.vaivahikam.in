import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { authFetch } from '@/lib/api';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface MatchRequest {
  id: string;
  sender_username: string;
  receiver_username: string;
  status: 'pending' | 'accepted' | 'rejected';
  match_result?: { overallScore: number };
  created_at: string;
}

export default function Dashboard() {
  const { user, username } = useAuth();
  const [hasProfile, setHasProfile] = useState(false);
  const [hasLifestyle, setHasLifestyle] = useState(false);
  const [incoming, setIncoming] = useState<MatchRequest[]>([]);
  const [outgoing, setOutgoing] = useState<MatchRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user && username) loadData();
  }, [user, username]);

  async function loadData() {
    setLoading(true);
    const [profileRes, incRes, outRes] = await Promise.all([
      supabase.from('psych_profiles').select('id, lifestyle_answers').eq('user_id', user!.id).maybeSingle(),
      supabase.from('match_requests').select('*').eq('receiver_username', username!).order('created_at', { ascending: false }),
      supabase.from('match_requests').select('*').eq('sender_username', username!).order('created_at', { ascending: false }),
    ]);
    setHasProfile(!!profileRes.data);
    setHasLifestyle(!!profileRes.data?.lifestyle_answers && Object.keys(profileRes.data.lifestyle_answers).length > 0);
    setIncoming(incRes.data || []);
    setOutgoing(outRes.data || []);
    setLoading(false);
  }

  async function handleAccept(requestId: string) {
    setActionLoading(requestId);
    const res = await authFetch('/api/match/accept', {
      method: 'POST',
      body: JSON.stringify({ requestId }),
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Failed to accept');
    }
    await loadData();
    setActionLoading(null);
  }

  async function handleReject(requestId: string) {
    setActionLoading(requestId);
    await supabase.from('match_requests').update({ status: 'rejected' }).eq('id', requestId);
    await loadData();
    setActionLoading(null);
  }

  const completedMatches = [...incoming, ...outgoing].filter(r => r.status === 'accepted' && r.match_result);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          {loading ? (
            <div className="text-text-muted animate-pulse">Loading...</div>
          ) : (
            <>
              {/* Assessment Status Card */}
              <div className="bg-surface rounded-xl p-6 border border-surface-light">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold mb-1">Assessment</h2>
                    {hasProfile ? (
                      <p className="text-success text-sm">✓ Completed</p>
                    ) : (
                      <p className="text-accent text-sm">⏳ Not yet completed</p>
                    )}
                  </div>
                  {hasProfile ? (
                    <Link href="/profile" className="px-4 py-2 text-sm rounded-lg border border-primary text-primary hover:bg-primary/10 transition">
                      View Profile
                    </Link>
                  ) : (
                    <Link href="/assessment" className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary-dark transition">
                      Start Now
                    </Link>
                  )}
                </div>
              </div>

              {/* Lifestyle Assessment */}
              {hasProfile && (
                <div className="bg-surface rounded-xl p-6 border border-surface-light">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold mb-1">🎨 Hobbies & Lifestyle</h2>
                      {hasLifestyle ? (
                        <p className="text-success text-sm">✓ Completed</p>
                      ) : (
                        <p className="text-text-muted text-sm">Optional — helps find shared interests & conversation starters</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {hasLifestyle && (
                        <Link href="/lifestyle" className="px-4 py-2 text-sm rounded-lg border border-secondary text-secondary hover:bg-secondary/10 transition">
                          View Profile
                        </Link>
                      )}
                      <Link href="/assessment/lifestyle" className={`px-4 py-2 text-sm rounded-lg transition ${
                        hasLifestyle ? 'border border-surface-light text-text-muted hover:text-text' : 'bg-secondary text-white hover:opacity-90'
                      }`}>
                        {hasLifestyle ? 'Update' : 'Take Now'}
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              {hasProfile && (
                <div className="bg-surface rounded-xl p-6 border border-surface-light">
                  <h2 className="font-semibold mb-3">Match Request</h2>
                  <p className="text-text-muted text-sm mb-3">Send a request to compare your blueprint with someone. Both must consent.</p>
                  <Link href="/match/request" className="inline-block px-4 py-2 text-sm rounded-lg bg-secondary text-white hover:opacity-90 transition">
                    Send New Request
                  </Link>
                </div>
              )}

              {/* Completed Matches */}
              {completedMatches.length > 0 && (
                <div className="bg-surface rounded-xl p-6 border border-surface-light">
                  <h2 className="font-semibold mb-4">Completed Blueprints</h2>
                  <div className="space-y-3">
                    {completedMatches.map(req => {
                      const partner = req.sender_username === username ? req.receiver_username : req.sender_username;
                      const score = req.match_result?.overallScore ?? 0;
                      return (
                        <Link key={req.id} href={`/match/${req.id}`} className="flex items-center justify-between p-4 rounded-lg bg-bg border border-surface-light hover:border-primary/30 transition">
                          <div>
                            <span className="font-medium">@{partner}</span>
                            <span className="ml-3 text-xs text-text-muted">{new Date(req.created_at).toLocaleDateString()}</span>
                          </div>
                          <span className={`text-lg font-bold ${score >= 70 ? 'text-success' : score >= 45 ? 'text-accent' : 'text-danger'}`}>
                            {score}%
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Incoming Requests */}
              <div className="bg-surface rounded-xl p-6 border border-surface-light">
                <h2 className="font-semibold mb-4">Incoming Requests</h2>
                {incoming.length === 0 ? (
                  <p className="text-text-muted text-sm">No incoming requests.</p>
                ) : (
                  <div className="space-y-3">
                    {incoming.map(req => (
                      <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-bg border border-surface-light">
                        <div>
                          <span className="font-medium">@{req.sender_username}</span>
                          <span className={`ml-3 text-xs px-2 py-0.5 rounded ${
                            req.status === 'pending' ? 'bg-accent/20 text-accent' :
                            req.status === 'accepted' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                          }`}>{req.status}</span>
                        </div>
                        {req.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAccept(req.id)}
                              disabled={actionLoading === req.id}
                              className="px-3 py-1 text-sm rounded bg-success text-white hover:opacity-90 disabled:opacity-50"
                            >
                              {actionLoading === req.id ? '...' : 'Accept'}
                            </button>
                            <button
                              onClick={() => handleReject(req.id)}
                              disabled={actionLoading === req.id}
                              className="px-3 py-1 text-sm rounded bg-danger text-white hover:opacity-90 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {req.status === 'accepted' && req.match_result && (
                          <Link href={`/match/${req.id}`} className="text-sm text-primary-light hover:underline">View</Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Outgoing Requests */}
              <div className="bg-surface rounded-xl p-6 border border-surface-light">
                <h2 className="font-semibold mb-4">Sent Requests</h2>
                {outgoing.length === 0 ? (
                  <p className="text-text-muted text-sm">No sent requests.</p>
                ) : (
                  <div className="space-y-3">
                    {outgoing.map(req => (
                      <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-bg border border-surface-light">
                        <div>
                          <span className="font-medium">@{req.receiver_username}</span>
                          <span className={`ml-3 text-xs px-2 py-0.5 rounded ${
                            req.status === 'pending' ? 'bg-accent/20 text-accent' :
                            req.status === 'accepted' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                          }`}>{req.status}</span>
                        </div>
                        {req.status === 'accepted' && req.match_result && (
                          <Link href={`/match/${req.id}`} className="text-sm text-primary-light hover:underline">View</Link>
                        )}
                        {req.status === 'pending' && (
                          <span className="text-xs text-text-muted">Waiting...</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
