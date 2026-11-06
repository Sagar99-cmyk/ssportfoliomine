import nodemailer from 'nodemailer';

export interface EmailReplyOptions {
  to: string;
  recipientName: string;
  originalSubject: string;
  originalMessage: string;
  replyContent: string;
  senderName?: string;
  senderEmail?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  configured: boolean;
}

/**
 * Creates and returns the active Nodemailer transporter configured from environment variables.
 */
export function getMailTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || '';
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.SMTP_PASSWORD || '';
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Checks whether SMTP credentials are fully provided in environment variables.
 */
export function isEmailConfigured(): boolean {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || '';
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.SMTP_PASSWORD || '';
  return Boolean(user && pass);
}

/**
 * Sends a real email response to a visitor who reached out via the portfolio contact form.
 */
export async function sendContactReplyEmail(options: EmailReplyOptions): Promise<SendEmailResult> {
  const {
    to,
    recipientName,
    originalSubject,
    originalMessage,
    replyContent,
    senderName = 'Sagar Singh',
    senderEmail = process.env.SMTP_USER || 'sirroshan999@gmail.com',
  } = options;

  const transporter = getMailTransporter();

  if (!transporter) {
    return {
      success: false,
      configured: false,
      error: 'SMTP credentials missing. Please define SMTP_USER and SMTP_PASS (Gmail 16-character App Password) in your server environment/.env file.',
    };
  }

  const subject = originalSubject.startsWith('Re:') ? originalSubject : `Re: ${originalSubject}`;
  const from = `"${senderName}" <${senderEmail}>`;

  // HTML Email Template with Sagar Singh Dark/Ruby Luxury Portfolio Aesthetic
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080a10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #080a10; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="600" style="max-width: 600px; background-color: #0d101a; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #e11d48 0%, #881337 100%); padding: 24px 32px; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Sagar Singh</h1>
                    <p style="margin: 4px 0 0; font-size: 12px; color: rgba(255,255,255,0.85); font-family: monospace;">Web & AI Developer · Data Analytics</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Reply Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px; font-size: 15px; color: #e4e4e7; line-height: 1.6;">
                Hi <strong>${recipientName || 'there'}</strong>,
              </p>

              <div style="font-size: 14px; color: #f4f4f5; line-height: 1.7; white-space: pre-wrap; margin-bottom: 24px; padding: 16px; background-color: #121624; border-left: 3px solid #e11d48; border-radius: 8px;">
${replyContent.trim()}
              </div>

              <!-- Quoted Previous Message Thread -->
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px dashed #27272a;">
                <p style="margin: 0 0 8px; font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a;">
                  In response to your inquiry:
                </p>
                <div style="padding: 14px 18px; background-color: #090b12; border: 1px solid #1f2430; border-radius: 8px; font-size: 12px; color: #a1a1aa; line-height: 1.6; font-style: italic;">
                  <strong style="color: #d4d4d8; font-style: normal;">Subject:</strong> ${originalSubject}<br>
                  ${originalMessage}
                </div>
              </div>

              <!-- Sign-off -->
              <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #1e2230;">
                <p style="margin: 0; font-size: 13px; color: #d4d4d8; font-weight: 600;">
                  Warm regards,
                </p>
                <p style="margin: 4px 0 0; font-size: 14px; color: #ffffff; font-weight: 700;">
                  ${senderName}
                </p>
                <p style="margin: 2px 0 0; font-size: 11px; color: #71717a; font-family: monospace;">
                  Bengaluru, India · <a href="https://sagarsingh.dev" style="color: #fb7185; text-decoration: none;">Portfolio & Case Studies</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer Bar -->
          <tr>
            <td style="padding: 16px 32px; background-color: #060810; border-top: 1px solid #1a1e2b; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #52525b;">
                Sent directly from Sagar Singh's Portfolio Admin Command Center.
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

  // Plain Text Fallback
  const textContent = `
Hi ${recipientName || 'there'},

${replyContent.trim()}

--------------------------------------------------
In response to your message regarding "${originalSubject}":
${originalMessage}
--------------------------------------------------

Warm regards,
${senderName}
Web & AI Developer · Data Analytics
Portfolio: https://sagarsingh.dev
  `.trim();

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: textContent,
      html: htmlContent,
      replyTo: senderEmail,
    });

    return {
      success: true,
      configured: true,
      messageId: info.messageId,
    };
  } catch (err: any) {
    console.error('Nodemailer sendMail failed:', err);
    return {
      success: false,
      configured: true,
      error: err.message || 'Failed to transmit email via SMTP server.',
    };
  }
}

