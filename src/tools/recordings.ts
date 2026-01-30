/**
 * Zoom Recording Tools
 *
 * MCP tools for managing Zoom cloud recordings.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ZoomClient } from '../client.js';
import type { ResponseFormat } from '../types/entities.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all recording-related tools
 */
export function registerRecordingTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // List Recordings
  // ===========================================================================
  server.tool(
    'zoom_list_recordings',
    "List all cloud recordings for a user. By default lists the current month's recordings.",
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      from: z.string().optional().describe('Start date in YYYY-MM-DD format (max 1 month range)'),
      to: z.string().optional().describe('End date in YYYY-MM-DD format'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page (max 300). Default: 30'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, from, to, page_size, next_page_token, format }) => {
      try {
        const result = await client.listRecordings(user_id, { from, to, page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'recordings');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Recording
  // ===========================================================================
  server.tool(
    'zoom_get_recording',
    'Get details of a specific cloud recording by meeting ID/UUID.',
    {
      meeting_id: z.string().describe('The meeting ID or UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, format }) => {
      try {
        const result = await client.getRecording(meeting_id);
        return formatResponse(result, format as ResponseFormat, 'recording');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Recording
  // ===========================================================================
  server.tool(
    'zoom_delete_recording',
    'Delete all cloud recordings for a meeting.',
    {
      meeting_id: z.string().describe('The meeting ID or UUID'),
      action: z.enum(['trash', 'delete']).optional().describe('Action: trash (move to trash) or delete (permanent). Default: trash'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, action = 'trash', format }) => {
      try {
        await client.deleteRecording(meeting_id, action);
        return formatResponse(
          { success: true, message: `Recording ${action === 'trash' ? 'moved to trash' : 'deleted'}` },
          format as ResponseFormat,
          'result'
        );
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Recording File
  // ===========================================================================
  server.tool(
    'zoom_delete_recording_file',
    'Delete a specific recording file from a meeting recording.',
    {
      meeting_id: z.string().describe('The meeting ID or UUID'),
      recording_id: z.string().describe('The recording file ID'),
      action: z.enum(['trash', 'delete']).optional().describe('Action: trash (move to trash) or delete (permanent). Default: trash'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, recording_id, action = 'trash', format }) => {
      try {
        await client.deleteRecordingFile(meeting_id, recording_id, action);
        return formatResponse(
          { success: true, message: `Recording file ${action === 'trash' ? 'moved to trash' : 'deleted'}` },
          format as ResponseFormat,
          'result'
        );
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Recover Recording
  // ===========================================================================
  server.tool(
    'zoom_recover_recording',
    'Recover a recording from trash.',
    {
      meeting_id: z.string().describe('The meeting ID or UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, format }) => {
      try {
        await client.recoverRecording(meeting_id);
        return formatResponse({ success: true, message: 'Recording recovered' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Recording Settings
  // ===========================================================================
  server.tool(
    'zoom_get_recording_settings',
    'Get sharing and access settings for a recording.',
    {
      meeting_id: z.string().describe('The meeting ID or UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, format }) => {
      try {
        const result = await client.getRecordingSettings(meeting_id);
        return formatResponse(result, format as ResponseFormat, 'recording_settings');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Recording Settings
  // ===========================================================================
  server.tool(
    'zoom_update_recording_settings',
    'Update sharing and access settings for a recording.',
    {
      meeting_id: z.string().describe('The meeting ID or UUID'),
      share_recording: z.enum(['publicly', 'internally', 'none']).optional().describe('Share recording setting'),
      recording_authentication: z.boolean().optional().describe('Require authentication to view'),
      authentication_option: z.string().optional().describe('Authentication option ID'),
      authentication_domains: z.string().optional().describe('Comma-separated authentication domains'),
      viewer_download: z.boolean().optional().describe('Allow viewers to download'),
      password: z.string().optional().describe('Recording password'),
      on_demand: z.boolean().optional().describe('Enable on-demand recording'),
      approval_type: z.enum(['0', '1', '2']).optional().describe('Approval type for registration'),
      send_email_to_host: z.boolean().optional().describe('Send email notification to host'),
      show_social_share_buttons: z.boolean().optional().describe('Show social share buttons'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, share_recording, recording_authentication, authentication_option, authentication_domains, viewer_download, password, on_demand, approval_type, send_email_to_host, show_social_share_buttons, format }) => {
      try {
        await client.updateRecordingSettings(meeting_id, {
          share_recording,
          recording_authentication,
          authentication_option,
          authentication_domains,
          viewer_download,
          password,
          on_demand,
          approval_type: approval_type ? (parseInt(approval_type) as 0 | 1 | 2) : undefined,
          send_email_to_host,
          show_social_share_buttons,
        });
        return formatResponse({ success: true, message: 'Recording settings updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Recover Recording File
  // ===========================================================================
  server.tool(
    'zoom_recover_recording_file',
    'Recover a specific recording file from trash.',
    {
      meeting_id: z.string().describe('The meeting ID or UUID'),
      recording_id: z.string().describe('The recording file ID to recover'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, recording_id, format }) => {
      try {
        await client.recoverRecordingFile(meeting_id, recording_id);
        return formatResponse({ success: true, message: 'Recording file recovered' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
