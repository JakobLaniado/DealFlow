import axios from "axios";

let cachedToken: { value: string; expiresAt: number } | null = null;

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function getZoomS2SToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 10_000) {
    return cachedToken.value;
  }

  const accountId = mustEnv("ZOOM_ACCOUNT_ID");
  const clientId = mustEnv("ZOOM_S2S_CLIENT_ID");
  const clientSecret = mustEnv("ZOOM_S2S_CLIENT_SECRET");

  const url = "https://zoom.us/oauth/token";
  const params = new URLSearchParams({
    grant_type: "account_credentials",
    account_id: accountId,
  });

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const resp = await axios.post(`${url}?${params.toString()}`, null, {
    headers: {
      Authorization: `Basic ${basic}`,
    },
  });

  const accessToken = resp.data.access_token as string;
  const expiresIn = resp.data.expires_in as number; // seconds

  cachedToken = {
    value: accessToken,
    expiresAt: now + expiresIn * 1000,
  };

  return accessToken;
}
