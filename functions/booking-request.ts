import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const REGION = process.env.AWS_REGION || "us-east-2";
const EMAIL_FROM = process.env.EMAIL_FROM || "booking@semperfinishllc.com";
const EMAIL_TO = (process.env.EMAIL_TO || "").split(/[,\s]+/).filter(Boolean);

const ses = new SESv2Client({ region: REGION });

function sanitize(input: unknown, max = 5000) {
  const s = typeof input === "string" ? input : "";
  return s.trim().replace(/\s+/g, " ").replace(/[<>]/g, "").slice(0, max);
}

export async function handler(event: { body?: string | null }) {
  try {
    if (!event.body) {
      return { statusCode: 400, body: "Missing body" };
    }

    const parsed = JSON.parse(event.body);

    const firstName = sanitize(parsed.firstName, 100);
    const lastName = sanitize(parsed.lastName, 100);
    const email = sanitize(parsed.email, 254).toLowerCase();
    const phone = sanitize(parsed.phone, 32);
    const address = sanitize(parsed.address, 200);
    const details = sanitize(parsed.details, 5000);

    if (!firstName || !lastName || !email || !phone || !address || !details) {
      return { statusCode: 400, body: "Missing required fields" };
    }
    if (EMAIL_TO.length === 0) {
      return { statusCode: 500, body: "No recipients configured" };
    }

    const subject = `New Booking Request - ${firstName} ${lastName}`;

    const lines = [
      `Name: ${firstName} ${lastName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Address: ${address}`,
      details ? "" : "",
      details ? "Project Details:" : "",
      details ? details : "",
    ].filter(Boolean);

    const heading = `New Booking Request from ${firstName} ${lastName}`;

    const textBody = [heading, ...lines].join("\n");
    const htmlBody = `<div style=\"font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;line-height:1.5\">`
      + `<h3>${heading}</h3>`
      + lines.map((l) => (l === "Project Details:" ? `<h3>${l}</h3>` : `<p>${l}</p>`)).join("")
      + `</div>`;

    const cmd = new SendEmailCommand({
      FromEmailAddress: EMAIL_FROM,
      Destination: { ToAddresses: EMAIL_TO },
      ReplyToAddresses: [email],
      Content: {
        Simple: {
          Subject: { Data: subject, Charset: "UTF-8" },
          Body: {
            Text: { Data: textBody, Charset: "UTF-8" },
            Html: { Data: htmlBody, Charset: "UTF-8" },
          },
        },
      },
    });

    await ses.send(cmd);

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err: any) {
    console.error("booking-request error", err);
    return { statusCode: 500, body: err?.message || "Internal error" };
  }
}
