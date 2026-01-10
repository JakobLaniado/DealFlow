import axios from "axios";
import supabase from "../config/db";
import { getZoomS2SToken } from "./zoomToken.service";

// Types
export interface CreateMeetingInput {
  hostUserId: string;
  title?: string;
  type?: "instant" | "scheduled";
  startTime?: string;
  duration?: number;
}

export interface Meeting {
  id: string;
  zoom_meeting_id: string;
  host_user_id: string;
  title: string;
  password: string | null;
  join_url: string | null;
  start_time: string | null;
  duration: number;
  type: "instant" | "scheduled";
  status: "created" | "started" | "ended" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface MeetingWithZak extends Meeting {
  zak_token: string | null;
}

/**
 * Get ZAK token for the host user (needed for joining as host)
 */
export async function getZakToken(): Promise<string | null> {
  try {
    const token = await getZoomS2SToken();
    const email = process.env.ZOOM_HOST_EMAIL;

    if (!email) {
      console.warn("[Meeting] ZOOM_HOST_EMAIL not set, skipping ZAK token");
      return null;
    }

    const resp = await axios.get(
      `https://api.zoom.us/v2/users/${encodeURIComponent(email)}/token?type=zak`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return resp.data.token;
  } catch (err: any) {
    console.warn("[Meeting] Failed to get ZAK token:", err?.message);
    return null;
  }
}

/**
 * Create a Zoom meeting and save it to the database
 */
export async function createMeeting(input: CreateMeetingInput): Promise<MeetingWithZak> {
  const { hostUserId, title = "Contract Call", type = "instant", startTime, duration = 60 } = input;

  // 1. Create meeting in Zoom
  const token = await getZoomS2SToken();

  const zoomBody = {
    topic: title,
    type: type === "instant" ? 1 : 2,
    start_time: startTime,
    duration,
    settings: {
      waiting_room: false,
      join_before_host: true,
    },
  };

  const zoomResp = await axios.post(
    "https://api.zoom.us/v2/users/me/meetings",
    zoomBody,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const zoomData = zoomResp.data;
  const zoomMeetingId = String(zoomData.id);
  const password = zoomData.password ?? null;
  const joinUrl = zoomData.join_url ?? null;

  // 2. Save to database
  const { data: meeting, error } = await supabase
    .from("meetings")
    .insert({
      zoom_meeting_id: zoomMeetingId,
      host_user_id: hostUserId,
      title,
      password,
      join_url: joinUrl,
      start_time: startTime || null,
      duration,
      type,
      status: "created",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save meeting: ${error.message}`);
  }

  // 3. Get ZAK token for host
  const zakToken = await getZakToken();

  return {
    ...meeting,
    zak_token: zakToken,
  };
}

/**
 * Get all meetings for a user (as host)
 */
export async function getMeetingsByHost(hostUserId: string): Promise<Meeting[]> {
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .eq("host_user_id", hostUserId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch meetings: ${error.message}`);
  }

  return data || [];
}

/**
 * Get a single meeting by ID
 */
export async function getMeetingById(meetingId: string): Promise<Meeting | null> {
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .eq("id", meetingId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw new Error(`Failed to fetch meeting: ${error.message}`);
  }

  return data;
}

/**
 * Get a meeting by Zoom meeting ID
 */
export async function getMeetingByZoomId(zoomMeetingId: string): Promise<Meeting | null> {
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .eq("zoom_meeting_id", zoomMeetingId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Failed to fetch meeting: ${error.message}`);
  }

  return data;
}

/**
 * Update meeting status
 */
export async function updateMeetingStatus(
  meetingId: string,
  status: "created" | "started" | "ended" | "cancelled"
): Promise<Meeting> {
  const { data, error } = await supabase
    .from("meetings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", meetingId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update meeting: ${error.message}`);
  }

  return data;
}
