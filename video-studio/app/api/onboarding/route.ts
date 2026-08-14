import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/current-user";

export async function POST(req: Request) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { quizAnswers, plan } = body as {
    quizAnswers?: Record<string, string[]>;
    plan?: string;
  };

  const existing = await db.onboardingResponse.findUnique({ where: { userId: user.id } });

  const response = await db.onboardingResponse.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      quizAnswers: quizAnswers ?? {},
      plan,
    },
    update: {
      quizAnswers: quizAnswers ?? existing?.quizAnswers ?? {},
      ...(plan !== undefined && { plan }),
    },
  });

  return NextResponse.json(response);
}

export async function GET() {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const response = await db.onboardingResponse.findUnique({ where: { userId: user.id } });
  return NextResponse.json(response);
}
