/**
 * Zoom Accounts and Billing Tools
 *
 * MCP tools for managing Zoom sub-accounts and billing.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ZoomClient } from '../client.js';
import type { ResponseFormat } from '../types/entities.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all account and billing-related tools
 */
export function registerAccountTools(server: McpServer, client: ZoomClient): void {
  // ===========================================================================
  // List Accounts
  // ===========================================================================
  server.tool(
    'zoom_list_accounts',
    'List all sub-accounts under the master account.',
    {
      page_size: z.number().int().min(1).max(300).optional().describe('Number of results per page'),
      next_page_token: z.string().optional().describe('Token for pagination'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ page_size, next_page_token, format }) => {
      try {
        const result = await client.listAccounts({ page_size, next_page_token });
        return formatResponse(result, format as ResponseFormat, 'accounts');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Account
  // ===========================================================================
  server.tool(
    'zoom_get_account',
    'Get details of a specific sub-account.',
    {
      account_id: z.string().describe('The account ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ account_id, format }) => {
      try {
        const result = await client.getAccount(account_id);
        return formatResponse(result, format as ResponseFormat, 'account');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Account
  // ===========================================================================
  server.tool(
    'zoom_create_account',
    'Create a new sub-account under the master account.',
    {
      first_name: z.string().describe('Account owner first name'),
      last_name: z.string().describe('Account owner last name'),
      email: z.string().email().describe('Account owner email'),
      password: z.string().describe('Account password'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ first_name, last_name, email, password, format }) => {
      try {
        const result = await client.createAccount({
          first_name,
          last_name,
          email,
          password,
        });
        return formatResponse(result, format as ResponseFormat, 'account');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Disassociate Account
  // ===========================================================================
  server.tool(
    'zoom_disassociate_account',
    'Disassociate a sub-account from the master account.',
    {
      account_id: z.string().describe('The account ID to disassociate'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ account_id, format }) => {
      try {
        await client.disassociateAccount(account_id);
        return formatResponse({ success: true, message: 'Account disassociated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Account Settings
  // ===========================================================================
  server.tool(
    'zoom_get_account_settings',
    'Get settings for a sub-account.',
    {
      account_id: z.string().describe('The account ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ account_id, format }) => {
      try {
        const result = await client.getAccountSettings(account_id);
        return formatResponse(result, format as ResponseFormat, 'settings');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Account Settings
  // ===========================================================================
  server.tool(
    'zoom_update_account_settings',
    'Update settings for a sub-account.',
    {
      account_id: z.string().describe('The account ID'),
      settings: z.record(z.string(), z.unknown()).describe('Settings object to update'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ account_id, settings, format }) => {
      try {
        await client.updateAccountSettings(account_id, settings);
        return formatResponse({ success: true, message: 'Account settings updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Account Billing
  // ===========================================================================
  server.tool(
    'zoom_get_account_billing',
    'Get billing information for a sub-account.',
    {
      account_id: z.string().describe('The account ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ account_id, format }) => {
      try {
        const result = await client.getAccountBilling(account_id);
        return formatResponse(result, format as ResponseFormat, 'billing');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Account Billing
  // ===========================================================================
  server.tool(
    'zoom_update_account_billing',
    'Update billing information for a sub-account.',
    {
      account_id: z.string().describe('The account ID'),
      first_name: z.string().optional().describe('Billing contact first name'),
      last_name: z.string().optional().describe('Billing contact last name'),
      email: z.string().email().optional().describe('Billing contact email'),
      phone_number: z.string().optional().describe('Billing contact phone'),
      address: z.string().optional().describe('Billing address'),
      city: z.string().optional().describe('Billing city'),
      state: z.string().optional().describe('Billing state'),
      zip: z.string().optional().describe('Billing zip code'),
      country: z.string().optional().describe('Billing country'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ account_id, first_name, last_name, email, phone_number, address, city, state, zip, country, format }) => {
      try {
        await client.updateAccountBilling(account_id, {
          first_name,
          last_name,
          email,
          phone_number,
          address,
          city,
          state,
          zip,
          country,
        });
        return formatResponse({ success: true, message: 'Billing information updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Account Plans
  // ===========================================================================
  server.tool(
    'zoom_get_account_plans',
    'Get plan information for a sub-account.',
    {
      account_id: z.string().describe('The account ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ account_id, format }) => {
      try {
        const result = await client.getAccountPlans(account_id);
        return formatResponse(result, format as ResponseFormat, 'plans');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Subscribe Plans
  // ===========================================================================
  server.tool(
    'zoom_subscribe_plans',
    'Subscribe a sub-account to plans.',
    {
      account_id: z.string().describe('The account ID'),
      plan_base: z.object({
        type: z.string().describe('Base plan type'),
        hosts: z.number().describe('Number of hosts'),
      }).describe('Base plan configuration'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ account_id, plan_base, format }) => {
      try {
        await client.subscribePlans(account_id, { plan_base });
        return formatResponse({ success: true, message: 'Plans subscribed' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Managed Domains
  // ===========================================================================
  server.tool(
    'zoom_get_account_managed_domains',
    'Get managed domains for a sub-account.',
    {
      account_id: z.string().describe('The account ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ account_id, format }) => {
      try {
        const result = await client.getAccountManagedDomains(account_id);
        return formatResponse(result.domains, format as ResponseFormat, 'managed_domains');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Account Options
  // ===========================================================================
  server.tool(
    'zoom_update_account_options',
    'Update options for a sub-account.',
    {
      account_id: z.string().describe('The account ID'),
      share_rc: z.boolean().optional().describe('Share virtual room connectors'),
      room_connectors: z.string().optional().describe('Room connector IPs'),
      share_mc: z.boolean().optional().describe('Share meeting connectors'),
      meeting_connectors: z.string().optional().describe('Meeting connector IPs'),
      pay_mode: z.string().optional().describe('Payment mode'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ account_id, share_rc, room_connectors, share_mc, meeting_connectors, pay_mode, format }) => {
      try {
        const options: Record<string, unknown> = {};
        if (share_rc !== undefined) options.share_rc = share_rc;
        if (room_connectors !== undefined) options.room_connectors = room_connectors;
        if (share_mc !== undefined) options.share_mc = share_mc;
        if (meeting_connectors !== undefined) options.meeting_connectors = meeting_connectors;
        if (pay_mode !== undefined) options.pay_mode = pay_mode;
        await client.updateAccountOptions(account_id, options);
        return formatResponse({ success: true, message: 'Account options updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Subscribe Addons
  // ===========================================================================
  server.tool(
    'zoom_subscribe_addons',
    'Subscribe a sub-account to plan addons.',
    {
      account_id: z.string().describe('The account ID'),
      addons: z.array(z.object({
        type: z.string().describe('Addon type'),
        hosts: z.number().optional().describe('Number of hosts'),
      })).describe('List of addons to subscribe'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ account_id, addons, format }) => {
      try {
        await client.subscribeAddons(account_id, addons);
        return formatResponse({ success: true, message: 'Addons subscribed' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Addons
  // ===========================================================================
  server.tool(
    'zoom_update_addons',
    'Update addon subscriptions for a sub-account.',
    {
      account_id: z.string().describe('The account ID'),
      addons: z.array(z.object({
        type: z.string().describe('Addon type'),
        hosts: z.number().optional().describe('Number of hosts'),
      })).describe('Updated list of addons'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ account_id, addons, format }) => {
      try {
        await client.updateAddons(account_id, addons);
        return formatResponse({ success: true, message: 'Addons updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Base Plan
  // ===========================================================================
  server.tool(
    'zoom_update_base_plan',
    'Update the base plan for a sub-account.',
    {
      account_id: z.string().describe('The account ID'),
      type: z.string().describe('Base plan type'),
      hosts: z.number().describe('Number of hosts'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ account_id, type, hosts, format }) => {
      try {
        await client.updateBasePlan(account_id, { type, hosts });
        return formatResponse({ success: true, message: 'Base plan updated' }, format as ResponseFormat, 'result');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
