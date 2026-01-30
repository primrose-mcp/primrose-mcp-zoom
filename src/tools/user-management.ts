/**
 * Zoom User Management Tools
 *
 * MCP tools for managing user assistants, schedulers, permissions, and settings.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ZoomClient } from '../client.js';
import type { ResponseFormat } from '../types/entities.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all user management-related tools
 */
export function registerUserManagementTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // User Assistants
  // ===========================================================================
  server.tool(
    'zoom_list_user_assistants',
    'List assistants assigned to a user for scheduling.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, format }) => {
      try {
        const result = await client.listUserAssistants(user_id);
        return formatResponse(result.assistants, format as ResponseFormat, 'assistants');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_add_user_assistants',
    'Add scheduling assistants to a user.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      assistants: z.array(z.object({
        id: z.string().optional().describe('Assistant user ID'),
        email: z.string().optional().describe('Assistant email'),
      })).describe('List of assistants to add (by ID or email)'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, assistants, format }) => {
      try {
        await client.addUserAssistants(user_id, assistants);
        return formatResponse({ success: true, message: 'Assistants added' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_delete_user_assistants',
    'Remove all scheduling assistants from a user.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, format }) => {
      try {
        await client.deleteUserAssistants(user_id);
        return formatResponse({ success: true, message: 'All assistants removed' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_delete_user_assistant',
    'Remove a specific scheduling assistant from a user.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      assistant_id: z.string().describe('The assistant ID to remove'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, assistant_id, format }) => {
      try {
        await client.deleteUserAssistant(user_id, assistant_id);
        return formatResponse({ success: true, message: 'Assistant removed' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // User Schedulers
  // ===========================================================================
  server.tool(
    'zoom_list_user_schedulers',
    'List users who can schedule meetings for this user.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, format }) => {
      try {
        const result = await client.listUserSchedulers(user_id);
        return formatResponse(result.schedulers, format as ResponseFormat, 'schedulers');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_delete_user_schedulers',
    'Remove all scheduler privileges from a user.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, format }) => {
      try {
        await client.deleteUserSchedulers(user_id);
        return formatResponse({ success: true, message: 'All schedulers removed' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_delete_user_scheduler',
    'Remove a specific scheduler from a user.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      scheduler_id: z.string().describe('The scheduler ID to remove'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, scheduler_id, format }) => {
      try {
        await client.deleteUserScheduler(user_id, scheduler_id);
        return formatResponse({ success: true, message: 'Scheduler removed' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // User Permissions & Token
  // ===========================================================================
  server.tool(
    'zoom_get_user_permissions',
    'Get permissions for a user.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, format }) => {
      try {
        const result = await client.getUserPermissions(user_id);
        return formatResponse(result, format as ResponseFormat, 'permissions');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_get_user_token',
    'Get a user token for Zoom APIs.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      type: z.enum(['token', 'zak']).optional().describe('Token type: token (default) or zak'),
      ttl: z.number().optional().describe('Token time to live in seconds'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, type, ttl, format }) => {
      try {
        const result = await client.getUserToken(user_id, type, ttl);
        return formatResponse(result, format as ResponseFormat, 'token');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_revoke_user_sso_token',
    'Revoke a user\'s SSO token.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, format }) => {
      try {
        await client.revokeUserSSOToken(user_id);
        return formatResponse({ success: true, message: 'SSO token revoked' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_update_user_password',
    'Update a user\'s password.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      password: z.string().describe('New password'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, password, format }) => {
      try {
        await client.updateUserPassword(user_id, password);
        return formatResponse({ success: true, message: 'Password updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_update_user_status',
    'Activate or deactivate a user.',
    {
      user_id: z.string().describe('User ID or email'),
      action: z.enum(['activate', 'deactivate']).describe('Action to perform'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, action, format }) => {
      try {
        await client.updateUserStatus(user_id, action);
        return formatResponse({ success: true, message: `User ${action}d` }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // User Email & Vanity
  // ===========================================================================
  server.tool(
    'zoom_check_user_email',
    'Check if an email is already registered with Zoom.',
    {
      email: z.string().email().describe('Email address to check'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ email, format }) => {
      try {
        const result = await client.checkUserEmail(email);
        return formatResponse(result, format as ResponseFormat, 'email_check');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_check_vanity_name',
    'Check if a personal meeting room name (vanity URL) is available.',
    {
      vanity_name: z.string().describe('Vanity name to check'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ vanity_name, format }) => {
      try {
        const result = await client.checkVanityName(vanity_name);
        return formatResponse(result, format as ResponseFormat, 'vanity_check');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_get_user_zpk',
    'Get the Zoom Phone Key (ZPK) for the current user. Used for phone-related authentication.',
    {
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ format }) => {
      try {
        const result = await client.getUserZPK();
        return formatResponse(result, format as ResponseFormat, 'zpk');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Meeting & Webinar Templates
  // ===========================================================================
  server.tool(
    'zoom_list_meeting_templates',
    'List meeting templates for a user.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, format }) => {
      try {
        const result = await client.listMeetingTemplates(user_id);
        return formatResponse(result.templates, format as ResponseFormat, 'meeting_templates');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_list_webinar_templates',
    'List webinar templates for a user.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, format }) => {
      try {
        const result = await client.listWebinarTemplates(user_id);
        return formatResponse(result.templates, format as ResponseFormat, 'webinar_templates');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // User Picture
  // ===========================================================================
  server.tool(
    'zoom_upload_user_picture',
    'Upload a profile picture for a user.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      pic_url: z.string().describe('URL of the picture to upload'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, pic_url, format }) => {
      try {
        await client.uploadUserPicture(user_id, pic_url);
        return formatResponse({ success: true, message: 'User picture uploaded' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_delete_user_picture',
    'Delete profile picture for a user.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, format }) => {
      try {
        await client.deleteUserPicture(user_id);
        return formatResponse({ success: true, message: 'User picture deleted' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
