import { getRealtimeTopPaths } from '@/lib/ga-top-paths';

export async function GET(req: Request) {
  if (
    req.headers.get('x-internal-secret') !==
    process.env.INTERNAL_EDGE_SECRET
  ) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const paths = await getRealtimeTopPaths(100);

    return Response.json(
      {
        generatedAt: new Date().toISOString(),
        paths,
        source: 'ga-realtime-top-paths',
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error: any) {
    console.error('Error in realtime-top-paths route:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch realtime top paths',
        details: error.message || String(error),
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0'
        } 
      }
    );
  }
}

