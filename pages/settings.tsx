import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/router';

export default function Settings() {
  const { user, username, signOut } = useAuth();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleRetakeAssessment() {
    if (!confirm('This will erase your current assessment data. Are you sure?')) return;
    await supabase.from('psych_profiles').delete().eq('user_id', user!.id);
    localStorage.removeItem('rb_assessment_progress');
    router.push('/assessment');
  }

  async function handleDeleteAccount() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    // Delete profile and user data (cascades handle the rest)
    await supabase.from('psych_profiles').delete().eq('user_id', user!.id);
    await supabase.from('users').delete().eq('id', user!.id);
    await signOut();
    router.push('/');
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          <h1 className="text-2xl font-bold">Settings</h1>

          {/* Account Info */}
          <div className="bg-surface rounded-xl p-6 border border-surface-light space-y-3">
            <h2 className="font-semibold">Account Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-muted">Username</span>
                <p className="font-medium">@{username}</p>
              </div>
              <div>
                <span className="text-text-muted">Email</span>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Assessment */}
          <div className="bg-surface rounded-xl p-6 border border-surface-light">
            <h2 className="font-semibold mb-3">Assessment</h2>
            <p className="text-text-muted text-sm mb-3">Retake the assessment if your circumstances or self-understanding have changed significantly.</p>
            <button
              onClick={handleRetakeAssessment}
              className="px-4 py-2 text-sm rounded-lg border border-accent text-accent hover:bg-accent/10 transition"
            >
              Retake Assessment
            </button>
          </div>

          {/* Privacy */}
          <div className="bg-surface rounded-xl p-6 border border-surface-light">
            <h2 className="font-semibold mb-3">Privacy & Data</h2>
            <ul className="text-sm text-text-muted space-y-2">
              <li>• Your raw answers are never shared with match partners.</li>
              <li>• Only computed compatibility scores are shown after mutual consent.</li>
              <li>• Deleting your account removes all data permanently.</li>
            </ul>
          </div>

          {/* Danger Zone */}
          <div className="bg-surface rounded-xl p-6 border border-danger/30">
            <h2 className="font-semibold text-danger mb-3">Danger Zone</h2>
            <p className="text-text-muted text-sm mb-3">Permanently delete your account and all associated data. This cannot be undone.</p>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="px-4 py-2 text-sm rounded-lg bg-danger text-white hover:opacity-90 transition disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : confirmDelete ? 'Click again to confirm deletion' : 'Delete Account'}
            </button>
            {confirmDelete && !deleting && (
              <button onClick={() => setConfirmDelete(false)} className="ml-3 text-sm text-text-muted hover:text-text">Cancel</button>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
