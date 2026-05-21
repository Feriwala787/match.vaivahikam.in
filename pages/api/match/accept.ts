import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseServer, getUser } from '@/lib/supabase-server';
import { calculateMatch } from '@/lib/scoring';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await getUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const supabase = getSupabaseServer();
  const { requestId } = req.body;
  if (!requestId) return res.status(400).json({ error: 'Request ID required.' });

  // Get the match request and verify receiver
  const { data: matchReq } = await supabase
    .from('match_requests')
    .select('*')
    .eq('id', requestId)
    .eq('status', 'pending')
    .single();

  if (!matchReq) return res.status(404).json({ error: 'Request not found or already processed.' });

  // Verify the current user is the receiver
  const { data: currentUser } = await supabase.from('users').select('username').eq('id', user.id).single();
  if (!currentUser || currentUser.username !== matchReq.receiver_username) {
    return res.status(403).json({ error: 'Only the receiver can accept this request.' });
  }

  // Get both users' profiles
  const { data: senderUser } = await supabase.from('users').select('id').eq('username', matchReq.sender_username).single();
  const { data: receiverUser } = await supabase.from('users').select('id').eq('username', matchReq.receiver_username).single();
  if (!senderUser || !receiverUser) return res.status(400).json({ error: 'Users not found.' });

  const [senderRes, receiverRes] = await Promise.all([
    supabase.from('psych_profiles').select('trait_scores, dealbreaker_answers').eq('user_id', senderUser.id).single(),
    supabase.from('psych_profiles').select('trait_scores, dealbreaker_answers').eq('user_id', receiverUser.id).single(),
  ]);

  if (!senderRes.data || !receiverRes.data) {
    return res.status(400).json({ error: 'Both users must complete the assessment.' });
  }

  // Run the matching algorithm
  const result = calculateMatch(
    senderRes.data.trait_scores,
    receiverRes.data.trait_scores,
    senderRes.data.dealbreaker_answers || {},
    receiverRes.data.dealbreaker_answers || {}
  );

  // Update request with result
  const { error } = await supabase
    .from('match_requests')
    .update({ status: 'accepted', match_result: result })
    .eq('id', requestId);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ success: true, result });
}
