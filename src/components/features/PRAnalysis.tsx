"use client";

import { motion } from "framer-motion";
import { Check, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PRAnalysisProps {
  onAnalyzeComplete?: () => void;
  onSubmit: () => void;
}

export function PRAnalysis({ onAnalyzeComplete, onSubmit }: PRAnalysisProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Score visualization */}
        <div className="relative w-48 h-48 flex shrink-0 items-center justify-center mx-auto md:mx-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="88" stroke="var(--color-border)" strokeWidth="12" fill="none" />
            <motion.circle 
              cx="96" 
              cy="96" 
              r="88" 
              stroke="var(--color-success)" 
              strokeWidth="12" 
              fill="none" 
              strokeDasharray="553"
              initial={{ strokeDashoffset: 553 }}
              animate={{ strokeDashoffset: 553 - (553 * 0.82) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <motion.span 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="text-4xl font-bold text-[var(--color-primary-text)]"
            >
              82%
            </motion.span>
            <span className="text-xs font-semibold text-[var(--color-secondary-text)] uppercase tracking-wider text-center max-w-[100px] mt-1">
              Predicted PR success
            </span>
          </div>
        </div>

        {/* Signals */}
        <div className="flex-1 w-full space-y-6">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-success)] flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4" /> Positive signals
            </h4>
            <ul className="space-y-2">
              {[
                "Issue is well scoped",
                "Changes align with issue requirements",
                "Tests included",
                "Repository is active",
                "Contribution guidelines followed"
              ].map((signal, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + (i * 0.1) }}
                  className="flex items-start gap-2 text-sm text-[var(--color-primary-text)]"
                >
                  <Check className="w-4 h-4 text-[var(--color-success)] shrink-0 mt-0.5" />
                  <span>{signal}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-warning)] flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4" /> Potential improvements
            </h4>
            <ul className="space-y-2">
              <motion.li 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6 }}
                className="flex items-start gap-2 text-sm text-[var(--color-primary-text)]"
              >
                <span className="text-[var(--color-warning)] font-bold shrink-0 mt-0.5">⚠</span>
                <span>Add one edge-case test for deeper coverage</span>
              </motion.li>
            </ul>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)]"
      >
        <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted-text)] mb-4">Readiness Detail</h4>
        <div className="space-y-3 mb-6">
          {[
            { label: "Code alignment", status: "Strong" },
            { label: "Issue scope", status: "Strong" },
            { label: "Testing", status: "Good" },
            { label: "Repository fit", status: "Strong" },
            { label: "Documentation", status: "Good" },
          ].map(item => (
            <div key={item.label} className="flex justify-between items-center text-sm border-b border-[var(--color-border)]/50 pb-2 last:border-0 last:pb-0">
              <span className="text-[var(--color-secondary-text)]">{item.label}</span>
              <span className={`font-medium ${item.status === "Strong" ? "text-[var(--color-success)]" : "text-[var(--color-primary-accent)]"}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-[var(--color-muted-text)] italic mb-6">
          This is a prediction based on available contribution signals, not a guarantee of PR acceptance.
        </p>

        <Button size="lg" className="w-full text-base font-semibold" onClick={onSubmit}>
          Submit Pull Request
        </Button>
      </motion.div>
    </div>
  );
}
