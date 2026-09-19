"use client";

import { motion } from "framer-motion";
import { Lock, CheckCircle2 } from "lucide-react";
import * as Icons from "lucide-react";
import { achievements, AchievementCategory, Achievement } from "@/data/achievements";
import { useState, useEffect } from "react";
import { getUserProfile } from "@/app/actions/user";
import { BadgeModal } from "@/components/ui/BadgeModal";

export default function AchievementsPage() {
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null);

  useEffect(() => {
    getUserProfile().then(p => {
      if (p) setUnlockedBadges(p.unlockedBadges || []);
    });
  }, []);

  const categories: { id: AchievementCategory; label: string; description: string }[] = [
    { id: "streak", label: "Streak Milestones", description: "Consistency is key. Earn these by contributing consecutive days." },
    { id: "contributions", label: "Contribution Milestones", description: "Merge pull requests to unlock these prestigious badges." },
    { id: "general", label: "General Badges", description: "Special achievements for various open-source activities." },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Achievements</h1>
        <p className="text-[var(--color-secondary-text)]">
          Earn badges by contributing to open source and growing your profile. Click any badge to see how to unlock it.
        </p>
      </div>

      {categories.map((category, catIdx) => {
        const categoryBadges = achievements.filter(a => a.category === category.id);
        if (categoryBadges.length === 0) return null;

        return (
          <div key={category.id} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--color-primary-text)]">{category.label}</h2>
              <p className="text-[var(--color-secondary-text)]">{category.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryBadges.map((badge, idx) => {
                const isUnlocked = unlockedBadges.includes(badge.id);
                // @ts-ignore
                const Icon = Icons[badge.icon] || Icons.Trophy;

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: catIdx * 0.1 + idx * 0.05 }}
                    key={badge.id}
                    onClick={() => setSelectedBadge(badge)}
                    className={`relative overflow-hidden rounded-2xl border p-6 flex flex-col items-center text-center transition-all cursor-pointer hover:-translate-y-1 ${
                      isUnlocked 
                        ? "bg-[var(--color-card-bg)] border-[var(--color-primary-accent)]/30 hover:border-[var(--color-primary-accent)] shadow-[0_4px_20px_-10px_var(--color-primary-accent)]" 
                        : "bg-[var(--color-card-bg)] border-[var(--color-border)] hover:border-[var(--color-border-hover)] opacity-70 grayscale hover:grayscale-0 hover:opacity-100"
                    }`}
                  >
                    {isUnlocked && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
                      </div>
                    )}
                    
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 border-4 transition-transform duration-300 ${
                      isUnlocked 
                        ? "bg-[var(--color-background)] border-[var(--color-primary-accent)]/20 text-[var(--color-primary-accent)]" 
                        : "bg-[var(--color-background)] border-[var(--color-border)] text-[var(--color-muted-text)]"
                    }`}>
                      {isUnlocked ? <Icon className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                    </div>

                    <h3 className={`text-lg font-bold mb-2 ${isUnlocked ? "text-[var(--color-primary-text)]" : "text-[var(--color-secondary-text)]"}`}>
                      {badge.title}
                    </h3>
                    
                    <p className="text-sm text-[var(--color-secondary-text)] mb-4 flex-1 line-clamp-2">
                      {badge.description}
                    </p>

                    <div className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      isUnlocked 
                        ? "bg-[var(--color-primary-accent)]/10 text-[var(--color-primary-accent)]" 
                        : "bg-[var(--color-elevated-surface)] text-[var(--color-muted-text)]"
                    }`}>
                      {badge.points} points
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}

      <BadgeModal 
        isOpen={!!selectedBadge} 
        onClose={() => setSelectedBadge(null)} 
        achievement={selectedBadge}
        isUnlocked={selectedBadge ? unlockedBadges.includes(selectedBadge.id) : false}
      />
    </div>
  );
}
