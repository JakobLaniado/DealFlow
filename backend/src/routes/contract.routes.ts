import { Router } from "express";
import { z } from "zod";

export const contractRouter = Router();

contractRouter.post("/send", async (req, res) => {
  const schema = z.object({
    clientUserId: z.string().min(1),
    meetingId: z.string().min(1).optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });

  const contractUrl = process.env.CONTRACT_URL || "https://docs.google.com/";

  // TODO (next step): lookup client email + fcm token from Supabase,
  // send push + email.
  // For now, return the URL so the app can show it.
  res.json({ ok: true, contractUrl });
});
