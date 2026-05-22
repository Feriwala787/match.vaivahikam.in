import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth';
import { authFetch } from '@/lib/api';
import { lifestyleQuestions, getVisibleQuestions, getRequiredCount } from '@/lib/lifestyle-questions';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

const STORAGE_KEY = 'rb_lifestyle_progress';
const STEPS = ['Leisure & Entertainment', 'Activity & Travel', 'Consumption & Daily Life', 'Career & Finances', 'Geography & Family', 'Future & Parenting', 'Scenarios & Communication'];

export default function LifestyleAssessment() {
  const { user } = useAuth();
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) try { setAnswers(JSON.parse(stored)); } catch {}
  }, []);

  useEffect(() => {
    if (Object.keys(answers).length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  const visibleQuestions = getVisibleQuestions(answers);
  const currentCategory = STEPS[step];
  const stepQuestions = visibleQuestions.filter(q => q.category === currentCategory);
  const { answered, total } = getRequiredCount(answers);
  const progress = total > 0 ? Math.round((answered / total) * 100) : 0;

  function setAnswer(id: string, value: string | string[]) {
    setAnswers(prev => {
      const next = { ...prev, [id]: value };
      const children = lifestyleQuestions.filter(q => q.parentId === id);
      for (const child of children) delete next[child.id];
      return next;
    });
  }

  function toggleMulti(id: string, option: string) {
    setAnswers(prev => {
      const current = (prev[id] as string[]) || [];
      const next = current.includes(option) ? current.filter(x => x !== option) : [...current, option].slice(0, 3);
      return { ...prev, [id]: next };
    });
  }

  async function handleSubmit() {
    setSubmitting(true);
    const res = await authFetch('/api/assessment/lifestyle', { method: 'POST', body: JSON.stringify({ answers }) });
    if (res.ok) { localStorage.removeItem(STORAGE_KEY); router.push('/dashboard'); }
    else { const d = await res.json(); alert(d.error || 'Error'); }
    setSubmitting(false);
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-6">
            <span className="text-4xl">🎨</span>
            <h1 className="text-2xl font-bold mt-2">Hobbies & Lifestyle</h1>
            <p className="text-text-muted text-sm mt-1">Quick, fun questions — helps find shared interests & daily compatibility.</p>
          </div>

          {/* Step tabs */}
          <div className="flex gap-1 mb-6 overflow-x-auto">
            {STEPS.map((s, i) => (
              <button key={s} onClick={() => setStep(i)} className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition ${step === i ? 'bg-secondary text-white' : 'bg-surface-light text-text-muted hover:text-text'}`}>
                {i + 1}. {s}
              </button>
            ))}
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-1.5 bg-surface-light rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs text-text-muted">{answered}/{total}</span>
          </div>

          {/* Questions */}
          <div className="space-y-5">
            {stepQuestions.map(q => (
              <div key={q.id} className={`rounded-xl p-5 border transition ${q.parentId ? 'bg-surface-light/50 border-surface-light ml-4' : 'bg-surface border-surface-light'} ${answers[q.id] !== undefined && (Array.isArray(answers[q.id]) ? (answers[q.id] as string[]).length > 0 : true) ? 'border-secondary/30' : ''}`}>
                <p className="font-medium text-sm mb-3">
                  {q.text}
                  {q.optional && <span className="text-text-muted text-xs ml-1">(Optional)</span>}
                </p>

                {q.type === 'single' && q.options && (
                  <div className="flex flex-wrap gap-2">
                    {q.options.map(opt => (
                      <button key={opt} onClick={() => setAnswer(q.id, opt)} className={`px-3 py-1.5 rounded-full text-xs transition border ${answers[q.id] === opt ? 'bg-secondary text-white border-secondary' : 'border-surface-light text-text-muted hover:border-secondary/50 hover:text-text'}`}>
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
                          <button key={opt} onClick={() => toggleMulti(q.id, opt)} className={`px-3 py-1.5 rounded-full text-xs transition border ${selected ? 'bg-secondary text-white border-secondary' : 'border-surface-light text-text-muted hover:border-secondary/50 hover:text-text'}`}>
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

                {q.type === 'rank' && q.options && (
                  <div>
                    <p className="text-xs text-text-muted mb-2">Tap to set your ranking (1 = most important)</p>
                    <div className="space-y-2">
                      {(() => {
                        const ranked = (answers[q.id] as string[]) || [];
                        const unranked = q.options!.filter(o => !ranked.includes(o));
                        return (
                          <>
                            {ranked.map((item, idx) => (
                              <div key={item} className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-secondary text-white text-xs flex items-center justify-center font-bold">{idx + 1}</span>
                                <button onClick={() => setAnswer(q.id, ranked.filter(r => r !== item))} className="flex-1 text-left px-3 py-2 rounded-lg text-xs bg-secondary/10 text-secondary border border-secondary/20">
                                  {item}
                                </button>
                              </div>
                            ))}
                            {unranked.map(item => (
                              <button key={item} onClick={() => setAnswer(q.id, [...ranked, item])} className="w-full text-left px-3 py-2 rounded-lg text-xs border border-surface-light text-text-muted hover:border-secondary/50 hover:text-text transition">
                                {item}
                              </button>
                            ))}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button onClick={() => { setStep(s => Math.max(0, s - 1)); window.scrollTo(0, 0); }} disabled={step === 0} className="px-5 py-2 rounded-lg border border-surface-light text-text-muted disabled:opacity-30 text-sm">
              ← Back
            </button>

            {step < STEPS.length - 1 ? (
              <button onClick={() => { setStep(s => s + 1); window.scrollTo(0, 0); }} className="px-5 py-2 rounded-lg bg-secondary text-white text-sm hover:opacity-90">
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2 rounded-lg bg-success text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save Lifestyle Profile ✓'}
              </button>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
