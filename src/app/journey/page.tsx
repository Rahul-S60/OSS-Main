"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Clock, CheckCircle, Bookmark, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getUserProfile } from "@/app/actions/user";
import { Button } from "@/components/ui/Button";

type Contribution = {
  id: string;
  status: string;
  updatedAt: string;
  issue: {
    id: string;
    title: string;
    repository: string;
    difficulty: string;
    technologies: string[];
  };
};

export default function JourneyPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [activeTab, setActiveTab] = useState<"ongoing" | "saved" | "completed">("ongoing");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const profile = await getUserProfile();
      if (profile?.contributions) {
        setContributions(profile.contributions);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredContributions = contributions.filter(c => {
    if (activeTab === "saved") return c.status === "saved";
    if (activeTab === "completed") return c.status === "merged";
    return c.status !== "merged" && c.status !== "saved";
  });

  const getStatusLabel = (status: string) => {
    if (status === "saved") return "Saved for Later";
    if (status === "merged") return "Merged";
    return `Step ${status} / 6`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Journey</h1>
        <p className="text-[var(--color-secondary-text)]">
          Track your progress, resume ongoing work, and review your past contributions.
        </p>
      </div>

      <div className="flex border-b border-[var(--color-border)]">
        <button
          onClick={() => setActiveTab("ongoing")}
          className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
            activeTab === "ongoing" ? "text-[var(--color-primary-accent)]" : "text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)]"
          }`}
        >
          <Clock className="w-4 h-4" /> Ongoing
          {activeTab === "ongoing" && (
            <motion.div layoutId="journey-tab-indicator" className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary-accent)]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
            activeTab === "saved" ? "text-[var(--color-primary-accent)]" : "text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)]"
          }`}
        >
          <Bookmark className="w-4 h-4" /> Saved
          {activeTab === "saved" && (
            <motion.div layoutId="journey-tab-indicator" className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary-accent)]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
            activeTab === "completed" ? "text-[var(--color-primary-accent)]" : "text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)]"
          }`}
        >
          <CheckCircle className="w-4 h-4" /> Completed
          {activeTab === "completed" && (
            <motion.div layoutId="journey-tab-indicator" className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary-accent)]" />
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-[var(--color-secondary-text)]">
          Loading your journey...
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredContributions.length > 0 ? (
              filteredContributions.map(contribution => (
                <Link 
                  href={`/contributions/${contribution.issue.id}`} 
                  key={contribution.id}
                  className="group block p-6 rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary-accent)]/50 transition-colors shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-[var(--color-elevated-surface)] text-[var(--color-muted-text)]">
                      {contribution.issue.repository}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      contribution.status === "merged" 
                        ? "bg-[var(--color-success)]/10 text-[var(--color-success)]" 
                        : contribution.status === "saved"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-[var(--color-primary-accent)]/10 text-[var(--color-primary-accent)]"
                    }`}>
                      {getStatusLabel(contribution.status)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--color-primary-accent)] transition-colors">
                    {contribution.issue.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-6">
                    <span className="text-xs text-[var(--color-secondary-text)]">
                      Last updated {new Date(contribution.updatedAt).toLocaleDateString()}
                    </span>
                    <div className="text-[var(--color-primary-accent)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-sm font-medium">
                      {activeTab === "completed" ? "View Details" : "Resume"} <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-16 flex flex-col items-center justify-center border border-dashed border-[var(--color-border)] rounded-xl bg-[var(--color-card-bg)]/50">
                <Compass className="w-12 h-12 text-[var(--color-muted-text)] mb-4" />
                <h3 className="text-lg font-medium mb-2">No {activeTab} issues found</h3>
                <p className="text-[var(--color-secondary-text)] mb-6 text-center max-w-md">
                  {activeTab === "ongoing" 
                    ? "You aren't working on any issues right now. Head over to the Explore page to find your next contribution!" 
                    : activeTab === "saved"
                    ? "You haven't saved any issues for later."
                    : "You haven't completed any issues yet."}
                </p>
                <Button asChild>
                  <Link href="/explore">Explore Issues</Link>
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
