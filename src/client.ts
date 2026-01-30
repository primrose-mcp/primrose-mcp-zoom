/**
 * Zoom API Client
 *
 * This file handles all HTTP communication with the Zoom API.
 * Base URL: https://api.zoom.us/v2
 *
 * MULTI-TENANT: This client receives credentials per-request via TenantCredentials,
 * allowing a single server to serve multiple tenants with different OAuth tokens.
 */

import type {
  PaginatedResponse,
  PaginationParams,
  ZoomAccount,
  ZoomAccountCreateInput,
  ZoomAccountSettings,
  ZoomBillingInfo,
  ZoomChatChannel,
  ZoomChatChannelCreateInput,
  ZoomChatMessage,
  ZoomChatMessageSendInput,
  ZoomCloudRecording,
  ZoomContact,
  ZoomDailyReport,
  ZoomDashboardMeeting,
  ZoomDashboardWebinar,
  ZoomDevice,
  ZoomDeviceCreateInput,
  ZoomExternalContact,
  ZoomExternalContactCreateInput,
  ZoomGroup,
  ZoomGroupCreateInput,
  ZoomGroupMember,
  ZoomIMGroup,
  ZoomIMGroupCreateInput,
  ZoomMeeting,
  ZoomMeetingCreateInput,
  ZoomMeetingParticipant,
  ZoomMeetingPoll,
  ZoomMeetingPollCreateInput,
  ZoomMeetingRegistrant,
  ZoomMeetingRegistrantCreateInput,
  ZoomMeetingReport,
  ZoomMeetingTemplate,
  ZoomMeetingUpdateInput,
  ZoomPAC,
  ZoomPastMeeting,
  ZoomPastWebinar,
  ZoomPlanInfo,
  ZoomPlanSubscribeInput,
  ZoomRole,
  ZoomRoleCreateInput,
  ZoomRoleMember,
  ZoomTrackingField,
  ZoomTrackingFieldCreateInput,
  ZoomTSP,
  ZoomUser,
  ZoomUserAssistant,
  ZoomUserCreateInput,
  ZoomUserPermissions,
  ZoomUserScheduler,
  ZoomUserTSP,
  ZoomUserTSPInput,
  ZoomUserUpdateInput,
  ZoomWebinar,
  ZoomWebinarAbsentee,
  ZoomWebinarCreateInput,
  ZoomWebinarPanelist,
  ZoomWebinarPoll,
  ZoomWebinarPollCreateInput,
  ZoomWebinarRegistrant,
  ZoomWebinarReport,
  ZoomWebinarTemplate,
  ZoomWebinarUpdateInput,
  ZoomLivestreamSettings,
  ZoomRegistrantQuestions,
  ZoomAccountLockSettings,
  ZoomArchivedFile,
  ZoomArchiveStatistics,
  ZoomRecordingAnalyticsSummary,
  ZoomRecordingAnalyticsDetail,
  ZoomRecordingRegistrant,
  ZoomRecordingRegistrantCreateInput,
  ZoomWebinarQA,
  ZoomTask,
  ZoomTaskCreateInput,
  ZoomTaskAssignee,
  ZoomTaskComment,
  ZoomTaskCollaborator,
  ZoomIMChatSession,
  ZoomIMChatMessage,
  ZoomCRCMetrics,
  ZoomIMMetrics,
  ZoomRoomMetrics,
  ZoomParticipantQoS,
  ZoomSharingDetail,
  ZoomCloudRecordingReport,
  ZoomTelephoneReport,
  ZoomUserActivityReport,
  ZoomMeetingPollReport,
  ZoomRecordingSettingsUpdate,
  ZoomWebhook,
  ZoomWebhookCreateInput,
  ZoomWebhookOptions,
  ZoomRecordingSettings,
  ZoomRoom,
  ZoomRoomCreateInput,
  ZoomRoomLocation,
  ZoomRoomLocationCreateInput,
  ZoomRoomDevice,
  ZoomRoomSettings,
  ZoomAddonInput,
  ZoomBasePlanInput,
} from './types/entities.js';
import type { TenantCredentials } from './types/env.js';
import { AuthenticationError, ZoomApiError, RateLimitError } from './utils/errors.js';

// =============================================================================
// Configuration
// =============================================================================

const API_BASE_URL = 'https://api.zoom.us/v2';

// =============================================================================
// Zoom Client Interface
// =============================================================================

export interface ZoomClient {
  // Connection
  testConnection(): Promise<{ connected: boolean; message: string }>;

  // Users
  listUsers(params?: PaginationParams & { status?: string }): Promise<PaginatedResponse<ZoomUser>>;
  getUser(userId: string): Promise<ZoomUser>;
  createUser(input: ZoomUserCreateInput): Promise<ZoomUser>;
  updateUser(userId: string, input: ZoomUserUpdateInput): Promise<void>;
  deleteUser(userId: string, action?: string): Promise<void>;
  getUserSettings(userId: string): Promise<Record<string, unknown>>;

  // Meetings
  listMeetings(
    userId: string,
    params?: PaginationParams & { type?: string }
  ): Promise<PaginatedResponse<ZoomMeeting>>;
  getMeeting(meetingId: number | string): Promise<ZoomMeeting>;
  createMeeting(userId: string, input: ZoomMeetingCreateInput): Promise<ZoomMeeting>;
  updateMeeting(meetingId: number | string, input: ZoomMeetingUpdateInput): Promise<void>;
  deleteMeeting(meetingId: number | string, options?: { occurrence_id?: string }): Promise<void>;
  updateMeetingStatus(meetingId: number | string, action: 'end'): Promise<void>;

  // Meeting Registrants
  listMeetingRegistrants(
    meetingId: number | string,
    params?: PaginationParams & { status?: string }
  ): Promise<PaginatedResponse<ZoomMeetingRegistrant>>;
  addMeetingRegistrant(
    meetingId: number | string,
    input: ZoomMeetingRegistrantCreateInput
  ): Promise<{ id: string; join_url: string; registrant_id: string }>;
  updateMeetingRegistrantStatus(
    meetingId: number | string,
    action: 'approve' | 'deny' | 'cancel',
    registrants: Array<{ id?: string; email?: string }>
  ): Promise<void>;

  // Past Meetings
  getPastMeeting(meetingUUID: string): Promise<ZoomPastMeeting>;
  getPastMeetingParticipants(
    meetingUUID: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomMeetingParticipant>>;

  // Webinars
  listWebinars(
    userId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomWebinar>>;
  getWebinar(webinarId: number | string): Promise<ZoomWebinar>;
  createWebinar(userId: string, input: ZoomWebinarCreateInput): Promise<ZoomWebinar>;
  updateWebinar(webinarId: number | string, input: ZoomWebinarUpdateInput): Promise<void>;
  deleteWebinar(webinarId: number | string, options?: { occurrence_id?: string }): Promise<void>;
  updateWebinarStatus(webinarId: number | string, action: 'end'): Promise<void>;

  // Webinar Registrants
  listWebinarRegistrants(
    webinarId: number | string,
    params?: PaginationParams & { status?: string }
  ): Promise<PaginatedResponse<ZoomWebinarRegistrant>>;
  addWebinarRegistrant(
    webinarId: number | string,
    input: ZoomMeetingRegistrantCreateInput
  ): Promise<{ id: string; join_url: string; registrant_id: string }>;
  updateWebinarRegistrantStatus(
    webinarId: number | string,
    action: 'approve' | 'deny' | 'cancel',
    registrants: Array<{ id?: string; email?: string }>
  ): Promise<void>;

  // Webinar Panelists
  listWebinarPanelists(webinarId: number | string): Promise<{ panelists: ZoomWebinarPanelist[] }>;
  addWebinarPanelists(
    webinarId: number | string,
    panelists: Array<{ name: string; email: string }>
  ): Promise<void>;
  removeWebinarPanelist(webinarId: number | string, panelistId: string): Promise<void>;
  removeAllWebinarPanelists(webinarId: number | string): Promise<void>;

  // Cloud Recordings
  listRecordings(
    userId: string,
    params?: PaginationParams & { from?: string; to?: string }
  ): Promise<PaginatedResponse<ZoomCloudRecording>>;
  getRecording(meetingId: string): Promise<ZoomCloudRecording>;
  deleteRecording(meetingId: string, action?: 'trash' | 'delete'): Promise<void>;
  deleteRecordingFile(
    meetingId: string,
    recordingId: string,
    action?: 'trash' | 'delete'
  ): Promise<void>;
  recoverRecording(meetingId: string): Promise<void>;
  recoverRecordingFile(meetingId: string, recordingId: string): Promise<void>;

  // Reports
  getMeetingReports(
    params: PaginationParams & { from: string; to: string; type?: string }
  ): Promise<PaginatedResponse<ZoomMeetingReport>>;
  getMeetingParticipantsReport(
    meetingId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomMeetingParticipant>>;
  getWebinarReports(
    params: PaginationParams & { from: string; to: string }
  ): Promise<PaginatedResponse<ZoomWebinarReport>>;
  getDailyUsageReport(params: { year: number; month: number }): Promise<{ dates: ZoomDailyReport[] }>;

  // Dashboard
  listDashboardMeetings(
    params: PaginationParams & { from: string; to: string; type?: string }
  ): Promise<PaginatedResponse<ZoomDashboardMeeting>>;
  listDashboardWebinars(
    params: PaginationParams & { from: string; to: string }
  ): Promise<PaginatedResponse<ZoomDashboardWebinar>>;
  getDashboardMeetingDetail(meetingId: string): Promise<ZoomDashboardMeeting>;
  getDashboardMeetingParticipants(
    meetingId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomMeetingParticipant>>;

  // Groups
  listGroups(): Promise<{ groups: ZoomGroup[] }>;
  getGroup(groupId: string): Promise<ZoomGroup>;
  createGroup(input: ZoomGroupCreateInput): Promise<ZoomGroup>;
  updateGroup(groupId: string, input: ZoomGroupCreateInput): Promise<void>;
  deleteGroup(groupId: string): Promise<void>;
  listGroupMembers(
    groupId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomGroupMember>>;
  addGroupMembers(groupId: string, members: Array<{ id?: string; email?: string }>): Promise<void>;
  deleteGroupMember(groupId: string, memberId: string): Promise<void>;

  // Roles
  listRoles(): Promise<{ roles: ZoomRole[] }>;
  getRole(roleId: string): Promise<ZoomRole>;
  createRole(input: ZoomRoleCreateInput): Promise<ZoomRole>;
  updateRole(roleId: string, input: ZoomRoleCreateInput): Promise<void>;
  deleteRole(roleId: string): Promise<void>;
  listRoleMembers(
    roleId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomRoleMember>>;
  assignRoleMembers(roleId: string, members: Array<{ id?: string; email?: string }>): Promise<void>;
  unassignRoleMember(roleId: string, memberId: string): Promise<void>;

  // Chat Channels
  listChatChannels(userId: string, params?: PaginationParams): Promise<PaginatedResponse<ZoomChatChannel>>;
  getChatChannel(channelId: string): Promise<ZoomChatChannel>;
  createChatChannel(userId: string, input: ZoomChatChannelCreateInput): Promise<ZoomChatChannel>;
  updateChatChannel(channelId: string, name: string): Promise<void>;
  deleteChatChannel(channelId: string): Promise<void>;

  // Chat Messages
  listChatMessages(
    userId: string,
    params: PaginationParams & { to_channel?: string; to_contact?: string; date?: string }
  ): Promise<PaginatedResponse<ZoomChatMessage>>;
  sendChatMessage(userId: string, input: ZoomChatMessageSendInput): Promise<{ id: string }>;
  updateChatMessage(
    messageId: string,
    userId: string,
    message: string,
    toChannel?: string,
    toContact?: string
  ): Promise<void>;
  deleteChatMessage(
    messageId: string,
    userId: string,
    toChannel?: string,
    toContact?: string
  ): Promise<void>;

  // Accounts
  listAccounts(params?: PaginationParams): Promise<PaginatedResponse<ZoomAccount>>;
  getAccount(accountId: string): Promise<ZoomAccount>;
  createAccount(input: ZoomAccountCreateInput): Promise<ZoomAccount>;
  disassociateAccount(accountId: string): Promise<void>;
  getAccountSettings(accountId: string): Promise<ZoomAccountSettings>;
  updateAccountSettings(accountId: string, settings: Partial<ZoomAccountSettings>): Promise<void>;
  getAccountBilling(accountId: string): Promise<ZoomBillingInfo>;
  updateAccountBilling(accountId: string, billing: Partial<ZoomBillingInfo>): Promise<void>;
  getAccountPlans(accountId: string): Promise<ZoomPlanInfo>;
  subscribePlans(accountId: string, input: ZoomPlanSubscribeInput): Promise<void>;
  subscribeAddons(accountId: string, addons: ZoomAddonInput[]): Promise<void>;
  updateAddons(accountId: string, addons: ZoomAddonInput[]): Promise<void>;
  updateBasePlan(accountId: string, basePlan: ZoomBasePlanInput): Promise<void>;

  // H.323/SIP Devices
  listDevices(params?: PaginationParams): Promise<PaginatedResponse<ZoomDevice>>;
  createDevice(input: ZoomDeviceCreateInput): Promise<ZoomDevice>;
  updateDevice(deviceId: string, input: Partial<ZoomDeviceCreateInput>): Promise<void>;
  deleteDevice(deviceId: string): Promise<void>;

  // Tracking Fields
  listTrackingFields(): Promise<{ tracking_fields: ZoomTrackingField[] }>;
  getTrackingField(fieldId: string): Promise<ZoomTrackingField>;
  createTrackingField(input: ZoomTrackingFieldCreateInput): Promise<ZoomTrackingField>;
  updateTrackingField(fieldId: string, input: Partial<ZoomTrackingFieldCreateInput>): Promise<void>;
  deleteTrackingField(fieldId: string): Promise<void>;

  // Meeting Polls
  listMeetingPolls(meetingId: number | string): Promise<{ polls: ZoomMeetingPoll[] }>;
  getMeetingPoll(meetingId: number | string, pollId: string): Promise<ZoomMeetingPoll>;
  createMeetingPoll(meetingId: number | string, input: ZoomMeetingPollCreateInput): Promise<ZoomMeetingPoll>;
  updateMeetingPoll(meetingId: number | string, pollId: string, input: Partial<ZoomMeetingPollCreateInput>): Promise<void>;
  deleteMeetingPoll(meetingId: number | string, pollId: string): Promise<void>;

  // Meeting Invitation
  getMeetingInvitation(meetingId: number | string): Promise<{ invitation: string }>;

  // TSP (Telephony Service Provider)
  getTSPInfo(): Promise<ZoomTSP>;
  updateTSPInfo(input: Partial<ZoomTSP>): Promise<void>;
  listUserTSPs(userId: string): Promise<{ tsp_accounts: ZoomUserTSP[] }>;
  getUserTSP(userId: string, tspId: string): Promise<ZoomUserTSP>;
  addUserTSP(userId: string, input: ZoomUserTSPInput): Promise<ZoomUserTSP>;
  updateUserTSP(userId: string, tspId: string, input: Partial<ZoomUserTSPInput>): Promise<void>;
  deleteUserTSP(userId: string, tspId: string): Promise<void>;

  // PAC (Personal Audio Conference)
  getUserPAC(userId: string): Promise<ZoomPAC>;

  // Contacts
  listContacts(params?: PaginationParams & { type?: string; search_key?: string }): Promise<PaginatedResponse<ZoomContact>>;
  getContact(contactId: string): Promise<ZoomContact>;
  listExternalContacts(params?: PaginationParams): Promise<PaginatedResponse<ZoomExternalContact>>;
  getExternalContact(externalContactId: string): Promise<ZoomExternalContact>;
  createExternalContact(input: ZoomExternalContactCreateInput): Promise<ZoomExternalContact>;
  updateExternalContact(externalContactId: string, input: Partial<ZoomExternalContactCreateInput>): Promise<void>;
  deleteExternalContact(externalContactId: string): Promise<void>;

  // IM Groups (Legacy)
  listIMGroups(): Promise<{ groups: ZoomIMGroup[] }>;
  getIMGroup(groupId: string): Promise<ZoomIMGroup>;
  createIMGroup(input: ZoomIMGroupCreateInput): Promise<ZoomIMGroup>;
  updateIMGroup(groupId: string, input: Partial<ZoomIMGroupCreateInput>): Promise<void>;
  deleteIMGroup(groupId: string): Promise<void>;
  listIMGroupMembers(groupId: string, params?: PaginationParams): Promise<PaginatedResponse<ZoomGroupMember>>;
  addIMGroupMembers(groupId: string, members: Array<{ id?: string; email?: string }>): Promise<void>;
  deleteIMGroupMember(groupId: string, memberId: string): Promise<void>;

  // User Assistants
  listUserAssistants(userId: string): Promise<{ assistants: ZoomUserAssistant[] }>;
  addUserAssistants(userId: string, assistants: Array<{ id?: string; email?: string }>): Promise<void>;
  deleteUserAssistants(userId: string): Promise<void>;
  deleteUserAssistant(userId: string, assistantId: string): Promise<void>;

  // User Schedulers
  listUserSchedulers(userId: string): Promise<{ schedulers: ZoomUserScheduler[] }>;
  deleteUserSchedulers(userId: string): Promise<void>;
  deleteUserScheduler(userId: string, schedulerId: string): Promise<void>;

  // User Permissions & Token
  getUserPermissions(userId: string): Promise<ZoomUserPermissions>;
  getUserToken(userId: string, type?: string, ttl?: number): Promise<{ token: string }>;
  revokeUserSSOToken(userId: string): Promise<void>;
  updateUserPassword(userId: string, password: string): Promise<void>;
  updateUserStatus(userId: string, action: 'activate' | 'deactivate'): Promise<void>;

  // User Email & Vanity
  checkUserEmail(email: string): Promise<{ existed_email: boolean }>;
  checkVanityName(vanity_name: string): Promise<{ existed: boolean }>;
  getUserZPK(): Promise<{ zpk: string }>;

  // Webinar Polls
  listWebinarPolls(webinarId: number | string): Promise<{ polls: ZoomWebinarPoll[] }>;
  getWebinarPoll(webinarId: number | string, pollId: string): Promise<ZoomWebinarPoll>;
  createWebinarPoll(webinarId: number | string, input: ZoomWebinarPollCreateInput): Promise<ZoomWebinarPoll>;
  updateWebinarPoll(webinarId: number | string, pollId: string, input: Partial<ZoomWebinarPollCreateInput>): Promise<void>;
  deleteWebinarPoll(webinarId: number | string, pollId: string): Promise<void>;

  // Past Webinars
  getPastWebinar(webinarId: string): Promise<ZoomPastWebinar>;
  getPastWebinarParticipants(webinarId: string, params?: PaginationParams): Promise<PaginatedResponse<ZoomMeetingParticipant>>;
  getWebinarAbsentees(webinarId: string, params?: PaginationParams): Promise<PaginatedResponse<ZoomWebinarAbsentee>>;

  // Meeting & Webinar Templates
  listMeetingTemplates(userId: string): Promise<{ templates: ZoomMeetingTemplate[] }>;
  listWebinarTemplates(userId: string): Promise<{ templates: ZoomWebinarTemplate[] }>;

  // Meeting Livestream
  getMeetingLivestreamSettings(meetingId: number | string): Promise<ZoomLivestreamSettings>;
  updateMeetingLivestreamSettings(meetingId: number | string, settings: ZoomLivestreamSettings): Promise<void>;
  updateMeetingLivestreamStatus(meetingId: number | string, action: 'start' | 'stop', settings?: { active_speaker_name?: boolean; display_name?: string }): Promise<void>;

  // Meeting Registrant Questions
  getMeetingRegistrantQuestions(meetingId: number | string): Promise<ZoomRegistrantQuestions>;
  updateMeetingRegistrantQuestions(meetingId: number | string, questions: ZoomRegistrantQuestions): Promise<void>;

  // Webinar Registrant Questions
  getWebinarRegistrantQuestions(webinarId: number | string): Promise<ZoomRegistrantQuestions>;
  updateWebinarRegistrantQuestions(webinarId: number | string, questions: ZoomRegistrantQuestions): Promise<void>;

  // Account Lock Settings
  getAccountLockSettings(accountId: string): Promise<ZoomAccountLockSettings>;
  updateAccountLockSettings(accountId: string, settings: Partial<ZoomAccountLockSettings>): Promise<void>;

  // Archiving
  listArchivedFiles(params?: PaginationParams & { from?: string; to?: string }): Promise<PaginatedResponse<ZoomArchivedFile>>;
  getArchiveStatistics(params: { from: string; to: string }): Promise<ZoomArchiveStatistics>;
  updateArchivedFileAutoDelete(fileId: string, autoDelete: boolean): Promise<void>;
  getMeetingArchiveToken(meetingId: number | string): Promise<{ token: string }>;
  getMeetingArchivedFiles(meetingUUID: string): Promise<{ archive_files: ZoomArchivedFile[] }>;
  deleteMeetingArchivedFiles(meetingUUID: string): Promise<void>;

  // Recording Analytics
  getRecordingAnalyticsSummary(meetingId: string, params?: { from?: string; to?: string }): Promise<ZoomRecordingAnalyticsSummary>;
  getRecordingAnalyticsDetails(meetingId: string, params?: PaginationParams & { from?: string; to?: string }): Promise<PaginatedResponse<ZoomRecordingAnalyticsDetail>>;
  listRecordingRegistrants(meetingId: string, params?: PaginationParams & { status?: string }): Promise<PaginatedResponse<ZoomRecordingRegistrant>>;
  addRecordingRegistrant(meetingId: string, input: ZoomRecordingRegistrantCreateInput): Promise<{ id: string; registrant_id: string }>;

  // Webinar Q&A
  getWebinarQA(webinarId: string): Promise<ZoomWebinarQA>;

  // Tasks
  listTasks(params?: PaginationParams): Promise<PaginatedResponse<ZoomTask>>;
  getTask(taskId: string): Promise<ZoomTask>;
  createTask(input: ZoomTaskCreateInput): Promise<ZoomTask>;
  updateTask(taskId: string, input: Partial<ZoomTaskCreateInput>): Promise<void>;
  deleteTask(taskId: string): Promise<void>;

  // Task Assignees
  listTaskAssignees(taskId: string): Promise<{ assignees: ZoomTaskAssignee[] }>;
  addTaskAssignee(taskId: string, userId: string): Promise<void>;
  removeTaskAssignee(taskId: string, userId: string): Promise<void>;

  // Task Comments
  listTaskComments(taskId: string): Promise<{ comments: ZoomTaskComment[] }>;
  addTaskComment(taskId: string, content: string): Promise<ZoomTaskComment>;
  deleteTaskComment(taskId: string, commentId: string): Promise<void>;

  // Task Collaborators
  listTaskCollaborators(taskId: string): Promise<{ collaborators: ZoomTaskCollaborator[] }>;
  addTaskCollaborator(taskId: string, userId: string): Promise<void>;
  removeTaskCollaborator(taskId: string, userId: string): Promise<void>;

  // IM Chat Sessions
  listIMChatSessions(params?: PaginationParams & { from?: string; to?: string }): Promise<PaginatedResponse<ZoomIMChatSession>>;
  getIMChatMessages(sessionId: string, params?: PaginationParams & { from?: string; to?: string }): Promise<PaginatedResponse<ZoomIMChatMessage>>;

  // Dashboard Metrics (CRC, IM, Zoom Rooms)
  getCRCMetrics(params: { from: string; to: string }): Promise<ZoomCRCMetrics>;
  getIMMetrics(params: { from: string; to: string }): Promise<ZoomIMMetrics>;
  listZoomRoomMetrics(params?: PaginationParams): Promise<PaginatedResponse<ZoomRoomMetrics>>;
  getZoomRoomMetrics(roomId: string, params: { from: string; to: string }): Promise<ZoomRoomMetrics>;

  // QoS Metrics
  getMeetingParticipantQoS(meetingId: string, participantId: string): Promise<ZoomParticipantQoS>;
  listMeetingParticipantsQoS(meetingId: string, params?: PaginationParams): Promise<PaginatedResponse<ZoomParticipantQoS>>;
  getMeetingParticipantsSharing(meetingId: string, params?: PaginationParams): Promise<PaginatedResponse<ZoomSharingDetail>>;
  getWebinarParticipantQoS(webinarId: string, participantId: string): Promise<ZoomParticipantQoS>;
  listWebinarParticipantsQoS(webinarId: string, params?: PaginationParams): Promise<PaginatedResponse<ZoomParticipantQoS>>;
  getWebinarParticipantsSharing(webinarId: string, params?: PaginationParams): Promise<PaginatedResponse<ZoomSharingDetail>>;

  // Additional Reports
  getCloudRecordingReport(params: { from: string; to: string }): Promise<ZoomCloudRecordingReport>;
  getTelephoneReport(params: PaginationParams & { from: string; to: string; type?: string }): Promise<ZoomTelephoneReport>;
  getUserActivityReport(params: PaginationParams & { from: string; to: string }): Promise<ZoomUserActivityReport>;
  getUserMeetingsReport(userId: string, params: PaginationParams & { from: string; to: string; type?: string }): Promise<PaginatedResponse<ZoomMeetingReport>>;
  getMeetingDetailsReport(meetingId: string): Promise<ZoomMeetingReport>;
  getMeetingPollReport(meetingId: string): Promise<ZoomMeetingPollReport>;
  getWebinarPollReport(webinarId: string): Promise<ZoomMeetingPollReport>;

  // Past Webinar Instances
  getPastWebinarInstances(webinarId: string): Promise<{ webinars: Array<{ uuid: string; start_time: string }> }>;

  // Recording Settings
  getRecordingSettings(meetingId: string): Promise<ZoomRecordingSettings>;
  updateRecordingSettings(meetingId: string, settings: ZoomRecordingSettingsUpdate): Promise<void>;

  // User Picture
  uploadUserPicture(userId: string, picUrl: string): Promise<void>;
  deleteUserPicture(userId: string): Promise<void>;

  // Webhooks
  listWebhooks(): Promise<{ webhooks: ZoomWebhook[] }>;
  getWebhook(webhookId: string): Promise<ZoomWebhook>;
  createWebhook(input: ZoomWebhookCreateInput): Promise<ZoomWebhook>;
  updateWebhook(webhookId: string, input: Partial<ZoomWebhookCreateInput>): Promise<void>;
  deleteWebhook(webhookId: string): Promise<void>;
  getWebhookOptions(): Promise<ZoomWebhookOptions>;
  updateWebhookOptions(options: ZoomWebhookOptions): Promise<void>;

  // Account Managed Domains
  getAccountManagedDomains(accountId: string): Promise<{ domains: Array<{ domain: string }> }>;

  // Account Options
  updateAccountOptions(accountId: string, options: Record<string, unknown>): Promise<void>;

  // Zoom Rooms
  listRooms(params?: PaginationParams & { location_id?: string }): Promise<PaginatedResponse<ZoomRoom>>;
  getRoom(roomId: string): Promise<ZoomRoom>;
  createRoom(input: ZoomRoomCreateInput): Promise<ZoomRoom>;
  updateRoom(roomId: string, input: Partial<ZoomRoomCreateInput>): Promise<void>;
  deleteRoom(roomId: string): Promise<void>;

  // Zoom Room Locations
  listRoomLocations(params?: PaginationParams): Promise<PaginatedResponse<ZoomRoomLocation>>;
  getRoomLocation(locationId: string): Promise<ZoomRoomLocation>;
  createRoomLocation(input: ZoomRoomLocationCreateInput): Promise<ZoomRoomLocation>;
  updateRoomLocation(locationId: string, input: Partial<ZoomRoomLocationCreateInput>): Promise<void>;
  deleteRoomLocation(locationId: string): Promise<void>;

  // Zoom Room Devices
  listRoomDevices(roomId: string): Promise<{ devices: ZoomRoomDevice[] }>;

  // Zoom Room Settings
  getRoomSettings(roomId: string): Promise<ZoomRoomSettings>;
  updateRoomSettings(roomId: string, settings: Partial<ZoomRoomSettings>): Promise<void>;
}

// =============================================================================
// Zoom Client Implementation
// =============================================================================

class ZoomClientImpl implements ZoomClient {
  private credentials: TenantCredentials;

  constructor(credentials: TenantCredentials) {
    this.credentials = credentials;
  }

  // ===========================================================================
  // HTTP Request Helper
  // ===========================================================================

  private getAuthHeaders(): Record<string, string> {
    if (this.credentials.accessToken) {
      return {
        Authorization: `Bearer ${this.credentials.accessToken}`,
        'Content-Type': 'application/json',
      };
    }

    throw new AuthenticationError(
      'No credentials provided. Include X-Zoom-Access-Token header.'
    );
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...(options.headers || {}),
      },
    });

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      throw new RateLimitError('Rate limit exceeded', retryAfter ? parseInt(retryAfter, 10) : 60);
    }

    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      throw new AuthenticationError('Authentication failed. Check your Zoom OAuth credentials.');
    }

    // Handle other errors
    if (!response.ok) {
      const errorBody = await response.text();
      let message = `API error: ${response.status}`;
      let code: string | undefined;
      try {
        const errorJson = JSON.parse(errorBody);
        message = errorJson.message || errorJson.error || message;
        code = errorJson.code?.toString();
      } catch {
        // Use default message
      }
      throw new ZoomApiError(message, response.status, code);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  private buildQueryString(params: Record<string, unknown>): string {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        queryParams.set(key, String(value));
      }
    }
    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  private mapPaginatedResponse<T>(
    response: {
      page_count?: number;
      page_number?: number;
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
    } & Record<string, unknown>,
    itemsKey: string
  ): PaginatedResponse<T> {
    const items = (response[itemsKey] as T[]) || [];
    return {
      items,
      count: items.length,
      total: response.total_records,
      total_records: response.total_records,
      hasMore: !!response.next_page_token,
      next_page_token: response.next_page_token,
      page_count: response.page_count,
      page_number: response.page_number,
      page_size: response.page_size,
    };
  }

  // ===========================================================================
  // Connection
  // ===========================================================================

  async testConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      await this.request<ZoomUser>('/users/me');
      return { connected: true, message: 'Successfully connected to Zoom API' };
    } catch (error) {
      return {
        connected: false,
        message: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  }

  // ===========================================================================
  // Users
  // ===========================================================================

  async listUsers(
    params?: PaginationParams & { status?: string }
  ): Promise<PaginatedResponse<ZoomUser>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      page_number: params?.page_number,
      next_page_token: params?.next_page_token,
      status: params?.status || 'active',
    });
    const response = await this.request<{
      page_count?: number;
      page_number?: number;
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      users: ZoomUser[];
    }>(`/users${query}`);
    return this.mapPaginatedResponse<ZoomUser>(response, 'users');
  }

  async getUser(userId: string): Promise<ZoomUser> {
    return this.request<ZoomUser>(`/users/${encodeURIComponent(userId)}`);
  }

  async createUser(input: ZoomUserCreateInput): Promise<ZoomUser> {
    return this.request<ZoomUser>('/users', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateUser(userId: string, input: ZoomUserUpdateInput): Promise<void> {
    await this.request<void>(`/users/${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteUser(userId: string, action = 'disassociate'): Promise<void> {
    const query = this.buildQueryString({ action });
    await this.request<void>(`/users/${encodeURIComponent(userId)}${query}`, {
      method: 'DELETE',
    });
  }

  async getUserSettings(userId: string): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>(`/users/${encodeURIComponent(userId)}/settings`);
  }

  // ===========================================================================
  // Meetings
  // ===========================================================================

  async listMeetings(
    userId: string,
    params?: PaginationParams & { type?: string }
  ): Promise<PaginatedResponse<ZoomMeeting>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      page_number: params?.page_number,
      next_page_token: params?.next_page_token,
      type: params?.type || 'scheduled',
    });
    const response = await this.request<{
      page_count?: number;
      page_number?: number;
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      meetings: ZoomMeeting[];
    }>(`/users/${encodeURIComponent(userId)}/meetings${query}`);
    return this.mapPaginatedResponse<ZoomMeeting>(response, 'meetings');
  }

  async getMeeting(meetingId: number | string): Promise<ZoomMeeting> {
    return this.request<ZoomMeeting>(`/meetings/${meetingId}`);
  }

  async createMeeting(userId: string, input: ZoomMeetingCreateInput): Promise<ZoomMeeting> {
    return this.request<ZoomMeeting>(`/users/${encodeURIComponent(userId)}/meetings`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateMeeting(meetingId: number | string, input: ZoomMeetingUpdateInput): Promise<void> {
    await this.request<void>(`/meetings/${meetingId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteMeeting(
    meetingId: number | string,
    options?: { occurrence_id?: string }
  ): Promise<void> {
    const query = options?.occurrence_id
      ? this.buildQueryString({ occurrence_id: options.occurrence_id })
      : '';
    await this.request<void>(`/meetings/${meetingId}${query}`, {
      method: 'DELETE',
    });
  }

  async updateMeetingStatus(meetingId: number | string, action: 'end'): Promise<void> {
    await this.request<void>(`/meetings/${meetingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
    });
  }

  // ===========================================================================
  // Meeting Registrants
  // ===========================================================================

  async listMeetingRegistrants(
    meetingId: number | string,
    params?: PaginationParams & { status?: string }
  ): Promise<PaginatedResponse<ZoomMeetingRegistrant>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      page_number: params?.page_number,
      next_page_token: params?.next_page_token,
      status: params?.status,
    });
    const response = await this.request<{
      page_count?: number;
      page_number?: number;
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      registrants: ZoomMeetingRegistrant[];
    }>(`/meetings/${meetingId}/registrants${query}`);
    return this.mapPaginatedResponse<ZoomMeetingRegistrant>(response, 'registrants');
  }

  async addMeetingRegistrant(
    meetingId: number | string,
    input: ZoomMeetingRegistrantCreateInput
  ): Promise<{ id: string; join_url: string; registrant_id: string }> {
    return this.request<{ id: string; join_url: string; registrant_id: string }>(
      `/meetings/${meetingId}/registrants`,
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    );
  }

  async updateMeetingRegistrantStatus(
    meetingId: number | string,
    action: 'approve' | 'deny' | 'cancel',
    registrants: Array<{ id?: string; email?: string }>
  ): Promise<void> {
    await this.request<void>(`/meetings/${meetingId}/registrants/status`, {
      method: 'PUT',
      body: JSON.stringify({ action, registrants }),
    });
  }

  // ===========================================================================
  // Past Meetings
  // ===========================================================================

  async getPastMeeting(meetingUUID: string): Promise<ZoomPastMeeting> {
    // Double-encode UUID if it contains / or //
    const encodedUUID =
      meetingUUID.includes('/') || meetingUUID.includes('//')
        ? encodeURIComponent(encodeURIComponent(meetingUUID))
        : encodeURIComponent(meetingUUID);
    return this.request<ZoomPastMeeting>(`/past_meetings/${encodedUUID}`);
  }

  async getPastMeetingParticipants(
    meetingUUID: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomMeetingParticipant>> {
    const encodedUUID =
      meetingUUID.includes('/') || meetingUUID.includes('//')
        ? encodeURIComponent(encodeURIComponent(meetingUUID))
        : encodeURIComponent(meetingUUID);
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
    });
    const response = await this.request<{
      page_count?: number;
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      participants: ZoomMeetingParticipant[];
    }>(`/past_meetings/${encodedUUID}/participants${query}`);
    return this.mapPaginatedResponse<ZoomMeetingParticipant>(response, 'participants');
  }

  // ===========================================================================
  // Webinars
  // ===========================================================================

  async listWebinars(
    userId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomWebinar>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      page_number: params?.page_number,
      next_page_token: params?.next_page_token,
    });
    const response = await this.request<{
      page_count?: number;
      page_number?: number;
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      webinars: ZoomWebinar[];
    }>(`/users/${encodeURIComponent(userId)}/webinars${query}`);
    return this.mapPaginatedResponse<ZoomWebinar>(response, 'webinars');
  }

  async getWebinar(webinarId: number | string): Promise<ZoomWebinar> {
    return this.request<ZoomWebinar>(`/webinars/${webinarId}`);
  }

  async createWebinar(userId: string, input: ZoomWebinarCreateInput): Promise<ZoomWebinar> {
    return this.request<ZoomWebinar>(`/users/${encodeURIComponent(userId)}/webinars`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateWebinar(webinarId: number | string, input: ZoomWebinarUpdateInput): Promise<void> {
    await this.request<void>(`/webinars/${webinarId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteWebinar(
    webinarId: number | string,
    options?: { occurrence_id?: string }
  ): Promise<void> {
    const query = options?.occurrence_id
      ? this.buildQueryString({ occurrence_id: options.occurrence_id })
      : '';
    await this.request<void>(`/webinars/${webinarId}${query}`, {
      method: 'DELETE',
    });
  }

  async updateWebinarStatus(webinarId: number | string, action: 'end'): Promise<void> {
    await this.request<void>(`/webinars/${webinarId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
    });
  }

  // ===========================================================================
  // Webinar Registrants
  // ===========================================================================

  async listWebinarRegistrants(
    webinarId: number | string,
    params?: PaginationParams & { status?: string }
  ): Promise<PaginatedResponse<ZoomWebinarRegistrant>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      page_number: params?.page_number,
      next_page_token: params?.next_page_token,
      status: params?.status,
    });
    const response = await this.request<{
      page_count?: number;
      page_number?: number;
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      registrants: ZoomWebinarRegistrant[];
    }>(`/webinars/${webinarId}/registrants${query}`);
    return this.mapPaginatedResponse<ZoomWebinarRegistrant>(response, 'registrants');
  }

  async addWebinarRegistrant(
    webinarId: number | string,
    input: ZoomMeetingRegistrantCreateInput
  ): Promise<{ id: string; join_url: string; registrant_id: string }> {
    return this.request<{ id: string; join_url: string; registrant_id: string }>(
      `/webinars/${webinarId}/registrants`,
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    );
  }

  async updateWebinarRegistrantStatus(
    webinarId: number | string,
    action: 'approve' | 'deny' | 'cancel',
    registrants: Array<{ id?: string; email?: string }>
  ): Promise<void> {
    await this.request<void>(`/webinars/${webinarId}/registrants/status`, {
      method: 'PUT',
      body: JSON.stringify({ action, registrants }),
    });
  }

  // ===========================================================================
  // Webinar Panelists
  // ===========================================================================

  async listWebinarPanelists(
    webinarId: number | string
  ): Promise<{ panelists: ZoomWebinarPanelist[] }> {
    return this.request<{ panelists: ZoomWebinarPanelist[] }>(`/webinars/${webinarId}/panelists`);
  }

  async addWebinarPanelists(
    webinarId: number | string,
    panelists: Array<{ name: string; email: string }>
  ): Promise<void> {
    await this.request<void>(`/webinars/${webinarId}/panelists`, {
      method: 'POST',
      body: JSON.stringify({ panelists }),
    });
  }

  async removeWebinarPanelist(webinarId: number | string, panelistId: string): Promise<void> {
    await this.request<void>(`/webinars/${webinarId}/panelists/${panelistId}`, {
      method: 'DELETE',
    });
  }

  async removeAllWebinarPanelists(webinarId: number | string): Promise<void> {
    await this.request<void>(`/webinars/${webinarId}/panelists`, {
      method: 'DELETE',
    });
  }

  // ===========================================================================
  // Cloud Recordings
  // ===========================================================================

  async listRecordings(
    userId: string,
    params?: PaginationParams & { from?: string; to?: string }
  ): Promise<PaginatedResponse<ZoomCloudRecording>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
      from: params?.from,
      to: params?.to,
    });
    const response = await this.request<{
      page_count?: number;
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      meetings: ZoomCloudRecording[];
    }>(`/users/${encodeURIComponent(userId)}/recordings${query}`);
    return this.mapPaginatedResponse<ZoomCloudRecording>(response, 'meetings');
  }

  async getRecording(meetingId: string): Promise<ZoomCloudRecording> {
    const encodedId =
      meetingId.includes('/') || meetingId.includes('//')
        ? encodeURIComponent(encodeURIComponent(meetingId))
        : encodeURIComponent(meetingId);
    return this.request<ZoomCloudRecording>(`/meetings/${encodedId}/recordings`);
  }

  async deleteRecording(meetingId: string, action: 'trash' | 'delete' = 'trash'): Promise<void> {
    const encodedId =
      meetingId.includes('/') || meetingId.includes('//')
        ? encodeURIComponent(encodeURIComponent(meetingId))
        : encodeURIComponent(meetingId);
    const query = this.buildQueryString({ action });
    await this.request<void>(`/meetings/${encodedId}/recordings${query}`, {
      method: 'DELETE',
    });
  }

  async deleteRecordingFile(
    meetingId: string,
    recordingId: string,
    action: 'trash' | 'delete' = 'trash'
  ): Promise<void> {
    const encodedMeetingId =
      meetingId.includes('/') || meetingId.includes('//')
        ? encodeURIComponent(encodeURIComponent(meetingId))
        : encodeURIComponent(meetingId);
    const query = this.buildQueryString({ action });
    await this.request<void>(
      `/meetings/${encodedMeetingId}/recordings/${recordingId}${query}`,
      {
        method: 'DELETE',
      }
    );
  }

  async recoverRecording(meetingId: string): Promise<void> {
    const encodedId =
      meetingId.includes('/') || meetingId.includes('//')
        ? encodeURIComponent(encodeURIComponent(meetingId))
        : encodeURIComponent(meetingId);
    await this.request<void>(`/meetings/${encodedId}/recordings/status`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'recover' }),
    });
  }

  async recoverRecordingFile(meetingId: string, recordingId: string): Promise<void> {
    const encodedId =
      meetingId.includes('/') || meetingId.includes('//')
        ? encodeURIComponent(encodeURIComponent(meetingId))
        : encodeURIComponent(meetingId);
    await this.request<void>(
      `/meetings/${encodedId}/recordings/${encodeURIComponent(recordingId)}/status`,
      {
        method: 'PUT',
        body: JSON.stringify({ action: 'recover' }),
      }
    );
  }

  // ===========================================================================
  // Reports
  // ===========================================================================

  async getMeetingReports(
    params: PaginationParams & { from: string; to: string; type?: string }
  ): Promise<PaginatedResponse<ZoomMeetingReport>> {
    const query = this.buildQueryString({
      page_size: params.page_size || 30,
      next_page_token: params.next_page_token,
      from: params.from,
      to: params.to,
      type: params.type,
    });
    const response = await this.request<{
      page_count?: number;
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      meetings: ZoomMeetingReport[];
    }>(`/report/meetings${query}`);
    return this.mapPaginatedResponse<ZoomMeetingReport>(response, 'meetings');
  }

  async getMeetingParticipantsReport(
    meetingId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomMeetingParticipant>> {
    const encodedId =
      meetingId.includes('/') || meetingId.includes('//')
        ? encodeURIComponent(encodeURIComponent(meetingId))
        : encodeURIComponent(meetingId);
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
    });
    const response = await this.request<{
      page_count?: number;
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      participants: ZoomMeetingParticipant[];
    }>(`/report/meetings/${encodedId}/participants${query}`);
    return this.mapPaginatedResponse<ZoomMeetingParticipant>(response, 'participants');
  }

  async getWebinarReports(
    params: PaginationParams & { from: string; to: string }
  ): Promise<PaginatedResponse<ZoomWebinarReport>> {
    const query = this.buildQueryString({
      page_size: params.page_size || 30,
      next_page_token: params.next_page_token,
      from: params.from,
      to: params.to,
    });
    const response = await this.request<{
      page_count?: number;
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      webinars: ZoomWebinarReport[];
    }>(`/report/webinars${query}`);
    return this.mapPaginatedResponse<ZoomWebinarReport>(response, 'webinars');
  }

  async getDailyUsageReport(params: { year: number; month: number }): Promise<{ dates: ZoomDailyReport[] }> {
    const query = this.buildQueryString({
      year: params.year,
      month: params.month,
    });
    return this.request<{ dates: ZoomDailyReport[] }>(`/report/daily${query}`);
  }

  // ===========================================================================
  // Dashboard
  // ===========================================================================

  async listDashboardMeetings(
    params: PaginationParams & { from: string; to: string; type?: string }
  ): Promise<PaginatedResponse<ZoomDashboardMeeting>> {
    const query = this.buildQueryString({
      page_size: params.page_size || 30,
      next_page_token: params.next_page_token,
      from: params.from,
      to: params.to,
      type: params.type,
    });
    const response = await this.request<{
      page_count?: number;
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      meetings: ZoomDashboardMeeting[];
    }>(`/metrics/meetings${query}`);
    return this.mapPaginatedResponse<ZoomDashboardMeeting>(response, 'meetings');
  }

  async listDashboardWebinars(
    params: PaginationParams & { from: string; to: string }
  ): Promise<PaginatedResponse<ZoomDashboardWebinar>> {
    const query = this.buildQueryString({
      page_size: params.page_size || 30,
      next_page_token: params.next_page_token,
      from: params.from,
      to: params.to,
    });
    const response = await this.request<{
      page_count?: number;
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      webinars: ZoomDashboardWebinar[];
    }>(`/metrics/webinars${query}`);
    return this.mapPaginatedResponse<ZoomDashboardWebinar>(response, 'webinars');
  }

  async getDashboardMeetingDetail(meetingId: string): Promise<ZoomDashboardMeeting> {
    const encodedId =
      meetingId.includes('/') || meetingId.includes('//')
        ? encodeURIComponent(encodeURIComponent(meetingId))
        : encodeURIComponent(meetingId);
    return this.request<ZoomDashboardMeeting>(`/metrics/meetings/${encodedId}`);
  }

  async getDashboardMeetingParticipants(
    meetingId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomMeetingParticipant>> {
    const encodedId =
      meetingId.includes('/') || meetingId.includes('//')
        ? encodeURIComponent(encodeURIComponent(meetingId))
        : encodeURIComponent(meetingId);
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
    });
    const response = await this.request<{
      page_count?: number;
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      participants: ZoomMeetingParticipant[];
    }>(`/metrics/meetings/${encodedId}/participants${query}`);
    return this.mapPaginatedResponse<ZoomMeetingParticipant>(response, 'participants');
  }

  // ===========================================================================
  // Groups
  // ===========================================================================

  async listGroups(): Promise<{ groups: ZoomGroup[] }> {
    return this.request<{ groups: ZoomGroup[] }>('/groups');
  }

  async getGroup(groupId: string): Promise<ZoomGroup> {
    return this.request<ZoomGroup>(`/groups/${encodeURIComponent(groupId)}`);
  }

  async createGroup(input: ZoomGroupCreateInput): Promise<ZoomGroup> {
    return this.request<ZoomGroup>('/groups', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateGroup(groupId: string, input: ZoomGroupCreateInput): Promise<void> {
    await this.request<void>(`/groups/${encodeURIComponent(groupId)}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteGroup(groupId: string): Promise<void> {
    await this.request<void>(`/groups/${encodeURIComponent(groupId)}`, {
      method: 'DELETE',
    });
  }

  async listGroupMembers(
    groupId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomGroupMember>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      page_number: params?.page_number,
      next_page_token: params?.next_page_token,
    });
    const response = await this.request<{
      page_count?: number;
      page_number?: number;
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      members: ZoomGroupMember[];
    }>(`/groups/${encodeURIComponent(groupId)}/members${query}`);
    return this.mapPaginatedResponse<ZoomGroupMember>(response, 'members');
  }

  async addGroupMembers(
    groupId: string,
    members: Array<{ id?: string; email?: string }>
  ): Promise<void> {
    await this.request<void>(`/groups/${encodeURIComponent(groupId)}/members`, {
      method: 'POST',
      body: JSON.stringify({ members }),
    });
  }

  async deleteGroupMember(groupId: string, memberId: string): Promise<void> {
    await this.request<void>(
      `/groups/${encodeURIComponent(groupId)}/members/${encodeURIComponent(memberId)}`,
      {
        method: 'DELETE',
      }
    );
  }

  // ===========================================================================
  // Roles
  // ===========================================================================

  async listRoles(): Promise<{ roles: ZoomRole[] }> {
    return this.request<{ roles: ZoomRole[] }>('/roles');
  }

  async getRole(roleId: string): Promise<ZoomRole> {
    return this.request<ZoomRole>(`/roles/${encodeURIComponent(roleId)}`);
  }

  async createRole(input: ZoomRoleCreateInput): Promise<ZoomRole> {
    return this.request<ZoomRole>('/roles', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateRole(roleId: string, input: ZoomRoleCreateInput): Promise<void> {
    await this.request<void>(`/roles/${encodeURIComponent(roleId)}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteRole(roleId: string): Promise<void> {
    await this.request<void>(`/roles/${encodeURIComponent(roleId)}`, {
      method: 'DELETE',
    });
  }

  async listRoleMembers(
    roleId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomRoleMember>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      page_number: params?.page_number,
      next_page_token: params?.next_page_token,
    });
    const response = await this.request<{
      page_count?: number;
      page_number?: number;
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      members: ZoomRoleMember[];
    }>(`/roles/${encodeURIComponent(roleId)}/members${query}`);
    return this.mapPaginatedResponse<ZoomRoleMember>(response, 'members');
  }

  async assignRoleMembers(
    roleId: string,
    members: Array<{ id?: string; email?: string }>
  ): Promise<void> {
    await this.request<void>(`/roles/${encodeURIComponent(roleId)}/members`, {
      method: 'POST',
      body: JSON.stringify({ members }),
    });
  }

  async unassignRoleMember(roleId: string, memberId: string): Promise<void> {
    await this.request<void>(
      `/roles/${encodeURIComponent(roleId)}/members/${encodeURIComponent(memberId)}`,
      {
        method: 'DELETE',
      }
    );
  }

  // ===========================================================================
  // Chat Channels
  // ===========================================================================

  async listChatChannels(
    userId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomChatChannel>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
    });
    const response = await this.request<{
      page_count?: number;
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      channels: ZoomChatChannel[];
    }>(`/chat/users/${encodeURIComponent(userId)}/channels${query}`);
    return this.mapPaginatedResponse<ZoomChatChannel>(response, 'channels');
  }

  async getChatChannel(channelId: string): Promise<ZoomChatChannel> {
    return this.request<ZoomChatChannel>(`/chat/channels/${encodeURIComponent(channelId)}`);
  }

  async createChatChannel(
    userId: string,
    input: ZoomChatChannelCreateInput
  ): Promise<ZoomChatChannel> {
    return this.request<ZoomChatChannel>(`/chat/users/${encodeURIComponent(userId)}/channels`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateChatChannel(channelId: string, name: string): Promise<void> {
    await this.request<void>(`/chat/channels/${encodeURIComponent(channelId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    });
  }

  async deleteChatChannel(channelId: string): Promise<void> {
    await this.request<void>(`/chat/channels/${encodeURIComponent(channelId)}`, {
      method: 'DELETE',
    });
  }

  // ===========================================================================
  // Chat Messages
  // ===========================================================================

  async listChatMessages(
    userId: string,
    params: PaginationParams & { to_channel?: string; to_contact?: string; date?: string }
  ): Promise<PaginatedResponse<ZoomChatMessage>> {
    const query = this.buildQueryString({
      page_size: params.page_size || 30,
      next_page_token: params.next_page_token,
      to_channel: params.to_channel,
      to_contact: params.to_contact,
      date: params.date,
    });
    const response = await this.request<{
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      messages: ZoomChatMessage[];
    }>(`/chat/users/${encodeURIComponent(userId)}/messages${query}`);
    return this.mapPaginatedResponse<ZoomChatMessage>(response, 'messages');
  }

  async sendChatMessage(
    userId: string,
    input: ZoomChatMessageSendInput
  ): Promise<{ id: string }> {
    return this.request<{ id: string }>(`/chat/users/${encodeURIComponent(userId)}/messages`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateChatMessage(
    messageId: string,
    userId: string,
    message: string,
    toChannel?: string,
    toContact?: string
  ): Promise<void> {
    const body: Record<string, string> = { message };
    if (toChannel) body.to_channel = toChannel;
    if (toContact) body.to_contact = toContact;

    await this.request<void>(
      `/chat/users/${encodeURIComponent(userId)}/messages/${encodeURIComponent(messageId)}`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      }
    );
  }

  async deleteChatMessage(
    messageId: string,
    userId: string,
    toChannel?: string,
    toContact?: string
  ): Promise<void> {
    const queryParams: Record<string, string> = {};
    if (toChannel) queryParams.to_channel = toChannel;
    if (toContact) queryParams.to_contact = toContact;
    const query = this.buildQueryString(queryParams);

    await this.request<void>(
      `/chat/users/${encodeURIComponent(userId)}/messages/${encodeURIComponent(messageId)}${query}`,
      {
        method: 'DELETE',
      }
    );
  }

  // ===========================================================================
  // Accounts
  // ===========================================================================

  async listAccounts(params?: PaginationParams): Promise<PaginatedResponse<ZoomAccount>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      page_number: params?.page_number,
      next_page_token: params?.next_page_token,
    });
    const response = await this.request<{
      page_count?: number;
      page_number?: number;
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      accounts: ZoomAccount[];
    }>(`/accounts${query}`);
    return this.mapPaginatedResponse<ZoomAccount>(response, 'accounts');
  }

  async getAccount(accountId: string): Promise<ZoomAccount> {
    return this.request<ZoomAccount>(`/accounts/${encodeURIComponent(accountId)}`);
  }

  async createAccount(input: ZoomAccountCreateInput): Promise<ZoomAccount> {
    return this.request<ZoomAccount>('/accounts', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async disassociateAccount(accountId: string): Promise<void> {
    await this.request<void>(`/accounts/${encodeURIComponent(accountId)}`, {
      method: 'DELETE',
    });
  }

  async getAccountSettings(accountId: string): Promise<ZoomAccountSettings> {
    return this.request<ZoomAccountSettings>(
      `/accounts/${encodeURIComponent(accountId)}/settings`
    );
  }

  async updateAccountSettings(
    accountId: string,
    settings: Partial<ZoomAccountSettings>
  ): Promise<void> {
    await this.request<void>(`/accounts/${encodeURIComponent(accountId)}/settings`, {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  }

  async getAccountBilling(accountId: string): Promise<ZoomBillingInfo> {
    return this.request<ZoomBillingInfo>(
      `/accounts/${encodeURIComponent(accountId)}/billing`
    );
  }

  async updateAccountBilling(
    accountId: string,
    billing: Partial<ZoomBillingInfo>
  ): Promise<void> {
    await this.request<void>(`/accounts/${encodeURIComponent(accountId)}/billing`, {
      method: 'PATCH',
      body: JSON.stringify(billing),
    });
  }

  async getAccountPlans(accountId: string): Promise<ZoomPlanInfo> {
    return this.request<ZoomPlanInfo>(
      `/accounts/${encodeURIComponent(accountId)}/plans`
    );
  }

  async subscribePlans(accountId: string, input: ZoomPlanSubscribeInput): Promise<void> {
    await this.request<void>(`/accounts/${encodeURIComponent(accountId)}/plans`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async subscribeAddons(accountId: string, addons: ZoomAddonInput[]): Promise<void> {
    await this.request<void>(`/accounts/${encodeURIComponent(accountId)}/plans/addons`, {
      method: 'POST',
      body: JSON.stringify({ plan_addon: addons }),
    });
  }

  async updateAddons(accountId: string, addons: ZoomAddonInput[]): Promise<void> {
    await this.request<void>(`/accounts/${encodeURIComponent(accountId)}/plans/addons`, {
      method: 'PUT',
      body: JSON.stringify({ plan_addon: addons }),
    });
  }

  async updateBasePlan(accountId: string, basePlan: ZoomBasePlanInput): Promise<void> {
    await this.request<void>(`/accounts/${encodeURIComponent(accountId)}/plans/base`, {
      method: 'PUT',
      body: JSON.stringify({ plan_base: basePlan }),
    });
  }

  // ===========================================================================
  // H.323/SIP Devices
  // ===========================================================================

  async listDevices(params?: PaginationParams): Promise<PaginatedResponse<ZoomDevice>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      page_number: params?.page_number,
      next_page_token: params?.next_page_token,
    });
    const response = await this.request<{
      page_count?: number;
      page_number?: number;
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      devices: ZoomDevice[];
    }>(`/h323/devices${query}`);
    return this.mapPaginatedResponse<ZoomDevice>(response, 'devices');
  }

  async createDevice(input: ZoomDeviceCreateInput): Promise<ZoomDevice> {
    return this.request<ZoomDevice>('/h323/devices', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateDevice(
    deviceId: string,
    input: Partial<ZoomDeviceCreateInput>
  ): Promise<void> {
    await this.request<void>(`/h323/devices/${encodeURIComponent(deviceId)}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteDevice(deviceId: string): Promise<void> {
    await this.request<void>(`/h323/devices/${encodeURIComponent(deviceId)}`, {
      method: 'DELETE',
    });
  }

  // ===========================================================================
  // Tracking Fields
  // ===========================================================================

  async listTrackingFields(): Promise<{ tracking_fields: ZoomTrackingField[] }> {
    return this.request<{ tracking_fields: ZoomTrackingField[] }>('/tracking_fields');
  }

  async getTrackingField(fieldId: string): Promise<ZoomTrackingField> {
    return this.request<ZoomTrackingField>(
      `/tracking_fields/${encodeURIComponent(fieldId)}`
    );
  }

  async createTrackingField(
    input: ZoomTrackingFieldCreateInput
  ): Promise<ZoomTrackingField> {
    return this.request<ZoomTrackingField>('/tracking_fields', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateTrackingField(
    fieldId: string,
    input: Partial<ZoomTrackingFieldCreateInput>
  ): Promise<void> {
    await this.request<void>(`/tracking_fields/${encodeURIComponent(fieldId)}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteTrackingField(fieldId: string): Promise<void> {
    await this.request<void>(`/tracking_fields/${encodeURIComponent(fieldId)}`, {
      method: 'DELETE',
    });
  }

  // ===========================================================================
  // Meeting Polls
  // ===========================================================================

  async listMeetingPolls(
    meetingId: number | string
  ): Promise<{ polls: ZoomMeetingPoll[] }> {
    return this.request<{ polls: ZoomMeetingPoll[] }>(
      `/meetings/${encodeURIComponent(meetingId)}/polls`
    );
  }

  async getMeetingPoll(
    meetingId: number | string,
    pollId: string
  ): Promise<ZoomMeetingPoll> {
    return this.request<ZoomMeetingPoll>(
      `/meetings/${encodeURIComponent(meetingId)}/polls/${encodeURIComponent(pollId)}`
    );
  }

  async createMeetingPoll(
    meetingId: number | string,
    input: ZoomMeetingPollCreateInput
  ): Promise<ZoomMeetingPoll> {
    return this.request<ZoomMeetingPoll>(
      `/meetings/${encodeURIComponent(meetingId)}/polls`,
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    );
  }

  async updateMeetingPoll(
    meetingId: number | string,
    pollId: string,
    input: Partial<ZoomMeetingPollCreateInput>
  ): Promise<void> {
    await this.request<void>(
      `/meetings/${encodeURIComponent(meetingId)}/polls/${encodeURIComponent(pollId)}`,
      {
        method: 'PUT',
        body: JSON.stringify(input),
      }
    );
  }

  async deleteMeetingPoll(meetingId: number | string, pollId: string): Promise<void> {
    await this.request<void>(
      `/meetings/${encodeURIComponent(meetingId)}/polls/${encodeURIComponent(pollId)}`,
      {
        method: 'DELETE',
      }
    );
  }

  // ===========================================================================
  // Meeting Invitation
  // ===========================================================================

  async getMeetingInvitation(
    meetingId: number | string
  ): Promise<{ invitation: string }> {
    return this.request<{ invitation: string }>(
      `/meetings/${encodeURIComponent(meetingId)}/invitation`
    );
  }

  // ===========================================================================
  // TSP (Telephony Service Provider)
  // ===========================================================================

  async getTSPInfo(): Promise<ZoomTSP> {
    return this.request<ZoomTSP>('/tsp');
  }

  async updateTSPInfo(input: Partial<ZoomTSP>): Promise<void> {
    await this.request<void>('/tsp', {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async listUserTSPs(userId: string): Promise<{ tsp_accounts: ZoomUserTSP[] }> {
    return this.request<{ tsp_accounts: ZoomUserTSP[] }>(
      `/users/${encodeURIComponent(userId)}/tsp`
    );
  }

  async getUserTSP(userId: string, tspId: string): Promise<ZoomUserTSP> {
    return this.request<ZoomUserTSP>(
      `/users/${encodeURIComponent(userId)}/tsp/${encodeURIComponent(tspId)}`
    );
  }

  async addUserTSP(userId: string, input: ZoomUserTSPInput): Promise<ZoomUserTSP> {
    return this.request<ZoomUserTSP>(`/users/${encodeURIComponent(userId)}/tsp`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateUserTSP(
    userId: string,
    tspId: string,
    input: Partial<ZoomUserTSPInput>
  ): Promise<void> {
    await this.request<void>(
      `/users/${encodeURIComponent(userId)}/tsp/${encodeURIComponent(tspId)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(input),
      }
    );
  }

  async deleteUserTSP(userId: string, tspId: string): Promise<void> {
    await this.request<void>(
      `/users/${encodeURIComponent(userId)}/tsp/${encodeURIComponent(tspId)}`,
      {
        method: 'DELETE',
      }
    );
  }

  // ===========================================================================
  // PAC (Personal Audio Conference)
  // ===========================================================================

  async getUserPAC(userId: string): Promise<ZoomPAC> {
    return this.request<ZoomPAC>(`/users/${encodeURIComponent(userId)}/pac`);
  }

  // ===========================================================================
  // Contacts
  // ===========================================================================

  async listContacts(
    params?: PaginationParams & { type?: string; search_key?: string }
  ): Promise<PaginatedResponse<ZoomContact>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
      type: params?.type,
      search_key: params?.search_key,
    });
    const response = await this.request<{
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      contacts: ZoomContact[];
    }>(`/contacts${query}`);
    return this.mapPaginatedResponse<ZoomContact>(response, 'contacts');
  }

  async getContact(contactId: string): Promise<ZoomContact> {
    return this.request<ZoomContact>(`/contacts/${encodeURIComponent(contactId)}`);
  }

  async listExternalContacts(
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomExternalContact>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
    });
    const response = await this.request<{
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      external_contacts: ZoomExternalContact[];
    }>(`/contacts/external${query}`);
    return this.mapPaginatedResponse<ZoomExternalContact>(response, 'external_contacts');
  }

  async getExternalContact(externalContactId: string): Promise<ZoomExternalContact> {
    return this.request<ZoomExternalContact>(
      `/contacts/external/${encodeURIComponent(externalContactId)}`
    );
  }

  async createExternalContact(
    input: ZoomExternalContactCreateInput
  ): Promise<ZoomExternalContact> {
    return this.request<ZoomExternalContact>('/contacts/external', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateExternalContact(
    externalContactId: string,
    input: Partial<ZoomExternalContactCreateInput>
  ): Promise<void> {
    await this.request<void>(
      `/contacts/external/${encodeURIComponent(externalContactId)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(input),
      }
    );
  }

  async deleteExternalContact(externalContactId: string): Promise<void> {
    await this.request<void>(
      `/contacts/external/${encodeURIComponent(externalContactId)}`,
      {
        method: 'DELETE',
      }
    );
  }

  // ===========================================================================
  // IM Groups (Legacy)
  // ===========================================================================

  async listIMGroups(): Promise<{ groups: ZoomIMGroup[] }> {
    return this.request<{ groups: ZoomIMGroup[] }>('/im/groups');
  }

  async getIMGroup(groupId: string): Promise<ZoomIMGroup> {
    return this.request<ZoomIMGroup>(`/im/groups/${encodeURIComponent(groupId)}`);
  }

  async createIMGroup(input: ZoomIMGroupCreateInput): Promise<ZoomIMGroup> {
    return this.request<ZoomIMGroup>('/im/groups', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateIMGroup(
    groupId: string,
    input: Partial<ZoomIMGroupCreateInput>
  ): Promise<void> {
    await this.request<void>(`/im/groups/${encodeURIComponent(groupId)}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteIMGroup(groupId: string): Promise<void> {
    await this.request<void>(`/im/groups/${encodeURIComponent(groupId)}`, {
      method: 'DELETE',
    });
  }

  async listIMGroupMembers(
    groupId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomGroupMember>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      page_number: params?.page_number,
      next_page_token: params?.next_page_token,
    });
    const response = await this.request<{
      page_count?: number;
      page_number?: number;
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      members: ZoomGroupMember[];
    }>(`/im/groups/${encodeURIComponent(groupId)}/members${query}`);
    return this.mapPaginatedResponse<ZoomGroupMember>(response, 'members');
  }

  async addIMGroupMembers(
    groupId: string,
    members: Array<{ id?: string; email?: string }>
  ): Promise<void> {
    await this.request<void>(`/im/groups/${encodeURIComponent(groupId)}/members`, {
      method: 'POST',
      body: JSON.stringify({ members }),
    });
  }

  async deleteIMGroupMember(groupId: string, memberId: string): Promise<void> {
    await this.request<void>(
      `/im/groups/${encodeURIComponent(groupId)}/members/${encodeURIComponent(memberId)}`,
      {
        method: 'DELETE',
      }
    );
  }

  // ===========================================================================
  // User Assistants
  // ===========================================================================

  async listUserAssistants(userId: string): Promise<{ assistants: ZoomUserAssistant[] }> {
    return this.request<{ assistants: ZoomUserAssistant[] }>(
      `/users/${encodeURIComponent(userId)}/assistants`
    );
  }

  async addUserAssistants(
    userId: string,
    assistants: Array<{ id?: string; email?: string }>
  ): Promise<void> {
    await this.request<void>(`/users/${encodeURIComponent(userId)}/assistants`, {
      method: 'POST',
      body: JSON.stringify({ assistants }),
    });
  }

  async deleteUserAssistants(userId: string): Promise<void> {
    await this.request<void>(`/users/${encodeURIComponent(userId)}/assistants`, {
      method: 'DELETE',
    });
  }

  async deleteUserAssistant(userId: string, assistantId: string): Promise<void> {
    await this.request<void>(
      `/users/${encodeURIComponent(userId)}/assistants/${encodeURIComponent(assistantId)}`,
      {
        method: 'DELETE',
      }
    );
  }

  // ===========================================================================
  // User Schedulers
  // ===========================================================================

  async listUserSchedulers(userId: string): Promise<{ schedulers: ZoomUserScheduler[] }> {
    return this.request<{ schedulers: ZoomUserScheduler[] }>(
      `/users/${encodeURIComponent(userId)}/schedulers`
    );
  }

  async deleteUserSchedulers(userId: string): Promise<void> {
    await this.request<void>(`/users/${encodeURIComponent(userId)}/schedulers`, {
      method: 'DELETE',
    });
  }

  async deleteUserScheduler(userId: string, schedulerId: string): Promise<void> {
    await this.request<void>(
      `/users/${encodeURIComponent(userId)}/schedulers/${encodeURIComponent(schedulerId)}`,
      {
        method: 'DELETE',
      }
    );
  }

  // ===========================================================================
  // User Permissions & Token
  // ===========================================================================

  async getUserPermissions(userId: string): Promise<ZoomUserPermissions> {
    return this.request<ZoomUserPermissions>(
      `/users/${encodeURIComponent(userId)}/permissions`
    );
  }

  async getUserToken(
    userId: string,
    type?: string,
    ttl?: number
  ): Promise<{ token: string }> {
    const query = this.buildQueryString({ type, ttl });
    return this.request<{ token: string }>(
      `/users/${encodeURIComponent(userId)}/token${query}`
    );
  }

  async revokeUserSSOToken(userId: string): Promise<void> {
    await this.request<void>(`/users/${encodeURIComponent(userId)}/token`, {
      method: 'DELETE',
    });
  }

  async updateUserPassword(userId: string, password: string): Promise<void> {
    await this.request<void>(`/users/${encodeURIComponent(userId)}/password`, {
      method: 'PUT',
      body: JSON.stringify({ password }),
    });
  }

  async updateUserStatus(
    userId: string,
    action: 'activate' | 'deactivate'
  ): Promise<void> {
    await this.request<void>(`/users/${encodeURIComponent(userId)}/status`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
    });
  }

  // ===========================================================================
  // User Email & Vanity
  // ===========================================================================

  async checkUserEmail(email: string): Promise<{ existed_email: boolean }> {
    const query = this.buildQueryString({ email });
    return this.request<{ existed_email: boolean }>(`/users/email${query}`);
  }

  async checkVanityName(vanity_name: string): Promise<{ existed: boolean }> {
    const query = this.buildQueryString({ vanity_name });
    return this.request<{ existed: boolean }>(`/users/vanity_name${query}`);
  }

  async getUserZPK(): Promise<{ zpk: string }> {
    return this.request<{ zpk: string }>('/users/zpk');
  }

  // ===========================================================================
  // Webinar Polls
  // ===========================================================================

  async listWebinarPolls(
    webinarId: number | string
  ): Promise<{ polls: ZoomWebinarPoll[] }> {
    return this.request<{ polls: ZoomWebinarPoll[] }>(
      `/webinars/${encodeURIComponent(webinarId)}/polls`
    );
  }

  async getWebinarPoll(
    webinarId: number | string,
    pollId: string
  ): Promise<ZoomWebinarPoll> {
    return this.request<ZoomWebinarPoll>(
      `/webinars/${encodeURIComponent(webinarId)}/polls/${encodeURIComponent(pollId)}`
    );
  }

  async createWebinarPoll(
    webinarId: number | string,
    input: ZoomWebinarPollCreateInput
  ): Promise<ZoomWebinarPoll> {
    return this.request<ZoomWebinarPoll>(
      `/webinars/${encodeURIComponent(webinarId)}/polls`,
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    );
  }

  async updateWebinarPoll(
    webinarId: number | string,
    pollId: string,
    input: Partial<ZoomWebinarPollCreateInput>
  ): Promise<void> {
    await this.request<void>(
      `/webinars/${encodeURIComponent(webinarId)}/polls/${encodeURIComponent(pollId)}`,
      {
        method: 'PUT',
        body: JSON.stringify(input),
      }
    );
  }

  async deleteWebinarPoll(webinarId: number | string, pollId: string): Promise<void> {
    await this.request<void>(
      `/webinars/${encodeURIComponent(webinarId)}/polls/${encodeURIComponent(pollId)}`,
      {
        method: 'DELETE',
      }
    );
  }

  // ===========================================================================
  // Past Webinars
  // ===========================================================================

  async getPastWebinar(webinarId: string): Promise<ZoomPastWebinar> {
    return this.request<ZoomPastWebinar>(
      `/past_webinars/${encodeURIComponent(webinarId)}`
    );
  }

  async getPastWebinarParticipants(
    webinarId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomMeetingParticipant>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
    });
    const response = await this.request<{
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      participants: ZoomMeetingParticipant[];
    }>(`/past_webinars/${encodeURIComponent(webinarId)}/participants${query}`);
    return this.mapPaginatedResponse<ZoomMeetingParticipant>(response, 'participants');
  }

  async getWebinarAbsentees(
    webinarId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomWebinarAbsentee>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
    });
    const response = await this.request<{
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      registrants: ZoomWebinarAbsentee[];
    }>(`/past_webinars/${encodeURIComponent(webinarId)}/absentees${query}`);
    return this.mapPaginatedResponse<ZoomWebinarAbsentee>(response, 'registrants');
  }

  // ===========================================================================
  // Meeting & Webinar Templates
  // ===========================================================================

  async listMeetingTemplates(userId: string): Promise<{ templates: ZoomMeetingTemplate[] }> {
    return this.request<{ templates: ZoomMeetingTemplate[] }>(
      `/users/${encodeURIComponent(userId)}/meeting_templates`
    );
  }

  async listWebinarTemplates(userId: string): Promise<{ templates: ZoomWebinarTemplate[] }> {
    return this.request<{ templates: ZoomWebinarTemplate[] }>(
      `/users/${encodeURIComponent(userId)}/webinar_templates`
    );
  }

  // ===========================================================================
  // Meeting Livestream
  // ===========================================================================

  async getMeetingLivestreamSettings(
    meetingId: number | string
  ): Promise<ZoomLivestreamSettings> {
    return this.request<ZoomLivestreamSettings>(
      `/meetings/${encodeURIComponent(meetingId)}/livestream`
    );
  }

  async updateMeetingLivestreamSettings(
    meetingId: number | string,
    settings: ZoomLivestreamSettings
  ): Promise<void> {
    await this.request<void>(`/meetings/${encodeURIComponent(meetingId)}/livestream`, {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  }

  async updateMeetingLivestreamStatus(
    meetingId: number | string,
    action: 'start' | 'stop',
    settings?: { active_speaker_name?: boolean; display_name?: string }
  ): Promise<void> {
    await this.request<void>(
      `/meetings/${encodeURIComponent(meetingId)}/livestream/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ action, settings }),
      }
    );
  }

  // ===========================================================================
  // Meeting Registrant Questions
  // ===========================================================================

  async getMeetingRegistrantQuestions(
    meetingId: number | string
  ): Promise<ZoomRegistrantQuestions> {
    return this.request<ZoomRegistrantQuestions>(
      `/meetings/${encodeURIComponent(meetingId)}/registrants/questions`
    );
  }

  async updateMeetingRegistrantQuestions(
    meetingId: number | string,
    questions: ZoomRegistrantQuestions
  ): Promise<void> {
    await this.request<void>(
      `/meetings/${encodeURIComponent(meetingId)}/registrants/questions`,
      {
        method: 'PATCH',
        body: JSON.stringify(questions),
      }
    );
  }

  // ===========================================================================
  // Webinar Registrant Questions
  // ===========================================================================

  async getWebinarRegistrantQuestions(
    webinarId: number | string
  ): Promise<ZoomRegistrantQuestions> {
    return this.request<ZoomRegistrantQuestions>(
      `/webinars/${encodeURIComponent(webinarId)}/registrants/questions`
    );
  }

  async updateWebinarRegistrantQuestions(
    webinarId: number | string,
    questions: ZoomRegistrantQuestions
  ): Promise<void> {
    await this.request<void>(
      `/webinars/${encodeURIComponent(webinarId)}/registrants/questions`,
      {
        method: 'PATCH',
        body: JSON.stringify(questions),
      }
    );
  }

  // ===========================================================================
  // Account Lock Settings
  // ===========================================================================

  async getAccountLockSettings(accountId: string): Promise<ZoomAccountLockSettings> {
    return this.request<ZoomAccountLockSettings>(
      `/accounts/${encodeURIComponent(accountId)}/lock_settings`
    );
  }

  async updateAccountLockSettings(
    accountId: string,
    settings: Partial<ZoomAccountLockSettings>
  ): Promise<void> {
    await this.request<void>(
      `/accounts/${encodeURIComponent(accountId)}/lock_settings`,
      {
        method: 'PATCH',
        body: JSON.stringify(settings),
      }
    );
  }

  // ===========================================================================
  // Archiving
  // ===========================================================================

  async listArchivedFiles(
    params?: PaginationParams & { from?: string; to?: string }
  ): Promise<PaginatedResponse<ZoomArchivedFile>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
      from: params?.from,
      to: params?.to,
    });
    const response = await this.request<{
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      meetings: ZoomArchivedFile[];
    }>(`/archive_files${query}`);
    return this.mapPaginatedResponse<ZoomArchivedFile>(response, 'meetings');
  }

  async getArchiveStatistics(
    params: { from: string; to: string }
  ): Promise<ZoomArchiveStatistics> {
    const query = this.buildQueryString(params);
    return this.request<ZoomArchiveStatistics>(`/archive_files/statistics${query}`);
  }

  async updateArchivedFileAutoDelete(fileId: string, autoDelete: boolean): Promise<void> {
    await this.request<void>(`/archive_files/${encodeURIComponent(fileId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ auto_delete: autoDelete }),
    });
  }

  async getMeetingArchiveToken(
    meetingId: number | string
  ): Promise<{ token: string }> {
    return this.request<{ token: string }>(
      `/meetings/${encodeURIComponent(meetingId)}/jointoken/local_archiving`
    );
  }

  async getMeetingArchivedFiles(
    meetingUUID: string
  ): Promise<{ archive_files: ZoomArchivedFile[] }> {
    return this.request<{ archive_files: ZoomArchivedFile[] }>(
      `/past_meetings/${encodeURIComponent(meetingUUID)}/archive_files`
    );
  }

  async deleteMeetingArchivedFiles(meetingUUID: string): Promise<void> {
    await this.request<void>(
      `/past_meetings/${encodeURIComponent(meetingUUID)}/archive_files`,
      {
        method: 'DELETE',
      }
    );
  }

  // ===========================================================================
  // Recording Analytics
  // ===========================================================================

  async getRecordingAnalyticsSummary(
    meetingId: string,
    params?: { from?: string; to?: string }
  ): Promise<ZoomRecordingAnalyticsSummary> {
    const query = this.buildQueryString(params || {});
    return this.request<ZoomRecordingAnalyticsSummary>(
      `/meetings/${encodeURIComponent(meetingId)}/recordings/analytics_summary${query}`
    );
  }

  async getRecordingAnalyticsDetails(
    meetingId: string,
    params?: PaginationParams & { from?: string; to?: string }
  ): Promise<PaginatedResponse<ZoomRecordingAnalyticsDetail>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
      from: params?.from,
      to: params?.to,
    });
    const response = await this.request<{
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      analytics_details: ZoomRecordingAnalyticsDetail[];
    }>(`/meetings/${encodeURIComponent(meetingId)}/recordings/analytics_details${query}`);
    return this.mapPaginatedResponse<ZoomRecordingAnalyticsDetail>(response, 'analytics_details');
  }

  async listRecordingRegistrants(
    meetingId: string,
    params?: PaginationParams & { status?: string }
  ): Promise<PaginatedResponse<ZoomRecordingRegistrant>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
      status: params?.status,
    });
    const response = await this.request<{
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      registrants: ZoomRecordingRegistrant[];
    }>(`/meetings/${encodeURIComponent(meetingId)}/recordings/registrants${query}`);
    return this.mapPaginatedResponse<ZoomRecordingRegistrant>(response, 'registrants');
  }

  async addRecordingRegistrant(
    meetingId: string,
    input: ZoomRecordingRegistrantCreateInput
  ): Promise<{ id: string; registrant_id: string }> {
    return this.request<{ id: string; registrant_id: string }>(
      `/meetings/${encodeURIComponent(meetingId)}/recordings/registrants`,
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    );
  }

  // ===========================================================================
  // Webinar Q&A
  // ===========================================================================

  async getWebinarQA(webinarId: string): Promise<ZoomWebinarQA> {
    return this.request<ZoomWebinarQA>(
      `/report/webinars/${encodeURIComponent(webinarId)}/qa`
    );
  }

  // ===========================================================================
  // Tasks
  // ===========================================================================

  async listTasks(params?: PaginationParams): Promise<PaginatedResponse<ZoomTask>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
    });
    const response = await this.request<{
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      tasks: ZoomTask[];
    }>(`/tasks${query}`);
    return this.mapPaginatedResponse<ZoomTask>(response, 'tasks');
  }

  async getTask(taskId: string): Promise<ZoomTask> {
    return this.request<ZoomTask>(`/tasks/${encodeURIComponent(taskId)}`);
  }

  async createTask(input: ZoomTaskCreateInput): Promise<ZoomTask> {
    return this.request<ZoomTask>('/tasks', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateTask(taskId: string, input: Partial<ZoomTaskCreateInput>): Promise<void> {
    await this.request<void>(`/tasks/${encodeURIComponent(taskId)}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.request<void>(`/tasks/${encodeURIComponent(taskId)}`, {
      method: 'DELETE',
    });
  }

  // ===========================================================================
  // Task Assignees
  // ===========================================================================

  async listTaskAssignees(taskId: string): Promise<{ assignees: ZoomTaskAssignee[] }> {
    return this.request<{ assignees: ZoomTaskAssignee[] }>(
      `/tasks/${encodeURIComponent(taskId)}/assignees`
    );
  }

  async addTaskAssignee(taskId: string, userId: string): Promise<void> {
    await this.request<void>(`/tasks/${encodeURIComponent(taskId)}/assignees`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  async removeTaskAssignee(taskId: string, userId: string): Promise<void> {
    await this.request<void>(
      `/tasks/${encodeURIComponent(taskId)}/assignees/${encodeURIComponent(userId)}`,
      {
        method: 'DELETE',
      }
    );
  }

  // ===========================================================================
  // Task Comments
  // ===========================================================================

  async listTaskComments(taskId: string): Promise<{ comments: ZoomTaskComment[] }> {
    return this.request<{ comments: ZoomTaskComment[] }>(
      `/tasks/${encodeURIComponent(taskId)}/comments`
    );
  }

  async addTaskComment(taskId: string, content: string): Promise<ZoomTaskComment> {
    return this.request<ZoomTaskComment>(
      `/tasks/${encodeURIComponent(taskId)}/comments`,
      {
        method: 'POST',
        body: JSON.stringify({ content }),
      }
    );
  }

  async deleteTaskComment(taskId: string, commentId: string): Promise<void> {
    await this.request<void>(
      `/tasks/${encodeURIComponent(taskId)}/comments/${encodeURIComponent(commentId)}`,
      {
        method: 'DELETE',
      }
    );
  }

  // ===========================================================================
  // Task Collaborators
  // ===========================================================================

  async listTaskCollaborators(taskId: string): Promise<{ collaborators: ZoomTaskCollaborator[] }> {
    return this.request<{ collaborators: ZoomTaskCollaborator[] }>(
      `/tasks/${encodeURIComponent(taskId)}/collaborators`
    );
  }

  async addTaskCollaborator(taskId: string, userId: string): Promise<void> {
    await this.request<void>(`/tasks/${encodeURIComponent(taskId)}/collaborators`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  async removeTaskCollaborator(taskId: string, userId: string): Promise<void> {
    await this.request<void>(
      `/tasks/${encodeURIComponent(taskId)}/collaborators/${encodeURIComponent(userId)}`,
      {
        method: 'DELETE',
      }
    );
  }

  // ===========================================================================
  // IM Chat Sessions
  // ===========================================================================

  async listIMChatSessions(
    params?: PaginationParams & { from?: string; to?: string }
  ): Promise<PaginatedResponse<ZoomIMChatSession>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
      from: params?.from,
      to: params?.to,
    });
    const response = await this.request<{
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      sessions: ZoomIMChatSession[];
    }>(`/im/chat/sessions${query}`);
    return this.mapPaginatedResponse<ZoomIMChatSession>(response, 'sessions');
  }

  async getIMChatMessages(
    sessionId: string,
    params?: PaginationParams & { from?: string; to?: string }
  ): Promise<PaginatedResponse<ZoomIMChatMessage>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
      from: params?.from,
      to: params?.to,
    });
    const response = await this.request<{
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      messages: ZoomIMChatMessage[];
    }>(`/im/chat/sessions/${encodeURIComponent(sessionId)}${query}`);
    return this.mapPaginatedResponse<ZoomIMChatMessage>(response, 'messages');
  }

  // ===========================================================================
  // Dashboard Metrics (CRC, IM, Zoom Rooms)
  // ===========================================================================

  async getCRCMetrics(params: { from: string; to: string }): Promise<ZoomCRCMetrics> {
    const query = this.buildQueryString(params);
    return this.request<ZoomCRCMetrics>(`/metrics/crc${query}`);
  }

  async getIMMetrics(params: { from: string; to: string }): Promise<ZoomIMMetrics> {
    const query = this.buildQueryString(params);
    return this.request<ZoomIMMetrics>(`/metrics/im${query}`);
  }

  async listZoomRoomMetrics(
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomRoomMetrics>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
    });
    const response = await this.request<{
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      zoom_rooms: ZoomRoomMetrics[];
    }>(`/metrics/zoomrooms${query}`);
    return this.mapPaginatedResponse<ZoomRoomMetrics>(response, 'zoom_rooms');
  }

  async getZoomRoomMetrics(
    roomId: string,
    params: { from: string; to: string }
  ): Promise<ZoomRoomMetrics> {
    const query = this.buildQueryString(params);
    return this.request<ZoomRoomMetrics>(
      `/metrics/zoomrooms/${encodeURIComponent(roomId)}${query}`
    );
  }

  // ===========================================================================
  // QoS Metrics
  // ===========================================================================

  async getMeetingParticipantQoS(
    meetingId: string,
    participantId: string
  ): Promise<ZoomParticipantQoS> {
    const encodedMeetingId =
      meetingId.includes('/') || meetingId.includes('//')
        ? encodeURIComponent(encodeURIComponent(meetingId))
        : encodeURIComponent(meetingId);
    return this.request<ZoomParticipantQoS>(
      `/metrics/meetings/${encodedMeetingId}/participants/${encodeURIComponent(participantId)}/qos`
    );
  }

  async listMeetingParticipantsQoS(
    meetingId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomParticipantQoS>> {
    const encodedMeetingId =
      meetingId.includes('/') || meetingId.includes('//')
        ? encodeURIComponent(encodeURIComponent(meetingId))
        : encodeURIComponent(meetingId);
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
    });
    const response = await this.request<{
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      participants: ZoomParticipantQoS[];
    }>(`/metrics/meetings/${encodedMeetingId}/participants/qos${query}`);
    return this.mapPaginatedResponse<ZoomParticipantQoS>(response, 'participants');
  }

  async getMeetingParticipantsSharing(
    meetingId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomSharingDetail>> {
    const encodedMeetingId =
      meetingId.includes('/') || meetingId.includes('//')
        ? encodeURIComponent(encodeURIComponent(meetingId))
        : encodeURIComponent(meetingId);
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
    });
    const response = await this.request<{
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      participants: ZoomSharingDetail[];
    }>(`/metrics/meetings/${encodedMeetingId}/participants/sharing${query}`);
    return this.mapPaginatedResponse<ZoomSharingDetail>(response, 'participants');
  }

  async getWebinarParticipantQoS(
    webinarId: string,
    participantId: string
  ): Promise<ZoomParticipantQoS> {
    return this.request<ZoomParticipantQoS>(
      `/metrics/webinars/${encodeURIComponent(webinarId)}/participants/${encodeURIComponent(participantId)}/qos`
    );
  }

  async listWebinarParticipantsQoS(
    webinarId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomParticipantQoS>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
    });
    const response = await this.request<{
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      participants: ZoomParticipantQoS[];
    }>(`/metrics/webinars/${encodeURIComponent(webinarId)}/participants/qos${query}`);
    return this.mapPaginatedResponse<ZoomParticipantQoS>(response, 'participants');
  }

  async getWebinarParticipantsSharing(
    webinarId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomSharingDetail>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
    });
    const response = await this.request<{
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      participants: ZoomSharingDetail[];
    }>(`/metrics/webinars/${encodeURIComponent(webinarId)}/participants/sharing${query}`);
    return this.mapPaginatedResponse<ZoomSharingDetail>(response, 'participants');
  }

  // ===========================================================================
  // Additional Reports
  // ===========================================================================

  async getCloudRecordingReport(
    params: { from: string; to: string }
  ): Promise<ZoomCloudRecordingReport> {
    const query = this.buildQueryString(params);
    return this.request<ZoomCloudRecordingReport>(`/report/cloud_recording${query}`);
  }

  async getTelephoneReport(
    params: PaginationParams & { from: string; to: string; type?: string }
  ): Promise<ZoomTelephoneReport> {
    const query = this.buildQueryString({
      page_size: params.page_size || 30,
      next_page_token: params.next_page_token,
      from: params.from,
      to: params.to,
      type: params.type,
    });
    return this.request<ZoomTelephoneReport>(`/report/telephone${query}`);
  }

  async getUserActivityReport(
    params: PaginationParams & { from: string; to: string }
  ): Promise<ZoomUserActivityReport> {
    const query = this.buildQueryString({
      page_size: params.page_size || 30,
      page_number: params.page_number,
      from: params.from,
      to: params.to,
    });
    return this.request<ZoomUserActivityReport>(`/report/users${query}`);
  }

  async getUserMeetingsReport(
    userId: string,
    params: PaginationParams & { from: string; to: string; type?: string }
  ): Promise<PaginatedResponse<ZoomMeetingReport>> {
    const query = this.buildQueryString({
      page_size: params.page_size || 30,
      next_page_token: params.next_page_token,
      from: params.from,
      to: params.to,
      type: params.type,
    });
    const response = await this.request<{
      page_count?: number;
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      meetings: ZoomMeetingReport[];
    }>(`/report/users/${encodeURIComponent(userId)}/meetings${query}`);
    return this.mapPaginatedResponse<ZoomMeetingReport>(response, 'meetings');
  }

  async getMeetingDetailsReport(meetingId: string): Promise<ZoomMeetingReport> {
    const encodedId =
      meetingId.includes('/') || meetingId.includes('//')
        ? encodeURIComponent(encodeURIComponent(meetingId))
        : encodeURIComponent(meetingId);
    return this.request<ZoomMeetingReport>(`/report/meetings/${encodedId}`);
  }

  async getMeetingPollReport(meetingId: string): Promise<ZoomMeetingPollReport> {
    const encodedId =
      meetingId.includes('/') || meetingId.includes('//')
        ? encodeURIComponent(encodeURIComponent(meetingId))
        : encodeURIComponent(meetingId);
    return this.request<ZoomMeetingPollReport>(`/report/meetings/${encodedId}/polls`);
  }

  async getWebinarPollReport(webinarId: string): Promise<ZoomMeetingPollReport> {
    return this.request<ZoomMeetingPollReport>(
      `/report/webinars/${encodeURIComponent(webinarId)}/polls`
    );
  }

  // ===========================================================================
  // Past Webinar Instances
  // ===========================================================================

  async getPastWebinarInstances(
    webinarId: string
  ): Promise<{ webinars: Array<{ uuid: string; start_time: string }> }> {
    return this.request<{ webinars: Array<{ uuid: string; start_time: string }> }>(
      `/past_webinars/${encodeURIComponent(webinarId)}/instances`
    );
  }

  // ===========================================================================
  // Recording Settings
  // ===========================================================================

  async getRecordingSettings(meetingId: string): Promise<ZoomRecordingSettings> {
    const encodedId =
      meetingId.includes('/') || meetingId.includes('//')
        ? encodeURIComponent(encodeURIComponent(meetingId))
        : encodeURIComponent(meetingId);
    return this.request<ZoomRecordingSettings>(
      `/meetings/${encodedId}/recordings/settings`
    );
  }

  async updateRecordingSettings(
    meetingId: string,
    settings: ZoomRecordingSettingsUpdate
  ): Promise<void> {
    const encodedId =
      meetingId.includes('/') || meetingId.includes('//')
        ? encodeURIComponent(encodeURIComponent(meetingId))
        : encodeURIComponent(meetingId);
    await this.request<void>(`/meetings/${encodedId}/recordings/settings`, {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  }

  // ===========================================================================
  // User Picture
  // ===========================================================================

  async uploadUserPicture(userId: string, picUrl: string): Promise<void> {
    await this.request<void>(`/users/${encodeURIComponent(userId)}/picture`, {
      method: 'POST',
      body: JSON.stringify({ pic_file: picUrl }),
    });
  }

  async deleteUserPicture(userId: string): Promise<void> {
    await this.request<void>(`/users/${encodeURIComponent(userId)}/picture`, {
      method: 'DELETE',
    });
  }

  // ===========================================================================
  // Webhooks
  // ===========================================================================

  async listWebhooks(): Promise<{ webhooks: ZoomWebhook[] }> {
    return this.request<{ webhooks: ZoomWebhook[] }>('/webhooks');
  }

  async getWebhook(webhookId: string): Promise<ZoomWebhook> {
    return this.request<ZoomWebhook>(`/webhooks/${encodeURIComponent(webhookId)}`);
  }

  async createWebhook(input: ZoomWebhookCreateInput): Promise<ZoomWebhook> {
    return this.request<ZoomWebhook>('/webhooks', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateWebhook(webhookId: string, input: Partial<ZoomWebhookCreateInput>): Promise<void> {
    await this.request<void>(`/webhooks/${encodeURIComponent(webhookId)}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    await this.request<void>(`/webhooks/${encodeURIComponent(webhookId)}`, {
      method: 'DELETE',
    });
  }

  async getWebhookOptions(): Promise<ZoomWebhookOptions> {
    return this.request<ZoomWebhookOptions>('/webhooks/options');
  }

  async updateWebhookOptions(options: ZoomWebhookOptions): Promise<void> {
    await this.request<void>('/webhooks/options', {
      method: 'PATCH',
      body: JSON.stringify(options),
    });
  }

  // ===========================================================================
  // Account Managed Domains & Options
  // ===========================================================================

  async getAccountManagedDomains(
    accountId: string
  ): Promise<{ domains: Array<{ domain: string }> }> {
    return this.request<{ domains: Array<{ domain: string }> }>(
      `/accounts/${encodeURIComponent(accountId)}/managed_domains`
    );
  }

  async updateAccountOptions(
    accountId: string,
    options: Record<string, unknown>
  ): Promise<void> {
    await this.request<void>(
      `/accounts/${encodeURIComponent(accountId)}/options`,
      {
        method: 'PATCH',
        body: JSON.stringify(options),
      }
    );
  }

  // ===========================================================================
  // Zoom Rooms
  // ===========================================================================

  async listRooms(
    params?: PaginationParams & { location_id?: string }
  ): Promise<PaginatedResponse<ZoomRoom>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
      location_id: params?.location_id,
    });
    const response = await this.request<{
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      rooms: ZoomRoom[];
    }>(`/rooms${query}`);
    return this.mapPaginatedResponse<ZoomRoom>(response, 'rooms');
  }

  async getRoom(roomId: string): Promise<ZoomRoom> {
    return this.request<ZoomRoom>(`/rooms/${encodeURIComponent(roomId)}`);
  }

  async createRoom(input: ZoomRoomCreateInput): Promise<ZoomRoom> {
    return this.request<ZoomRoom>('/rooms', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateRoom(roomId: string, input: Partial<ZoomRoomCreateInput>): Promise<void> {
    await this.request<void>(`/rooms/${encodeURIComponent(roomId)}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteRoom(roomId: string): Promise<void> {
    await this.request<void>(`/rooms/${encodeURIComponent(roomId)}`, {
      method: 'DELETE',
    });
  }

  // ===========================================================================
  // Zoom Room Locations
  // ===========================================================================

  async listRoomLocations(
    params?: PaginationParams
  ): Promise<PaginatedResponse<ZoomRoomLocation>> {
    const query = this.buildQueryString({
      page_size: params?.page_size || 30,
      next_page_token: params?.next_page_token,
    });
    const response = await this.request<{
      page_size?: number;
      total_records?: number;
      next_page_token?: string;
      locations: ZoomRoomLocation[];
    }>(`/rooms/locations${query}`);
    return this.mapPaginatedResponse<ZoomRoomLocation>(response, 'locations');
  }

  async getRoomLocation(locationId: string): Promise<ZoomRoomLocation> {
    return this.request<ZoomRoomLocation>(
      `/rooms/locations/${encodeURIComponent(locationId)}`
    );
  }

  async createRoomLocation(input: ZoomRoomLocationCreateInput): Promise<ZoomRoomLocation> {
    return this.request<ZoomRoomLocation>('/rooms/locations', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateRoomLocation(
    locationId: string,
    input: Partial<ZoomRoomLocationCreateInput>
  ): Promise<void> {
    await this.request<void>(
      `/rooms/locations/${encodeURIComponent(locationId)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(input),
      }
    );
  }

  async deleteRoomLocation(locationId: string): Promise<void> {
    await this.request<void>(
      `/rooms/locations/${encodeURIComponent(locationId)}`,
      {
        method: 'DELETE',
      }
    );
  }

  // ===========================================================================
  // Zoom Room Devices
  // ===========================================================================

  async listRoomDevices(roomId: string): Promise<{ devices: ZoomRoomDevice[] }> {
    return this.request<{ devices: ZoomRoomDevice[] }>(
      `/rooms/${encodeURIComponent(roomId)}/devices`
    );
  }

  // ===========================================================================
  // Zoom Room Settings
  // ===========================================================================

  async getRoomSettings(roomId: string): Promise<ZoomRoomSettings> {
    return this.request<ZoomRoomSettings>(
      `/rooms/${encodeURIComponent(roomId)}/settings`
    );
  }

  async updateRoomSettings(
    roomId: string,
    settings: Partial<ZoomRoomSettings>
  ): Promise<void> {
    await this.request<void>(
      `/rooms/${encodeURIComponent(roomId)}/settings`,
      {
        method: 'PATCH',
        body: JSON.stringify(settings),
      }
    );
  }
}

// =============================================================================
// Factory Function
// =============================================================================

/**
 * Create a Zoom client instance with tenant-specific credentials.
 *
 * MULTI-TENANT: Each request provides its own credentials via headers,
 * allowing a single server deployment to serve multiple tenants.
 *
 * @param credentials - Tenant credentials parsed from request headers
 */
export function createZoomClient(credentials: TenantCredentials): ZoomClient {
  return new ZoomClientImpl(credentials);
}
