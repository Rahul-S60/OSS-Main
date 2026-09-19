import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CircleDot, Activity, Clock, BarChart } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Issue } from "@/data/issues";

interface IssueCardProps {
  issue: Issue;
  onWhyClick?: (issueId: string) => void;
  userStatus?: string;
}

export function IssueCard({ issue, onWhyClick, userStatus }: IssueCardProps) {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Beginner": return "success";
      case "Intermediate": return "warning";
      case "Advanced": return "danger";
      default: return "default";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group relative flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-sm overflow-hidden"
    >
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CircleDot className="w-4 h-4 text-[var(--color-success)]" />
            <span className="text-xs font-semibold text-[var(--color-muted-text)] tracking-wider uppercase">
              {issue.labels.includes("good first issue") ? "GOOD FIRST ISSUE" : "OPEN ISSUE"}
            </span>
          </div>
          {userStatus && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              userStatus === "merged" 
                ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20" 
                : userStatus === "saved"
                ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                : "bg-[var(--color-primary-accent)]/10 text-[var(--color-primary-accent)] border border-[var(--color-primary-accent)]/20"
            }`}>
              {userStatus === "merged" ? "Completed" : userStatus === "saved" ? "Saved" : "Ongoing"}
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-[var(--color-primary-text)] leading-tight mb-2">
          {issue.title}
        </h3>
        
        <p className="text-sm text-[var(--color-secondary-text)] line-clamp-2 mb-4">
          {issue.description}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <img 
            src={`https://github.com/${issue.repository.split('/')[0]}.png?size=40`} 
            alt={issue.repository} 
            className="w-5 h-5 rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://github.com/github.png?size=40";
            }}
          />
          <span className="text-sm font-medium text-[var(--color-primary-text)]">{issue.repository}</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
          {issue.technologies.map(tech => (
            <Badge key={tech} variant="secondary">{tech}</Badge>
          ))}
          {issue.languages.map(lang => (
            <Badge key={lang} variant="outline">{lang}</Badge>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 border-t border-[var(--color-border)] bg-[var(--color-elevated-surface)]/50">
        <div className="flex items-center justify-between mb-4">
          <Badge variant={getDifficultyColor(issue.difficulty)} className="uppercase text-[10px]">
            {issue.difficulty}
          </Badge>
          <div className="flex items-center gap-1.5">
            <BarChart className="w-4 h-4 text-[var(--color-primary-accent)]" />
            <span className="text-sm font-semibold text-[var(--color-primary-accent)]">{issue.matchScore}% MATCH</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-[var(--color-muted-text)] mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{issue.estimatedEffort}</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" />
            <span>{issue.activity}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs px-2"
            onClick={() => onWhyClick && onWhyClick(issue.id)}
          >
            Why this issue?
          </Button>
          <Button variant="secondary" size="sm" asChild className="text-xs group-hover:bg-[var(--color-primary-accent)] group-hover:text-white transition-colors">
            <Link href={`/issues/${issue.id}`}>
              View issue <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
