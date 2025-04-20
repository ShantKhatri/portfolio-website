import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protect admin routes
  if (path.startsWith('/admin')) {
    // Check for authentication - this is a simplified example
    // In a real app, you'd verify a session token
    const isAuthenticated = request.cookies.get('admin_authenticated')?.value === 'true';
    
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};