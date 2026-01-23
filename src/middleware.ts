import { NextRequest, NextResponse } from 'next/server';
import { logtoClient } from './lib/logto';

const protectedRoutes = ['/generate', '/history', '/api/generate'];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    const { isAuthenticated } = await logtoClient.getLogtoContext(request);

    if (!isAuthenticated) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const signInUrl = new URL('/api/logto/sign-in', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
