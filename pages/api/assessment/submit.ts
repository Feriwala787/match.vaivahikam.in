import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseWithAuth, getUser } from '@/lib/supabase-server';
import { computeTraitScores } from '@/lib/scoring';

export const config = {
  api: { bodyParser: { sizeLimit: '2mb' } },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await getUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized. Please log in again.' });

  const { answers, minutesSpent, rushed } = req.body;
  if (!answers || typeof answers !== 'object') return res.status(400).json({ error: 'Answers required' });

  const likertAnswers: Record<string, number> = {};
  const dealbreakAnswers: Record<string, string> = {};

  for (const [k, v] of Object.entries(answers)) {
    if (typeof v === 'number') likertAnswers[k] = v;
    else if (typeof v === 'string') dealbreakAnswers[k] = v;
  }

  const traitScores = computeTraitScores(likertAnswers);

  const supabase = getSupabaseWithAuth(req);
  const { error } = await supabase.from('psych_profiles').upsert({
    user_id: user.id,
    raw_answers: answers,
    trait_scores: traitScores,
    dealbreaker_answers: dealbreakAnswers,
    completed_at: new Date().toISOString(),
    minutes_spent: minutesSpent || null,
    rushed: rushed || false,
  }, { onConflict: 'user_id' });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ success: true, traitScores });
}
