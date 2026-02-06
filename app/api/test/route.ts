// app/api/headers/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Convert headers iterator to a plain object
  const headers = Object.fromEntries(request.headers.entries());

  // Print headers to the server logs
  console.log('Incoming request headers:', headers);

  // Return headers in the response (for easy inspection)
  return NextResponse.json({
    headers,
  });
}
