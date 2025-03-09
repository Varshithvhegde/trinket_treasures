// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // For now, let's log and allow all requests
  console.log('Middleware accessed:', request.nextUrl.pathname);
  if (request.nextUrl.pathname === '/collections/getAllCollectionsList') {
    // Ensure this route is handled by the correct handler
    return NextResponse.next();
  }
  return NextResponse.next();
  
}

export const config = {
  matcher: '/admin/:path*',
};