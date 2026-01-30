/**
 * Zoom Webinar Tools
 *
 * MCP tools for managing Zoom webinars, registrants, and panelists.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ZoomClient } from '../client.js';
import type { ResponseFormat, ZoomWebinarType } from '../types/entities.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all webinar-related tools
 */
export function registerWebinarTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // List Webinars
  // ===========================================================================
  server.tool(
    'zoom_list_webinars',
    'List all webinars for a Zoom user.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page (max 300). Default: 30'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, page_size, next_page_token, format }) => {
      try {
        const result = await client.listWebinars(user_id, { page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'webinars');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Webinar
  // ===========================================================================
  server.tool(
    'zoom_get_webinar',
    'Get details of a specific Zoom webinar.',
    {
      webinar_id: z.number().describe('The webinar ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, format }) => {
      try {
        const result = await client.getWebinar(webinar_id);
        return formatResponse(result, format as ResponseFormat, 'webinar');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Webinar
  // ===========================================================================
  server.tool(
    'zoom_create_webinar',
    'Create a new Zoom webinar.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      topic: z.string().describe('Webinar topic/title'),
      type: z.number().optional().describe('Webinar type: 5=Webinar, 6=Recurring (no fixed time), 9=Recurring (fixed time). Default: 5'),
      start_time: z.string().optional().describe('Webinar start time in ISO 8601 format'),
      duration: z.number().optional().describe('Webinar duration in minutes'),
      timezone: z.string().optional().describe('Timezone (e.g., America/Los_Angeles)'),
      password: z.string().optional().describe('Webinar password'),
      agenda: z.string().optional().describe('Webinar description/agenda'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, topic, type, start_time, duration, timezone, password, agenda, format }) => {
      try {
        const result = await client.createWebinar(user_id, {
          topic,
          type: type as ZoomWebinarType | undefined,
          start_time,
          duration,
          timezone,
          password,
          agenda,
        });
        return formatResponse(result, format as ResponseFormat, 'webinar');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Webinar
  // ===========================================================================
  server.tool(
    'zoom_update_webinar',
    'Update an existing Zoom webinar.',
    {
      webinar_id: z.number().describe('The webinar ID to update'),
      topic: z.string().optional().describe('New webinar topic'),
      start_time: z.string().optional().describe('New start time in ISO 8601 format'),
      duration: z.number().optional().describe('New duration in minutes'),
      timezone: z.string().optional().describe('New timezone'),
      password: z.string().optional().describe('New password'),
      agenda: z.string().optional().describe('New agenda/description'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, topic, start_time, duration, timezone, password, agenda, format }) => {
      try {
        await client.updateWebinar(webinar_id, { topic, start_time, duration, timezone, password, agenda });
        return formatResponse({ success: true, message: 'Webinar updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Webinar
  // ===========================================================================
  server.tool(
    'zoom_delete_webinar',
    'Delete a Zoom webinar.',
    {
      webinar_id: z.number().describe('The webinar ID to delete'),
      occurrence_id: z.string().optional().describe('For recurring webinars, the occurrence ID to delete'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, occurrence_id, format }) => {
      try {
        await client.deleteWebinar(webinar_id, { occurrence_id });
        return formatResponse({ success: true, message: 'Webinar deleted' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // End Webinar
  // ===========================================================================
  server.tool(
    'zoom_end_webinar',
    'End a live Zoom webinar.',
    {
      webinar_id: z.number().describe('The webinar ID to end'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, format }) => {
      try {
        await client.updateWebinarStatus(webinar_id, 'end');
        return formatResponse({ success: true, message: 'Webinar ended' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // List Webinar Registrants
  // ===========================================================================
  server.tool(
    'zoom_list_webinar_registrants',
    'List registrants for a Zoom webinar.',
    {
      webinar_id: z.number().describe('The webinar ID'),
      status: z.enum(['pending', 'approved', 'denied']).optional().describe('Filter by registrant status'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, status, page_size, next_page_token, format }) => {
      try {
        const result = await client.listWebinarRegistrants(webinar_id, { status, page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'registrants');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Add Webinar Registrant
  // ===========================================================================
  server.tool(
    'zoom_add_webinar_registrant',
    'Register a participant for a Zoom webinar.',
    {
      webinar_id: z.number().describe('The webinar ID'),
      email: z.string().email().describe('Registrant email address'),
      first_name: z.string().describe('Registrant first name'),
      last_name: z.string().optional().describe('Registrant last name'),
      phone: z.string().optional().describe('Registrant phone number'),
      org: z.string().optional().describe('Registrant organization'),
      job_title: z.string().optional().describe('Registrant job title'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, email, first_name, last_name, phone, org, job_title, format }) => {
      try {
        const result = await client.addWebinarRegistrant(webinar_id, {
          email,
          first_name,
          last_name,
          phone,
          org,
          job_title,
        });
        return formatResponse(result, format as ResponseFormat, 'registrant');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Webinar Registrant Status
  // ===========================================================================
  server.tool(
    'zoom_update_webinar_registrant_status',
    'Approve, deny, or cancel webinar registrants.',
    {
      webinar_id: z.number().describe('The webinar ID'),
      action: z.enum(['approve', 'deny', 'cancel']).describe('Action to take on registrants'),
      registrants: z.array(z.object({
        id: z.string().optional(),
        email: z.string().optional(),
      })).describe('List of registrants (by ID or email)'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, action, registrants, format }) => {
      try {
        await client.updateWebinarRegistrantStatus(webinar_id, action, registrants);
        return formatResponse({ success: true, message: `Registrants ${action}ed` }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // List Webinar Panelists
  // ===========================================================================
  server.tool(
    'zoom_list_webinar_panelists',
    'List panelists for a Zoom webinar.',
    {
      webinar_id: z.number().describe('The webinar ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, format }) => {
      try {
        const result = await client.listWebinarPanelists(webinar_id);
        return formatResponse(result.panelists, format as ResponseFormat, 'panelists');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Add Webinar Panelists
  // ===========================================================================
  server.tool(
    'zoom_add_webinar_panelists',
    'Add panelists to a Zoom webinar.',
    {
      webinar_id: z.number().describe('The webinar ID'),
      panelists: z.array(z.object({
        name: z.string().describe('Panelist name'),
        email: z.string().email().describe('Panelist email'),
      })).describe('List of panelists to add'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, panelists, format }) => {
      try {
        await client.addWebinarPanelists(webinar_id, panelists);
        return formatResponse({ success: true, message: 'Panelists added' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Remove Webinar Panelist
  // ===========================================================================
  server.tool(
    'zoom_remove_webinar_panelist',
    'Remove a panelist from a Zoom webinar.',
    {
      webinar_id: z.number().describe('The webinar ID'),
      panelist_id: z.string().describe('The panelist ID to remove'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, panelist_id, format }) => {
      try {
        await client.removeWebinarPanelist(webinar_id, panelist_id);
        return formatResponse({ success: true, message: 'Panelist removed' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Remove All Webinar Panelists
  // ===========================================================================
  server.tool(
    'zoom_remove_all_webinar_panelists',
    'Remove all panelists from a Zoom webinar.',
    {
      webinar_id: z.number().describe('The webinar ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, format }) => {
      try {
        await client.removeAllWebinarPanelists(webinar_id);
        return formatResponse({ success: true, message: 'All panelists removed' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
