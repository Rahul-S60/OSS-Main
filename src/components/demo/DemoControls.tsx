"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Settings, RefreshCw, FastForward, CheckSquare, Award } from "lucide-react";
import { useDemoStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";

export function DemoControls() {
  const [isOpen, setIsOpen] = useState(false);
  const { state, updateState, resetDemo } = useDemoStore();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + D
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleReset = () => {
    resetDemo();
    router.push("/");
    setIsOpen(false);
  };

  const handleSkipOnboarding = () => {
    updateState({ onboardingCompleted: true });
    router.push("/dashboard");
    setIsOpen(false);
  };

  const handleJumpToContribution = () => {
    updateState({ 
      onboardingCompleted: true,
      issueEnrolled: true,
      activeIssueId: "18472", // fastapi issue
      contributionStep: 0,
      prSubmitted: false,
      prMerged: false
    });
    router.push("/contributions/18472");
    setIsOpen(false);
  };

  const handleSimulatePRSubmit = () => {
    updateState({
      contributionStep: 5,
      prSubmitted: true,
      prMerged: false
    });
    setIsOpen(false);
  };

  const handleUnlockFirstMerge = () => {
    updateState({
      prMerged: true,
      points: state.points + 100,
      unlockedBadges: [...new Set([...state.unlockedBadges, "first_merge"])]
    });
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="fixed bottom-6 right-6 w-80 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl shadow-2xl z-[999] overflow-hidden"
        >
          <div className="bg-[var(--color-primary-accent)] p-4 flex items-center gap-2 text-white">
            <Settings className="w-5 h-5" />
            <h3 className="font-semibold">Demo Control Center</h3>
          </div>
          
          <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
            <Button variant="outline" className="w-full justify-start text-xs h-9" onClick={handleReset}>
              <RefreshCw className="w-4 h-4 mr-2 text-[var(--color-danger)]" /> Reset demo
            </Button>
            
            <div className="h-px bg-[var(--color-border)] my-2" />
            
            <Button variant="ghost" className="w-full justify-start text-xs h-9" onClick={handleSkipOnboarding}>
              <FastForward className="w-4 h-4 mr-2" /> Skip onboarding
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-xs h-9" onClick={() => { router.push("/dashboard"); setIsOpen(false); }}>
              <FastForward className="w-4 h-4 mr-2" /> Jump to dashboard
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-xs h-9" onClick={handleJumpToContribution}>
              <CheckSquare className="w-4 h-4 mr-2" /> Jump to contribution
            </Button>
            
            <div className="h-px bg-[var(--color-border)] my-2" />
            
            <Button variant="ghost" className="w-full justify-start text-xs h-9" onClick={handleSimulatePRSubmit}>
              <CheckSquare className="w-4 h-4 mr-2" /> Simulate PR submission
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-xs h-9" onClick={handleUnlockFirstMerge}>
              <Award className="w-4 h-4 mr-2 text-amber-500" /> Unlock First Merge
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
