import axios from "axios";
import { getZoomS2SToken } from "./zoomToken.service";

/**
 * Get ZAK (Zoom Access Key) token for the host user
 * This is required when joining a meeting as host (userType: 1)
 *
 * With S2S OAuth, we need to use specific user email instead of "me"
 */
export async function getHostZakToken(userEmail?: string): Promise<string> {
  const token = await getZoomS2SToken();

  // Use provided email or fall back to env variable for default host
  const email = userEmail || process.env.ZOOM_HOST_EMAIL;
  if (!email) {
    throw new Error("ZOOM_HOST_EMAIL environment variable is required for ZAK token");
  }

  console.log("[Zoom] Fetching ZAK token for:", email);

  try {
    const resp = await axios.get(
      `https://api.zoom.us/v2/users/${encodeURIComponent(email)}/token?type=zak`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("[Zoom] ZAK token fetched successfully");
    return resp.data.token;
  } catch (err: any) {
    // Log the actual error response from Zoom
    if (err.response) {
      console.error("[Zoom] ZAK error response:", {
        status: err.response.status,
        data: err.response.data,
      });
    }
    throw err;
  }
}

export type ZoomMeeting = {
  topic: string;
  type: number;
  settings: {
    waiting_room: boolean;
    join_before_host: boolean;
  };
};

export type ZoomMeetingCreateResult = {
  meetingId: string;
  passcode: string;
  joinUrl: string;
  deeplinkUrl: string;
};

export async function createZoomMeeting(
  meeting?: Partial<ZoomMeeting>
): Promise<ZoomMeetingCreateResult> {
  const token = await getZoomS2SToken();

  // "Instant meeting" (type: 1) is easiest for assignments.
  const body = {
    topic: meeting?.topic ?? "Contract Call",
    type: meeting?.type ?? 1,
    settings: {
      waiting_room: meeting?.settings?.waiting_room ?? false,
      join_before_host: meeting?.settings?.join_before_host ?? true,
    },
  };

  const resp = await axios.post(
    "https://api.zoom.us/v2/users/me/meetings",
    body,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = resp.data;
  const meetingId = String(data.id);
  const passcode = data.password ?? "";
  const joinUrl = data.join_url ?? "";

  const deeplinkUrl = `DealFlow:///join?meetingId=${encodeURIComponent(
    meetingId
  )}&password=${encodeURIComponent(passcode)}`;

  return {
    meetingId,
    passcode,
    joinUrl,
    deeplinkUrl,
  };
}
