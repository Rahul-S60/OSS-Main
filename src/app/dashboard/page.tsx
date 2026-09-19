"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Issue } from "@/data/issues";
import { fetchRecommendedIssues } from "@/app/actions/github";
import { useSession } from "next-auth/react";
import { achievements } from "@/data/achievements";
import { getUserProfile } from "@/app/actions/user";
import { IssueCard } from "@/components/features/IssueCard";
import { RecommendationDrawer } from "@/components/features/RecommendationDrawer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle2, CircleDashed, Circle, GitMerge, Trophy, Flame, Loader2 } from "lucide-react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [issuesList, setIssuesList] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [dbState, setDbState] = useState<any>({
    points: 0,
    streak: 0,
    prMerged: false,
    activeIssueId: null,
    contributionStep: 0,
    issueEnrolled: false,
    onboardingCompleted: true,
    unlockedBadges: [],
  });
  
  useEffect(() => {
    async function loadData() {
      try {
        const [issuesData, profileData] = await Promise.all([
          fetchRecommendedIssues(),
          getUserProfile()
        ]);
        
        setIssuesList(issuesData);
        
        if (profileData) {
          // Process contributions to find active issue
          const activeContribution = profileData.contributions?.find((c: any) => c.status !== "merged");
          const hasMerged = profileData.contributions?.some((c: any) => c.status === "merged");
          const hasEnrolled = profileData.contributions && profileData.contributions.length > 0;
          
          setDbState({
            points: profileData.points,
            streak: profileData.streak,
            prMerged: hasMerged,
            activeIssueId: activeContribution?.issueId || null,
            contributionStep: activeContribution ? parseInt(activeContribution.status) || 0 : 0,
            issueEnrolled: hasEnrolled,
            onboardingCompleted: true,
            unlockedBadges: profileData.unlockedBadges || [],
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeIssue = dbState.activeIssueId ? issuesList.find(i => i.id === dbState.activeIssueId) : null;

  const handleWhyClick = (id: string) => {
    const issue = issuesList.find(i => i.id === id);
    if (issue) {
      setSelectedIssue(issue);
      setDrawerOpen(true);
    }
  };

  const getContributionProgress = () => {
    const steps = [
      "Understand issue",
      "Setup workspace",
      "Implement changes",
      "Commit",
      "Open PR",
      "Merge"
    ];
    return steps;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          Good morning, {session?.user?.name?.split(" ")[0] || 'Contributor'} <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="text-[var(--color-secondary-text)]">
          Here's what's happening in your open-source journey.
        </p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Points", value: dbState.points, icon: Trophy, color: "text-amber-400" },
          { label: "Contributions", value: dbState.prMerged ? 1 : 0, icon: GitMerge, color: "text-[var(--color-primary-accent)]" },
          { label: "Community Rank", value: dbState.prMerged ? "#183" : "#247", icon: Trophy, color: "text-[var(--color-success)]" },
          { label: "Day Streak", value: dbState.streak, icon: Flame, color: "text-orange-500" },
        ].map((metric, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={metric.label}
            className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)]"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-[var(--color-secondary-text)]">{metric.label}</span>
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
            <div className="text-3xl font-bold">{metric.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Current Contribution */}
          {activeIssue && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Current contribution</h2>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{activeIssue.title}</CardTitle>
                  <CardDescription>{activeIssue.repository}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2">
                    {getContributionProgress().map((step, idx) => {
                      const isCompleted = idx < dbState.contributionStep;
                      const isCurrent = idx === dbState.contributionStep;
                      return (
                        <div key={idx} className="flex items-center gap-2">
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
                          ) : isCurrent ? (
                            <CircleDashed className="w-5 h-5 text-[var(--color-primary-accent)] animate-spin-slow" />
                          ) : (
                            <Circle className="w-5 h-5 text-[var(--color-border)]" />
                          )}
                          <span className={`text-sm ${isCompleted || isCurrent ? "text-[var(--color-primary-text)] font-medium" : "text-[var(--color-muted-text)]"}`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6">
                    <Button asChild className="w-full sm:w-auto group">
                      <Link href={`/contributions/${activeIssue.id}`}>
                        {dbState.contributionStep > 0 ? "Continue contribution" : "Start contribution"}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Recommended Issues */}
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold tracking-tight">Recommended for you</h2>
              <Link href="/explore" className="text-sm font-medium text-[var(--color-primary-accent)] hover:underline flex items-center">
                View all <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-border)]">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary-accent)] mb-4" />
                <p className="text-[var(--color-secondary-text)]">Finding the best issues for you...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {issuesList.slice(0, 4).map((issue, idx) => (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <IssueCard issue={issue} onWhyClick={handleWhyClick} />
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          {/* Activity */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Activity</h2>
            <Card>
              <CardContent className="p-6">
                <div className="relative border-l border-[var(--color-border)] ml-3 space-y-6">
                  {dbState.prMerged && (
                    <div className="relative pl-6">
                      <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-[var(--color-success)] rounded-full ring-4 ring-[var(--color-card-bg)]" />
                      <p className="text-sm font-medium">You merged your first pull request</p>
                      <p className="text-xs text-[var(--color-primary-accent)] font-medium mt-1">+100 points</p>
                      <p className="text-xs text-[var(--color-muted-text)] mt-1">Just now</p>
                    </div>
                  )}
                  {dbState.issueEnrolled && (
                    <div className="relative pl-6">
                      <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-[var(--color-primary-accent)] rounded-full ring-4 ring-[var(--color-card-bg)]" />
                      <p className="text-sm font-medium">You enrolled in an issue</p>
                      <p className="text-xs text-[var(--color-muted-text)] mt-1">{dbState.prMerged ? "Earlier today" : "Today"}</p>
                    </div>
                  )}
                  {dbState.onboardingCompleted && (
                    <div className="relative pl-6">
                      <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-[var(--color-border)] rounded-full ring-4 ring-[var(--color-card-bg)]" />
                      <p className="text-sm font-medium">Profile created</p>
                      <p className="text-xs text-[var(--color-muted-text)] mt-1">2 days ago</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Badges Preview */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Badges</h2>
              <Link href="/achievements" className="text-sm font-medium text-[var(--color-primary-accent)] hover:underline">
                View all
              </Link>
            </div>
            <Card>
              <CardContent className="p-6 grid grid-cols-4 gap-4">
                {achievements.slice(0, 4).map(badge => {
                  const isUnlocked = dbState.unlockedBadges.includes(badge.id);
                  return (
                    <div key={badge.id} className="flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isUnlocked 
                          ? "border-[var(--color-primary-accent)] bg-[var(--color-primary-accent)]/10 text-[var(--color-primary-accent)]" 
                          : "border-[var(--color-border)] bg-[var(--color-elevated-surface)] text-[var(--color-muted-text)] grayscale opacity-50"
                      }`}>
                        <Trophy className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] text-center font-medium leading-tight line-clamp-2">
                        {badge.title}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
      
      {/* Drawer */}
      <RecommendationDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        issue={selectedIssue} 
      />
    </div>
  );
}
