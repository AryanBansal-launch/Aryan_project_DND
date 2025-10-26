// Importing Contentstack SDK and specific types for region and query operations
import contentstack, { QueryOperation } from "@contentstack/delivery-sdk";

// Importing Contentstack Live Preview utilities and stack SDK 
import ContentstackLivePreview, { IStackSdk } from "@contentstack/live-preview-utils";

// Importing the Page type definition 
import { Page } from "./types";

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

// Function to fetch all jobs
export async function getJobs() {
  const result = await stack
    .contentType("job") // Specifying the content type as "job"
    .entry() // Accessing the entry
    .query() // Creating a query
    .find(); // Executing the query

  if (result.entries) {
    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      result.entries.forEach((entry: any) => {
        contentstack.Utils.addEditableTags(entry as any, 'job', true); // Adding editable tags for live preview if enabled
      });
    }

    // Fetch company details for each job
    const jobsWithCompany = await Promise.all(
      result.entries.map(async (job: any) => {
        let companyUid: string | null = null;
        
        // Determine the company UID from different possible structures
        if (job.company) {
          if (Array.isArray(job.company) && job.company.length > 0) {
            // Array of references
            if (typeof job.company[0] === 'string') {
              companyUid = job.company[0];
            } else if (job.company[0].uid) {
              companyUid = job.company[0].uid;
            }
          } else if (typeof job.company === 'string') {
            // Direct UID string
            companyUid = job.company;
          } else if (typeof job.company === 'object' && !Array.isArray(job.company) && job.company.uid) {
            // Object with uid property
            companyUid = job.company.uid;
          }
        }
        
        // Fetch the full company data if we have a UID
        if (companyUid) {
          try {
            const company = await getCompanyByUid(companyUid);
            if (company) {
              job.company = [company]; // Store as array for consistency
            }
          } catch (error) {
            console.error(`Failed to fetch company ${companyUid}:`, error);
          }
        } else {
          // Create a placeholder company for jobs without company data
          job.company = [{
            uid: 'placeholder',
            title: 'Company (Not Specified)',
            description: 'Company information not available',
            location: job.location || 'Location not specified',
            industry: 'Various',
            size: 'Not specified',
            created_at: job.created_at,
            updated_at: job.updated_at,
          }];
        }
        
        return job;
      })
    );

    return jobsWithCompany; // Returning all job entries with company data
  }

  return [];
}

// Function to fetch a single job by UID
export async function getJobByUid(uid: string) {
  const result = await stack
    .contentType("job") // Specifying the content type as "job"
    .entry(uid) // Accessing specific entry by UID
    .fetch(); // Fetching the entry

  if (result) {
    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(result as any, 'job', true); // Adding editable tags for live preview if enabled
    }

    // Fetch company details if present
    const job = result as any;
    let companyUid: string | null = null;
    
    // Determine the company UID from different possible structures
    if (job.company) {
      if (Array.isArray(job.company) && job.company.length > 0) {
        // Array of references
        if (typeof job.company[0] === 'string') {
          companyUid = job.company[0];
        } else if (job.company[0].uid) {
          companyUid = job.company[0].uid;
        }
      } else if (typeof job.company === 'string') {
        // Direct UID string
        companyUid = job.company;
      } else if (typeof job.company === 'object' && !Array.isArray(job.company) && job.company.uid) {
        // Object with uid property
        companyUid = job.company.uid;
      }
    }
    
    // Fetch the full company data if we have a UID
    if (companyUid) {
      try {
        const company = await getCompanyByUid(companyUid);
        if (company) {
          job.company = [company]; // Store as array for consistency
        }
      } catch (error) {
        console.error(`Failed to fetch company ${companyUid}:`, error);
      }
    } else {
      // Create a placeholder company for jobs without company data
      job.company = [{
        uid: 'placeholder',
        title: 'Company (Not Specified)',
        description: 'Company information not available',
        location: job.location || 'Location not specified',
        industry: 'Various',
        size: 'Not specified',
        created_at: job.created_at,
        updated_at: job.updated_at,
      }];
    }

    return result; // Returning the fetched job
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