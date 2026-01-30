/**
 * Zoom Rooms Tools
 *
 * MCP tools for managing Zoom Rooms, locations, devices, and settings.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ZoomClient } from '../client.js';
import type { ResponseFormat } from '../types/entities.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all Zoom Rooms tools
 */
export function registerRoomTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // Zoom Rooms CRUD
  // ===========================================================================
  server.tool(
    'zoom_list_rooms',
    'List all Zoom Rooms.',
    {
      location_id: z.string().optional().describe('Filter by location ID'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ location_id, page_size, next_page_token, format }) => {
      try {
        const result = await client.listRooms({ location_id, page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'rooms');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_get_room',
    'Get details of a specific Zoom Room.',
    {
      room_id: z.string().describe('The Zoom Room ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ room_id, format }) => {
      try {
        const result = await client.getRoom(room_id);
        return formatResponse(result, format as ResponseFormat, 'room');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_create_room',
    'Create a new Zoom Room.',
    {
      name: z.string().describe('Room name'),
      type: z.string().describe('Room type (e.g., "ZoomRoom", "SchedulingDisplayOnly")'),
      location_id: z.string().optional().describe('Location ID to assign the room to'),
      calendar_resource_id: z.string().optional().describe('Calendar resource ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ name, type, location_id, calendar_resource_id, format }) => {
      try {
        const result = await client.createRoom({
          name,
          type,
          location_id,
          calendar_resource_id,
        });
        return formatResponse(result, format as ResponseFormat, 'room');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_update_room',
    'Update a Zoom Room.',
    {
      room_id: z.string().describe('The Zoom Room ID'),
      name: z.string().optional().describe('New room name'),
      type: z.string().optional().describe('New room type'),
      location_id: z.string().optional().describe('New location ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ room_id, name, type, location_id, format }) => {
      try {
        await client.updateRoom(room_id, { name, type, location_id });
        return formatResponse({ success: true, message: 'Room updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_delete_room',
    'Delete a Zoom Room.',
    {
      room_id: z.string().describe('The Zoom Room ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ room_id, format }) => {
      try {
        await client.deleteRoom(room_id);
        return formatResponse({ success: true, message: 'Room deleted' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Zoom Room Locations
  // ===========================================================================
  server.tool(
    'zoom_list_room_locations',
    'List all Zoom Room locations.',
    {
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ page_size, next_page_token, format }) => {
      try {
        const result = await client.listRoomLocations({ page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'locations');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_get_room_location',
    'Get details of a specific Zoom Room location.',
    {
      location_id: z.string().describe('The location ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ location_id, format }) => {
      try {
        const result = await client.getRoomLocation(location_id);
        return formatResponse(result, format as ResponseFormat, 'location');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_create_room_location',
    'Create a new Zoom Room location.',
    {
      name: z.string().describe('Location name'),
      parent_location_id: z.string().optional().describe('Parent location ID for hierarchy'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ name, parent_location_id, format }) => {
      try {
        const result = await client.createRoomLocation({ name, parent_location_id });
        return formatResponse(result, format as ResponseFormat, 'location');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_update_room_location',
    'Update a Zoom Room location.',
    {
      location_id: z.string().describe('The location ID'),
      name: z.string().optional().describe('New location name'),
      parent_location_id: z.string().optional().describe('New parent location ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ location_id, name, parent_location_id, format }) => {
      try {
        await client.updateRoomLocation(location_id, { name, parent_location_id });
        return formatResponse({ success: true, message: 'Location updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_delete_room_location',
    'Delete a Zoom Room location.',
    {
      location_id: z.string().describe('The location ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ location_id, format }) => {
      try {
        await client.deleteRoomLocation(location_id);
        return formatResponse({ success: true, message: 'Location deleted' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Zoom Room Devices
  // ===========================================================================
  server.tool(
    'zoom_list_room_devices',
    'List devices associated with a Zoom Room.',
    {
      room_id: z.string().describe('The Zoom Room ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ room_id, format }) => {
      try {
        const result = await client.listRoomDevices(room_id);
        return formatResponse(result.devices, format as ResponseFormat, 'devices');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Zoom Room Settings
  // ===========================================================================
  server.tool(
    'zoom_get_room_settings',
    'Get settings for a Zoom Room.',
    {
      room_id: z.string().describe('The Zoom Room ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ room_id, format }) => {
      try {
        const result = await client.getRoomSettings(room_id);
        return formatResponse(result, format as ResponseFormat, 'room_settings');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_update_room_settings',
    'Update settings for a Zoom Room.',
    {
      room_id: z.string().describe('The Zoom Room ID'),
      schedule_meeting: z.object({
        host_video: z.boolean().optional(),
        participant_video: z.boolean().optional(),
        audio_type: z.string().optional(),
        join_before_host: z.boolean().optional(),
      }).optional().describe('Schedule meeting settings'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ room_id, schedule_meeting, format }) => {
      try {
        await client.updateRoomSettings(room_id, { schedule_meeting });
        return formatResponse({ success: true, message: 'Room settings updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
