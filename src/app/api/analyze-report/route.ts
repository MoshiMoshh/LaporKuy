import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const defaultApiKey = '';

export async function POST(req: Request) {
  try {
    const { imageBase64, filename, location } = await req.json();

    let apiKey = process.env.GEMINI_API_KEY || defaultApiKey;
    
    // Bypass Next.js process.env cache for hot-reload without restart
    if (!apiKey || apiKey === 'AIzaSyBKjW37QoGztY0Cs0ZDvR9oZ9XQqPyuTng') {
      try {
        const envPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, 'utf8');
          const match = envContent.match(/GEMINI_API_KEY=(.+)/);
          if (match && match[1]) apiKey = match[1].trim();
        }
      } catch (e) {}
    }

    const hasValidKey = Boolean(apiKey) && apiKey !== 'AIzaSyBKjW37QoGztY0Cs0ZDvR9oZ9XQqPyuTng';

    // 1. Try Gemini Vision Model if API Key is set
    if (hasValidKey && imageBase64 && imageBase64.includes('base64,')) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

        const mimeType = imageBase64.split(';')[0].split(':')[1] || 'image/jpeg';
        const data = imageBase64.split('base64,')[1];

        const prompt = `Analisis foto pengaduan fasilitas publik ini secara akurat.

Tugas Anda:
1. Validasi Spam/Prank: Apakah foto ini BENAR-BENAR menunjukkan infrastruktur/fasilitas publik (seperti jalan, lampu, sampah, saluran air, trotoar, bangunan)? Jika foto ini terdeteksi sebagai spam, bercanda, foto selfie wajah, meme, gambar blank, screenshot game, hewan, dsb yang BUKAN merupakan laporan kerusakan publik, tandai sebagai TIDAK VALID.
2. Klasifikasi (Jika Valid): Klasifikasikan foto ke dalam SALAH SATU kategori ini:
- "Jalan Rusak" (jalan berlubang, retak, aspal hancur)
- "Lampu Mati" (PJU mati, tiang listrik/lampu padam)
- "Sampah" (penumpukan sampah, limbah meluap)
- "Banjir" (genangan air tinggi, saluran air mampet)
- "Trotoar Rusak" (ubin trotoar pecah, trotoar hancur)
- "Fasilitas Umum" (rambu rusak, halte rusak, fasilitas lainnya)

Jawab HANYA dalam format JSON valid tanpa markdown/backticks:
{
  "isValid": true atau false,
  "invalidReason": "jika isValid false, berikan alasan singkat kenapa foto ditolak (contoh: 'Foto terdeteksi sebagai selfie/wajah, bukan kerusakan fasilitas publik')",
  "category": "Jalan Rusak" | "Lampu Mati" | "Sampah" | "Banjir" | "Trotoar Rusak" | "Fasilitas Umum",
  "severity": 1-10,
  "assignedDinas": "nama dinas pemkot terkait",
  "recommendation": "rekomendasi singkat penanganan teknis"
}`;

        const result = await model.generateContent([
          prompt,
          { inlineData: { data, mimeType } }
        ]);

        const responseText = result.response.text();
        const cleanJson = responseText.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanJson);

        return Response.json({
          success: true,
          isValid: parsed.isValid !== false,
          invalidReason: parsed.invalidReason || null,
          category: parsed.category || 'Jalan Rusak',
          severity: parsed.severity || 7,
          assignedDinas: parsed.assignedDinas || 'Dinas Bina Marga & Sumber Daya Air',
          recommendation: parsed.recommendation || 'Pemeriksaan lokasi dan penanganan oleh petugas dinas.',
        });
      } catch (err: any) {
        console.error('Gemini vision API error:', err);
        return Response.json(
          { success: false, error: err.message || 'Gagal memproses gambar dengan AI' },
          { status: 500 }
        );
      }
    } else {
      return Response.json(
        { success: false, error: 'Tidak ada API Key atau input gambar tidak valid' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message || 'Gagal menganalisis gambar' },
      { status: 500 }
    );
  }
}
