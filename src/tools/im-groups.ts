/**
 * Zoom IM Groups Tools (Legacy)
 *
 * MCP tools for managing IM directory groups.
 * Note: This is a legacy API. For new implementations, consider using Team Chat.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ZoomClient } from '../client.js';
import type { ResponseFormat } from '../types/entities.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all IM group-related tools
 */
export function registerIMGroupTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // List IM Groups
  // ===========================================================================
  server.tool(
    'zoom_list_im_groups',
    'List all IM directory groups.',
    {
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ format }) => {
      try {
        const result = await client.listIMGroups();
        return formatResponse(result.groups, format as ResponseFormat, 'im_groups');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get IM Group
  // ===========================================================================
  server.tool(
    'zoom_get_im_group',
    'Get details of a specific IM directory group.',
    {
      group_id: z.string().describe('The IM group ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ group_id, format }) => {
      try {
        const result = await client.getIMGroup(group_id);
        return formatResponse(result, format as ResponseFormat, 'im_group');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create IM Group
  // ===========================================================================
  server.tool(
    'zoom_create_im_group',
    'Create a new IM directory group.',
    {
      name: z.string().describe('IM group name'),
      search_by_account: z.boolean().optional().describe('Allow searching by account'),
      search_by_domain: z.boolean().optional().describe('Allow searching by domain'),
      search_by_ma_account: z.boolean().optional().describe('Allow searching by master account'),
      type: z.enum(['normal', 'shared', 'restricted']).optional().describe('IM group type'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ name, search_by_account, search_by_domain, search_by_ma_account, type, format }) => {
      try {
        const result = await client.createIMGroup({
          name,
          search_by_account,
          search_by_domain,
          search_by_ma_account,
          type,
        });
        return formatResponse(result, format as ResponseFormat, 'im_group');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update IM Group
  // ===========================================================================
  server.tool(
    'zoom_update_im_group',
    'Update an existing IM directory group.',
    {
      group_id: z.string().describe('The IM group ID to update'),
      name: z.string().optional().describe('New IM group name'),
      search_by_account: z.boolean().optional().describe('Allow searching by account'),
      search_by_domain: z.boolean().optional().describe('Allow searching by domain'),
      search_by_ma_account: z.boolean().optional().describe('Allow searching by master account'),
      type: z.enum(['normal', 'shared', 'restricted']).optional().describe('IM group type'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ group_id, name, search_by_account, search_by_domain, search_by_ma_account, type, format }) => {
      try {
        await client.updateIMGroup(group_id, {
          name,
          search_by_account,
          search_by_domain,
          search_by_ma_account,
          type,
        });
        return formatResponse({ success: true, message: 'IM group updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete IM Group
  // ===========================================================================
  server.tool(
    'zoom_delete_im_group',
    'Delete an IM directory group.',
    {
      group_id: z.string().describe('The IM group ID to delete'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ group_id, format }) => {
      try {
        await client.deleteIMGroup(group_id);
        return formatResponse({ success: true, message: 'IM group deleted' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // List IM Group Members
  // ===========================================================================
  server.tool(
    'zoom_list_im_group_members',
    'List members of an IM directory group.',
    {
      group_id: z.string().describe('The IM group ID'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ group_id, page_size, next_page_token, format }) => {
      try {
        const result = await client.listIMGroupMembers(group_id, { page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'members');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Add IM Group Members
  // ===========================================================================
  server.tool(
    'zoom_add_im_group_members',
    'Add members to an IM directory group.',
    {
      group_id: z.string().describe('The IM group ID'),
      members: z.array(z.object({
        id: z.string().optional().describe('User ID'),
        email: z.string().optional().describe('User email'),
      })).describe('List of members to add (by ID or email)'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ group_id, members, format }) => {
      try {
        await client.addIMGroupMembers(group_id, members);
        return formatResponse({ success: true, message: 'Members added to IM group' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Remove IM Group Member
  // ===========================================================================
  server.tool(
    'zoom_remove_im_group_member',
    'Remove a member from an IM directory group.',
    {
      group_id: z.string().describe('The IM group ID'),
      member_id: z.string().describe('The member ID to remove'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ group_id, member_id, format }) => {
      try {
        await client.deleteIMGroupMember(group_id, member_id);
        return formatResponse({ success: true, message: 'Member removed from IM group' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
