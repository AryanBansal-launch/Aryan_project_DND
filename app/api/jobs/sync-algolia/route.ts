// API Route: Sync all jobs from Contentstack to Algolia
// Call this endpoint to bulk sync all jobs to Algolia

import { NextRequest, NextResponse } from 'next/server';
import { algoliasearch } from 'algoliasearch';
import { getJobs } from '@/lib/contentstack';

// Initialize Algolia with Admin API Key (for write operations)
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const adminKey = process.env.ALGOLIA_ADMIN_KEY; // Need admin key for writing
const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'job';

export async function POST(request: NextRequest) {
  try {
    // Check for admin key
    if (!appId || !adminKey) {
      return NextResponse.json({
        error: 'Algolia admin credentials not configured',
        message: 'Please add ALGOLIA_ADMIN_KEY to your environment variables',
      }, { status: 500 });
    }

    // Initialize Algolia client with admin key
    const client = algoliasearch(appId, adminKey);

    // Fetch all jobs from Contentstack
    const jobs = await getJobs();
    
    if (!jobs || jobs.length === 0) {
      return NextResponse.json({
        error: 'No jobs found',
        message: 'No jobs found in Contentstack',
      }, { status: 404 });
    }

    // Transform jobs for Algolia
    const algoliaRecords = jobs.map((job: any) => {
      // Extract skill names as a simple array for better searchability
      const skillNames = (job.skills || []).map((s: any) => s.skill).filter(Boolean);
      
      return {
        objectID: job.uid,
        title: job.title,
        description: job.description?.replace(/<[^>]*>/g, '') || '', // Strip HTML
        requirements: job.requirements?.replace(/<[^>]*>/g, '') || '',
        responsibilities: job.responsibilities?.replace(/<[^>]*>/g, '') || '',
        location: job.location,
        type: job.type,
        experience: job.experience,
        category: job.category,
        status: job.status,
        // Keep original skills array for display
        skills: job.skills || [],
        // Add flattened skill names for search (THIS IS THE KEY FIX!)
        skillNames: skillNames,
        // Also add as a searchable string
        skillsText: skillNames.join(' '),
        benefits: job.benefits || [],
        salary: job.salary || null,
        is_remote: job.is_remote || false,
        is_urgent: job.is_urgent || false,
        posted_at: job.posted_at,
        expires_at: job.expires_at,
        contact_email: job.contact_email,
        applications_count: job.applications_count || 0,
        views_count: job.views_count || 0,
        created_at: job.created_at,
        updated_at: job.updated_at,
        // Company info (if available)
        company: Array.isArray(job.company) && job.company[0] ? {
          uid: job.company[0].uid,
          title: job.company[0].title,
          location: job.company[0].location,
        } : null,
      };
    });

    // Save records to Algolia
    const result = await client.saveObjects({
      indexName: indexName,
      objects: algoliaRecords,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${algoliaRecords.length} jobs to Algolia`,
      result: result,
      syncedJobs: algoliaRecords.map(j => ({ id: j.objectID, title: j.title, skills: j.skillNames })),
    });

  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({
      error: 'Sync failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// GET endpoint for info
export async function GET() {
  return NextResponse.json({
    message: 'Job Sync API',
    usage: {
      POST: 'Sync all jobs from Contentstack to Algolia',
    },
    requirements: [
      'NEXT_PUBLIC_ALGOLIA_APP_ID',
      'ALGOLIA_ADMIN_KEY (Admin API Key from Algolia)',
      'NEXT_PUBLIC_ALGOLIA_INDEX_NAME',
    ],
  });
}

