/**
 * Zoom Tasks API Tools
 *
 * MCP tools for managing Zoom tasks, assignees, comments, and collaborators.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ZoomClient } from '../client.js';
import type { ResponseFormat } from '../types/entities.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all task-related tools
 */
export function registerTaskTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // Tasks CRUD
  // ===========================================================================
  server.tool(
    'zoom_list_tasks',
    'List all tasks.',
    {
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ page_size, next_page_token, format }) => {
      try {
        const result = await client.listTasks({ page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'tasks');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_get_task',
    'Get details of a specific task.',
    {
      task_id: z.string().describe('The task ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ task_id, format }) => {
      try {
        const result = await client.getTask(task_id);
        return formatResponse(result, format as ResponseFormat, 'task');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_create_task',
    'Create a new task.',
    {
      title: z.string().describe('Task title'),
      description: z.string().optional().describe('Task description'),
      status: z.enum(['not_started', 'in_progress', 'completed']).optional().describe('Task status'),
      priority: z.enum(['low', 'medium', 'high']).optional().describe('Task priority'),
      due_date: z.string().optional().describe('Due date in ISO format'),
      project_id: z.string().optional().describe('Project ID to associate the task with'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ title, description, status, priority, due_date, project_id, format }) => {
      try {
        const result = await client.createTask({
          title,
          description,
          status,
          priority,
          due_date,
          project_id,
        });
        return formatResponse(result, format as ResponseFormat, 'task');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_update_task',
    'Update an existing task.',
    {
      task_id: z.string().describe('The task ID to update'),
      title: z.string().optional().describe('New task title'),
      description: z.string().optional().describe('New task description'),
      status: z.enum(['not_started', 'in_progress', 'completed']).optional().describe('New task status'),
      priority: z.enum(['low', 'medium', 'high']).optional().describe('New task priority'),
      due_date: z.string().optional().describe('New due date in ISO format'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ task_id, title, description, status, priority, due_date, format }) => {
      try {
        await client.updateTask(task_id, {
          title,
          description,
          status,
          priority,
          due_date,
        });
        return formatResponse({ success: true, message: 'Task updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_delete_task',
    'Delete a task.',
    {
      task_id: z.string().describe('The task ID to delete'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ task_id, format }) => {
      try {
        await client.deleteTask(task_id);
        return formatResponse({ success: true, message: 'Task deleted' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Task Assignees
  // ===========================================================================
  server.tool(
    'zoom_list_task_assignees',
    'List assignees for a task.',
    {
      task_id: z.string().describe('The task ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ task_id, format }) => {
      try {
        const result = await client.listTaskAssignees(task_id);
        return formatResponse(result.assignees, format as ResponseFormat, 'assignees');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_add_task_assignee',
    'Add an assignee to a task.',
    {
      task_id: z.string().describe('The task ID'),
      user_id: z.string().describe('The user ID to assign'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ task_id, user_id, format }) => {
      try {
        await client.addTaskAssignee(task_id, user_id);
        return formatResponse({ success: true, message: 'Assignee added' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_remove_task_assignee',
    'Remove an assignee from a task.',
    {
      task_id: z.string().describe('The task ID'),
      user_id: z.string().describe('The user ID to remove'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ task_id, user_id, format }) => {
      try {
        await client.removeTaskAssignee(task_id, user_id);
        return formatResponse({ success: true, message: 'Assignee removed' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Task Comments
  // ===========================================================================
  server.tool(
    'zoom_list_task_comments',
    'List comments on a task.',
    {
      task_id: z.string().describe('The task ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ task_id, format }) => {
      try {
        const result = await client.listTaskComments(task_id);
        return formatResponse(result.comments, format as ResponseFormat, 'comments');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_add_task_comment',
    'Add a comment to a task.',
    {
      task_id: z.string().describe('The task ID'),
      content: z.string().describe('The comment content'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ task_id, content, format }) => {
      try {
        const result = await client.addTaskComment(task_id, content);
        return formatResponse(result, format as ResponseFormat, 'comment');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_delete_task_comment',
    'Delete a comment from a task.',
    {
      task_id: z.string().describe('The task ID'),
      comment_id: z.string().describe('The comment ID to delete'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ task_id, comment_id, format }) => {
      try {
        await client.deleteTaskComment(task_id, comment_id);
        return formatResponse({ success: true, message: 'Comment deleted' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Task Collaborators
  // ===========================================================================
  server.tool(
    'zoom_list_task_collaborators',
    'List collaborators on a task.',
    {
      task_id: z.string().describe('The task ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ task_id, format }) => {
      try {
        const result = await client.listTaskCollaborators(task_id);
        return formatResponse(result.collaborators, format as ResponseFormat, 'collaborators');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_add_task_collaborator',
    'Add a collaborator to a task.',
    {
      task_id: z.string().describe('The task ID'),
      user_id: z.string().describe('The user ID to add as collaborator'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ task_id, user_id, format }) => {
      try {
        await client.addTaskCollaborator(task_id, user_id);
        return formatResponse({ success: true, message: 'Collaborator added' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'zoom_remove_task_collaborator',
    'Remove a collaborator from a task.',
    {
      task_id: z.string().describe('The task ID'),
      user_id: z.string().describe('The user ID to remove'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ task_id, user_id, format }) => {
      try {
        await client.removeTaskCollaborator(task_id, user_id);
        return formatResponse({ success: true, message: 'Collaborator removed' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
