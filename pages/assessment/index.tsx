import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth';
import { authFetch } from '@/lib/api';
import { likertQuestions, dealbreakers, sections, TOTAL_QUESTIONS } from '@/lib/questions';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

const ITEMS_PER_PAGE = 10;
const STORAGE_KEY = 'rb_assessment_progress';
const TIME_KEY = 'rb_assessment_start_time';

export default function Assessment() {
  const { user } = useAuth();
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load saved progress
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAnswers(parsed.answers || {});
        setPage(parsed.page || 0);
        setAgreed(true); // If they have progress, they already agreed
      } catch {}
    }
  }, []);

  // Track start time
  useEffect(() => {
    if (agreed && !localStorage.getItem(TIME_KEY)) {
      localStorage.setItem(TIME_KEY, Date.now().toString());
    }
  }, [agreed]);

  // Auto-save
  const autoSave = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, page }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }, [answers, page]);

  useEffect(() => {
    if (Object.keys(answers).length > 0) autoSave();
  }, [answers, autoSave]);

  // Build question list
  const allItems = [
    ...likertQuestions.map(q => ({ ...q, type: 'likert' as const })),
    ...dealbreakers.map(q => ({ ...q, type: 'dealbreaker' as const })),
  ];

  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const currentItems = allItems.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  let runningCount = 0;
  let currentSection = sections[0];
  for (const s of sections) {
    if (page * ITEMS_PER_PAGE < runningCount + s.count) { currentSection = s; break; }
    runningCount += s.count;
  }

  const currentPageAnswered = currentItems.every(item => answers[item.id] !== undefined);

  function setAnswer(id: string, value: number | string) {
    setAnswers(prev => ({ ...prev, [id]: value }));
  }

  async function handleSubmit() {
    if (answeredCount < TOTAL_QUESTIONS) return;
    setSubmitting(true);

    // Calculate time spent
    const startTime = parseInt(localStorage.getItem(TIME_KEY) || '0');
    const minutesSpent = startTime ? Math.round((Date.now() - startTime) / 60000) : 0;
    const rushed = minutesSpent < 15; // Less than 15 min for 265 items = suspicious

    const res = await authFetch('/api/assessment/submit', {
      method: 'POST',
      body: JSON.stringify({ answers, minutesSpent, rushed }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TIME_KEY);
      router.push('/profile');
    } else {
      alert('Error saving: ' + (data.error || 'Unknown error'));
    }
    setSubmitting(false);
  }

  function handleClearProgress() {
    if (confirm('Are you sure? This will erase all your answers.')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TIME_KEY);
      setAnswers({});
      setPage(0);
    }
  }

  // ═══ INSTRUCTIONS SCREEN ═══
  if (!agreed) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <span className="text-5xl">🧬</span>
              <h1 className="text-2xl font-bold mt-3">Psychological Assessment</h1>
              <p className="text-text-muted text-sm mt-2">265 questions • ~60-90 minutes • Auto-saves your progress</p>
            </div>

            <div className="bg-surface rounded-2xl p-6 border border-surface-light space-y-6">
              <div>
                <h2 className="font-semibold mb-3">📋 How This Works</h2>
                <p className="text-sm text-text-muted">You will see statements about yourself. For each one, choose how much you agree or disagree. There are no right or wrong answers — just be honest about who you actually are, not who you wish you were.</p>
              </div>

              <div>
                <h2 className="font-semibold mb-3">🎯 What the Options Mean</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3 items-start">
                    <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-bold whitespace-nowrap">SD</span>
                    <div>
                      <span className="font-medium">Strongly Disagree</span>
                      <p className="text-text-muted">This is completely NOT me. Example: If the statement is "I love parties" and you hate them → SD</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-bold whitespace-nowrap">D</span>
                    <div>
                      <span className="font-medium">Disagree</span>
                      <p className="text-text-muted">Mostly not me, but not extreme. Example: "I love parties" → you don&apos;t enjoy them much → D</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-bold whitespace-nowrap">N</span>
                    <div>
                      <span className="font-medium">Neutral</span>
                      <p className="text-text-muted">I&apos;m in the middle / it depends / I&apos;m not sure. Use sparingly — try to lean one way.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-bold whitespace-nowrap">A</span>
                    <div>
                      <span className="font-medium">Agree</span>
                      <p className="text-text-muted">Mostly true for me. Example: "I love parties" → you generally enjoy them → A</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-bold whitespace-nowrap">SA</span>
                    <div>
                      <span className="font-medium">Strongly Agree</span>
                      <p className="text-text-muted">This is 100% me. Example: "I love parties" and you&apos;re the life of every party → SA</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-semibold mb-3">⚠️ Important Guidelines</h2>
                <ul className="text-sm text-text-muted space-y-2">
                  <li>• <span className="text-text">Be honest, not aspirational.</span> Answer as you ARE, not as you want to be.</li>
                  <li>• <span className="text-text">Don&apos;t overthink.</span> Your first instinct is usually the most accurate.</li>
                  <li>• <span className="text-text">No one sees your raw answers.</span> Only computed scores are used for matching.</li>
                  <li>• <span className="text-text">You can close and come back.</span> Progress auto-saves after every answer.</li>
                  <li>• <span className="text-text">Take your time.</span> Rushing produces inaccurate results that hurt your matches.</li>
                </ul>
              </div>

              <div className="bg-bg rounded-xl p-4 border border-surface-light">
                <h2 className="font-semibold mb-2">🔒 Privacy Agreement</h2>
                <ul className="text-xs text-text-muted space-y-1">
                  <li>• Your raw answers are never shared with anyone — not even your match.</li>
                  <li>• Only computed trait scores are compared, and only after mutual consent.</li>
                  <li>• This is not a clinical diagnosis. Results are for compatibility purposes only.</li>
                  <li>• You can delete all your data at any time from Settings.</li>
                </ul>
              </div>

              <button
                onClick={() => setAgreed(true)}
                className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition text-lg"
              >
                I Understand — Begin Assessment
              </button>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  // ═══ ASSESSMENT FORM ═══
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
