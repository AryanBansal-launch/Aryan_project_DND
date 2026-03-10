/**
 * Centralized Contentstack API Configuration
 * Manages region-based base URLs for Contentstack Management API
 */

export interface ContentstackRegionConfig {
  us: string;
  eu: string;
  'azure-na': string;
  'azure-stag': string;
}

/**
 * Base URLs for different Contentstack regions
 * These are used for Management API operations (create, update, publish, delete)
 */
export const CONTENTSTACK_BASE_URLS: ContentstackRegionConfig = {
  us: 'api.contentstack.io',
  eu: 'eu-api.contentstack.com',
  'azure-na': 'azure-na-api.contentstack.com',
  'azure-stag': 'stag-azure-na-api.csnonprod.com'
};

/**
 * Get the Management API base URL based on the configured region
 * Falls back to 'us' region if region is not specified or invalid
 * 
 * @returns The base URL for the configured region
 */
export function getManagementApiBaseUrl(): string {
  const region = (process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'us') as keyof ContentstackRegionConfig;
  return CONTENTSTACK_BASE_URLS[region] || CONTENTSTACK_BASE_URLS.us;
}

/**
 * Get the full Management API URL for a specific endpoint
 * 
 * @param endpoint - The API endpoint path (e.g., '/v3/content_types/job/entries')
 * @returns The complete URL for the API call
 */
export function getManagementApiUrl(endpoint: string): string {
  const baseUrl = getManagementApiBaseUrl();
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `https://${baseUrl}${cleanEndpoint}`;
}

/**
 * Get common headers for Contentstack Management API requests
 * 
 * @returns Headers object with API key, authorization token, and content type
 */
export function getManagementApiHeaders(): Record<string, string> {
  const apiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
  const managementToken = process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN;

  if (!apiKey || !managementToken) {
    throw new Error('Contentstack API credentials not configured');
  }

  return {
    'api_key': apiKey,
    'authorization': managementToken,
    'Content-Type': 'application/json',
  };
}

/**
 * Validate that required Contentstack environment variables are set
 * 
 * @throws Error if required environment variables are missing
 */
export function validateContentstackConfig(): void {
  const required = [
    'NEXT_PUBLIC_CONTENTSTACK_API_KEY',
    'NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN',
    'NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required Contentstack configuration: ${missing.join(', ')}`);
  }
}

/**
 * Get the current environment name
 * 
 * @returns The configured environment (e.g., 'preview', 'production')
 */
export function getContentstackEnvironment(): string {
  return process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'preview';
}

/**
 * Get the current region
 * 
 * @returns The configured region (e.g., 'us', 'eu', 'azure-na', 'azure-stag')
 */
export function getContentstackRegion(): string {
  return process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'us';
}
