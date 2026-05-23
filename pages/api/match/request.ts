import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseServer, getSupabaseWithAuth, getUser } from '@/lib/supabase-server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await getUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized. Please log in again.' });

  const supabase = getSupabaseWithAuth(req);
  const supabaseAdmin = getSupabaseServer(); // For cross-user reads
  const { targetUsername } = req.body;
  if (!targetUsername) return res.status(400).json({ error: 'Target username required.' });

  // Get sender username
  const { data: sender } = await supabase.from('users').select('username').eq('id', user.id).single();
  if (!sender) return res.status(400).json({ error: 'Complete your profile first.' });

  if (sender.username === targetUsername) return res.status(400).json({ error: "You can't send a request to yourself." });

  // Verify target exists
  const { data: target } = await supabaseAdmin.from('users').select('id, username').eq('username', targetUsername).maybeSingle();
  if (!target) return res.status(404).json({ error: `User @${targetUsername} not found.` });

  // Verify both have completed assessment (use admin client to check target)
  const { data: targetProfile } = await supabaseAdmin.from('psych_profiles').select('id').eq('user_id', target.id).maybeSingle();
  if (!targetProfile) return res.status(400).json({ error: `@${targetUsername} has not completed their assessment yet.` });

  const { data: senderProfile } = await supabase.from('psych_profiles').select('id').eq('user_id', user.id).maybeSingle();
  if (!senderProfile) return res.status(400).json({ error: 'Complete your assessment first.' });

  // Check for existing request (either direction)
  const { data: existing } = await supabase
    .from('match_requests')
    .select('id, status')
    .or(`and(sender_username.eq.${sender.username},receiver_username.eq.${targetUsername}),and(sender_username.eq.${targetUsername},receiver_username.eq.${sender.username})`)
    .maybeSingle();

  if (existing) {
    if (existing.status === 'pending') return res.status(400).json({ error: 'A request already exists between you two.' });
    if (existing.status === 'accepted') return res.status(400).json({ error: 'You already have a completed blueprint with this user.' });
  }

  // Create request
  const { error } = await supabase.from('match_requests').insert({
    sender_username: sender.username,
    receiver_username: targetUsername,
    status: 'pending',
  });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ success: true });
}
