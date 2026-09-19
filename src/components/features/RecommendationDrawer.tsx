"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { issues } from "@/data/issues";
import { Button } from "@/components/ui/Button";

interface RecommendationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  issueId: string | null;
}

export function RecommendationDrawer({ isOpen, onClose, issueId }: RecommendationDrawerProps) {
  const issue = issueId ? issues.find(i => i.id === issueId) : null;

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
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Match Score */}
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 flex items-center justify-center">
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
                  
                  <div className="flex-1 space-y-3">
                    {[
                      { label: "Skill alignment", value: "97%" },
                      { label: "Difficulty fit", value: "91%" },
                      { label: "Repository activity", value: "89%" },
                      { label: "Semantic similarity", value: "94%" },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between text-sm">
                        <span className="text-[var(--color-secondary-text)]">{item.label}</span>
                        <span className="font-medium text-[var(--color-primary-text)]">{item.value}</span>
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
                      {[
                        { name: "Python", fill: "w-[95%]" },
                        { name: "FastAPI", fill: "w-[85%]" },
                        { name: "Testing", fill: "w-[70%]" },
                        { name: "Git", fill: "w-[100%]" },
                      ].map(skill => (
                        <div key={skill.name} className="flex items-center justify-between text-sm">
                          <span className="w-20 font-medium">{skill.name}</span>
                          <div className="flex-1 h-2 rounded-full bg-[var(--color-elevated-surface)] overflow-hidden ml-4">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              className={`h-full bg-[var(--color-primary-accent)] ${skill.fill}`} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted-text)] mb-4">Issue Requirements</h3>
                    <div className="space-y-3">
                      {issue.technologies.concat(issue.languages).map((tech, i) => (
                        <div key={tech} className="flex items-center justify-between text-sm">
                          <span className="w-20 font-medium">{tech}</span>
                          <div className="flex-1 h-2 rounded-full bg-[var(--color-elevated-surface)] overflow-hidden ml-4">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              className={`h-full bg-[var(--color-success)] w-[${90 - (i * 5)}%]`} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[var(--color-secondary-text)]">
                Loading analysis...
              </div>
            )}

            <div className="p-6 border-t border-[var(--color-border)]">
              <Button size="lg" className="w-full group" asChild>
                <Link href={`/issues/${issueId}`}>
                  View full issue details
                  <ExternalLink className="w-4 h-4 ml-2 opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
