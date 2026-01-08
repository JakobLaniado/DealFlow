function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export function generateMeetingSdkJwt() {
  const sdkKey = mustEnv("ZOOM_SDK_CLIENT_ID");
  const sdkSecret = mustEnv("ZOOM_SDK_CLIENT_SECRET");
  const KJUR = require("jsrsasign");

  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 48;
  const oHeader = { alg: "HS256", typ: "JWT" };

  const oPayload = {
    appKey: sdkKey,
    sdkKey: sdkKey,
    // mn: "ZOOM_MEETING_NUMBER",
    // role: 0,
    iat: iat,
    exp: exp,
    tokenExp: exp,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const MEETING_SDK_JWT = KJUR.jws.JWS.sign(
    "HS256",
    sHeader,
    sPayload,
    sdkSecret
  );

  return { jwtToken: MEETING_SDK_JWT, expiresIn: exp - iat };
}
