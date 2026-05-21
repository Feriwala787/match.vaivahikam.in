import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseServer, getUser } from '@/lib/supabase-server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = await getUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const supabase = getSupabaseServer();

  const { data: currentUser } = await supabase.from('users').select('username').eq('id', user.id).single();
  if (!currentUser) return res.status(400).json({ error: 'User not found' });

  const { status } = req.query;

  let query = supabase
    .from('match_requests')
    .select('*')
    .or(`sender_username.eq.${currentUser.username},receiver_username.eq.${currentUser.username}`)
    .order('created_at', { ascending: false });

  if (status && typeof status === 'string') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({
    incoming: (data || []).filter(r => r.receiver_username === currentUser.username),
    outgoing: (data || []).filter(r => r.sender_username === currentUser.username),
  });
}
