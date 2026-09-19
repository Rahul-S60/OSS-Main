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

  // Fetch the user's active/completed contributions
  const contributions = await prisma.contribution.findMany({
    where: { userId },
    include: { issue: true },
    orderBy: { updatedAt: 'desc' },
  });

  // Calculate true points based on merged PRs by summing the issue points
  const mergedContributions = contributions.filter(c => c.status === "merged");
  const mergedCount = mergedContributions.length;
  const expectedPoints = mergedContributions.reduce((total, c) => total + (c.issue.points ?? 100), 0);
  
  // Auto-sync profile points if out of date
  if (profile.points !== expectedPoints) {
    profile = await prisma.userProfile.update({
      where: { userId },
      data: { points: expectedPoints }
    });
  }

  // Fetch the user's achievements
  let achievements = await prisma.achievement.findMany({
    where: { userId },
    select: { badgeId: true },
  });

  // Auto-award badges based on activity
  const unlockedSet = new Set(achievements.map((a: { badgeId: string }) => a.badgeId));
  const newBadges = [];
  
  if (contributions.length > 0 && !unlockedSet.has("first_issue")) newBadges.push("first_issue");
  if (mergedCount > 0 && !unlockedSet.has("first_pr")) newBadges.push("first_pr");
  if (mergedCount >= 3 && !unlockedSet.has("three_prs")) newBadges.push("three_prs");
  if (mergedCount >= 10 && !unlockedSet.has("contributions_10")) newBadges.push("contributions_10");
  if (mergedCount >= 50 && !unlockedSet.has("contributions_50")) newBadges.push("contributions_50");
  if (mergedCount >= 100 && !unlockedSet.has("contributions_100")) newBadges.push("contributions_100");

  const streak = profile.streak;
  if (streak >= 7 && !unlockedSet.has("week_warrior")) newBadges.push("week_warrior");
  if (streak >= 50 && !unlockedSet.has("streak_50")) newBadges.push("streak_50");
  if (streak >= 100 && !unlockedSet.has("streak_100")) newBadges.push("streak_100");
  if (streak >= 200 && !unlockedSet.has("streak_200")) newBadges.push("streak_200");

  if (newBadges.length > 0) {
    await prisma.achievement.createMany({
      data: newBadges.map(badgeId => ({ userId, badgeId }))
    });
    newBadges.forEach(b => unlockedSet.add(b));
  }

  const result = {
    ...profile,
    unlockedBadges: Array.from(unlockedSet),
    contributions,
    prMerged: mergedCount > 0,
    issueEnrolled: contributions.length > 0,
    onboardingCompleted: true,
  };

  // Serialize to avoid Prisma object serialization errors in Client Components
  return JSON.parse(JSON.stringify(result));
}

export async function updateUserProfileDetails(
  name: string, 
  bio: string,
  experienceLevel: string = "Beginner",
  languages: string[] = []
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const userId = session.user.id;

  // Update name in User table
  await prisma.user.update({
    where: { id: userId },
    data: { name },
  });

  // Update bio, experience, and skills in UserProfile table
  await prisma.userProfile.update({
    where: { userId },
    data: { 
      bio,
      experienceLevel,
      languages
    },
  });

  return { success: true };
}

