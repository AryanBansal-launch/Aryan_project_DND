/**
 * Minimal Personalize Management API REST helper.
 *
 * Auth: supports `authtoken` header (per user request) and can optionally send an OAuth token.
 * Base URL and API prefix are configurable because Personalize API hosts can vary by region/tenant.
 *
 * Docs: https://www.contentstack.com/docs/developers/apis/personalize-management-api
 */
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function stripTrailingSlashes(url: string) {
  return url.replace(/\/+$/, '');
}

export class PersonalizeManagementError extends Error {
  status: number;
  statusText: string;
  responseBody?: unknown;

  constructor(message: string, args: { status: number; statusText: string; responseBody?: unknown }) {
    super(message);
    this.name = 'PersonalizeManagementError';
    this.status = args.status;
    this.statusText = args.statusText;
    this.responseBody = args.responseBody;
  }
}

export interface PersonalizeManagementClientConfig {
  baseUrl?: string;
  apiPrefix?: string;
  authtoken?: string;
  oauthToken?: string;
}

export function createPersonalizeManagementClient(config: PersonalizeManagementClientConfig) {
  const baseUrl = stripTrailingSlashes(
    config.baseUrl ||
      process.env.CONTENTSTACK_PERSONALIZE_MANAGEMENT_BASE_URL ||
      // Safe default; override if your org uses a different host.
      'https://personalize-api.contentstack.com'
  );

  const apiPrefix =
    config.apiPrefix ||
    process.env.CONTENTSTACK_PERSONALIZE_MANAGEMENT_API_PREFIX ||
    // Safe default; override if docs specify a different prefix (e.g., /v2).
    '/v1';

  const authtoken =
    config.authtoken || process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_AUTHTOKEN || process.env.CONTENTSTACK_PERSONALIZE_AUTHTOKEN || process.env.CONTENTSTACK_AUTHTOKEN || '';
  const oauthToken = config.oauthToken || process.env.CONTENTSTACK_PERSONALIZE_OAUTH_TOKEN || '';

  async function request<TResponse>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    pathName: string,
    body?: unknown
  ): Promise<TResponse> {
    const url = `${baseUrl}${apiPrefix}${pathName.startsWith('/') ? '' : '/'}${pathName}`;

    const headers: Record<string, string> = {
      'content-type': 'application/json',
    };

    // Prefer authtoken if present, as requested.
    if (authtoken) headers.authtoken = authtoken;
    // Also allow OAuth bearer token if user provides it.
    if (oauthToken) headers.authorization = `Bearer ${oauthToken}`;

    const res = await fetch(url, {
      method,
      headers,
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
      throw new PersonalizeManagementError(`Personalize Management API request failed: ${method} ${url}`, {
        status: res.status,
        statusText: res.statusText,
        responseBody: parsed,
      });
    }

    return parsed as TResponse;
  }

  return { request };
}

