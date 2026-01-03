export default async function handler(request, context) {
  const url = new URL(request.url);

  if (url.pathname === "/edge") {
    try {
      const siteOrigin = context.env.SITE_ORIGIN || "";
      const internalSecret = context.env.INTERNAL_EDGE_SECRET || "";
      
      const fetchUrl = `${siteOrigin}/api/internal/top-paths`;
      const headers = {
        "x-internal-secret": internalSecret,
      };

      if (context.env.LAUNCH_ENV === "testing") {
        headers["Authorization"] = "Basic " + btoa("aryan:aryan");
      }

      const res = await fetch(fetchUrl, { headers });

      if (!res.ok) {
        let errorData;
        let responseText = "";
        try {
          responseText = await res.text();
          errorData = JSON.parse(responseText);
        } catch (e) {
          errorData = { 
            error: "Failed to fetch top paths", 
            status: res.status,
            rawResponse: responseText.slice(0, 200)
          };
        }
        return new Response(JSON.stringify({ 
          urls: [], 
          error: errorData.error || "Upstream error",
          details: errorData.details || "No details provided",
          status: res.status,
          attemptedUrl: fetchUrl
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
