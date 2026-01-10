import crypto from "crypto";
import { Router } from "express";
import { z } from "zod";
import { requireSellerRole } from "../middleware/auth.middleware";
import {
  createMeeting,
  getMeetingsByHost,
  getMeetingById,
  getMeetingByZoomId,
  updateMeetingStatus,
  getZakToken,
} from "../services/meeting.service";
import { generateMeetingSdkJwt } from "../services/zoomSdkJwt.service";

export const meetingRouter = Router();

/**
 * GET /meetings/jwt
 * Get SDK JWT token for initializing the Zoom Meeting SDK
 */
meetingRouter.get("/jwt", async (_req, res) => {
  try {
    const { jwtToken, expiresIn } = generateMeetingSdkJwt();
    res.json({
      success: true,
      data: { jwtToken, expiresIn },
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to generate JWT" });
  }
});

/**
 * GET /meetings/zak
 * Get ZAK token for host to join meeting as host
 */
meetingRouter.get("/zak", async (_req, res) => {
  try {
    const zakToken = await getZakToken();
    if (!zakToken) {
      return res.status(500).json({ error: "Failed to get ZAK token" });
    }
    res.json({
      success: true,
      data: { zakToken },
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to get ZAK token" });
  }
});

/**
 * POST /meetings
 * Create a new meeting (seller only)
 */
const createMeetingSchema = z.object({
  hostUserId: z.string().uuid(),
  title: z.string().optional(),
  type: z.enum(["instant", "scheduled"]).optional(),
  startTime: z.string().optional(),
  duration: z.number().min(1).max(480).optional(),
});

meetingRouter.post("/", requireSellerRole, async (req, res) => {
  const parsed = createMeetingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const meeting = await createMeeting(parsed.data);
    res.json({
      success: true,
      data: meeting,
    });
  } catch (err: any) {
    console.error("[Meeting] Create error:", err);
    res.status(500).json({ error: err?.message || "Failed to create meeting" });
  }
});

/**
 * GET /meetings
 * Get all meetings for a host user
 */
const getMeetingsSchema = z.object({
  hostUserId: z.string().uuid(),
});

meetingRouter.get("/", async (req, res) => {
  const parsed = getMeetingsSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const meetings = await getMeetingsByHost(parsed.data.hostUserId);
    res.json({
      success: true,
      data: meetings,
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to fetch meetings" });
  }
});

/**
 * GET /meetings/:id
 * Get a single meeting by ID
 */
meetingRouter.get("/:id", async (req, res) => {
  try {
    const meeting = await getMeetingById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    res.json({
      success: true,
      data: meeting,
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to fetch meeting" });
  }
});

/**
 * GET /meetings/zoom/:zoomMeetingId
 * Get a meeting by Zoom meeting ID
 */
meetingRouter.get("/zoom/:zoomMeetingId", async (req, res) => {
  try {
    const meeting = await getMeetingByZoomId(req.params.zoomMeetingId);
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    res.json({
      success: true,
      data: meeting,
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to fetch meeting" });
  }
});

/**
 * PATCH /meetings/:id/status
 * Update meeting status
 */
const updateStatusSchema = z.object({
  status: z.enum(["created", "started", "ended", "cancelled"]),
});

meetingRouter.patch("/:id/status", async (req, res) => {
  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const meeting = await updateMeetingStatus(req.params.id, parsed.data.status);
    res.json({
      success: true,
      data: meeting,
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to update meeting" });
  }
});

/**
 * POST /meetings/webhook
 * Zoom webhook endpoint for meeting events
 *
 * Handles:
 * - endpoint.url_validation: Zoom's webhook verification challenge
 * - meeting.started: Meeting has started
 * - meeting.ended: Meeting has ended
 */
meetingRouter.post("/webhook", async (req, res) => {
  const { event, payload } = req.body;

  console.log("[Webhook] Received event:", event);
  console.log("[Webhook] Full payload:", JSON.stringify(req.body, null, 2));

  // Handle Zoom's webhook URL validation (CRC challenge)
  if (event === "endpoint.url_validation") {
    const plainToken = req.body.payload.plainToken;
    const secretToken = process.env.ZOOM_WEBHOOK_SECRET_TOKEN;

    if (!secretToken) {
      console.error("[Webhook] ZOOM_WEBHOOK_SECRET_TOKEN not set");
      return res.status(500).json({ error: "Webhook secret not configured" });
    }

    // Create hash for validation response
    const hashForValidate = crypto
      .createHmac("sha256", secretToken)
      .update(plainToken)
      .digest("hex");

    console.log("[Webhook] Responding to URL validation challenge");
    return res.json({
      plainToken,
      encryptedToken: hashForValidate,
    });
  }

  // Handle meeting events
  try {
    const zoomMeetingId = String(payload?.object?.id);

    if (!zoomMeetingId) {
      console.warn("[Webhook] No meeting ID in payload");
      return res.status(200).send();
    }

    // Find meeting in our database
    const meeting = await getMeetingByZoomId(zoomMeetingId);

    if (!meeting) {
      console.warn("[Webhook] Meeting not found in DB:", zoomMeetingId);
      return res.status(200).send();
    }

    // Update status based on event
    if (event === "meeting.started") {
      await updateMeetingStatus(meeting.id, "started");
      console.log("[Webhook] Meeting started:", zoomMeetingId);
    } else if (event === "meeting.ended") {
      await updateMeetingStatus(meeting.id, "ended");
      console.log("[Webhook] Meeting ended:", zoomMeetingId);
    }

    res.status(200).send();
  } catch (err: any) {
    console.error("[Webhook] Error processing event:", err);
    // Always return 200 to Zoom to prevent retries
    res.status(200).send();
  }
});
