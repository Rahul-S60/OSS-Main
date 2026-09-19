export type AchievementCategory = 'streak' | 'contributions' | 'general';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  howToAchieve: string;
  points: number;
  icon: string;
  category: AchievementCategory;
};

export const achievements: Achievement[] = [
  // GENERAL
  {
    id: "first_issue",
    title: "First Step",
    description: "Enroll in your first open-source issue.",
    howToAchieve: "Simply explore the issues tab and click 'Enroll' on any issue to earn this badge.",
    points: 25,
    icon: "Footprints",
    category: "general"
  },
  {
    id: "open_source_hero",
    title: "Open Source Hero",
    description: "Reach top 100 on the leaderboard.",
    howToAchieve: "Accumulate points by merging PRs and maintaining streaks to climb into the top 100 globally.",
    points: 300,
    icon: "Award",
    category: "general"
  },
  {
    id: "mentor",
    title: "Mentor",
    description: "Help 5 other contributors.",
    howToAchieve: "Answer questions or review code for other contributors to unlock this manual badge.",
    points: 200,
    icon: "Users",
    category: "general"
  },
  {
    id: "helper",
    title: "Helper",
    description: "Fix a documentation typo.",
    howToAchieve: "Submit a PR that improves project documentation or fixes a typo.",
    points: 20,
    icon: "BookOpenText",
    category: "general"
  },
  {
    id: "polyglot",
    title: "Polyglot",
    description: "Contribute across three technologies.",
    howToAchieve: "Merge PRs in repositories using at least three different programming languages or frameworks.",
    points: 250,
    icon: "CodeXml",
    category: "general"
  },

  // CONTRIBUTIONS
  {
    id: "first_pr",
    title: "First Merge",
    description: "Merge your first pull request.",
    howToAchieve: "Submit a pull request to a repository and get it merged by the maintainers.",
    points: 100,
    icon: "GitMerge",
    category: "contributions"
  },
  {
    id: "three_prs",
    title: "On a Roll",
    description: "Complete three PR merges.",
    howToAchieve: "Get 3 of your pull requests merged successfully.",
    points: 150,
    icon: "Flame",
    category: "contributions"
  },
  {
    id: "contributions_10",
    title: "10x Contributor",
    description: "Merge 10 pull requests.",
    howToAchieve: "A huge milestone! Successfully merge 10 pull requests across any open-source repositories.",
    points: 500,
    icon: "Rocket",
    category: "contributions"
  },
  {
    id: "contributions_50",
    title: "Open Source Elite",
    description: "Merge 50 pull requests.",
    howToAchieve: "You are a machine! Merge 50 pull requests to earn this highly prestigious badge.",
    points: 2500,
    icon: "Crown",
    category: "contributions"
  },
  {
    id: "contributions_100",
    title: "Legendary Contributor",
    description: "Merge 100 pull requests.",
    howToAchieve: "Achieve legendary status by getting 100 pull requests merged. Very few make it here.",
    points: 10000,
    icon: "Diamond",
    category: "contributions"
  },

  // STREAKS
  {
    id: "week_warrior",
    title: "Week Warrior",
    description: "Contribute every day for a week.",
    howToAchieve: "Maintain a 7-day contribution streak by actively working on issues or PRs daily.",
    points: 150,
    icon: "CalendarCheck",
    category: "streak"
  },
  {
    id: "streak_50",
    title: "Unstoppable",
    description: "Maintain a 50-day streak.",
    howToAchieve: "Keep the momentum going! Log in and contribute for 50 consecutive days.",
    points: 1000,
    icon: "Zap",
    category: "streak"
  },
  {
    id: "streak_100",
    title: "Century Club",
    description: "Maintain a 100-day streak.",
    howToAchieve: "A true master of consistency. Show up and contribute for 100 consecutive days.",
    points: 5000,
    icon: "Target",
    category: "streak"
  },
  {
    id: "streak_200",
    title: "Daily Devotion",
    description: "Maintain a 200-day streak.",
    howToAchieve: "Your dedication is unmatched. Keep a 200-day active contribution streak.",
    points: 15000,
    icon: "Infinity",
    category: "streak"
  },
];
