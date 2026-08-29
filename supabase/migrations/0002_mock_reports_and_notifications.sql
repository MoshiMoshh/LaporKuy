-- Insert missing mock profiles
INSERT INTO public.profiles (id, name, email, phone, avatar, points, level, xp, next_level_xp, streak_days, trust_score, impact_count, total_reports, completed_reports, total_upvotes_received) VALUES
('usr-002', 'Ahmad Fauzi', 'ahmad@example.com', NULL, 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80', 100, 'Pemula', 0, 100, 0, 100, 0, 1, 1, 0),
('usr-003', 'Dewi Lestari', 'dewi@example.com', NULL, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 100, 'Pemula', 0, 100, 0, 100, 0, 1, 0, 0),
('usr-004', 'Rian Hidayat', 'rian@example.com', NULL, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 100, 'Pemula', 0, 100, 0, 100, 0, 1, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Insert Mock Data for Reports
INSERT INTO public.reports (id, title, category, severity, address, district, lat, lng, photo_url, after_photo_url, description, status, created_at, updated_at, user_id, user_name, user_avatar, upvotes, is_urgent, ai_authenticity_score, ai_confidence, assigned_dinas, sla_target_days, sla_days_remaining) VALUES
('REP-1001', 'Lubang Jalan Besar Berbahaya di Jl. Raya Darmo', 'Jalan Rusak', 9, 'Jl. Raya Darmo No. 42, Wonokromo, Surabaya', 'Kec. Wonokromo', -7.2891, 112.7385, 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80', NULL, 'Lubang sedalam 15cm di lajur kiri. Sangat membahayakan pengendara motor saat malam hari atau ketika tergenang air hujan.', 'Diproses', '2026-08-27T09:30:00Z', '2026-08-27T14:20:00Z', 'usr-001', 'Budi Santoso', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', 42, true, 98, 96, 'Dinas Bina Marga & Sumber Daya Air', 3, 1),
('REP-1002', 'Lampu Penerangan Jalan Umum (PJU) Mati', 'Lampu Mati', 6, 'Jl. Ir. H. Soekarno (MERR), Rungkut, Surabaya', 'Kec. Rungkut', -7.3195, 112.7820, 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=800&auto=format&fit=crop&q=80', '3 tiang lampu PJU padam berturut-turut. Gelap gulita di persimpangan jalan.', 'Selesai', '2026-08-25T19:00:00Z', '2026-08-26T11:00:00Z', 'usr-002', 'Ahmad Fauzi', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80', 28, false, 99, 94, 'Dinas Perhubungan', 2, 0),
('REP-1003', 'Tumpukan Sampah Liar Menyumbat Selokan', 'Sampah', 8, 'Jl. Keputih Timur No. 12, Sukolilo, Surabaya', 'Kec. Sukolilo', -7.2945, 112.7981, 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80', NULL, 'Sampah plastik dan sisa bangunan dibuang sembarangan hingga saluran air tersumbat total.', 'Terverifikasi', '2026-08-28T07:15:00Z', '2026-08-28T08:00:00Z', 'usr-003', 'Dewi Lestari', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 19, true, 97, 98, 'Dinas Lingkungan Hidup', 2, 2),
('REP-1004', 'Genangan Air Akibat Drainase Tersumbat', 'Banjir', 7, 'Jl. Mayjen Sungkono, Dukuh Pakis, Surabaya', 'Kec. Dukuh Pakis', -7.2912, 112.7150, 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80', NULL, 'Air menggenang setinggi 30cm pasca hujan deras. Lalu lintas tersendat parah.', 'Pending', '2026-08-28T12:00:00Z', '2026-08-28T12:00:00Z', 'usr-004', 'Rian Hidayat', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 12, true, 95, 92, 'Dinas Sumber Daya Air', 1, 1),
('REP-1005', 'Ubin Trotoar Pemandu Difabel Rusak Parah', 'Trotoar Rusak', 5, 'Jl. Pemuda No. 15, Genteng, Surabaya', 'Kec. Genteng', -7.2654, 112.7482, 'https://images.unsplash.com/photo-1578991624414-276ef23a534f?w=800&auto=format&fit=crop&q=80', NULL, 'Guiding block untuk tunanetra terlepas dan berlubang di dekat halte bus.', 'Diproses', '2026-08-26T14:30:00Z', '2026-08-27T08:00:00Z', 'usr-001', 'Budi Santoso', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', 35, false, 99, 97, 'Dinas Perumahan Rakyat & Kawasan Permukiman', 4, 2)
ON CONFLICT (id) DO NOTHING;

-- Insert Mock Data for Comments
INSERT INTO public.comments (id, report_id, author, role, avatar, content, created_at, is_official) VALUES
('c-1', 'REP-1001', 'Siti Rahma', 'warga', NULL, 'Kemarin sepupu saya hampir jatuh di sini. Harap segera ditambal!', '2026-08-27T10:15:00Z', false),
('c-2', 'REP-1001', 'Dinas Bina Marga Kota', 'dinas', NULL, 'Tim Unit Reaksi Cepat (URC) sudah dijadwalkan meluncur sore ini untuk penambalan darurat.', '2026-08-27T14:20:00Z', true),
('c-3', 'REP-1002', 'Dinas Perhubungan', 'dinas', NULL, 'Perbaikan bohlam LED dan jaringan kabel selesai dilaksanakan tgl 26 Aug.', '2026-08-26T11:00:00Z', true)
ON CONFLICT (id) DO NOTHING;

-- Insert Mock Data for Notifications
INSERT INTO public.notifications (id, user_id, title, message, timestamp, type, is_read, link) VALUES
('n-1', 'usr-001', 'Laporan #REP-1001 Diproses!', 'Dinas Bina Marga telah menugaskan tim URC ke lokasi laporanmu.', '10 menit lalu', 'status', false, '/laporan/REP-1001'),
('n-2', 'usr-001', '+15 Poin Didapatkan!', 'Selamat! Laporanmu di Sukolilo telah terverifikasi oleh AI & komunitas.', '2 jam lalu', 'reward', false, '/profil'),
('n-3', 'usr-001', '4 Warga Mendukung Laporanmu', 'Laporan lubang jalanmu di Darmo mendapat 4 upvote baru.', '5 jam lalu', 'community', true, '/laporan/REP-1001'),
('n-4', 'usr-001', '🔥 Streak 7 Hari Berturut-turut!', 'Keren! Kamu mempertahankan streak pelaporan selama seminggu.', '1 hari lalu', 'system', true, NULL)
ON CONFLICT (id) DO NOTHING;
