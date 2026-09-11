import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // If user visits any page with ?clear_cookies=1 or ?clear=1, force browser to clear cookies
  if (request.nextUrl.searchParams.has('clear_cookies') || request.nextUrl.searchParams.has('clear')) {
    const url = new URL(request.nextUrl.pathname, request.url);
    const response = NextResponse.redirect(url);
    // Remove "storage" from Clear-Site-Data because it clears Next.js 16 Segment Cache (Cache API) and breaks PPR fetch
    response.headers.set('Clear-Site-Data', '"cookies"');
    return response;
  }

  // Protect /admin routes (except /admin/login)
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const adminSession = request.cookies.get('laporkuy_admin_session');
    if (!adminSession || adminSession.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
