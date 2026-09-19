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
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [labelFilter, setLabelFilter] = useState("All Labels");
  const [difficultyFilter, setDifficultyFilter] = useState("All Difficulties");

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

  const filteredIssues = issuesList.filter(issue => {
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.repository.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesLabel = labelFilter === "All Labels" || issue.languages.includes(labelFilter);
    const matchesDifficulty = difficultyFilter === "All Difficulties" || issue.difficulty === difficultyFilter;
    
    return matchesSearch && matchesLabel && matchesDifficulty;
  });

  const allLabels = ["All Labels", ...Array.from(new Set(issuesList.flatMap(i => i.languages)))];
  const allDifficulties = ["All Difficulties", "Beginner", "Intermediate", "Advanced"];

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search issues, repositories or technologies..." 
            className="w-full h-11 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-lg pl-10 pr-4 focus:outline-none focus:border-[var(--color-primary-accent)] focus:ring-1 focus:ring-[var(--color-primary-accent)] transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none h-11 border border-[var(--color-border)] bg-[var(--color-card-bg)] rounded-lg hover:bg-[var(--color-elevated-surface)] transition-colors flex items-center px-2">
            <Filter className="w-4 h-4 ml-2 text-[var(--color-muted-text)]" />
            <select 
              value={labelFilter}
              onChange={(e) => setLabelFilter(e.target.value)}
              className="w-full h-full bg-transparent border-none focus:outline-none text-sm font-medium pl-2 pr-4 appearance-none cursor-pointer"
            >
              {allLabels.map(label => (
                <option key={label} value={label} className="bg-[var(--color-card-bg)] text-[var(--color-primary-text)]">{label}</option>
              ))}
            </select>
          </div>
          
          <div className="relative flex-1 md:flex-none h-11 border border-[var(--color-border)] bg-[var(--color-card-bg)] rounded-lg hover:bg-[var(--color-elevated-surface)] transition-colors flex items-center px-2">
            <select 
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full h-full bg-transparent border-none focus:outline-none text-sm font-medium px-3 appearance-none cursor-pointer"
            >
              {allDifficulties.map(diff => (
                <option key={diff} value={diff} className="bg-[var(--color-card-bg)] text-[var(--color-primary-text)]">{diff}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary-accent)] mb-4" />
          <p className="text-[var(--color-secondary-text)]">Fetching real open-source issues from GitHub...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue, idx) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <IssueCard issue={issue} onWhyClick={handleWhyClick} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-[var(--color-secondary-text)]">
              No issues match your current filters. Try adjusting them!
            </div>
          )}
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
