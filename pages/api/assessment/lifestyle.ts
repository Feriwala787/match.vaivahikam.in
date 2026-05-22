import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseWithAuth, getUser } from '@/lib/supabase-server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await getUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { answers } = req.body;
  if (!answers || typeof answers !== 'object') return res.status(400).json({ error: 'Answers required' });

  const supabase = getSupabaseWithAuth(req);

  // Update the existing psych_profile with lifestyle data
  const { error } = await supabase
    .from('psych_profiles')
    .update({ lifestyle_answers: answers })
    .eq('user_id', user.id);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ success: true });
}
