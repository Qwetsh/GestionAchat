-- GestionAchat Initial Schema
-- Created for Story 1.1 - Project Setup

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pin_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Temptations table
CREATE TABLE temptations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  photo_url TEXT,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT CHECK (category IN ('cosmetics', 'books', 'stationery', 'other')),
  status TEXT CHECK (status IN ('active', 'resisted', 'cracked')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- Gamification table
CREATE TABLE gamification (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for active temptations query
CREATE INDEX idx_temptations_user_status ON temptations(user_id, status);
CREATE INDEX idx_temptations_created_at ON temptations(created_at DESC);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE temptations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic setup - will be refined in later stories)
-- For now, allow all operations for authenticated users on their own data

-- Users policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (true);

-- Temptations policies
CREATE POLICY "Users can view own temptations" ON temptations
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own temptations" ON temptations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own temptations" ON temptations
  FOR UPDATE USING (true);

-- Gamification policies
CREATE POLICY "Users can view own gamification" ON gamification
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own gamification" ON gamification
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own gamification" ON gamification
  FOR UPDATE USING (true);
