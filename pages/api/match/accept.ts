import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { calculateMatch } from '@/lib/scoring';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { requestId } = req.body;
  if (!requestId) return res.status(400).json({ error: 'Request ID required' });

  // Get the match request
  const { data: matchReq } = await supabase
    .from('match_requests')
    .select('*')
    .eq('id', requestId)
    .eq('status', 'pending')
    .single();
  if (!matchReq) return res.status(404).json({ error: 'Request not found or already processed' });

  // Get both users' profiles
  const { data: senderUser } = await supabase.from('users').select('id').eq('username', matchReq.sender_username).single();
  const { data: receiverUser } = await supabase.from('users').select('id').eq('username', matchReq.receiver_username).single();
  if (!senderUser || !receiverUser) return res.status(400).json({ error: 'Users not found' });

  const { data: senderProfile } = await supabase.from('psych_profiles').select('trait_scores, dealbreaker_answers').eq('user_id', senderUser.id).single();
  const { data: receiverProfile } = await supabase.from('psych_profiles').select('trait_scores, dealbreaker_answers').eq('user_id', receiverUser.id).single();
  if (!senderProfile || !receiverProfile) return res.status(400).json({ error: 'Both users must complete assessment' });

  // Run the matching algorithm
  const result = calculateMatch(
    senderProfile.trait_scores,
    receiverProfile.trait_scores,
    senderProfile.dealbreaker_answers || {},
    receiverProfile.dealbreaker_answers || {}
  );

  // Update request with result
  const { error } = await supabase
    .from('match_requests')
    .update({ status: 'accepted', match_result: result })
    .eq('id', requestId);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ success: true, result });
}
