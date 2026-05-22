import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';

const ADMIN_PASSWORD = 'relational2024'; // Simple password protection

export default function Admin() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function loadStats() {
    setLoading(true);
    const [usersRes, profilesRes, matchesRes, rushedRes] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('psych_profiles').select('id', { count: 'exact', head: true }),
      supabase.from('match_requests').select('id, status', { count: 'exact' }),
      supabase.from('psych_profiles').select('id', { count: 'exact', head: true }).eq('rushed', true),
    ]);

    const matches = matchesRes.data || [];
    setStats({
      totalUsers: usersRes.count || 0,
      completedAssessments: profilesRes.count || 0,
      totalMatches: matches.length,
      pendingMatches: matches.filter((m: any) => m.status === 'pending').length,
      acceptedMatches: matches.filter((m: any) => m.status === 'accepted').length,
      rejectedMatches: matches.filter((m: any) => m.status === 'rejected').length,
      rushedProfiles: rushedRes.count || 0,
    });
    setLoading(false);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      loadStats();
    } else {
      alert('Wrong password');
    }
  }

  if (!authed) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <form onSubmit={handleLogin} className="w-full max-w-sm bg-surface rounded-2xl p-8 border border-surface-light">
            <h1 className="text-xl font-bold mb-4">Admin Access</h1>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-2 rounded-lg bg-bg border border-surface-light focus:border-primary focus:outline-none mb-4"
            />
            <button type="submit" className="w-full py-2 rounded-lg bg-primary text-white font-semibold">Enter</button>
          </form>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {loading ? (
          <p className="text-text-muted animate-pulse">Loading stats...</p>
        ) : stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: '👤' },
              { label: 'Assessments Done', value: stats.completedAssessments, icon: '✅' },
              { label: 'Match Requests', value: stats.totalMatches, icon: '💌' },
              { label: 'Accepted', value: stats.acceptedMatches, icon: '💚' },
              { label: 'Pending', value: stats.pendingMatches, icon: '⏳' },
              { label: 'Rejected', value: stats.rejectedMatches, icon: '❌' },
              { label: 'Rushed Profiles', value: stats.rushedProfiles, icon: '⚡' },
              { label: 'Completion Rate', value: stats.totalUsers > 0 ? Math.round((stats.completedAssessments / stats.totalUsers) * 100) + '%' : '0%', icon: '📊' },
            ].map(stat => (
              <div key={stat.label} className="bg-surface rounded-xl p-4 border border-surface-light text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        ) : null}

        <button onClick={loadStats} className="mt-6 px-4 py-2 text-sm rounded-lg border border-surface-light text-text-muted hover:text-text">
          Refresh Stats
        </button>
      </div>
    </Layout>
  );
}
