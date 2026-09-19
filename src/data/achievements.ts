export type Achievement = {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
};

export const achievements: Achievement[] = [
  {
    id: "first_step",
    title: "First Step",
    description: "Complete your first contribution setup.",
    points: 25,
    icon: "Footprints",
  },
  {
    id: "first_merge",
    title: "First Merge",
    description: "Merge your first pull request.",
    points: 100,
    icon: "GitMerge",
  },
  {
    id: "on_a_roll",
    title: "On a Roll",
    description: "Complete three contributions.",
    points: 150,
    icon: "Flame",
  },
  {
    id: "open_source_hero",
    title: "Open Source Hero",
    description: "Reach top 100 on the leaderboard.",
    points: 300,
    icon: "Award",
  },
  {
    id: "mentor",
    title: "Mentor",
    description: "Help 5 other contributors.",
    points: 200,
    icon: "Users",
  },
  {
    id: "week_warrior",
    title: "Week Warrior",
    description: "Contribute every day for a week.",
    points: 150,
    icon: "CalendarCheck",
  },
  {
    id: "helper",
    title: "Helper",
    description: "Fix a documentation typo.",
    points: 20,
    icon: "BookOpenText",
  },
  {
    id: "polyglot",
    title: "Polyglot",
    description: "Contribute across three technologies.",
    points: 250,
    icon: "CodeXml",
  },
];
