// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // For now, let's log and allow all requests
  console.log('Middleware accessed:', request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};