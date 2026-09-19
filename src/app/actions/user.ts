"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getUserProfile() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  const userId = session.user.id;

  // Verify the user exists in the database (handles stale sessions if DB was reset)
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return null;
  }

  // Attempt to find the user profile
  let profile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  // If not found, create a default profile (fallback in case the NextAuth event didn't fire)
  if (!profile) {
    profile = await prisma.userProfile.create({
      data: {
        userId,
        points: 0,
        streak: 0,
      },
    });
  }

  // Fetch the user's achievements
  const achievements = await prisma.achievement.findMany({
    where: { userId },
    select: { badgeId: true },
  });

  // Fetch the user's active/completed contributions
  const contributions = await prisma.contribution.findMany({
    where: { userId },
    include: { issue: true },
    orderBy: { updatedAt: 'desc' },
  });

  const result = {
    ...profile,
    unlockedBadges: achievements.map((a) => a.badgeId),
    contributions,
    prMerged: contributions.some((c) => c.status === "merged"),
    issueEnrolled: contributions.length > 0,
    onboardingCompleted: true,
  };

  // Serialize to avoid Prisma object serialization errors in Client Components
  return JSON.parse(JSON.stringify(result));
}
