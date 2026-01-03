import { getTopPaths } from '@/lib/ga-top-paths';

export async function GET(req: Request) {
  if (
    req.headers.get('x-internal-secret') !==
    process.env.INTERNAL_EDGE_SECRET
  ) {
    return new Response('Unauthorized', { status: 401 });
  }

  const paths = await getTopPaths(100);

  return Response.json({
    generatedAt: new Date().toISOString(),
    paths,
  });
}
