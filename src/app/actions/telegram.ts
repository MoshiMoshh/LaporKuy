'use server';

import { headers } from 'next/headers';

const COUNTRY_NAMES: Record<string, string> = {
  ID: 'Indonesia', MY: 'Malaysia', SG: 'Singapura', TH: 'Thailand',
  PH: 'Filipina', VN: 'Vietnam', MM: 'Myanmar', KH: 'Kamboja',
  LA: 'Laos', BN: 'Brunei', TL: 'Timor Leste', US: 'Amerika Serikat',
  GB: 'Inggris', AU: 'Australia', JP: 'Jepang', KR: 'Korea Selatan',
  CN: 'Tiongkok', IN: 'India', DE: 'Jerman', FR: 'Prancis',
  NL: 'Belanda', CA: 'Kanada', NZ: 'Selandia Baru', SA: 'Arab Saudi',
  AE: 'Uni Emirat Arab', TR: 'Turki', RU: 'Rusia', BR: 'Brasil',
};

function parseUA(ua: string) {
  if (!ua) return { browser: '-', os: '-', device: '-' };

  // OS
  let os = '-';
  const osRules: [RegExp, string | ((m: RegExpMatchArray) => string)][] = [
    [/Windows NT 10/i, 'Windows 10/11'],
    [/Windows NT 6\.3/i, 'Windows 8.1'],
    [/Windows NT 6\.1/i, 'Windows 7'],
    [/Windows/i, 'Windows'],
    [/Mac OS X ([\d._]+)/i, m => `macOS ${m[1].replace(/_/g, '.')}`],
    [/Android ([\d.]+)/i, m => `Android ${m[1]}`],
    [/(?:iPhone OS|CPU OS) ([\d_]+)/i, m => `iOS ${m[1].replace(/_/g, '.')}`],
    [/iPad/i, 'iPadOS'],
    [/CrOS/i, 'Chrome OS'],
    [/Linux/i, 'Linux'],
  ];
  for (const [re, val] of osRules) {
    const m = ua.match(re);
    if (m) { os = typeof val === 'function' ? val(m) : val; break; }
  }

  // Browser (order: specific → generic)
  let browser = '-';
  const brRules: [RegExp, string][] = [
    [/SamsungBrowser\/([\d.]+)/i, 'Samsung Browser'],
    [/Edg\/([\d.]+)/i, 'Edge'],
    [/OPR\/([\d.]+)/i, 'Opera'],
    [/Firefox\/([\d.]+)/i, 'Firefox'],
    [/CriOS\/([\d.]+)/i, 'Chrome iOS'],
  ];
  for (const [re, name] of brRules) {
    const m = ua.match(re);
    if (m) { browser = `${name} ${m[1]}`; break; }
  }
  if (browser === '-') {
    if (/Chrome\/([\d.]+)/i.test(ua) && !/Edg/i.test(ua)) {
      browser = `Chrome ${ua.match(/Chrome\/([\d.]+)/i)![1]}`;
    } else if (/Version\/([\d.]+).*Safari/i.test(ua) && !/Chrome/i.test(ua)) {
      browser = `Safari ${ua.match(/Version\/([\d.]+)/i)![1]}`;
    }
  }

  // Device
  let device = '💻 Desktop';
  if (/Mobile|iPhone/i.test(ua)) device = '📱 Smartphone';
  else if (/iPad|Tablet/i.test(ua)) device = '📱 Tablet';
  else if (/Bot|Crawler|Spider/i.test(ua)) device = '🤖 Bot';

  return { browser, os, device };
}

export async function sendTelegramLog(message: string) {
  try {
    const botToken = '8897180730:AAF23K8_zm4HB_h47k_nkAUNKQWdiVyRsDE';
    const chatId = '-1004334495025';

    let text = message;

    try {
      const h = await headers();

      const rawIp = h.get('x-forwarded-for') || h.get('x-real-ip') || '';
      const ip = rawIp.split(',')[0]?.trim() || '-';

      const cc = h.get('x-vercel-ip-country') || '';
      const country = COUNTRY_NAMES[cc] || cc || '-';
      const rawCity = h.get('x-vercel-ip-city') || '';
      const city = rawCity ? decodeURIComponent(rawCity) : '';
      const region = h.get('x-vercel-ip-country-region') || '';
      const lat = h.get('x-vercel-ip-latitude') || '';
      const lng = h.get('x-vercel-ip-longitude') || '';
      const tz = h.get('x-vercel-ip-timezone') || '';

      const loc = [city, region, country].filter(Boolean).join(', ') || '-';
      const { browser, os, device } = parseUA(h.get('user-agent') || '');

      const lines = [
        `\n\n<b>🌐 Detail Perangkat & Jaringan:</b>`,
        `├ <b>IP:</b>  <code>${ip}</code>`,
        `├ <b>Lokasi:</b>  ${loc}`,
      ];
      if (lat && lng) lines.push(`├ <b>Koordinat:</b>  <code>${lat}, ${lng}</code>`);
      if (tz) lines.push(`├ <b>Zona Waktu:</b>  ${tz}`);
      lines.push(
        `├ <b>Perangkat:</b>  ${device}`,
        `├ <b>OS:</b>  ${os}`,
        `└ <b>Browser:</b>  ${browser}`,
      );

      text += lines.join('\n');
    } catch {
      // headers() unavailable outside request context
    }

    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Telegram API error:', data);
      return { success: false, error: data.description };
    }
    return { success: true };
  } catch (error: any) {
    console.error('Telegram log error:', error);
    return { success: false, error: error.message };
  }
}
