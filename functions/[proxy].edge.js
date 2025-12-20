import { jsonResponse } from "@aryanbansal-launch/edge-utils";

export default function handler(request) {
  const url = new URL(request.url);

  // Only handle one test route
  if (url.pathname === "/edge-test") {
    return jsonResponse({
      ok: true,
      message: "Edge utils package is working 🎉",
      path: url.pathname
    });
  }

  // Let everything else pass through
  return fetch(request);
}
