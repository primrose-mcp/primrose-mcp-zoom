/**
 * Zoom Dashboard and Metrics Tools
 *
 * MCP tools for dashboard metrics including CRC, IM, Zoom Rooms, QoS, and sharing details.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ZoomClient } from '../client.js';
import type { ResponseFormat } from '../types/entities.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all dashboard and metrics tools
 */
export function registerDashboardTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // CRC Metrics
  // ===========================================================================
  server.tool(
    'zoom_get_crc_metrics',
    'Get Cloud Room Connector metrics.',
    {
      from: z.string().describe('Start date in YYYY-MM-DD format'),
      to: z.string().describe('End date in YYYY-MM-DD format'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ from, to, format }) => {
      try {
        const result = await client.getCRCMetrics({ from, to });
        return formatResponse(result, format as ResponseFormat, 'crc_metrics');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // IM Metrics
  // ===========================================================================
  server.tool(
    'zoom_get_im_metrics',
    'Get IM (Instant Messaging) metrics.',
    {
      from: z.string().describe('Start date in YYYY-MM-DD format'),
      to: z.string().describe('End date in YYYY-MM-DD format'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ from, to, format }) => {
      try {
        const result = await client.getIMMetrics({ from, to });
        return formatResponse(result, format as ResponseFormat, 'im_metrics');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Zoom Rooms Metrics
  // ===========================================================================
  server.tool(
    'zoom_list_zoomroom_metrics',
    'List Zoom Rooms dashboard metrics.',
    {
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ page_size, next_page_token, format }) => {
      try {
        const result = await client.listZoomRoomMetrics({ page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'zoomroom_metrics');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_get_zoomroom_metrics',
    'Get metrics for a specific Zoom Room.',
    {
      room_id: z.string().describe('The Zoom Room ID'),
      from: z.string().describe('Start date in YYYY-MM-DD format'),
      to: z.string().describe('End date in YYYY-MM-DD format'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ room_id, from, to, format }) => {
      try {
        const result = await client.getZoomRoomMetrics(room_id, { from, to });
        return formatResponse(result, format as ResponseFormat, 'zoomroom_metrics');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Meeting QoS Metrics
  // ===========================================================================
  server.tool(
    'zoom_get_meeting_participant_qos',
    'Get QoS (Quality of Service) data for a specific meeting participant.',
    {
      meeting_id: z.string().describe('The meeting ID or UUID'),
      participant_id: z.string().describe('The participant ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, participant_id, format }) => {
      try {
        const result = await client.getMeetingParticipantQoS(meeting_id, participant_id);
        return formatResponse(result, format as ResponseFormat, 'participant_qos');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_list_meeting_participants_qos',
    'List QoS data for all participants in a meeting.',
    {
      meeting_id: z.string().describe('The meeting ID or UUID'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, page_size, next_page_token, format }) => {
      try {
        const result = await client.listMeetingParticipantsQoS(meeting_id, { page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'participants_qos');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_get_meeting_sharing_details',
    'Get sharing/recording details for meeting participants.',
    {
      meeting_id: z.string().describe('The meeting ID or UUID'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, page_size, next_page_token, format }) => {
      try {
        const result = await client.getMeetingParticipantsSharing(meeting_id, { page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'sharing_details');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Webinar QoS Metrics
  // ===========================================================================
  server.tool(
    'zoom_get_webinar_participant_qos',
    'Get QoS data for a specific webinar participant.',
    {
      webinar_id: z.string().describe('The webinar ID or UUID'),
      participant_id: z.string().describe('The participant ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, participant_id, format }) => {
      try {
        const result = await client.getWebinarParticipantQoS(webinar_id, participant_id);
        return formatResponse(result, format as ResponseFormat, 'participant_qos');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_list_webinar_participants_qos',
    'List QoS data for all participants in a webinar.',
    {
      webinar_id: z.string().describe('The webinar ID or UUID'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, page_size, next_page_token, format }) => {
      try {
        const result = await client.listWebinarParticipantsQoS(webinar_id, { page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'participants_qos');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_get_webinar_sharing_details',
    'Get sharing/recording details for webinar participants.',
    {
      webinar_id: z.string().describe('The webinar ID or UUID'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, page_size, next_page_token, format }) => {
      try {
        const result = await client.getWebinarParticipantsSharing(webinar_id, { page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'sharing_details');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // IM Chat Sessions
  // ===========================================================================
  server.tool(
    'zoom_list_im_chat_sessions',
    'List IM chat sessions.',
    {
      from: z.string().optional().describe('Start date in YYYY-MM-DD format'),
      to: z.string().optional().describe('End date in YYYY-MM-DD format'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ from, to, page_size, next_page_token, format }) => {
      try {
        const result = await client.listIMChatSessions({ from, to, page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'chat_sessions');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_get_im_chat_messages',
    'Get messages from an IM chat session.',
    {
      session_id: z.string().describe('The chat session ID'),
      from: z.string().optional().describe('Start date in YYYY-MM-DD format'),
      to: z.string().optional().describe('End date in YYYY-MM-DD format'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ session_id, from, to, page_size, next_page_token, format }) => {
      try {
        const result = await client.getIMChatMessages(session_id, { from, to, page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'chat_messages');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
