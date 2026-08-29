import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    
    if (!phone) {
      return NextResponse.json({ error: 'Nomor HP wajib diisi' }, { status: 400 });
    }

    // Generate kode OTP acak (4 digit)
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Simulasi jeda pengiriman API (1.5 detik) agar UI terasa nyata
    await new Promise(resolve => setTimeout(resolve, 1500));

    // MOCK: Cetak pesan ke console terminal server, bukan ke API sungguhan
    console.log('\n=============================================');
    console.log(`📱 MOCK WHATSAPP API TRIGGERED`);
    console.log(`Penerima: ${phone}`);
    console.log(`Pesan   : [LaporKuy] Kode OTP Anda adalah ${otp}. JANGAN berikan kepada siapapun.`);
    console.log('=============================================\n');

    return NextResponse.json({ 
      success: true, 
      message: 'OTP berhasil dikirim via WhatsApp (Mock)',
      mock_otp: otp // Dikirim ke klien (hanya untuk prototype, dalam produksi tidak boleh dikirim ke klien)
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengirim OTP' }, { status: 500 });
  }
}
