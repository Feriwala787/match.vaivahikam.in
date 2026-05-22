import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseServer } from '@/lib/supabase-server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { username } = req.query;
  if (!username || typeof username !== 'string') return res.status(400).json({ error: 'Username required' });

  const supabase = getSupabaseServer();
  const { data } = await supabase.from('users').select('username').eq('username', username.toLowerCase()).maybeSingle();

  return res.status(200).json({ exists: !!data });
}
