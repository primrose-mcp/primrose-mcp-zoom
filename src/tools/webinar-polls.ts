/**
 * Zoom Webinar Polls Tools
 *
 * MCP tools for managing webinar polls.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ZoomClient } from '../client.js';
import type { ResponseFormat } from '../types/entities.js';
import { formatError, formatResponse } from '../utils/formatters.js';

// Schema for poll questions
const pollQuestionSchema = z.object({
  name: z.string().describe('Question text'),
  type: z.enum(['single', 'multiple']).describe('Question type: single or multiple choice'),
  answers: z.array(z.string()).optional().describe('List of answer options'),
  right_answers: z.array(z.string()).optional().describe('Correct answers for quizzes'),
  answer_required: z.boolean().optional().describe('Whether answer is required'),
});

/**
 * Register all webinar poll-related tools
 */
export function registerWebinarPollTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // List Webinar Polls
  // ===========================================================================
  server.tool(
    'zoom_list_webinar_polls',
    'List all polls for a webinar.',
    {
      webinar_id: z.number().describe('The webinar ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, format }) => {
      try {
        const result = await client.listWebinarPolls(webinar_id);
        return formatResponse(result.polls, format as ResponseFormat, 'polls');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Webinar Poll
  // ===========================================================================
  server.tool(
    'zoom_get_webinar_poll',
    'Get details of a specific webinar poll.',
    {
      webinar_id: z.number().describe('The webinar ID'),
      poll_id: z.string().describe('The poll ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, poll_id, format }) => {
      try {
        const result = await client.getWebinarPoll(webinar_id, poll_id);
        return formatResponse(result, format as ResponseFormat, 'poll');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Webinar Poll
  // ===========================================================================
  server.tool(
    'zoom_create_webinar_poll',
    'Create a new poll for a webinar.',
    {
      webinar_id: z.number().describe('The webinar ID'),
      title: z.string().describe('Poll title'),
      anonymous: z.boolean().optional().describe('Whether the poll is anonymous'),
      poll_type: z.number().optional().describe('Poll type: 1=Poll, 2=Advanced Poll, 3=Quiz'),
      questions: z.array(pollQuestionSchema).describe('List of poll questions'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, title, anonymous, poll_type, questions, format }) => {
      try {
        const result = await client.createWebinarPoll(webinar_id, {
          title,
          anonymous,
          poll_type,
          questions,
        });
        return formatResponse(result, format as ResponseFormat, 'poll');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Webinar Poll
  // ===========================================================================
  server.tool(
    'zoom_update_webinar_poll',
    'Update an existing webinar poll.',
    {
      webinar_id: z.number().describe('The webinar ID'),
      poll_id: z.string().describe('The poll ID to update'),
      title: z.string().optional().describe('New poll title'),
      anonymous: z.boolean().optional().describe('Whether the poll is anonymous'),
      poll_type: z.number().optional().describe('Poll type'),
      questions: z.array(pollQuestionSchema).optional().describe('Updated list of poll questions'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, poll_id, title, anonymous, poll_type, questions, format }) => {
      try {
        await client.updateWebinarPoll(webinar_id, poll_id, {
          title,
          anonymous,
          poll_type,
          questions,
        });
        return formatResponse({ success: true, message: 'Webinar poll updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Webinar Poll
  // ===========================================================================
  server.tool(
    'zoom_delete_webinar_poll',
    'Delete a webinar poll.',
    {
      webinar_id: z.number().describe('The webinar ID'),
      poll_id: z.string().describe('The poll ID to delete'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, poll_id, format }) => {
      try {
        await client.deleteWebinarPoll(webinar_id, poll_id);
        return formatResponse({ success: true, message: 'Webinar poll deleted' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Past Webinars
  // ===========================================================================
  server.tool(
    'zoom_get_past_webinar',
    'Get details of a past webinar.',
    {
      webinar_id: z.string().describe('The webinar UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, format }) => {
      try {
        const result = await client.getPastWebinar(webinar_id);
        return formatResponse(result, format as ResponseFormat, 'past_webinar');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_get_past_webinar_participants',
    'Get participants from a past webinar.',
    {
      webinar_id: z.string().describe('The webinar UUID'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, page_size, next_page_token, format }) => {
      try {
        const result = await client.getPastWebinarParticipants(webinar_id, { page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'participants');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_get_webinar_absentees',
    'Get list of registrants who did not attend a past webinar.',
    {
      webinar_id: z.string().describe('The webinar UUID'),
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, page_size, next_page_token, format }) => {
      try {
        const result = await client.getWebinarAbsentees(webinar_id, { page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'absentees');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Webinar Q&A Report
  // ===========================================================================
  server.tool(
    'zoom_get_webinar_qa_report',
    'Get Q&A report for a past webinar.',
    {
      webinar_id: z.string().describe('The webinar ID or UUID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, format }) => {
      try {
        const result = await client.getWebinarQA(webinar_id);
        return formatResponse(result, format as ResponseFormat, 'webinar_qa');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Past Webinar Instances
  // ===========================================================================
  server.tool(
    'zoom_list_past_webinar_instances',
    'List all instances of a past webinar.',
    {
      webinar_id: z.string().describe('The webinar ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ webinar_id, format }) => {
      try {
        const result = await client.getPastWebinarInstances(webinar_id);
        return formatResponse(result.webinars, format as ResponseFormat, 'webinar_instances');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
