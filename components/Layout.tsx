import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const { user, username, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="relative flex items-center justify-between px-6 py-4 border-b border-surface-light">
        <Link href="/" className="text-xl font-bold text-primary-light">🧬 Relational Blueprint</Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          {!loading && user ? (
            <>
              <Link href="/dashboard" className="text-sm text-text-muted hover:text-text transition">Dashboard</Link>
              <Link href="/profile" className="text-sm text-text-muted hover:text-text transition">Profile</Link>
              <Link href="/lifestyle" className="text-sm text-text-muted hover:text-text transition">Lifestyle</Link>
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

        {/* Mobile hamburger */}
        {!loading && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`w-5 h-0.5 bg-text transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-0.5 bg-text transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-text transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        )}

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 bg-surface border-b border-surface-light p-4 md:hidden z-50">
            {user ? (
              <div className="flex flex-col gap-3">
                <span className="text-sm text-primary-light font-medium">@{username}</span>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-sm text-text-muted hover:text-text">Dashboard</Link>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="text-sm text-text-muted hover:text-text">Profile</Link>
                <Link href="/lifestyle" onClick={() => setMenuOpen(false)} className="text-sm text-text-muted hover:text-text">Lifestyle</Link>
                <Link href="/assessment" onClick={() => setMenuOpen(false)} className="text-sm text-text-muted hover:text-text">Assessment</Link>
                <Link href="/settings" onClick={() => setMenuOpen(false)} className="text-sm text-text-muted hover:text-text">Settings</Link>
                <button onClick={() => { signOut(); setMenuOpen(false); }} className="text-sm text-danger text-left">Logout</button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="text-sm text-text-muted hover:text-text">Login</Link>
                <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="text-sm text-primary-light hover:text-text">Register</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="text-center py-6 text-text-muted text-xs border-t border-surface-light">
        <div className="flex justify-center gap-4 mb-2">
          <a href="/science" className="hover:text-text transition">The Science</a>
          <span>•</span>
          <a href="/settings" className="hover:text-text transition">Settings</a>
        </div>
        Built for human benefit, not profit. Open-source psychometrics.
      </footer>
    </div>
  );
}
