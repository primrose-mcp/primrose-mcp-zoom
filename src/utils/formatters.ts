/**
 * Response Formatting Utilities
 *
 * Helpers for formatting Zoom API tool responses in JSON or Markdown.
 */

import type {
  PaginatedResponse,
  ResponseFormat,
  ZoomCloudRecording,
  ZoomDashboardMeeting,
  ZoomGroup,
  ZoomMeeting,
  ZoomMeetingParticipant,
  ZoomMeetingRegistrant,
  ZoomRole,
  ZoomUser,
  ZoomWebinar,
  ZoomWebinarPanelist,
} from '../types/entities.js';
import { ZoomApiError, formatErrorForLogging } from './errors.js';

/**
 * MCP tool response type
 * Note: Index signature required for MCP SDK 1.25+ compatibility
 */
export interface ToolResponse {
  [key: string]: unknown;
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

/**
 * Format a successful response
 */
export function formatResponse(
  data: unknown,
  format: ResponseFormat,
  entityType: string
): ToolResponse {
  if (format === 'markdown') {
    return {
      content: [{ type: 'text', text: formatAsMarkdown(data, entityType) }],
    };
  }
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  };
}

/**
 * Format an error response
 */
export function formatError(error: unknown): ToolResponse {
  const errorInfo = formatErrorForLogging(error);

  let message: string;
  if (error instanceof ZoomApiError) {
    message = `Error: ${error.message}`;
    if (error.retryable) {
      message += ' (retryable)';
    }
  } else if (error instanceof Error) {
    message = `Error: ${error.message}`;
  } else {
    message = `Error: ${String(error)}`;
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ error: message, details: errorInfo }, null, 2),
      },
    ],
    isError: true,
  };
}

/**
 * Format data as Markdown
 */
function formatAsMarkdown(data: unknown, entityType: string): string {
  if (isPaginatedResponse(data)) {
    return formatPaginatedAsMarkdown(data, entityType);
  }

  if (Array.isArray(data)) {
    return formatArrayAsMarkdown(data, entityType);
  }

  if (typeof data === 'object' && data !== null) {
    return formatObjectAsMarkdown(data as Record<string, unknown>, entityType);
  }

  return String(data);
}

/**
 * Type guard for paginated response
 */
function isPaginatedResponse(data: unknown): data is PaginatedResponse<unknown> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'items' in data &&
    Array.isArray((data as PaginatedResponse<unknown>).items)
  );
}

/**
 * Format paginated response as Markdown
 */
function formatPaginatedAsMarkdown(data: PaginatedResponse<unknown>, entityType: string): string {
  const lines: string[] = [];

  lines.push(`## ${capitalize(entityType)}`);
  lines.push('');

  if (data.total !== undefined) {
    lines.push(`**Total:** ${data.total} | **Showing:** ${data.count}`);
  } else {
    lines.push(`**Showing:** ${data.count}`);
  }

  if (data.hasMore) {
    lines.push(`**More available:** Yes (token: \`${data.next_page_token}\`)`);
  }
  lines.push('');

  if (data.items.length === 0) {
    lines.push('_No items found._');
    return lines.join('\n');
  }

  // Format items based on entity type
  switch (entityType) {
    case 'users':
      lines.push(formatUsersTable(data.items as ZoomUser[]));
      break;
    case 'meetings':
      lines.push(formatMeetingsTable(data.items as ZoomMeeting[]));
      break;
    case 'webinars':
      lines.push(formatWebinarsTable(data.items as ZoomWebinar[]));
      break;
    case 'registrants':
      lines.push(formatRegistrantsTable(data.items as ZoomMeetingRegistrant[]));
      break;
    case 'participants':
      lines.push(formatParticipantsTable(data.items as ZoomMeetingParticipant[]));
      break;
    case 'recordings':
      lines.push(formatRecordingsTable(data.items as ZoomCloudRecording[]));
      break;
    case 'dashboard_meetings':
      lines.push(formatDashboardMeetingsTable(data.items as ZoomDashboardMeeting[]));
      break;
    default:
      lines.push(formatGenericTable(data.items));
  }

  return lines.join('\n');
}

/**
 * Format users as Markdown table
 */
function formatUsersTable(users: ZoomUser[]): string {
  const lines: string[] = [];
  lines.push('| ID | Name | Email | Type | Status |');
  lines.push('|---|---|---|---|---|');

  for (const user of users) {
    const name = user.display_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || '-';
    const typeStr = getUserTypeString(user.type);
    lines.push(
      `| ${user.id} | ${name} | ${user.email || '-'} | ${typeStr} | ${user.status || '-'} |`
    );
  }

  return lines.join('\n');
}

/**
 * Get user type string
 */
function getUserTypeString(type: number): string {
  switch (type) {
    case 1:
      return 'Basic';
    case 2:
      return 'Licensed';
    case 3:
      return 'On-prem';
    case 99:
      return 'None';
    default:
      return String(type);
  }
}

/**
 * Format meetings as Markdown table
 */
function formatMeetingsTable(meetings: ZoomMeeting[]): string {
  const lines: string[] = [];
  lines.push('| ID | Topic | Start Time | Duration | Status |');
  lines.push('|---|---|---|---|---|');

  for (const meeting of meetings) {
    const startTime = meeting.start_time ? new Date(meeting.start_time).toLocaleString() : '-';
    const duration = meeting.duration ? `${meeting.duration} min` : '-';
    lines.push(
      `| ${meeting.id} | ${meeting.topic} | ${startTime} | ${duration} | ${meeting.status || 'scheduled'} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format webinars as Markdown table
 */
function formatWebinarsTable(webinars: ZoomWebinar[]): string {
  const lines: string[] = [];
  lines.push('| ID | Topic | Start Time | Duration |');
  lines.push('|---|---|---|---|');

  for (const webinar of webinars) {
    const startTime = webinar.start_time ? new Date(webinar.start_time).toLocaleString() : '-';
    const duration = webinar.duration ? `${webinar.duration} min` : '-';
    lines.push(`| ${webinar.id} | ${webinar.topic} | ${startTime} | ${duration} |`);
  }

  return lines.join('\n');
}

/**
 * Format registrants as Markdown table
 */
function formatRegistrantsTable(registrants: ZoomMeetingRegistrant[]): string {
  const lines: string[] = [];
  lines.push('| ID | Name | Email | Status |');
  lines.push('|---|---|---|---|');

  for (const reg of registrants) {
    const name = `${reg.first_name || ''} ${reg.last_name || ''}`.trim() || '-';
    lines.push(`| ${reg.id || '-'} | ${name} | ${reg.email} | ${reg.status || '-'} |`);
  }

  return lines.join('\n');
}

/**
 * Format participants as Markdown table
 */
function formatParticipantsTable(participants: ZoomMeetingParticipant[]): string {
  const lines: string[] = [];
  lines.push('| Name | Email | Join Time | Leave Time |');
  lines.push('|---|---|---|---|');

  for (const p of participants) {
    const name = p.user_name || p.name || '-';
    const email = p.user_email || '-';
    const joinTime = p.join_time ? new Date(p.join_time).toLocaleString() : '-';
    const leaveTime = p.leave_time ? new Date(p.leave_time).toLocaleString() : '-';
    lines.push(`| ${name} | ${email} | ${joinTime} | ${leaveTime} |`);
  }

  return lines.join('\n');
}

/**
 * Format recordings as Markdown table
 */
function formatRecordingsTable(recordings: ZoomCloudRecording[]): string {
  const lines: string[] = [];
  lines.push('| UUID | Topic | Start Time | Duration | Files |');
  lines.push('|---|---|---|---|---|');

  for (const rec of recordings) {
    const startTime = rec.start_time ? new Date(rec.start_time).toLocaleString() : '-';
    const duration = rec.duration ? `${rec.duration} min` : '-';
    const fileCount = rec.recording_files?.length || 0;
    lines.push(`| ${rec.uuid} | ${rec.topic || '-'} | ${startTime} | ${duration} | ${fileCount} |`);
  }

  return lines.join('\n');
}

/**
 * Format dashboard meetings as Markdown table
 */
function formatDashboardMeetingsTable(meetings: ZoomDashboardMeeting[]): string {
  const lines: string[] = [];
  lines.push('| UUID | Topic | Host | Start Time | Participants |');
  lines.push('|---|---|---|---|---|');

  for (const m of meetings) {
    const startTime = m.start_time ? new Date(m.start_time).toLocaleString() : '-';
    lines.push(`| ${m.uuid} | ${m.topic} | ${m.host} | ${startTime} | ${m.participants || 0} |`);
  }

  return lines.join('\n');
}

/**
 * Format a generic array as Markdown table
 */
function formatGenericTable(items: unknown[]): string {
  if (items.length === 0) return '_No items_';

  const first = items[0] as Record<string, unknown>;
  const keys = Object.keys(first).slice(0, 5); // Limit columns

  const lines: string[] = [];
  lines.push(`| ${keys.join(' | ')} |`);
  lines.push(`|${keys.map(() => '---').join('|')}|`);

  for (const item of items) {
    const record = item as Record<string, unknown>;
    const values = keys.map((k) => String(record[k] ?? '-'));
    lines.push(`| ${values.join(' | ')} |`);
  }

  return lines.join('\n');
}

/**
 * Format an array as Markdown
 */
function formatArrayAsMarkdown(data: unknown[], entityType: string): string {
  if (entityType === 'groups') {
    return formatGroupsAsMarkdown(data as ZoomGroup[]);
  }
  if (entityType === 'roles') {
    return formatRolesAsMarkdown(data as ZoomRole[]);
  }
  if (entityType === 'panelists') {
    return formatPanelistsAsMarkdown(data as ZoomWebinarPanelist[]);
  }
  return formatGenericTable(data);
}

/**
 * Format groups as Markdown
 */
function formatGroupsAsMarkdown(groups: ZoomGroup[]): string {
  const lines: string[] = [];
  lines.push('## Groups');
  lines.push('');
  lines.push('| ID | Name | Members |');
  lines.push('|---|---|---|');

  for (const group of groups) {
    lines.push(`| ${group.id} | ${group.name} | ${group.total_members || '-'} |`);
  }

  return lines.join('\n');
}

/**
 * Format roles as Markdown
 */
function formatRolesAsMarkdown(roles: ZoomRole[]): string {
  const lines: string[] = [];
  lines.push('## Roles');
  lines.push('');
  lines.push('| ID | Name | Members |');
  lines.push('|---|---|---|');

  for (const role of roles) {
    lines.push(`| ${role.id} | ${role.name} | ${role.total_members || '-'} |`);
  }

  return lines.join('\n');
}

/**
 * Format panelists as Markdown
 */
function formatPanelistsAsMarkdown(panelists: ZoomWebinarPanelist[]): string {
  const lines: string[] = [];
  lines.push('## Panelists');
  lines.push('');
  lines.push('| ID | Name | Email |');
  lines.push('|---|---|---|');

  for (const p of panelists) {
    lines.push(`| ${p.id || '-'} | ${p.name} | ${p.email} |`);
  }

  return lines.join('\n');
}

/**
 * Format a single object as Markdown
 */
function formatObjectAsMarkdown(data: Record<string, unknown>, entityType: string): string {
  const lines: string[] = [];
  lines.push(`## ${capitalize(entityType.replace(/s$/, ''))}`);
  lines.push('');

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) continue;

    if (typeof value === 'object') {
      lines.push(`**${formatKey(key)}:**`);
      lines.push('```json');
      lines.push(JSON.stringify(value, null, 2));
      lines.push('```');
    } else {
      lines.push(`**${formatKey(key)}:** ${value}`);
    }
  }

  return lines.join('\n');
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format a key for display (snake_case to Title Case)
 */
function formatKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
