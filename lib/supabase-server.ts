import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest } from 'next';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function getSupabaseServer() {
  if (!url || !key) throw new Error('Supabase environment variables not set');
  return createClient(url, key);
}

// Creates a Supabase client authenticated as the requesting user (for RLS)
export function getSupabaseWithAuth(req: NextApiRequest) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!url || !key) throw new Error('Supabase environment variables not set');
  return createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

export async function getUser(req: NextApiRequest) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  const supabase = createClient(url, key);
  const { data: { user } } = await supabase.auth.getUser(token);
  return user;
}
