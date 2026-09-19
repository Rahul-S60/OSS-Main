"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Search, Bell, Menu, X, LayoutDashboard, Compass, 
  GitMerge, Trophy, Award, UserCircle, Code2
} from "lucide-react";
import { getUserProfile } from "@/app/actions/user";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface Contribution {
  status: string;
  issueId: string;
}

interface UserProfile {
  contributions?: Contribution[];
  points?: number;
}

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Explore", href: "/explore", icon: Compass },
  { name: "My Journey", href: "/contributions/current", icon: GitMerge },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Achievements", href: "/achievements", icon: Award },
  { name: "Profile", href: "/profile", icon: UserCircle },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      getUserProfile().then(data => setProfile(data));
    }
  }, [session]);

  const activeIssueId = profile?.contributions?.find((c: Contribution) => c.status !== "merged")?.issueId;
  const points = profile?.points || 0;
  
  // Don't render shell on landing or onboarding
  if (pathname === "/" || pathname.startsWith("/onboarding")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[var(--color-border)] bg-[var(--color-background)] sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-accent)] flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-[var(--color-secondary-text)]">
            <Search className="w-5 h-5" />
          </button>
          <button className="text-[var(--color-secondary-text)]">
            <Bell className="w-5 h-5" />
          </button>
          <button 
            className="text-[var(--color-primary-text)]"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[var(--color-border)] bg-[var(--color-secondary-bg)] h-screen sticky top-0 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-[var(--color-border)]/50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-accent)] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold tracking-tight">OpenSource Companion</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
          <p className="px-3 text-xs font-semibold text-[var(--color-muted-text)] uppercase tracking-wider mb-2">Menu</p>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href) && 
              (item.href !== "/contributions/current" || activeIssueId);
            return (
              <Link 
                key={item.name} 
                href={item.href === "/contributions/current" && activeIssueId ? `/contributions/${activeIssueId}` : item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative",
                  isActive 
                    ? "text-[var(--color-primary-accent)] bg-[var(--color-primary-accent)]/10" 
                    : "text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] hover:bg-[var(--color-elevated-surface)]"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-[var(--color-border)]/50 shrink-0">
          <Link href="/profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--color-elevated-surface)] transition-colors group">
            <img src={session?.user?.image || "https://github.com/ghost.png"} alt={session?.user?.name || "User"} className="w-10 h-10 rounded-full border border-[var(--color-border)]" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-primary-text)] truncate">{session?.user?.name || "Contributor"}</p>
              <p className="text-xs text-[var(--color-primary-accent)] font-medium">{points} points</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Topbar */}
        <header className="hidden md:flex h-16 items-center justify-between px-8 border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex-1 max-w-md">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-text)] group-hover:text-[var(--color-primary-accent)] transition-colors" />
              <input 
                type="text" 
                placeholder="Search issues, repositories... (Cmd+K)" 
                className="w-full h-10 bg-[var(--color-elevated-surface)] border border-[var(--color-border)] rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:border-[var(--color-primary-accent)] focus:ring-1 focus:ring-[var(--color-primary-accent)] transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] transition-colors rounded-lg hover:bg-[var(--color-elevated-surface)]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-primary-accent)] rounded-full border border-[var(--color-background)]" />
            </button>
            <Link href="/settings" className="w-8 h-8 rounded-full overflow-hidden border border-[var(--color-border)]">
              <img src={session?.user?.image || "https://github.com/ghost.png"} alt={session?.user?.name || "User"} />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-[280px] bg-[var(--color-secondary-bg)] h-full flex flex-col border-r border-[var(--color-border)]"
          >
            <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--color-border)]">
              <span className="font-semibold">OpenSource Companion</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-[var(--color-secondary-text)] hover:bg-[var(--color-elevated-surface)] hover:text-[var(--color-primary-text)]"
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
