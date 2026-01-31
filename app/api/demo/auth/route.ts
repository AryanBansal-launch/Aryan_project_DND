import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'demo';

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
    if (password === DEMO_PASSWORD) {
      // Set a secure cookie that expires in 24 hours
      const cookieStore = await cookies();
      cookieStore.set('demo_authenticated', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/demo',
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Demo auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Check if user is authenticated
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('demo_authenticated')?.value === 'true';

  return NextResponse.json({ authenticated: isAuthenticated });
}

