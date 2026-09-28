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

  const { name, email, sport, schoolOrTeam, instagram, tiktok, notes } = body || {};

  if (!name || !email || !sport) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const apiKey = process.env.KIT_API_KEY;

  if (!apiKey) {
    console.log("[athlete-audit-submit] KIT_API_KEY not set — logging submission instead of sending to Kit:", {
      name,
      email,
      sport,
      schoolOrTeam,
      instagram,
      tiktok,
      notes
    });
    res.status(200).json({ success: true, stub: true });
    return;
  }

  try {
    await subscribeWithTags({
      email,
      firstName: name,
      fields: {
        sport: sport || "",
        school_or_team: schoolOrTeam || "",
        instagram: instagram || "",
        tiktok: tiktok || "",
        notes: notes || ""
      },
      tags: ["athlete", "audit-request"]
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("[athlete-audit-submit] Kit error:", err);
    res.status(502).json({ error: "Failed to submit to email provider" });
  }
};
