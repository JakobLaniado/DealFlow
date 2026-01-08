import { Router } from "express";
import { z } from "zod";
import {
  createZoomMeeting,
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
zoomRouter.post("/meetings", async (req, res) => {
  try {
    const zoomMeeting: Partial<ZoomMeeting> = req.body;
    const meeting = await createZoomMeeting(zoomMeeting);
    res.json(meeting);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to create meeting" });
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
