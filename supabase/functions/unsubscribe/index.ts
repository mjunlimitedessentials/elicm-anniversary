// GET /unsubscribe?token=<unsubscribe_token>
// One-click unsubscribe (links are embedded in every issue).
import { corsHeaders, html } from "../_shared/cors.ts";
import { adminClient } from "../_shared/clients.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const token = new URL(req.url).searchParams.get("token") ?? "";
  if (!token) return html(page("Invalid link", "This unsubscribe link is missing its token."), 400);

  const supabase = adminClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .select("email")
    .maybeSingle();

  if (error || !data) {
    return html(page("Already removed", "This address isn't on our list, or the link has already been used."), 404);
  }

  return html(page("You're unsubscribed", "You won't receive any more emails from Everything AI. Sorry to see you go."));
});

function page(title: string, message: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title></head>
  <body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0b0f14;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:460px;margin:24px;padding:40px 32px;background:#11161d;border:1px solid #1e2733;border-radius:18px;text-align:center;">
      <div style="font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:#94a3b8;font-weight:700;">Everything AI</div>
      <h1 style="color:#f8fafc;font-size:26px;margin:16px 0 10px;">${title}</h1>
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0;">${message}</p>
    </div>
  </body></html>`;
}
