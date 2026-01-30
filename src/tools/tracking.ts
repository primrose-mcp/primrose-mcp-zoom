/**
 * Zoom Tracking Fields Tools
 *
 * MCP tools for managing meeting tracking fields.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ZoomClient } from '../client.js';
import type { ResponseFormat } from '../types/entities.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all tracking field-related tools
 */
export function registerTrackingFieldTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // List Tracking Fields
  // ===========================================================================
  server.tool(
    'zoom_list_tracking_fields',
    'List all tracking fields in the account.',
    {
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ format }) => {
      try {
        const result = await client.listTrackingFields();
        return formatResponse(result.tracking_fields, format as ResponseFormat, 'tracking_fields');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Tracking Field
  // ===========================================================================
  server.tool(
    'zoom_get_tracking_field',
    'Get details of a specific tracking field.',
    {
      field_id: z.string().describe('The tracking field ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ field_id, format }) => {
      try {
        const result = await client.getTrackingField(field_id);
        return formatResponse(result, format as ResponseFormat, 'tracking_field');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Tracking Field
  // ===========================================================================
  server.tool(
    'zoom_create_tracking_field',
    'Create a new tracking field.',
    {
      field: z.string().describe('Tracking field name/label'),
      recommended_values: z.array(z.string()).optional().describe('List of recommended values'),
      required: z.boolean().optional().describe('Whether the field is required'),
      visible: z.boolean().optional().describe('Whether the field is visible'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ field, recommended_values, required, visible, format }) => {
      try {
        const result = await client.createTrackingField({
          field,
          recommended_values,
          required,
          visible,
        });
        return formatResponse(result, format as ResponseFormat, 'tracking_field');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Tracking Field
  // ===========================================================================
  server.tool(
    'zoom_update_tracking_field',
    'Update an existing tracking field.',
    {
      field_id: z.string().describe('The tracking field ID to update'),
      field: z.string().optional().describe('New tracking field name/label'),
      recommended_values: z.array(z.string()).optional().describe('New list of recommended values'),
      required: z.boolean().optional().describe('Whether the field is required'),
      visible: z.boolean().optional().describe('Whether the field is visible'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ field_id, field, recommended_values, required, visible, format }) => {
      try {
        await client.updateTrackingField(field_id, {
          field,
          recommended_values,
          required,
          visible,
        });
        return formatResponse({ success: true, message: 'Tracking field updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Tracking Field
  // ===========================================================================
  server.tool(
    'zoom_delete_tracking_field',
    'Delete a tracking field.',
    {
      field_id: z.string().describe('The tracking field ID to delete'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ field_id, format }) => {
      try {
        await client.deleteTrackingField(field_id);
        return formatResponse({ success: true, message: 'Tracking field deleted' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
