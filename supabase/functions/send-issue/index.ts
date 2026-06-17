// POST /send-issue  { "slug": "issue-001" }
// Header:  x-admin-secret: <ADMIN_SECRET>
//
// Blasts a stored issue to every CONFIRMED subscriber who hasn't already been
// sent it. Each email gets a personalized unsubscribe link by replacing the
// {{unsubscribe_url}} token in the issue HTML. Safe to re-run: the unique
// (issue_id, subscriber_id) constraint means already-sent people are skipped.
import { corsHeaders, json } from "../_shared/cors.ts";
import {
  adminClient,
  functionsBaseUrl,
  sendEmail,
} from "../_shared/clients.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // --- Admin auth -----------------------------------------------------------
  const expected = Deno.env.get("ADMIN_SECRET");
  if (!expected || req.headers.get("x-admin-secret") !== expected) {
    return json({ error: "Unauthorized" }, 401);
  }

  let body: { slug?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const slug = (body.slug ?? "").trim();
  if (!slug) return json({ error: "Missing 'slug'." }, 400);

  const supabase = adminClient();

  // --- Load the issue -------------------------------------------------------
  const { data: issue, error: issueErr } = await supabase
    .from("newsletter_issues")
    .select("id, slug, subject, html, status")
    .eq("slug", slug)
    .maybeSingle();
  if (issueErr || !issue) return json({ error: `Issue '${slug}' not found.` }, 404);

  await supabase.from("newsletter_issues")
    .update({ status: "sending" }).eq("id", issue.id);

  // --- Recipients: confirmed, minus anyone already sent this issue ----------
  const { data: alreadySent } = await supabase
    .from("newsletter_sends")
    .select("subscriber_id")
    .eq("issue_id", issue.id);
  const sentIds = new Set((alreadySent ?? []).map((r) => r.subscriber_id));

  const { data: subscribers, error: subErr } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, unsubscribe_token")
    .eq("status", "confirmed");
  if (subErr) return json({ error: "Could not load subscribers." }, 500);

  const recipients = (subscribers ?? []).filter((s) => !sentIds.has(s.id));

  // --- Send -----------------------------------------------------------------
  let sent = 0;
  let failed = 0;
  for (const sub of recipients) {
    const unsubUrl = `${functionsBaseUrl()}/unsubscribe?token=${sub.unsubscribe_token}`;
    const personalized = issue.html.replaceAll("{{unsubscribe_url}}", unsubUrl);

    const result = await sendEmail({
      to: sub.email,
      subject: issue.subject,
      html: personalized,
    });

    await supabase.from("newsletter_sends").insert({
      issue_id: issue.id,
      subscriber_id: sub.id,
      email: sub.email,
      status: result.ok ? "sent" : "failed",
      error: result.ok ? null : result.error,
    });

    if (result.ok) sent++;
    else failed++;
  }

  await supabase.from("newsletter_issues")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", issue.id);

  return json({
    ok: true,
    slug: issue.slug,
    recipients: recipients.length,
    sent,
    failed,
    skipped_already_sent: sentIds.size,
  });
});
