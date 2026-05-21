import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const { user, username, loading, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-surface-light">
        <Link href="/" className="text-xl font-bold text-primary-light">🧬 Relational Blueprint</Link>
        <div className="flex items-center gap-4">
          {!loading && user ? (
            <>
              <Link href="/dashboard" className="text-sm text-text-muted hover:text-text transition">Dashboard</Link>
              <Link href="/profile" className="text-sm text-text-muted hover:text-text transition">Profile</Link>
              <Link href="/settings" className="text-sm text-text-muted hover:text-text transition">Settings</Link>
              <span className="text-sm text-primary-light">@{username}</span>
              <button onClick={signOut} className="text-sm text-text-muted hover:text-danger transition">Logout</button>
            </>
          ) : !loading ? (
            <>
              <Link href="/auth/login" className="px-4 py-2 text-sm rounded-lg border border-primary text-primary hover:bg-primary/10 transition">Login</Link>
              <Link href="/auth/register" className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary-dark transition">Register</Link>
            </>
          ) : null}
        </div>
      </nav>
      <main className="flex-1">{children}</main>
      <footer className="text-center py-6 text-text-muted text-xs border-t border-surface-light">
        Built for human benefit, not profit. Open-source psychometrics.
      </footer>
    </div>
  );
}
