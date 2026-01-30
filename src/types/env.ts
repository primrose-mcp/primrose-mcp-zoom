/**
 * Environment Bindings
 *
 * Type definitions for Cloudflare Worker environment variables and bindings.
 *
 * MULTI-TENANT ARCHITECTURE:
 * This server supports multiple tenants. Tenant-specific credentials (access tokens,
 * account IDs, etc.) are passed via request headers, NOT stored in wrangler
 * secrets. This allows a single server instance to serve multiple customers.
 *
 * Request Headers:
 * - X-Zoom-Access-Token: OAuth access token (from Server-to-Server OAuth app)
 * - X-Zoom-Account-ID: (Optional) Zoom account ID
 * - X-Zoom-Client-ID: (Optional) OAuth client ID for token refresh
 * - X-Zoom-Client-Secret: (Optional) OAuth client secret for token refresh
 */

// =============================================================================
// Tenant Credentials (parsed from request headers)
// =============================================================================

export interface TenantCredentials {
  /** OAuth Access Token (from X-Zoom-Access-Token header) */
  accessToken?: string;

  /** Zoom Account ID (from X-Zoom-Account-ID header) */
  accountId?: string;

  /** OAuth Client ID (from X-Zoom-Client-ID header) for token refresh */
  clientId?: string;

  /** OAuth Client Secret (from X-Zoom-Client-Secret header) for token refresh */
  clientSecret?: string;
}

/**
 * Parse tenant credentials from request headers
 */
export function parseTenantCredentials(request: Request): TenantCredentials {
  const headers = request.headers;

  return {
    accessToken: headers.get('X-Zoom-Access-Token') || undefined,
    accountId: headers.get('X-Zoom-Account-ID') || undefined,
    clientId: headers.get('X-Zoom-Client-ID') || undefined,
    clientSecret: headers.get('X-Zoom-Client-Secret') || undefined,
  };
}

/**
 * Validate that required credentials are present
 */
export function validateCredentials(credentials: TenantCredentials): void {
  if (!credentials.accessToken) {
    throw new Error('Missing credentials. Provide X-Zoom-Access-Token header.');
  }
}

// =============================================================================
// Environment Configuration (from wrangler.jsonc vars and bindings)
// =============================================================================

export interface Env {
  // ===========================================================================
  // Environment Variables (from wrangler.jsonc vars)
  // ===========================================================================

  /** Maximum character limit for responses */
  CHARACTER_LIMIT: string;

  /** Default page size for list operations */
  DEFAULT_PAGE_SIZE: string;

  /** Maximum page size allowed */
  MAX_PAGE_SIZE: string;

  // ===========================================================================
  // Bindings
  // ===========================================================================

  /** KV namespace for OAuth token storage */
  OAUTH_KV?: KVNamespace;

  /** Durable Object namespace for MCP sessions */
  MCP_SESSIONS?: DurableObjectNamespace;

  /** Cloudflare AI binding (optional) */
  AI?: Ai;
}

// ===========================================================================
// Helper Functions
// ===========================================================================

/**
 * Get a numeric environment value with a default
 */
export function getEnvNumber(env: Env, key: keyof Env, defaultValue: number): number {
  const value = env[key];
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
}

/**
 * Get the character limit from environment
 */
export function getCharacterLimit(env: Env): number {
  return getEnvNumber(env, 'CHARACTER_LIMIT', 50000);
}

/**
 * Get the default page size from environment
 */
export function getDefaultPageSize(env: Env): number {
  return getEnvNumber(env, 'DEFAULT_PAGE_SIZE', 30);
}

/**
 * Get the maximum page size from environment
 */
export function getMaxPageSize(env: Env): number {
  return getEnvNumber(env, 'MAX_PAGE_SIZE', 300);
}
