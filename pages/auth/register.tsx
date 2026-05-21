import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import Layout from '@/components/Layout';

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const { signUp } = useAuth();
  const router = useRouter();

  async function checkUsername(name: string) {
    if (name.length < 3) { setUsernameStatus('idle'); return; }
    setUsernameStatus('checking');
    const res = await fetch(`/api/auth/check-username?username=${name.toLowerCase()}`);
    const data = await res.json();
    setUsernameStatus(data.exists ? 'taken' : 'available');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username must be 3+ characters, alphanumeric and underscores only.');
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, username.toLowerCase());
    if (error) setError(error);
    else router.push('/auth/verify');
    setLoading(false);
  }

  return (
    <Layout>
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface rounded-2xl p-8 border border-surface-light">
        <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
        <p className="text-text-muted text-sm mb-6">Begin your Relational Blueprint assessment.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-text-muted">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); checkUsername(e.target.value); }}
              className="w-full px-4 py-2 rounded-lg bg-bg border border-surface-light focus:border-primary focus:outline-none"
              placeholder="your_unique_username"
              required
            />
            {usernameStatus === 'checking' && <p className="text-text-muted text-xs mt-1">Checking...</p>}
            {usernameStatus === 'available' && <p className="text-success text-xs mt-1">✓ Available</p>}
            {usernameStatus === 'taken' && <p className="text-danger text-xs mt-1">✕ Already taken</p>}
          </div>
          <div>
            <label className="block text-sm mb-1 text-text-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-bg border border-surface-light focus:border-primary focus:outline-none"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-text-muted">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-bg border border-surface-light focus:border-primary focus:outline-none"
              placeholder="Min 6 characters"
              minLength={6}
              required
            />
          </div>

          {error && <p className="text-danger text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-text-muted text-sm mt-4">
          Already have an account? <Link href="/auth/login" className="text-primary-light hover:underline">Login</Link>
        </p>
      </div>
    </div>
    </Layout>
  );
}
