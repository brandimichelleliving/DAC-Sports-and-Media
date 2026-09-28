// Minimal Kit (ConvertKit) v4 API client.
// Docs: https://developers.kit.com/v4 — verify endpoint shapes against the
// current docs once a real KIT_API_KEY is available; this was written from
// general knowledge of the v4 API and has not been tested against a live account.

const KIT_API_BASE = "https://api.kit.com/v4";

async function kitRequest(path, options) {
  const apiKey = process.env.KIT_API_KEY;
  const res = await fetch(KIT_API_BASE + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Kit-Api-Key": apiKey,
      ...(options && options.headers ? options.headers : {})
    }
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error("Kit API error " + res.status + ": " + JSON.stringify(data));
    err.status = res.status;
    throw err;
  }

  return data;
}

async function upsertSubscriber({ email, firstName, fields }) {
  return kitRequest("/subscribers", {
    method: "POST",
    body: JSON.stringify({
      email_address: email,
      first_name: firstName,
      fields: fields || {}
    })
  });
}

let tagCache = null;

async function getTagIdByName(name) {
  if (!tagCache) {
    const data = await kitRequest("/tags", { method: "GET" });
    tagCache = data.tags || [];
  }
  const match = tagCache.find(function (t) {
    return t.name && t.name.toLowerCase() === name.toLowerCase();
  });
  return match ? match.id : null;
}

async function tagSubscriber(email, tagName) {
  const tagId = await getTagIdByName(tagName);
  if (!tagId) {
    console.warn(
      'Kit tag "' + tagName + '" was not found in this account — skipping. ' +
      "Create a tag with this exact name in Kit, then resubmit."
    );
    return;
  }
  await kitRequest("/tags/" + tagId + "/subscribers", {
    method: "POST",
    body: JSON.stringify({ email_address: email })
  });
}

// Upserts a subscriber and best-effort applies each named tag.
// Throws if the subscriber upsert itself fails; a missing/unmatched tag is
// logged and skipped rather than failing the whole submission.
async function subscribeWithTags({ email, firstName, fields, tags }) {
  await upsertSubscriber({ email, firstName, fields });
  for (const tag of tags || []) {
    await tagSubscriber(email, tag);
  }
}

module.exports = { subscribeWithTags };
