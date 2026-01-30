/**
 * Zoom MCP Server - Main Entry Point
 *
 * This file sets up the MCP server using Cloudflare's Agents SDK.
 * It supports both stateless (McpServer) and stateful (McpAgent) modes.
 *
 * MULTI-TENANT ARCHITECTURE:
 * Tenant credentials (API keys, etc.) are parsed from request headers,
 * allowing a single server deployment to serve multiple customers.
 *
 * Required Headers:
 * - X-Zoom-Access-Token: OAuth access token for Zoom API authentication
 *
 * Optional Headers:
 * - X-Zoom-Account-ID: Account ID for Server-to-Server OAuth
 * - X-Zoom-Client-ID: OAuth client ID
 * - X-Zoom-Client-Secret: OAuth client secret
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpAgent } from 'agents/mcp';
import { createZoomClient } from './client.js';
import { registerMeetingTools } from './tools/meetings.js';
import { registerUserTools } from './tools/users.js';
import { registerWebinarTools } from './tools/webinars.js';
import { registerRecordingTools } from './tools/recordings.js';
import { registerReportTools } from './tools/reports.js';
import { registerGroupTools } from './tools/groups.js';
import { registerChatTools } from './tools/chat.js';
import { registerAccountTools } from './tools/accounts.js';
import { registerDeviceTools } from './tools/devices.js';
import { registerTrackingFieldTools } from './tools/tracking.js';
import { registerPollTools } from './tools/polls.js';
import { registerContactTools } from './tools/contacts.js';
import { registerTSPTools } from './tools/tsp.js';
import { registerIMGroupTools } from './tools/im-groups.js';
import { registerUserManagementTools } from './tools/user-management.js';
import { registerWebinarPollTools } from './tools/webinar-polls.js';
import { registerLivestreamTools } from './tools/livestream.js';
import { registerArchivingTools } from './tools/archiving.js';
import { registerTaskTools } from './tools/tasks.js';
import { registerDashboardTools } from './tools/dashboard.js';
import { registerWebhookTools } from './tools/webhooks.js';
import { registerRoomTools } from './tools/rooms.js';
import {
  type Env,
  type TenantCredentials,
  parseTenantCredentials,
  validateCredentials,
} from './types/env.js';

// =============================================================================
// MCP Server Configuration
// =============================================================================

const SERVER_NAME = 'primrose-mcp-zoom';
const SERVER_VERSION = '1.0.0';

// =============================================================================
// MCP Agent (Stateful - uses Durable Objects)
// =============================================================================

/**
 * McpAgent provides stateful MCP sessions backed by Durable Objects.
 *
 * NOTE: For multi-tenant deployments, use the stateless mode (Option 2) instead.
 * The stateful McpAgent is better suited for single-tenant deployments where
 * credentials can be stored as wrangler secrets.
 *
 * @deprecated For multi-tenant support, use stateless mode with per-request credentials
 */
export class ZoomMcpAgent extends McpAgent<Env> {
  server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  async init() {
    // NOTE: Stateful mode requires credentials to be configured differently.
    // For multi-tenant, use the stateless endpoint at /mcp instead.
    throw new Error(
      'Stateful mode (McpAgent) is not supported for multi-tenant deployments. ' +
        'Use the stateless /mcp endpoint with X-Zoom-Access-Token header instead.'
    );
  }
}

// =============================================================================
// Stateless MCP Server (Recommended - no Durable Objects needed)
// =============================================================================

/**
 * Creates a stateless MCP server instance with tenant-specific credentials.
 *
 * MULTI-TENANT: Each request provides credentials via headers, allowing
 * a single server deployment to serve multiple tenants.
 *
 * @param credentials - Tenant credentials parsed from request headers
 */
function createStatelessServer(credentials: TenantCredentials): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  // Create client with tenant-specific credentials
  const client = createZoomClient(credentials);

  // Register all Zoom tools
  registerMeetingTools(server, client);
  registerUserTools(server, client);
  registerWebinarTools(server, client);
  registerRecordingTools(server, client);
  registerReportTools(server, client);
  registerGroupTools(server, client);
  registerChatTools(server, client);
  registerAccountTools(server, client);
  registerDeviceTools(server, client);
  registerTrackingFieldTools(server, client);
  registerPollTools(server, client);
  registerContactTools(server, client);
  registerTSPTools(server, client);
  registerIMGroupTools(server, client);
  registerUserManagementTools(server, client);
  registerWebinarPollTools(server, client);
  registerLivestreamTools(server, client);
  registerArchivingTools(server, client);
  registerTaskTools(server, client);
  registerDashboardTools(server, client);
  registerWebhookTools(server, client);
  registerRoomTools(server, client);

  return server;
}

// =============================================================================
// Worker Export
// =============================================================================

export default {
  /**
   * Main fetch handler for the Worker
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', server: SERVER_NAME }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ==========================================================================
    // Stateless MCP with Streamable HTTP (Recommended for multi-tenant)
    // ==========================================================================
    if (url.pathname === '/mcp' && request.method === 'POST') {
      // Parse tenant credentials from request headers
      const credentials = parseTenantCredentials(request);

      // Validate credentials are present
      try {
        validateCredentials(credentials);
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: 'Unauthorized',
            message: error instanceof Error ? error.message : 'Invalid credentials',
            required_headers: ['X-Zoom-Access-Token'],
          }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Create server with tenant-specific credentials
      const server = createStatelessServer(credentials);

      // Import and use createMcpHandler for streamable HTTP
      const { createMcpHandler } = await import('agents/mcp');
      const handler = createMcpHandler(server);
      return handler(request, env, ctx);
    }

    // SSE endpoint for legacy clients
    if (url.pathname === '/sse') {
      return new Response('SSE endpoint requires Durable Objects. Enable in wrangler.jsonc.', {
        status: 501,
      });
    }

    // Default response
    return new Response(
      JSON.stringify({
        name: SERVER_NAME,
        version: SERVER_VERSION,
        description: 'Multi-tenant Zoom MCP Server',
        endpoints: {
          mcp: '/mcp (POST) - Streamable HTTP MCP endpoint',
          health: '/health - Health check',
        },
        authentication: {
          description: 'Pass tenant credentials via request headers',
          required_headers: {
            'X-Zoom-Access-Token': 'OAuth access token for Zoom API',
          },
          optional_headers: {
            'X-Zoom-Account-ID': 'Account ID for Server-to-Server OAuth',
            'X-Zoom-Client-ID': 'OAuth client ID',
            'X-Zoom-Client-Secret': 'OAuth client secret',
          },
        },
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  },
};
