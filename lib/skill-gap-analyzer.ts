/**
 * Skill Gap Analyzer
 * 
 * Analyzes job market demand vs user skills to identify skill gaps
 * and recommend relevant learning resources.
 */

import { searchClient, jobsIndexName } from './algolia';
import { getLearningResources, ContentstackLearningResource } from './contentstack';

// Types
export interface SkillDemand {
  skill: string;
  jobCount: number;
  percentage: number;
}

export interface SkillGap {
  skill: string;
  jobCount: number;
  percentage: number;
  priority: 'high' | 'medium' | 'low';
  potentialJobIncrease: number;
}

export interface SkillGapAnalysis {
  userSkills: string[];
  totalJobs: number;
  matchingJobs: number;
  matchPercentage: number;
  topDemandedSkills: SkillDemand[];
  skillGaps: SkillGap[];
  recommendations: LearningRecommendation[];
  potentialMatchAfterLearning: number;
}

export interface LearningRecommendation {
  skill: string;
  priority: 'high' | 'medium' | 'low';
  jobsUnlocked: number;
  learningResources: ContentstackLearningResource[];
}

// Skill to technology mapping (for matching skills to learning resources)
const SKILL_TO_TECH_MAP: Record<string, string> = {
  // Next.js & React
  'next.js': 'nextjs',
  'nextjs': 'nextjs',
  'react': 'react',
  'react.js': 'react',
  'reactjs': 'react',
  
  // TypeScript & JavaScript
  'typescript': 'typescript',
  'javascript': 'typescript', // TypeScript covers JS
  'js': 'typescript',
  'ts': 'typescript',
  
  // Backend
  'node.js': 'nodejs',
  'nodejs': 'nodejs',
  'node': 'nodejs',
  'express': 'nodejs',
  'express.js': 'nodejs',
  
  // Python
  'python': 'python',
  'django': 'python',
  'flask': 'python',
  
  // DevOps & Cloud
  'docker': 'docker',
  'kubernetes': 'kubernetes',
  'k8s': 'kubernetes',
  'aws': 'aws',
  'amazon web services': 'aws',
  'azure': 'aws', // Map to cloud general
  'gcp': 'aws',
  'google cloud': 'aws',
  'ci/cd': 'devops',
  'jenkins': 'devops',
  'github actions': 'devops',
  'devops': 'devops',
  
  // Data & ML
  'machine learning': 'ai_ml',
  'ml': 'ai_ml',
  'ai': 'ai_ml',
  'tensorflow': 'ai_ml',
  'pytorch': 'ai_ml',
  'data science': 'ai_ml',
  
  // Database
  'sql': 'database',
  'mysql': 'database',
  'postgresql': 'database',
  'postgres': 'database',
  'mongodb': 'database',
  'nosql': 'database',
  'database': 'database',
  
  // Go
  'go': 'golang',
  'golang': 'golang',
  
  // Security
  'security': 'security',
  'cybersecurity': 'security',
  'owasp': 'security',
  
  // Architecture
  'microservices': 'microservices',
  'api design': 'microservices',
  'system design': 'microservices',
};

/**
 * Normalize skill name for comparison
 */
function normalizeSkill(skill: string): string {
  return skill.toLowerCase().trim();
}

/**
 * Get technology category for a skill
 */
function getSkillTechnology(skill: string): string | null {
  const normalized = normalizeSkill(skill);
  return SKILL_TO_TECH_MAP[normalized] || null;
}

/**
 * Analyze all jobs to get skill demand statistics
 */
export async function analyzeJobMarket(): Promise<{
  totalJobs: number;
  skillDemand: Map<string, number>;
  topSkills: SkillDemand[];
}> {
  if (!searchClient) {
    console.warn('Algolia not configured for job market analysis');
    return {
      totalJobs: 0,
      skillDemand: new Map(),
      topSkills: [],
    };
  }

  try {
    // Use Algolia v5 API - search method with requests array
    const response = await searchClient.search({
      requests: [
        {
          indexName: jobsIndexName,
          query: '',
          hitsPerPage: 1000,
          attributesToRetrieve: ['skillNames', 'skills'],
        },
      ],
    });

    const result = response.results[0];
    if (!('hits' in result)) {
      return { totalJobs: 0, skillDemand: new Map(), topSkills: [] };
    }

    const hits = result.hits;
    const nbHits = result.nbHits || hits.length;

    const skillCount = new Map<string, number>();
    
    // Count skills across all jobs
    hits.forEach((job: any) => {
      const skills: string[] = job.skillNames || [];
      
      // Also handle skills as array of objects
      if (job.skills && Array.isArray(job.skills)) {
        job.skills.forEach((s: any) => {
          if (typeof s === 'string') {
            skills.push(s);
          } else if (s.skill) {
            skills.push(s.skill);
          }
        });
      }
      
      // Deduplicate and count
      const uniqueSkills = [...new Set(skills.map(normalizeSkill))];
      uniqueSkills.forEach(skill => {
        if (skill) {
          skillCount.set(skill, (skillCount.get(skill) || 0) + 1);
        }
      });
    });

    // Sort by count and get top skills
    const sortedSkills = Array.from(skillCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50); // Top 50 skills

    const topSkills: SkillDemand[] = sortedSkills.map(([skill, count]) => ({
      skill,
      jobCount: count,
      percentage: Math.round((count / nbHits) * 100),
    }));

    return {
      totalJobs: nbHits,
      skillDemand: skillCount,
      topSkills,
    };
  } catch (error) {
    console.error('Error analyzing job market:', error);
    return {
      totalJobs: 0,
      skillDemand: new Map(),
      topSkills: [],
    };
  }
}

/**
 * Count how many jobs match user's skills
 */
export async function countMatchingJobs(userSkills: string[]): Promise<number> {
  if (!userSkills.length || !searchClient) return 0;
  
  try {
    const normalizedSkills = userSkills.map(normalizeSkill);
    
    // Use Algolia v5 API - search method with requests array
    const response = await searchClient.search({
      requests: [
        {
          indexName: jobsIndexName,
          query: normalizedSkills.join(' '),
          hitsPerPage: 0, // We only need the count
          optionalWords: normalizedSkills,
        },
      ],
    });
    
    const result = response.results[0];
    if ('nbHits' in result) {
      return result.nbHits || 0;
    }
    
    return 0;
  } catch (error) {
    console.error('Error counting matching jobs:', error);
    return 0;
  }
}

/**
 * Get learning resources for a specific skill
 */
async function getLearningResourcesForSkill(
  skill: string,
  allResources: ContentstackLearningResource[]
): Promise<ContentstackLearningResource[]> {
  const technology = getSkillTechnology(skill);
  
  if (!technology) {
    // Try to match by skill name in learning resource skills
    return allResources.filter(resource => 
      resource.skills_covered?.some(s => 
        normalizeSkill(s).includes(normalizeSkill(skill)) ||
        normalizeSkill(skill).includes(normalizeSkill(s))
      )
    ).slice(0, 3);
  }
  
  // Match by technology
  return allResources
    .filter(resource => resource.technology === technology)
    .slice(0, 3);
}

/**
 * Main function: Analyze skill gaps and generate recommendations
 */
export async function analyzeSkillGaps(userSkills: string[]): Promise<SkillGapAnalysis> {
  // Normalize user skills
  const normalizedUserSkills = userSkills.map(normalizeSkill);
  
  // Analyze job market
  const { totalJobs, topSkills } = await analyzeJobMarket();
  
  // Count matching jobs
  const matchingJobs = await countMatchingJobs(userSkills);
  const matchPercentage = totalJobs > 0 ? Math.round((matchingJobs / totalJobs) * 100) : 0;
  
  // Identify skill gaps (skills user doesn't have that are in demand)
  const skillGaps: SkillGap[] = [];
  
  topSkills.forEach(demandedSkill => {
    const hasSkill = normalizedUserSkills.some(userSkill => 
      userSkill.includes(demandedSkill.skill) || 
      demandedSkill.skill.includes(userSkill)
    );
    
    if (!hasSkill && demandedSkill.jobCount > 0) {
      // Calculate priority based on job count
      let priority: 'high' | 'medium' | 'low' = 'low';
      if (demandedSkill.percentage >= 30) {
        priority = 'high';
      } else if (demandedSkill.percentage >= 15) {
        priority = 'medium';
      }
      
      skillGaps.push({
        skill: demandedSkill.skill,
        jobCount: demandedSkill.jobCount,
        percentage: demandedSkill.percentage,
        priority,
        potentialJobIncrease: demandedSkill.jobCount,
      });
    }
  });
  
  // Sort skill gaps by priority and job count
  skillGaps.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.jobCount - a.jobCount;
  });
  
  // Get learning resources for recommendations
  const allLearningResources = await getLearningResources();
  
  // Generate recommendations for top skill gaps
  const recommendations: LearningRecommendation[] = [];
  const topGaps = skillGaps.slice(0, 5); // Top 5 skill gaps
  
  for (const gap of topGaps) {
    const resources = await getLearningResourcesForSkill(gap.skill, allLearningResources);
    
    if (resources.length > 0) {
      recommendations.push({
        skill: gap.skill,
        priority: gap.priority,
        jobsUnlocked: gap.jobCount,
        learningResources: resources,
      });
    }
  }
  
  // Calculate potential match after learning top 3 skills
  const top3GapSkills = skillGaps.slice(0, 3).map(g => g.skill);
  const potentialMatchAfterLearning = await countMatchingJobs([
    ...userSkills,
    ...top3GapSkills,
  ]);
  
  return {
    userSkills,
    totalJobs,
    matchingJobs,
    matchPercentage,
    topDemandedSkills: topSkills.slice(0, 10),
    skillGaps: skillGaps.slice(0, 10),
    recommendations,
    potentialMatchAfterLearning,
  };
}

/**
 * Quick skill gap check for a single user
 */
export async function getQuickSkillGapSummary(userSkills: string[]): Promise<{
  matchPercentage: number;
  topMissingSkills: string[];
  potentialIncrease: number;
}> {
  const analysis = await analyzeSkillGaps(userSkills);
  
  return {
    matchPercentage: analysis.matchPercentage,
    topMissingSkills: analysis.skillGaps.slice(0, 3).map(g => g.skill),
    potentialIncrease: analysis.potentialMatchAfterLearning - analysis.matchingJobs,
  };
}

/**
 * Track learning progress in Lytics
 */
export function trackSkillLearningStart(skill: string, resourceId: string): void {
  if (typeof window !== 'undefined' && (window as any).jstag) {
    (window as any).jstag.send({
      event: 'skill_learning_start',
      skill,
      resource_id: resourceId,
      timestamp: new Date().toISOString(),
    });
  }
}

export function trackSkillLearningComplete(skill: string, resourceId: string): void {
  if (typeof window !== 'undefined' && (window as any).jstag) {
    (window as any).jstag.send({
      event: 'skill_learning_complete',
      skill,
      resource_id: resourceId,
      timestamp: new Date().toISOString(),
    });
  }
}

