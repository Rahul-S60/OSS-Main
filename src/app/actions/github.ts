"use server";

import { Issue, IssueDifficulty } from "@/data/issues";

export async function fetchRecommendedIssues(): Promise<Issue[]> {
  try {
    // Fetch real open issues labeled "help wanted" to get a broad mix
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "OpenSource-Companion",
    };
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(
      'https://api.github.com/search/issues?q=is:issue+is:open+label:"help wanted"&sort=updated&order=desc&per_page=30',
      {
        headers,
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch issues from GitHub", await response.text());
      return [];
    }

    const data = await response.json();

    // Map GitHub API response to our UI Issue model
    return data.items.map((item: any, index: number): Issue => {
      // Extract repo name from repository_url
      const repoUrlParts = item.repository_url.split('/');
      const repository = `${repoUrlParts[repoUrlParts.length - 2]}/${repoUrlParts[repoUrlParts.length - 1]}`;

      // Determine difficulty based on labels or distribute evenly
      const labelNames = item.labels.map((l: any) => l.name.toLowerCase());
      let difficulty: IssueDifficulty = "Intermediate";
      
      if (labelNames.includes("good first issue") || labelNames.includes("first-timers-only")) {
        difficulty = "Beginner";
      } else if (labelNames.includes("enhancement") || labelNames.includes("feature")) {
        difficulty = "Advanced";
      } else {
        // Fallback to distribute if there are too many intermediates
        if (index % 3 === 0) difficulty = "Beginner";
        else if (index % 3 === 1) difficulty = "Intermediate";
        else difficulty = "Advanced";
      }

      return {
        id: item.id.toString(),
        repository: repository,
        title: item.title,
        description: item.body ? item.body.substring(0, 200) + '...' : 'No description provided.',
        difficulty: difficulty,
        matchScore: Math.floor(Math.random() * (95 - 75 + 1)) + 75,
        languages: item.labels.map((l: any) => l.name).filter((l: string) => !l.includes(":")).slice(0, 2) || ["JavaScript"],
        technologies: [],
        labels: item.labels.map((l: any) => l.name).slice(0, 3),
        estimatedEffort: difficulty === "Beginner" ? "1-3 hours" : difficulty === "Intermediate" ? "3-8 hours" : "1-3 days",
        activity: "Active repository",
        enrolled: false,
        reason: "This issue has the 'good first issue' label, making it perfect for your current skill level.",
        comments: item.comments || 0,
        contributors: Math.floor(Math.random() * 500) + 10, // Simulated
        url: item.html_url,
        points: difficulty === "Beginner" ? 50 : difficulty === "Intermediate" ? 150 : 300,
      };
    });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return [];
  }
}
