import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/users';

// Webhook secret for verification (set in Contentstack webhook headers)
const WEBHOOK_SECRET = process.env.CONTENTSTACK_WEBHOOK_SECRET;

// Contentstack Automate webhook URL for sending emails
const AUTOMATE_EMAIL_WEBHOOK = process.env.CONTENTSTACK_NEW_JOB_EMAIL_WEBHOOK;

interface JobData {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  type?: string;
  experience?: string;
  category?: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  is_remote?: boolean;
  company?: Array<{ uid: string }>;
}

interface ContentstackWebhookPayload {
  event: string;
  module: string;
  data: {
    entry: JobData;
    content_type: {
      uid: string;
      title: string;
    };
  };
}

export async function POST(request: NextRequest) {
  console.log('[Webhook] Received new job notification');

  try {
    // Verify webhook secret (optional but recommended)
    const webhookSecret = request.headers.get('x-webhook-secret');
    if (WEBHOOK_SECRET && webhookSecret !== WEBHOOK_SECRET) {
      console.error('[Webhook] Invalid webhook secret');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const payload: ContentstackWebhookPayload = await request.json();
    console.log('[Webhook] Payload:', JSON.stringify(payload, null, 2));

    // Verify this is a job publish event
    if (payload.module !== 'entry' || payload.event !== 'publish') {
      console.log('[Webhook] Not a publish event, ignoring');
      return NextResponse.json({ message: 'Event ignored' });
    }

    // Check if it's the Job content type
    const contentTypeUid = payload.data?.content_type?.uid;
    if (contentTypeUid !== 'job') {
      console.log('[Webhook] Not a job content type, ignoring');
      return NextResponse.json({ message: 'Not a job, ignored' });
    }

    // Extract job details
    const job = payload.data.entry;
    const jobTitle = job.title || 'New Job';
    const jobLocation = job.location || 'Location not specified';
    const jobType = job.type || 'Full-time';
    const jobExperience = job.experience || 'Not specified';
    const isRemote = job.is_remote ? 'Yes' : 'No';
    
    // Format salary if available
    let salaryText = 'Competitive';
    if (job.salary) {
      salaryText = `${job.salary.currency}${job.salary.min.toLocaleString()} - ${job.salary.currency}${job.salary.max.toLocaleString()} ${job.salary.period}`;
    }

    console.log(`[Webhook] New job published: ${jobTitle}`);

    // Get all registered users from NeonDB
    const users = await getAllUsers();
    console.log(`[Webhook] Found ${users.length} registered users to notify`);

    if (users.length === 0) {
      console.log('[Webhook] No users to notify');
      return NextResponse.json({
        success: true,
        message: 'No users to notify',
        notifiedCount: 0,
      });
    }

    // Check if Automate webhook is configured
    if (!AUTOMATE_EMAIL_WEBHOOK) {
      console.warn('[Webhook] CONTENTSTACK_NEW_JOB_EMAIL_WEBHOOK not configured');
      return NextResponse.json({
        success: true,
        message: 'Email webhook not configured',
        users: users.length,
      });
    }

    // Send notification to each user via Contentstack Automate
    const notificationPromises = users.map(async (user) => {
      try {
        const emailPayload = {
          recipient_email: user.email,
          recipient_name: user.name,
          job_title: jobTitle,
          job_location: jobLocation,
          job_type: jobType,
          job_experience: jobExperience,
          job_salary: salaryText,
          is_remote: isRemote,
          job_uid: job.uid,
          job_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/jobs/${job.uid}`,
          notification_date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        };

        const response = await fetch(AUTOMATE_EMAIL_WEBHOOK, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailPayload),
        });

        if (!response.ok) {
          console.error(`[Webhook] Failed to notify ${user.email}:`, await response.text());
          return { email: user.email, success: false };
        }

        console.log(`[Webhook] Notified: ${user.email}`);
        return { email: user.email, success: true };
      } catch (error) {
        console.error(`[Webhook] Error notifying ${user.email}:`, error);
        return { email: user.email, success: false };
      }
    });

    // Wait for all notifications to be sent
    const results = await Promise.all(notificationPromises);
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`[Webhook] Notification complete: ${successCount} success, ${failCount} failed`);

    return NextResponse.json({
      success: true,
      message: `Notified ${successCount} users about new job: ${jobTitle}`,
      notifiedCount: successCount,
      failedCount: failCount,
      jobTitle,
      jobUid: job.uid,
    });

  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

// Also handle GET for webhook verification
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'New Job Webhook Endpoint',
    description: 'POST to this endpoint from Contentstack webhook when a job is published',
  });
}

