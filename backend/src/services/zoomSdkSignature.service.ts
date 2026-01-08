import jwt from "jsonwebtoken";

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

/**
 * Meeting SDK signature (JWT) for native Meeting SDK
 * role: 0 = attendee, 1 = host
 */
export function createMeetingSdkSignature(
  meetingNumber: string,
  role: 0 | 1
): string {
  const sdkKey = mustEnv("ZOOM_SDK_CLIENT_ID");
  const sdkSecret = mustEnv("ZOOM_SDK_CLIENT_SECRET");

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60; // 1 hour

  // Zoom expects specific claims for Meeting SDK signature.
  // Keep it short-lived.
  const payload = {
    sdkKey,
    mn: meetingNumber,
    role,
    iat,
    exp,
    appKey: sdkKey,
    tokenExp: exp,
  };

  return jwt.sign(payload, sdkSecret, { algorithm: "HS256" });
}
