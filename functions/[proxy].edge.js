import { protectWithBasicAuth } from "@aryanbansal-launch/edge-utils";

export default async function handler(request, context) {
  const url = new URL(request.url);

  // 1. Basic Auth for /admin routes using edge-utils
  if (url.pathname.startsWith("/admin")) {
    const adminUser = context.env.ADMIN_USERNAME || "admin";
    const adminPass = context.env.ADMIN_PASSWORD || "password";

    const authResponse = protectWithBasicAuth(request, adminUser, adminPass);
    if (authResponse) {
      return authResponse;
    }
  }

  // 2. Original top-paths logic
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
        return new Response(JSON.stringify({ urls: [] }), { status: 500 });
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
