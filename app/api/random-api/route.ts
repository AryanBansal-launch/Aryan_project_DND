import { NextResponse } from 'next/server';

const API_URL = 'https://jsonplaceholder.typicode.com/posts/1';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const res = await fetch(API_URL, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    let data: unknown;
    const contentType = res.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    const payload = {
      source: API_URL,
      status: res.status,
      ok: res.ok,
      data,
    };

    // Log the response (server-side)
    const userId = typeof data === 'object' && data !== null && 'userId' in data
      ? (data as { userId: number }).userId
      : null;
    console.log('[random-api] Called:', API_URL);
    console.log('[random-api] Status:', res.status, res.statusText);
    console.log('[random-api] User ID:', userId);

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[random-api] Error calling', API_URL, message);
    return NextResponse.json(
      { error: 'Failed to fetch from external API', details: message },
      {
        status: 502,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          Pragma: 'no-cache',
        },
      }
    );
  }
}
