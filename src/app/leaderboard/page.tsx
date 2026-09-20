"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, GitMerge, Flame } from "lucide-react";
import { useSession } from "next-auth/react";
import { getUserProfile } from "@/app/actions/user";
import { useEffect } from "react";

import { getTopUsers } from "@/app/actions/leaderboard";

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("All time");
  const [profile, setProfile] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    getUserProfile().then(data => setProfile(data));
    getTopUsers().then(data => setUsers(data));
  }, []);

  // Insert current user based on points for demo
  const prMerged = profile?.prMerged;
  const userRank = users.find(u => u.id === session?.user?.id)?.rank || "-";
  
  return (
    <div className="max-w-5xl mx-auto pb-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Community leaderboard</h1>
        <p className="text-[var(--color-secondary-text)]">
          See how contributors are growing through open source.
        </p>
      </div>

      <div className="flex border-b border-[var(--color-border)] overflow-x-auto mb-8">
        {["This week", "This month", "All time"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 sm:px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap shrink-0 ${
              activeTab === tab 
                ? "border-[var(--color-primary-accent)] text-[var(--color-primary-text)] font-semibold" 
                : "border-transparent text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[var(--color-elevated-surface)] border-b border-[var(--color-border)] text-[var(--color-muted-text)] text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4 w-20 text-center">Rank</th>
                <th className="px-6 py-4">Contributor</th>
                <th className="px-6 py-4 text-right">Merged PRs</th>
                <th className="px-6 py-4 text-right">Points</th>
                <th className="px-6 py-4 text-right">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {users.map((user, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={user.id} 
                  className="hover:bg-[var(--color-elevated-surface)]/50 transition-colors"
                >
                  <td className="px-6 py-4 text-center">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                      user.rank === 1 ? "bg-yellow-500/10 text-yellow-500" :
                      user.rank === 2 ? "bg-gray-400/10 text-gray-400" :
                      user.rank === 3 ? "bg-amber-700/10 text-amber-600" :
                      "text-[var(--color-secondary-text)]"
                    }`}>
                      {user.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-[var(--color-border)]" />
                      <div>
                        <div className="font-medium text-[var(--color-primary-text)]">{user.name}</div>
                        <div className="text-xs text-[var(--color-muted-text)]">{user.handle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <div className="flex items-center justify-end gap-1.5 font-medium">
                      {user.merged} <GitMerge className="w-4 h-4 text-[var(--color-muted-text)]" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[var(--color-primary-accent)]">
                    {user.points}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <div className="flex items-center justify-end gap-1.5 font-medium">
                      {user.streak} <Flame className="w-4 h-4 text-orange-500" />
                    </div>
                  </td>
                </motion.tr>
              ))}
              
              {/* Current User */}
              {session?.user && !users.find(u => u.id === session.user?.id) && (
                <>
                  <tr>
                    <td colSpan={5} className="px-6 py-2 text-center text-[var(--color-muted-text)] bg-[var(--color-elevated-surface)]/30">
                      <span className="flex gap-1 justify-center">
                        <span className="w-1 h-1 rounded-full bg-[var(--color-muted-text)]" />
                        <span className="w-1 h-1 rounded-full bg-[var(--color-muted-text)]" />
                        <span className="w-1 h-1 rounded-full bg-[var(--color-muted-text)]" />
                      </span>
                    </td>
                  </tr>
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-[var(--color-primary-accent)]/5 hover:bg-[var(--color-primary-accent)]/10 transition-colors border-t border-[var(--color-primary-accent)]/20"
                  >
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex items-center justify-center font-bold text-sm text-[var(--color-primary-accent)]">
                    {userRank}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={session?.user?.image || "https://github.com/ghost.png"} alt={session?.user?.name || "User"} className="w-10 h-10 rounded-full border-2 border-[var(--color-primary-accent)]" />
                    <div>
                      <div className="font-medium text-[var(--color-primary-text)]">{session?.user?.name || "Contributor"} <span className="ml-2 text-xs bg-[var(--color-primary-accent)]/20 text-[var(--color-primary-accent)] px-2 py-0.5 rounded">YOU</span></div>
                      <div className="text-xs text-[var(--color-primary-accent)]/70">@{(session?.user as any)?.username || "user"}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  <div className="flex items-center justify-end gap-1.5 font-medium text-[var(--color-primary-text)]">
                    {prMerged ? 1 : 0} <GitMerge className="w-4 h-4 text-[var(--color-muted-text)]" />
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-bold text-[var(--color-primary-accent)]">
                  {profile?.points || 0}
                </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <div className="flex items-center justify-end gap-1.5 font-medium text-[var(--color-primary-text)]">
                      {profile?.streak || 0} <Flame className="w-4 h-4 text-orange-500" />
                    </div>
                  </td>
                </motion.tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
