import { NextRequest, NextResponse } from 'next/server';

const DASHBOARD_ROUTES = ['/overview', '/investments', '/deposit', '/withdraw', '/transactions', '/notifications', '/settings'];
const ADMIN_ROUTES     = ['/admin/dashboard', '/admin/users', '/admin/plans', '/admin/deposits', '/admin/withdrawals', '/admin/transactions', '/admin/wallets', '/admin/stocks', '/admin/testimonials', '/admin/faqs', '/admin/settings'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Token sources ────────────────────────────────────────────────
  const userToken  = request.cookies.get('auth_token')?.value   // regular user
    || request.cookies.get('access_token')?.value;               // fallback (httpOnly from backend)
  const adminToken = request.cookies.get('admin_token')?.value;  // admin (set by admin-api.ts)

  // ─── Route classification ─────────────────────────────────────────
  const isDashboard  = DASHBOARD_ROUTES.some(r => pathname.startsWith(r));
  const isAdminRoute = ADMIN_ROUTES.some(r => pathname.startsWith(r));
  const isAdminLogin = pathname === '/admin/login';
  const isUserAuth   = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'].includes(pathname);

  // ─── Admin routes: require admin_token ────────────────────────────
  if (isAdminRoute && !adminToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // ─── User dashboard routes: require user token ────────────────────
  if (isDashboard && !userToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ─── Redirect admin away from admin login if already authed ───────
  if (isAdminLogin && adminToken) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // ─── Redirect user away from auth pages if already logged in ──────
  // NOTE: do NOT redirect away from /admin/login based on userToken
  // (admin may not have a userToken at all)
  if (isUserAuth && userToken) {
    return NextResponse.redirect(new URL('/overview', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)'],
};