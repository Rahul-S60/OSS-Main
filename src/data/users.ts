export type UserProfile = {
  id: string;
  name: string;
  username: string;
  role: string;
  location: string;
  repositories: number;
  followers: number;
  languages: string[];
  avatarUrl: string;
};

export const demoUser: UserProfile = {
  id: "u_001",
  name: "Alex Morgan",
  username: "alexmorgan",
  role: "Developer",
  location: "Bengaluru, India",
  repositories: 14,
  followers: 32,
  languages: ["Python", "JavaScript", "TypeScript", "HTML", "CSS"],
  avatarUrl: "https://i.pravatar.cc/150?u=alexmorgan",
};
