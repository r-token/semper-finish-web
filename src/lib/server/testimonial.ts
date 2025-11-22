import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { Resource } from "sst";

const REGION = process.env.AWS_REGION || "us-east-1";
const EMAIL_FROM = process.env.EMAIL_FROM || "web@semperfinishllc.com";
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

    const { name, projectDetails, dateOfProject, location, selectedOption, additionalComments, signature, heading, dateSubmitted } = parsed.data;

    // Attempt both email + slack regardless of individual failures
    const [emailResult, slackResult] = await Promise.allSettled([
      sendEmail({ heading, name, projectDetails, dateOfProject, location, selectedOption, additionalComments, signature, dateSubmitted }),
      postToSlack({ heading, name, projectDetails, dateOfProject, location, selectedOption, additionalComments, signature, dateSubmitted }),
    ]);

    const errors: string[] = [];

    if (emailResult.status === "rejected") {
      console.error("testimonial email send failed", emailResult.reason);
      errors.push(emailResult.reason?.message || "Email failed");
    }
    if (slackResult.status === "rejected") {
      console.error("testimonial slack post failed", slackResult.reason);
      errors.push(slackResult.reason?.message || "Slack post failed");
    }

    if (errors.length > 0) {
      return { statusCode: 500, body: errors.join("; ") };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err: any) {
    console.error("testimonial error", err);
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
  const headerKey = Object.keys(hdrs).find((key) => key.toLowerCase() === "x-api-key");
  const provided = headerKey ? hdrs[headerKey] : undefined;
  if (!provided || provided !== secret) {
    return { ok: false, statusCode: 403, body: "Forbidden" };
  }
  return { ok: true, data: null };
}

function getConfiguredSecret(): string | undefined {
  let secret: string | undefined = process.env.TESTIMONIAL_API_SECRET;
  if (!secret) {
    try {
      secret = (Resource as any).TestimonialApiSecret?.value as string | undefined;
    } catch {
      // ignore
    }
  }
  return secret;
}

function parseAndValidate(body: string | null | undefined): Result<{
  name: string;
  projectDetails: string;
  dateOfProject: string;
  location: string;
  selectedOption: string;
  additionalComments: string;
  signature: string;
  heading: string;
  dateSubmitted: string;
}> {
  if (!body) {
    return { ok: false, statusCode: 400, body: "Missing body" };
  }
  const parsed = JSON.parse(body);

  const name = sanitize(parsed.name, 200);
  const projectDetails = sanitize(parsed.projectDetails, 2000);
  const dateOfProject = sanitize(parsed.dateOfProject, 100);
  const location = sanitize(parsed.location, 200);
  const selectedOption = sanitize(parsed.selectedOption, 5000);
  const additionalComments = sanitize(parsed.additionalComments, 5000);
  const signature = sanitize(parsed.signature, 200);
  const dateSubmitted = sanitize(parsed.dateSubmitted, 100);

  if (!name || !projectDetails || !dateOfProject || !selectedOption || !signature || !dateSubmitted) {
    return { ok: false, statusCode: 400, body: "Missing required fields" };
  }
  const heading = `New Testimonial from ${name}`;
  return {
    ok: true,
    data: { name, projectDetails, dateOfProject, location, selectedOption, additionalComments, signature, heading, dateSubmitted },
  };
}

async function sendEmail(params: {
  heading: string;
  name: string;
  projectDetails: string;
  dateOfProject: string;
  location: string;
  selectedOption: string;
  additionalComments: string;
  signature: string;
  dateSubmitted: string;
}) {
  if (EMAIL_TO.length === 0) {
    throw new Error("No recipients configured");
  }

  const { heading, name, projectDetails, dateOfProject, location, selectedOption, additionalComments, signature, dateSubmitted } = params;
  const subject = `New Testimonial - ${name}`;

  const lines = [
    `Name: ${name}`,
    `Project Details: ${projectDetails}`,
    `Date of Project: ${dateOfProject}`,
    location ? `Location: ${location}` : "",
    `Date Submitted: ${dateSubmitted}`,
    "",
    "Testimonial:",
    selectedOption,
    additionalComments ? "" : "",
    additionalComments ? "Additional Comments:" : "",
    additionalComments ? additionalComments : "",
    "",
    `Signature: ${signature}`,
  ].filter(Boolean);

  const textBody = [heading, ...lines].join("\n");
  const htmlBody = `<div style=\"font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;line-height:1.5\">`
    + `<h3>${heading}</h3>`
    + lines.map((line) => {
      if (line === "Testimonial:" || line === "Additional Comments:") {
        return `<h3 style=\"margin-top:20px\">${line}</h3>`;
      }
      return `<p>${line}</p>`;
    }).join("")
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
  name: string;
  projectDetails: string;
  dateOfProject: string;
  location: string;
  selectedOption: string;
  additionalComments: string;
  signature: string;
  dateSubmitted: string;
}) {
  let slackToken: string | undefined = process.env.SLACK_BOT_TOKEN;
  if (!slackToken) {
    try {
      slackToken = (Resource as any).SlackBotToken?.value as string | undefined;
    } catch {
      // ignore; handled below
    }
  }
  const channelId = process.env.SLACK_TESTIMONIALS_CHANNEL_ID;

  if (!slackToken || !channelId) {
    throw new Error("Slack not configured");
  }

  const { heading, name, projectDetails, dateOfProject, location, selectedOption, additionalComments, signature, dateSubmitted } = params;
  const fallback = [
    heading,
    `Name: ${name}`,
    `Project Details: ${projectDetails}`,
    `Date of Project: ${dateOfProject}`,
    location ? `Location: ${location}` : "",
    `Date Submitted: ${dateSubmitted}`,
    `Testimonial: ${selectedOption}`,
    additionalComments ? `Additional Comments: ${additionalComments}` : "",
    `Signature: ${signature}`,
  ]
    .filter(Boolean)
    .join("\n");

  const blocks: any[] = [
    {
      type: "header",
      text: { type: "plain_text", text: `New Testimonial from ${name}`, emoji: true },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Project Details:*\n${projectDetails}` },
        { type: "mrkdwn", text: `*Date of Project:*\n${dateOfProject}` },
      ],
    },
  ];

  if (location) {
    blocks.push({
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Location:*\n${location}` },
        { type: "mrkdwn", text: `*Date Submitted:*\n${dateSubmitted}` },
      ],
    });
  } else {
    blocks.push({
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Date Submitted:*\n${dateSubmitted}` },
      ],
    });
  }

  blocks.push({ type: "divider" });
  blocks.push({ type: "section", text: { type: "mrkdwn", text: `*Testimonial:*\n${selectedOption}` } });

  if (additionalComments) {
    blocks.push({ type: "divider" });
    blocks.push({ type: "section", text: { type: "mrkdwn", text: `*Additional Comments:*\n${additionalComments}` } });
  }

  blocks.push({ type: "divider" });
  blocks.push({ type: "section", text: { type: "mrkdwn", text: `*Signature:*\n${signature}` } });

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
