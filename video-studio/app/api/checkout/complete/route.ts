import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/current-user";

// Only used by the mock billing provider — a real Stripe integration
// should complete via a checkout.session.completed webhook instead, since
// this route trusts the client's say-so that payment happened.
export async function POST() {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const response = await db.onboardingResponse.update({
    where: { userId: user.id },
    data: { checkoutCompletedAt: now, completedAt: now },
  });

  return NextResponse.json(response);
}
