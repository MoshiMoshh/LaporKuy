<div align="center">
  <img src="public/icons/icon-512x512.png" alt="LaporKuy Logo" width="150" height="150" />
  
  # LaporKuy 🏙️
  **Platform Pelaporan Infrastruktur Kota Berbasis Komunitas & AI**
  
  <p align="center">
    <a href="#-problem-latar-belakang">Problem</a> •
    <a href="#-tujuan">Tujuan</a> •
    <a href="#-problem-solving-solusi">Problem Solving</a> •
    <a href="#-output-fitur-utama">Output</a> •
    <a href="#-tech-stack">Tech Stack</a>
  </p>
</div>

---

## 🚨 Problem (Latar Belakang)
Infrastruktur kota yang rusak (seperti jalan berlubang, lampu jalan mati, atau tumpukan sampah liar) seringkali lambat ditangani. Masalah utama yang sering terjadi:
1. **Birokrasi Pelaporan yang Rumit**: Warga malas melapor karena prosesnya berbelit-belit dan tidak tahu harus melapor ke dinas mana.
2. **Kurangnya Transparansi**: Warga yang sudah melapor sering merasa diabaikan karena tidak ada *update* status penyelesaian.
3. **Laporan Palsu & Duplikat**: Banyaknya laporan *spam* atau foto lama yang diunggah ulang membuat pihak berwenang membuang waktu untuk verifikasi manual.
4. **Kurangnya Partisipasi**: Tidak ada insentif atau apresiasi bagi warga yang aktif peduli terhadap lingkungan kotanya.

## 🎯 Tujuan
Membangun platform terpusat yang menjembatani komunikasi antara warga dan pemerintah daerah secara **transparan, cepat, dan akurat**. LaporKuy bertujuan untuk memberdayakan warga agar lebih peduli pada kotanya, sekaligus membantu dinas terkait bekerja lebih efisien dengan bantuan teknologi masa kini.

## 💡 Problem Solving (Solusi)
LaporKuy hadir dengan pendekatan inovatif untuk menyelesaikan masalah di atas:
- **Deteksi AI (AI Authenticity)** 🤖: Setiap foto yang diunggah akan dianalisis menggunakan *mock-AI* untuk menentukan tingkat keaslian gambar dan tingkat urgensi (Severity), mencegah laporan palsu/spam.
- **Auto-Routing Berbasis GPS** 📍: Pengguna tidak perlu pusing memilih dinas. Sistem menggunakan geolokasi otomatis untuk mendeteksi koordinat (Provinsi/Kota/Kecamatan) dan langsung mengarahkan laporan ke dinas yang tepat (misal: *Dinas Bina Marga* untuk jalan berlubang).
- **Sistem Gamifikasi (Quest & Poin)** 🏆: Memberikan elemen *fun* dan apresiasi. Warga yang melapor, melakukan *upvote*, atau aktif di komunitas akan mendapatkan Poin, XP, Badge, dan naik level (misal: *Warga Aktif* ➡️ *Pahlawan Kota*). Poin dapat ditukar dengan *Reward* menarik.
- **Transparansi & Notifikasi Real-time** 🔔: Terintegrasi langsung dengan database Supabase, warga akan menerima notifikasi secara instan setiap kali status laporan mereka berubah (Diterima ➡️ Diproses ➡️ Selesai).

## 📱 Output (Fitur Utama)
Hasil dari pengembangan ini adalah **Aplikasi Web (PWA) Mobile-First** dengan *user experience* (UX) yang sangat mulus, responsif, dan menyerupai aplikasi *native*.

### Core Features:
1. **Smart Report Form (`/buat-laporan`)**: Form pelaporan dengan auto-GPS, deteksi lokasi berjenjang, dan *drag-and-drop* pengunggahan foto.
2. **Community Dashboard (`/dashboard`)**: Halaman *feed* untuk melihat laporan di sekitar, memberikan *upvote*, dan berdiskusi via komentar. Dilengkapi filter cerdas dan *bottom-sheet* interaktif.
3. **Gamification Center (`/misi`)**: Halaman khusus untuk klaim Misi Harian/Bulanan dan menukarkan Poin dengan *Rewards*.
4. **Real-time Notification Center (`/notifikasi`)**: Pusat pemberitahuan progres laporan secara langsung.
5. **Keamanan Ekstra (Security Headers & Anti-Spam)**: Perlindungan *Strict-Transport-Security (HSTS)*, *CSP*, dan sistem blokir pendaftaran menggunakan *temporary email* (Temp Mail Blocker).

## 🛠 Tech Stack
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) (Animasi)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Database & Auth:** [Supabase](https://supabase.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) & Lucide Icons
- **Deployment:** [Vercel](https://vercel.com/)

---

### Cara Menjalankan Proyek Secara Lokal

1. **Clone repository:**
   ```bash
   git clone https://github.com/MoshiMoshh/LaporKuy.git
   cd LaporKuy
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup Environment Variables:**
   Buat file `.env.local` dan masukkan *keys* Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

<div align="center">
  <br />
  <i>Dibuat dengan ❤️ untuk infrastruktur kota yang lebih baik.</i>
</div>
