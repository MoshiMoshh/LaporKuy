-- Initial Schema for LaporKuy v2

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar TEXT,
  points INTEGER DEFAULT 0,
  level TEXT DEFAULT 'Pemula',
  xp INTEGER DEFAULT 0,
  next_level_xp INTEGER DEFAULT 100,
  streak_days INTEGER DEFAULT 0,
  trust_score INTEGER DEFAULT 100,
  impact_count INTEGER DEFAULT 0,
  total_reports INTEGER DEFAULT 0,
  completed_reports INTEGER DEFAULT 0,
  total_upvotes_received INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb
);

-- 2. Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  severity INTEGER NOT NULL,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  photo_url TEXT NOT NULL,
  after_photo_url TEXT,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT,
  user_avatar TEXT,
  upvotes INTEGER DEFAULT 0,
  is_urgent BOOLEAN DEFAULT FALSE,
  ai_authenticity_score INTEGER,
  ai_confidence INTEGER,
  assigned_dinas TEXT,
  sla_target_days INTEGER,
  sla_days_remaining INTEGER
);

-- 3. Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id TEXT PRIMARY KEY,
  report_id TEXT REFERENCES public.reports(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_official BOOLEAN DEFAULT FALSE
);

-- 4. Quests Table
CREATE TABLE IF NOT EXISTS public.quests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reward_points INTEGER NOT NULL,
  progress INTEGER DEFAULT 0,
  target INTEGER NOT NULL,
  type TEXT NOT NULL,
  is_claimed BOOLEAN DEFAULT FALSE,
  expires_in TEXT
);

-- 5. Rewards Table
CREATE TABLE IF NOT EXISTS public.rewards (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  points_cost INTEGER NOT NULL,
  stock INTEGER NOT NULL,
  image_url TEXT,
  partner_name TEXT NOT NULL,
  description TEXT NOT NULL
);

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT
);

-- 7. Upvotes History Table (to track who upvoted what)
CREATE TABLE IF NOT EXISTS public.report_upvotes (
  report_id TEXT REFERENCES public.reports(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (report_id, user_id)
);


-- Security Settings (Allow Anonymous/Authenticated access for demo purposes)
-- Note: For a production app, you would lock this down with proper RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_upvotes ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (for this demo/migration phase)
CREATE POLICY "Enable all operations for all users" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.comments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.quests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.rewards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.report_upvotes FOR ALL USING (true) WITH CHECK (true);
