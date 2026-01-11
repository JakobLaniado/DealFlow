import { Router } from "express";
import { z } from "zod";
import { registerFcmToken } from "../services/fcm.service";

export const userRouter = Router();

const registerFcmTokenSchema = z.object({
  userId: z.string().uuid(),
  fcmToken: z.string().min(1),
  platform: z.enum(["ios", "android"]),
});

/**
 * POST /users/fcm-token
 * Register or update a user's FCM token for push notifications
 */
userRouter.post("/fcm-token", async (req, res) => {
  const parsed = registerFcmTokenSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { userId, fcmToken, platform } = parsed.data;

  try {
    const result = await registerFcmToken(userId, fcmToken, platform);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json({ success: true, message: "FCM token registered" });
  } catch (err: any) {
    console.error("[User] FCM token registration error:", err);
    res.status(500).json({ error: err?.message || "Failed to register FCM token" });
  }
});
