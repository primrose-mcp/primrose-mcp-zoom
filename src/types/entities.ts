/**
 * Zoom Entity Types
 *
 * Standard data structures for Zoom API entities.
 */

// =============================================================================
// Pagination
// =============================================================================

export interface PaginationParams {
  /** Number of items to return (max 300 for most endpoints) */
  page_size?: number;
  /** Page number for paginated results */
  page_number?: number;
  /** Next page token for cursor-based pagination */
  next_page_token?: string;
}

export interface PaginatedResponse<T> {
  /** Array of items */
  items: T[];
  /** Number of items in this response */
  count: number;
  /** Total count (if available) */
  total?: number;
  /** Total records */
  total_records?: number;
  /** Whether more items are available */
  hasMore: boolean;
  /** Token for next page */
  next_page_token?: string;
  /** Page count */
  page_count?: number;
  /** Current page number */
  page_number?: number;
  /** Page size */
  page_size?: number;
}

// =============================================================================
// User
// =============================================================================

export interface ZoomUser {
  id: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  email: string;
  type: ZoomUserType;
  role_name?: string;
  role_id?: string;
  pmi?: number;
  use_pmi?: boolean;
  personal_meeting_url?: string;
  timezone?: string;
  verified?: number;
  dept?: string;
  created_at?: string;
  last_login_time?: string;
  last_client_version?: string;
  pic_url?: string;
  host_key?: string;
  jid?: string;
  group_ids?: string[];
  im_group_ids?: string[];
  account_id?: string;
  language?: string;
  phone_country?: string;
  phone_number?: string;
  status?: ZoomUserStatus;
  job_title?: string;
  location?: string;
  login_type?: number;
  company?: string;
  account_number?: number;
  manager?: string;
  custom_attributes?: Array<{ key: string; name: string; value: string }>;
  plan_united_type?: string;
}

export type ZoomUserType = 1 | 2 | 3 | 99; // 1=Basic, 2=Licensed, 3=On-prem, 99=None
export type ZoomUserStatus = 'pending' | 'active' | 'inactive';

export interface ZoomUserCreateInput {
  action: 'create' | 'autoCreate' | 'custCreate' | 'ssoCreate';
  user_info: {
    email: string;
    type: ZoomUserType;
    first_name?: string;
    last_name?: string;
    display_name?: string;
    password?: string;
    feature?: {
      zoom_phone?: boolean;
      zoom_one_type?: number;
    };
  };
}

export interface ZoomUserUpdateInput {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  type?: ZoomUserType;
  dept?: string;
  job_title?: string;
  company?: string;
  location?: string;
  phone_number?: string;
  manager?: string;
  pmi?: number;
  use_pmi?: boolean;
  timezone?: string;
  language?: string;
  vanity_name?: string;
  host_key?: string;
}

// =============================================================================
// Meeting
// =============================================================================

export interface ZoomMeeting {
  id: number;
  uuid?: string;
  host_id?: string;
  host_email?: string;
  topic: string;
  type: ZoomMeetingType;
  status?: ZoomMeetingStatus;
  start_time?: string;
  duration?: number;
  timezone?: string;
  agenda?: string;
  created_at?: string;
  start_url?: string;
  join_url?: string;
  password?: string;
  encrypted_password?: string;
  h323_password?: string;
  pstn_password?: string;
  pmi?: number;
  tracking_fields?: Array<{ field: string; value: string; visible: boolean }>;
  occurrences?: ZoomMeetingOccurrence[];
  settings?: ZoomMeetingSettings;
  recurrence?: ZoomMeetingRecurrence;
  pre_schedule?: boolean;
}

export type ZoomMeetingType = 1 | 2 | 3 | 8;
// 1 = Instant meeting
// 2 = Scheduled meeting
// 3 = Recurring meeting with no fixed time
// 8 = Recurring meeting with fixed time

export type ZoomMeetingStatus = 'waiting' | 'started' | 'finished';

export interface ZoomMeetingOccurrence {
  occurrence_id: string;
  start_time: string;
  duration: number;
  status: string;
}

export interface ZoomMeetingSettings {
  host_video?: boolean;
  participant_video?: boolean;
  cn_meeting?: boolean;
  in_meeting?: boolean;
  join_before_host?: boolean;
  jbh_time?: number;
  mute_upon_entry?: boolean;
  watermark?: boolean;
  use_pmi?: boolean;
  approval_type?: 0 | 1 | 2;
  registration_type?: 1 | 2 | 3;
  audio?: 'both' | 'telephony' | 'voip' | 'thirdParty';
  auto_recording?: 'local' | 'cloud' | 'none';
  enforce_login?: boolean;
  enforce_login_domains?: string;
  alternative_hosts?: string;
  alternative_hosts_email_notification?: boolean;
  close_registration?: boolean;
  show_share_button?: boolean;
  allow_multiple_devices?: boolean;
  registrants_confirmation_email?: boolean;
  waiting_room?: boolean;
  request_permission_to_unmute_participants?: boolean;
  registrants_email_notification?: boolean;
  meeting_authentication?: boolean;
  authentication_option?: string;
  authentication_domains?: string;
  authentication_exception?: Array<{ email: string; name: string }>;
  encryption_type?: 'enhanced_encryption' | 'e2ee';
  breakout_room?: {
    enable?: boolean;
    rooms?: Array<{ name: string; participants: string[] }>;
  };
  language_interpretation?: {
    enable?: boolean;
    interpreters?: Array<{ email: string; languages: string }>;
  };
  focus_mode?: boolean;
  private_meeting?: boolean;
  email_notification?: boolean;
  host_save_video_order?: boolean;
  sign_language_interpretation?: {
    enable?: boolean;
  };
  continuous_meeting_chat?: {
    enable?: boolean;
    auto_add_invited_external_users?: boolean;
  };
}

export interface ZoomMeetingRecurrence {
  type: 1 | 2 | 3; // 1=Daily, 2=Weekly, 3=Monthly
  repeat_interval?: number;
  weekly_days?: string;
  monthly_day?: number;
  monthly_week?: number;
  monthly_week_day?: number;
  end_times?: number;
  end_date_time?: string;
}

export interface ZoomMeetingCreateInput {
  topic: string;
  type?: ZoomMeetingType;
  start_time?: string;
  duration?: number;
  timezone?: string;
  password?: string;
  agenda?: string;
  tracking_fields?: Array<{ field: string; value: string }>;
  recurrence?: ZoomMeetingRecurrence;
  settings?: Partial<ZoomMeetingSettings>;
  template_id?: string;
  schedule_for?: string;
  pre_schedule?: boolean;
  default_password?: boolean;
}

export interface ZoomMeetingUpdateInput {
  topic?: string;
  type?: ZoomMeetingType;
  start_time?: string;
  duration?: number;
  timezone?: string;
  password?: string;
  agenda?: string;
  tracking_fields?: Array<{ field: string; value: string }>;
  recurrence?: ZoomMeetingRecurrence;
  settings?: Partial<ZoomMeetingSettings>;
  schedule_for?: string;
}

// =============================================================================
// Meeting Registrant
// =============================================================================

export interface ZoomMeetingRegistrant {
  id?: string;
  email: string;
  first_name: string;
  last_name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  industry?: string;
  org?: string;
  job_title?: string;
  purchasing_time_frame?: string;
  role_in_purchase_process?: string;
  no_of_employees?: string;
  comments?: string;
  custom_questions?: Array<{ title: string; value: string }>;
  status?: 'approved' | 'denied' | 'pending';
  create_time?: string;
  join_url?: string;
}

export interface ZoomMeetingRegistrantCreateInput {
  email: string;
  first_name: string;
  last_name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  industry?: string;
  org?: string;
  job_title?: string;
  purchasing_time_frame?: string;
  role_in_purchase_process?: string;
  no_of_employees?: string;
  comments?: string;
  custom_questions?: Array<{ title: string; value: string }>;
  language?: string;
  auto_approve?: boolean;
}

// =============================================================================
// Past Meeting / Participant
// =============================================================================

export interface ZoomPastMeeting {
  uuid: string;
  id: number;
  host_id: string;
  type: ZoomMeetingType;
  topic: string;
  user_name?: string;
  user_email?: string;
  start_time: string;
  end_time: string;
  duration: number;
  total_minutes: number;
  participants_count: number;
}

export interface ZoomMeetingParticipant {
  id?: string;
  user_id?: string;
  name?: string;
  user_name?: string;
  user_email?: string;
  device?: string;
  ip_address?: string;
  location?: string;
  network_type?: string;
  microphone?: string;
  speaker?: string;
  camera?: string;
  data_center?: string;
  connection_type?: string;
  join_time?: string;
  leave_time?: string;
  share_application?: boolean;
  share_desktop?: boolean;
  share_whiteboard?: boolean;
  recording?: boolean;
  status?: string;
  pc_name?: string;
  domain?: string;
  mac_addr?: string;
  harddisk_id?: string;
  version?: string;
  in_room_participants?: number;
  leave_reason?: string;
  sip_uri?: string;
  from_sip_uri?: string;
  role?: string;
  participant_user_id?: string;
  registrant_id?: string;
  bo_mtg_id?: string;
  customer_key?: string;
}

// =============================================================================
// Webinar
// =============================================================================

export interface ZoomWebinar {
  uuid?: string;
  id: number;
  host_id?: string;
  host_email?: string;
  topic: string;
  type: ZoomWebinarType;
  start_time?: string;
  duration?: number;
  timezone?: string;
  agenda?: string;
  created_at?: string;
  start_url?: string;
  join_url?: string;
  registration_url?: string;
  password?: string;
  settings?: ZoomWebinarSettings;
  recurrence?: ZoomMeetingRecurrence;
  occurrences?: ZoomMeetingOccurrence[];
  tracking_fields?: Array<{ field: string; value: string; visible: boolean }>;
  is_simulive?: boolean;
}

export type ZoomWebinarType = 5 | 6 | 9;
// 5 = Webinar
// 6 = Recurring webinar with no fixed time
// 9 = Recurring webinar with fixed time

export interface ZoomWebinarSettings {
  host_video?: boolean;
  panelists_video?: boolean;
  practice_session?: boolean;
  hd_video?: boolean;
  hd_video_for_attendees?: boolean;
  send_1080p_video_to_attendees?: boolean;
  approval_type?: 0 | 1 | 2;
  registration_type?: 1 | 2 | 3;
  audio?: 'both' | 'telephony' | 'voip' | 'thirdParty';
  auto_recording?: 'local' | 'cloud' | 'none';
  enforce_login?: boolean;
  enforce_login_domains?: string;
  alternative_hosts?: string;
  close_registration?: boolean;
  show_share_button?: boolean;
  allow_multiple_devices?: boolean;
  on_demand?: boolean;
  contact_name?: string;
  contact_email?: string;
  registrants_restrict_number?: number;
  post_webinar_survey?: boolean;
  survey_url?: string;
  registrants_email_notification?: boolean;
  registrants_confirmation_email?: boolean;
  meeting_authentication?: boolean;
  authentication_option?: string;
  authentication_domains?: string;
  question_and_answer?: {
    enable?: boolean;
    allow_anonymous_questions?: boolean;
    answer_questions?: string;
    attendees_can_comment?: boolean;
    attendees_can_upvote?: boolean;
  };
  attendees_and_panelists_reminder_email_notification?: {
    enable?: boolean;
    type?: number;
  };
  follow_up_attendees_email_notification?: {
    enable?: boolean;
    type?: number;
  };
  follow_up_absentees_email_notification?: {
    enable?: boolean;
    type?: number;
  };
  email_language?: string;
  panelists_invitation_email_notification?: boolean;
  language_interpretation?: {
    enable?: boolean;
    interpreters?: Array<{ email: string; languages: string }>;
  };
  sign_language_interpretation?: {
    enable?: boolean;
  };
}

export interface ZoomWebinarCreateInput {
  topic: string;
  type?: ZoomWebinarType;
  start_time?: string;
  duration?: number;
  timezone?: string;
  password?: string;
  agenda?: string;
  tracking_fields?: Array<{ field: string; value: string }>;
  recurrence?: ZoomMeetingRecurrence;
  settings?: Partial<ZoomWebinarSettings>;
  template_id?: string;
  schedule_for?: string;
  is_simulive?: boolean;
}

export interface ZoomWebinarUpdateInput {
  topic?: string;
  type?: ZoomWebinarType;
  start_time?: string;
  duration?: number;
  timezone?: string;
  password?: string;
  agenda?: string;
  tracking_fields?: Array<{ field: string; value: string }>;
  recurrence?: ZoomMeetingRecurrence;
  settings?: Partial<ZoomWebinarSettings>;
}

// =============================================================================
// Webinar Registrant
// =============================================================================

export interface ZoomWebinarRegistrant {
  id?: string;
  email: string;
  first_name: string;
  last_name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  industry?: string;
  org?: string;
  job_title?: string;
  purchasing_time_frame?: string;
  role_in_purchase_process?: string;
  no_of_employees?: string;
  comments?: string;
  custom_questions?: Array<{ title: string; value: string }>;
  status?: 'approved' | 'denied' | 'pending';
  create_time?: string;
  join_url?: string;
}

// =============================================================================
// Webinar Panelist
// =============================================================================

export interface ZoomWebinarPanelist {
  id?: string;
  email: string;
  name: string;
  join_url?: string;
  virtual_background_id?: string;
  name_tag_id?: string;
  name_tag_name?: string;
  name_tag_pronouns?: string;
  name_tag_description?: string;
}

// =============================================================================
// Cloud Recording
// =============================================================================

export interface ZoomCloudRecording {
  uuid: string;
  id: number;
  account_id?: string;
  host_id?: string;
  host_email?: string;
  topic?: string;
  type?: ZoomMeetingType;
  start_time?: string;
  timezone?: string;
  duration?: number;
  total_size?: number;
  recording_count?: number;
  share_url?: string;
  recording_files?: ZoomRecordingFile[];
  password?: string;
  recording_play_passcode?: string;
  participant_audio_files?: ZoomRecordingFile[];
  download_access_token?: string;
  on_prem?: boolean;
}

export interface ZoomRecordingFile {
  id?: string;
  meeting_id?: string;
  recording_start?: string;
  recording_end?: string;
  file_type?: string;
  file_extension?: string;
  file_size?: number;
  play_url?: string;
  download_url?: string;
  status?: string;
  recording_type?: string;
}

export interface ZoomRecordingSettings {
  share_recording?: 'publicly' | 'internally' | 'none';
  recording_authentication?: boolean;
  authentication_option?: string;
  authentication_domains?: string;
  viewer_download?: boolean;
  password?: string;
  on_demand?: boolean;
  approval_type?: 0 | 1 | 2;
  send_email_to_host?: boolean;
  show_social_share_buttons?: boolean;
}

// =============================================================================
// Reports
// =============================================================================

export interface ZoomMeetingReport {
  uuid?: string;
  id?: number;
  host_id?: string;
  type?: ZoomMeetingType;
  topic?: string;
  user_name?: string;
  user_email?: string;
  start_time?: string;
  end_time?: string;
  duration?: number;
  total_minutes?: number;
  participants_count?: number;
  tracking_fields?: Array<{ field: string; value: string }>;
  dept?: string;
}

export interface ZoomDailyReport {
  year?: number;
  month?: number;
  day?: number;
  date?: string;
  new_users?: number;
  meetings?: number;
  participants?: number;
  meeting_minutes?: number;
}

export interface ZoomWebinarReport {
  uuid?: string;
  id?: number;
  host_id?: string;
  type?: ZoomWebinarType;
  topic?: string;
  user_name?: string;
  user_email?: string;
  start_time?: string;
  end_time?: string;
  duration?: number;
  total_minutes?: number;
  participants_count?: number;
  tracking_fields?: Array<{ field: string; value: string }>;
  dept?: string;
}

// =============================================================================
// Dashboard
// =============================================================================

export interface ZoomDashboardMeeting {
  uuid: string;
  id: number;
  topic: string;
  host: string;
  email?: string;
  user_type?: string;
  start_time: string;
  end_time?: string;
  duration?: string;
  participants?: number;
  has_pstn?: boolean;
  has_voip?: boolean;
  has_3rd_party_audio?: boolean;
  has_video?: boolean;
  has_screen_share?: boolean;
  has_recording?: boolean;
  has_sip?: boolean;
  has_archiving?: boolean;
  in_room_participants?: number;
}

export interface ZoomDashboardWebinar {
  uuid: string;
  id: number;
  topic: string;
  host: string;
  email?: string;
  user_type?: string;
  start_time: string;
  end_time?: string;
  duration?: string;
  participants?: number;
  has_pstn?: boolean;
  has_voip?: boolean;
  has_3rd_party_audio?: boolean;
  has_video?: boolean;
  has_screen_share?: boolean;
  has_recording?: boolean;
  has_sip?: boolean;
  dept?: string;
}

export interface ZoomQualityOfService {
  date_time?: string;
  audio_input?: ZoomQoSMetrics;
  audio_output?: ZoomQoSMetrics;
  video_input?: ZoomQoSMetrics;
  video_output?: ZoomQoSMetrics;
  as_input?: ZoomQoSMetrics;
  as_output?: ZoomQoSMetrics;
  cpu_usage?: {
    zoom_min_cpu_usage?: string;
    zoom_avg_cpu_usage?: string;
    zoom_max_cpu_usage?: string;
    system_max_cpu_usage?: string;
  };
}

export interface ZoomQoSMetrics {
  bitrate?: string;
  latency?: string;
  jitter?: string;
  avg_loss?: string;
  max_loss?: string;
  resolution?: string;
  frame_rate?: string;
}

// =============================================================================
// Groups
// =============================================================================

export interface ZoomGroup {
  id: string;
  name: string;
  total_members?: number;
}

export interface ZoomGroupCreateInput {
  name: string;
}

export interface ZoomGroupMember {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  type?: ZoomUserType;
}

// =============================================================================
// Roles
// =============================================================================

export interface ZoomRole {
  id: string;
  name: string;
  description?: string;
  total_members?: number;
  privileges?: string[];
  sub_account_privileges?: string[];
}

export interface ZoomRoleCreateInput {
  name: string;
  description?: string;
  privileges?: string[];
}

export interface ZoomRoleMember {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  type?: ZoomUserType;
  department?: string;
}

// =============================================================================
// Chat (Team Chat)
// =============================================================================

export interface ZoomChatChannel {
  id: string;
  jid?: string;
  name: string;
  type: ZoomChatChannelType;
  channel_url?: string;
}

export type ZoomChatChannelType = 1 | 2 | 3 | 4 | 5;
// 1 = Instant Message (IM)
// 2 = Group
// 3 = Public Channel
// 4 = Private Channel
// 5 = Private Channel with External Members

export interface ZoomChatChannelCreateInput {
  name: string;
  type?: ZoomChatChannelType;
  members?: Array<{ email: string }>;
}

export interface ZoomChatMessage {
  id: string;
  message: string;
  sender?: string;
  date_time?: string;
  timestamp?: number;
  reply_main_message_id?: string;
  reply_main_message_timestamp?: number;
  files?: ZoomChatFile[];
  reactions?: ZoomChatReaction[];
  rich_text?: ZoomChatRichText[];
  at_items?: ZoomChatAtItem[];
  bot_message?: {
    content?: {
      head?: { text?: string };
      body?: Array<{ type?: string; text?: string }>;
    };
    is_markdown_support?: boolean;
  };
}

export interface ZoomChatFile {
  id: string;
  name?: string;
  size?: number;
  download_url?: string;
  file_type?: string;
}

export interface ZoomChatReaction {
  emoji: string;
  total_count?: number;
}

export interface ZoomChatRichText {
  start_position: number;
  end_position: number;
  format_type: string;
  format_attr?: string;
}

export interface ZoomChatAtItem {
  start_position: number;
  end_position: number;
  at_type: number;
  at_contact?: string;
}

export interface ZoomChatMessageSendInput {
  message: string;
  to_channel?: string;
  to_contact?: string;
  reply_main_message_id?: string;
  at_items?: Array<{
    at_type: number;
    at_contact?: string;
    start_position: number;
    end_position: number;
  }>;
  rich_text?: Array<{
    start_position: number;
    end_position: number;
    format_type: string;
    format_attr?: string;
  }>;
  file_ids?: string[];
  interactive_cards?: unknown;
}

// =============================================================================
// Accounts & Billing
// =============================================================================

export interface ZoomAccount {
  id: string;
  owner_id?: string;
  owner_email?: string;
  account_name?: string;
  account_number?: number;
  created_at?: string;
  options?: {
    share_rc?: boolean;
    room_connectors?: string;
    share_mc?: boolean;
    meeting_connectors?: string;
    pay_mode?: string;
  };
}

export interface ZoomAccountCreateInput {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  options?: {
    share_rc?: boolean;
    room_connectors?: string;
    share_mc?: boolean;
    meeting_connectors?: string;
    pay_mode?: string;
  };
}

export interface ZoomAccountSettings {
  schedule_meeting?: {
    host_video?: boolean;
    participant_video?: boolean;
    audio_type?: string;
    join_before_host?: boolean;
    use_pmi_for_scheduled_meetings?: boolean;
    use_pmi_for_instant_meetings?: boolean;
    enforce_login?: boolean;
    enforce_login_domains?: string;
    not_store_meeting_topic?: boolean;
    force_pmi_jbh_password?: boolean;
    require_password_for_scheduling_new_meetings?: boolean;
    require_password_for_scheduled_meetings?: boolean;
    require_password_for_instant_meetings?: boolean;
    require_password_for_pmi_meetings?: string;
    meeting_password_requirement?: {
      length?: number;
      have_letter?: boolean;
      have_number?: boolean;
      have_special_character?: boolean;
      only_allow_numeric?: boolean;
    };
    personal_meeting?: boolean;
  };
  in_meeting?: Record<string, unknown>;
  email_notification?: Record<string, unknown>;
  security?: Record<string, unknown>;
  recording?: Record<string, unknown>;
  telephony?: Record<string, unknown>;
  integration?: Record<string, unknown>;
  feature?: Record<string, unknown>;
}

export interface ZoomBillingInfo {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  apt?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface ZoomPlanInfo {
  plan_base?: {
    type?: string;
    hosts?: number;
  };
  plan_zoom_rooms?: {
    type?: string;
    hosts?: number;
  };
  plan_room_connector?: {
    type?: string;
    hosts?: number;
  };
  plan_large_meeting?: Array<{
    type?: string;
    hosts?: number;
  }>;
  plan_webinar?: Array<{
    type?: string;
    hosts?: number;
  }>;
  plan_recording?: string;
  plan_audio?: {
    type?: string;
    tollfree_countries?: string;
    premium_countries?: string;
    callout_countries?: string;
    ddi_numbers?: number;
  };
}

export interface ZoomPlanSubscribeInput {
  contact?: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    address?: string;
    apt?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  plan_base: {
    type: string;
    hosts: number;
  };
  plan_zoom_rooms?: {
    type?: string;
    hosts?: number;
  };
  plan_room_connector?: {
    type?: string;
    hosts?: number;
  };
  plan_large_meeting?: Array<{
    type?: string;
    hosts?: number;
  }>;
  plan_webinar?: Array<{
    type?: string;
    hosts?: number;
  }>;
  plan_recording?: string;
  plan_audio?: {
    type?: string;
    tollfree_countries?: string;
    premium_countries?: string;
    callout_countries?: string;
    ddi_numbers?: number;
  };
}

export interface ZoomAddonInput {
  type: string;
  hosts?: number;
}

export interface ZoomBasePlanInput {
  type: string;
  hosts: number;
}

// =============================================================================
// H.323/SIP Devices
// =============================================================================

export interface ZoomDevice {
  id: string;
  name: string;
  ip: string;
  protocol: 'H.323' | 'SIP';
  encryption: 'auto' | 'yes' | 'no';
}

export interface ZoomDeviceCreateInput {
  name: string;
  ip: string;
  protocol: 'H.323' | 'SIP';
  encryption?: 'auto' | 'yes' | 'no';
}

// =============================================================================
// Tracking Fields
// =============================================================================

export interface ZoomTrackingField {
  id: string;
  field: string;
  recommended_values?: string[];
  required?: boolean;
  visible?: boolean;
}

export interface ZoomTrackingFieldCreateInput {
  field: string;
  recommended_values?: string[];
  required?: boolean;
  visible?: boolean;
}

// =============================================================================
// Meeting Polls
// =============================================================================

export interface ZoomMeetingPoll {
  id: string;
  title: string;
  anonymous?: boolean;
  poll_type?: number;
  status?: string;
  questions: ZoomPollQuestion[];
}

export interface ZoomPollQuestion {
  name: string;
  type: 'single' | 'multiple';
  answers?: string[];
  right_answers?: string[];
  answer_required?: boolean;
  prompts?: Array<{
    prompt_question: string;
    prompt_right_answers?: string[];
  }>;
  show_as_dropdown?: boolean;
  answer_min_character?: number;
  answer_max_character?: number;
  rating_min_value?: number;
  rating_max_value?: number;
  rating_min_label?: string;
  rating_max_label?: string;
}

export interface ZoomMeetingPollCreateInput {
  title: string;
  anonymous?: boolean;
  poll_type?: number;
  questions: ZoomPollQuestion[];
}

// =============================================================================
// TSP (Telephony Service Provider)
// =============================================================================

export interface ZoomTSP {
  tsp_provider?: string;
  dial_in_numbers?: ZoomTSPDialInNumber[];
  tsp_enabled?: boolean;
  enable?: boolean;
  dial_in_number_unrestricted?: boolean;
  tsp_bridge?: string;
}

export interface ZoomTSPDialInNumber {
  code?: string;
  number?: string;
  type?: string;
}

export interface ZoomUserTSP {
  conference_code?: string;
  leader_pin?: string;
  dial_in_numbers?: ZoomTSPDialInNumber[];
  tsp_bridge?: string;
}

export interface ZoomUserTSPInput {
  conference_code: string;
  leader_pin: string;
  dial_in_numbers?: Array<{
    code?: string;
    number?: string;
    type?: string;
  }>;
  tsp_bridge?: string;
}

// =============================================================================
// PAC (Personal Audio Conference)
// =============================================================================

export interface ZoomPAC {
  dedicated_dial_in_number?: ZoomPACDialInNumber[];
  global_dial_in_numbers?: ZoomPACDialInNumber[];
  listen_only_password?: string;
  participant_password?: string;
}

export interface ZoomPACDialInNumber {
  country?: string;
  country_name?: string;
  number?: string;
  display_number?: string;
}

// =============================================================================
// Contacts
// =============================================================================

export interface ZoomContact {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  presence_status?: 'Do_Not_Disturb' | 'Away' | 'Available' | 'Offline';
  phone_number?: string;
  sip_phone_number?: string;
  company?: string;
  dept?: string;
  job_title?: string;
  location?: string;
  im_group_id?: string;
  im_group_name?: string;
  direct_numbers?: string[];
  extension_number?: string;
}

export interface ZoomExternalContact {
  id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  company?: string;
  description?: string;
}

export interface ZoomExternalContactCreateInput {
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  company?: string;
  description?: string;
}

// =============================================================================
// IM Groups (Legacy)
// =============================================================================

export interface ZoomIMGroup {
  id: string;
  name: string;
  total_members?: number;
  search_by_account?: boolean;
  search_by_domain?: boolean;
  search_by_ma_account?: boolean;
  type?: 'normal' | 'shared' | 'restricted';
}

export interface ZoomIMGroupCreateInput {
  name: string;
  search_by_account?: boolean;
  search_by_domain?: boolean;
  search_by_ma_account?: boolean;
  type?: 'normal' | 'shared' | 'restricted';
}

// =============================================================================
// Common / Response Format
// =============================================================================

// =============================================================================
// User Assistants & Schedulers
// =============================================================================

export interface ZoomUserAssistant {
  id: string;
  email?: string;
}

export interface ZoomUserScheduler {
  id: string;
  email?: string;
}

// =============================================================================
// User Permissions
// =============================================================================

export interface ZoomUserPermissions {
  permissions?: string[];
}

// =============================================================================
// Webinar Polls
// =============================================================================

export interface ZoomWebinarPoll {
  id: string;
  title: string;
  anonymous?: boolean;
  poll_type?: number;
  status?: string;
  questions: ZoomPollQuestion[];
}

export interface ZoomWebinarPollCreateInput {
  title: string;
  anonymous?: boolean;
  poll_type?: number;
  questions: ZoomPollQuestion[];
}

// =============================================================================
// Past Webinars
// =============================================================================

export interface ZoomPastWebinar {
  uuid?: string;
  id?: number;
  host_id?: string;
  type?: number;
  topic?: string;
  start_time?: string;
  duration?: number;
  total_minutes?: number;
  participants_count?: number;
}

export interface ZoomWebinarAbsentee {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  city?: string;
  country?: string;
  zip?: string;
  state?: string;
  phone?: string;
  industry?: string;
  org?: string;
  job_title?: string;
  purchasing_time_frame?: string;
  role_in_purchase_process?: string;
  no_of_employees?: string;
  comments?: string;
  custom_questions?: Array<{
    title?: string;
    value?: string;
  }>;
  join_url?: string;
}

// =============================================================================
// Meeting & Webinar Templates
// =============================================================================

export interface ZoomMeetingTemplate {
  id: string;
  name: string;
  type?: number;
}

export interface ZoomWebinarTemplate {
  id: string;
  name: string;
  type?: number;
}

// =============================================================================
// Livestream Settings
// =============================================================================

export interface ZoomLivestreamSettings {
  stream_url?: string;
  stream_key?: string;
  page_url?: string;
  resolution?: string;
}

export interface ZoomLivestreamStatus {
  action?: 'start' | 'stop';
  settings?: {
    active_speaker_name?: boolean;
    display_name?: string;
  };
}

// =============================================================================
// Registrant Questions
// =============================================================================

export interface ZoomRegistrantQuestion {
  field_name: string;
  required?: boolean;
}

export interface ZoomRegistrantCustomQuestion {
  title: string;
  type: 'short' | 'single';
  required?: boolean;
  answers?: string[];
}

export interface ZoomRegistrantQuestions {
  questions?: ZoomRegistrantQuestion[];
  custom_questions?: ZoomRegistrantCustomQuestion[];
}

// =============================================================================
// Account Lock Settings
// =============================================================================

export interface ZoomAccountLockSettings {
  schedule_meeting?: {
    host_video?: boolean;
    participant_video?: boolean;
    audio_type?: boolean;
    join_before_host?: boolean;
    enforce_login?: boolean;
    not_store_meeting_topic?: boolean;
    force_pmi_jbh_password?: boolean;
    use_pmi_for_scheduled_meetings?: boolean;
    use_pmi_for_instant_meetings?: boolean;
    require_password_for_scheduling_new_meetings?: boolean;
    require_password_for_scheduled_meetings?: boolean;
    require_password_for_instant_meetings?: boolean;
    require_password_for_pmi_meetings?: boolean;
    meeting_password_requirement?: boolean;
    personal_meeting?: boolean;
  };
  in_meeting?: Record<string, boolean>;
  email_notification?: Record<string, boolean>;
  recording?: Record<string, boolean>;
  telephony?: Record<string, boolean>;
}

// =============================================================================
// Archiving
// =============================================================================

export interface ZoomArchivedFile {
  id?: string;
  uuid?: string;
  meeting_id?: number;
  host_id?: string;
  account_id?: string;
  topic?: string;
  start_time?: string;
  duration?: number;
  total_size?: number;
  file_count?: number;
  archive_files?: Array<{
    id?: string;
    file_type?: string;
    file_size?: number;
    download_url?: string;
    status?: string;
    recording_type?: string;
  }>;
  auto_delete?: boolean;
  complete_time?: string;
}

export interface ZoomArchiveStatistics {
  from?: string;
  to?: string;
  total_size?: number;
  file_count?: number;
  statistics_by_file_extension?: Array<{
    file_extension?: string;
    file_count?: number;
    file_size?: number;
  }>;
}

// =============================================================================
// Recording Analytics
// =============================================================================

export interface ZoomRecordingAnalyticsSummary {
  from?: string;
  to?: string;
  total_views?: number;
  total_downloads?: number;
  unique_views?: number;
  unique_downloads?: number;
}

export interface ZoomRecordingAnalyticsDetail {
  date?: string;
  views?: number;
  downloads?: number;
}

export interface ZoomRecordingRegistrant {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  industry?: string;
  org?: string;
  job_title?: string;
  questions?: Array<{
    title?: string;
    value?: string;
  }>;
  create_time?: string;
  status?: string;
}

export interface ZoomRecordingRegistrantCreateInput {
  email: string;
  first_name: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  industry?: string;
  org?: string;
  job_title?: string;
}

// =============================================================================
// Webinar Q&A
// =============================================================================

export interface ZoomWebinarQA {
  id?: number;
  uuid?: string;
  start_time?: string;
  questions?: ZoomWebinarQuestion[];
}

export interface ZoomWebinarQuestion {
  name?: string;
  email?: string;
  question_details?: Array<{
    question?: string;
    answer?: string;
  }>;
}

// =============================================================================
// Tasks API
// =============================================================================

export interface ZoomTask {
  id?: string;
  title?: string;
  description?: string;
  status?: 'not_started' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at?: string;
  updated_at?: string;
  creator_id?: string;
  project_id?: string;
}

export interface ZoomTaskCreateInput {
  title: string;
  description?: string;
  status?: 'not_started' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  project_id?: string;
}

export interface ZoomTaskAssignee {
  id?: string;
  user_id?: string;
  email?: string;
  name?: string;
}

export interface ZoomTaskComment {
  id?: string;
  content?: string;
  author_id?: string;
  created_at?: string;
}

export interface ZoomTaskCollaborator {
  id?: string;
  user_id?: string;
  email?: string;
  name?: string;
}

// =============================================================================
// IM Chat Sessions
// =============================================================================

export interface ZoomIMChatSession {
  session_id?: string;
  type?: string;
  name?: string;
  last_message_sent_time?: string;
}

export interface ZoomIMChatMessage {
  id?: string;
  message?: string;
  sender?: string;
  date_time?: string;
  timestamp?: number;
}

// =============================================================================
// Dashboard Metrics (CRC, IM, Zoom Rooms)
// =============================================================================

export interface ZoomCRCMetrics {
  from?: string;
  to?: string;
  crc_ports_usage?: Array<{
    date_time?: string;
    crc_ports_hour_usage?: Array<{
      hour?: string;
      max_usage?: number;
      total_usage?: number;
    }>;
  }>;
}

export interface ZoomIMMetrics {
  from?: string;
  to?: string;
  users_on_im?: number;
  users_on_presence?: number;
  group_messages?: number;
  one_on_one_messages?: number;
}

export interface ZoomRoomMetrics {
  id?: string;
  room_name?: string;
  email?: string;
  account_type?: string;
  status?: string;
  device_ip?: string;
  camera?: string;
  microphone?: string;
  speaker?: string;
  location?: string;
  health?: string;
  issues?: string[];
  live_meeting?: {
    uuid?: string;
    id?: number;
    topic?: string;
    host?: string;
    email?: string;
    start_time?: string;
    participants?: number;
  };
}

// =============================================================================
// QoS (Quality of Service) Metrics
// =============================================================================

export interface ZoomParticipantQoS {
  user_id?: string;
  user_name?: string;
  device?: string;
  ip_address?: string;
  location?: string;
  join_time?: string;
  leave_time?: string;
  pc_name?: string;
  domain?: string;
  mac_addr?: string;
  harddisk_id?: string;
  version?: string;
  user_qos?: ZoomQualityOfService[];
}

export interface ZoomSharingDetail {
  id?: string;
  user_id?: string;
  user_name?: string;
  details?: Array<{
    content?: string;
    start_time?: string;
    end_time?: string;
  }>;
}

// =============================================================================
// Reports (Additional)
// =============================================================================

export interface ZoomCloudRecordingReport {
  from?: string;
  to?: string;
  cloud_recording_storage?: Array<{
    date?: string;
    usage?: string;
    plan_usage?: string;
    free_usage?: string;
  }>;
}

export interface ZoomTelephoneReport {
  from?: string;
  to?: string;
  telephony_usage?: Array<{
    meeting_id?: number;
    phone_number?: string;
    host_name?: string;
    host_email?: string;
    dept?: string;
    start_time?: string;
    end_time?: string;
    duration?: number;
    total?: number;
    country_name?: string;
    meeting_type?: string;
    call_in_number?: string;
    call_type?: string;
  }>;
}

export interface ZoomUserActivityReport {
  from?: string;
  to?: string;
  page_count?: number;
  page_number?: number;
  page_size?: number;
  total_records?: number;
  users?: Array<{
    id?: string;
    email?: string;
    user_name?: string;
    type?: number;
    dept?: string;
    meetings?: number;
    participants?: number;
    meeting_minutes?: number;
    last_client_version?: string;
    last_login_time?: string;
  }>;
}

export interface ZoomMeetingPollReport {
  id?: number;
  uuid?: string;
  start_time?: string;
  questions?: Array<{
    name?: string;
    email?: string;
    question_details?: Array<{
      question?: string;
      answer?: string;
      polling_id?: string;
      date_time?: string;
    }>;
  }>;
}

// =============================================================================
// Recording Settings
// =============================================================================

export interface ZoomRecordingSettingsUpdate {
  share_recording?: 'publicly' | 'internally' | 'none';
  recording_authentication?: boolean;
  authentication_option?: string;
  authentication_domains?: string;
  viewer_download?: boolean;
  password?: string;
  on_demand?: boolean;
  approval_type?: 0 | 1 | 2;
  send_email_to_host?: boolean;
  show_social_share_buttons?: boolean;
}

// =============================================================================
// Webhooks
// =============================================================================

export interface ZoomWebhook {
  webhook_id?: string;
  url?: string;
  auth_user?: string;
  auth_password?: string;
  events?: string[];
}

export interface ZoomWebhookCreateInput {
  url: string;
  auth_user?: string;
  auth_password?: string;
  events: string[];
}

export interface ZoomWebhookOptions {
  payment_notification?: {
    type?: string;
    url?: string;
  };
  registrant_notification?: {
    type?: string;
    url?: string;
  };
}

// =============================================================================
// Zoom Rooms
// =============================================================================

export interface ZoomRoom {
  id?: string;
  room_id?: string;
  name?: string;
  room_name?: string;
  location_id?: string;
  location?: string;
  status?: string;
  health?: string;
  device_ip?: string;
  camera?: string;
  microphone?: string;
  speaker?: string;
  calendar_name?: string;
  email?: string;
  activation_code?: string;
}

export interface ZoomRoomCreateInput {
  name: string;
  type: string;
  location_id?: string;
  calendar_resource_id?: string;
}

export interface ZoomRoomLocation {
  id?: string;
  name?: string;
  parent_location_id?: string;
  type?: string;
}

export interface ZoomRoomLocationCreateInput {
  name: string;
  parent_location_id?: string;
}

export interface ZoomRoomDevice {
  id?: string;
  device_name?: string;
  device_type?: string;
  device_model?: string;
  app_version?: string;
  device_system?: string;
  status?: string;
  room_id?: string;
}

export interface ZoomRoomSettings {
  schedule_meeting?: {
    host_video?: boolean;
    participant_video?: boolean;
    audio_type?: string;
    join_before_host?: boolean;
    use_pmi_for_scheduled_meetings?: boolean;
    use_pmi_for_instant_meetings?: boolean;
  };
  in_meeting?: Record<string, unknown>;
  recording?: Record<string, unknown>;
  notification?: Record<string, unknown>;
}

// =============================================================================
// Common / Response Format
// =============================================================================

export type ResponseFormat = 'json' | 'markdown';
