/**
 * Zoom Groups and Roles Tools
 *
 * MCP tools for managing Zoom groups and roles.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ZoomClient } from '../client.js';
import type { ResponseFormat } from '../types/entities.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all group and role-related tools
 */
export function registerGroupTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // List Groups
  // ===========================================================================
  server.tool(
    'zoom_list_groups',
    'List all groups in the Zoom account.',
    {
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ format }) => {
      try {
        const result = await client.listGroups();
        return formatResponse(result.groups, format as ResponseFormat, 'groups');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Group
  // ===========================================================================
  server.tool(
    'zoom_get_group',
    'Get details of a specific group.',
    {
      group_id: z.string().describe('The group ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ group_id, format }) => {
      try {
        const result = await client.getGroup(group_id);
        return formatResponse(result, format as ResponseFormat, 'group');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Group
  // ===========================================================================
  server.tool(
    'zoom_create_group',
    'Create a new group in the Zoom account.',
    {
      name: z.string().describe('Group name'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ name, format }) => {
      try {
        const result = await client.createGroup({ name });
        return formatResponse(result, format as ResponseFormat, 'group');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Group
  // ===========================================================================
  server.tool(
    'zoom_update_group',
    'Update an existing group.',
    {
      group_id: z.string().describe('The group ID to update'),
      name: z.string().describe('New group name'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ group_id, name, format }) => {
      try {
        await client.updateGroup(group_id, { name });
        return formatResponse({ success: true, message: 'Group updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Group
  // ===========================================================================
  server.tool(
    'zoom_delete_group',
    'Delete a group from the Zoom account.',
    {
      group_id: z.string().describe('The group ID to delete'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ group_id, format }) => {
      try {
        await client.deleteGroup(group_id);
        return formatResponse({ success: true, message: 'Group deleted' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // List Group Members
  // ===========================================================================
  server.tool(
    'zoom_list_group_members',
    'List members of a group.',
    {
      group_id: z.string().describe('The group ID'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ group_id, page_size, next_page_token, format }) => {
      try {
        const result = await client.listGroupMembers(group_id, { page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'members');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Add Group Members
  // ===========================================================================
  server.tool(
    'zoom_add_group_members',
    'Add members to a group.',
    {
      group_id: z.string().describe('The group ID'),
      members: z.array(z.object({
        id: z.string().optional().describe('User ID'),
        email: z.string().optional().describe('User email'),
      })).describe('List of members to add (by ID or email)'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ group_id, members, format }) => {
      try {
        await client.addGroupMembers(group_id, members);
        return formatResponse({ success: true, message: 'Members added to group' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Remove Group Member
  // ===========================================================================
  server.tool(
    'zoom_remove_group_member',
    'Remove a member from a group.',
    {
      group_id: z.string().describe('The group ID'),
      member_id: z.string().describe('The member ID to remove'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ group_id, member_id, format }) => {
      try {
        await client.deleteGroupMember(group_id, member_id);
        return formatResponse({ success: true, message: 'Member removed from group' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // List Roles
  // ===========================================================================
  server.tool(
    'zoom_list_roles',
    'List all roles in the Zoom account.',
    {
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ format }) => {
      try {
        const result = await client.listRoles();
        return formatResponse(result.roles, format as ResponseFormat, 'roles');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Role
  // ===========================================================================
  server.tool(
    'zoom_get_role',
    'Get details of a specific role.',
    {
      role_id: z.string().describe('The role ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ role_id, format }) => {
      try {
        const result = await client.getRole(role_id);
        return formatResponse(result, format as ResponseFormat, 'role');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Role
  // ===========================================================================
  server.tool(
    'zoom_create_role',
    'Create a new role in the Zoom account.',
    {
      name: z.string().describe('Role name'),
      description: z.string().optional().describe('Role description'),
      privileges: z.array(z.string()).optional().describe('List of privilege IDs for the role'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ name, description, privileges, format }) => {
      try {
        const result = await client.createRole({ name, description, privileges });
        return formatResponse(result, format as ResponseFormat, 'role');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Role
  // ===========================================================================
  server.tool(
    'zoom_update_role',
    'Update an existing role.',
    {
      role_id: z.string().describe('The role ID to update'),
      name: z.string().optional().describe('New role name'),
      description: z.string().optional().describe('New role description'),
      privileges: z.array(z.string()).optional().describe('Updated list of privilege IDs'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ role_id, name, description, privileges, format }) => {
      try {
        const updateData: { name?: string; description?: string; privileges?: string[] } = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (privileges !== undefined) updateData.privileges = privileges;
        await client.updateRole(role_id, updateData as { name: string; description?: string; privileges?: string[] });
        return formatResponse({ success: true, message: 'Role updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Role
  // ===========================================================================
  server.tool(
    'zoom_delete_role',
    'Delete a role from the Zoom account.',
    {
      role_id: z.string().describe('The role ID to delete'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ role_id, format }) => {
      try {
        await client.deleteRole(role_id);
        return formatResponse({ success: true, message: 'Role deleted' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // List Role Members
  // ===========================================================================
  server.tool(
    'zoom_list_role_members',
    'List members assigned to a role.',
    {
      role_id: z.string().describe('The role ID'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ role_id, page_size, next_page_token, format }) => {
      try {
        const result = await client.listRoleMembers(role_id, { page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'members');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Assign Role Members
  // ===========================================================================
  server.tool(
    'zoom_assign_role_members',
    'Assign members to a role.',
    {
      role_id: z.string().describe('The role ID'),
      members: z.array(z.object({
        id: z.string().optional().describe('User ID'),
        email: z.string().optional().describe('User email'),
      })).describe('List of members to assign (by ID or email)'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ role_id, members, format }) => {
      try {
        await client.assignRoleMembers(role_id, members);
        return formatResponse({ success: true, message: 'Members assigned to role' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Unassign Role Member
  // ===========================================================================
  server.tool(
    'zoom_unassign_role_member',
    'Unassign a member from a role.',
    {
      role_id: z.string().describe('The role ID'),
      member_id: z.string().describe('The member ID to unassign'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ role_id, member_id, format }) => {
      try {
        await client.unassignRoleMember(role_id, member_id);
        return formatResponse({ success: true, message: 'Member unassigned from role' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
