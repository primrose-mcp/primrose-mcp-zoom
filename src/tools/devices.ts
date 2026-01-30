/**
 * Zoom H.323/SIP Devices Tools
 *
 * MCP tools for managing H.323/SIP devices for room systems.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ZoomClient } from '../client.js';
import type { ResponseFormat } from '../types/entities.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all device-related tools
 */
export function registerDeviceTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // List Devices
  // ===========================================================================
  server.tool(
    'zoom_list_devices',
    'List all H.323/SIP devices.',
    {
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ page_size, next_page_token, format }) => {
      try {
        const result = await client.listDevices({ page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'devices');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Device
  // ===========================================================================
  server.tool(
    'zoom_create_device',
    'Create a new H.323/SIP device.',
    {
      name: z.string().describe('Device name'),
      ip: z.string().describe('Device IP address'),
      protocol: z.enum(['H.323', 'SIP']).describe('Device protocol'),
      encryption: z.enum(['auto', 'yes', 'no']).optional().describe('Encryption setting'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ name, ip, protocol, encryption, format }) => {
      try {
        const result = await client.createDevice({
          name,
          ip,
          protocol,
          encryption,
        });
        return formatResponse(result, format as ResponseFormat, 'device');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Device
  // ===========================================================================
  server.tool(
    'zoom_update_device',
    'Update an existing H.323/SIP device.',
    {
      device_id: z.string().describe('The device ID to update'),
      name: z.string().optional().describe('New device name'),
      ip: z.string().optional().describe('New device IP address'),
      protocol: z.enum(['H.323', 'SIP']).optional().describe('New device protocol'),
      encryption: z.enum(['auto', 'yes', 'no']).optional().describe('New encryption setting'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ device_id, name, ip, protocol, encryption, format }) => {
      try {
        await client.updateDevice(device_id, { name, ip, protocol, encryption });
        return formatResponse({ success: true, message: 'Device updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Device
  // ===========================================================================
  server.tool(
    'zoom_delete_device',
    'Delete an H.323/SIP device.',
    {
      device_id: z.string().describe('The device ID to delete'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ device_id, format }) => {
      try {
        await client.deleteDevice(device_id);
        return formatResponse({ success: true, message: 'Device deleted' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
