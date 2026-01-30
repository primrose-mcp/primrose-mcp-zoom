/**
 * Zoom TSP (Telephony Service Provider) and PAC Tools
 *
 * MCP tools for managing TSP and Personal Audio Conference settings.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ZoomClient } from '../client.js';
import type { ResponseFormat } from '../types/entities.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all TSP and PAC-related tools
 */
export function registerTSPTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // Get TSP Info
  // ===========================================================================
  server.tool(
    'zoom_get_tsp_info',
    'Get account TSP (Telephony Service Provider) information.',
    {
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ format }) => {
      try {
        const result = await client.getTSPInfo();
        return formatResponse(result, format as ResponseFormat, 'tsp');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // List User TSPs
  // ===========================================================================
  server.tool(
    'zoom_list_user_tsps',
    'List TSP accounts for a user.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, format }) => {
      try {
        const result = await client.listUserTSPs(user_id);
        return formatResponse(result.tsp_accounts, format as ResponseFormat, 'tsp_accounts');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get User TSP
  // ===========================================================================
  server.tool(
    'zoom_get_user_tsp',
    'Get details of a specific TSP account for a user.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      tsp_id: z.string().describe('The TSP account ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, tsp_id, format }) => {
      try {
        const result = await client.getUserTSP(user_id, tsp_id);
        return formatResponse(result, format as ResponseFormat, 'tsp_account');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Add User TSP
  // ===========================================================================
  server.tool(
    'zoom_add_user_tsp',
    'Add a TSP account to a user.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      conference_code: z.string().describe('TSP conference code'),
      leader_pin: z.string().describe('TSP leader PIN'),
      tsp_bridge: z.string().optional().describe('TSP bridge identifier'),
      dial_in_numbers: z.array(z.object({
        code: z.string().optional().describe('Country code'),
        number: z.string().optional().describe('Dial-in number'),
        type: z.string().optional().describe('Number type (toll/tollfree)'),
      })).optional().describe('List of dial-in numbers'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, conference_code, leader_pin, tsp_bridge, dial_in_numbers, format }) => {
      try {
        const result = await client.addUserTSP(user_id, {
          conference_code,
          leader_pin,
          tsp_bridge,
          dial_in_numbers,
        });
        return formatResponse(result, format as ResponseFormat, 'tsp_account');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update User TSP
  // ===========================================================================
  server.tool(
    'zoom_update_user_tsp',
    'Update a user\'s TSP account.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      tsp_id: z.string().describe('The TSP account ID to update'),
      conference_code: z.string().optional().describe('New TSP conference code'),
      leader_pin: z.string().optional().describe('New TSP leader PIN'),
      tsp_bridge: z.string().optional().describe('New TSP bridge identifier'),
      dial_in_numbers: z.array(z.object({
        code: z.string().optional().describe('Country code'),
        number: z.string().optional().describe('Dial-in number'),
        type: z.string().optional().describe('Number type'),
      })).optional().describe('Updated list of dial-in numbers'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, tsp_id, conference_code, leader_pin, tsp_bridge, dial_in_numbers, format }) => {
      try {
        await client.updateUserTSP(user_id, tsp_id, {
          conference_code,
          leader_pin,
          tsp_bridge,
          dial_in_numbers,
        });
        return formatResponse({ success: true, message: 'TSP account updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete User TSP
  // ===========================================================================
  server.tool(
    'zoom_delete_user_tsp',
    'Delete a user\'s TSP account.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      tsp_id: z.string().describe('The TSP account ID to delete'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, tsp_id, format }) => {
      try {
        await client.deleteUserTSP(user_id, tsp_id);
        return formatResponse({ success: true, message: 'TSP account deleted' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get User PAC
  // ===========================================================================
  server.tool(
    'zoom_get_user_pac',
    'Get Personal Audio Conference (PAC) settings for a user.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, format }) => {
      try {
        const result = await client.getUserPAC(user_id);
        return formatResponse(result, format as ResponseFormat, 'pac');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Account TSP Info
  // ===========================================================================
  server.tool(
    'zoom_update_tsp_info',
    'Update account TSP (Telephony Service Provider) information.',
    {
      enable: z.boolean().optional().describe('Enable or disable TSP'),
      dial_in_number_unrestricted: z.boolean().optional().describe('Allow unrestricted dial-in numbers'),
      dial_in_numbers: z.array(z.object({
        code: z.string().optional().describe('Country code'),
        number: z.string().optional().describe('Dial-in number'),
        type: z.string().optional().describe('Number type'),
      })).optional().describe('List of dial-in numbers'),
      tsp_bridge: z.string().optional().describe('TSP bridge identifier'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ enable, dial_in_number_unrestricted, dial_in_numbers, tsp_bridge, format }) => {
      try {
        await client.updateTSPInfo({
          enable,
          dial_in_number_unrestricted,
          dial_in_numbers,
          tsp_bridge,
        });
        return formatResponse({ success: true, message: 'TSP info updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
