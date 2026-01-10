import { Router } from "express";
import { z } from "zod";
import supabase from "../config/db";
import { sendContractEmail } from "../services/email.service";
import { getMeetingById } from "../services/meeting.service";

export const contractRouter = Router();

const sendContractSchema = z.object({
  clientEmail: z.string().email(),
  sellerUserId: z.string().uuid(),
  meetingId: z.string().uuid().optional(),
  contractUrl: z.string().url().optional(),
});

contractRouter.post("/send", async (req, res) => {
  const parsed = sendContractSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { clientEmail, sellerUserId, meetingId, contractUrl: providedContractUrl } = parsed.data;
  // Use provided URL from seller, or fall back to env default
  const contractUrl = providedContractUrl || process.env.CONTRACT_URL || "https://docs.google.com/";

  try {
    // Try to find client by email, but proceed even if not found in DB
    const { data: client } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("email", clientEmail)
      .single();

    // Use client name if found, otherwise use email
    const clientName = client?.name || clientEmail.split("@")[0];

    // Get seller info
    const { data: seller, error: sellerError } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("id", sellerUserId)
      .single();

    if (sellerError || !seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // Get meeting info if provided
    let meetingTitle: string | undefined;
    let zoomMeetingId: string | undefined;
    let zoomPassword: string | undefined;
    let zoomJoinUrl: string | undefined;

    if (meetingId) {
      const meeting = await getMeetingById(meetingId);
      if (meeting) {
        meetingTitle = meeting.title;
        zoomMeetingId = meeting.zoom_meeting_id;
        zoomPassword = meeting.password || undefined;
        zoomJoinUrl = meeting.join_url || undefined;
      }
    }

    // Send email
    const emailSent = await sendContractEmail({
      to: clientEmail,
      clientName,
      sellerName: seller.name,
      contractUrl,
      meetingTitle,
      meetingId,
      zoomMeetingId,
      zoomPassword,
      zoomJoinUrl,
    });

    if (!emailSent) {
      return res.status(500).json({ error: "Failed to send email" });
    }

    // TODO: Send FCM push notification

    res.json({
      success: true,
      message: "Contract sent successfully",
      contractUrl,
    });
  } catch (err: any) {
    console.error("[Contract] Send error:", err);
    res.status(500).json({ error: err?.message || "Failed to send contract" });
  }
});
