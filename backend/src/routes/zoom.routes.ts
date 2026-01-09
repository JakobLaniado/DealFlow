import { Router } from "express";
import { z } from "zod";
import { requireSellerRole } from "../middleware/auth.middleware";
import {
  createZoomMeeting,
  getHostZakToken,
  ZoomMeeting,
} from "../services/zoomMeeting.service";
import { generateMeetingSdkJwt } from "../services/zoomSdkJwt.service";
import { createMeetingSdkSignature } from "../services/zoomSdkSignature.service";

export const zoomRouter = Router();

/**
 * GET /zoom/jwt
 * Get SDK JWT token for initializing the Zoom Meeting SDK
 */
zoomRouter.get("/jwt", async (req, res) => {
  try {
    const { jwtToken, expiresIn } = generateMeetingSdkJwt();
    res.json({
      success: true,
      data: {
        jwtToken,
        expiresIn,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to generate JWT" });
  }
});

/**
 * POST /zoom/meetings
 * Creates a Zoom meeting (seller only in your app logic; backend doesn't enforce yet)
 */
zoomRouter.post("/meetings", requireSellerRole, async (req, res) => {
  try {
    const zoomMeeting: Partial<ZoomMeeting> = req.body;
    const result = await createZoomMeeting(zoomMeeting);

    // Get the real ZAK token for the host
    let zakToken: string | null = null;
    try {
      zakToken = await getHostZakToken();
    } catch (zakErr: any) {
      console.warn("[Zoom] Failed to get ZAK token:", zakErr?.message);
      // Continue without ZAK - meeting can still be created, host just won't have host privileges
    }

    res.json({
      success: true,
      data: {
        meetingId: result.meetingId,
        password: result.passcode,
        deeplink: result.deeplinkUrl,
        zakToken, // Real ZAK token for host authentication
        meeting: {
          id: result.meetingId,
          meeting_id: result.meetingId,
          password: result.passcode,
          title: zoomMeeting.topic || "Contract Call",
          created_by: "user",
          start_time: null,
          duration: 60,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to create meeting" });
  }
});

/**
 * GET /zoom/zak
 * Get ZAK token for host to join meeting as host
 */
zoomRouter.get("/zak", requireSellerRole, async (_req, res) => {
  try {
    const zakToken = await getHostZakToken();
    res.json({
      success: true,
      data: { zakToken },
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to get ZAK token" });
  }
});

/**
 * POST /zoom/sdk-signature
 * Body: { meetingId: string, role: 0|1 }
 */
zoomRouter.post("/sdk-signature", async (req, res) => {
  const schema = z.object({
    meetingId: z.string().min(3),
    role: z.union([z.literal(0), z.literal(1)]),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });

  try {
    const { meetingId, role } = parsed.data;
    const signature = createMeetingSdkSignature(meetingId, role);
    res.json({ signature });
  } catch (err: any) {
    res
      .status(500)
      .json({ error: err?.message || "Failed to create signature" });
  }
});
