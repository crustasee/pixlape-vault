import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'pixlape_admin_token';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const isAuthPage = pathname === '/auth' || pathname === '/admin/login';
  const isAdminRoute = pathname.startsWith('/admin') && !isAuthPage;

  // Protect admin routes
  if (isAdminRoute) {
    if (!token) {
      const redirectUrl = new URL('/auth', request.url);
      redirectUrl.searchParams.set('redirect', pathname + search);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If already logged in and accessing /auth, redirect to /admin
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/auth'],
};
