"use server";

import { prisma } from "@/lib/prisma";

export async function getTopUsers(limit = 50) {
  // Fetch profiles sorted by points descending
  const profiles = await prisma.userProfile.findMany({
    orderBy: [
      { points: 'desc' },
      { streak: 'desc' },
    ],
    take: limit,
    include: {
      user: {
        include: {
          contributions: {
            where: { status: 'merged' },
            select: { id: true }
          }
        }
      }
    }
  });

  type LeaderboardProfile = {
    userId: string;
    points: number;
    streak: number;
    github_username: string | null;
    user: {
      name: string | null;
      image: string | null;
      contributions: { id: string }[];
    };
  };

  // Map to a clean structure expected by the leaderboard
  const result = profiles.map((p: LeaderboardProfile, index: number) => {
    const mergedCount = p.user.contributions.length;

    return {
      id: p.userId,
      rank: index + 1,
      name: p.user.name || "Contributor",
      handle: p.github_username ? `@${p.github_username}` : p.user.name ? `@${p.user.name.replace(/\s+/g, '').toLowerCase()}` : "@contributor",
      avatar: p.user.image || "https://github.com/ghost.png",
      points: p.points,
      streak: p.streak,
      merged: mergedCount
    };
  });

  return result;
}
