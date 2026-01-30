/**
 * Zoom Livestream and Registrant Questions Tools
 *
 * MCP tools for managing meeting/webinar livestream settings and registrant questions.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ZoomClient } from '../client.js';
import type { ResponseFormat } from '../types/entities.js';
import { formatError, formatResponse } from '../utils/formatters.js';

// Schema for registrant questions
const registrantQuestionSchema = z.object({
  field_name: z.string().describe('Standard field name'),
  required: z.boolean().optional().describe('Whether the field is required'),
});

const customQuestionSchema = z.object({
  title: z.string().describe('Question title'),
  type: z.enum(['short', 'single']).describe('Question type: short answer or single choice'),
  required: z.boolean().optional().describe('Whether the question is required'),
  answers: z.array(z.string()).optional().describe('Answer options for single choice'),
});

/**
 * Register all livestream and registrant question tools
 */
export function registerLivestreamTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // Meeting Livestream
  // ===========================================================================
  server.tool(
    'zoom_get_meeting_livestream',
    'Get livestream settings for a meeting.',
    {
      meeting_id: z.union([z.number(), z.string()]).describe('The meeting ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, format }) => {
      try {
        const result = await client.getMeetingLivestreamSettings(meeting_id);
        return formatResponse(result, format as ResponseFormat, 'livestream');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_update_meeting_livestream',
    'Update livestream settings for a meeting (configure custom livestream).',
    {
      meeting_id: z.union([z.number(), z.string()]).describe('The meeting ID'),
      stream_url: z.string().optional().describe('Livestream URL'),
      stream_key: z.string().optional().describe('Livestream key'),
      page_url: z.string().optional().describe('Livestream page URL'),
      resolution: z.string().optional().describe('Livestream resolution'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, stream_url, stream_key, page_url, resolution, format }) => {
      try {
        await client.updateMeetingLivestreamSettings(meeting_id, {
          stream_url,
          stream_key,
          page_url,
          resolution,
        });
        return formatResponse({ success: true, message: 'Livestream settings updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_update_meeting_livestream_status',
    'Start or stop a meeting livestream.',
    {
      meeting_id: z.union([z.number(), z.string()]).describe('The meeting ID'),
      action: z.enum(['start', 'stop']).describe('Action to perform'),
      active_speaker_name: z.boolean().optional().describe('Show active speaker name'),
      display_name: z.string().optional().describe('Display name during livestream'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, action, active_speaker_name, display_name, format }) => {
      try {
        const settings = active_speaker_name !== undefined || display_name !== undefined
          ? { active_speaker_name, display_name }
          : undefined;
        await client.updateMeetingLivestreamStatus(meeting_id, action, settings);
        return formatResponse({ success: true, message: `Livestream ${action}ed` }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Meeting Registrant Questions
  // ===========================================================================
  server.tool(
    'zoom_get_meeting_registrant_questions',
    'Get custom registrant questions for a meeting.',
    {
      meeting_id: z.union([z.number(), z.string()]).describe('The meeting ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, format }) => {
      try {
        const result = await client.getMeetingRegistrantQuestions(meeting_id);
        return formatResponse(result, format as ResponseFormat, 'registrant_questions');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_update_meeting_registrant_questions',
    'Update custom registrant questions for a meeting.',
    {
      meeting_id: z.union([z.number(), z.string()]).describe('The meeting ID'),
      questions: z.array(registrantQuestionSchema).optional().describe('Standard field questions'),
      custom_questions: z.array(customQuestionSchema).optional().describe('Custom questions'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, questions, custom_questions, format }) => {
      try {
        await client.updateMeetingRegistrantQuestions(meeting_id, {
          questions,
          custom_questions,
        });
        return formatResponse({ success: true, message: 'Registrant questions updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Webinar Registrant Questions
  // ===========================================================================
  server.tool(
    'zoom_get_webinar_registrant_questions',
    'Get custom registrant questions for a webinar.',
    {
      webinar_id: z.number().describe('The webinar ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, format }) => {
      try {
        const result = await client.getWebinarRegistrantQuestions(webinar_id);
        return formatResponse(result, format as ResponseFormat, 'registrant_questions');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_update_webinar_registrant_questions',
    'Update custom registrant questions for a webinar.',
    {
      webinar_id: z.number().describe('The webinar ID'),
      questions: z.array(registrantQuestionSchema).optional().describe('Standard field questions'),
      custom_questions: z.array(customQuestionSchema).optional().describe('Custom questions'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, questions, custom_questions, format }) => {
      try {
        await client.updateWebinarRegistrantQuestions(webinar_id, {
          questions,
          custom_questions,
        });
        return formatResponse({ success: true, message: 'Webinar registrant questions updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Account Lock Settings
  // ===========================================================================
  server.tool(
    'zoom_get_account_lock_settings',
    'Get lock settings for a sub-account (which settings are locked).',
    {
      account_id: z.string().describe('The account ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ account_id, format }) => {
      try {
        const result = await client.getAccountLockSettings(account_id);
        return formatResponse(result, format as ResponseFormat, 'lock_settings');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_update_account_lock_settings',
    'Update lock settings for a sub-account.',
    {
      account_id: z.string().describe('The account ID'),
      settings: z.record(z.string(), z.unknown()).describe('Lock settings to update'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ account_id, settings, format }) => {
      try {
        await client.updateAccountLockSettings(account_id, settings);
        return formatResponse({ success: true, message: 'Lock settings updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
