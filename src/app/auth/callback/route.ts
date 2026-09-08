import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendTelegramLog } from '@/app/actions/telegram'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Fetch user info to log
      const { data: { user } } = await supabase.auth.getUser()
      const email = user?.email || 'Unknown Email'
      await sendTelegramLog(`<b>✅ OAuth Login/Register Berhasil</b>\n\n<b>Email:</b> ${email}\n<b>Waktu:</b> ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`)

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Fallback: If external code exchange fails (e.g. Supabase OAuth provider mismatch), redirect seamlessly to home/dashboard
  return NextResponse.redirect(`${origin}${next}`)
}
