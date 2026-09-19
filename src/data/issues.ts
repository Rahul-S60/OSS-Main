export type IssueDifficulty = "Beginner" | "Intermediate" | "Advanced";

export type Issue = {
  id: string;
  repository: string;
  title: string;
  description: string;
  difficulty: IssueDifficulty;
  matchScore: number;
  languages: string[];
  technologies: string[];
  labels: string[];
  estimatedEffort: string;
  activity: string;
  enrolled: boolean;
  reason: string;
  comments: number;
  contributors: number;
  url?: string;
};

export const issues: Issue[] = [];
