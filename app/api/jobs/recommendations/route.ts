// API Route: Job Recommendations based on User Skills & Location
// Uses Algolia search with fuzzy matching to find relevant jobs
// Supports geolocation-based filtering via Launch headers

import { NextRequest, NextResponse } from 'next/server';
import { getJobRecommendations, isAlgoliaConfigured, AlgoliaJobRecordWithScore } from '@/lib/algolia';

// Helper to extract visitor geolocation from Launch headers
function getVisitorGeolocation(request: NextRequest) {
  return {
    country: request.headers.get('x-visitor-country') || request.headers.get('visitor-ip-country') || '',
    region: request.headers.get('x-visitor-region') || request.headers.get('visitor-ip-region') || '',
    city: request.headers.get('x-visitor-city') || request.headers.get('visitor-ip-city') || '',
  };
}

// Map country codes to common location names for matching
const COUNTRY_LOCATION_MAP: Record<string, string[]> = {
  'US': ['United States', 'USA', 'US', 'America', 'Remote (US)', 'United States of America'],
  'IN': ['India', 'IN', 'Remote (India)', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai'],
  'GB': ['United Kingdom', 'UK', 'GB', 'England', 'London', 'Remote (UK)'],
  'CA': ['Canada', 'CA', 'Toronto', 'Vancouver', 'Remote (Canada)'],
  'DE': ['Germany', 'DE', 'Berlin', 'Munich', 'Remote (Germany)'],
  'AU': ['Australia', 'AU', 'Sydney', 'Melbourne', 'Remote (Australia)'],
  'SG': ['Singapore', 'SG', 'Remote (Singapore)'],
  'NL': ['Netherlands', 'NL', 'Amsterdam', 'Remote (Netherlands)'],
  'FR': ['France', 'FR', 'Paris', 'Remote (France)'],
};

// Calculate location match score
function calculateLocationScore(jobLocation: string, geo: { country: string; region: string; city: string }): number {
  if (!jobLocation) return 0;
  
  const locationLower = jobLocation.toLowerCase();
  
  // Remote jobs get a base boost for everyone
  if (locationLower.includes('remote') && !locationLower.includes('(')) {
    return 0.3; // Slight boost for fully remote jobs
  }
  
  // Exact city match - highest score
  if (geo.city && locationLower.includes(geo.city.toLowerCase())) {
    return 1.0;
  }
  
  // Region/state match
  if (geo.region && locationLower.includes(geo.region.toLowerCase())) {
    return 0.8;
  }
  
  // Country match
  if (geo.country) {
    const countryVariants = COUNTRY_LOCATION_MAP[geo.country.toUpperCase()] || [geo.country];
    for (const variant of countryVariants) {
      if (locationLower.includes(variant.toLowerCase())) {
        return 0.6;
      }
    }
  }
  
  return 0;
}

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
  locationScore?: number; // Score based on visitor's geolocation
  isLocalJob?: boolean;   // Whether job matches visitor's location
}

// Transform Algolia record to our app's Job format with location scoring
function transformAlgoliaJob(
  job: AlgoliaJobRecordWithScore, 
  geo?: { country: string; region: string; city: string }
): RecommendedJob {
  const locationScore = geo ? calculateLocationScore(job.location, geo) : 0;
  
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
    locationScore,
    isLocalJob: locationScore >= 0.6,
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

    // Extract visitor geolocation from Launch headers
    const geo = getVisitorGeolocation(request);
    const hasGeoData = Boolean(geo.country || geo.region || geo.city);

    // Parse request body
    const body = await request.json();
    const { skills, limit = 6, prioritizeLocal = true } = body;

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

    // Get more job recommendations from Algolia to allow for location-based reranking
    const fetchLimit = hasGeoData && prioritizeLocal ? Math.max(limit * 2, 12) : limit;
    const recommendations = await getJobRecommendations(cleanedSkills, fetchLimit);

    // Transform with location scoring
    let transformedJobs = recommendations.map(job => transformAlgoliaJob(job, geo));

    // Re-rank based on combined skill + location score if geo data is available
    if (hasGeoData && prioritizeLocal) {
      transformedJobs = transformedJobs
        .map(job => ({
          ...job,
          // Combined score: skill match (60%) + location match (40%)
          combinedScore: (job.matchScore * 0.6) + ((job.locationScore || 0) * 0.4),
        }))
        .sort((a, b) => {
          // First, prioritize local jobs with good skill match
          if (a.isLocalJob && !b.isLocalJob && a.matchScore > 0.3) return -1;
          if (b.isLocalJob && !a.isLocalJob && b.matchScore > 0.3) return 1;
          // Then sort by combined score
          return (b as any).combinedScore - (a as any).combinedScore;
        })
        .slice(0, limit);
    } else {
      transformedJobs = transformedJobs.slice(0, limit);
    }

    // Count local jobs for analytics
    const localJobsCount = transformedJobs.filter(j => j.isLocalJob).length;

    return NextResponse.json({
      success: true,
      recommendations: transformedJobs,
      totalFound: transformedJobs.length,
      searchedSkills: cleanedSkills,
      // Geolocation metadata
      geolocation: hasGeoData ? {
        detected: true,
        country: geo.country,
        region: geo.region,
        city: geo.city,
        localJobsFound: localJobsCount,
      } : {
        detected: false,
        message: 'No geolocation data available',
      },
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
  const prioritizeLocal = searchParams.get('prioritizeLocal') !== 'false';

  // Extract geolocation for documentation
  const geo = getVisitorGeolocation(request);

  if (!skillsParam) {
    return NextResponse.json({
      message: 'Job Recommendations API with Geolocation Support',
      usage: {
        POST: {
          body: { skills: ['React', 'TypeScript'], limit: 6, prioritizeLocal: true },
          description: 'Get job recommendations based on skills, prioritizing local jobs'
        },
        GET: {
          query: '?skills=React,TypeScript&limit=6&prioritizeLocal=true',
          description: 'Get job recommendations (skills comma-separated)'
        }
      },
      algoliaConfigured: isAlgoliaConfigured(),
      geolocationHeaders: {
        description: 'Launch injects these headers automatically at the edge',
        detected: {
          country: geo.country || '(not detected)',
          region: geo.region || '(not detected)', 
          city: geo.city || '(not detected)',
        },
        headerNames: ['visitor-ip-country', 'visitor-ip-region', 'visitor-ip-city'],
      },
    });
  }

  // Parse comma-separated skills
  const skills = skillsParam.split(',').map(s => s.trim()).filter(Boolean);

  // Create a proper request object that passes headers through
  const mockRequest = {
    json: async () => ({ skills, limit, prioritizeLocal }),
    headers: request.headers, // Pass through original headers for geolocation
  } as NextRequest;

  return POST(mockRequest);
}

