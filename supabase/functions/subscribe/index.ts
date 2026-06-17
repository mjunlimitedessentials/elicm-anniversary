// POST /subscribe  { "email": "you@example.com", "source": "landing" }
// Adds a pending subscriber and emails them a double opt-in confirmation link.
import { corsHeaders, json } from "../_shared/cors.ts";
import {
  adminClient,
  functionsBaseUrl,
  isValidEmail,
  sendEmail,
} from "../_shared/clients.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body: { email?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const source = (body.source ?? "web").slice(0, 120);
  if (!isValidEmail(email)) {
    return json({ error: "Please enter a valid email address." }, 400);
  }

  const supabase = adminClient();

  // Upsert: new subscribers land as 'pending'. Re-subscribing someone who had
  // unsubscribed flips them back to pending and re-issues a confirm token.
  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id, status, confirm_token")
    .eq("email", email)
    .maybeSingle();

  let confirmToken: string;

  if (!existing) {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email, source })
      .select("confirm_token")
      .single();
    if (error) return json({ error: "Could not save subscription." }, 500);
    confirmToken = data.confirm_token;
  } else if (existing.status === "confirmed") {
    // Already on the list — succeed quietly, don't re-send.
    return json({ ok: true, message: "You're already subscribed. 🎉" });
  } else {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .update({ status: "pending", unsubscribed_at: null, source })
      .eq("id", existing.id)
      .select("confirm_token")
      .single();
    if (error) return json({ error: "Could not update subscription." }, 500);
    confirmToken = data.confirm_token;
  }

  const confirmUrl = `${functionsBaseUrl()}/confirm?token=${confirmToken}`;

  const result = await sendEmail({
    to: email,
    subject: "Confirm your Everything AI subscription",
    html: confirmEmailHtml(confirmUrl),
  });

  if (!result.ok) {
    // Subscriber is saved; surface a soft error so the UI can still say "check your inbox".
    console.error("confirmation email failed:", result.error);
  }

  return json({
    ok: true,
    message: "Almost there — check your inbox to confirm your subscription.",
  });
});

function confirmEmailHtml(confirmUrl: string): string {
  return `<!doctype html><html><body style="margin:0;background:#0b0f14;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0f14;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#11161d;border:1px solid #1e2733;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:32px 32px 8px;">
          <div style="font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:#5eead4;font-weight:700;">Everything AI</div>
          <h1 style="margin:14px 0 6px;color:#f8fafc;font-size:22px;">Confirm your subscription</h1>
          <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px;">
            Tap the button below to start receiving dispatches on AI, infrastructure, and robotic fitness.
          </p>
          <a href="${confirmUrl}" style="display:inline-block;background:#5eead4;color:#04110d;font-weight:700;font-size:15px;text-decoration:none;padding:13px 26px;border-radius:10px;">Confirm my email →</a>
          <p style="color:#64748b;font-size:12px;line-height:1.6;margin:24px 0 0;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}
