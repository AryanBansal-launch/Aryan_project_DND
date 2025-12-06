// API Route: Job Recommendations based on User Skills
// Uses Algolia search with fuzzy matching to find relevant jobs

import { NextRequest, NextResponse } from 'next/server';
import { getJobRecommendations, isAlgoliaConfigured, AlgoliaJobRecordWithScore } from '@/lib/algolia';

export interface RecommendedJob {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  experience: string;
  category: string;
  skills: Array<{ skill: string; proficiency: string }>;
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  isRemote: boolean;
  isUrgent: boolean;
  postedAt: string;
  matchScore: number;
  matchingSkillsCount: number;
}

// Transform Algolia record to our app's Job format
function transformAlgoliaJob(job: AlgoliaJobRecordWithScore): RecommendedJob {
  return {
    id: job.objectID,
    title: job.title,
    description: job.description,
    location: job.location,
    type: job.type,
    experience: job.experience,
    category: job.category,
    skills: job.skills || [],
    salary: job.salary,
    isRemote: job.is_remote,
    isUrgent: job.is_urgent,
    postedAt: job.posted_at,
    matchScore: job.matchScore || 0,
    matchingSkillsCount: job.matchingSkillsCount || 0,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Check if Algolia is configured
    if (!isAlgoliaConfigured()) {
      return NextResponse.json(
        { 
          error: 'Search service not configured',
          recommendations: [],
          message: 'Algolia is not configured. Please add NEXT_PUBLIC_ALGOLIA_APP_ID and NEXT_PUBLIC_ALGOLIA_SEARCH_KEY to your environment variables.'
        },
        { status: 503 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { skills, limit = 6 } = body;

    // Validate skills
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { 
          error: 'Invalid request',
          message: 'Please provide an array of skills',
          recommendations: []
        },
        { status: 400 }
      );
    }

    // Clean and filter skills
    const cleanedSkills = skills
      .filter((skill: unknown) => typeof skill === 'string' && skill.trim().length > 0)
      .map((skill: string) => skill.trim());

    if (cleanedSkills.length === 0) {
      return NextResponse.json(
        { 
          error: 'Invalid request',
          message: 'No valid skills provided',
          recommendations: []
        },
        { status: 400 }
      );
    }

    // Get job recommendations from Algolia
    const recommendations = await getJobRecommendations(cleanedSkills, limit);

    // Transform to our app's format
    const transformedJobs = recommendations.map(transformAlgoliaJob);

    return NextResponse.json({
      success: true,
      recommendations: transformedJobs,
      totalFound: transformedJobs.length,
      searchedSkills: cleanedSkills,
    });

  } catch (error) {
    console.error('Error getting job recommendations:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        recommendations: []
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const skillsParam = searchParams.get('skills');
  const limit = parseInt(searchParams.get('limit') || '6');

  if (!skillsParam) {
    return NextResponse.json({
      message: 'Job Recommendations API',
      usage: {
        POST: {
          body: { skills: ['React', 'TypeScript'], limit: 6 },
          description: 'Get job recommendations based on skills'
        },
        GET: {
          query: '?skills=React,TypeScript&limit=6',
          description: 'Get job recommendations (skills comma-separated)'
        }
      },
      algoliaConfigured: isAlgoliaConfigured(),
    });
  }

  // Parse comma-separated skills
  const skills = skillsParam.split(',').map(s => s.trim()).filter(Boolean);

  // Reuse POST logic
  const mockRequest = {
    json: async () => ({ skills, limit })
  } as NextRequest;

  return POST(mockRequest);
}

