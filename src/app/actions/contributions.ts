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
  points: number;
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
      points: issueData.points,
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
      points: issueData.points,
    },
  });

  // Check if already enrolled or saved
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
  } else if (existing.status === "saved") {
    // If it was previously saved, transition it to active enrollment (Step 0)
    await prisma.contribution.update({
      where: { id: existing.id },
      data: { status: "0" },
    });
  }

  revalidatePath('/dashboard');
  revalidatePath('/journey');
  revalidatePath('/explore');
  revalidatePath(`/issues/${issue.id}`);
  revalidatePath(`/contributions/${issue.id}`);
  return { success: true };
}

export async function saveIssueForLater(issueData: {
  id: string;
  title: string;
  repository: string;
  description: string;
  difficulty: string;
  estimatedEffort?: string;
  languages?: string[];
  technologies?: string[];
  points?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please sign in with GitHub to save issues for later." };
  }
  const userId = session.user.id;

  const points = issueData.points ?? (
    issueData.difficulty === "Beginner" ? 50 :
    issueData.difficulty === "Intermediate" ? 150 : 300
  );

  const issue = await prisma.issue.upsert({
    where: { id: issueData.id },
    update: {
      title: issueData.title,
      repository: issueData.repository,
      description: issueData.description || "",
      difficulty: issueData.difficulty || "Beginner",
      estimatedEffort: issueData.estimatedEffort || "2-4 hours",
      points,
    },
    create: {
      id: issueData.id,
      title: issueData.title,
      repository: issueData.repository,
      description: issueData.description || "",
      difficulty: issueData.difficulty || "Beginner",
      estimatedEffort: issueData.estimatedEffort || "2-4 hours",
      languages: issueData.languages || [],
      technologies: issueData.technologies || [],
      points,
    },
  });

  const existing = await prisma.contribution.findFirst({
    where: { userId, issueId: issue.id },
  });

  if (!existing) {
    await prisma.contribution.create({
      data: {
        userId,
        issueId: issue.id,
        status: "saved",
      },
    });
    revalidatePath('/journey');
    revalidatePath('/explore');
    revalidatePath('/dashboard');
    revalidatePath(`/issues/${issue.id}`);
    return { success: true, saved: true, message: "Issue saved to My Journey -> Saved" };
  } else if (existing.status === "saved") {
    // Toggle: if already saved, remove it from saved
    await prisma.contribution.delete({
      where: { id: existing.id },
    });
    revalidatePath('/journey');
    revalidatePath('/explore');
    revalidatePath('/dashboard');
    revalidatePath(`/issues/${issue.id}`);
    return { success: true, saved: false, message: "Issue removed from Saved" };
  } else if (existing.status !== "merged") {
    // If ongoing/in-progress, update status to saved
    await prisma.contribution.update({
      where: { id: existing.id },
      data: { status: "saved" },
    });
    revalidatePath('/journey');
    revalidatePath('/explore');
    revalidatePath('/dashboard');
    revalidatePath(`/issues/${issue.id}`);
    return { success: true, saved: true, message: "Issue moved to Saved" };
  }

  return { success: true, saved: false, message: "Contribution already completed and merged" };
}

export async function removeSavedIssue(issueId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }
  const userId = session.user.id;

  await prisma.contribution.deleteMany({
    where: {
      userId,
      issueId,
      status: "saved",
    },
  });

  revalidatePath('/journey');
  revalidatePath('/explore');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function advanceContributionStep(issueId: string, currentStep: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const newStep = (currentStep + 1).toString();

  const existing = await prisma.contribution.findFirst({
    where: { userId, issueId },
  });

  if (existing) {
    await prisma.contribution.update({
      where: { id: existing.id },
      data: { status: newStep },
    });
  } else {
    await prisma.contribution.create({
      data: {
        userId,
        issueId,
        status: newStep,
      },
    });
  }

  revalidatePath('/dashboard');
  revalidatePath('/journey');
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

    // 3. Award issue points
    const pointsToAward = issue.points ?? 100;
    await tx.userProfile.update({
      where: { userId },
      data: {
        points: { increment: pointsToAward },
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
