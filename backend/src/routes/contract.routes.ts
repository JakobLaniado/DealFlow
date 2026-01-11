import { Router } from "express";
import { z } from "zod";
import supabase from "../config/db";
import { sendContractEmail } from "../services/email.service";
import { sendContractNotification } from "../services/fcm.service";
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
  const contractUrl = providedContractUrl || process.env.CONTRACT_URL || "https://docs.google.com/";

  try {
    const { data: client } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("email", clientEmail)
      .single();

    const clientName = client?.name || clientEmail.split("@")[0];

    const { data: seller, error: sellerError } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("id", sellerUserId)
      .single();

    if (sellerError || !seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

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

    const fcmResult = await sendContractNotification(
      clientEmail,
      seller.name,
      contractUrl,
      meetingId,
      zoomMeetingId,
      zoomPassword
    );

    res.json({
      success: true,
      message: "Contract sent successfully",
      contractUrl,
      notificationSent: fcmResult.success,
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to send contract" });
  }
});
