export default async function handler(request, context) {
  const url = new URL(request.url);

  // Extract Launch geolocation headers (automatically injected by Launch Edge)
  const geoHeaders = {
    country: request.headers.get('visitor-ip-country') || '',
    region: request.headers.get('visitor-ip-region') || '',
    city: request.headers.get('visitor-ip-city') || '',
  };

  // Endpoint to get visitor geolocation info
  if (url.pathname === "/edge/geo") {
    return new Response(JSON.stringify({
      country: geoHeaders.country,
      region: geoHeaders.region,
      city: geoHeaders.city,
      timestamp: new Date().toISOString(),
    }), {
      headers: { 
        "content-type": "application/json",
        "Cache-Control": "no-store, max-age=0"
      }
    });
  }

  if (url.pathname === "/edge") {
    try {
      const siteOrigin = context.env.SITE_ORIGIN || "";
      const internalSecret = context.env.INTERNAL_EDGE_SECRET || "";
      
      const fetchUrl = `${siteOrigin}/api/internal/realtime-top-paths`;
      const headers = {
        "x-internal-secret": internalSecret,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
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
          headers: { 
            "content-type": "application/json",
            "Cache-Control": "no-store, max-age=0"
          }
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
          headers: { 
            "content-type": "application/json",
            "Cache-Control": "no-store, max-age=0"
          },
        }
      );
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 
          "content-type": "application/json",
          "Cache-Control": "no-store, max-age=0"
        },
      });
    }
  }

  // Default: Pass through to the origin with geolocation headers
  // Clone the request and add geo headers so the Next.js app can use them
  const modifiedHeaders = new Headers(request.headers);
  
  // Forward geolocation to the app (normalized header names)
  if (geoHeaders.country) modifiedHeaders.set('x-visitor-country', geoHeaders.country);
  if (geoHeaders.region) modifiedHeaders.set('x-visitor-region', geoHeaders.region);
  if (geoHeaders.city) modifiedHeaders.set('x-visitor-city', geoHeaders.city);

  const modifiedRequest = new Request(request.url, {
    method: request.method,
    headers: modifiedHeaders,
    body: request.body,
    redirect: request.redirect,
  });

  return fetch(modifiedRequest);
}
