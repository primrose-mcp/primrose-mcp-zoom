/**
 * Zoom Archiving and Recording Analytics Tools
 *
 * MCP tools for managing archived files and recording analytics.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ZoomClient } from '../client.js';
import type { ResponseFormat } from '../types/entities.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all archiving and recording analytics tools
 */
export function registerArchivingTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // Archiving
  // ===========================================================================
  server.tool(
    'zoom_list_archived_files',
    'List archived meeting files.',
    {
      from: z.string().optional().describe('Start date in YYYY-MM-DD format'),
      to: z.string().optional().describe('End date in YYYY-MM-DD format'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ from, to, page_size, next_page_token, format }) => {
      try {
        const result = await client.listArchivedFiles({ from, to, page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'archived_files');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_get_archive_statistics',
    'Get statistics about archived files.',
    {
      from: z.string().describe('Start date in YYYY-MM-DD format'),
      to: z.string().describe('End date in YYYY-MM-DD format'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ from, to, format }) => {
      try {
        const result = await client.getArchiveStatistics({ from, to });
        return formatResponse(result, format as ResponseFormat, 'archive_statistics');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_update_archived_file_auto_delete',
    'Update auto-delete setting for an archived file.',
    {
      file_id: z.string().describe('The archived file ID'),
      auto_delete: z.boolean().describe('Whether to auto-delete the file'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ file_id, auto_delete, format }) => {
      try {
        await client.updateArchivedFileAutoDelete(file_id, auto_delete);
        return formatResponse({ success: true, message: 'Auto-delete setting updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_get_meeting_archive_token',
    'Get a token for local archiving of a meeting.',
    {
      meeting_id: z.union([z.number(), z.string()]).describe('The meeting ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, format }) => {
      try {
        const result = await client.getMeetingArchiveToken(meeting_id);
        return formatResponse(result, format as ResponseFormat, 'archive_token');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_get_meeting_archived_files',
    'Get archived files for a past meeting.',
    {
      meeting_uuid: z.string().describe('The meeting UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_uuid, format }) => {
      try {
        const result = await client.getMeetingArchivedFiles(meeting_uuid);
        return formatResponse(result.archive_files, format as ResponseFormat, 'archive_files');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_delete_meeting_archived_files',
    'Delete archived files for a past meeting.',
    {
      meeting_uuid: z.string().describe('The meeting UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_uuid, format }) => {
      try {
        await client.deleteMeetingArchivedFiles(meeting_uuid);
        return formatResponse({ success: true, message: 'Archived files deleted' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Recording Analytics
  // ===========================================================================
  server.tool(
    'zoom_get_recording_analytics_summary',
    'Get analytics summary for a meeting recording.',
    {
      meeting_id: z.string().describe('The meeting ID or UUID'),
      from: z.string().optional().describe('Start date in YYYY-MM-DD format'),
      to: z.string().optional().describe('End date in YYYY-MM-DD format'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, from, to, format }) => {
      try {
        const result = await client.getRecordingAnalyticsSummary(meeting_id, { from, to });
        return formatResponse(result, format as ResponseFormat, 'analytics_summary');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_get_recording_analytics_details',
    'Get detailed analytics for a meeting recording.',
    {
      meeting_id: z.string().describe('The meeting ID or UUID'),
      from: z.string().optional().describe('Start date in YYYY-MM-DD format'),
      to: z.string().optional().describe('End date in YYYY-MM-DD format'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, from, to, page_size, next_page_token, format }) => {
      try {
        const result = await client.getRecordingAnalyticsDetails(meeting_id, { from, to, page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'analytics_details');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Recording Registrants
  // ===========================================================================
  server.tool(
    'zoom_list_recording_registrants',
    'List registrants for a cloud recording.',
    {
      meeting_id: z.string().describe('The meeting ID or UUID'),
      status: z.enum(['pending', 'approved', 'denied']).optional().describe('Filter by status'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, status, page_size, next_page_token, format }) => {
      try {
        const result = await client.listRecordingRegistrants(meeting_id, { status, page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'registrants');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_add_recording_registrant',
    'Register a user to access a cloud recording.',
    {
      meeting_id: z.string().describe('The meeting ID or UUID'),
      email: z.string().email().describe('Registrant email'),
      first_name: z.string().describe('Registrant first name'),
      last_name: z.string().optional().describe('Registrant last name'),
      phone: z.string().optional().describe('Registrant phone'),
      address: z.string().optional().describe('Registrant address'),
      city: z.string().optional().describe('Registrant city'),
      state: z.string().optional().describe('Registrant state'),
      country: z.string().optional().describe('Registrant country'),
      zip: z.string().optional().describe('Registrant zip code'),
      industry: z.string().optional().describe('Registrant industry'),
      org: z.string().optional().describe('Registrant organization'),
      job_title: z.string().optional().describe('Registrant job title'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, email, first_name, last_name, phone, address, city, state, country, zip, industry, org, job_title, format }) => {
      try {
        const result = await client.addRecordingRegistrant(meeting_id, {
          email,
          first_name,
          last_name,
          phone,
          address,
          city,
          state,
          country,
          zip,
          industry,
          org,
          job_title,
        });
        return formatResponse(result, format as ResponseFormat, 'registrant');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
