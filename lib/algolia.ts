// Algolia Search Client Configuration
// This file provides the Algolia client for searching jobs based on user skills

import { liteClient as algoliasearch } from 'algoliasearch/lite';

// Initialize the Algolia client with environment variables
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;
const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'job';

if (!appId || !searchKey) {
  console.warn('Algolia credentials not configured. Job recommendations will be disabled.');
}

// Create the search client (lightweight, search-only)
export const searchClient = appId && searchKey 
  ? algoliasearch(appId, searchKey) 
  : null;

// Index name for jobs
export const jobsIndexName = indexName;

// Types for Algolia job records
export interface AlgoliaJobRecord {
  objectID: string;
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  location: string;
  type: string;
  experience: string;
  category: string;
  status: string;
  skills: Array<{ skill: string; proficiency: string }>;
  benefits?: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  is_remote: boolean;
  is_urgent: boolean;
  posted_at: string;
  expires_at?: string;
  contact_email?: string;
  applications_count?: number;
  views_count?: number;
  created_at: string;
  updated_at: string;
}

// Extended type with match score
export interface AlgoliaJobRecordWithScore extends AlgoliaJobRecord {
  matchScore: number;
  matchingSkillsCount: number;
}

// Interface for search results
export interface JobSearchResult {
  hits: AlgoliaJobRecord[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  query: string;
}

// Interface for recommendation options
export interface RecommendationOptions {
  skills: string[];
  limit?: number;
  filters?: string;
}

/**
 * Search for jobs matching the given skills
 * Uses fuzzy matching and synonyms configured in Algolia
 */
export async function searchJobsBySkills(
  options: RecommendationOptions
): Promise<JobSearchResult | null> {
  if (!searchClient) {
    console.warn('Algolia not configured');
    return null;
  }

  const { skills, limit = 10, filters } = options;

  // Join skills with spaces for multi-word search
  // Algolia will use typo tolerance and synonyms for fuzzy matching
  const query = skills.join(' ');

  try {
    // Using Algolia v5 API - search method
    console.log('Searching Algolia with query:', query, 'skills:', skills);
    
    const response = await searchClient.search<AlgoliaJobRecord>({
      requests: [
        {
          indexName: jobsIndexName,
          query: query,
          hitsPerPage: limit,
          // Don't filter by status - it might not be configured
          // Enable typo tolerance for fuzzy matching
          typoTolerance: true,
          // KEY FIX: Make all search terms optional (OR logic)
          // Jobs matching ANY skill will be returned, ranked by relevance
          optionalWords: skills,
        },
      ],
    });
    
    console.log('Algolia response - hits:', response.results[0] && 'hits' in response.results[0] ? response.results[0].hits.length : 0);

    // Get the first result (we only made one request)
    const result = response.results[0];
    
    // Type guard for search results
    if ('hits' in result) {
      return {
        hits: result.hits as AlgoliaJobRecord[],
        nbHits: result.nbHits || 0,
        page: result.page || 0,
        nbPages: result.nbPages || 0,
        hitsPerPage: result.hitsPerPage || limit,
        query: query,
      };
    }

    return null;
  } catch (error) {
    console.error('Algolia search error:', error);
    return null;
  }
}

/**
 * Get job recommendations based on user skills
 * Returns jobs sorted by relevance (skill match score)
 */
export async function getJobRecommendations(
  userSkills: string[],
  limit: number = 6
): Promise<AlgoliaJobRecordWithScore[]> {
  if (!userSkills || userSkills.length === 0) {
    return [];
  }

  const results = await searchJobsBySkills({
    skills: userSkills,
    limit,
    filters: 'status:active',
  });

  if (!results) {
    return [];
  }

  // Calculate match score for each job
  const jobsWithScore: AlgoliaJobRecordWithScore[] = results.hits.map(job => {
    const jobSkills = job.skills?.map(s => s.skill.toLowerCase()) || [];
    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    
    // Count matching skills
    const matchingSkills = userSkillsLower.filter(skill => 
      jobSkills.some(jobSkill => 
        jobSkill.includes(skill) || skill.includes(jobSkill)
      )
    );

    const matchScore = matchingSkills.length / userSkills.length;
    
    return {
      ...job,
      matchScore,
      matchingSkillsCount: matchingSkills.length,
    };
  });

  // Sort by match score (descending)
  return jobsWithScore.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Check if Algolia is properly configured
 */
export function isAlgoliaConfigured(): boolean {
  return Boolean(searchClient);
}
