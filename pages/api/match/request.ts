import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies['sb-access-token'];
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { targetUsername } = req.body;
  if (!targetUsername) return res.status(400).json({ error: 'Target username required' });

  // Get sender username
  const { data: sender } = await supabase.from('users').select('username').eq('id', user.id).single();
  if (!sender) return res.status(400).json({ error: 'Complete your profile first' });

  // Verify target exists and has completed assessment
  const { data: target } = await supabase.from('users').select('id, username').eq('username', targetUsername).single();
  if (!target) return res.status(404).json({ error: 'User not found' });

  const { data: targetProfile } = await supabase.from('psych_profiles').select('id').eq('user_id', target.id).single();
  if (!targetProfile) return res.status(400).json({ error: 'Target user has not completed their assessment yet' });

  // Check sender has completed assessment
  const { data: senderProfile } = await supabase.from('psych_profiles').select('id').eq('user_id', user.id).single();
  if (!senderProfile) return res.status(400).json({ error: 'Complete your assessment first' });

  // Check for existing request
  const { data: existing } = await supabase
    .from('match_requests')
    .select('id')
    .eq('sender_username', sender.username)
    .eq('receiver_username', targetUsername)
    .single();
  if (existing) return res.status(400).json({ error: 'Request already sent to this user' });

  // Create request
  const { error } = await supabase.from('match_requests').insert({
    sender_username: sender.username,
    receiver_username: targetUsername,
    status: 'pending',
  });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ success: true });
}
