-- Relational Blueprint Database Schema
-- Run this in Supabase SQL Editor

-- Users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Psychometric profiles
CREATE TABLE IF NOT EXISTS psych_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  raw_answers JSONB NOT NULL DEFAULT '{}',
  trait_scores JSONB NOT NULL DEFAULT '{}',
  dealbreaker_answers JSONB NOT NULL DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Match requests (dual-blind consent)
CREATE TABLE IF NOT EXISTS match_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_username TEXT NOT NULL REFERENCES users(username),
  receiver_username TEXT NOT NULL REFERENCES users(username),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  match_result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sender_username, receiver_username)
);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE psych_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_requests ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can read any username" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Psych profiles: only own data
CREATE POLICY "Users can read own psych profile" ON psych_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own psych profile" ON psych_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own psych profile" ON psych_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Match requests: can see own sent/received
CREATE POLICY "Users can see own match requests" ON match_requests FOR SELECT
  USING (
    sender_username IN (SELECT username FROM users WHERE id = auth.uid())
    OR receiver_username IN (SELECT username FROM users WHERE id = auth.uid())
  );
CREATE POLICY "Users can insert match requests" ON match_requests FOR INSERT
  WITH CHECK (sender_username IN (SELECT username FROM users WHERE id = auth.uid()));
CREATE POLICY "Users can update received requests" ON match_requests FOR UPDATE
  USING (receiver_username IN (SELECT username FROM users WHERE id = auth.uid()));

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_match_requests_sender ON match_requests(sender_username);
CREATE INDEX IF NOT EXISTS idx_match_requests_receiver ON match_requests(receiver_username);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
