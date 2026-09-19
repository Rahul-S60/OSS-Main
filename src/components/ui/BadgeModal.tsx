"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock, CheckCircle2, X } from "lucide-react";
import * as Icons from "lucide-react";
import { Achievement } from "@/data/achievements";
import { useEffect } from "react";

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: Achievement | null;
  isUnlocked: boolean;
}

export function BadgeModal({ isOpen, onClose, achievement, isUnlocked }: BadgeModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!achievement) return null;

  // @ts-ignore
  const Icon = Icons[achievement.icon] || Icons.Trophy;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-md overflow-hidden rounded-3xl border p-8 flex flex-col items-center text-center shadow-2xl bg-[var(--color-background)] ${
                isUnlocked 
                  ? "border-[var(--color-primary-accent)]/30 shadow-[0_10px_40px_-15px_var(--color-primary-accent)]" 
                  : "border-[var(--color-border)]"
              }`}
            >
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--color-elevated-surface)] text-[var(--color-secondary-text)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 border-4 ${
                isUnlocked 
                  ? "bg-[var(--color-background)] border-[var(--color-primary-accent)]/20 text-[var(--color-primary-accent)]" 
                  : "bg-[var(--color-background)] border-[var(--color-border)] text-[var(--color-muted-text)]"
              }`}>
                {isUnlocked ? <Icon className="w-12 h-12" /> : <Lock className="w-12 h-12" />}
              </div>

              <h2 className={`text-2xl font-bold mb-2 ${isUnlocked ? "text-[var(--color-primary-text)]" : "text-[var(--color-secondary-text)]"}`}>
                {achievement.title}
              </h2>
              
              <p className="text-[var(--color-secondary-text)] mb-6">
                {achievement.description}
              </p>

              <div className="w-full bg-[var(--color-elevated-surface)] rounded-xl p-5 mb-6 text-left border border-[var(--color-border)]/50">
                <h4 className="text-sm font-semibold text-[var(--color-primary-text)] mb-2 flex items-center gap-2">
                  {isUnlocked ? (
                    <><CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" /> Unlocked!</>
                  ) : (
                    "How to Unlock"
                  )}
                </h4>
                <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed">
                  {achievement.howToAchieve}
                </p>
              </div>

              <div className={`text-sm font-bold px-4 py-2 rounded-full ${
                isUnlocked 
                  ? "bg-[var(--color-primary-accent)]/10 text-[var(--color-primary-accent)]" 
                  : "bg-[var(--color-elevated-surface)] text-[var(--color-muted-text)]"
              }`}>
                Awards {achievement.points} Points
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
