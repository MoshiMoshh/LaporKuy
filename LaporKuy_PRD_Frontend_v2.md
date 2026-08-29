# PRD LaporKuy — Frontend v2.0
> "Lapor masalah kota dalam 30 detik, lihat dampaknya secara real-time."

Versi ini adalah pengembangan dari PRD awal. Fokus utama: menambahkan lapisan **komunitas, gamifikasi, transparansi, dan AI** di atas fondasi yang sudah ada (form laporan, dashboard peta, admin panel), tanpa mengubah alur inti yang sudah simpel.

---

## 0. Product Vision

LaporKuy bukan cuma "form pengaduan digital" — posisinya sebagai **platform civic-tech** di mana:

- Melapor terasa **cepat & tanpa friksi** (foto → AI → submit).
- Melapor terasa **memuaskan** (poin, level, dampak yang terlihat).
- Melapor terasa **berarti** (transparansi: warga bisa lihat dinas mana yang responsif, laporan mana yang selesai).
- Warga bisa lapor **dari mana saja** — termasuk tanpa buka app, lewat WhatsApp.

---

## 1. Ringkasan Fitur — Prioritas Pengembangan

| Fitur | Status di PRD lama | Fase | Kenapa penting |
|---|---|---|---|
| Form laporan + AI klasifikasi | Ada | MVP | Core value proposition |
| Dashboard peta + list laporan | Ada | MVP | Transparansi dasar |
| Leaderboard sederhana | Ada (di dashboard) | MVP | Gamifikasi dasar |
| Admin panel | Ada | MVP | Operasional |
| **Heatmap & prediksi zona rawan** | Baru | V2 | Visual "wow", insight kota |
| **Upvote & verifikasi komunitas** | Baru | V2 | Percepat validasi, social proof |
| **Gamifikasi 2.0 (level, streak, quest)** | Baru | V2 | Retensi jangka panjang |
| **Tukar poin / rewards marketplace** | Baru | V2 | Insentif nyata → adopsi naik |
| **Notification & nudge engine** | Baru | V2 | Re-engagement |
| **PWA offline-first** | Baru | V2 | Reliable di jaringan lemah |
| **Before/After impact gallery** | Baru | V2 | Bukti visual dampak nyata |
| **Dashboard transparansi dinas (SLA publik)** | Baru | V3 | Akuntabilitas, potensi viral/pers |
| **Bot pelaporan via WhatsApp** | Baru | V3 | Distribusi massal, zero-install |
| **AI: deteksi duplikat & foto palsu** | Baru | V3 | Kualitas data, anti-spam |
| **Voice report** | Baru | V3 | Aksesibilitas |
| **Public API & embeddable widget** | Baru | V3 | Distribusi ke media/pemda lain |

---

## 2. Peta Rute (Updated)

| Route | Halaman | Fungsi | Status |
|---|---|---|---|
| `/` | Landing Page | Promosi, statistik, impact stories | Enhanced |
| `/buat-laporan` | Form Laporan | Buat laporan baru | Enhanced |
| `/dashboard` | Dashboard | Peta + heatmap + daftar laporan | Enhanced |
| `/laporan/[id]` | Detail Laporan | Detail, upvote, komentar, before/after | Enhanced |
| `/papan-peringkat` | Leaderboard | Ranking mingguan/bulanan/all-time | **Baru** |
| `/misi` | Misi & Tantangan | Quest harian/mingguan | **Baru** |
| `/tukar-poin` | Rewards Store | Tukar poin jadi voucher/benefit | **Baru** |
| `/notifikasi` | Notification Center | Riwayat notifikasi | **Baru** |
| `/transparansi` | Dashboard Publik | SLA & performa dinas | **Baru** |
| `/bantuan` | Bantuan / FAQ + Chatbot | Self-service support | **Baru** |
| `/admin` | Admin Panel | Kelola semua laporan | Enhanced |
| `/admin/dinas/[id]` | Portal Dinas | View & update laporan milik dinas tsb | **Baru** |
| `/login` | Login | Masuk (email atau OTP WhatsApp) | Enhanced |
| `/register` | Register | Daftar akun | Sama |
| `/profil` | Profil User | Poin, level, streak, badge, trust score | Enhanced |
| `/tentang` | Tentang | Info aplikasi | Sama |

---

## 3. Detail Per Halaman

### 3.1 Landing Page (`/`) — Enhanced

```
Komponen:
├── Navbar
│   ├── Logo "LaporKuy"
│   ├── Menu: Beranda, Dashboard, Transparansi, Tentang
│   ├── Tombol Login
│   └── Tombol "Buat Laporan"
├── Hero Section
│   ├── Judul: "Laporkan Masalah Kota dalam 30 Detik"
│   ├── Subjudul: "AI klasifikasi otomatis + lokasi terdeteksi"
│   ├── CTA Button: "Buat Laporan Sekarang"
│   ├── CTA Sekunder: "Lapor via WhatsApp"
│   └── Ilustrasi 3D isometric animasi ringan
├── Live Ticker Bar (BARU)
│   └── "🔴 Baru saja: Jalan rusak dilaporkan di Kec. Sukolilo"
│       (auto-scroll, realtime dari Supabase)
├── Stats Section
│   ├── Total Laporan
│   ├── Masalah Selesai
│   ├── Pelapor Aktif
│   └── Rata-rata Waktu Respon (BARU — tarik dari data transparansi)
├── Cara Kerja Section (4 step, sama seperti sebelumnya)
├── Impact Gallery Section (BARU)
│   └── Carousel before/after dari laporan yang selesai
├── Testimoni & Media Coverage Section (BARU)
├── Laporan Terbaru Section
│   └── Card list (5 laporan terbaru, realtime)
├── CTA Banner: "Gabung 12.000+ warga yang sudah bikin kota lebih baik"
└── Footer
    ├── Copyright
    ├── Links: Tentang, Kontak, API Publik, Transparansi
    └── Social links
```

**State:** `stats`, `recentReports`, `impactStories`, `liveTickerFeed`, `loading`

---

### 3.2 Form Laporan (`/buat-laporan`) — Enhanced

```
Komponen:
├── Header (sama)
├── LocationDisplay (sama)
├── PhotoUpload
│   ├── Dropzone/Button "Upload Foto"
│   ├── Tombol "Ambil Foto Langsung" (camera capture, wajib untuk anti-spam)
│   ├── Preview foto
│   └── Tombol hapus foto
├── DuplicateCheck (BARU)
│   ├── Loading: "🔍 Mengecek laporan serupa di sekitar..."
│   ├── Jika ditemukan: Card "Sudah ada laporan serupa 200m dari sini"
│   │   ├── Preview laporan existing
│   │   └── Tombol "Dukung laporan ini" (upvote, tidak submit baru)
│   └── Jika tidak ada: lanjut ke AI Classification
├── AIClassification
│   ├── Loading: "🤖 AI sedang menganalisis..."
│   ├── Hasil: Badge jenis + keparahan (1-10)
│   ├── Rekomendasi perbaikan
│   ├── Confidence score
│   └── Badge "Foto terverifikasi asli" (deteksi edit/AI-generated) (BARU)
├── DescriptionInput
│   ├── Textarea
│   ├── Tombol mic 🎤 — Voice-to-text (BARU)
│   └── Character counter
├── UrgencyToggle (BARU)
│   └── "Tandai darurat" (untuk kasus seperti kabel listrik putus, dsb)
├── SubmitButton
│   ├── Tombol besar "Submit Laporan"
│   └── Disabled state saat loading
├── PointsPreview (BARU)
│   └── "+15 poin jika laporan terverifikasi"
└── Toast / Success Modal
    ├── Sukses: Animasi confetti + "✅ Laporan terkirim! +15 poin"
    ├── Progress streak: "🔥 3 hari berturut-turut melapor!"
    └── Error: "❌ Gagal mengirim" (dengan auto-retry & offline queue)
```

**State tambahan:** `duplicateCandidates`, `isDuplicateChecking`, `isUrgent`, `voiceTranscript`, `pointsEarned`, `offlineQueued`

**Flow baru (poin 3-4 disisipkan):**
```
1. Mount → request geolocation
2. Reverse geocode → alamat muncul
3. User ambil/upload foto → preview muncul
4. Cek duplikat (radius + kemiripan gambar) → jika ada, tawarkan upvote
5. Jika tidak duplikat → kirim ke /api/classify (AI jenis + keparahan + validitas foto)
6. Hasil AI muncul
7. User isi deskripsi (teks atau suara)
8. Submit → jika offline, simpan ke queue lokal → auto-sync saat online
9. Toast sukses + animasi poin + cek streak → redirect ke dashboard
```

---

### 3.3 Dashboard (`/dashboard`) — Enhanced

```
Komponen:
├── Header
│   ├── Judul: "Dashboard"
│   ├── Toggle "Peta Standar / Heatmap" (BARU)
│   └── Tombol "Buat Laporan"
├── MapView
│   ├── Peta interaktif (MapLibre)
│   ├── Mode Marker:
│   │   ├── ● Jalan Rusak (red)
│   │   ├── ○ Lampu Mati (amber)
│   │   ├── △ Sampah (green)
│   │   └── □ Banjir (blue)
│   ├── Mode Heatmap (BARU): gradient density berdasarkan jumlah & keparahan laporan
│   ├── Layer "Zona Rawan Prediktif" (BARU) — AI highlight area berpotensi masalah
│   │   berikutnya berdasarkan pola historis (musim hujan → prediksi banjir, dst)
│   ├── Marker animasi pulse untuk laporan baru masuk (<10 menit)
│   ├── Popup saat klik marker (+ tombol upvote cepat)
│   └── Zoom controls
├── FilterBar
│   ├── Filter jenis, status (sama)
│   ├── Filter jarak: "Dekat saya" (radius slider) (BARU)
│   └── Sort: Terbaru, Terlama, Keparahan, Paling Didukung (BARU)
├── ReportList
│   ├── Card per laporan
│   │   ├── Icon jenis, judul, alamat, status badge, waktu
│   │   └── Jumlah upvote "👍 24 warga mengalami ini juga" (BARU)
│   └── Empty state
├── Leaderboard (ringkas, link ke /papan-peringkat)
├── MiniStatsWidget (BARU)
│   └── "Minggu ini: 340 laporan baru, 210 selesai"
└── LoadingSkeleton
```

**State tambahan:** `mapMode` ('marker' | 'heatmap'), `predictedZones`, `nearbyRadius`, `sortBy`

**Realtime:** sama seperti sebelumnya + broadcast event untuk animasi pulse marker baru.

---

### 3.4 Detail Laporan (`/laporan/[id]`) — Enhanced

```
Komponen:
├── Header (sama)
├── PhotoDisplay
│   ├── Foto besar, zoom on click
│   └── Before/After Slider (BARU) — muncul jika status "Selesai" dan dinas upload foto after
├── ReportInfo (sama + Badge "Darurat" jika urgent)
├── CommunitySupport (BARU)
│   ├── Tombol "👍 Saya juga alami ini" (upvote)
│   ├── Counter jumlah dukungan
│   └── Progress bar "3/5 konfirmasi warga untuk auto-verifikasi"
├── CommentSection (BARU)
│   ├── List komentar warga
│   ├── Komentar resmi dari dinas (badge terverifikasi)
│   └── Input komentar baru
├── MapMini (sama)
├── StatusTimeline
│   ├── List status berurutan (sama)
│   └── SLA indicator (BARU): "Ditargetkan selesai dalam 3 hari — masih 1 hari lagi"
├── FollowButton (BARU)
│   └── "Ikuti laporan ini" — dapat notifikasi tiap ada update
└── ShareButton
    ├── Share ke WhatsApp, Twitter
    └── Copy link
```

**State tambahan:** `upvotes`, `comments`, `isFollowing`, `afterPhoto`, `slaTarget`, `communityVerifyProgress`

---

### 3.5 Papan Peringkat (`/papan-peringkat`) — Baru

```
Komponen:
├── Header + Toggle periode: Mingguan / Bulanan / Sepanjang Waktu
├── Podium Top 3 (visual besar, badge emas/perak/perunggu)
├── ListRank 4-100
│   ├── Avatar, nama, level, poin
│   └── Highlight baris user sendiri (sticky di bawah jika di luar top 100)
└── Tab "Ranking per Kecamatan" (BARU) — kompetisi antar wilayah
```

---

### 3.6 Misi & Tantangan (`/misi`) — Baru

```
Komponen:
├── Header: "Misi Kamu Hari Ini"
├── DailyQuestCard
│   └── Contoh: "Laporkan 1 masalah hari ini" → +10 poin bonus
├── WeeklyQuestList
│   ├── "Laporkan di 3 kecamatan berbeda"
│   ├── "Dapatkan 5 upvote dari warga lain"
│   └── Progress bar per quest
├── SeasonalChallenge (BARU)
│   └── Event tematik, misal "Bulan Bersih Sampah" dengan reward eksklusif
└── ClaimRewardButton
```

**State:** `dailyQuest`, `weeklyQuests`, `activeChallenge`, `claimable`

---

### 3.7 Tukar Poin / Rewards Store (`/tukar-poin`) — Baru

```
Komponen:
├── Header + Saldo Poin
├── RewardCategoryTabs: Voucher, Pulsa/E-wallet, Merchandise, Layanan Prioritas
├── RewardGrid
│   └── Card: nama reward, harga poin, stok, tombol "Tukar"
├── RedeemHistory
└── ConfirmModal (konfirmasi sebelum tukar poin)
```

**Catatan:** butuh partnership dengan UMKM/e-wallet lokal untuk isi katalog reward — ini yang bikin gamifikasi terasa "nyata", bukan cuma angka.

---

### 3.8 Notification Center (`/notifikasi`) — Baru

```
Komponen:
├── Tab: Semua, Status Laporan, Komunitas, Reward
├── NotificationList
│   ├── "Laporanmu #1234 sudah Diverifikasi"
│   ├── "3 warga mendukung laporanmu"
│   ├── "Streak-mu akan hangus besok, lapor sekarang!"
│   └── "Poin kamu cukup untuk tukar reward baru"
└── Settings link → atur preferensi notifikasi (push/email)
```

---

### 3.9 Dashboard Transparansi Publik (`/transparansi`) — Baru

```
Komponen:
├── Header: "Transparansi & Akuntabilitas"
├── DinasScorecard
│   ├── Tabel: Nama Dinas, Total Ditangani, Rata-rata Waktu Respon, % Selesai tepat SLA
│   └── Sort: "Dinas Tercepat" (BARU — mendorong kompetisi sehat antar dinas)
├── TrendCharts
│   ├── Grafik jumlah laporan per bulan per jenis
│   └── Grafik waktu respon rata-rata dari waktu ke waktu
├── OpenDataSection
│   ├── Tombol "Unduh Data (CSV)"
│   └── Link dokumentasi Public API
└── EmbedWidgetGenerator (BARU)
    └── Generate snippet embed peta laporan untuk website media/pemda
```

**Kenapa penting:** ini fitur yang paling berpotensi bikin orang "woah" — mengubah app dari sekadar tools jadi *alat akuntabilitas publik*. Bagus untuk press coverage & kepercayaan pemerintah daerah.

---

### 3.10 Admin Panel (`/admin`) — Enhanced

```
Komponen:
├── Header + Badge total laporan
├── StatsRow (Total, Pending, Diproses, Selesai)
├── SLAAlertBanner (BARU)
│   └── "12 laporan melewati target SLA" — auto-escalation warning
├── ReportTable
│   ├── Kolom: Foto, Jenis, Alamat, Status, Trust Score Pelapor (BARU), Aksi
│   ├── Filter, sort, pagination (sama)
│   └── Bulk actions (BARU): assign massal, update status massal
├── StatusUpdate
│   ├── Dropdown status, catatan, upload foto "after" (BARU)
│   └── Tombol update
├── AssignDinas
│   ├── AI auto-suggest dinas tujuan (sama, diperkuat model routing)
│   └── Kirim notifikasi
├── AnalyticsExport (BARU)
│   └── Export laporan bulanan (PDF/CSV) untuk rapat evaluasi
├── RoleManagement (BARU)
│   └── Super Admin, Admin Dinas, Moderator — akses berbeda per role
└── DeleteButton (soft delete, sama)
```

**State tambahan:** `slaBreaches`, `userTrustScores`, `currentUserRole`, `bulkSelection`

---

### 3.11 Login & Register — Enhanced

```
Login:
├── Email + Password
├── ATAU "Masuk dengan OTP WhatsApp" (BARU — friksi lebih rendah dari OAuth Google)
├── OAuth Google
└── Link ke Register

Register: (sama, + checkbox syarat & ketentuan + opsi verifikasi nomor WA)
```

---

### 3.12 Profil (`/profil`) — Enhanced

```
Komponen:
├── Avatar + Nama + Email
├── LevelBadge (BARU): Pemula → Warga Aktif → Pahlawan Kota → Legenda Kota
│   └── Progress bar XP ke level berikutnya
├── StreakCounter (BARU): "🔥 7 hari berturut-turut"
├── Poin total + tombol "Tukar Poin"
├── Badge Collection (grid, dengan rarity: Common/Rare/Epic/Legendary) (BARU visual tier)
├── TrustScoreIndicator (BARU) — transparansi kenapa laporan user dipercaya/tidak
├── Daftar laporan sendiri (status, link ke detail)
├── Statistik pribadi (Total, Selesai, Poin, Upvote diterima) (BARU: upvote)
├── Impact Card (BARU): "Laporanmu sudah membantu 1.240 warga lain"
└── Logout button
```

---

### 3.13 Bantuan / FAQ + Chatbot (`/bantuan`) — Baru

```
Komponen:
├── SearchBar FAQ
├── FAQ Accordion per kategori
├── AIChatWidget (BARU)
│   └── Chatbot kecil untuk bantu troubleshoot ("kenapa laporan saya pending?")
└── Tombol "Hubungi Dinas Terkait" / "Hubungi Support"
```

---

## 4. Fitur "Wow" — Deep Dive

Bagian ini merinci fitur pembeda yang paling berdampak ke persepsi produk.

### 4.1 AI Multi-Model Pipeline
Bukan cuma 1 model klasifikasi — pipeline mencakup:
1. **Klasifikasi jenis & keparahan** (existing)
2. **Deteksi duplikat** — cocokkan foto + radius lokasi + rentang waktu terhadap laporan lain
3. **Deteksi keaslian foto** — flag foto hasil edit berat/AI-generated
4. **Auto-routing dinas** — rekomendasi dinas tujuan berdasarkan jenis + histori akurasi routing sebelumnya

### 4.2 Peta Live + Heatmap Prediktif
Toggle antara mode marker biasa dan heatmap density. Layer tambahan "Zona Rawan" menyorot area yang diprediksi bermasalah berikutnya (misal: area rawan banjir saat musim hujan berdasarkan pola laporan tahun-tahun sebelumnya). Ini elemen visual paling "demo-able" di seluruh app.

### 4.3 Gamifikasi 2.0
- **Level & XP** — bukan cuma poin datar, ada progres jenjang yang terasa naik kelas.
- **Streak** — dorongan harian untuk tetap aktif memantau lingkungan.
- **Quest harian/mingguan/musiman** — variasi tujuan supaya tidak monoton.
- **Rarity badge** — badge legendary punya efek visual shimmer, mendorong flexing di media sosial.
- **Rewards store nyata** — poin bisa ditukar hal konkret (pulsa, voucher, layanan prioritas), bukan sekadar angka kosong.

### 4.4 Community Layer
- **Upvote** — "saya juga alami ini" mempercepat validasi tanpa perlu foto baru per orang.
- **Crowd verification** — N konfirmasi warga bisa mempercepat status ke "Terverifikasi" sebelum admin sempat cek manual.
- **Komentar resmi dari dinas** — dinas bisa update progres langsung di thread, transparan ke publik.

### 4.5 Before/After Impact Gallery
Saat laporan selesai, dinas upload foto "sesudah". Sistem otomatis membuat slider before/after yang bisa dipakai di halaman detail, landing page, maupun bahan press release. Ini bukti visual paling kuat bahwa platform benar-benar berdampak.

### 4.6 Dashboard Transparansi Publik
SLA per dinas ditampilkan terbuka ke publik, termasuk ranking "dinas tercepat". Data bisa diunduh (open data) dan diembed ke situs lain. Fitur ini mengubah posisi produk dari "app pengaduan" menjadi "alat akuntabilitas pemerintah" — sangat berpotensi viral/diliput media.

### 4.7 Bot Pelaporan via WhatsApp
Warga kirim foto + lokasi ke nomor WhatsApp resmi → bot balas dengan hasil klasifikasi AI & konfirmasi laporan terkirim, lengkap dengan poin yang didapat (jika sudah punya akun tertaut). Menghilangkan barrier install app — krusial untuk adopsi massal di Indonesia.

### 4.8 Notification & Nudge Engine
Push notification untuk update status, dukungan dari warga lain, pengingat streak, dan ringkasan dampak mingguan ("Laporanmu minggu ini membantu X warga"). Nudge yang terasa personal, bukan spam generik.

### 4.9 PWA Offline-First
Laporan yang dibuat saat sinyal lemah/mati disimpan di queue lokal (IndexedDB) dan otomatis terkirim saat online kembali. App bisa di-install seperti aplikasi native dari browser.

### 4.10 Trust Score & Anti-Spam
Setiap user punya trust score berdasarkan histori akurasi laporan (berapa persen laporannya terverifikasi vs ditolak). Trust score rendah memicu review manual lebih ketat — menjaga kualitas data tanpa perlu moderasi manual 100%.

### 4.11 Public API & Embeddable Widget
API terbuka (read-only, data agregat) untuk peneliti, jurnalis, dan pemda lain. Widget peta yang bisa di-embed ke situs media atau website pemerintah daerah — memperluas distribusi tanpa effort marketing tambahan.

---

## 5. Komponen Shared (Updated)

```
├── Navbar
├── Footer
├── BottomNav (mobile)
├── LoadingSkeleton (dengan shimmer effect)
├── EmptyState (dengan ilustrasi custom per konteks)
├── ErrorBoundary
├── Toast
├── Modal
├── ConfettiOverlay (BARU — untuk momen sukses)
├── Badge (dengan variant rarity)
├── Button
├── Card
├── Input
├── Textarea
├── Dropdown
├── Avatar
├── ProgressBar (BARU — XP, streak, SLA)
├── UpvoteButton (BARU)
├── MapLayer Toggle (BARU)
├── VoiceInputButton (BARU)
├── BeforeAfterSlider (BARU)
├── NotificationBell (BARU)
└── ThemeToggle — Dark/Light Mode (BARU)
```

---

## 6. Design System & Micro-interactions

Elemen visual yang bikin app terasa "hidup" dan premium, bukan sekadar form CRUD:

| Momen | Micro-interaction |
|---|---|
| Laporan berhasil submit | Confetti burst + counter poin naik dengan animasi |
| Marker baru muncul di peta | Pulse/ripple animation 2-3 detik |
| Level up | Modal full-screen dengan animasi badge baru |
| Streak bertahan | Ikon api yang membesar seiring hari bertambah |
| Loading data | Skeleton dengan shimmer, bukan spinner polos |
| Empty state | Ilustrasi custom + CTA jelas, bukan teks datar |
| Switch dark/light mode | Transisi smooth, bukan flash |
| Hover di card laporan | Elevasi halus + preview foto membesar sedikit |
| Toggle heatmap | Cross-fade antara mode marker dan heatmap |

**Prinsip:** animasi selalu *purposeful* (menandakan sesuatu terjadi), bukan dekorasi tanpa makna, dan tetap ringan performanya di device low-end.

---

## 7. Responsive Behavior

### Mobile (< 640px)
- Single column layout, Bottom navigation
- Form full-screen, Peta setengah layar, Cards full-width
- Heatmap toggle jadi floating action button
- Chatbot bantuan muncul sebagai bubble mengambang

### Tablet (640–1024px)
- 2 columns, Peta lebih besar, Sidebar opsional

### Desktop (> 1024px)
- Multi-column, Peta + list side-by-side, Navbar horizontal
- Dashboard transparansi menampilkan chart berdampingan (bukan stacked)

---

## 8. Loading & Empty States (Expanded)

| Kondisi | Tampilan |
|---|---|
| Fetch data | Skeleton cards dengan shimmer |
| AI processing | Spinner + "AI menganalisis..." |
| Cek duplikat | "🔍 Mengecek laporan serupa..." |
| Upload foto | Progress bar |
| Voice input aktif | Waveform animation + "Mendengarkan..." |
| Dashboard kosong | "Belum ada laporan" + CTA |
| Search kosong | "Tidak ditemukan" |
| Geolocation ditolak | "Izinkan akses lokasi" + fallback input manual alamat |
| AI gagal | "Klasifikasi manual" |
| Offline saat submit | "📴 Tersimpan, akan dikirim otomatis saat online" |
| Reward habis stok | "Stok habis, cek reward lain" |
| Quest sudah diklaim | Checkmark hijau + disabled state |

---

## 9. Catatan Arsitektur Teknis (Perspektif Frontend)

- **Realtime:** Supabase Realtime channel untuk `reports`, `upvotes`, `comments`, dan `notifications` — semua update terpisah channel supaya subscription ringan.
- **Offline queue:** simpan draft laporan di IndexedDB (via lib seperti `idb`), sync dengan background sync API saat koneksi kembali.
- **Peta:** MapLibre GL dengan layer terpisah untuk marker, heatmap (`heatmap-layer`), dan zona prediktif (GeoJSON polygon dari hasil model AI di backend).
- **Notifikasi:** Web Push API untuk PWA + integrasi WhatsApp Business API di sisi backend untuk channel WA (frontend hanya perlu halaman status linking nomor WA ke akun).
- **State management:** disarankan React Query / TanStack Query untuk data server (reports, leaderboard) + state ringan lokal (Zustand) untuk UI state (modal, toggle, tema).
- **Voice input:** Web Speech API sebagai baseline, fallback ke upload rekaman jika browser tidak mendukung.

---

## 10. Fase Pengembangan

### Fase MVP (fondasi, sudah tercakup di PRD awal)
Landing, Form Laporan + AI klasifikasi dasar, Dashboard peta + list, Leaderboard sederhana, Admin panel, Login/Register, Profil dasar.

### Fase V2 — "Engagement Layer"
Heatmap, Community layer (upvote, komentar, crowd-verify), Gamifikasi 2.0 (level, streak, quest, rewards store), Notification center, PWA offline-first, Before/After gallery, Dark mode.

### Fase V3 — "Scale & Trust Layer"
Dashboard transparansi publik, Bot WhatsApp, AI deteksi duplikat & foto palsu, Voice report, Trust score, Public API & embeddable widget, Role-based admin (multi-dinas).

---

## 11. Metrik Sukses (KPI)

| Metrik | Target arah |
|---|---|
| Retensi 30 hari pelapor aktif | Naik via streak & quest |
| Rata-rata waktu respon dinas | Turun via SLA publik & auto-escalation |
| % laporan terverifikasi tanpa cek manual admin | Naik via crowd-verification |
| Jumlah laporan via WhatsApp vs app | Ukur adopsi channel low-friction |
| Viral coefficient (share ke WA/Twitter per laporan) | Naik via before/after gallery & transparansi |
| % laporan spam/ditolak | Turun via trust score & deteksi foto palsu |

---

*Dokumen ini adalah living document — prioritas fase bisa disesuaikan berdasarkan kapasitas tim dan feedback pengguna di tiap rilis.*
