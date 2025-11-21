import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const webhookUrl = "https://webhook.site/345f95b7-da09-44c2-8f6b-2dc246c2af34";
    const referer = request.headers.get("referer") || request.headers.get("referrer") || null;

    const response = await fetch(webhookUrl, {
      headers: {
        "Referer": referer || "",
      },
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      status: response.status,
      referer: referer,
      data: data,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from URL", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

