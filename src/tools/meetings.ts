/**
 * Zoom Meeting Tools
 *
 * MCP tools for managing Zoom meetings, registrants, and past meeting data.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ZoomClient } from '../client.js';
import type { ResponseFormat } from '../types/entities.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all meeting-related tools
 */
export function registerMeetingTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // List Meetings
  // ===========================================================================
  server.tool(
    'zoom_list_meetings',
    'List all meetings for a Zoom user. Returns scheduled, live, and upcoming meetings.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      type: z.enum(['scheduled', 'live', 'upcoming', 'upcoming_meetings', 'previous_meetings']).optional().describe('Type of meetings to list. Default: scheduled'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page (max 300). Default: 30'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ user_id, type, page_size, next_page_token, format }) => {
      try {
        const result = await client.listMeetings(user_id, { type, page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'meetings');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Meeting
  // ===========================================================================
  server.tool(
    'zoom_get_meeting',
    'Get details of a specific Zoom meeting by meeting ID.',
    {
      meeting_id: z.number().describe('The meeting ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, format }) => {
      try {
        const result = await client.getMeeting(meeting_id);
        return formatResponse(result, format as ResponseFormat, 'meeting');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Meeting
  // ===========================================================================
  server.tool(
    'zoom_create_meeting',
    'Create a new Zoom meeting for a user.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      topic: z.string().describe('Meeting topic/title'),
      type: z.number().optional().describe('Meeting type: 1=Instant, 2=Scheduled, 3=Recurring (no fixed time), 8=Recurring (fixed time). Default: 2'),
      start_time: z.string().optional().describe('Meeting start time in ISO 8601 format'),
      duration: z.number().optional().describe('Meeting duration in minutes'),
      timezone: z.string().optional().describe('Timezone (e.g., America/Los_Angeles)'),
      password: z.string().optional().describe('Meeting password (max 10 characters)'),
      agenda: z.string().optional().describe('Meeting description/agenda'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, topic, type, start_time, duration, timezone, password, agenda, format }) => {
      try {
        const result = await client.createMeeting(user_id, {
          topic,
          type: type as 1 | 2 | 3 | 8 | undefined,
          start_time,
          duration,
          timezone,
          password,
          agenda,
        });
        return formatResponse(result, format as ResponseFormat, 'meeting');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Meeting
  // ===========================================================================
  server.tool(
    'zoom_update_meeting',
    'Update an existing Zoom meeting.',
    {
      meeting_id: z.number().describe('The meeting ID to update'),
      topic: z.string().optional().describe('New meeting topic'),
      start_time: z.string().optional().describe('New start time in ISO 8601 format'),
      duration: z.number().optional().describe('New duration in minutes'),
      timezone: z.string().optional().describe('New timezone'),
      password: z.string().optional().describe('New password'),
      agenda: z.string().optional().describe('New agenda/description'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, topic, start_time, duration, timezone, password, agenda, format }) => {
      try {
        await client.updateMeeting(meeting_id, { topic, start_time, duration, timezone, password, agenda });
        return formatResponse({ success: true, message: 'Meeting updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Meeting
  // ===========================================================================
  server.tool(
    'zoom_delete_meeting',
    'Delete a Zoom meeting.',
    {
      meeting_id: z.number().describe('The meeting ID to delete'),
      occurrence_id: z.string().optional().describe('For recurring meetings, the occurrence ID to delete'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, occurrence_id, format }) => {
      try {
        await client.deleteMeeting(meeting_id, { occurrence_id });
        return formatResponse({ success: true, message: 'Meeting deleted' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // End Meeting
  // ===========================================================================
  server.tool(
    'zoom_end_meeting',
    'End a live Zoom meeting.',
    {
      meeting_id: z.number().describe('The meeting ID to end'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, format }) => {
      try {
        await client.updateMeetingStatus(meeting_id, 'end');
        return formatResponse({ success: true, message: 'Meeting ended' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // List Meeting Registrants
  // ===========================================================================
  server.tool(
    'zoom_list_meeting_registrants',
    'List registrants for a Zoom meeting.',
    {
      meeting_id: z.number().describe('The meeting ID'),
      status: z.enum(['pending', 'approved', 'denied']).optional().describe('Filter by registrant status'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, status, page_size, next_page_token, format }) => {
      try {
        const result = await client.listMeetingRegistrants(meeting_id, { status, page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'registrants');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Add Meeting Registrant
  // ===========================================================================
  server.tool(
    'zoom_add_meeting_registrant',
    'Register a participant for a Zoom meeting.',
    {
      meeting_id: z.number().describe('The meeting ID'),
      email: z.string().email().describe('Registrant email address'),
      first_name: z.string().describe('Registrant first name'),
      last_name: z.string().optional().describe('Registrant last name'),
      phone: z.string().optional().describe('Registrant phone number'),
      org: z.string().optional().describe('Registrant organization'),
      job_title: z.string().optional().describe('Registrant job title'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, email, first_name, last_name, phone, org, job_title, format }) => {
      try {
        const result = await client.addMeetingRegistrant(meeting_id, {
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
  // Update Meeting Registrant Status
  // ===========================================================================
  server.tool(
    'zoom_update_meeting_registrant_status',
    'Approve, deny, or cancel meeting registrants.',
    {
      meeting_id: z.number().describe('The meeting ID'),
      action: z.enum(['approve', 'deny', 'cancel']).describe('Action to take on registrants'),
      registrants: z.array(z.object({
        id: z.string().optional(),
        email: z.string().optional(),
      })).describe('List of registrants (by ID or email)'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, action, registrants, format }) => {
      try {
        await client.updateMeetingRegistrantStatus(meeting_id, action, registrants);
        return formatResponse({ success: true, message: `Registrants ${action}ed` }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Past Meeting
  // ===========================================================================
  server.tool(
    'zoom_get_past_meeting',
    'Get details of a past/ended meeting by UUID.',
    {
      meeting_uuid: z.string().describe('The meeting UUID (from past meeting)'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_uuid, format }) => {
      try {
        const result = await client.getPastMeeting(meeting_uuid);
        return formatResponse(result, format as ResponseFormat, 'past_meeting');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Past Meeting Participants
  // ===========================================================================
  server.tool(
    'zoom_get_past_meeting_participants',
    'Get participants from a past meeting.',
    {
      meeting_uuid: z.string().describe('The meeting UUID'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_uuid, page_size, next_page_token, format }) => {
      try {
        const result = await client.getPastMeetingParticipants(meeting_uuid, { page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'participants');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
