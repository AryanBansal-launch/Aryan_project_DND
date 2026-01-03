export default async function handler(request, context) {
  const url = new URL(request.url);

  if (url.pathname === "/edge") {
    try {
      const siteOrigin = context.env.SITE_ORIGIN || "";
      const internalSecret = context.env.INTERNAL_EDGE_SECRET || "";
      
      const res = await fetch(
        `${siteOrigin}/api/internal/top-paths`,
        {
          headers: {
            "x-internal-secret": internalSecret,
          },
        }
      );

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch (e) {
          errorData = { error: "Failed to fetch top paths", status: res.status };
        }
        return new Response(JSON.stringify({ 
          urls: [], 
          error: errorData.error || "Upstream error",
          details: errorData.details || "No details provided",
          status: res.status 
        }), { 
          status: 500,
          headers: { "content-type": "application/json" }
        });
      }

      const data = await res.json();
      const paths = data.paths || [];

      const urls = [...new Set(paths)]
        .slice(0, 100)
        .map((path) => `${siteOrigin}${path}`);

      return new Response(
        JSON.stringify({
          environment: context.env.LAUNCH_ENV || "production",
          urls,
          source: "ga-top-paths",
          generatedAt: new Date().toISOString(),
        }),
        {
          headers: { "content-type": "application/json" },
        }
      );
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
  }

  // Default: Pass through to the origin
  return fetch(request);
}
