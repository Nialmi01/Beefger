import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect internal administrative and operational routes
  const isProtectedAdmin = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isProtectedRider = pathname.startsWith('/rider');

  if (isProtectedAdmin || isProtectedRider) {
    const sessionCookie = request.cookies.get('beffger_auth_session');

    if (!sessionCookie || !sessionCookie.value) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const parsed = JSON.parse(decodeURIComponent(sessionCookie.value));
      if (!parsed || !parsed.role) {
        throw new Error('Invalid session payload');
      }
    } catch (e) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete('beffger_auth_session');
      return res;
    }
  }

  // Security headers (OWASP Secure Headers)
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/rider/:path*'],
};
