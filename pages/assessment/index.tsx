import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { likertQuestions, dealbreakers, sections, TOTAL_QUESTIONS } from '@/lib/questions';
import { computeTraitScores } from '@/lib/scoring';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

const ITEMS_PER_PAGE = 10;
const STORAGE_KEY = 'rb_assessment_progress';

export default function Assessment() {
  const { user } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load saved progress from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAnswers(parsed.answers || {});
        setPage(parsed.page || 0);
      } catch {}
    }
  }, []);

  // Auto-save to localStorage on every answer
  const autoSave = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, page }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }, [answers, page]);

  useEffect(() => {
    if (Object.keys(answers).length > 0) autoSave();
  }, [answers, autoSave]);

  // Build ordered question list
  const allItems = [
    ...likertQuestions.map(q => ({ ...q, type: 'likert' as const })),
    ...dealbreakers.map(q => ({ ...q, type: 'dealbreaker' as const })),
  ];

  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const currentItems = allItems.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  // Current section
  let runningCount = 0;
  let currentSection = sections[0];
  for (const s of sections) {
    if (page * ITEMS_PER_PAGE < runningCount + s.count) { currentSection = s; break; }
    runningCount += s.count;
  }

  // Check if current page is fully answered
  const currentPageAnswered = currentItems.every(item => answers[item.id] !== undefined);

  function setAnswer(id: string, value: number | string) {
    setAnswers(prev => ({ ...prev, [id]: value }));
  }

  async function handleSubmit() {
    if (answeredCount < TOTAL_QUESTIONS) return;
    setSubmitting(true);

    const likertAnswers: Record<string, number> = {};
    const dealbreakAnswers: Record<string, string> = {};
    for (const [k, v] of Object.entries(answers)) {
      if (typeof v === 'number') likertAnswers[k] = v;
      else dealbreakAnswers[k] = v;
    }

    const traitScores = computeTraitScores(likertAnswers);

    const { error } = await supabase.from('psych_profiles').upsert({
      user_id: user!.id,
      raw_answers: answers,
      trait_scores: traitScores,
      dealbreaker_answers: dealbreakAnswers,
      completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    if (!error) {
      localStorage.removeItem(STORAGE_KEY);
      router.push('/profile');
    } else {
      alert('Error saving: ' + error.message);
    }
    setSubmitting(false);
  }

  function handleClearProgress() {
    if (confirm('Are you sure? This will erase all your answers.')) {
      localStorage.removeItem(STORAGE_KEY);
      setAnswers({});
      setPage(0);
    }
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex flex-col min-h-[calc(100vh-130px)]">
          {/* Progress bar */}
          <div className="sticky top-0 z-10 bg-bg/95 backdrop-blur border-b border-surface-light px-6 py-3">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-primary-light">{currentSection.label}</span>
                <div className="flex items-center gap-3">
                  {saved && <span className="text-xs text-success animate-pulse">✓ Saved</span>}
                  <span className="text-sm text-text-muted">{answeredCount}/{TOTAL_QUESTIONS} ({progress}%)</span>
                </div>
              </div>
              <div className="w-full h-2 bg-surface-light rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-text-muted">Page {page + 1} of {totalPages}</span>
                <button onClick={handleClearProgress} className="text-xs text-text-muted hover:text-danger transition">Reset All</button>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
            <div className="space-y-6">
              {currentItems.map((item, idx) => (
                <div key={item.id} className={`bg-surface rounded-xl p-6 border transition ${
                  answers[item.id] !== undefined ? 'border-primary/30' : 'border-surface-light'
                }`}>
                  <p className="font-medium mb-4">
                    <span className="text-text-muted text-sm mr-2">Q{page * ITEMS_PER_PAGE + idx + 1}.</span>
                    {item.text}
                  </p>

                  {item.type === 'likert' ? (
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { val: 1, label: 'Strongly Disagree', short: 'SD' },
                        { val: 2, label: 'Disagree', short: 'D' },
                        { val: 3, label: 'Neutral', short: 'N' },
                        { val: 4, label: 'Agree', short: 'A' },
                        { val: 5, label: 'Strongly Agree', short: 'SA' },
                      ].map(opt => (
                        <button
                          key={opt.val}
                          onClick={() => setAnswer(item.id, opt.val)}
                          title={opt.label}
                          className={`py-2 px-1 rounded-lg text-xs sm:text-sm transition border ${
                            answers[item.id] === opt.val
                              ? 'bg-primary text-white border-primary'
                              : 'border-surface-light hover:border-primary/50 text-text-muted hover:text-text'
                          }`}
                        >
                          <span className="hidden sm:inline">{opt.label}</span>
                          <span className="sm:hidden">{opt.short}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {'options' in item && item.options.map((opt: string) => (
                        <button
                          key={opt}
                          onClick={() => setAnswer(item.id, opt)}
                          className={`py-2 px-4 rounded-lg text-sm transition border text-left ${
                            answers[item.id] === opt
                              ? 'bg-primary text-white border-primary'
                              : 'border-surface-light hover:border-primary/50 text-text-muted hover:text-text'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pb-8">
              <button
                onClick={() => { setPage(p => Math.max(0, p - 1)); window.scrollTo(0, 0); }}
                disabled={page === 0}
                className="px-6 py-2 rounded-lg border border-surface-light text-text-muted hover:text-text disabled:opacity-30 transition"
              >
                ← Previous
              </button>

              <span className="text-sm text-text-muted">{page + 1} / {totalPages}</span>

              {page < totalPages - 1 ? (
                <button
                  onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}
                  className={`px-6 py-2 rounded-lg transition ${
                    currentPageAnswered
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'border border-surface-light text-text-muted hover:text-text'
                  }`}
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={answeredCount < TOTAL_QUESTIONS || submitting}
                  className="px-6 py-3 rounded-lg bg-success text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : `Submit (${TOTAL_QUESTIONS - answeredCount} remaining)`}
                </button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
