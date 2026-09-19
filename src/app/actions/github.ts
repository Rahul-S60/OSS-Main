"use server";

import { Issue, IssueDifficulty } from "@/data/issues";

export async function fetchRecommendedIssues(): Promise<Issue[]> {
  try {
    // Fetch real open issues labeled "good first issue"
    const response = await fetch(
      'https://api.github.com/search/issues?q=is:issue+is:open+label:"good first issue"&sort=created&order=desc&per_page=12',
      { next: { revalidate: 3600 } } // Cache for 1 hour to avoid rate limits
    );

    if (!response.ok) {
      console.error("Failed to fetch issues from GitHub", await response.text());
      return [];
    }

    const data = await response.json();

    // Map GitHub API response to our UI Issue model
    return data.items.map((item: any): Issue => {
      // Extract repo name from repository_url (e.g. https://api.github.com/repos/facebook/react -> facebook/react)
      const repoUrlParts = item.repository_url.split('/');
      const repository = `${repoUrlParts[repoUrlParts.length - 2]}/${repoUrlParts[repoUrlParts.length - 1]}`;

      return {
        id: item.id.toString(),
        repository: repository,
        title: item.title,
        description: item.body ? item.body.substring(0, 200) + '...' : 'No description provided.',
        difficulty: "Beginner" as IssueDifficulty,
        matchScore: Math.floor(Math.random() * (95 - 75 + 1)) + 75, // Simulated match score
        languages: item.labels.map((l: any) => l.name).filter((l: string) => !l.includes(":")).slice(0, 2) || ["JavaScript"],
        technologies: [],
        labels: item.labels.map((l: any) => l.name).slice(0, 3),
        estimatedEffort: "2-4 hours", // Simulated
        activity: "Active repository", // Simulated
        enrolled: false,
        reason: "This issue has the 'good first issue' label, making it perfect for your current skill level.",
        comments: item.comments || 0,
        contributors: Math.floor(Math.random() * 500) + 10, // Simulated
        url: item.html_url,
      };
    });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return [];
  }
}
