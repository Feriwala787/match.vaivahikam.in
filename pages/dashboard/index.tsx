import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface MatchRequest {
  id: string;
  sender_username: string;
  receiver_username: string;
  status: 'pending' | 'accepted' | 'rejected';
  match_result?: any;
  created_at: string;
}

export default function Dashboard() {
  const { user, username, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState(false);
  const [incoming, setIncoming] = useState<MatchRequest[]>([]);
  const [outgoing, setOutgoing] = useState<MatchRequest[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
    if (user && username) loadData();
  }, [authLoading, user, username]);

  async function loadData() {
    setLoadingData(true);
    const { data: profile } = await supabase
      .from('psych_profiles')
      .select('id')
      .eq('user_id', user!.id)
      .single();
    setHasProfile(!!profile);

    const { data: inc } = await supabase
      .from('match_requests')
      .select('*')
      .eq('receiver_username', username!)
      .order('created_at', { ascending: false });
    setIncoming(inc || []);

    const { data: out } = await supabase
      .from('match_requests')
      .select('*')
      .eq('sender_username', username!)
      .order('created_at', { ascending: false });
    setOutgoing(out || []);

    setLoadingData(false);
  }

  async function handleAccept(requestId: string) {
    await fetch('/api/match/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId }),
    });
    loadData();
  }

  async function handleReject(requestId: string) {
    await supabase.from('match_requests').update({ status: 'rejected' }).eq('id', requestId);
    loadData();
  }

  if (authLoading || loadingData) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-surface-light">
        <Link href="/" className="text-xl font-bold text-primary-light">🧬 Relational Blueprint</Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-muted">@{username}</span>
          <button onClick={signOut} className="text-sm text-text-muted hover:text-danger transition">Logout</button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Assessment Status */}
        <section className="bg-surface rounded-xl p-6 border border-surface-light">
          <h2 className="text-lg font-semibold mb-2">Assessment Status</h2>
          {hasProfile ? (
            <p className="text-success">✓ Assessment completed. You can now send and receive match requests.</p>
          ) : (
            <div>
              <p className="text-text-muted mb-3">You haven&apos;t completed the assessment yet.</p>
              <Link href="/assessment" className="px-4 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary-dark transition">
                Start Assessment
              </Link>
            </div>
          )}
        </section>

        {/* Send Match Request */}
        {hasProfile && (
          <section className="bg-surface rounded-xl p-6 border border-surface-light">
            <h2 className="text-lg font-semibold mb-2">Send Match Request</h2>
            <p className="text-text-muted text-sm mb-3">Enter the username of the person you&apos;d like to compare with. They must also have completed the assessment.</p>
            <Link href="/match/request" className="px-4 py-2 rounded-lg bg-secondary text-white text-sm hover:opacity-90 transition">
              Send Request
            </Link>
          </section>
        )}

        {/* Incoming Requests */}
        <section className="bg-surface rounded-xl p-6 border border-surface-light">
          <h2 className="text-lg font-semibold mb-4">Incoming Requests</h2>
          {incoming.length === 0 ? (
            <p className="text-text-muted text-sm">No incoming requests yet.</p>
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
                      <button onClick={() => handleAccept(req.id)} className="px-3 py-1 text-sm rounded bg-success text-white hover:opacity-90">Accept</button>
                      <button onClick={() => handleReject(req.id)} className="px-3 py-1 text-sm rounded bg-danger text-white hover:opacity-90">Reject</button>
                    </div>
                  )}
                  {req.status === 'accepted' && req.match_result && (
                    <Link href={`/match/${req.id}`} className="text-sm text-primary-light hover:underline">View Blueprint</Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Outgoing Requests */}
        <section className="bg-surface rounded-xl p-6 border border-surface-light">
          <h2 className="text-lg font-semibold mb-4">Sent Requests</h2>
          {outgoing.length === 0 ? (
            <p className="text-text-muted text-sm">You haven&apos;t sent any requests yet.</p>
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
                    <Link href={`/match/${req.id}`} className="text-sm text-primary-light hover:underline">View Blueprint</Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
