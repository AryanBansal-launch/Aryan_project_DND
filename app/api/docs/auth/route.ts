import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const DOCS_PASSWORD = process.env.DOCS_PASSWORD || 'docs';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Verify password
    if (password === DOCS_PASSWORD) {
      // Set a secure cookie that expires in 24 hours
      const cookieStore = await cookies();
      cookieStore.set('docs_authenticated', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/docs',
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Docs auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Check if user is authenticated
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('docs_authenticated')?.value === 'true';

  return NextResponse.json({ authenticated: isAuthenticated });
}

