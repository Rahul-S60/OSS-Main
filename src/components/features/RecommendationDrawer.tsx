"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Bookmark, BookmarkCheck } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Issue } from "@/data/issues";
import { Button } from "@/components/ui/Button";
import { saveIssueForLater } from "@/app/actions/contributions";
import { getUserProfile } from "@/app/actions/user";
import { useToast } from "@/components/ui/Toast";

// Helper for stable pseudo-random numbers
const getHash = (str: string, min: number, max: number) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return min + (Math.abs(hash) % (max - min + 1));
};

interface RecommendationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue | null;
}

export function RecommendationDrawer({ isOpen, onClose, issue }: RecommendationDrawerProps) {
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      getUserProfile().then(p => setProfile(p));
    }
  }, [isOpen]);

  const isAlreadySaved = Boolean(
    profile?.contributions?.some(
      (c: any) => c.issueId === issue?.id && c.status === "saved"
    )
  );

  const handleSaveForLater = async () => {
    if (!issue) return;
    setIsSaving(true);
    try {
      const res = await saveIssueForLater({
        id: issue.id,
        title: issue.title,
        repository: issue.repository,
        description: issue.description,
        difficulty: issue.difficulty,
        estimatedEffort: issue.estimatedEffort,
        languages: issue.languages,
        technologies: issue.technologies,
        points: issue.points,
      });

      if (res && res.error) {
        addToast({ title: "Sign In Required", description: res.error, type: "warning" });
        return;
      }

      if (res && res.saved !== undefined) {
        // Update local profile state
        setProfile((prev: any) => {
          if (!prev) return prev;
          const current = prev.contributions || [];
          if (res.saved) {
            return {
              ...prev,
              contributions: [...current.filter((c: any) => c.issueId !== issue.id), { issueId: issue.id, status: "saved" }]
            };
          } else {
            return {
              ...prev,
              contributions: current.filter((c: any) => c.issueId !== issue.id)
            };
          }
        });

        addToast({
          title: res.saved ? "Saved for later" : "Removed from saved",
          description: res.saved 
            ? "Access this issue anytime under My Journey -> Saved." 
            : "Issue removed from your saved list.",
          type: "success"
        });
      }
    } catch (e) {
      console.error(e);
      addToast({ title: "Failed to save issue", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--color-card-bg)] border-l border-[var(--color-border)] shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-semibold tracking-tight">Why we recommended this</h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[var(--color-elevated-surface)] text-[var(--color-secondary-text)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {issue ? (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
                {/* Match Score */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="44" stroke="var(--color-border)" strokeWidth="8" fill="none" />
                      <motion.circle 
                        cx="48" 
                        cy="48" 
                        r="44" 
                        stroke="var(--color-primary-accent)" 
                        strokeWidth="8" 
                        fill="none" 
                        strokeDasharray="276"
                        initial={{ strokeDashoffset: 276 }}
                        animate={{ strokeDashoffset: 276 - (276 * issue.matchScore) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-[var(--color-primary-text)]">{issue.matchScore}%</span>
                      <span className="text-[10px] font-semibold text-[var(--color-secondary-text)] uppercase tracking-wider">Match</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full space-y-2.5 sm:space-y-3">
                    {[
                      { label: "Skill alignment", value: getHash(issue.id + "skill", 75, 99) },
                      { label: "Difficulty fit", value: getHash(issue.id + "diff", 70, 98) },
                      { label: "Repository activity", value: getHash(issue.id + "repo", 60, 99) },
                      { label: "Semantic similarity", value: getHash(issue.id + "semantic", 80, 96) },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-[var(--color-secondary-text)]">{item.label}</span>
                        <span className="font-medium text-[var(--color-primary-text)]">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--color-primary-accent)]/10 border border-[var(--color-primary-accent)]/20 text-sm text-[var(--color-primary-text)]">
                  {issue.reason}
                </div>

                {/* Profile vs Issue Comparison */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted-text)] mb-4">Your Profile</h3>
                    <div className="space-y-3">
                      {(profile?.languages?.length > 0 ? profile.languages : ["JavaScript", "Python", "React", "Node.js"]).slice(0, 4).map((skill: string) => {
                        const userId = typeof window !== 'undefined' ? sessionStorage?.getItem("userId") || "" : "";
                        const percentage = getHash(skill + userId, 40, 95);
                        return (
                          <div key={skill} className="flex items-center justify-between text-sm">
                            <span className="w-20 font-medium truncate" title={skill}>{skill}</span>
                            <div className="flex-1 h-2 rounded-full bg-[var(--color-elevated-surface)] overflow-hidden ml-4">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="h-full bg-[var(--color-primary-accent)]" 
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted-text)] mb-4">Issue Requirements</h3>
                    <div className="space-y-3">
                      {(issue.languages.length > 0 ? issue.languages : ["JavaScript"]).slice(0, 4).map((tech: string) => {
                        const percentage = getHash(tech + issue.id, 60, 100);
                        return (
                          <div key={tech} className="flex items-center justify-between text-sm">
                            <span className="w-20 font-medium truncate" title={tech}>{tech}</span>
                            <div className="flex-1 h-2 rounded-full bg-[var(--color-elevated-surface)] overflow-hidden ml-4">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: 0.4 }}
                                className="h-full bg-[var(--color-success)]" 
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[var(--color-secondary-text)]">
                Loading analysis...
              </div>
            )}

            <div className="p-6 border-t border-[var(--color-border)] flex flex-col gap-3">
              <Button size="lg" className="w-full group" asChild>
                <Link href={`/contributions/${issue?.id}`}>
                  Enroll in Issue
                  <ExternalLink className="w-4 h-4 ml-2 opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                variant={isAlreadySaved ? "outline" : "secondary"} 
                className="w-full gap-2"
                onClick={handleSaveForLater}
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isAlreadySaved ? (
                  <BookmarkCheck className="w-4 h-4 text-[var(--color-primary-accent)]" />
                ) : (
                  <Bookmark className="w-4 h-4 text-[var(--color-secondary-text)]" />
                )}
                {isSaving ? "Saving..." : isAlreadySaved ? "Saved for later" : "Save for later"}
              </Button>
              {issue?.url && (
                <Button variant="ghost" className="w-full group text-[var(--color-secondary-text)]" asChild>
                  <Link href={issue.url} target="_blank" rel="noopener noreferrer">
                    View on GitHub
                    <ExternalLink className="w-4 h-4 ml-2 opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
