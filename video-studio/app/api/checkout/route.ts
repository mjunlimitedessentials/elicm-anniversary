import { NextResponse } from "next/server";
import { z } from "zod";
import { getOrCreateUser } from "@/lib/current-user";
import { getBillingProvider } from "@/lib/billing-provider";

const BodySchema = z.object({ planId: z.string().min(1) });

export async function POST(req: Request) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = BodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "";
  const provider = getBillingProvider();

  const session = await provider.createCheckoutSession({
    planId: parsed.data.planId,
    successUrl: `${origin}/dashboard?checkout=success`,
    cancelUrl: `${origin}/onboarding/plan`,
  });

  return NextResponse.json(session);
}
