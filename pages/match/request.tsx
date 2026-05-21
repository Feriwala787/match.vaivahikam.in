import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth';
import { authFetch } from '@/lib/api';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function MatchRequest() {
  const { username } = useAuth();
  const router = useRouter();
  const [targetUsername, setTargetUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const target = targetUsername.toLowerCase().trim();
    if (target === username) {
      setError("You can't send a request to yourself.");
      setLoading(false);
      return;
    }

    const res = await authFetch('/api/match/request', {
      method: 'POST',
      body: JSON.stringify({ targetUsername: target }),
    });

    const data = await res.json();
    if (!res.ok) setError(data.error || 'Something went wrong.');
    else {
      setSuccess(`Request sent to @${target}. They must accept before any data is compared.`);
      setTargetUsername('');
    }
    setLoading(false);
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-surface rounded-2xl p-8 border border-surface-light">
            <h1 className="text-2xl font-bold mb-2">Send Match Request</h1>
            <p className="text-text-muted text-sm mb-6">
              Enter the username of the person you&apos;d like to generate a Relational Blueprint with.
              No data is shared until both parties consent.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-text-muted">Their Username</label>
                <div className="flex items-center">
                  <span className="text-text-muted mr-1">@</span>
                  <input
                    type="text"
                    value={targetUsername}
                    onChange={e => setTargetUsername(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg bg-bg border border-surface-light focus:border-primary focus:outline-none"
                    placeholder="their_username"
                    required
                  />
                </div>
              </div>

              {error && <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">{error}</div>}
              {success && <div className="p-3 rounded-lg bg-success/10 border border-success/30 text-success text-sm">{success}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Request'}
              </button>
            </form>

            <button onClick={() => router.push('/dashboard')} className="w-full mt-3 py-2 text-sm text-text-muted hover:text-text transition">
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
