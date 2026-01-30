/**
 * Zoom Reports and Dashboard Tools
 *
 * MCP tools for Zoom reporting and dashboard analytics.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ZoomClient } from '../client.js';
import type { ResponseFormat } from '../types/entities.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all report-related tools
 */
export function registerReportTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // Get Meeting Reports
  // ===========================================================================
  server.tool(
    'zoom_get_meeting_reports',
    'Get meeting reports within a date range.',
    {
      from: z.string().describe('Start date in YYYY-MM-DD format'),
      to: z.string().describe('End date in YYYY-MM-DD format'),
      type: z.enum(['past', 'pastOne', 'live']).optional().describe('Meeting type filter'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ from, to, type, page_size, next_page_token, format }) => {
      try {
        const result = await client.getMeetingReports({ from, to, type, page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'meeting_reports');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Meeting Participants Report
  // ===========================================================================
  server.tool(
    'zoom_get_meeting_participants_report',
    'Get participant report for a past meeting.',
    {
      meeting_id: z.string().describe('The meeting ID or UUID'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, page_size, next_page_token, format }) => {
      try {
        const result = await client.getMeetingParticipantsReport(meeting_id, { page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'participants');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Webinar Reports
  // ===========================================================================
  server.tool(
    'zoom_get_webinar_reports',
    'Get webinar reports within a date range.',
    {
      from: z.string().describe('Start date in YYYY-MM-DD format'),
      to: z.string().describe('End date in YYYY-MM-DD format'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ from, to, page_size, next_page_token, format }) => {
      try {
        const result = await client.getWebinarReports({ from, to, page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'webinar_reports');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Daily Usage Report
  // ===========================================================================
  server.tool(
    'zoom_get_daily_usage_report',
    'Get daily usage report for the account.',
    {
      year: z.number().describe('Year for the report (e.g., 2024)'),
      month: z.number().min(1).max(12).describe('Month for the report (1-12)'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ year, month, format }) => {
      try {
        const result = await client.getDailyUsageReport({ year, month });
        return formatResponse(result, format as ResponseFormat, 'daily_report');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // List Dashboard Meetings
  // ===========================================================================
  server.tool(
    'zoom_list_dashboard_meetings',
    'List live and past meetings from the dashboard with metrics.',
    {
      from: z.string().describe('Start date in YYYY-MM-DD format'),
      to: z.string().describe('End date in YYYY-MM-DD format'),
      type: z.enum(['live', 'past', 'pastOne']).optional().describe('Meeting type'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ from, to, type, page_size, next_page_token, format }) => {
      try {
        const result = await client.listDashboardMeetings({ from, to, type, page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'dashboard_meetings');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // List Dashboard Webinars
  // ===========================================================================
  server.tool(
    'zoom_list_dashboard_webinars',
    'List live and past webinars from the dashboard with metrics.',
    {
      from: z.string().describe('Start date in YYYY-MM-DD format'),
      to: z.string().describe('End date in YYYY-MM-DD format'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ from, to, page_size, next_page_token, format }) => {
      try {
        const result = await client.listDashboardWebinars({ from, to, page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'dashboard_webinars');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Dashboard Meeting Detail
  // ===========================================================================
  server.tool(
    'zoom_get_dashboard_meeting_detail',
    'Get detailed metrics for a specific meeting from the dashboard.',
    {
      meeting_id: z.string().describe('The meeting ID or UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, format }) => {
      try {
        const result = await client.getDashboardMeetingDetail(meeting_id);
        return formatResponse(result, format as ResponseFormat, 'dashboard_meeting');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Dashboard Meeting Participants
  // ===========================================================================
  server.tool(
    'zoom_get_dashboard_meeting_participants',
    'Get participant quality of service data from the dashboard.',
    {
      meeting_id: z.string().describe('The meeting ID or UUID'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, page_size, next_page_token, format }) => {
      try {
        const result = await client.getDashboardMeetingParticipants(meeting_id, { page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'dashboard_participants');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Cloud Recording Report
  // ===========================================================================
  server.tool(
    'zoom_get_cloud_recording_report',
    'Get cloud recording storage usage report.',
    {
      from: z.string().describe('Start date in YYYY-MM-DD format'),
      to: z.string().describe('End date in YYYY-MM-DD format'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ from, to, format }) => {
      try {
        const result = await client.getCloudRecordingReport({ from, to });
        return formatResponse(result, format as ResponseFormat, 'cloud_recording_report');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Telephone Report
  // ===========================================================================
  server.tool(
    'zoom_get_telephone_report',
    'Get telephone usage report (PSTN, toll-free, etc.).',
    {
      from: z.string().describe('Start date in YYYY-MM-DD format'),
      to: z.string().describe('End date in YYYY-MM-DD format'),
      type: z.enum(['1', '2']).optional().describe('Report type: 1=toll-free, 2=call out'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ from, to, type, page_size, next_page_token, format }) => {
      try {
        const result = await client.getTelephoneReport({ from, to, type, page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'telephone_report');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // User Activity Report
  // ===========================================================================
  server.tool(
    'zoom_get_user_activity_report',
    'Get user activity report (active hosts).',
    {
      from: z.string().describe('Start date in YYYY-MM-DD format'),
      to: z.string().describe('End date in YYYY-MM-DD format'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      page_number: z.number().int().min(1).optional().describe('Page number'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ from, to, page_size, page_number, format }) => {
      try {
        const result = await client.getUserActivityReport({ from, to, page_size, page_number });
        return formatResponse(result, format as ResponseFormat, 'user_activity_report');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // User Meetings Report
  // ===========================================================================
  server.tool(
    'zoom_get_user_meetings_report',
    'Get meetings report for a specific user.',
    {
      user_id: z.string().describe('The user ID or email'),
      from: z.string().describe('Start date in YYYY-MM-DD format'),
      to: z.string().describe('End date in YYYY-MM-DD format'),
      type: z.enum(['past', 'pastOne', 'live']).optional().describe('Meeting type filter'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, from, to, type, page_size, next_page_token, format }) => {
      try {
        const result = await client.getUserMeetingsReport(user_id, { from, to, type, page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'user_meetings_report');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Meeting Details Report
  // ===========================================================================
  server.tool(
    'zoom_get_meeting_details_report',
    'Get detailed report for a specific meeting.',
    {
      meeting_id: z.string().describe('The meeting ID or UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, format }) => {
      try {
        const result = await client.getMeetingDetailsReport(meeting_id);
        return formatResponse(result, format as ResponseFormat, 'meeting_details_report');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Meeting Poll Report
  // ===========================================================================
  server.tool(
    'zoom_get_meeting_poll_report',
    'Get poll results report for a meeting.',
    {
      meeting_id: z.string().describe('The meeting ID or UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, format }) => {
      try {
        const result = await client.getMeetingPollReport(meeting_id);
        return formatResponse(result, format as ResponseFormat, 'meeting_poll_report');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Webinar Poll Report
  // ===========================================================================
  server.tool(
    'zoom_get_webinar_poll_report',
    'Get poll results report for a webinar.',
    {
      webinar_id: z.string().describe('The webinar ID or UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, format }) => {
      try {
        const result = await client.getWebinarPollReport(webinar_id);
        return formatResponse(result, format as ResponseFormat, 'webinar_poll_report');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
