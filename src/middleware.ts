import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // If user visits any page with ?clear_cookies=1 or ?clear=1, force browser to clear cookies
  if (request.nextUrl.searchParams.has('clear_cookies') || request.nextUrl.searchParams.has('clear')) {
    const url = new URL(request.nextUrl.pathname, request.url);
    const response = NextResponse.redirect(url);
    response.headers.set('Clear-Site-Data', '"cookies", "storage"');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
