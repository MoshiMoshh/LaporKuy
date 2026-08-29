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

-- Insert Mock Data for Quests (to ensure UI doesn't break)
INSERT INTO public.quests (id, title, description, reward_points, progress, target, type, is_claimed, expires_in) VALUES
('q-1', 'Pelapor Harian', 'Buat 1 laporan masalah kota hari ini', 15, 0, 1, 'daily', false, '8 jam lagi'),
('q-2', 'Verifikator Komunitas', 'Berikan upvote pada 3 laporan warga lain', 10, 0, 3, 'daily', false, '8 jam lagi'),
('q-3', 'Penjelajah Kecamatan', 'Laporkan masalah di 2 kecamatan berbeda', 50, 0, 2, 'weekly', false, '4 hari lagi'),
('q-4', 'Bulan Bersih Sampah', 'Ikuti tantangan tematik pelaporan sampah liar', 100, 0, 5, 'seasonal', false, '12 hari lagi')
ON CONFLICT (id) DO NOTHING;

-- Insert Mock Data for Rewards
INSERT INTO public.rewards (id, title, category, points_cost, stock, image_url, partner_name, description) VALUES
('r-1', 'Voucher Tokopedia Rp 25.000', 'Voucher', 200, 15, 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&auto=format&fit=crop&q=80', 'Tokopedia', 'Voucher belanja digital tanpa minimal transaksi.'),
('r-2', 'Pulsa Seluler / E-Wallet Rp 50.000', 'Pulsa/E-wallet', 380, 8, 'https://images.unsplash.com/photo-1556742049-0a675440263f?w=400&auto=format&fit=crop&q=80', 'GoPay / OVO / Telkomsel', 'Bisa langsung ditransfer ke nomor GoPay, OVO, ShopeePay, atau isi pulsa.'),
('r-3', 'Tumbler Eksklusif #LaporKuy', 'Merchandise', 500, 5, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=80', 'LaporKuy Official Store', 'Tumbler stainless steel 500ml tahan panas & dingin dengan gravir namamu.'),
('r-4', 'Fast-Track Layanan Pemkot', 'Layanan Prioritas', 650, 10, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80', 'Pemkot Surabaya', 'Jalur prioritas antrean pelayanan administratif di Mal Pelayanan Publik.')
ON CONFLICT (id) DO NOTHING;

-- Insert Mock User (since we need a user to tie reports to before auth is fully implemented)
INSERT INTO public.profiles (id, name, email, phone, avatar, points, level, xp, next_level_xp, streak_days, trust_score, impact_count, total_reports, completed_reports, total_upvotes_received, badges) VALUES
('usr-001', 'Budi Santoso', 'budi.santoso@email.com', '+62 812-3456-7890', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&auto=format&fit=crop&q=80', 485, 'Pahlawan Kota', 1480, 2000, 7, 98, 1240, 18, 15, 142, '[{"id": "b-1", "name": "Pelapor Pertama", "icon": "🎯", "rarity": "Common", "description": "Membuat laporan pertama yang terverifikasi", "unlockedAt": "2026-07-10"}, {"id": "b-2", "name": "Mata Elang", "icon": "🦅", "rarity": "Rare", "description": "Menemukan 10 masalah infrastruktur dengan AI akurasi >95%", "unlockedAt": "2026-08-01"}, {"id": "b-3", "name": "Penjaga Kota", "icon": "🔥", "rarity": "Epic", "description": "Aktif melaporkan masalah 7 hari berturut-turut", "unlockedAt": "2026-08-25"}, {"id": "b-4", "name": "Legenda Civic", "icon": "👑", "rarity": "Legendary", "description": "Laporanmu membantu lebih dari 1.000 warga", "unlockedAt": "2026-08-27"}]')
ON CONFLICT (id) DO NOTHING;

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
