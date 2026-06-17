# Everything AI — Newsletter (Supabase-powered)

A self-contained newsletter system: subscribers sign up, double opt-in by email,
and issues are blasted to confirmed subscribers — all on a single Supabase project.

- **Topics:** Applied AI · Infrastructure · Robotic Fitness
- **Supabase project:** `ThinkBox AI Operation Systems 202606` (ref `wujsdplmnorwmoltwdut`)

## What's here

| Path | Purpose |
|------|---------|
| `supabase/migrations/20260617000000_newsletter.sql` | Tables (`newsletter_subscribers`, `newsletter_issues`, `newsletter_sends`) + RLS |
| `supabase/functions/subscribe` | Public endpoint: capture email, send confirmation |
| `supabase/functions/confirm` | Double opt-in confirmation link |
| `supabase/functions/unsubscribe` | One-click unsubscribe link |
| `supabase/functions/send-issue` | Admin endpoint: blast a stored issue to confirmed subscribers |
| `newsletter/index.html` | Branded signup landing page |
| `newsletter/issues/issue-001.html` | Issue 001 (email-ready HTML) |

## Architecture

```
 Visitor → newsletter/index.html → POST /subscribe ─┐
                                                     ├─ inserts 'pending' subscriber
        confirmation email  ←─ Resend ←─────────────┘
 Visitor clicks link → GET /confirm → status = 'confirmed'

 You → POST /send-issue {slug} → loads issue HTML
                               → loops confirmed subscribers
                               → Resend sends, logs to newsletter_sends
```

All DB access happens inside Edge Functions using the **service-role key**, which
bypasses RLS. The `anon`/`authenticated` roles get no direct table access.

## Setup

### 1. Apply the schema
Run the migration against the project (via Supabase CLI `supabase db push`, the
SQL editor, or the MCP `apply_migration` tool).

### 2. Set function secrets
```bash
supabase secrets set \
  RESEND_API_KEY=re_xxxxxxxx \
  NEWSLETTER_FROM="Everything AI <newsletter@yourdomain.com>" \
  ADMIN_SECRET="$(openssl rand -hex 24)"
# SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.
# Optional: NEWSLETTER_REPLY_TO, FUNCTIONS_BASE_URL
```
> Email is sent through [Resend](https://resend.com). Verify your sending domain
> first. To use Postmark/SendGrid/SES instead, swap the `sendEmail()` function
> in `supabase/functions/_shared/clients.ts`.

### 3. Deploy the functions
```bash
# Public functions: no JWT so the browser/links work without a token.
supabase functions deploy subscribe   --no-verify-jwt
supabase functions deploy confirm     --no-verify-jwt
supabase functions deploy unsubscribe --no-verify-jwt
# Admin function: keep JWT off but it's guarded by the x-admin-secret header.
supabase functions deploy send-issue  --no-verify-jwt
```

### 4. Wire up the signup page
In `newsletter/index.html`, `SUBSCRIBE_URL` already points at the project. If you
deploy `subscribe` **without** `--no-verify-jwt`, also set `SUPABASE_ANON_KEY`.

## Loading an issue

Insert the issue HTML into `newsletter_issues` (the `send-issue` function reads
from there). Using `psql` / SQL editor with dollar-quoting so the HTML needs no escaping:

```sql
insert into public.newsletter_issues (slug, subject, preheader, html)
values (
  'issue-001',
  'Everything AI 001 — ships, scales, spots you',
  'AI that ships, infrastructure that scales, and robots that spot your deadlift.',
  $html$ <!-- paste the contents of newsletter/issues/issue-001.html here --> $html$
)
on conflict (slug) do update
  set subject = excluded.subject,
      preheader = excluded.preheader,
      html = excluded.html;
```

The `{{unsubscribe_url}}` token in the HTML is replaced per-recipient at send time.

## Sending an issue

```bash
curl -X POST https://wujsdplmnorwmoltwdut.supabase.co/functions/v1/send-issue \
  -H "x-admin-secret: $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"slug":"issue-001"}'
```

Response: `{ recipients, sent, failed, skipped_already_sent }`. The call is
**idempotent** — re-running skips anyone already sent that issue (enforced by a
unique `(issue_id, subscriber_id)` constraint), so it's safe to retry.

## Test before a real send

1. Subscribe yourself via the landing page and confirm.
2. Send issue-001 — you should be the only confirmed recipient.
3. Check the `newsletter_sends` table for the delivery log.
