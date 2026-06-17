// Shared CORS headers for browser-facing Edge Functions.
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function html(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
  });
}
