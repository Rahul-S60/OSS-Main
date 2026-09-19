"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Link as LinkIcon, GitPullRequest as Github, Share2, Copy, Trophy, GitMerge, Flame } from "lucide-react";
import { useSession } from "next-auth/react";
import { achievements } from "@/data/achievements";
import { getUserProfile, updateUserProfileDetails } from "@/app/actions/user";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { X, Save } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import * as Icons from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const { addToast } = useToast();
  const [isSharing, setIsSharing] = useState(false);
  const [heatmap, setHeatmap] = useState<number[][]>([]);
  
  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    experienceLevel: "Beginner",
    languages: "",
  });

  useEffect(() => {
    getUserProfile().then(data => {
      setProfile(data);
      if (data) {
        setEditForm({
          name: session?.user?.name || "",
          bio: data.bio || "",
          experienceLevel: data.experienceLevel || "Beginner",
          languages: data.languages?.join(", ") || "",
        });
      }
    });
  }, [session]);

  const unlockedBadgesList = profile?.unlockedBadges || [];
  const unlockedBadges = achievements.filter(b => unlockedBadgesList.includes(b.id));

  const handleShare = () => {
    setIsSharing(true);
    setTimeout(() => {
      setIsSharing(false);
      addToast({ title: "Profile link copied to clipboard", type: "success" });
    }, 500);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const languagesArray = editForm.languages.split(",").map(s => s.trim()).filter(s => s.length > 0);
      await updateUserProfileDetails(editForm.name, editForm.bio, editForm.experienceLevel, languagesArray);
      
      // Update local state instantly
      setProfile((prev: any) => ({
        ...prev,
        bio: editForm.bio,
        experienceLevel: editForm.experienceLevel,
        languages: languagesArray,
      }));
      // Note: session.user.name won't update instantly without NextAuth session refresh, 
      // but it will apply on next full page reload.
      
      setIsEditing(false);
      addToast({ title: "Profile updated successfully", type: "success" });
    } catch (e) {
      console.error(e);
      addToast({ title: "Failed to update profile", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const generateHeatmap = () => {
      const weeks = 20;
      const days = 7;
      const grid = [];
      const countsByDate: Record<string, number> = {};
      
      if (profile?.contributions) {
        profile.contributions.forEach((c: any) => {
          if (c.createdAt) {
            const createdDate = new Date(c.createdAt).toISOString().split('T')[0];
            countsByDate[createdDate] = (countsByDate[createdDate] || 0) + 1;
          }
          
          if (c.status === "merged" && c.updatedAt) {
            const updatedDate = new Date(c.updatedAt).toISOString().split('T')[0];
            countsByDate[updatedDate] = (countsByDate[updatedDate] || 0) + 1;
          }
        });
      }

      const today = new Date();
      const todayDayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday

      for (let w = 0; w < weeks; w++) {
        const week = [];
        for (let d = 0; d < days; d++) {
          // If we are in the last week, and the day is in the future relative to today
          if (w === weeks - 1 && d > todayDayOfWeek) {
            week.push(0);
            continue;
          }
          
          // Calculate how many days ago this cell represents
          const daysAgo = (weeks - 1 - w) * 7 + (todayDayOfWeek - d);
          
          const date = new Date();
          date.setDate(today.getDate() - daysAgo);
          
          const dateString = date.toISOString().split('T')[0];
          const count = countsByDate[dateString] || 0;
          
          let level = 0;
          if (count === 1) level = 1;
          else if (count === 2) level = 2;
          else if (count === 3) level = 3;
          else if (count >= 4) level = 4;
          
          week.push(level);
        }
        grid.push(week);
      }
      return grid;
    };

    setHeatmap(generateHeatmap());
  }, [profile?.contributions]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Profile Section */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
        <div className="h-32 bg-gradient-to-r from-[var(--color-primary-accent)] to-purple-600 opacity-80" />
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12 mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-[var(--color-card-bg)] overflow-hidden bg-[var(--color-background)] shrink-0">
              <img src={session?.user?.image || "https://github.com/ghost.png"} alt={session?.user?.name || "User"} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[var(--color-primary-text)]">{session?.user?.name || 'Contributor'}</h1>
                {profile?.experienceLevel && (
                  <Badge variant="secondary" className="uppercase text-[10px] tracking-wider">{profile.experienceLevel}</Badge>
                )}
              </div>
              <p className="text-[var(--color-secondary-text)]">@{(session?.user as any)?.username || 'user'}</p>
            </div>
            <div className="w-full md:w-auto flex gap-3 mt-4 md:mt-0">
              <Button onClick={() => setIsEditing(true)} variant="secondary" className="w-full md:w-auto">
                Edit Profile
              </Button>
              <Button onClick={handleShare} className="w-full md:w-auto gap-2">
                {isSharing ? <Copy className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                Share
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <p className="text-[var(--color-primary-text)] font-medium">Open Source Contributor</p>
              {profile?.bio && (
                <p className="text-sm text-[var(--color-secondary-text)]">{profile.bio}</p>
              )}
              <div className="space-y-2 text-sm text-[var(--color-secondary-text)] pt-2 border-t border-[var(--color-border)]/50">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {(session?.user as any)?.location || 'Global'}
                </div>
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" /> github.com/{(session?.user as any)?.username || 'user'}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Points", value: profile?.points || 0, icon: Trophy, color: "text-amber-400" },
                { label: "Merged PRs", value: profile?.prMerged ? 1 : 0, icon: GitMerge, color: "text-[var(--color-primary-accent)]" },
                { label: "Contributions", value: profile?.issueEnrolled ? 1 : 0, icon: Github, color: "text-[var(--color-primary-text)]" },
                { label: "Day Streak", value: profile?.streak || 0, icon: Flame, color: "text-orange-500" },
              ].map(stat => (
                <div key={stat.label} className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated-surface)]/50 text-center">
                  <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-[var(--color-secondary-text)] uppercase tracking-wider font-semibold mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Heatmap */}
          <section className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center justify-between">
              Contribution Activity
              <span className="text-sm font-normal text-[var(--color-secondary-text)]">{profile?.contributions?.length || 0} contributions in the last year</span>
            </h2>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-1 min-w-max">
                {heatmap.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1">
                    {week.map((level, dIdx) => (
                      <div 
                        key={dIdx} 
                        className={`w-3.5 h-3.5 rounded-sm transition-colors ${
                          level === 0 ? "bg-[var(--color-elevated-surface)] border border-[var(--color-border)]/50" :
                          level === 1 ? "bg-[var(--color-success)]/30" :
                          level === 2 ? "bg-[var(--color-success)]/60" :
                          level === 3 ? "bg-[var(--color-success)]/90" :
                          "bg-[var(--color-success)]"
                        }`} 
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* History */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Recent History</h2>
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
              {profile?.contributions && profile.contributions.length > 0 ? (
                profile.contributions.map((c: any) => (
                  <div key={c.id} className="p-4 border-b border-[var(--color-border)] last:border-0 flex items-start gap-4">
                    {c.status === "merged" ? (
                      <div className="mt-1 w-8 h-8 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center shrink-0">
                        <GitMerge className="w-4 h-4 text-[var(--color-success)]" />
                      </div>
                    ) : (
                      <div className="mt-1 w-8 h-8 rounded-full bg-[var(--color-primary-accent)]/10 flex items-center justify-center shrink-0">
                        <Github className="w-4 h-4 text-[var(--color-primary-accent)]" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">
                        {c.status === "merged" ? "Merged PR in " : "Working on "} 
                        <span className="text-[var(--color-primary-accent)]">{c.issue.repository}</span>
                      </p>
                      <p className="text-sm text-[var(--color-secondary-text)]">{c.issue.title}</p>
                      <p className="text-xs text-[var(--color-muted-text)] mt-1">
                        {c.status === "merged" ? "Completed" : "In progress"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-[var(--color-secondary-text)]">
                  No history available yet.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {(profile?.languages?.length > 0 ? profile.languages : ["React", "FastAPI", "Git"]).map((skill: string) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </section>

          {/* Badges */}
          <section className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Badges ({unlockedBadges.length})</h2>
            {unlockedBadges.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {unlockedBadges.map(badge => {
                  // @ts-ignore
                  const Icon = Icons[badge.icon] || Icons.Trophy;
                  return (
                    <div key={badge.id} className="flex flex-col items-center text-center gap-2">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--color-primary-accent)]/10 text-[var(--color-primary-accent)]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-medium leading-tight">{badge.title}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-[var(--color-secondary-text)] text-center py-4">
                No badges earned yet. Complete your first contribution!
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-[var(--color-card-bg)] border border-[var(--color-border)] shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-bold">Edit Profile</h2>
              <button onClick={() => setIsEditing(false)} className="text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-primary-text)]">Display Name</label>
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full h-11 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3 focus:outline-none focus:border-[var(--color-primary-accent)] focus:ring-1 focus:ring-[var(--color-primary-accent)]"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-primary-text)]">Bio</label>
                <textarea 
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full h-24 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-3 focus:outline-none focus:border-[var(--color-primary-accent)] focus:ring-1 focus:ring-[var(--color-primary-accent)] resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-primary-text)]">Experience Level</label>
                <select 
                  value={editForm.experienceLevel}
                  onChange={(e) => setEditForm({ ...editForm, experienceLevel: e.target.value })}
                  className="w-full h-11 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3 focus:outline-none focus:border-[var(--color-primary-accent)] focus:ring-1 focus:ring-[var(--color-primary-accent)]"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <p className="text-xs text-[var(--color-secondary-text)] mt-1">This badge will be displayed next to your name on your profile.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--color-primary-text)]">Skills (Languages & Tools)</label>
                <input 
                  type="text" 
                  value={editForm.languages}
                  onChange={(e) => setEditForm({ ...editForm, languages: e.target.value })}
                  placeholder="e.g. React, Python, Docker"
                  className="w-full h-11 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3 focus:outline-none focus:border-[var(--color-primary-accent)] focus:ring-1 focus:ring-[var(--color-primary-accent)]"
                />
                <p className="text-xs text-[var(--color-secondary-text)] mt-1">Separate skills with commas.</p>
              </div>
            </div>

            <div className="p-5 border-t border-[var(--color-border)] flex justify-end gap-3 bg-[var(--color-elevated-surface)]/30">
              <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
                {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save Profile</>}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
