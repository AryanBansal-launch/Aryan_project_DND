import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const webhookUrl = "https://webhook.site/345f95b7-da09-44c2-8f6b-2dc246c2af34";

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Test request from Next.js API",
        timestamp: new Date().toISOString(),
      }),
    });

    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    return NextResponse.json({
      success: true,
      status: response.status,
      statusText: response.statusText,
      data: responseData,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from URL", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

