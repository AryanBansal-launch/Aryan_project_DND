import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createNotificationInContentstack } from "@/lib/contentstack-notifications";
import { createApplication, hasUserApplied } from "@/lib/users";

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
      resumeFileName,
      jobId
    } = body;

    // Validate required fields
    if (!userEmail || !userName || !jobTitle || !companyName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user has already applied to this job
    if (jobId) {
      const alreadyApplied = await hasUserApplied(userEmail, jobId);
      if (alreadyApplied) {
        return NextResponse.json(
          { error: "You have already applied to this job" },
          { status: 409 }
        );
      }
    }

    // Generate unique application ID
    const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Save application to database
    const savedApplication = await createApplication({
      application_id: applicationId,
      email: userEmail,
      user_name: userName,
      job_id: jobId || `JOB-${Date.now()}`,
      job_title: jobTitle,
      company_name: companyName,
      status: 'submitted',
      cover_letter: coverLetter,
      portfolio: portfolio,
      expected_salary: expectedSalary,
      availability: availability,
      additional_info: additionalInfo,
      resume_file_name: resumeFileName,
    });

    if (!savedApplication) {
      console.error("Failed to save application to database");
      // Continue anyway - webhook and notification might still work
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
      application_id: applicationId,
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

    if (webhookUrl) {
      // Trigger Contentstack Automate webhook
      try {
        const automateResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(automatePayload),
        });

        if (!automateResponse.ok) {
          console.error("Contentstack Automate webhook failed:", await automateResponse.text());
        }
      } catch (webhookError) {
        console.error("Webhook error:", webhookError);
      }
    }

    // Create notification for the user in Contentstack
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        await createNotificationInContentstack(
          session.user.email,
          'application',
          'Application Submitted Successfully',
          `Your application for ${jobTitle} at ${companyName} has been submitted. A confirmation email has been sent to your inbox.`,
          {
            jobId: jobId || '',
            jobTitle,
            companyName,
            applicationId
          }
        );
      }
    } catch (notificationError) {
      // Log error but don't fail the application submission
      console.error("Error creating notification:", notificationError);
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully. You will receive a confirmation email shortly.",
      applicationId,
      application: savedApplication
    });

  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

