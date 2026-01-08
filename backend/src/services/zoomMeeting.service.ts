import axios from "axios";
import { getZoomS2SToken } from "./zoomToken.service";

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
