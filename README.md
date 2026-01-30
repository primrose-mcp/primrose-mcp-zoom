# Zoom MCP Server

[![Primrose MCP](https://img.shields.io/badge/Primrose-MCP-blue)](https://primrose.dev/mcp/zoom)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server for Zoom, enabling AI assistants to manage meetings, webinars, recordings, and collaboration features.

## Features

- **Meetings** - Schedule, update, and manage Zoom meetings
- **Users** - Manage Zoom users and settings
- **Webinars** - Create and manage webinars
- **Recordings** - Access and manage cloud recordings
- **Reports** - Generate usage and meeting reports
- **Groups** - Manage user groups
- **Chat** - Send and manage chat messages
- **Accounts** - Manage account settings
- **Devices** - Manage Zoom devices
- **Tracking** - Track meeting attendance and engagement
- **Polls** - Create and manage meeting polls
- **Contacts** - Manage contacts
- **TSP** - Telephony service provider settings
- **IM Groups** - Manage instant messaging groups
- **User Management** - Advanced user administration
- **Webinar Polls** - Manage webinar-specific polls
- **Livestream** - Configure livestream settings
- **Archiving** - Manage meeting archives
- **Tasks** - Manage tasks
- **Dashboard** - Access Zoom dashboard data
- **Webhooks** - Configure event webhooks
- **Rooms** - Manage Zoom Rooms

## Quick Start

### Recommended: Use Primrose SDK

The easiest way to use this MCP server is with the Primrose SDK:

```bash
npm install primrose-mcp
```

```typescript
import { PrimroseMCP } from 'primrose-mcp';

const primrose = new PrimroseMCP({
  apiKey: process.env.PRIMROSE_API_KEY,
});

const zoomClient = primrose.getClient('zoom', {
  accessToken: process.env.ZOOM_ACCESS_TOKEN,
});
```

## Manual Installation

### Prerequisites

- Node.js 18+
- Wrangler CLI (`npm install -g wrangler`)
- Zoom account with API access (Server-to-Server OAuth app)

### Setup

1. Clone and install dependencies:

```bash
git clone <repository-url>
cd primrose-mcp-zoom
npm install
```

2. Deploy to Cloudflare Workers:

```bash
npx wrangler deploy
```

## Configuration

### Required Headers

| Header | Description |
|--------|-------------|
| `X-Zoom-Access-Token` | OAuth access token (from Server-to-Server OAuth app) |

### Optional Headers

| Header | Description |
|--------|-------------|
| `X-Zoom-Account-ID` | Zoom account ID for Server-to-Server OAuth |
| `X-Zoom-Client-ID` | OAuth client ID (for token refresh) |
| `X-Zoom-Client-Secret` | OAuth client secret (for token refresh) |

### Example Request

```bash
curl -X POST https://your-worker.workers.dev/mcp \
  -H "Content-Type: application/json" \
  -H "X-Zoom-Access-Token: your-access-token" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

## Available Tools

### Meeting Tools
- `zoom_list_meetings` - List scheduled meetings
- `zoom_get_meeting` - Get meeting details
- `zoom_create_meeting` - Schedule a new meeting
- `zoom_update_meeting` - Update meeting settings
- `zoom_delete_meeting` - Cancel a meeting
- `zoom_end_meeting` - End an in-progress meeting
- `zoom_list_meeting_registrants` - List meeting registrants
- `zoom_add_meeting_registrant` - Register someone for a meeting

### User Tools
- `zoom_list_users` - List Zoom users
- `zoom_get_user` - Get user details
- `zoom_create_user` - Create a new user
- `zoom_update_user` - Update user settings
- `zoom_delete_user` - Delete a user
- `zoom_get_user_settings` - Get user settings

### Webinar Tools
- `zoom_list_webinars` - List webinars
- `zoom_get_webinar` - Get webinar details
- `zoom_create_webinar` - Create a webinar
- `zoom_update_webinar` - Update webinar settings
- `zoom_delete_webinar` - Delete a webinar
- `zoom_list_webinar_registrants` - List webinar registrants

### Recording Tools
- `zoom_list_recordings` - List cloud recordings
- `zoom_get_recording` - Get recording details
- `zoom_delete_recording` - Delete a recording
- `zoom_get_recording_settings` - Get recording settings

### Report Tools
- `zoom_get_daily_usage_report` - Get daily usage report
- `zoom_get_meeting_report` - Get meeting report
- `zoom_get_webinar_report` - Get webinar report
- `zoom_get_active_hosts_report` - Get active hosts report

### Group Tools
- `zoom_list_groups` - List user groups
- `zoom_get_group` - Get group details
- `zoom_create_group` - Create a group
- `zoom_update_group` - Update a group
- `zoom_delete_group` - Delete a group
- `zoom_list_group_members` - List group members

### Chat Tools
- `zoom_list_chat_channels` - List chat channels
- `zoom_get_chat_channel` - Get channel details
- `zoom_create_chat_channel` - Create a channel
- `zoom_send_chat_message` - Send a message
- `zoom_list_chat_messages` - List messages

### Account Tools
- `zoom_get_account` - Get account information
- `zoom_get_account_settings` - Get account settings
- `zoom_update_account_settings` - Update account settings

### Device Tools
- `zoom_list_devices` - List Zoom devices
- `zoom_get_device` - Get device details

### Poll Tools
- `zoom_list_meeting_polls` - List meeting polls
- `zoom_create_meeting_poll` - Create a poll
- `zoom_update_meeting_poll` - Update a poll
- `zoom_delete_meeting_poll` - Delete a poll

### Contact Tools
- `zoom_list_contacts` - List contacts
- `zoom_get_contact` - Get contact details
- `zoom_search_contacts` - Search contacts

### Dashboard Tools
- `zoom_get_dashboard_meetings` - Get dashboard meeting data
- `zoom_get_dashboard_participants` - Get participant data

### Webhook Tools
- `zoom_list_webhooks` - List webhooks
- `zoom_create_webhook` - Create a webhook
- `zoom_delete_webhook` - Delete a webhook

### Room Tools
- `zoom_list_rooms` - List Zoom Rooms
- `zoom_get_room` - Get room details

## Development

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Type check
npm run typecheck

# Deploy
npm run deploy
```

## Related Resources

- [Primrose SDK Documentation](https://primrose.dev/docs)
- [Zoom API Documentation](https://developers.zoom.us/docs/api/)
- [Zoom Developer Portal](https://developers.zoom.us)
- [Model Context Protocol](https://modelcontextprotocol.io)
