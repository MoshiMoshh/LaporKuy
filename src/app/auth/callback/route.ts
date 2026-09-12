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
      const email = user?.email || 'Email tidak diketahui'
      const meta = user?.user_metadata || {}
      const name = meta.full_name || meta.name || 'Nama tidak tersedia'
      const provider = user?.app_metadata?.provider || 'oauth'
      const createdAt = user?.created_at ? new Date(user.created_at) : null
      const now = new Date()
      // If the account was created within the last 60 seconds, it's a new registration
      const isNewUser = createdAt && (now.getTime() - createdAt.getTime()) < 60_000
      const statusLabel = isNewUser ? '🆕 Registrasi Baru via OAuth' : '✅ Login via OAuth'

      try {
        await sendTelegramLog(`<b>${statusLabel}</b>\n\n<b>Nama:</b> ${name}\n<b>Email:</b> ${email}\n<b>Provider:</b> ${provider.charAt(0).toUpperCase() + provider.slice(1)}\n<b>User ID:</b> <code>${user?.id || '-'}</code>\n<b>Waktu:</b> ${now.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'long', timeStyle: 'medium' })}`)
      } catch (err) {
        console.error('Gagal mengirim log telegram:', err)
      }
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
