import sgMail from "@sendgrid/mail";

// Initialize SendGrid with API key
const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  sgMail.setApiKey(apiKey);
}

const APP_NAME = "DealFlow";

interface SendContractEmailParams {
  to: string;
  clientName: string;
  sellerName: string;
  contractUrl: string;
  meetingTitle?: string;
  meetingId?: string;
  zoomMeetingId?: string;
  zoomPassword?: string;
  zoomJoinUrl?: string;
}

function generateDeepLink(zoomMeetingId: string, password?: string): string {
  const params = new URLSearchParams({ meetingId: zoomMeetingId });
  if (password) {
    params.append("password", password);
  }
  return `dealflow://join?${params.toString()}`;
}

function generateEmailHtml(params: SendContractEmailParams): string {
  const { clientName, sellerName, contractUrl, meetingTitle, zoomMeetingId, zoomPassword, zoomJoinUrl } = params;

  const deepLink = zoomMeetingId ? generateDeepLink(zoomMeetingId, zoomPassword || undefined) : null;
  const hasMeeting = deepLink || zoomJoinUrl;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contract from ${sellerName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="background-color: #f4f7fa;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" width="600" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4A90A4 0%, #357186 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                ${APP_NAME}
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.85); font-size: 14px;">
                Close deals faster, together
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 24px; color: #1a1a2e; font-size: 22px; font-weight: 600;">
                You've Received a Contract
              </h2>

              <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                Hi <strong style="color: #1a1a2e;">${clientName}</strong>,
              </p>

              <p style="margin: 0 0 24px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                <strong style="color: #1a1a2e;">${sellerName}</strong> has sent you a contract to review${
    meetingTitle ? ` for <strong style="color: #4A90A4;">"${meetingTitle}"</strong>` : ""
  }.
              </p>

              <!-- Contract Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="margin-bottom: 32px;">
                <tr>
                  <td align="center">
                    <a href="${contractUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #4A90A4 0%, #357186 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 14px rgba(74, 144, 164, 0.4);">
                      Review & Sign Contract
                    </a>
                  </td>
                </tr>
              </table>

              ${
                hasMeeting
                  ? `
              <!-- Divider -->
              <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="margin: 32px 0;">
                <tr>
                  <td style="border-top: 1px solid #e2e8f0;"></td>
                </tr>
              </table>

              <!-- Meeting Section -->
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 16px; color: #1a1a2e; font-size: 18px; font-weight: 600;">
                  Join the Meeting
                </h3>
                <p style="margin: 0 0 20px; color: #64748b; font-size: 14px; line-height: 1.6;">
                  Ready to discuss? Join the video call using one of the options below.
                </p>

                <!-- Meeting Buttons -->
                <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                  <tr>
                    ${
                      deepLink
                        ? `
                    <td style="padding-right: 8px;" width="50%">
                      <a href="${deepLink}" style="display: block; background-color: #1a1a2e; color: #ffffff; text-decoration: none; padding: 14px 20px; border-radius: 10px; font-size: 14px; font-weight: 600; text-align: center;">
                        Open in App
                      </a>
                    </td>
                    `
                        : ""
                    }
                    ${
                      zoomJoinUrl
                        ? `
                    <td style="${deepLink ? "padding-left: 8px;" : ""}" width="${deepLink ? "50%" : "100%"}">
                      <a href="${zoomJoinUrl}" target="_blank" style="display: block; background-color: #2D8CFF; color: #ffffff; text-decoration: none; padding: 14px 20px; border-radius: 10px; font-size: 14px; font-weight: 600; text-align: center;">
                        Join via Zoom
                      </a>
                    </td>
                    `
                        : ""
                    }
                  </tr>
                </table>

                ${
                  zoomMeetingId
                    ? `
                <!-- Meeting Details -->
                <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="margin-top: 20px; background-color: #ffffff; border-radius: 8px; padding: 16px;">
                  <tr>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">
                      <span style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Meeting ID</span>
                      <p style="margin: 4px 0 0; color: #1a1a2e; font-size: 15px; font-weight: 600; font-family: 'SF Mono', Monaco, monospace;">${zoomMeetingId}</p>
                    </td>
                  </tr>
                  ${
                    zoomPassword
                      ? `
                  <tr>
                    <td style="padding: 12px 16px;">
                      <span style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Password</span>
                      <p style="margin: 4px 0 0; color: #1a1a2e; font-size: 15px; font-weight: 600; font-family: 'SF Mono', Monaco, monospace;">${zoomPassword}</p>
                    </td>
                  </tr>
                  `
                      : ""
                  }
                </table>
                `
                    : ""
                }
              </div>
              `
                  : ""
              }

              <!-- Fallback Link -->
              <p style="margin: 24px 0 0; color: #94a3b8; font-size: 13px; line-height: 1.6;">
                If the button doesn't work, copy and paste this link:<br />
                <a href="${contractUrl}" style="color: #4A90A4; word-break: break-all;">${contractUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #e2e8f0;">
              <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 8px; color: #64748b; font-size: 13px;">
                      Sent via <strong>${APP_NAME}</strong>
                    </p>
                    <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                      Close deals faster with video contracts
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <!-- Bottom Text -->
        <table role="presentation" cellspacing="0" cellpadding="0" width="600" style="max-width: 600px; margin: 24px auto 0;">
          <tr>
            <td style="text-align: center;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.6;">
                This email was sent to you because ${sellerName} shared a contract with you through ${APP_NAME}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function generatePlainText(params: SendContractEmailParams): string {
  const { clientName, sellerName, contractUrl, meetingTitle, zoomMeetingId, zoomPassword, zoomJoinUrl } = params;

  const deepLink = zoomMeetingId ? generateDeepLink(zoomMeetingId, zoomPassword || undefined) : null;

  let text = `
Hi ${clientName},

${sellerName} has sent you a contract to review${meetingTitle ? ` for "${meetingTitle}"` : ""}.

Please click the link below to view and sign the contract:
${contractUrl}
`.trim();

  if (deepLink || zoomJoinUrl) {
    text += `\n\n---\nJOIN THE MEETING\n`;
    if (deepLink) {
      text += `\nOpen in DealFlow App: ${deepLink}`;
    }
    if (zoomJoinUrl) {
      text += `\nJoin via Zoom: ${zoomJoinUrl}`;
    }
    if (zoomMeetingId) {
      text += `\n\nMeeting ID: ${zoomMeetingId}`;
      if (zoomPassword) {
        text += `\nPassword: ${zoomPassword}`;
      }
    }
  }

  text += `\n\n---\nSent via DealFlow`;

  return text;
}

export async function sendContractEmail(params: SendContractEmailParams): Promise<boolean> {
  const { to, sellerName, meetingTitle } = params;

  if (!apiKey) {
    console.error("[Email] SENDGRID_API_KEY not configured");
    return false;
  }

  const fromEmail = process.env.SENDGRID_FROM_EMAIL;
  if (!fromEmail) {
    console.error("[Email] SENDGRID_FROM_EMAIL not configured");
    return false;
  }

  const msg = {
    to,
    from: {
      email: fromEmail,
      name: APP_NAME,
    },
    subject: `Contract from ${sellerName}${meetingTitle ? ` - ${meetingTitle}` : ""}`,
    text: generatePlainText(params),
    html: generateEmailHtml(params),
  };

  try {
    await sgMail.send(msg);
    console.log(`[Email] Contract email sent to ${to}`);
    return true;
  } catch (error: any) {
    console.error("[Email] Failed to send:", error?.response?.body || error.message);
    return false;
  }
}
