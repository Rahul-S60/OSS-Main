"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function enrollInIssue(issueData: {
  id: string;
  title: string;
  repository: string;
  description: string;
  difficulty: string;
  estimatedEffort: string;
  languages: string[];
  technologies: string[];
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  // Ensure the issue exists in our DB so we can link to it
  const issue = await prisma.issue.upsert({
    where: { id: issueData.id },
    update: {
      title: issueData.title,
      repository: issueData.repository,
      description: issueData.description,
      difficulty: issueData.difficulty,
      estimatedEffort: issueData.estimatedEffort,
    },
    create: {
      id: issueData.id,
      title: issueData.title,
      repository: issueData.repository,
      description: issueData.description,
      difficulty: issueData.difficulty,
      estimatedEffort: issueData.estimatedEffort,
      languages: issueData.languages,
      technologies: issueData.technologies,
    },
  });

  // Check if already enrolled
  const existing = await prisma.contribution.findFirst({
    where: { userId, issueId: issue.id },
  });

  if (!existing) {
    await prisma.contribution.create({
      data: {
        userId,
        issueId: issue.id,
        status: "0", // 0 represents Step 0 (Enrolled)
      },
    });
  }

  revalidatePath('/dashboard');
  revalidatePath(`/contributions/${issue.id}`);
  return { success: true };
}

export async function advanceContributionStep(issueId: string, currentStep: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const newStep = (currentStep + 1).toString();

  await prisma.contribution.updateMany({
    where: { userId, issueId },
    data: { status: newStep },
  });

  revalidatePath('/dashboard');
  revalidatePath(`/contributions/${issueId}`);
}

export async function submitPullRequest(issueId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  await prisma.contribution.updateMany({
    where: { userId, issueId },
    data: { status: "pr_submitted" }, // Or step 5
  });

  revalidatePath('/dashboard');
  revalidatePath(`/contributions/${issueId}`);
}

export async function mergePullRequest(issueId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  // Use a transaction to mark merged, award points, and give a badge
  await prisma.$transaction(async (tx) => {
    // 1. Mark as merged
    await tx.contribution.updateMany({
      where: { userId, issueId },
      data: { status: "merged" },
    });

    // 2. Award 100 points
    await tx.userProfile.update({
      where: { userId },
      data: {
        points: { increment: 100 },
      },
    });

    // 3. Check if first merge badge exists, if not award it
    const existingBadge = await tx.achievement.findFirst({
      where: { userId, badgeId: "first_merge" },
    });

    if (!existingBadge) {
      await tx.achievement.create({
        data: {
          userId,
          badgeId: "first_merge",
        },
      });
    }
  });

  revalidatePath('/dashboard');
  revalidatePath(`/contributions/${issueId}`);
}
