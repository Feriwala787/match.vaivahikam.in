import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest } from 'next';

export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase environment variables not set');
  return createClient(url, key);
}

export async function getUser(req: NextApiRequest) {
  const supabase = getSupabaseServer();
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  const { data: { user } } = await supabase.auth.getUser(token);
  return user;
}
