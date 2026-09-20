"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Bell, Menu, X, LayoutDashboard, Compass, 
  GitMerge, Trophy, Award, UserCircle, Code2, LogOut,
  Sun, Moon
} from "lucide-react";
import { getUserProfile } from "@/app/actions/user";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/components/ThemeProvider";
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
  { name: "My Journey", href: "/journey", icon: GitMerge },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Achievements", href: "/achievements", icon: Award },
  { name: "Profile", href: "/profile", icon: UserCircle },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      getUserProfile().then(data => setProfile(data));
    }
  }, [session]);

  const points = profile?.points || 0;
  
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
    } catch (e) {
      console.error(e);
    }
    window.location.href = "/";
  };

  // Don't render shell on landing or onboarding
  if (pathname === "/" || pathname.startsWith("/onboarding")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur-md sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-accent)] flex items-center justify-center shrink-0 shadow-sm">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight truncate">OpenSource Companion</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] hover:bg-[var(--color-elevated-surface)] transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link href="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-[var(--color-border)] shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={session?.user?.image || "https://github.com/ghost.png"} alt={session?.user?.name || "User"} className="w-full h-full object-cover" />
          </Link>
          <button 
            className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-primary-text)] hover:bg-[var(--color-elevated-surface)] transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[var(--color-border)] bg-[var(--color-secondary-bg)] h-screen sticky top-0 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-[var(--color-border)]/50 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-accent)] flex items-center justify-center shadow-sm">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-sm">OpenSource Companion</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
          <p className="px-3 text-xs font-semibold text-[var(--color-muted-text)] uppercase tracking-wider mb-2">Menu</p>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative",
                  isActive 
                    ? "text-[var(--color-primary-accent)] bg-[var(--color-primary-accent)]/10 font-semibold" 
                    : "text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] hover:bg-[var(--color-elevated-surface)]"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-[var(--color-border)]/50 shrink-0 flex flex-col gap-2">
          <div className="flex items-center justify-between px-2 py-1 mb-1">
            <span className="text-xs text-[var(--color-muted-text)]">Theme</span>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-md border border-[var(--color-border)] text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] hover:bg-[var(--color-elevated-surface)] transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
          <Link href="/profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--color-elevated-surface)] transition-colors group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={session?.user?.image || "https://github.com/ghost.png"} alt={session?.user?.name || "User"} className="w-9 h-9 rounded-full border border-[var(--color-border)] object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-primary-text)] truncate">{session?.user?.name || "Contributor"}</p>
              <p className="text-xs text-[var(--color-primary-accent)] font-semibold">{points} points</p>
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Topbar */}
        <header className="hidden md:flex h-16 items-center justify-between px-8 border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex-1 max-w-md">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-text)] group-hover:text-[var(--color-primary-accent)] transition-colors" />
              <input 
                type="text" 
                placeholder="Search issues, repositories... (Cmd+K)" 
                className="w-full h-9 bg-[var(--color-elevated-surface)] border border-[var(--color-border)] rounded-lg pl-9 pr-4 text-xs focus:outline-none focus:border-[var(--color-primary-accent)] focus:ring-1 focus:ring-[var(--color-primary-accent)] transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] hover:bg-[var(--color-elevated-surface)] transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link href="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-[var(--color-border)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={session?.user?.image || "https://github.com/ghost.png"} alt={session?.user?.name || "User"} className="w-full h-full object-cover" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setMobileMenuOpen(false)} 
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-[290px] max-w-[85vw] bg-[var(--color-secondary-bg)] h-full flex flex-col border-r border-[var(--color-border)] shadow-2xl z-10"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--color-border)] shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[var(--color-primary-accent)] flex items-center justify-center">
                    <Code2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-sm tracking-tight">OpenSource Companion</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-[var(--color-elevated-surface)] text-[var(--color-secondary-text)]"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contributor Profile Header in Drawer */}
              <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-card-bg)]/50 shrink-0">
                <Link 
                  href="/profile" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={session?.user?.image || "https://github.com/ghost.png"} alt={session?.user?.name || "User"} className="w-10 h-10 rounded-full border border-[var(--color-border)] object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-primary-text)] truncate">{session?.user?.name || "Contributor"}</p>
                    <p className="text-xs text-[var(--color-primary-accent)] font-semibold">{points} XP Points</p>
                  </div>
                </Link>
              </div>

              <div className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-1">
                <p className="px-3 text-[11px] font-semibold text-[var(--color-muted-text)] uppercase tracking-wider mb-1">Navigation</p>
                {navItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link 
                      key={item.name} 
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-[var(--color-primary-accent)]/10 text-[var(--color-primary-accent)] font-semibold"
                          : "text-[var(--color-secondary-text)] hover:bg-[var(--color-elevated-surface)] hover:text-[var(--color-primary-text)]"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              <div className="p-4 border-t border-[var(--color-border)] shrink-0 flex flex-col gap-3">
                <div className="flex items-center justify-between px-2 py-1 bg-[var(--color-elevated-surface)] rounded-lg border border-[var(--color-border)]">
                  <span className="text-xs font-medium text-[var(--color-secondary-text)]">Appearance</span>
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-[var(--color-card-bg)] text-[var(--color-primary-text)] border border-[var(--color-border)] shadow-sm"
                  >
                    {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </button>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 border border-red-500/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
