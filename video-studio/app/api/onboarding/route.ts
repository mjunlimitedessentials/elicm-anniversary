import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/current-user";

export async function POST(req: Request) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { quizAnswers, ministryName, ministrySize, brandColor, plan, completed } = body as {
    quizAnswers?: Record<string, string[]>;
    ministryName?: string;
    ministrySize?: string;
    brandColor?: string;
    plan?: string;
    completed?: boolean;
  };

  const existing = await db.onboardingResponse.findUnique({ where: { userId: user.id } });

  const response = await db.onboardingResponse.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      quizAnswers: quizAnswers ?? {},
      ministryName,
      ministrySize,
      brandColor,
      plan,
      completedAt: completed ? new Date() : null,
    },
    update: {
      quizAnswers: quizAnswers ?? existing?.quizAnswers ?? {},
      ...(ministryName !== undefined && { ministryName }),
      ...(ministrySize !== undefined && { ministrySize }),
      ...(brandColor !== undefined && { brandColor }),
      ...(plan !== undefined && { plan }),
      ...(completed && { completedAt: new Date() }),
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
