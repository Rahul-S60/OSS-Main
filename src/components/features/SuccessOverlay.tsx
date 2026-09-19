"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GitMerge, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

interface SuccessOverlayProps {
  isVisible: boolean;
  onContinue: () => void;
  pointsEarned: number;
}

export function SuccessOverlay({ isVisible, onContinue, pointsEarned }: SuccessOverlayProps) {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    if (isVisible) {
      setParticles(Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        scale: Math.random() * 0.5 + 0.5,
        rotate: Math.random() * 360,
        duration: Math.random() * 2 + 2,
        delay: Math.random() * 0.5,
        color: ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 4)]
      })));
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-[var(--color-background)] flex items-center justify-center p-4 overflow-hidden"
        >
          {/* Confetti / Particle background effect */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
             {particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ 
                    top: "100%", 
                    left: p.left,
                    opacity: 1,
                    scale: p.scale
                  }}
                  animate={{ 
                    top: "-10%",
                    opacity: 0,
                    rotate: p.rotate
                  }}
                  transition={{ 
                    duration: p.duration, 
                    ease: "easeOut",
                    delay: p.delay
                  }}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: p.color
                  }}
                />
             ))}
          </div>

          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.2 }}
            className="w-full max-w-lg bg-[var(--color-card-bg)] border border-[var(--color-border)] p-10 rounded-3xl shadow-2xl text-center relative z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.4 }}
              className="w-24 h-24 rounded-full bg-[var(--color-success)]/20 flex items-center justify-center mx-auto mb-8 relative"
            >
              <div className="absolute inset-0 rounded-full border-4 border-[var(--color-success)]/30 animate-ping opacity-75" />
              <GitMerge className="w-12 h-12 text-[var(--color-success)]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h1 className="text-4xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
                Contribution merged.
              </h1>
              <p className="text-lg text-[var(--color-secondary-text)] mb-8">
                You just made your first open-source contribution.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xl mb-10"
            >
              <Trophy className="w-6 h-6" />
              +{pointsEarned} POINTS
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <Button size="lg" className="w-full group" onClick={onContinue}>
                Continue to Achievements
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
