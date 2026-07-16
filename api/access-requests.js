const ALLOWED_VOLUMES = new Set([
  "1-5 reviews / month",
  "6-20 reviews / month",
  "21-50 reviews / month",
  "50+ reviews / month",
]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  const body = request.body && typeof request.body === "object" ? request.body : {};
  if (normalizeOptional(body.website)) {
    response.status(201).json({ received: true });
    return;
  }

  const email = normalizeText(body.email);
  const organization = normalizeText(body.organization);
  const role = normalizeText(body.role);
  const volume = normalizeText(body.volume);
  const review = normalizeOptional(body.review);
  const sourcePath = normalizeOptional(body.sourcePath) || "/";

  if (!email || !organization || !role || !volume) {
    response.status(400).json({ error: "Work email, organization, role, and review volume are required." });
    return;
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    response.status(400).json({ error: "Enter a valid work email address." });
    return;
  }
  if (!ALLOWED_VOLUMES.has(volume)) {
    response.status(400).json({ error: "Choose a valid review volume." });
    return;
  }
  if (organization.length > 160 || role.length > 120 || (review?.length || 0) > 1200 || sourcePath.length > 200) {
    response.status(400).json({ error: "One or more fields are too long." });
    return;
  }

  const webhookUrl = process.env.ACCESS_REQUEST_WEBHOOK_URL;
  if (!webhookUrl) {
    response.status(503).json({ error: "Request delivery is not configured yet." });
    return;
  }

  let webhookResponse;
  try {
    webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.ACCESS_REQUEST_WEBHOOK_SECRET
          ? { Authorization: `Bearer ${process.env.ACCESS_REQUEST_WEBHOOK_SECRET}` }
          : {}),
      },
      body: JSON.stringify({
        type: "rulix.access-request.created",
        receivedAt: new Date().toISOString(),
        request: {
          email: email.toLowerCase(),
          organization,
          role,
          volume,
          review,
          sourcePath,
        },
      }),
    });
  } catch {
    response.status(502).json({ error: "We could not deliver your request. Please try again." });
    return;
  }

  if (!webhookResponse.ok) {
    response.status(502).json({ error: "We could not deliver your request. Please try again." });
    return;
  }

  response.status(201).json({
    received: true,
    message: "Request received. We will reply within one business day.",
  });
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptional(value) {
  const normalized = normalizeText(value);
  return normalized || undefined;
}
