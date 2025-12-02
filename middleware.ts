import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // const supabase = await createClient();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  // const { pathname } = request.nextUrl;
  //
  // if (user) {
  //   if (pathname === '/sign-in' || pathname === '/sign-up') {
  //     return NextResponse.redirect(new URL('/dashboard', request.url));
  //   }
  // } else {
  //   if (pathname.startsWith('/dashboard')) {
  //     return NextResponse.redirect(new URL('/sign-in', request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
