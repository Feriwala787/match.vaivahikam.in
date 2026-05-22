import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { lifestyleQuestions } from '@/lib/lifestyle-questions';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

type Answers = Record<string, string | string[]>;

const STEP_ICONS: Record<string, string> = {
  'Leisure & Entertainment': '🎬',
  'Activity & Travel': '🏃',
  'Consumption & Daily Life': '🍽️',
  'Career & Finances': '💼',
  'Geography & Family': '🌍',
  'Future & Parenting': '🚀',
  'Scenarios & Communication': '💡',
};

export default function LifestyleProfile() {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Answers | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  async function loadData() {
    const { data } = await supabase
      .from('psych_profiles')
      .select('lifestyle_answers')
      .eq('user_id', user!.id)
      .maybeSingle();
    setAnswers(data?.lifestyle_answers && Object.keys(data.lifestyle_answers).length > 0 ? data.lifestyle_answers : null);
    setLoading(false);
  }

  const categories = [...new Set(lifestyleQuestions.map(q => q.category))];

  function getVisibleForCategory(cat: string): typeof lifestyleQuestions {
    if (!answers) return [];
    return lifestyleQuestions.filter(q => {
      if (q.category !== cat) return false;
      if (!q.parentId) return true;
      const parentVal = answers[q.parentId];
      if (!parentVal) return false;
      const pv = Array.isArray(parentVal) ? parentVal[0] : parentVal;
      return q.showWhen?.includes(pv) ?? false;
    });
  }

  function renderAnswer(q: typeof lifestyleQuestions[0]) {
    const val = answers?.[q.id];
    if (!val) return null;
    if (Array.isArray(val) && val.length === 0) return null;

    return (
      <div key={q.id} className={`${q.parentId ? 'ml-4' : ''}`}>
        <p className="text-xs text-text-muted">{q.text}</p>
        {Array.isArray(val) ? (
          <div className="flex flex-wrap gap-1 mt-1">
            {val.map(v => (
              <span key={v} className="px-2 py-0.5 rounded-full text-xs bg-secondary/10 text-secondary border border-secondary/20">{v}</span>
            ))}
          </div>
        ) : (
          <p className="text-sm font-medium mt-0.5">{val}</p>
        )}
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
          <div className="text-center">
            <span className="text-4xl">🎨</span>
            <h1 className="text-2xl font-bold mt-2">Your Lifestyle Profile</h1>
            <p className="text-text-muted text-sm mt-1">Hobbies, interests, and life trajectory</p>
          </div>

          {loading ? (
            <div className="text-center text-text-muted animate-pulse">Loading...</div>
          ) : !answers ? (
            <div className="text-center space-y-4">
              <p className="text-text-muted">You haven&apos;t completed the lifestyle assessment yet.</p>
              <Link href="/assessment/lifestyle" className="inline-block px-6 py-3 rounded-lg bg-secondary text-white hover:opacity-90 transition">
                Take Lifestyle Assessment
              </Link>
            </div>
          ) : (
            <>
              {categories.map(cat => {
                const questions = getVisibleForCategory(cat);
                const answeredQs = questions.filter(q => answers[q.id]);
                if (answeredQs.length === 0) return null;

                return (
                  <div key={cat} className="bg-surface rounded-2xl p-6 border border-surface-light">
                    <h3 className="text-lg font-semibold mb-4">
                      {STEP_ICONS[cat] || '📋'} {cat}
                    </h3>
                    <div className="space-y-4">
                      {answeredQs.map(q => renderAnswer(q))}
                    </div>
                  </div>
                );
              })}

              <div className="text-center">
                <Link href="/assessment/lifestyle" className="px-5 py-2 text-sm rounded-lg border border-secondary text-secondary hover:bg-secondary/10 transition">
                  Update Lifestyle Profile
                </Link>
              </div>
            </>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
