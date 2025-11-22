import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { Resource } from "sst";

const REGION = process.env.AWS_REGION || "us-east-1";
const EMAIL_FROM = process.env.EMAIL_FROM || "booking@semperfinishllc.com";
const EMAIL_TO = (process.env.EMAIL_TO || "").split(/[\s,]+/).filter(Boolean);

const ses = new SESv2Client({ region: REGION });

export async function handler(event: { body?: string | null; headers?: Record<string, string | undefined> }) {
  try {
    const auth = verifyAuth(event.headers);
    if (!auth.ok) {
      return { statusCode: auth.statusCode, body: auth.body };
    }

    const parsed = parseAndValidate(event.body);
    if (!parsed.ok) {
      return { statusCode: parsed.statusCode, body: parsed.body };
    }

    const { firstName, lastName, email, phone, address, details, heading } = parsed.data;

    // Attempt both email + slack regardless of individual failures
    const [emailResult, slackResult] = await Promise.allSettled([
      sendEmail({ heading, firstName, lastName, email, phone, address, details }),
      postToSlack({ heading, firstName, lastName, email, phone, address, details }),
    ]);

    const errors: string[] = [];

    if (emailResult.status === "rejected") {
      console.error("booking-request email send failed", emailResult.reason);
      errors.push(emailResult.reason?.message || "Email failed");
    }
    if (slackResult.status === "rejected") {
      console.error("booking-request slack post failed", slackResult.reason);
      errors.push(slackResult.reason?.message || "Slack post failed");
    }

    if (errors.length > 0) {
      return { statusCode: 500, body: errors.join("; ") };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err: any) {
    console.error("booking-request error", err);
    return { statusCode: 500, body: err?.message || "Internal error" };
  }
}

// MARK: HELPER FUNCTIONS

function sanitize(input: unknown, max = 5000) {
  const str = typeof input === "string" ? input : "";
  return str.trim().replace(/\s+/g, " ").replace(/[<>]/g, "").slice(0, max);
}

type Result<T> = { ok: true; data: T } | { ok: false; statusCode: number; body: string };

function verifyAuth(headers: Record<string, string | undefined> | undefined): Result<null> {
  const secret = getConfiguredSecret();
  if (!secret) {
    return { ok: false, statusCode: 500, body: "Server not configured" };
  }
  const hdrs = headers || {};
  const headerKey = Object.keys(hdrs).find((k) => k.toLowerCase() === "x-api-key");
  const provided = headerKey ? hdrs[headerKey] : undefined;
  if (!provided || provided !== secret) {
    return { ok: false, statusCode: 403, body: "Forbidden" };
  }
  return { ok: true, data: null };
}

function getConfiguredSecret(): string | undefined {
  let secret: string | undefined = process.env.BOOKING_API_SECRET;
  if (!secret) {
    try {
      secret = (Resource as any).BookingApiSecret?.value as string | undefined;
    } catch {
      // ignore
    }
  }
  return secret;
}

function parseAndValidate(body: string | null | undefined): Result<{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  details: string;
  heading: string;
}> {
  if (!body) {
    return { ok: false, statusCode: 400, body: "Missing body" };
  }
  const parsed = JSON.parse(body);

  const firstName = sanitize(parsed.firstName, 100);
  const lastName = sanitize(parsed.lastName, 100);
  const email = sanitize(parsed.email, 254).toLowerCase();
  const phone = sanitize(parsed.phone, 32);
  const address = sanitize(parsed.address, 200);
  const details = sanitize(parsed.details, 5000);

  if (!firstName || !lastName || !email || !phone || !address || !details) {
    return { ok: false, statusCode: 400, body: "Missing required fields" };
  }
  const heading = `New Booking Request from ${firstName} ${lastName}`;
  return {
    ok: true,
    data: { firstName, lastName, email, phone, address, details, heading },
  };
}

async function sendEmail(params: {
  heading: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  details: string;
}) {
  if (EMAIL_TO.length === 0) {
    throw new Error("No recipients configured");
  }

  const { heading, firstName, lastName, email, phone, address, details } = params;
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

  const textBody = [heading, ...lines].join("\n");
  const htmlBody = `<div style=\"font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;line-height:1.5\">`
    + `<h3>${heading}</h3>`
    + lines.map((l) => (l === "Project Details:" ? `<h3>${l}</h3>` : `<p>${l}</p>`)).join("")
    + `</div>`;

  const cmd = new SendEmailCommand({
    FromEmailAddress: EMAIL_FROM,
    Destination: { ToAddresses: EMAIL_TO },
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
}

async function postToSlack(params: {
  heading: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  details: string;
}) {
  let slackToken: string | undefined = process.env.SLACK_BOT_TOKEN;
  if (!slackToken) {
    try {
      slackToken = (Resource as any).SlackBotToken?.value as string | undefined;
    } catch {
      // ignore; handled below
    }
  }
  const channelId = process.env.SLACK_BOOKING_REQUESTS_CHANNEL_ID;

  if (!slackToken || !channelId) {
    throw new Error("Slack not configured");
  }

  const { heading, firstName, lastName, email, phone, address, details } = params;
  const fallback = [
    heading,
    `Name: ${firstName} ${lastName}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Address: ${address}`,
    details ? `Project Details: ${details}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const blocks: any[] = [
    {
      type: "header",
      text: { type: "plain_text", text: `New Booking Request from ${firstName} ${lastName}`, emoji: true },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Email:*\n${email}` },
        { type: "mrkdwn", text: `*Phone:*\n${phone}` },
        { type: "mrkdwn", text: `*Address:*\n${address}` },
      ],
    },
  ];

  if (details) {
    blocks.push({ type: "divider" });
    blocks.push({ type: "section", text: { type: "mrkdwn", text: `*Project Details:*\n${details}` } });
  }

  const res = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${slackToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: channelId,
      text: fallback,
      blocks,
    }),
  });

  if (!res.ok) {
    throw new Error(`Slack HTTP ${res.status}`);
  }
  const data: any = await res.json().catch(() => ({}));
  if (!data?.ok) {
    throw new Error(`Slack error: ${data?.error || "unknown"}`);
  }
}