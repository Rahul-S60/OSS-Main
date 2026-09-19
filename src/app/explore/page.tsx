"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SortDesc, Loader2 } from "lucide-react";
import { Issue } from "@/data/issues";
import { fetchRecommendedIssues } from "@/app/actions/github";
import { IssueCard } from "@/components/features/IssueCard";
import { RecommendationDrawer } from "@/components/features/RecommendationDrawer";

export default function ExploreIssues() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [issuesList, setIssuesList] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIssues() {
      try {
        const data = await fetchRecommendedIssues();
        setIssuesList(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadIssues();
  }, []);

  const handleWhyClick = (id: string) => {
    const issue = issuesList.find(i => i.id === id);
    if (issue) {
      setSelectedIssue(issue);
      setDrawerOpen(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Find your next contribution</h1>
        <p className="text-[var(--color-secondary-text)]">
          Issues selected around your skills, experience and interests.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted-text)]" />
          <input 
            type="text" 
            placeholder="Search issues, repositories or technologies..." 
            className="w-full h-11 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-lg pl-10 pr-4 focus:outline-none focus:border-[var(--color-primary-accent)] focus:ring-1 focus:ring-[var(--color-primary-accent)] transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none h-11 px-4 flex items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] text-sm font-medium hover:bg-[var(--color-elevated-surface)] transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="flex-1 md:flex-none h-11 px-4 flex items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] text-sm font-medium hover:bg-[var(--color-elevated-surface)] transition-colors">
            <SortDesc className="w-4 h-4" /> Best match
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary-accent)] mb-4" />
          <p className="text-[var(--color-secondary-text)]">Fetching real open-source issues from GitHub...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {issuesList.map((issue, idx) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <IssueCard issue={issue} onWhyClick={handleWhyClick} />
            </motion.div>
          ))}
        </div>
      )}

      <RecommendationDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        issue={selectedIssue} 
      />
    </div>
  );
}
