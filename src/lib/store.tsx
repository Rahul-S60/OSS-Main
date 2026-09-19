"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type DemoState = {
  onboardingCompleted: boolean;
  issueEnrolled: boolean;
  activeIssueId: string | null;
  contributionStep: number;
  prSubmitted: boolean;
  prMerged: boolean;
  points: number;
  streak: number;
  unlockedBadges: string[];
};

const initialState: DemoState = {
  onboardingCompleted: false,
  issueEnrolled: false,
  activeIssueId: null,
  contributionStep: 0,
  prSubmitted: false,
  prMerged: false,
  points: 150,
  streak: 7,
  unlockedBadges: [],
};

type DemoContextType = {
  state: DemoState;
  updateState: (updates: Partial<DemoState>) => void;
  resetDemo: () => void;
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("opensource-companion-demo");
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse demo state", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("opensource-companion-demo", JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const updateState = (updates: Partial<DemoState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const resetDemo = () => {
    setState(initialState);
    localStorage.removeItem("opensource-companion-demo");
  };

  // Prevent hydration mismatch by not rendering children until state is loaded
  if (!isLoaded) {
    return <div className="min-h-screen bg-[var(--color-background)]" />;
  }

  return (
    <DemoContext.Provider value={{ state, updateState, resetDemo }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoStore() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error("useDemoStore must be used within a DemoStoreProvider");
  }
  return context;
}
