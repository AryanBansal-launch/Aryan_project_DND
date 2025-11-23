import { NextRequest, NextResponse } from "next/server";
import { getPersonalizedBanner, PersonalizationContext } from "@/lib/contentstack";

/**
 * API route to fetch personalized banner content with user context
 * This allows client-side personalization based on real-time user behavior
 * 
 * Usage:
 * GET /api/personalized-banner?timeOnSite=45&hasClickedApplyNow=false&userSegment=users_not_applied_30s
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extract user context from query parameters
    const userContext: PersonalizationContext = {
      timeOnSite: searchParams.get("timeOnSite") 
        ? parseInt(searchParams.get("timeOnSite") as string, 10) 
        : undefined,
      hasClickedApplyNow: searchParams.get("hasClickedApplyNow") === "true",
      pageViews: searchParams.get("pageViews") 
        ? parseInt(searchParams.get("pageViews") as string, 10) 
        : undefined,
      userId: searchParams.get("userId") || undefined,
      userEmail: searchParams.get("userEmail") || undefined,
      userSegment: searchParams.get("userSegment") || undefined,
    };

    // Get locale from query params or headers
    const locale = searchParams.get("locale") || undefined;

    // Fetch personalized banner with user context
    const bannerData = await getPersonalizedBanner(userContext, locale);

    if (!bannerData) {
      return NextResponse.json(
        { error: "No personalized banner found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: bannerData,
    });
  } catch (error: any) {
    console.error("Error fetching personalized banner:", error);
    return NextResponse.json(
      { error: "Failed to fetch personalized banner", message: error.message },
      { status: 500 }
    );
  }
}

