import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth';

export default function MatchRequest() {
  const { user, username, loading: authLoading } = useAuth();
  const router = useRouter();
  const [targetUsername, setTargetUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
  }, [authLoading, user, router]);

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

    const res = await fetch('/api/match/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUsername: target }),
    });

    const data = await res.json();
    if (!res.ok) setError(data.error || 'Something went wrong.');
    else setSuccess(`Request sent to @${target}. They will see it on their dashboard.`);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface rounded-2xl p-8 border border-surface-light">
        <h1 className="text-2xl font-bold mb-2">Send Match Request</h1>
        <p className="text-text-muted text-sm mb-6">
          Enter the username of the person you&apos;d like to generate a Relational Blueprint with.
          They must accept before any data is compared.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-text-muted">Target Username</label>
            <input
              type="text"
              value={targetUsername}
              onChange={e => setTargetUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-bg border border-surface-light focus:border-primary focus:outline-none"
              placeholder="their_username"
              required
            />
          </div>

          {error && <p className="text-danger text-sm">{error}</p>}
          {success && <p className="text-success text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
