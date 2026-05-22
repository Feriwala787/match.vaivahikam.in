import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth';
import { authFetch } from '@/lib/api';
import { lifestyleQuestions, getVisibleQuestions } from '@/lib/lifestyle-questions';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

const STORAGE_KEY = 'rb_lifestyle_progress';

export default function LifestyleAssessment() {
  const { user } = useAuth();
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  // Load saved progress
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) try { setAnswers(JSON.parse(stored)); } catch {}
  }, []);

  // Auto-save
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    }
  }, [answers]);

  const visibleQuestions = getVisibleQuestions(answers);
  const answeredCount = visibleQuestions.filter(q => answers[q.id] !== undefined).length;
  const totalVisible = visibleQuestions.length;
  const allAnswered = answeredCount === totalVisible;

  function setAnswer(id: string, value: string | string[]) {
    setAnswers(prev => {
      const next = { ...prev, [id]: value };
      // Clear child answers if parent changes
      const children = lifestyleQuestions.filter(q => q.parentId === id);
      for (const child of children) { delete next[child.id]; }
      return next;
    });
  }

  function toggleMulti(id: string, option: string) {
    setAnswers(prev => {
      const current = (prev[id] as string[]) || [];
      const next = current.includes(option)
        ? current.filter(x => x !== option)
        : [...current, option].slice(0, 3); // max 3 selections
      return { ...prev, [id]: next };
    });
  }

  async function handleSubmit() {
    if (!allAnswered) return;
    setSubmitting(true);
    const res = await authFetch('/api/assessment/lifestyle', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
    if (res.ok) {
      localStorage.removeItem(STORAGE_KEY);
      router.push('/dashboard');
    } else {
      const data = await res.json();
      alert('Error: ' + (data.error || 'Unknown'));
    }
    setSubmitting(false);
  }

  // Group visible questions by category
  const categories = [...new Set(visibleQuestions.map(q => q.category))];

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-4xl">🎨</span>
            <h1 className="text-2xl font-bold mt-2">Hobbies & Lifestyle</h1>
            <p className="text-text-muted text-sm mt-1">Quick, fun questions about how you spend your time. This helps find shared interests and conversation starters.</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-xs text-text-muted">{answeredCount}/{totalVisible}</span>
              <div className="w-48 h-2 bg-surface-light rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${totalVisible > 0 ? (answeredCount / totalVisible) * 100 : 0}%` }} />
              </div>
            </div>
          </div>

          {/* Questions by category */}
          <div className="space-y-10">
            {categories.map(cat => (
              <section key={cat}>
                <h2 className="text-sm font-semibold text-secondary uppercase tracking-wide mb-4">{cat}</h2>
                <div className="space-y-5">
                  {visibleQuestions.filter(q => q.category === cat).map(q => (
                    <div key={q.id} className={`rounded-xl p-5 border transition ${
                      q.parentId ? 'bg-surface-light/50 border-surface-light ml-4' : 'bg-surface border-surface-light'
                    } ${answers[q.id] !== undefined ? 'border-secondary/30' : ''}`}>
                      <p className="font-medium text-sm mb-3">{q.text}</p>

                      {q.type === 'single' && q.options && (
                        <div className="flex flex-wrap gap-2">
                          {q.options.map(opt => (
                            <button
                              key={opt}
                              onClick={() => setAnswer(q.id, opt)}
                              className={`px-3 py-1.5 rounded-full text-xs transition border ${
                                answers[q.id] === opt
                                  ? 'bg-secondary text-white border-secondary'
                                  : 'border-surface-light text-text-muted hover:border-secondary/50 hover:text-text'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}

                      {q.type === 'multi' && q.options && (
                        <div>
                          <p className="text-xs text-text-muted mb-2">Select up to 3</p>
                          <div className="flex flex-wrap gap-2">
                            {q.options.map(opt => {
                              const selected = ((answers[q.id] as string[]) || []).includes(opt);
                              return (
                                <button
                                  key={opt}
                                  onClick={() => toggleMulti(q.id, opt)}
                                  className={`px-3 py-1.5 rounded-full text-xs transition border ${
                                    selected
                                      ? 'bg-secondary text-white border-secondary'
                                      : 'border-surface-light text-text-muted hover:border-secondary/50 hover:text-text'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {q.type === 'text' && (
                        <input
                          type="text"
                          value={(answers[q.id] as string) || ''}
                          onChange={e => setAnswer(q.id, e.target.value)}
                          placeholder="Type your answer..."
                          className="w-full px-4 py-2 rounded-lg bg-bg border border-surface-light focus:border-secondary focus:outline-none text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Submit */}
          <div className="mt-10 text-center">
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="px-8 py-3 rounded-xl bg-secondary text-white font-semibold hover:opacity-90 transition disabled:opacity-40"
            >
              {submitting ? 'Saving...' : allAnswered ? 'Save Lifestyle Profile ✓' : `Answer all questions (${totalVisible - answeredCount} remaining)`}
            </button>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
