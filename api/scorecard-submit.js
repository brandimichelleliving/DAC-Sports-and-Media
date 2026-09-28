const { subscribeWithTags } = require("./_lib/kit");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  let body = req.body;
  if (!body || typeof body === "string") {
    try {
      body = JSON.parse(body || "{}");
    } catch (e) {
      body = {};
    }
  }

  const { firstName, email, sport, handle, score, band, newsletterOptIn } = body || {};

  if (!firstName || !email || typeof score !== "number" || !band) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const apiKey = process.env.KIT_API_KEY;

  if (!apiKey) {
    console.log("[scorecard-submit] KIT_API_KEY not set — logging submission instead of sending to Kit:", {
      firstName,
      email,
      sport,
      handle,
      score,
      band,
      newsletterOptIn
    });
    res.status(200).json({ success: true, stub: true });
    return;
  }

  try {
    const tags = ["athlete", "scorecard"];
    if (newsletterOptIn) tags.push("newsletter-optin");

    await subscribeWithTags({
      email,
      firstName,
      fields: {
        sport: sport || "",
        social_handle: handle || "",
        scorecard_score: String(score),
        scorecard_band: band
      },
      tags
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("[scorecard-submit] Kit error:", err);
    res.status(502).json({ error: "Failed to submit to email provider" });
  }
};
