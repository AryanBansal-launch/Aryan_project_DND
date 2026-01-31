import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Contentstack Management API configuration
const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
const MANAGEMENT_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN;
const ENVIRONMENT = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT;
const REGION = process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'us';

// Base URL based on region
const BASE_URLS: Record<string, string> = {
  us: 'api.contentstack.io',
  eu: 'eu-api.contentstack.com',
  'azure-na': 'azure-na-api.contentstack.com'
};

const BASE_URL = BASE_URLS[REGION] || BASE_URLS.us;
const CONTENT_TYPE_UID = 'job';

interface JobFormData {
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  company: string; // Company UID
  location: string;
  type: string;
  experience: string;
  category: string;
  status?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: string;
  };
  benefits?: string[];
  skills?: Array<{ skill: string; proficiency: string }>;
  is_remote?: boolean;
  is_urgent?: boolean;
  expires_at?: string;
  contact_email?: string;
  application_url?: string;
}

// Create job entry in Contentstack
async function createJobEntry(jobData: JobFormData): Promise<any> {
  const entryData: any = {
    title: jobData.title,
    description: jobData.description || '',
    requirements: jobData.requirements || '',
    responsibilities: jobData.responsibilities || '',
    company: jobData.company,
    location: jobData.location,
    type: jobData.type,
    experience: jobData.experience,
    category: jobData.category || 'General',
    status: jobData.status || 'active',
    posted_at: new Date().toISOString().split('T')[0],
    is_remote: jobData.is_remote || false,
    is_urgent: jobData.is_urgent || false,
    applications_count: 0,
    views_count: 0,
  };

  // Add optional fields
  if (jobData.salary) {
    entryData.salary = jobData.salary;
  }

  if (jobData.benefits && jobData.benefits.length > 0) {
    entryData.benefits = jobData.benefits;
  }

  if (jobData.skills && jobData.skills.length > 0) {
    entryData.skills = jobData.skills;
  }

  if (jobData.expires_at) {
    entryData.expires_at = jobData.expires_at;
  } else {
    // Default to 60 days from now
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 60);
    entryData.expires_at = futureDate.toISOString().split('T')[0];
  }

  if (jobData.contact_email) {
    entryData.contact_email = jobData.contact_email;
  }

  if (jobData.application_url) {
    entryData.application_url = jobData.application_url;
  }

  const postData = JSON.stringify({
    entry: entryData
  });

  const url = `https://${BASE_URL}/v3/content_types/${CONTENT_TYPE_UID}/entries`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'api_key': API_KEY!,
      'authorization': MANAGEMENT_TOKEN!,
      'Content-Type': 'application/json',
    },
    body: postData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create job: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

// Publish job entry
async function publishJobEntry(entryUid: string): Promise<any> {
  const postData = JSON.stringify({
    entry: {
      environments: [ENVIRONMENT],
      locales: ['en-us']
    },
    rules: {
      approvals: false
    },
    scheduled_at: null,
    publish_with_reference: true
  });

  const url = `https://${BASE_URL}/v3/content_types/${CONTENT_TYPE_UID}/entries/${entryUid}/publish`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'api_key': API_KEY!,
      'authorization': MANAGEMENT_TOKEN!,
      'Content-Type': 'application/json',
    },
    body: postData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to publish job: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

// POST - Create a new job
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate environment variables
    if (!API_KEY || !MANAGEMENT_TOKEN || !ENVIRONMENT) {
      return NextResponse.json(
        { error: 'Contentstack configuration missing' },
        { status: 500 }
      );
    }

    const body: JobFormData = await request.json();

    // Validate required fields
    if (!body.title || !body.location || !body.type || !body.experience || !body.company) {
      return NextResponse.json(
        { error: 'Missing required fields: title, location, type, experience, and company are required' },
        { status: 400 }
      );
    }

    // Create the job entry
    const createdEntry = await createJobEntry(body);
    
    if (!createdEntry.entry || !createdEntry.entry.uid) {
      return NextResponse.json(
        { error: 'Failed to create job entry' },
        { status: 500 }
      );
    }

    // Publish the entry
    try {
      await publishJobEntry(createdEntry.entry.uid);
    } catch (publishError) {
      console.error('Failed to publish job, but entry was created:', publishError);
      // Return success but note that publishing failed
      return NextResponse.json({
        success: true,
        message: 'Job created but publishing failed',
        entry: createdEntry.entry,
        warning: 'Job was created but not published. Please publish manually in Contentstack.'
      }, { status: 201 });
    }

    return NextResponse.json({
      success: true,
      message: 'Job created and published successfully',
      entry: createdEntry.entry
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create job',
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET - Get API info
export async function GET() {
  return NextResponse.json({
    message: 'Jobs API',
    endpoints: {
      POST: 'Create a new job entry in Contentstack'
    },
    requiredFields: [
      'title',
      'location',
      'type',
      'experience',
      'company'
    ],
    optionalFields: [
      'description',
      'requirements',
      'responsibilities',
      'category',
      'status',
      'salary',
      'benefits',
      'skills',
      'is_remote',
      'is_urgent',
      'expires_at',
      'contact_email',
      'application_url'
    ]
  });
}

