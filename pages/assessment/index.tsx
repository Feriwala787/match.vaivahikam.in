import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { likertQuestions, dealbreakers, sections, TOTAL_QUESTIONS } from '@/lib/questions';
import { computeTraitScores } from '@/lib/scoring';

const ITEMS_PER_PAGE = 10;

export default function Assessment() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
  }, [authLoading, user, router]);

  // Build ordered question list
  const allItems = [
    ...likertQuestions.map(q => ({ ...q, type: 'likert' as const })),
    ...dealbreakers.map(q => ({ ...q, type: 'dealbreaker' as const })),
  ];

  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const currentItems = allItems.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  // Find current section
  let runningCount = 0;
  let currentSection = sections[0];
  for (const s of sections) {
    runningCount += s.count;
    if (page * ITEMS_PER_PAGE < runningCount) { currentSection = s; break; }
  }

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

    if (!error) router.push('/dashboard');
    else alert('Error saving: ' + error.message);
    setSubmitting(false);
  }

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar */}
      <div className="sticky top-0 z-10 bg-bg border-b border-surface-light px-6 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-muted">{currentSection.label}</span>
          <span className="text-sm text-text-muted">{answeredCount}/{TOTAL_QUESTIONS} answered ({progress}%)</span>
        </div>
        <div className="w-full h-2 bg-surface-light rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Questions */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="space-y-8">
          {currentItems.map((item, idx) => (
            <div key={item.id} className="bg-surface rounded-xl p-6 border border-surface-light">
              <p className="font-medium mb-4">
                <span className="text-text-muted text-sm mr-2">Q{page * ITEMS_PER_PAGE + idx + 1}.</span>
                {item.text}
              </p>

              {item.type === 'likert' ? (
                <div className="flex justify-between gap-2">
                  {[
                    { val: 1, label: 'Strongly Disagree' },
                    { val: 2, label: 'Disagree' },
                    { val: 3, label: 'Neutral' },
                    { val: 4, label: 'Agree' },
                    { val: 5, label: 'Strongly Agree' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setAnswer(item.id, opt.val)}
                      className={`flex-1 py-2 px-1 rounded-lg text-xs sm:text-sm transition border ${
                        answers[item.id] === opt.val
                          ? 'bg-primary text-white border-primary'
                          : 'border-surface-light hover:border-primary/50 text-text-muted'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {('options' in item) && item.options.map((opt: string) => (
                    <button
                      key={opt}
                      onClick={() => setAnswer(item.id, opt)}
                      className={`py-2 px-4 rounded-lg text-sm transition border text-left ${
                        answers[item.id] === opt
                          ? 'bg-primary text-white border-primary'
                          : 'border-surface-light hover:border-primary/50 text-text-muted'
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
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-6 py-2 rounded-lg border border-surface-light text-text-muted hover:text-text disabled:opacity-30 transition"
          >
            ← Previous
          </button>

          {page < totalPages - 1 ? (
            <button
              onClick={() => setPage(p => p + 1)}
              className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={answeredCount < TOTAL_QUESTIONS || submitting}
              className="px-6 py-2 rounded-lg bg-success text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
