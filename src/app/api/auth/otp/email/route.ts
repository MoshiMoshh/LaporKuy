import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Alamat Email wajib diisi' }, { status: 400 });
    }

    // Generate kode OTP acak (4 digit)
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Simulasi jeda pengiriman API (1.5 detik) agar loading spinner di UI berputar
    await new Promise(resolve => setTimeout(resolve, 1500));

    // MOCK: Cetak pesan ke console terminal server, seolah-olah Resend/Nodemailer menembak email
    console.log('\n=============================================');
    console.log(`📧 MOCK EMAIL API (RESEND/NODEMAILER) TRIGGERED`);
    console.log(`To      : ${email}`);
    console.log(`Subject : Kode Verifikasi Pendaftaran LaporKuy`);
    console.log(`Body    : Halo Pahlawan Kota! Kode verifikasi Anda adalah ${otp}. Masukkan kode ini untuk menyelesaikan pendaftaran Anda.`);
    console.log('=============================================\n');

    return NextResponse.json({ 
      success: true, 
      message: 'Email OTP berhasil dikirim (Mock)',
      mock_otp: otp // Dikirim ke klien (hanya untuk prototype)
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengirim OTP via Email' }, { status: 500 });
  }
}
