// Importing Contentstack SDK and specific types for region and query operations
import contentstack, { QueryOperation } from "@contentstack/delivery-sdk";

// Importing Contentstack Live Preview utilities and stack SDK 
import ContentstackLivePreview, { IStackSdk } from "@contentstack/live-preview-utils";

// Importing the Page type definition 
import { Page } from "./types";

// HTTP client logging for debugging failed requests
import { addHttpClientLogging } from "./http-client-logger";
// Socket diagnostics (IPv4/IPv6) for Contentstack SDK connections
import { createLoggingAgents } from "./contentstack-socket-diagnostics";

// helper functions from private package to retrieve Contentstack endpoints in a convienient way
import { getContentstackEndpoints, getRegionForString } from "@timbenniks/contentstack-endpoints";

// Set the region by string value from environment variables
const region = getRegionForString(process.env.NEXT_PUBLIC_CONTENTSTACK_REGION as string)
// object with all endpoints for region.
const endpoints = getContentstackEndpoints(region, true)

export const stack = contentstack.stack({
  // Setting the API key from environment variables
  apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string,

  // Setting the delivery token from environment variables
  deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN as string,

  // Setting the environment based on environment variables
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,

  // Setting the region
  // if the region doesnt exist, fall back to a custom region given by the env vars
  // for internal testing purposes at Contentstack we look for a custom region in the env vars, you do not have to do this.
  region: region ? region : process.env.NEXT_PUBLIC_CONTENTSTACK_REGION as any,

  // Setting the host for content delivery based on the region or environment variables
  // This is done for internal testing purposes at Contentstack, you can omit this if you have set a region above.
  host: process.env.NEXT_PUBLIC_CONTENTSTACK_CONTENT_DELIVERY || endpoints && endpoints.contentDelivery,

  live_preview: {
    // Enabling live preview if specified in environment variables
    enable: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true',

    // Setting the preview token from environment variables
    preview_token: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN,

    // Setting the host for live preview based on the region
    // for internal testing purposes at Contentstack we look for a custom host in the env vars, you do not have to do this.
    host: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_HOST || endpoints && endpoints.preview
  }
});

if (typeof window === "undefined") {
  const client = stack.getClient();

  // Socket diagnostics: log IPv4/IPv6 when Contentstack connections are established
  const { httpAgent, httpsAgent } = createLoggingAgents();
  client.defaults.httpAgent = httpAgent;
  client.defaults.httpsAgent = httpsAgent;

  // Add HTTP client logging for failed requests
  addHttpClientLogging(client);
}

// Initialize live preview functionality
export function initLivePreview() {
  ContentstackLivePreview.init({
    ssr: false, // Disabling server-side rendering for live preview
    enable: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true', // Enabling live preview if specified in environment variables
    mode: "builder", // Setting the mode to "builder" for visual builder
    stackSdk: stack.config as IStackSdk, // Passing the stack configuration
    stackDetails: {
      apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string, // Setting the API key from environment variables
      environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string, // Setting the environment from environment variables
    },
    clientUrlParams: {
      // Setting the client URL parameters for live preview
      // for internal testing purposes at Contentstack we look for a custom host in the env vars, you do not have to do this.
      host: process.env.NEXT_PUBLIC_CONTENTSTACK_CONTENT_APPLICATION || endpoints && endpoints.application
    },
    editButton: {
      enable: true, // Enabling the edit button for live preview
      exclude: ["outsideLivePreviewPortal"] // Excluding the edit button from the live preview portal
    },
  });
}
// Function to fetch page data based on the URL
export async function getPage(url: string) {
  const result = await stack
    .contentType("page") // Specifying the content type as "page"
    .entry() // Accessing the entry
    .query() // Creating a query
    .where("url", QueryOperation.EQUALS, url) // Filtering entries by URL
    .find<Page>(); // Executing the query and expecting a result of type Page

  if (result.entries) {
    const entry = result.entries[0]; // Getting the first entry from the result

    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(entry, 'page', true); // Adding editable tags for live preview if enabled
    }

    return entry; // Returning the fetched entry
  }
}

// Function to fetch all companies
export async function getCompanies() {
  const result = await stack
    .contentType("company") // Specifying the content type as "company"
    .entry() // Accessing the entry
    .query() // Creating a query
    .find(); // Executing the query

  if (result.entries) {
    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      result.entries.forEach(entry => {
        contentstack.Utils.addEditableTags(entry as any, 'company', true); // Adding editable tags for live preview if enabled
      });
    }

    return result.entries; // Returning all company entries
  }

  return [];
}

// Function to fetch a single company by UID
export async function getCompanyByUid(uid: string) {
  const result = await stack
    .contentType("company") // Specifying the content type as "company"
    .entry(uid) // Accessing specific entry by UID
    .fetch(); // Fetching the entry

  if (result) {
    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(result as any, 'company', true); // Adding editable tags for live preview if enabled
    }

    return result; // Returning the fetched company
  }

  return null;
}

// Helper function to create placeholder company data
function createPlaceholderCompany(job: any, companyUid: string | null) {
  return {
    uid: companyUid || 'placeholder',
    title: 'Company (Not Available)',
    description: 'Company information is currently unavailable',
    location: job.location || 'Location not specified',
    industry: 'Various',
    size: 'Not specified',
    created_at: job.created_at,
    updated_at: job.updated_at,
  };
}

// Helper to normalize company data (handles includeReference response - full object or reference)
function normalizeJobCompany(job: any): void {
  if (!job.company) {
    job.company = [createPlaceholderCompany(job, null)];
    return;
  }
  const raw = job.company;
  // Full company object(s) from includeReference - normalize to [company]
  if (Array.isArray(raw) && raw.length > 0) {
    if (typeof raw[0] === 'object' && raw[0]?.uid) {
      job.company = [raw[0]];
      return;
    }
    if (typeof raw[0] === 'string') {
      job.company = [createPlaceholderCompany(job, raw[0])];
      return;
    }
  }
  if (typeof raw === 'object' && !Array.isArray(raw) && raw.uid) {
    job.company = [raw];
    return;
  }
  if (typeof raw === 'string') {
    job.company = [createPlaceholderCompany(job, raw)];
    return;
  }
  job.company = [createPlaceholderCompany(job, null)];
}

// Function to fetch all jobs (optimized: company embedded via includeReference - 1 API call instead of 1+N)
export async function getJobs() {
  const result = await stack
    .contentType("job")
    .entry()
    .includeReference("company")
    .query()
    .find();

  if (result.entries) {
    const entries = result.entries;

    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      entries.forEach((entry: any) => {
        contentstack.Utils.addEditableTags(entry as any, 'job', true);
      });
    }

    entries.forEach((job: any) => normalizeJobCompany(job));
    return entries;
  }

  return [];
}

// Function to fetch a single job by UID
export async function getJobByUid(uid: string) {
  const result = await stack
    .contentType("job")
    .entry(uid)
    .includeReference("company")
    .fetch();

  if (result) {
    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(result as any, 'job', true);
    }
    const job = result as any;
    normalizeJobCompany(job);
    return result;
  }

  return null;
}

// Function to fetch homepage content (singleton)
export async function getHomepage() {
  const result = await stack
    .contentType("homepage")
    .entry()
    .query()
    .find();

  if (result.entries && result.entries.length > 0) {
    const entry = result.entries[0];
    
    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(entry as any, 'homepage', true);
    }

    return entry;
  }

  return null;
}

// Function to fetch navigation content (singleton)
export async function getNavigation() {
  const result = await stack
    .contentType("navigation")
    .entry()
    .query()
    .find();

  if (result.entries && result.entries.length > 0) {
    const entry = result.entries[0];
    
    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(entry as any, 'navigation', true);
    }

    return entry;
  }

  return null;
}

// Function to fetch all blog posts
export async function getBlogs(locale?: string) {
  // Create a stack instance with locale if provided
  const stackInstance = locale 
    ? contentstack.stack({
        apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string,
        deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN as string,
        environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,
        region: region ? region : process.env.NEXT_PUBLIC_CONTENTSTACK_REGION as any,
        host: process.env.NEXT_PUBLIC_CONTENTSTACK_CONTENT_DELIVERY || endpoints && endpoints.contentDelivery,
        locale: locale,
      })
    : stack;

  const result = await stackInstance
    .contentType("blog_post")
    .entry()
    .query()
    .find();

  if (result.entries) {
    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      result.entries.forEach((entry: any) => {
        contentstack.Utils.addEditableTags(entry as any, 'blog_post', true);
      });
    }

    return result.entries;
  }

  return [];
}

// Function to fetch a single blog post by UID
export async function getBlogByUid(uid: string, locale?: string) {
  // Create a stack instance with locale if provided
  const stackInstance = locale 
    ? contentstack.stack({
        apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string,
        deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN as string,
        environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,
        region: region ? region : process.env.NEXT_PUBLIC_CONTENTSTACK_REGION as any,
        host: process.env.NEXT_PUBLIC_CONTENTSTACK_CONTENT_DELIVERY || endpoints && endpoints.contentDelivery,
        locale: locale,
      })
    : stack;

  const result = await stackInstance
    .contentType("blog_post")
    .entry(uid)
    .fetch();

  if (result) {
    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(result as any, 'blog_post', true);
    }

    return result;
  }

  return null;
}

// Function to fetch a blog post by slug
export async function getBlogBySlug(slug: string) {
  const result = await stack
    .contentType("blog_post")
    .entry()
    .query()
    .where("slug", QueryOperation.EQUALS, slug)
    .find();

  if (result.entries && result.entries.length > 0) {
    const entry = result.entries[0];
    
    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(entry as any, 'blog_post', true);
    }

    return entry;
  }

  return null;
}

// Interface for user context used in personalization
export interface PersonalizationContext {
  // User behavior attributes
  timeOnSite?: number; // Time in seconds user has been on site
  hasClickedApplyNow?: boolean; // Whether user has clicked Apply Now
  pageViews?: number; // Number of pages viewed
  // User attributes for segmentation
  userId?: string; // Optional user ID
  userEmail?: string; // Optional user email
  userSegment?: string; // Pre-determined user segment (e.g., "users_not_applied_30s")
  // Additional custom attributes
  [key: string]: any;
}

// Function to fetch personalized banner content using Contentstack Personalization
// This delivers different banner content based on user segments and behavior
// 
// IMPORTANT: To use Contentstack Personalization, you need to:
// 1. Set up experiences and audiences in Contentstack Personalize dashboard
// 2. Pass user attributes/context so Contentstack can match users to audiences
// 3. Contentstack will automatically return the appropriate variant based on experiences
export async function getPersonalizedBanner(
  userContext?: PersonalizationContext,
  locale?: string
) {
  // Create a stack instance with locale if provided
  const stackInstance = locale 
    ? contentstack.stack({
        apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string,
        deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN as string,
        environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,
        region: region ? region : process.env.NEXT_PUBLIC_CONTENTSTACK_REGION as any,
        host: process.env.NEXT_PUBLIC_CONTENTSTACK_CONTENT_DELIVERY || endpoints && endpoints.contentDelivery,
        locale: locale,
      })
    : stack;

  // Build query with personalization
  let query = stackInstance
      .contentType("personalized_banner")
      .entry()
      .query();

  // Add personalization context if provided
  // Contentstack Personalization works by:
  // 1. Passing user attributes/context (time on site, behavior, etc.)
  // 2. Contentstack matches user to audiences based on experience rules
  // 3. Returns the appropriate variant/content for that audience
  
  if (userContext) {
    // Filter by enabled banners only
    query = query.where("enabled", QueryOperation.EQUALS, true);
    
    // Manual filtering by user_segment (fallback method)
    // This is a workaround - true personalization would use Contentstack's Personalization API
    if (userContext.userSegment) {
      query = query.where("user_segment", QueryOperation.EQUALS, userContext.userSegment);
    }
    
    // TODO: Integrate with Contentstack Personalization API
    // To use true personalization, you would need to:
    // 1. Use Contentstack Personalization API endpoint (if available)
    // 2. Pass user attributes in headers: X-User-Attributes or similar
    // 3. Let Contentstack's engine match user to experiences/audiences
    // 4. Return the personalized variant automatically
    
    // Example of how it might work (if API supports it):
    // const personalizeHeaders = {
    //   'X-User-Attributes': JSON.stringify({
    //     time_on_site: userContext.timeOnSite,
    //     has_clicked_apply_now: userContext.hasClickedApplyNow,
    //     user_segment: userContext.userSegment
    //   })
    // };
  } else {
    // Default: get enabled banners
    query = query.where("enabled", QueryOperation.EQUALS, true);
  }

  const result = await query.find();

  if (result.entries && result.entries.length > 0) {
    // If multiple entries, prioritize by priority field or return first
    let entry = result.entries[0];
    
    // If there are multiple entries, sort by priority (lower number = higher priority)
    if (result.entries.length > 1) {
      const sortedEntries = result.entries.sort((a: any, b: any) => {
        const priorityA = a.priority || 999;
        const priorityB = b.priority || 999;
        return priorityA - priorityB;
      });
      entry = sortedEntries[0];
    }
    
    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(entry as any, 'personalized_banner', true);
    }

    return entry;
  }

  return null;
}

// ============================================
// LEARNING RESOURCES
// ============================================

// Interface for Learning Resource
export interface ContentstackLearningResource {
  uid: string;
  title: string;
  slug: string;
  description: string;
  technology: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  youtube_url: string;
  youtube_video_id: string;
  duration?: string;
  thumbnail?: {
    url: string;
    title?: string;
  };
  key_takeaways?: string[];
  skills_covered?: string[];
  related_jobs?: any[];
  instructor?: string;
  published_date?: string;
  featured?: boolean;
  order?: number;
  $?: any;
}

/**
 * Fetch all learning resources
 */
export async function getLearningResources(options?: {
  technology?: string;
  difficulty?: string;
  featured?: boolean;
  limit?: number;
}) {
  try {
    let query = stack
      .contentType("learning_resource")
      .entry()
      .query();

    // Apply filters
    if (options?.technology) {
      query = query.where("technology", QueryOperation.EQUALS, options.technology);
    }
    
    if (options?.difficulty) {
      query = query.where("difficulty_level", QueryOperation.EQUALS, options.difficulty);
    }
    
    if (options?.featured) {
      query = query.where("featured", QueryOperation.EQUALS, true);
    }

    const result = await query.find();

    if (result.entries) {
      let entries = result.entries as ContentstackLearningResource[];
      
      // Sort by order, then by title
      entries.sort((a, b) => {
        const orderA = a.order || 999;
        const orderB = b.order || 999;
        if (orderA !== orderB) return orderA - orderB;
        return a.title.localeCompare(b.title);
      });

      // Apply limit
      if (options?.limit) {
        entries = entries.slice(0, options.limit);
      }

      if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
        entries.forEach((entry: any) => {
          contentstack.Utils.addEditableTags(entry, 'learning_resource', true);
        });
      }

      return entries;
    }

    return [];
  } catch (error) {
    console.warn('Learning resources not available:', error);
    return [];
  }
}

/**
 * Fetch a single learning resource by slug
 */
export async function getLearningResourceBySlug(slug: string) {
  try {
    const result = await stack
      .contentType("learning_resource")
      .entry()
      .query()
      .where("slug", QueryOperation.EQUALS, slug)
      .find();

    if (result.entries && result.entries.length > 0) {
      const entry = result.entries[0] as ContentstackLearningResource;
      
      if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
        contentstack.Utils.addEditableTags(entry as any, 'learning_resource', true);
      }

      return entry;
    }

    return null;
  } catch (error) {
    console.warn('Learning resource not found:', error);
    return null;
  }
}

/**
 * Get all unique technologies from learning resources
 */
export async function getLearningTechnologies() {
  try {
    const resources = await getLearningResources();
    const technologies = [...new Set(resources.map(r => r.technology))];
    return technologies.sort();
  } catch (error) {
    console.warn('Could not fetch technologies:', error);
    return [];
  }
}

// ============================================
// DEMO VIDEO
// ============================================

/**
 * Fetch demo video content (singleton)
 * This fetches a demo video entry from Contentstack that can be displayed on /demo route
 */
export async function getDemoVideo() {
  try {
    const result = await stack
      .contentType("demo_video")
      .entry()
      .query()
      .find();

    if (result.entries && result.entries.length > 0) {
      const entry = result.entries[0];
      
      if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
        contentstack.Utils.addEditableTags(entry as any, 'demo_video', true);
      }

      return entry;
    }

    return null;
  } catch (error) {
    console.warn('Demo video not available:', error);
    return null;
  }
}