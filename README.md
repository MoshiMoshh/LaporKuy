<div align="center">

# LaporKuy
**Sistem Pelaporan Infrastruktur Kota Berbasis AI dan Partisipasi Publik**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database_&_Auth-green?logo=supabase)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## Ringkasan Eksekutif (Executive Summary)

**LaporKuy** adalah sebuah platform berbasis *Progressive Web Application (PWA)* yang dirancang untuk merevolusi cara warga berinteraksi dengan pemerintah daerah terkait pemeliharaan infrastruktur kota. Platform ini menjembatani kesenjangan komunikasi antara masyarakat dan instansi pemerintah melalui pemanfaatan kecerdasan buatan (AI) untuk verifikasi laporan, otomatisasi distribusi data berbasis geolokasi, serta pendekatan gamifikasi untuk meningkatkan partisipasi publik.

## Latar Belakang Masalah (Problem Statement)

Pengelolaan infrastruktur perkotaan saat ini seringkali terhambat oleh beberapa kendala sistemik:
1. **Birokrasi Pelaporan yang Inefisien:** Masyarakat seringkali kesulitan mengidentifikasi instansi spesifik yang berwenang untuk menangani suatu kerusakan infrastruktur, sehingga pelaporan menjadi lambat atau salah sasaran.
2. **Kurangnya Visibilitas dan Transparansi:** Pelapor jarang mendapatkan pembaruan (update) status secara *real-time* mengenai tindak lanjut laporan mereka, yang berujung pada menurunnya tingkat kepercayaan publik.
3. **Validitas dan Kualitas Data:** Tingginya volume laporan palsu, *spam*, atau duplikasi data (seperti menggunakan foto lama dari internet) membebani sumber daya pemerintah dalam proses verifikasi manual.
4. **Rendahnya Partisipasi Aktif:** Kurangnya sistem insentif membuat masyarakat cenderung apatis terhadap kondisi infrastruktur di lingkungan sekitarnya.

## Solusi yang Ditawarkan (Proposed Solution)

LaporKuy merestrukturisasi alur pelaporan tradisional menjadi sebuah ekosistem digital yang efisien, transparan, dan otonom melalui pendekatan berikut:

- **AI-Powered Verification:** Mengintegrasikan model analisis gambar untuk menentukan tingkat keaslian foto (*AI Authenticity Score*) dan tingkat keparahan (*Severity Analysis*), sehingga menyaring laporan palsu secara otomatis sebelum masuk ke antrean petugas.
- **Geospatial Auto-Routing:** Memanfaatkan kapabilitas *Geolocation API* dan pemrosesan koordinat spasial untuk mendeteksi hierarki wilayah (Provinsi/Kota/Kecamatan) dan mengarahkan laporan secara langsung ke *dashboard* instansi yang relevan secara *real-time*.
- **Integrated Gamification Engine:** Menerapkan sistem penghargaan (*Points, Badges, Quests*) berskala dinamis untuk mendorong pelaporan yang berkualitas dan memotivasi keterlibatan komunitas secara berkelanjutan.

## Fitur Utama dan Inovasi (Key Features)

1. **Smart Report Form & Validation**
   - Form pelaporan dinamis dengan deteksi lokasi presisi tinggi.
   - Analisis *metadata* gambar secara otomatis.
   - Proteksi keamanan terhadap pendaftaran menggunakan *disposable email* untuk menjaga integritas data pengguna.

2. **Community Dashboard & Triage**
   - *Feed* interaktif yang menampilkan laporan di area sekitar pengguna.
   - Fitur *upvote* (dukungan) untuk laporan infrastruktur kritis, membantu algoritma dalam menentukan prioritas penanganan oleh instansi.
   - Diskusi publik transparan dalam bentuk utas komentar.

3. **Real-time Notification Architecture**
   - Notifikasi berbasis *push* dan *in-app* yang terhubung langsung dengan perubahan *state* di *database*.
   - Pelapor menerima pemberitahuan transisi status (Diterima $\rightarrow$ Diproses $\rightarrow$ Selesai) lengkap dengan foto hasil perbaikan (*after-repair photo*).

## Arsitektur Sistem dan Teknologi (Tech Stack)

LaporKuy dibangun di atas infrastruktur modern yang berorientasi pada performa, skalabilitas, dan keamanan:

- **Frontend & Server Framework:** Next.js 16 (App Router)
- **Styling & UI Components:** Tailwind CSS, Radix UI, Framer Motion
- **State Management:** Zustand (Client-side state)
- **Backend-as-a-Service (BaaS):** Supabase (PostgreSQL, Row Level Security, Real-time Subscriptions, Authentication)
- **Deployment & Edge Network:** Vercel (dengan implementasi HTTP Security Headers mutakhir termasuk HSTS dan CSP)

---

## Panduan Instalasi (Local Development Setup)

Prasyarat: Pastikan Anda telah menginstal Node.js (v18+) dan Git.

1. **Kloning Repositori**
   ```bash
   git clone https://github.com/MoshiMoshh/LaporKuy.git
   cd LaporKuy
   ```

2. **Instalasi Dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi Variabel Lingkungan (Environment Variables)**
   Buat salinan dari `.env.example` menjadi `.env.local` dan masukkan kredensial Supabase Anda.
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Menjalankan Server Pengembangan**
   ```bash
   npm run dev
   ```
   Akses aplikasi melalui `http://localhost:3000`.
