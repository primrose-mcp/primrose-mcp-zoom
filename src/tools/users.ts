/**
 * Zoom User Tools
 *
 * MCP tools for managing Zoom users.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ZoomClient } from '../client.js';
import type { ResponseFormat, ZoomUserType } from '../types/entities.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all user-related tools
 */
export function registerUserTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // List Users
  // ===========================================================================
  server.tool(
    'zoom_list_users',
    'List all users in the Zoom account.',
    {
      status: z.enum(['active', 'inactive', 'pending']).optional().describe('Filter by user status. Default: active'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page (max 300). Default: 30'),
      page_number: z.number().int().optional().describe('Page number for pagination'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ status, page_size, page_number, next_page_token, format }) => {
      try {
        const result = await client.listUsers({ status, page_size, page_number, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'users');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get User
  // ===========================================================================
  server.tool(
    'zoom_get_user',
    'Get details of a specific Zoom user.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, format }) => {
      try {
        const result = await client.getUser(user_id);
        return formatResponse(result, format as ResponseFormat, 'user');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create User
  // ===========================================================================
  server.tool(
    'zoom_create_user',
    'Create a new Zoom user in the account.',
    {
      email: z.string().email().describe('User email address'),
      type: z.number().describe('User type: 1=Basic, 2=Licensed, 3=On-prem, 99=None'),
      first_name: z.string().optional().describe('User first name'),
      last_name: z.string().optional().describe('User last name'),
      action: z.enum(['create', 'autoCreate', 'custCreate', 'ssoCreate']).optional().describe('Creation action type. Default: create'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ email, type, first_name, last_name, action = 'create', format }) => {
      try {
        const result = await client.createUser({
          action: action as 'create' | 'autoCreate' | 'custCreate' | 'ssoCreate',
          user_info: {
            email,
            type: type as ZoomUserType,
            first_name,
            last_name,
          },
        });
        return formatResponse(result, format as ResponseFormat, 'user');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update User
  // ===========================================================================
  server.tool(
    'zoom_update_user',
    'Update an existing Zoom user.',
    {
      user_id: z.string().describe('User ID or email'),
      first_name: z.string().optional().describe('User first name'),
      last_name: z.string().optional().describe('User last name'),
      type: z.number().optional().describe('User type: 1=Basic, 2=Licensed, 3=On-prem, 99=None'),
      dept: z.string().optional().describe('Department'),
      job_title: z.string().optional().describe('Job title'),
      company: z.string().optional().describe('Company name'),
      timezone: z.string().optional().describe('Timezone'),
      language: z.string().optional().describe('Language preference'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, first_name, last_name, type, dept, job_title, company, timezone, language, format }) => {
      try {
        await client.updateUser(user_id, {
          first_name,
          last_name,
          type: type as ZoomUserType | undefined,
          dept,
          job_title,
          company,
          timezone,
          language,
        });
        return formatResponse({ success: true, message: 'User updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete User
  // ===========================================================================
  server.tool(
    'zoom_delete_user',
    'Delete a Zoom user from the account.',
    {
      user_id: z.string().describe('User ID or email'),
      action: z.enum(['disassociate', 'delete']).optional().describe('Action: disassociate (unlink) or delete (permanent). Default: disassociate'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, action = 'disassociate', format }) => {
      try {
        await client.deleteUser(user_id, action);
        return formatResponse({ success: true, message: 'User deleted' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get User Settings
  // ===========================================================================
  server.tool(
    'zoom_get_user_settings',
    "Get a user's Zoom settings.",
    {
      user_id: z.string().describe('User ID or email. Use "me" for current user.'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, format }) => {
      try {
        const result = await client.getUserSettings(user_id);
        return formatResponse(result, format as ResponseFormat, 'settings');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
