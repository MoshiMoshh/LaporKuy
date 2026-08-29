import { streamText } from 'ai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Menggunakan API Key dari .env.local
// Jika belum ada, Anda harus menambahkannya: GEMINI_API_KEY=your_key_here
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MOCK_KEY_FOR_TESTING');

const systemPrompt = `Anda adalah LaporKuy AI, asisten customer service ramah untuk aplikasi "LaporKuy". 
LaporKuy adalah platform bagi masyarakat untuk melaporkan masalah infrastruktur kota (seperti jalan rusak, lampu mati, penumpukan sampah, banjir).
Gunakan bahasa Indonesia yang sopan, ramah, dan solutif. Jangan memberikan jawaban terlalu panjang.

Info Penting:
1. Poin: Tiap laporan divalidasi dapat 15 poin. Poin bisa ditukar voucher atau pulsa di menu Tukar Poin.
2. Proses: Warga lapor -> diverifikasi AI -> butuh upvote masyarakat -> Diproses Dinas -> Selesai.
3. SLA: Setiap dinas punya batas waktu (SLA) perbaikan. 

Jika pengguna bertanya di luar topik infrastruktur/laporankuy, tolak dengan halus.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Jika API Key tidak ada (atau masih default mock), kembalikan pesan mock
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return new Response(
        JSON.stringify({
          error: "API Key Gemini belum disetel",
          message: "[MOCK RESPONSE] Saya adalah LaporKuy AI. Karena kunci API belum dipasang, saya belum bisa berpikir kritis. Silakan tambahkan GEMINI_API_KEY di file .env.local Anda untuk menghidupkan saya!"
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Ekstraksi pesan terakhir dari pengguna
    const userMessage = messages[messages.length - 1]?.content || '';

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Menyuntikkan instruksi sistem ke awal percakapan
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }]
        },
        {
          role: "model",
          parts: [{ text: "Siap, saya mengerti peran saya sebagai LaporKuy AI." }]
        }
      ],
    });

    // Karena Vercel AI SDK membutuhkan konversi stream khusus untuk library barunya,
    // kita akan menggunakan pendekatan sederhana namun andal untuk Vercel AI SDK dengan Gemini.
    
    const result = await chat.sendMessageStream(userMessage);

    // Manual stream response generator
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          // Vercel AI SDK format: 0:"text"
          controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(chunkText)}\n`));
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1'
      }
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Terjadi kesalahan saat memproses pesan.' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
