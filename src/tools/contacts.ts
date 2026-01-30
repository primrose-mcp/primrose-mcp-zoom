/**
 * Zoom Contacts Tools
 *
 * MCP tools for managing Zoom contacts.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ZoomClient } from '../client.js';
import type { ResponseFormat } from '../types/entities.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all contact-related tools
 */
export function registerContactTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // List Contacts
  // ===========================================================================
  server.tool(
    'zoom_list_contacts',
    'List contacts for the current user.',
    {
      type: z.enum(['company', 'external']).optional().describe('Contact type filter'),
      search_key: z.string().optional().describe('Search by name or email'),
      page_size: z.number().int().min(1).max(50).optional().describe('Number of results per page (max 50)'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ type, search_key, page_size, next_page_token, format }) => {
      try {
        const result = await client.listContacts({ type, search_key, page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'contacts');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Contact
  // ===========================================================================
  server.tool(
    'zoom_get_contact',
    'Get details of a specific contact.',
    {
      contact_id: z.string().describe('The contact ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ contact_id, format }) => {
      try {
        const result = await client.getContact(contact_id);
        return formatResponse(result, format as ResponseFormat, 'contact');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // List External Contacts
  // ===========================================================================
  server.tool(
    'zoom_list_external_contacts',
    'List external contacts for the account.',
    {
      page_size: z.number().int().min(1).max(50).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ page_size, next_page_token, format }) => {
      try {
        const result = await client.listExternalContacts({ page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'external_contacts');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get External Contact
  // ===========================================================================
  server.tool(
    'zoom_get_external_contact',
    'Get details of a specific external contact.',
    {
      external_contact_id: z.string().describe('The external contact ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ external_contact_id, format }) => {
      try {
        const result = await client.getExternalContact(external_contact_id);
        return formatResponse(result, format as ResponseFormat, 'external_contact');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create External Contact
  // ===========================================================================
  server.tool(
    'zoom_create_external_contact',
    'Create a new external contact.',
    {
      email: z.string().email().describe('Contact email address'),
      first_name: z.string().optional().describe('Contact first name'),
      last_name: z.string().optional().describe('Contact last name'),
      phone_number: z.string().optional().describe('Contact phone number'),
      company: z.string().optional().describe('Contact company'),
      description: z.string().optional().describe('Contact description'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ email, first_name, last_name, phone_number, company, description, format }) => {
      try {
        const result = await client.createExternalContact({
          email,
          first_name,
          last_name,
          phone_number,
          company,
          description,
        });
        return formatResponse(result, format as ResponseFormat, 'external_contact');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update External Contact
  // ===========================================================================
  server.tool(
    'zoom_update_external_contact',
    'Update an existing external contact.',
    {
      external_contact_id: z.string().describe('The external contact ID to update'),
      email: z.string().email().optional().describe('New contact email'),
      first_name: z.string().optional().describe('New contact first name'),
      last_name: z.string().optional().describe('New contact last name'),
      phone_number: z.string().optional().describe('New contact phone number'),
      company: z.string().optional().describe('New contact company'),
      description: z.string().optional().describe('New contact description'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ external_contact_id, email, first_name, last_name, phone_number, company, description, format }) => {
      try {
        await client.updateExternalContact(external_contact_id, {
          email,
          first_name,
          last_name,
          phone_number,
          company,
          description,
        });
        return formatResponse({ success: true, message: 'External contact updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete External Contact
  // ===========================================================================
  server.tool(
    'zoom_delete_external_contact',
    'Delete an external contact.',
    {
      external_contact_id: z.string().describe('The external contact ID to delete'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ external_contact_id, format }) => {
      try {
        await client.deleteExternalContact(external_contact_id);
        return formatResponse({ success: true, message: 'External contact deleted' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
