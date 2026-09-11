'use server';

import { headers } from 'next/headers';

// ── Country code → full name (common Southeast Asian + major countries) ──
const COUNTRY_NAMES: Record<string, string> = {
  ID: 'Indonesia', MY: 'Malaysia', SG: 'Singapura', TH: 'Thailand',
  PH: 'Filipina', VN: 'Vietnam', MM: 'Myanmar', KH: 'Kamboja',
  LA: 'Laos', BN: 'Brunei', TL: 'Timor Leste', US: 'Amerika Serikat',
  GB: 'Inggris', AU: 'Australia', JP: 'Jepang', KR: 'Korea Selatan',
  CN: 'Tiongkok', IN: 'India', DE: 'Jerman', FR: 'Prancis',
  NL: 'Belanda', CA: 'Kanada', NZ: 'Selandia Baru', SA: 'Arab Saudi',
  AE: 'Uni Emirat Arab', TR: 'Turki', RU: 'Rusia', BR: 'Brasil',
};

/**
 * Parse a raw User-Agent string into a human-readable "Browser vX on OS" label.
 * Handles Chrome, Firefox, Safari, Edge, Opera, Samsung, and mobile variants.
 */
function parseUserAgent(raw: string): { browser: string; os: string; device: string } {
  if (!raw || raw === 'Perangkat Tidak Diketahui') {
    return { browser: 'Tidak diketahui', os: 'Tidak diketahui', device: 'Tidak diketahui' };
  }

  // ── Detect OS ──
  let os = 'Tidak diketahui';
  if (/Windows NT 10/i.test(raw)) os = 'Windows 10/11';
  else if (/Windows NT 6\.3/i.test(raw)) os = 'Windows 8.1';
  else if (/Windows NT 6\.1/i.test(raw)) os = 'Windows 7';
  else if (/Windows/i.test(raw)) os = 'Windows';
  else if (/Mac OS X (\d+[._]\d+)/i.test(raw)) {
    const ver = raw.match(/Mac OS X (\d+[._]\d+[._]?\d*)/i)?.[1]?.replace(/_/g, '.') || '';
    os = `macOS ${ver}`;
  } else if (/Android (\d+(\.\d+)?)/i.test(raw)) {
    const ver = raw.match(/Android (\d+(\.\d+)?)/i)?.[1] || '';
    os = `Android ${ver}`;
  } else if (/iPhone OS (\d+[._]\d+)/i.test(raw) || /iPad/i.test(raw)) {
    const ver = raw.match(/(?:iPhone OS|CPU OS) (\d+[._]\d+)/i)?.[1]?.replace(/_/g, '.') || '';
    os = `iOS ${ver}`;
  } else if (/CrOS/i.test(raw)) os = 'Chrome OS';
  else if (/Linux/i.test(raw)) os = 'Linux';

  // ── Detect Browser (order matters — more specific first) ──
  let browser = 'Tidak diketahui';
  if (/SamsungBrowser\/(\d+(\.\d+)?)/i.test(raw)) {
    browser = `Samsung Browser ${raw.match(/SamsungBrowser\/(\d+(\.\d+)?)/i)?.[1]}`;
  } else if (/Edg\/(\d+(\.\d+)?)/i.test(raw)) {
    browser = `Microsoft Edge ${raw.match(/Edg\/(\d+(\.\d+)?)/i)?.[1]}`;
  } else if (/OPR\/(\d+(\.\d+)?)/i.test(raw) || /Opera\/(\d+(\.\d+)?)/i.test(raw)) {
    browser = `Opera ${(raw.match(/OPR\/(\d+(\.\d+)?)/i) || raw.match(/Opera\/(\d+(\.\d+)?)/i))?.[1]}`;
  } else if (/Firefox\/(\d+(\.\d+)?)/i.test(raw)) {
    browser = `Firefox ${raw.match(/Firefox\/(\d+(\.\d+)?)/i)?.[1]}`;
  } else if (/CriOS\/(\d+(\.\d+)?)/i.test(raw)) {
    browser = `Chrome iOS ${raw.match(/CriOS\/(\d+(\.\d+)?)/i)?.[1]}`;
  } else if (/Chrome\/(\d+(\.\d+)?)/i.test(raw) && !/Edg/i.test(raw)) {
    browser = `Chrome ${raw.match(/Chrome\/(\d+(\.\d+)?)/i)?.[1]}`;
  } else if (/Safari\/(\d+)/i.test(raw) && /Version\/(\d+(\.\d+)?)/i.test(raw) && !/Chrome/i.test(raw)) {
    browser = `Safari ${raw.match(/Version\/(\d+(\.\d+)?)/i)?.[1]}`;
  }

  // ── Detect Device Type ──
  let device = 'Desktop';
  if (/Mobile|Android.*Mobile|iPhone/i.test(raw)) device = 'Smartphone';
  else if (/iPad|Android(?!.*Mobile)|Tablet/i.test(raw)) device = 'Tablet';
  else if (/Bot|Crawler|Spider|Scrapy/i.test(raw)) device = 'Bot/Crawler';

  return { browser, os, device };
}

export async function sendTelegramLog(message: string) {
  try {
    const botToken = "8897180730:AAF23K8_zm4HB_h47k_nkAUNKQWdiVyRsDE";
    const chatId = "-1004334495025";

    if (!botToken || !chatId) {
      console.warn('Telegram logger is not configured properly.');
      return { success: false, error: 'Telegram not configured' };
    }

    let enrichedMessage = message;

    try {
      const headersList = await headers();

      // ── IP Address: take only the first (client) IP from x-forwarded-for chain ──
      const rawIp = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '';
      const ip = rawIp.split(',')[0]?.trim() || 'Tidak diketahui';

      // ── Geo Location from Vercel edge headers (URL-decode city names) ──
      const countryCode = headersList.get('x-vercel-ip-country') || '';
      const countryName = COUNTRY_NAMES[countryCode] || countryCode || 'Tidak diketahui';
      const rawCity = headersList.get('x-vercel-ip-city') || '';
      const city = rawCity ? decodeURIComponent(rawCity) : '';
      const region = headersList.get('x-vercel-ip-country-region') || '';
      const latitude = headersList.get('x-vercel-ip-latitude') || '';
      const longitude = headersList.get('x-vercel-ip-longitude') || '';
      const timezone = headersList.get('x-vercel-ip-timezone') || '';

      // Build readable location string
      const locationParts = [city, region, countryName].filter(Boolean);
      const locationStr = locationParts.length > 0 ? locationParts.join(', ') : 'Tidak diketahui';

      // ── User-Agent parsing ──
      const rawUA = headersList.get('user-agent') || '';
      const { browser, os, device } = parseUserAgent(rawUA);

      // ── Build the info block ──
      enrichedMessage += `\n\n<b>🌐 Detail Perangkat & Jaringan:</b>\n`;
      enrichedMessage += `├ <b>IP:</b> <code>${ip}</code>\n`;
      enrichedMessage += `├ <b>Lokasi:</b> ${locationStr}\n`;
      if (latitude && longitude) {
        enrichedMessage += `├ <b>Koordinat:</b> <code>${latitude}, ${longitude}</code>\n`;
      }
      if (timezone) {
        enrichedMessage += `├ <b>Timezone:</b> ${timezone}\n`;
      }
      enrichedMessage += `├ <b>Perangkat:</b> ${device}\n`;
      enrichedMessage += `├ <b>OS:</b> ${os}\n`;
      enrichedMessage += `└ <b>Browser:</b> ${browser}`;
    } catch (e) {
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

