"use client";

import { useState } from "react";
import { User, Bell, Palette, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");

  const tabs = [
    { name: "Profile", icon: User },
    { name: "Preferences", icon: Shield },
    { name: "Notifications", icon: Bell },
    { name: "Appearance", icon: Palette },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-[var(--color-secondary-text)]">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.name
                  ? "bg-[var(--color-elevated-surface)] text-[var(--color-primary-text)]"
                  : "text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] hover:bg-[var(--color-elevated-surface)]/50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </aside>

        <div className="flex-1 space-y-6">
          {activeTab === "Profile" && (
            <div className="space-y-6">
              <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Public Profile</h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="text-xs font-semibold text-[var(--color-muted-text)] uppercase tracking-wider mb-1 block">Name</label>
                      <input type="text" defaultValue="Alex Morgan" className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-primary-accent)]" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--color-muted-text)] uppercase tracking-wider mb-1 block">Bio</label>
                      <textarea defaultValue="Developer based in Bengaluru, India." className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-primary-accent)] h-24 resize-none" />
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-[var(--color-border)]">
                  <Button>Save changes</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Appearance" && (
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6">
              <h3 className="text-lg font-semibold mb-4">Appearance</h3>
              
              <div className="space-y-4">
                <label className="flex items-start gap-4 p-4 rounded-xl border border-[var(--color-primary-accent)] bg-[var(--color-primary-accent)]/5 cursor-pointer">
                  <input type="radio" name="theme" defaultChecked className="mt-1" />
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-[var(--color-secondary-text)]">Sleek, sophisticated, and easy on the eyes.</p>
                  </div>
                </label>
                <label className="flex items-start gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] opacity-50 cursor-not-allowed">
                  <input type="radio" name="theme" disabled className="mt-1" />
                  <div>
                    <p className="font-medium">Light Mode</p>
                    <p className="text-sm text-[var(--color-secondary-text)]">Coming soon.</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6">
              <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
              
              <div className="space-y-4">
                {[
                  { title: "Pull Request Updates", desc: "When maintainers review or merge your PRs.", active: true },
                  { title: "New Issue Recommendations", desc: "When high-match issues are discovered.", active: true },
                  { title: "Achievements", desc: "When you unlock new badges or milestones.", active: false },
                ].map(setting => (
                  <div key={setting.title} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{setting.title}</p>
                      <p className="text-sm text-[var(--color-secondary-text)]">{setting.desc}</p>
                    </div>
                    <div className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${setting.active ? 'bg-[var(--color-primary-accent)]' : 'bg-[var(--color-elevated-surface)] border border-[var(--color-border)]'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${setting.active ? 'left-6' : 'left-1'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === "Preferences" && (
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6 text-center py-12">
              <Shield className="w-12 h-12 text-[var(--color-muted-text)] mx-auto mb-4" />
              <p className="text-[var(--color-secondary-text)]">Preference settings are synced with your GitHub account.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
