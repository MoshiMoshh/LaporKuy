'use server';

export async function sendTelegramLog(message: string) {
  try {
    // HARDCODED untuk bypass masalah Vercel Environment Variables
    const botToken = "8897180730:AAF23K8_zm4HB_h47k_nkAUNKQWdiVyRsDE";
    const chatId = "1103507654";

    if (!botToken || !chatId) {
      console.warn('Telegram logger is not configured properly.');
      return { success: false, error: 'Telegram not configured' };
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
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
