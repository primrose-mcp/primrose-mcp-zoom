/**
 * Zoom Webhooks Tools
 *
 * MCP tools for managing Zoom webhooks.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ZoomClient } from '../client.js';
import type { ResponseFormat } from '../types/entities.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all webhook tools
 */
export function registerWebhookTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // Webhooks CRUD
  // ===========================================================================
  server.tool(
    'zoom_list_webhooks',
    'List all webhooks.',
    {
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ format }) => {
      try {
        const result = await client.listWebhooks();
        return formatResponse(result.webhooks, format as ResponseFormat, 'webhooks');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_get_webhook',
    'Get details of a specific webhook.',
    {
      webhook_id: z.string().describe('The webhook ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webhook_id, format }) => {
      try {
        const result = await client.getWebhook(webhook_id);
        return formatResponse(result, format as ResponseFormat, 'webhook');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_create_webhook',
    'Create a new webhook.',
    {
      url: z.string().describe('The webhook endpoint URL'),
      events: z.array(z.string()).describe('List of event types to subscribe to'),
      auth_user: z.string().optional().describe('Basic auth username'),
      auth_password: z.string().optional().describe('Basic auth password'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ url, events, auth_user, auth_password, format }) => {
      try {
        const result = await client.createWebhook({
          url,
          events,
          auth_user,
          auth_password,
        });
        return formatResponse(result, format as ResponseFormat, 'webhook');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_delete_webhook',
    'Delete a webhook.',
    {
      webhook_id: z.string().describe('The webhook ID to delete'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webhook_id, format }) => {
      try {
        await client.deleteWebhook(webhook_id);
        return formatResponse({ success: true, message: 'Webhook deleted' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_update_webhook',
    'Update an existing webhook.',
    {
      webhook_id: z.string().describe('The webhook ID to update'),
      url: z.string().optional().describe('The new webhook endpoint URL'),
      events: z.array(z.string()).optional().describe('Updated list of event types to subscribe to'),
      auth_user: z.string().optional().describe('Basic auth username'),
      auth_password: z.string().optional().describe('Basic auth password'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webhook_id, url, events, auth_user, auth_password, format }) => {
      try {
        await client.updateWebhook(webhook_id, {
          url,
          events,
          auth_user,
          auth_password,
        });
        return formatResponse({ success: true, message: 'Webhook updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Webhook Options
  // ===========================================================================
  server.tool(
    'zoom_get_webhook_options',
    'Get webhook notification options.',
    {
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ format }) => {
      try {
        const result = await client.getWebhookOptions();
        return formatResponse(result, format as ResponseFormat, 'webhook_options');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_update_webhook_options',
    'Update webhook notification options.',
    {
      payment_notification: z.object({
        type: z.string().optional(),
        url: z.string().optional(),
      }).optional().describe('Payment notification settings'),
      registrant_notification: z.object({
        type: z.string().optional(),
        url: z.string().optional(),
      }).optional().describe('Registrant notification settings'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ payment_notification, registrant_notification, format }) => {
      try {
        await client.updateWebhookOptions({
          payment_notification,
          registrant_notification,
        });
        return formatResponse({ success: true, message: 'Webhook options updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
