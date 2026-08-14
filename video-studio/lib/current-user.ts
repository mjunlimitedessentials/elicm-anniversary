import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

/**
 * Ensures a local User row exists for the signed-in Clerk user and returns it.
 * Call this from server components / route handlers that need the DB user.
 */
export async function getOrCreateUser() {
  const { userId } = auth();
  if (!userId) return null;

  const existing = await db.user.findUnique({ where: { clerkId: userId } });
  if (existing) return existing;

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? "";

  return db.user.create({
    data: { clerkId: userId, email },
  });
}
