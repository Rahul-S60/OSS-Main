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
  const username = (session.user as any).username;

  // 1. Get the issue to find the repository name
  const issue = await prisma.issue.findUnique({ where: { id: issueId } });
  if (!issue) throw new Error("Issue not found");

  // e.g., "vercel/next.js" -> "next.js"
  const repoName = issue.repository.split('/').pop();
  
  if (repoName && username) {
    // Check if user has this repo
    try {
      const res = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        }
      });
      if (!res.ok) {
        return { error: `Cannot find the merged repo '${repoName}' in your GitHub account. Did you fork it?` };
      }
    } catch (e) {
      return { error: "Failed to verify repository with GitHub API." };
    }
  }

  // Use a transaction to mark merged, award points, and give a badge
  await prisma.$transaction(async (tx) => {
    // 2. Mark as merged
    await tx.contribution.updateMany({
      where: { userId, issueId },
      data: { status: "merged" },
    });

    // 3. Award 100 points
    await tx.userProfile.update({
      where: { userId },
      data: {
        points: { increment: 100 },
      },
    });

    // 4. Check if first merge badge exists, if not award it
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
  return { success: true };
}
