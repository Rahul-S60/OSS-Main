"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Compass, Book, Code2 } from "lucide-react";
import { issues } from "@/data/issues";
import { useRouter } from "next/navigation";

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const filteredIssues = query 
    ? issues.filter(i => 
        i.title.toLowerCase().includes(query.toLowerCase()) || 
        i.repository.toLowerCase().includes(query.toLowerCase()) ||
        i.technologies.some(t => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : issues.slice(0, 3);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
            >
              <div className="flex items-center px-4 border-b border-[var(--color-border)]">
                <Search className="w-5 h-5 text-[var(--color-muted-text)]" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search issues, repositories, technologies..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-14 bg-transparent border-none px-4 text-[var(--color-primary-text)] focus:outline-none focus:ring-0 text-lg placeholder:text-[var(--color-muted-text)]"
                />
                <div className="px-2 py-1 bg-[var(--color-elevated-surface)] rounded text-xs font-mono text-[var(--color-secondary-text)]">ESC</div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filteredIssues.length > 0 ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-xs font-semibold text-[var(--color-muted-text)] uppercase tracking-wider">
                      {query ? "Search Results" : "Suggested"}
                    </div>
                    {filteredIssues.map((issue) => (
                      <div
                        key={issue.id}
                        onClick={() => {
                          router.push(`/issues/${issue.id}`);
                          setIsOpen(false);
                        }}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--color-elevated-surface)] cursor-pointer group transition-colors"
                      >
                        <div className="flex items-start gap-3 overflow-hidden">
                          <div className="mt-0.5 p-2 rounded-lg bg-[var(--color-primary-accent)]/10 text-[var(--color-primary-accent)] shrink-0">
                            <Code2 className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[var(--color-primary-text)] truncate">{issue.title}</p>
                            <p className="text-xs text-[var(--color-secondary-text)] mt-1">{issue.repository}</p>
                          </div>
                        </div>
                        <div className="shrink-0 ml-4 hidden md:flex gap-2">
                          {issue.technologies.slice(0, 2).map(tech => (
                            <span key={tech} className="px-2 py-0.5 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] text-xs text-[var(--color-secondary-text)]">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-[var(--color-secondary-text)]">
                    <Compass className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p>No results found for "{query}"</p>
                  </div>
                )}
                
                {!query && (
                  <div className="mt-4 border-t border-[var(--color-border)] pt-4 space-y-1">
                    <div className="px-3 py-2 text-xs font-semibold text-[var(--color-muted-text)] uppercase tracking-wider">
                      Quick Actions
                    </div>
                    {[
                      { icon: Book, label: "View my profile", path: "/profile" },
                      { icon: Compass, label: "Explore issues", path: "/explore" },
                    ].map(action => (
                      <div
                        key={action.path}
                        onClick={() => {
                          router.push(action.path);
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-elevated-surface)] cursor-pointer transition-colors"
                      >
                        <action.icon className="w-4 h-4 text-[var(--color-secondary-text)]" />
                        <span className="text-sm font-medium text-[var(--color-primary-text)]">{action.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
