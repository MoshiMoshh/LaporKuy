'use server';

import { headers } from 'next/headers';

export async function sendTelegramLog(message: string) {
  try {
    const botToken = "8897180730:AAF23K8_zm4HB_h47k_nkAUNKQWdiVyRsDE";
    const chatId = "-1004334495025"; // Updated Group Chat ID

    if (!botToken || !chatId) {
      console.warn('Telegram logger is not configured properly.');
      return { success: false, error: 'Telegram not configured' };
    }

    let enrichedMessage = message;

    try {
      const headersList = await headers();
      const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'IP Tidak Diketahui';
      const country = headersList.get('x-vercel-ip-country') || '';
      const city = headersList.get('x-vercel-ip-city') || '';
      const region = headersList.get('x-vercel-ip-country-region') || '';
      const location = [city, region, country].filter(Boolean).join(', ') || 'Lokasi Tidak Diketahui';
      const userAgent = headersList.get('user-agent') || 'Perangkat Tidak Diketahui';
      
      enrichedMessage += `\n\n<b>🌐 Info Jaringan & Perangkat:</b>\n`;
      enrichedMessage += `<b>IP Address:</b> <code>${ip}</code>\n`;
      enrichedMessage += `<b>Lokasi:</b> ${location}\n`;
      enrichedMessage += `<b>Browser/Device:</b> <code>${userAgent}</code>`;
    } catch (e) {
      // Ignored if headers() cannot be resolved (e.g., outside request context)
      console.warn('Could not read request headers for telegram log');
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: enrichedMessage,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Telegram API error:', data);
      return { success: false, error: data.description };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error sending telegram log:', error);
    return { success: false, error: error.message };
  }
}
