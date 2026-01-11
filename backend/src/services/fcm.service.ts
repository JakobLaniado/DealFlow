import { getFirebaseApp } from "../config/firebase";
import supabase from "../config/db";

interface ContractNotificationData {
  type: "contract";
  contractUrl: string;
  sellerName?: string;
  meetingId?: string;
  meetingDeeplink?: string;
}

interface SendNotificationResult {
  success: boolean;
  error?: string;
}

export async function sendPushNotification(
  fcmToken: string,
  title: string,
  body: string,
  data?: Record<string, string>,
  deeplink?: string
): Promise<SendNotificationResult> {
  try {
    const firebase = getFirebaseApp();
    const messaging = firebase.messaging();

    const message: any = {
      token: fcmToken,
      notification: {
        title,
        body,
      },
      data: data || {},
      android: {
        priority: "high" as const,
        notification: {
          sound: "default",
          ...(deeplink && { clickAction: "OPEN_FROM_NOTIFICATION" }),
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
          },
        },
      },
    };

    if (deeplink) {
      message.data.deeplink = deeplink;
    }

    await messaging.send(message);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to send notification",
    };
  }
}

export async function sendContractNotification(
  clientEmail: string,
  sellerName: string,
  contractUrl: string,
  meetingId?: string,
  zoomMeetingId?: string,
  zoomPassword?: string
): Promise<SendNotificationResult> {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, fcm_token, name")
      .eq("email", clientEmail)
      .single();

    if (error || !user) {
      return {
        success: false,
        error: "User not found or not registered in app",
      };
    }

    if (!user.fcm_token) {
      return {
        success: false,
        error: "User has not enabled push notifications",
      };
    }

    let meetingDeeplink = "";
    if (zoomMeetingId) {
      meetingDeeplink = `dealflow://join?meetingId=${zoomMeetingId}`;
      if (zoomPassword) {
        meetingDeeplink += `&password=${encodeURIComponent(zoomPassword)}`;
      }
    }

    const notificationData: ContractNotificationData = {
      type: "contract",
      contractUrl,
      sellerName,
      meetingId: meetingId || "",
      meetingDeeplink,
    };

    return await sendPushNotification(
      user.fcm_token,
      "New Contract Received",
      `${sellerName} has sent you a contract to review`,
      notificationData as unknown as Record<string, string>,
      meetingDeeplink || undefined
    );
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to send notification",
    };
  }
}

export async function registerFcmToken(
  userId: string,
  fcmToken: string,
  platform: "ios" | "android"
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("users")
      .update({
        fcm_token: fcmToken,
        fcm_platform: platform,
        fcm_updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to register token",
    };
  }
}
