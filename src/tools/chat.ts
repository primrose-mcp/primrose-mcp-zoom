/**
 * Zoom Chat Tools
 *
 * MCP tools for managing Zoom chat channels and messages.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ZoomClient } from '../client.js';
import type { ResponseFormat, ZoomChatChannelType } from '../types/entities.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all chat-related tools
 */
export function registerChatTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // List Chat Channels
  // ===========================================================================
  server.tool(
    'zoom_list_chat_channels',
    'List chat channels for a user.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      page_size: z.number().int().min(1).max(50).optional().describe('Number of results per page (max 50). Default: 10'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, page_size, next_page_token, format }) => {
      try {
        const result = await client.listChatChannels(user_id, { page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'channels');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Chat Channel
  // ===========================================================================
  server.tool(
    'zoom_get_chat_channel',
    'Get details of a specific chat channel.',
    {
      channel_id: z.string().describe('The channel ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ channel_id, format }) => {
      try {
        const result = await client.getChatChannel(channel_id);
        return formatResponse(result, format as ResponseFormat, 'channel');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Chat Channel
  // ===========================================================================
  server.tool(
    'zoom_create_chat_channel',
    'Create a new chat channel.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      name: z.string().describe('Channel name'),
      type: z.number().optional().describe('Channel type: 1=Private, 2=Private (members can add), 3=Public, 4=Instant, 5=Public (external)'),
      members: z.array(z.object({
        email: z.string().describe('Member email'),
      })).optional().describe('List of members to add to the channel'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, name, type, members, format }) => {
      try {
        const result = await client.createChatChannel(user_id, {
          name,
          type: type as ZoomChatChannelType | undefined,
          members,
        });
        return formatResponse(result, format as ResponseFormat, 'channel');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Chat Channel
  // ===========================================================================
  server.tool(
    'zoom_update_chat_channel',
    'Update an existing chat channel.',
    {
      channel_id: z.string().describe('The channel ID to update'),
      name: z.string().describe('New channel name'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ channel_id, name, format }) => {
      try {
        await client.updateChatChannel(channel_id, name);
        return formatResponse({ success: true, message: 'Channel updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Chat Channel
  // ===========================================================================
  server.tool(
    'zoom_delete_chat_channel',
    'Delete a chat channel.',
    {
      channel_id: z.string().describe('The channel ID to delete'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ channel_id, format }) => {
      try {
        await client.deleteChatChannel(channel_id);
        return formatResponse({ success: true, message: 'Channel deleted' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // List Chat Messages
  // ===========================================================================
  server.tool(
    'zoom_list_chat_messages',
    'List messages in a chat channel or direct messages.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      to_channel: z.string().optional().describe('Channel ID to list messages from'),
      to_contact: z.string().optional().describe('Contact ID or email for direct messages'),
      date: z.string().optional().describe('Date in YYYY-MM-DD format to filter messages'),
      page_size: z.number().int().min(1).max(50).optional().describe('Number of results per page (max 50). Default: 10'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, to_channel, to_contact, date, page_size, next_page_token, format }) => {
      try {
        const result = await client.listChatMessages(user_id, {
          to_channel,
          to_contact,
          date,
          page_size,
          next_page_token,
        });
        return formatResponse(result, format as ResponseFormat, 'messages');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Send Chat Message
  // ===========================================================================
  server.tool(
    'zoom_send_chat_message',
    'Send a chat message to a channel or contact.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      message: z.string().describe('The message content'),
      to_channel: z.string().optional().describe('Channel ID to send the message to'),
      to_contact: z.string().optional().describe('Contact email for direct message'),
      reply_main_message_id: z.string().optional().describe('Message ID to reply to (for threads)'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, message, to_channel, to_contact, reply_main_message_id, format }) => {
      try {
        const result = await client.sendChatMessage(user_id, {
          message,
          to_channel,
          to_contact,
          reply_main_message_id,
        });
        return formatResponse(result, format as ResponseFormat, 'message');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Chat Message
  // ===========================================================================
  server.tool(
    'zoom_update_chat_message',
    'Update an existing chat message.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      message_id: z.string().describe('The message ID to update'),
      message: z.string().describe('The new message content'),
      to_channel: z.string().optional().describe('Channel ID where the message is'),
      to_contact: z.string().optional().describe('Contact email for direct messages'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, message_id, message, to_channel, to_contact, format }) => {
      try {
        await client.updateChatMessage(message_id, user_id, message, to_channel, to_contact);
        return formatResponse({ success: true, message: 'Message updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Chat Message
  // ===========================================================================
  server.tool(
    'zoom_delete_chat_message',
    'Delete a chat message.',
    {
      user_id: z.string().describe('User ID or email. Use "me" for the current user.'),
      message_id: z.string().describe('The message ID to delete'),
      to_channel: z.string().optional().describe('Channel ID where the message is'),
      to_contact: z.string().optional().describe('Contact email for direct messages'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ user_id, message_id, to_channel, to_contact, format }) => {
      try {
        await client.deleteChatMessage(message_id, user_id, to_channel, to_contact);
        return formatResponse({ success: true, message: 'Message deleted' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
