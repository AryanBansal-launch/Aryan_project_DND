/**
 * Minimal Contentstack Content Management API (CMA) REST helper.
 *
 * We use this for endpoints not yet covered by @contentstack/management SDK
 * (e.g., Entry Variants create/publish).
 */
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables (keep consistent with other scripts)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export type ContentstackRegion = 'us' | 'eu' | 'azure-na' | 'azure-eu' | 'gcp-na' | 'gcp-eu' | 'aws-na';

function getCmaBaseUrl(region: string): string {
  // Allow explicit override for new/unknown regions.
  const override = process.env.CONTENTSTACK_CMA_BASE_URL;
  if (override) return override.replace(/\/+$/, '');

  const r = (region || 'us').toLowerCase();
  switch (r) {
    case 'us':
    case 'aws-na':
      return 'https://api.contentstack.io';
    case 'eu':
      return 'https://eu-api.contentstack.com';
    case 'azure-na':
      return 'https://azure-na-api.contentstack.com';
    case 'azure-eu':
      return 'https://azure-eu-api.contentstack.com';
    case 'gcp-na':
      return 'https://gcp-na-api.contentstack.com';
    case 'gcp-eu':
      return 'https://gcp-eu-api.contentstack.com';
    default:
      // Fall back to US CMA if region is unknown; user can override via CONTENTSTACK_CMA_BASE_URL.
      return 'https://api.contentstack.io';
  }
}

export interface CmaClientConfig {
  apiKey: string;
  managementToken: string;
  region: string;
}

export class CmaError extends Error {
  status: number;
  statusText: string;
  responseBody?: unknown;

  constructor(message: string, args: { status: number; statusText: string; responseBody?: unknown }) {
    super(message);
    this.name = 'CmaError';
    this.status = args.status;
    this.statusText = args.statusText;
    this.responseBody = args.responseBody;
  }
}

export function createCmaClient(config: CmaClientConfig) {
  const baseUrl = getCmaBaseUrl(config.region);

  async function request<TResponse>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    pathName: string,
    body?: unknown
  ): Promise<TResponse> {
    const url = `${baseUrl}${pathName.startsWith('/') ? '' : '/'}${pathName}`;

    const res = await fetch(url, {
      method,
      headers: {
        api_key: config.apiKey,
        authorization: config.managementToken,
        'content-type': 'application/json',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const text = await res.text();
    let parsed: unknown = undefined;
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }
    }

    if (!res.ok) {
      throw new CmaError(`CMA request failed: ${method} ${url}`, {
        status: res.status,
        statusText: res.statusText,
        responseBody: parsed,
      });
    }

    return parsed as TResponse;
  }

  return { request };
}

