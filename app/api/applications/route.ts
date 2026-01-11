import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserApplications, getApplicationById, deleteApplication, updateApplicationStatus } from "@/lib/users";

// GET - Fetch user's applications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in to view applications" },
        { status: 401 }
      );
    }

    const applications = await getUserApplications(session.user.email);

    return NextResponse.json({
      success: true,
      applications,
      count: applications.length
    });

  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an application
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('id');

    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    // Verify the application belongs to this user
    const application = await getApplicationById(applicationId);
    if (!application || application.email.toLowerCase() !== session.user.email.toLowerCase()) {
      return NextResponse.json(
        { error: "Application not found or unauthorized" },
        { status: 404 }
      );
    }

    const deleted = await deleteApplication(applicationId, session.user.email);

    if (!deleted) {
      return NextResponse.json(
        { error: "Failed to delete application" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}

// PATCH - Update application status (for admin or user withdrawing)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { applicationId, status, notes } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: "Application ID and status are required" },
        { status: 400 }
      );
    }

    // Verify the application exists and belongs to this user (for withdrawal)
    const application = await getApplicationById(applicationId);
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Users can only withdraw their own applications
    if (application.email.toLowerCase() !== session.user.email.toLowerCase()) {
      return NextResponse.json(
        { error: "Unauthorized to modify this application" },
        { status: 403 }
      );
    }

    const updated = await updateApplicationStatus(applicationId, status, notes);

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update application" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application updated successfully"
    });

  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}

