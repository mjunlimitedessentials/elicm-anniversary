// Shared clients & helpers for the newsletter Edge Functions.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

// Service-role client — bypasses RLS. Only ever used server-side inside functions.
export function adminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

// Base URL that the functions are served from, e.g.
// https://<ref>.supabase.co/functions/v1  — used to build confirm/unsubscribe links.
export function functionsBaseUrl(): string {
  const explicit = Deno.env.get("FUNCTIONS_BASE_URL");
  if (explicit) return explicit.replace(/\/$/, "");
  const url = new URL(Deno.env.get("SUPABASE_URL")!);
  return `https://${url.host}/functions/v1`;
}

export const FROM_EMAIL = Deno.env.get("NEWSLETTER_FROM") ??
  "Everything AI <newsletter@example.com>";

export const REPLY_TO = Deno.env.get("NEWSLETTER_REPLY_TO") ?? undefined;

// Send a single email via Resend (https://resend.com).
// Swap this one function out if you prefer Postmark/SendGrid/SES.
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return { ok: false, error: "RESEND_API_KEY not set" };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
      ...(REPLY_TO ? { reply_to: REPLY_TO } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: `Resend ${res.status}: ${text}` };
  }
  return { ok: true };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
