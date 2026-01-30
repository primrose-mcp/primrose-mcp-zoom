/**
 * Zoom Meeting Polls Tools
 *
 * MCP tools for managing meeting polls.
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
 * Register all meeting poll-related tools
 */
export function registerPollTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // List Meeting Polls
  // ===========================================================================
  server.tool(
    'zoom_list_meeting_polls',
    'List all polls for a meeting.',
    {
      meeting_id: z.union([z.number(), z.string()]).describe('The meeting ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, format }) => {
      try {
        const result = await client.listMeetingPolls(meeting_id);
        return formatResponse(result.polls, format as ResponseFormat, 'polls');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Meeting Poll
  // ===========================================================================
  server.tool(
    'zoom_get_meeting_poll',
    'Get details of a specific meeting poll.',
    {
      meeting_id: z.union([z.number(), z.string()]).describe('The meeting ID'),
      poll_id: z.string().describe('The poll ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, poll_id, format }) => {
      try {
        const result = await client.getMeetingPoll(meeting_id, poll_id);
        return formatResponse(result, format as ResponseFormat, 'poll');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Meeting Poll
  // ===========================================================================
  server.tool(
    'zoom_create_meeting_poll',
    'Create a new poll for a meeting.',
    {
      meeting_id: z.union([z.number(), z.string()]).describe('The meeting ID'),
      title: z.string().describe('Poll title'),
      anonymous: z.boolean().optional().describe('Whether the poll is anonymous'),
      poll_type: z.number().optional().describe('Poll type: 1=Poll, 2=Advanced Poll, 3=Quiz'),
      questions: z.array(pollQuestionSchema).describe('List of poll questions'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, title, anonymous, poll_type, questions, format }) => {
      try {
        const result = await client.createMeetingPoll(meeting_id, {
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
  // Update Meeting Poll
  // ===========================================================================
  server.tool(
    'zoom_update_meeting_poll',
    'Update an existing meeting poll.',
    {
      meeting_id: z.union([z.number(), z.string()]).describe('The meeting ID'),
      poll_id: z.string().describe('The poll ID to update'),
      title: z.string().optional().describe('New poll title'),
      anonymous: z.boolean().optional().describe('Whether the poll is anonymous'),
      poll_type: z.number().optional().describe('Poll type'),
      questions: z.array(pollQuestionSchema).optional().describe('Updated list of poll questions'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, poll_id, title, anonymous, poll_type, questions, format }) => {
      try {
        await client.updateMeetingPoll(meeting_id, poll_id, {
          title,
          anonymous,
          poll_type,
          questions,
        });
        return formatResponse({ success: true, message: 'Poll updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Meeting Poll
  // ===========================================================================
  server.tool(
    'zoom_delete_meeting_poll',
    'Delete a meeting poll.',
    {
      meeting_id: z.union([z.number(), z.string()]).describe('The meeting ID'),
      poll_id: z.string().describe('The poll ID to delete'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, poll_id, format }) => {
      try {
        await client.deleteMeetingPoll(meeting_id, poll_id);
        return formatResponse({ success: true, message: 'Poll deleted' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Meeting Invitation
  // ===========================================================================
  server.tool(
    'zoom_get_meeting_invitation',
    'Get the meeting invitation text for a meeting.',
    {
      meeting_id: z.union([z.number(), z.string()]).describe('The meeting ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ meeting_id, format }) => {
      try {
        const result = await client.getMeetingInvitation(meeting_id);
        return formatResponse(result, format as ResponseFormat, 'invitation');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
