import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      jobTitle,
      companyName,
      userEmail,
      userName,
      coverLetter,
      portfolio,
      expectedSalary,
      availability,
      additionalInfo,
      resumeFileName
    } = body;

    // Validate required fields
    if (!userEmail || !userName || !jobTitle || !companyName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prepare data for Contentstack Automate
    const automatePayload = {
      recipient_email: userEmail,
      recipient_name: userName,
      job_title: jobTitle,
      company_name: companyName,
      cover_letter: coverLetter || "Not provided",
      portfolio: portfolio || "Not provided",
      expected_salary: expectedSalary || "Not specified",
      availability: availability || "Not specified",
      additional_info: additionalInfo || "None",
      resume_file: resumeFileName || "Uploaded",
      application_date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
      application_time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    // Get the Contentstack Automate webhook URL from environment
    const webhookUrl = process.env.CONTENTSTACK_AUTOMATE_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("CONTENTSTACK_AUTOMATE_WEBHOOK_URL not configured");
      // Still return success to user, but log the error
      return NextResponse.json({
        success: true,
        message: "Application submitted successfully"
      });
    }

    // Trigger Contentstack Automate webhook
    const automateResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(automatePayload),
    });

    if (!automateResponse.ok) {
      console.error("Contentstack Automate webhook failed:", await automateResponse.text());
      // Still return success to user
    }

    // In a real application, you would also:
    // 1. Save the application to a database
    // 2. Upload the resume file to storage
    // 3. Create an Application entry in Contentstack

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully. You will receive a confirmation email shortly.",
      applicationId: `APP-${Date.now()}` // Generate a proper ID in production
    });

  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

