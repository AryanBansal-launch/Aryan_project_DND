import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';


function isValidCredentials(authHeader: string | null): boolean {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  try {
    // Extract and decode the base64 credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = atob(base64Credentials);
    const [username, password] = credentials.split(':');

    // Validate against configured credentials
    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
  } catch (error) {
    console.error('Error parsing auth header:', error);
    return false;
  }
}


function unauthorizedResponse(): NextResponse {
  return new NextResponse('Authentication required to access admin panel', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Area", charset="UTF-8"',
      'Content-Type': 'text/plain',
    },
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization');

    // Check if valid credentials are provided
    if (!isValidCredentials(authHeader)) {
      return unauthorizedResponse();
    }

    // Credentials are valid, allow access
    console.log(`[Edge Function] Admin access granted for: ${pathname}`);
  }

  // Continue to the requested page
  return NextResponse.next();
}

// Configure which routes this middleware applies to
export const config = {
  matcher: [
    // Match /admin and all sub-routes
    '/admin/:path*',
    '/admin',
  ],
};

