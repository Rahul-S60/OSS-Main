"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import {
  Code2,
  ArrowRight,
  Compass,
  CheckCircle2,
  GitMerge,
  GitPullRequest,
  Trophy,
  Award,
  Sparkles,
  Terminal,
  Layers,
  Cpu,
  BookOpen,
  ShieldCheck,
  Zap,
  Star,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Flame,
  Search,
  Filter,
  Users,
  Target,
  FileText,
  Activity,
  BarChart3,
  Moon,
  Sun,
  Laptop,
  CheckCircle,
  HelpCircle,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useTheme } from "@/components/ThemeProvider";

// Authentic GitHub SVG Icon
function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Sample interactive playground issues
const PLAYGROUND_ISSUES = [
  {
    id: "demo-1",
    repo: "facebook/react",
    title: "Add missing TypeScript definitions for useTransition hook options",
    description: "Provide comprehensive typing for the latest React 19 transition start options and async callback handles in concurrent mode.",
    difficulty: "Beginner" as const,
    matchScore: 94,
    points: 50,
    effort: "1-3 hours",
    languages: ["TypeScript", "React"],
    labels: ["good first issue", "typescript", "documentation"],
    reason: "Direct match with your top GitHub repository language (TypeScript) and beginner-friendly scope.",
    skillScore: 98,
    diffScore: 92,
    repoScore: 96,
    semScore: 90,
  },
  {
    id: "demo-2",
    repo: "vercel/next.js",
    title: "Optimize static font preloading diagnostics in turbopack builds",
    description: "Improve compile-time warning messages when google-fonts fail to resolve during standalone container compilation.",
    difficulty: "Intermediate" as const,
    matchScore: 88,
    points: 150,
    effort: "3-8 hours",
    languages: ["JavaScript", "Node.js"],
    labels: ["area: compiler", "help wanted", "turbopack"],
    reason: "Matches your intermediate full-stack experience tier and frequent Node.js project activity.",
    skillScore: 86,
    diffScore: 91,
    repoScore: 94,
    semScore: 81,
  },
  {
    id: "demo-3",
    repo: "tailwindlabs/tailwindcss",
    title: "Extend arbitrary variant parser for CSS grid subgrid definitions",
    description: "Add parser rule to support arbitrary fractional track sizing expressions inside subgrid declarations for Tailwind v4.",
    difficulty: "Advanced" as const,
    matchScore: 79,
    points: 300,
    effort: "1-3 days",
    languages: ["Rust", "TypeScript"],
    labels: ["enhancement", "parser", "tailwind-v4"],
    reason: "Challenging core parser task suitable for deep algorithmic problem solving and engine contributions.",
    skillScore: 76,
    diffScore: 80,
    repoScore: 89,
    semScore: 71,
  },
];

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Understand the Issue",
    short: "Understand",
    summary: "Deconstruct requirements, maintainer commentary, and boundary context before writing code.",
    checklist: [
      "Review originating issue description and reproduction steps",
      "Inspect maintainer guidelines and label requirements",
      "Identify affected source files and component boundaries",
      "Verify expected test suite behaviors",
    ],
    codeSnippet: `// Maintainer Context & Verification Criteria
// Issue #421: Fix prop propagation in Button Slot component
// Target: src/components/ui/Button.tsx
// Requirements: Maintain zero runtime dependencies, preserve backward-compat`,
  },
  {
    step: "02",
    title: "Automated Environment Setup",
    short: "Setup",
    summary: "One-click copyable git commands to clone, configure upstream, and isolate a feature branch.",
    checklist: [
      "Fork repository to your GitHub account",
      "Clone local working copy with full git history",
      "Configure upstream remote tracking",
      "Create isolated feature branch (\`git checkout -b fix/issue-421\`)",
    ],
    codeSnippet: `git clone https://github.com/your-username/repo.git
cd repo
git remote add upstream https://github.com/upstream/repo.git
git checkout -b fix/issue-prop-slot`,
  },
  {
    step: "03",
    title: "Guided Implementation",
    short: "Implement",
    summary: "Execute code changes accompanied by context-aware checklists and localized testing tips.",
    checklist: [
      "Implement the targeted bugfix or feature modification",
      "Run existing test suites (\`npm test\` / \`cargo test\` / \`pytest\`)",
      "Add unit test cases verifying the edge conditions",
      "Execute linter and typecheckers to avoid CI pipeline failures",
    ],
    codeSnippet: `// Run local verification suite before committing
npm run lint
npm run test -- -u
npx tsc --noEmit`,
  },
  {
    step: "04",
    title: "Conventional Commit Generation",
    short: "Commit",
    summary: "Generate standardized commit messages adhering to repository guidelines and issue linking.",
    checklist: [
      "Format commit using Conventional Commits specification",
      "Explicitly link originating issue number (\`Closes #421\`)",
      "Keep commits atomic, scoped, and well-described",
      "Avoid staging unnecessary artifacts or lockfile noise",
    ],
    codeSnippet: `git add src/components/ui/Button.tsx
git commit -m "fix(ui): ensure Slot child correctly inherits onClick handler

Closes #421"`,
  },
  {
    step: "05",
    title: "Pull Request Readiness Inspection",
    short: "Pull Request",
    summary: "Automated PR template generation, readiness scoring, and pre-flight diff sanity check.",
    checklist: [
      "Push feature branch to your GitHub fork",
      "Generate structured PR title and markdown description",
      "Attach reproduction steps and test verification notes",
      "Inspect git diff for clean formatting and zero extraneous files",
    ],
    codeSnippet: `## Proposed Changes
- Resolves issue where Slot components failed to forward onClick handlers.
- Adds regression unit test verifying component inheritance.

Fixes #421`,
  },
  {
    step: "06",
    title: "Merge Verification & XP Allocation",
    short: "Merge & Reward",
    summary: "Automated GitHub PR status tracking, contribution milestone recognition, and streak progression.",
    checklist: [
      "Maintainer code review feedback resolution",
      "Automated merge detection via GitHub API webhooks",
      "Point credit allocation (+50 / +150 / +300 XP)",
      "Badge unlock and global leaderboard rank update",
    ],
    codeSnippet: `// Verification Event Received
Status: MERGED
Points Credited: +150 XP
Badge Unlocked: "First Pull Request Merged" 🏆
Streak: 5 Days Active 🔥`,
  },
];

const FAQS = [
  {
    q: "What makes Open Source Companion different from GitHub's native issue search?",
    a: "GitHub's native tags (like 'good first issue') are applied manually by maintainers, go stale rapidly, and are completely blind to your specific skills. Open Source Companion scans your GitHub repositories during OAuth authentication, derives your primary programming languages, and evaluates candidates using a 4-factor recommendation algorithm (Language Alignment, Difficulty Tier, Repository Health, and Semantic Overlap) before guiding you through a 6-stage execution cockpit.",
  },
  {
    q: "Do I need years of coding experience to make a contribution?",
    a: "Not at all! Open Source Companion is built specifically for newcomers. Our Beginner tier focuses on scoped tasks (documentation, minor bug fixes, TypeScript type improvements) requiring only 1 to 3 hours, with step-by-step git guidance from clone to pull request.",
  },
  {
    q: "Does the platform require write permissions to my GitHub repositories?",
    a: "No. Open Source Companion uses standard Auth.js (NextAuth) GitHub OAuth with read-only public scope. We only inspect public repository language statistics to build your skill profile. You maintain complete control over your GitHub account, forks, and local git branches.",
  },
  {
    q: "How does the 6-stage contribution workflow work with my local code editor?",
    a: "Open Source Companion acts as your mission control cockpit alongside your favorite editor (VS Code, Cursor, Neovim, etc.) and terminal. It gives you exact git commands to clone and branch, pre-flight checklists, Conventional Commit builders, and automated PR templates so you never get stuck on procedural steps.",
  },
  {
    q: "How are open-source issues collected and how frequently are they updated?",
    a: "Our ingestion pipeline queries the live GitHub Search API for active issues across top public repositories. Ingested issues are normalized, tagged with our interpretable 3-tier difficulty model, and refreshed on regular intervals with authenticated rate limit support.",
  },
  {
    q: "How does the gamification, XP, and badge system work?",
    a: "Every verified contribution earns developer points based on difficulty: 50 XP for Beginner, 150 XP for Intermediate, and 300 XP for Advanced. As you complete milestones, you unlock verifiable achievement badges ('First Merge', 'Polyglot', 'Clean Commits') and climb the global community leaderboard.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();

  const [isConnecting, setIsConnecting] = useState(false);
  const [activeWorkflowIndex, setActiveWorkflowIndex] = useState(0);
  const [selectedPlaygroundIssue, setSelectedPlaygroundIssue] = useState(PLAYGROUND_ISSUES[0]);
  const [openDrawerIssue, setOpenDrawerIssue] = useState<typeof PLAYGROUND_ISSUES[0] | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoading = status === "loading";

  const handleStart = async () => {
    setIsConnecting(true);
    await signIn("github", { callbackUrl: "/onboarding" });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-primary-text)] flex flex-col relative overflow-x-hidden selection:bg-[var(--color-primary-accent)] selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-[var(--color-primary-accent)]/15 via-purple-500/5 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[1200px] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-[2800px] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[130px] pointer-events-none -z-10" />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)]/60 bg-[var(--color-background)]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-accent)] to-purple-600 flex items-center justify-center shadow-lg shadow-[var(--color-primary-accent)]/20 group-hover:scale-105 transition-transform shrink-0">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-base sm:text-lg tracking-tight flex items-center gap-2 truncate">
                OpenSource Companion
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-[var(--color-primary-accent)]/15 text-[var(--color-primary-accent)] border border-[var(--color-primary-accent)]/30">
                  v1.0
                </span>
              </span>
              <span className="hidden sm:inline-block text-[11px] text-[var(--color-muted-text)] font-mono truncate">
                Intelligent OSS Onboarding Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Clean, focused and lets the user explore */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-secondary-text)]">
            <Link
              href="/explore"
              className="text-[var(--color-primary-accent)] hover:text-[var(--color-primary-accent-hover)] transition-colors font-semibold flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              Explore Issues
            </Link>
            <a href="#workflow" className="hover:text-[var(--color-primary-text)] transition-colors">
              How It Works
            </a>
            <a href="#algorithm" className="hover:text-[var(--color-primary-text)] transition-colors">
              Matching Engine
            </a>
            <a href="#architecture" className="hover:text-[var(--color-primary-text)] transition-colors">
              Architecture
            </a>
            <a href="#faq" className="hover:text-[var(--color-primary-text)] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Theme Switcher */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 sm:p-2.5 rounded-lg border border-[var(--color-border)] text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] hover:bg-[var(--color-elevated-surface)] transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {session ? (
              <Button
                variant="default"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="hidden sm:inline-flex gap-2 shadow-md shadow-[var(--color-primary-accent)]/20"
              >
                Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStart}
                  disabled={isConnecting || isLoading}
                  className="hidden lg:flex gap-2"
                >
                  <GithubIcon className="w-4 h-4" />
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={handleStart}
                  disabled={isConnecting || isLoading}
                  className="gap-2 shadow-md shadow-[var(--color-primary-accent)]/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] hover:bg-[var(--color-elevated-surface)] transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-card-bg)] px-5 py-4 flex flex-col gap-2.5 shadow-xl"
            >
              {session ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/dashboard");
                  }}
                  className="w-full justify-center gap-2 mb-2"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleStart();
                  }}
                  disabled={isConnecting || isLoading}
                  className="w-full justify-center gap-2 mb-2 shadow-md shadow-[var(--color-primary-accent)]/20"
                >
                  <GithubIcon className="w-4 h-4" />
                  Get Started with GitHub
                </Button>
              )}
              <Link
                href="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm py-2 px-3 rounded-lg bg-[var(--color-primary-accent)]/10 text-[var(--color-primary-accent)] font-semibold flex items-center justify-between"
              >
                <span>Explore Live Issues</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#workflow"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm py-2 px-3 rounded-lg text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] hover:bg-[var(--color-elevated-surface)] transition-colors"
              >
                How It Works
              </a>
              <a
                href="#algorithm"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm py-2 px-3 rounded-lg text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] hover:bg-[var(--color-elevated-surface)] transition-colors"
              >
                Matching Engine
              </a>
              <a
                href="#architecture"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm py-2 px-3 rounded-lg text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] hover:bg-[var(--color-elevated-surface)] transition-colors"
              >
                Architecture
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm py-2 px-3 rounded-lg text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] hover:bg-[var(--color-elevated-surface)] transition-colors"
              >
                FAQ
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center">
        {/* ========================================================
            HERO SECTION
           ======================================================== */}
        <section className="w-full max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20 flex flex-col items-center text-center">
          {/* Top Pill / Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-primary-accent)]/30 bg-[var(--color-primary-accent)]/10 text-xs font-medium text-[var(--color-primary-accent)] mb-8 shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-[var(--color-primary-accent)] animate-pulse" />
            <span>Live GitHub API Ingestion • 6-Stage Guided Workflow</span>
            <ArrowRight className="w-3 h-3 opacity-70" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-[1.1] text-balance mb-6"
          >
            Turn Intimidating Repositories Into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-accent)] via-purple-400 to-indigo-300">
              Merged Pull Requests.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-[var(--color-secondary-text)] max-w-3xl leading-relaxed text-balance mb-10"
          >
            Open Source Companion analyzes your GitHub repositories, matches beginner-friendly issues with your exact
            skillset, and guides you step-by-step through an in-browser 6-stage contribution cockpit.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16"
          >
            {session ? (
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-[var(--color-card-bg)] border border-[var(--color-border)] p-3 px-5 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={session.user?.image || "https://github.com/ghost.png"}
                    alt="User Avatar"
                    className="w-9 h-9 rounded-full border border-[var(--color-border)]"
                  />
                  <div className="text-left">
                    <p className="text-sm font-semibold">{session.user?.name || "Developer"}</p>
                    <p className="text-xs text-[var(--color-secondary-text)]">Authenticated with GitHub</p>
                  </div>
                </div>
                <Button size="lg" onClick={() => router.push("/dashboard")} className="w-full sm:w-auto gap-2">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={handleStart}
                  disabled={isConnecting || isLoading}
                  className="w-full sm:w-auto gap-2 text-base px-8 h-12 shadow-xl shadow-[var(--color-primary-accent)]/25"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2" />
                      Connecting with GitHub...
                    </>
                  ) : (
                    <>
                      <GithubIcon className="w-5 h-5 mr-1" />
                      Start Contributing with GitHub
                      <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  asChild
                  className="w-full sm:w-auto h-12 px-6 text-base"
                >
                  <Link href="/explore" className="gap-2">
                    <Compass className="w-4 h-4" />
                    Browse Live Issues
                  </Link>
                </Button>
              </>
            )}
          </motion.div>

          {/* Real-time Credibility Metrics Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-0 p-2 sm:p-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)]/80 backdrop-blur-sm shadow-sm"
          >
            <div className="flex flex-col items-center p-3 sm:p-4">
              <span className="text-xl sm:text-3xl font-extrabold text-[var(--color-primary-text)]">10,000+</span>
              <span className="text-[11px] sm:text-xs text-[var(--color-secondary-text)] font-medium mt-0.5">Issues Triaged</span>
            </div>
            <div className="flex flex-col items-center p-3 sm:p-4 border-l border-[var(--color-border)]">
              <span className="text-xl sm:text-3xl font-extrabold text-[var(--color-primary-accent)]">6 Stages</span>
              <span className="text-[11px] sm:text-xs text-[var(--color-secondary-text)] font-medium mt-0.5">Guided Workflow</span>
            </div>
            <div className="flex flex-col items-center p-3 sm:p-4 border-t md:border-t-0 md:border-l border-[var(--color-border)]">
              <span className="text-xl sm:text-3xl font-extrabold text-emerald-400">4 Factors</span>
              <span className="text-[11px] sm:text-xs text-[var(--color-secondary-text)] font-medium mt-0.5">Transparent Matching</span>
            </div>
            <div className="flex flex-col items-center p-3 sm:p-4 border-t md:border-t-0 border-l border-[var(--color-border)]">
              <span className="text-xl sm:text-3xl font-extrabold text-purple-400">100%</span>
              <span className="text-[11px] sm:text-xs text-[var(--color-secondary-text)] font-medium mt-0.5">Interpretable Logic</span>
            </div>
          </motion.div>

          {/* ========================================================
              HERO COCKPIT INTERACTIVE SHOWCASE
             ======================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full max-w-6xl mt-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-secondary-bg)]/90 p-4 sm:p-6 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-3 text-xs font-mono text-[var(--color-muted-text)]">
                  opensource-companion // cockpit-preview.tsx
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="purple" className="text-[10px]">LIVE WORKSPACE</Badge>
              </div>
            </div>

            {/* Cockpit 3-Column Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
              {/* Column 1: Developer Profile Ingestion (3 cols) */}
              <div className="lg:col-span-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-text)]">
                      Contributor Profile
                    </span>
                    <Badge variant="success">OAuth Synced</Badge>
                  </div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      GH
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">@developer_contributor</h3>
                      <p className="text-xs text-[var(--color-secondary-text)]">Scanned: 10 public repositories</p>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-[var(--color-secondary-text)] mb-2">Primary Stack Alignment</p>
                  <div className="space-y-2 mb-6">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>TypeScript / React</span>
                        <span className="font-mono text-[var(--color-primary-accent)]">88%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[var(--color-elevated-surface)] overflow-hidden">
                        <div className="h-full w-[88%] bg-[var(--color-primary-accent)] rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Node.js / Express</span>
                        <span className="font-mono text-purple-400">74%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[var(--color-elevated-surface)] overflow-hidden">
                        <div className="h-full w-[74%] bg-purple-400 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Python / FastApi</span>
                        <span className="font-mono text-emerald-400">62%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[var(--color-elevated-surface)] overflow-hidden">
                        <div className="h-full w-[62%] bg-emerald-400 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-elevated-surface)] border border-[var(--color-border)]/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Experience Tier</span>
                  </div>
                  <span className="font-semibold text-amber-400">Intermediate</span>
                </div>
              </div>

              {/* Column 2: 4-Factor Match Score Drawer Preview (4 cols) */}
              <div className="lg:col-span-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-text)]">
                      Transparent Match Score
                    </span>
                    <Badge variant="purple">94% Match</Badge>
                  </div>

                  <div className="flex items-center gap-4 my-3">
                    <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="var(--color-border)" strokeWidth="5" fill="none" />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="var(--color-primary-accent)"
                          strokeWidth="5"
                          fill="none"
                          strokeDasharray="175"
                          strokeDashoffset="12"
                        />
                      </svg>
                      <span className="absolute font-bold text-sm">94%</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--color-primary-text)]">Exceptional Fit</p>
                      <p className="text-[11px] text-[var(--color-secondary-text)] leading-tight mt-0.5">
                        facebook/react #31048 matches your TypeScript skillset.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[var(--color-border)]/50">
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--color-secondary-text)]">Language Alignment</span>
                      <span className="font-mono text-emerald-400">98% (+24.5)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--color-secondary-text)]">Difficulty Compatibility</span>
                      <span className="font-mono text-indigo-400">92% (+23.0)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--color-secondary-text)]">Repository Health</span>
                      <span className="font-mono text-purple-400">96% (+24.0)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--color-secondary-text)]">Semantic Relevance</span>
                      <span className="font-mono text-amber-400">90% (+22.5)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-2.5 rounded-lg bg-[var(--color-primary-accent)]/10 border border-[var(--color-primary-accent)]/20 text-[11px] text-[var(--color-primary-accent)] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Deterministic Heuristic (No black-box guesses)</span>
                </div>
              </div>

              {/* Column 3: 6-Stage Workflow In Action (4 cols) */}
              <div className="lg:col-span-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-text)]">
                      Guided Workspace
                    </span>
                    <span className="text-xs font-mono text-[var(--color-primary-accent)]">Step 3 of 6</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-[var(--color-primary-accent)] flex items-center justify-center text-white text-xs font-bold">
                      03
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Implement & Verify</h4>
                      <p className="text-[11px] text-[var(--color-secondary-text)]">Testing & localized execution</p>
                    </div>
                  </div>

                  {/* Checklist items */}
                  <div className="space-y-1.5 my-3 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Issue scope isolated & confirmed</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Git branch created (<code className="text-emerald-300">fix/prop-slot</code>)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--color-primary-text)] font-medium">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-[var(--color-primary-accent)] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-[var(--color-primary-accent)] rounded-full animate-ping" />
                      </div>
                      <span>Run unit tests (<code className="text-indigo-300">npm test</code>)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--color-muted-text)]">
                      <div className="w-3.5 h-3.5 rounded-full border border-[var(--color-border)]" />
                      <span>Generate conventional commit</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 pt-3 border-t border-[var(--color-border)]/50 flex items-center justify-between text-xs">
                  <span className="text-[var(--color-secondary-text)]">Reward upon merge</span>
                  <Badge variant="warning" className="font-mono">+150 XP</Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ========================================================
            THE NEWCOMER PROBLEM VS. OUR BREAKTHROUGH
           ======================================================== */}
        <section id="problem" className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-[var(--color-border)]/50">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="danger" className="mb-4">THE ONBOARDING BOTTLENECK</Badge>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-balance mb-4">
              Why Most Aspiring Contributors Struggle on Day One.
            </h2>
            <p className="text-[var(--color-secondary-text)] text-base sm:text-lg leading-relaxed">
              Contributing to unfamiliar codebases presents steep barriers: uncurated issue lists, missing setup instructions, and complex contribution conventions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Barrier 1 */}
            <div className="p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] flex flex-col justify-between hover:border-red-500/40 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Stale & Coarse Issue Tags</h3>
                <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed mb-4">
                  Labels like <code className="text-xs bg-[var(--color-elevated-surface)] px-1.5 py-0.5 rounded text-amber-300">good first issue</code> are applied manually, go stale rapidly, and fail to reflect whether the task matches your specific language experience.
                </p>
              </div>
              <div className="pt-4 border-t border-[var(--color-border)] text-xs text-red-400/90 font-medium">
                The Reality: Standard tags rarely indicate whether an issue matches your programming language.
              </div>
            </div>

            {/* Barrier 2 */}
            <div className="p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] flex flex-col justify-between hover:border-amber-500/40 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">The Local Setup Cliff</h3>
                <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed mb-4">
                  Newcomers face confusing monorepo structures, undocumented environment variables, complex build pipelines, and lack of clear branch naming conventions.
                </p>
              </div>
              <div className="pt-4 border-t border-[var(--color-border)] text-xs text-amber-400/90 font-medium">
                The Reality: Environment setup friction stops contributors before they can write a single line of code.
              </div>
            </div>

            {/* Barrier 3 */}
            <div className="p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] flex flex-col justify-between hover:border-purple-500/40 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                  <GitPullRequest className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">PR Rejection Anxiety</h3>
                <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed mb-4">
                  Uncertainty around Conventional Commits, test requirements, maintainer PR templates, and git rebasing causes hesitation and unsubmitted work.
                </p>
              </div>
              <div className="pt-4 border-t border-[var(--color-border)] text-xs text-purple-400/90 font-medium">
                The Reality: Inconsistent PR formats and missing checks lead to delayed reviews or closed contributions.
              </div>
            </div>
          </div>

          {/* The Solution Banner */}
          <div className="rounded-2xl border border-[var(--color-primary-accent)]/30 bg-gradient-to-r from-[var(--color-primary-accent)]/10 via-purple-500/10 to-indigo-500/10 p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <Badge variant="purple">THE SOLUTION</Badge>
              <h3 className="text-2xl sm:text-3xl font-bold">
                How Open Source Companion Closes the Gap
              </h3>
              <p className="text-[var(--color-secondary-text)] text-sm sm:text-base leading-relaxed">
                By uniting real-time GitHub ingestion, automated developer skill modeling, a 4-factor recommendation algorithm, and an end-to-end 6-stage execution cockpit, we convert passive onlookers into active open-source contributors.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button size="lg" onClick={handleStart} className="gap-2">
                <GithubIcon className="w-4 h-4" /> Start Now
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#workflow">Explore the 6 Stages</a>
              </Button>
            </div>
          </div>
        </section>

        {/* ========================================================
            THE 6-STAGE GUIDED CONTRIBUTION WORKFLOW
           ======================================================== */}
        <section id="workflow" className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-[var(--color-border)]/50">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="purple" className="mb-4">STEP-BY-STEP LIFECYCLE</Badge>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-balance mb-4">
              The 6-Stage Guided Contribution Cockpit
            </h2>
            <p className="text-[var(--color-secondary-text)] text-base sm:text-lg leading-relaxed">
              We decompose open source development into six deterministic, verifiable stages. You never have to guess what to do next.
            </p>
          </div>

          {/* Interactive Step Navigator */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-10">
            {WORKFLOW_STEPS.map((s, idx) => {
              const isActive = activeWorkflowIndex === idx;
              return (
                <button
                  key={s.step}
                  onClick={() => setActiveWorkflowIndex(idx)}
                  className={`p-3 sm:p-4 rounded-xl border text-left transition-all relative ${
                    isActive
                      ? "border-[var(--color-primary-accent)] bg-[var(--color-primary-accent)]/10 shadow-md ring-1 ring-[var(--color-primary-accent)]/30"
                      : "border-[var(--color-border)] bg-[var(--color-card-bg)] hover:bg-[var(--color-elevated-surface)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-mono font-bold ${isActive ? "text-[var(--color-primary-accent)]" : "text-[var(--color-muted-text)]"}`}>
                      {s.step}
                    </span>
                    {isActive && <div className="w-2 h-2 rounded-full bg-[var(--color-primary-accent)]" />}
                  </div>
                  <p className="font-semibold text-xs sm:text-sm tracking-tight truncate">{s.short}</p>
                </button>
              );
            })}
          </div>

          {/* Active Step Showcase Card */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6 sm:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-xl bg-[var(--color-primary-accent)] text-white font-bold flex items-center justify-center text-sm shadow-md">
                    {WORKFLOW_STEPS[activeWorkflowIndex].step}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">
                      {WORKFLOW_STEPS[activeWorkflowIndex].title}
                    </h3>
                    <p className="text-xs text-[var(--color-primary-accent)] font-medium">Stage {activeWorkflowIndex + 1} of 6</p>
                  </div>
                </div>

                <p className="text-[var(--color-secondary-text)] leading-relaxed mb-6">
                  {WORKFLOW_STEPS[activeWorkflowIndex].summary}
                </p>

                <div className="space-y-3 mb-8">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-text)]">
                    Cockpit Verification Checklist
                  </h4>
                  {WORKFLOW_STEPS[activeWorkflowIndex].checklist.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <div className="w-5 h-5 rounded-md bg-[var(--color-elevated-surface)] border border-[var(--color-border)] flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[var(--color-primary-text)]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-[var(--color-border)]">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={activeWorkflowIndex === 0}
                  onClick={() => setActiveWorkflowIndex(prev => prev - 1)}
                >
                  Previous Stage
                </Button>
                <Button
                  size="sm"
                  disabled={activeWorkflowIndex === WORKFLOW_STEPS.length - 1}
                  onClick={() => setActiveWorkflowIndex(prev => prev + 1)}
                  className="gap-2"
                >
                  Next Stage <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Terminal / Code Preview Box */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="flex items-center justify-between bg-[var(--color-elevated-surface)] border border-[var(--color-border)] px-4 py-2.5 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[var(--color-muted-text)]" />
                  <span className="text-xs font-mono text-[var(--color-secondary-text)]">
                    stage-{WORKFLOW_STEPS[activeWorkflowIndex].step}-terminal.sh
                  </span>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      WORKFLOW_STEPS[activeWorkflowIndex].codeSnippet,
                      `stage-${activeWorkflowIndex}`
                    )
                  }
                  className="text-xs flex items-center gap-1 text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] transition-colors"
                >
                  {copiedSnippet === `stage-${activeWorkflowIndex}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy snippet</span>
                    </>
                  )}
                </button>
              </div>
              <div className="flex-1 bg-[var(--color-secondary-bg)] border-x border-b border-[var(--color-border)] p-5 rounded-b-xl font-mono text-xs text-indigo-300 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                {WORKFLOW_STEPS[activeWorkflowIndex].codeSnippet}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            4-FACTOR RECOMMENDATION & MATCHING ENGINE
           ======================================================== */}
        <section id="algorithm" className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-[var(--color-border)]/50">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="purple" className="mb-4">INTELLIGENT MATCHING ENGINE</Badge>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-balance mb-4">
              4-Factor Compatibility Scoring
            </h2>
            <p className="text-[var(--color-secondary-text)] text-base sm:text-lg leading-relaxed">
              No black-box guesses. Open Source Companion evaluates issues across four transparent criteria to ensure every recommendation matches your true stack and velocity.
            </p>
          </div>

          {/* Scoring Model Banner */}
          <div className="max-w-4xl mx-auto p-5 sm:p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-md mb-12 text-center">
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-text)] mb-3">
              COMPOSITE MATCH SCORE CALCULATION
            </p>
            <div className="p-3.5 sm:p-5 rounded-xl bg-[var(--color-secondary-bg)] border border-[var(--color-border)] mb-4">
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 font-mono text-xs sm:text-base md:text-lg font-semibold leading-relaxed">
                <span className="text-[var(--color-primary-accent)] font-bold">Match Score</span>
                <span className="text-[var(--color-muted-text)]">=</span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 whitespace-nowrap">25% Skill Fit</span>
                <span className="text-[var(--color-muted-text)]">+</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 whitespace-nowrap">25% Difficulty</span>
                <span className="text-[var(--color-muted-text)]">+</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">25% Repo Health</span>
                <span className="text-[var(--color-muted-text)]">+</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">25% Relevance</span>
              </div>
            </div>
            <p className="text-xs text-[var(--color-secondary-text)]">
              Produces a normalized 0–100% compatibility rating tailored to your active development profile.
            </p>
          </div>

          {/* The 4 Factors Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Factor 1 */}
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <Badge variant="purple">λ₁ = 0.25</Badge>
                </div>
                <h3 className="font-bold text-lg mb-2">M_skill (Skill Alignment)</h3>
                <p className="text-xs text-[var(--color-secondary-text)] leading-relaxed mb-4">
                  Extracts top 5 languages across your 10 most active GitHub repositories and computes Jaccard/cosine language overlap against the issue repository.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--color-elevated-surface)] text-xs font-mono text-indigo-300">
                Range: [0 - 100%]
              </div>
            </div>

            {/* Factor 2 */}
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Target className="w-5 h-5" />
                  </div>
                  <Badge variant="purple">λ₂ = 0.25</Badge>
                </div>
                <h3 className="font-bold text-lg mb-2">M_diff (Difficulty Fit)</h3>
                <p className="text-xs text-[var(--color-secondary-text)] leading-relaxed mb-4">
                  Maps deterministic rules (Beginner = 1-3h / 50 XP, Intermediate = 3-8h / 150 XP, Advanced = 1-3d / 300 XP) to your declared experience tier.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--color-elevated-surface)] text-xs font-mono text-purple-300">
                3 Discrete Tiers
              </div>
            </div>

            {/* Factor 3 */}
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <Badge variant="purple">λ₃ = 0.25</Badge>
                </div>
                <h3 className="font-bold text-lg mb-2">M_repo (Repository Health)</h3>
                <p className="text-xs text-[var(--color-secondary-text)] leading-relaxed mb-4">
                  Measures repository vitality, commit recency, maintainer commentary latency, and open PR merge frequency to avoid abandoned issues.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--color-elevated-surface)] text-xs font-mono text-emerald-300">
                Active Pulse Ingestion
              </div>
            </div>

            {/* Factor 4 */}
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <Badge variant="purple">λ₄ = 0.25</Badge>
                </div>
                <h3 className="font-bold text-lg mb-2">M_sem (Semantic Relevance)</h3>
                <p className="text-xs text-[var(--color-secondary-text)] leading-relaxed mb-4">
                  Performs keyword token extraction across issue title, description body, and technical labels matching your interest profile.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--color-elevated-surface)] text-xs font-mono text-amber-300">
                Token & Tag Correlation
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            INTERACTIVE TEST-DRIVE ISSUE PLAYGROUND
           ======================================================== */}
        <section id="playground" className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-[var(--color-border)]/50">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="success" className="mb-4">LIVE PLAYGROUND</Badge>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-balance mb-4">
              Test-Drive the Recommendation Drawer
            </h2>
            <p className="text-[var(--color-secondary-text)] text-base sm:text-lg leading-relaxed">
              Explore how real GitHub issues are categorized and scored. Click on any sample issue to inspect its transparent matching breakdown.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {PLAYGROUND_ISSUES.map((issue) => {
              const isSelected = selectedPlaygroundIssue.id === issue.id;
              return (
                <div
                  key={issue.id}
                  onClick={() => setSelectedPlaygroundIssue(issue)}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-[var(--color-primary-accent)] bg-[var(--color-card-bg)] shadow-xl ring-2 ring-[var(--color-primary-accent)]/20"
                      : "border-[var(--color-border)] bg-[var(--color-secondary-bg)] hover:bg-[var(--color-card-bg)]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://github.com/${issue.repo.split("/")[0]}.png?size=32`}
                          alt={issue.repo}
                          className="w-5 h-5 rounded-full border border-[var(--color-border)]"
                        />
                        <span className="text-xs font-medium text-[var(--color-primary-accent)]">
                          {issue.repo}
                        </span>
                      </div>
                      <Badge
                        variant={
                          issue.difficulty === "Beginner"
                            ? "success"
                            : issue.difficulty === "Intermediate"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {issue.difficulty}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-base mb-2 line-clamp-2 leading-snug">
                      {issue.title}
                    </h3>

                    <p className="text-xs text-[var(--color-secondary-text)] line-clamp-3 mb-4 leading-relaxed">
                      {issue.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {issue.labels.map((l) => (
                        <span
                          key={l}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--color-elevated-surface)] border border-[var(--color-border)] text-[var(--color-secondary-text)]"
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[var(--color-primary-accent)]">
                        {issue.matchScore}%
                      </span>
                      <span className="text-[11px] text-[var(--color-muted-text)]">Match</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDrawerIssue(issue);
                      }}
                      className="text-xs"
                    >
                      Inspect Match Score
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center">
            <Button size="lg" asChild className="gap-2">
              <Link href="/explore">
                Explore All 10,000+ Ingested Issues <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* ========================================================
            GAMIFICATION & DEVELOPER PROGRESSION
           ======================================================== */}
        <section className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-[var(--color-border)]/50">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="warning" className="mb-4">PROGRESSION & RECOGNITION</Badge>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-balance mb-4">
              Gamified XP, Milestone Badges & Streaks
            </h2>
            <p className="text-[var(--color-secondary-text)] text-base sm:text-lg leading-relaxed">
              Contributing to open source should be exciting and measurable. Turn every merged commit into verifiable developer reputation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* XP System */}
            <div className="p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Tiered XP Allocation</h3>
                <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed mb-6">
                  Points scale according to verifiable issue effort and architectural complexity:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-elevated-surface)] border border-[var(--color-border)]/50">
                    <span className="text-xs font-semibold text-emerald-400">Beginner Tier</span>
                    <span className="font-mono text-sm font-bold">+50 XP</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-elevated-surface)] border border-[var(--color-border)]/50">
                    <span className="text-xs font-semibold text-amber-400">Intermediate Tier</span>
                    <span className="font-mono text-sm font-bold">+150 XP</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-elevated-surface)] border border-[var(--color-border)]/50">
                    <span className="text-xs font-semibold text-red-400">Advanced Tier</span>
                    <span className="font-mono text-sm font-bold">+300 XP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Verifiable Achievement Badges</h3>
                <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed mb-6">
                  Earn tangible trophies as you master different open-source disciplines:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-[var(--color-elevated-surface)] border border-[var(--color-border)]/50 text-center">
                    <span className="text-lg">🌟</span>
                    <p className="text-xs font-semibold mt-1">First Merge</p>
                    <p className="text-[10px] text-[var(--color-muted-text)]">Ship 1st PR</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--color-elevated-surface)] border border-[var(--color-border)]/50 text-center">
                    <span className="text-lg">⚡</span>
                    <p className="text-xs font-semibold mt-1">Polyglot</p>
                    <p className="text-[10px] text-[var(--color-muted-text)]">3 Languages</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--color-elevated-surface)] border border-[var(--color-border)]/50 text-center">
                    <span className="text-lg">🔥</span>
                    <p className="text-xs font-semibold mt-1">Streak King</p>
                    <p className="text-[10px] text-[var(--color-muted-text)]">7-Day Streak</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--color-elevated-surface)] border border-[var(--color-border)]/50 text-center">
                    <span className="text-lg">🛡️</span>
                    <p className="text-xs font-semibold mt-1">Clean Commits</p>
                    <p className="text-[10px] text-[var(--color-muted-text)]">100% Format</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Streak & Leaderboard */}
            <div className="p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Habit Formation & Streaks</h3>
                <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed mb-6">
                  Consistency builds confidence. Stay engaged with weekly milestone goals and community rankings.
                </p>
                <div className="p-4 rounded-xl bg-[var(--color-elevated-surface)] border border-[var(--color-border)]/50 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center text-red-400 font-bold text-lg">
                    🔥 5
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Active Streak: 5 Days</p>
                    <p className="text-xs text-[var(--color-secondary-text)]">Next reward unlocked in 2 days</p>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-[var(--color-border)]">
                <Link
                  href="/leaderboard"
                  className="text-xs font-medium text-[var(--color-primary-accent)] flex items-center justify-between hover:underline"
                >
                  <span>View Global Developer Leaderboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            ENTERPRISE FULL-STACK ARCHITECTURE
           ======================================================== */}
        <section id="architecture" className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-[var(--color-border)]/50">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="purple" className="mb-4">ENGINEERING FOUNDATION</Badge>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-balance mb-4">
              Production Architecture & Full-Stack Tech
            </h2>
            <p className="text-[var(--color-secondary-text)] text-base sm:text-lg leading-relaxed">
              Engineered with modern cloud standards for zero-downtime reliability, strong type safety, and lightning-fast edge performance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-elevated-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary-accent)] font-bold">
                  N
                </div>
                <div>
                  <h3 className="font-bold text-base">Next.js 16 (Turbopack)</h3>
                  <p className="text-xs text-[var(--color-secondary-text)]">App Router & Server Actions</p>
                </div>
              </div>
              <p className="text-xs text-[var(--color-secondary-text)] leading-relaxed">
                Utilizes React 19 Server Components, streaming SSR, standalone container compilation, and Turbopack for ultra-fast dev server execution.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-elevated-surface)] border border-[var(--color-border)] flex items-center justify-center text-emerald-400 font-bold">
                  PG
                </div>
                <div>
                  <h3 className="font-bold text-base">PostgreSQL & Prisma ORM</h3>
                  <p className="text-xs text-[var(--color-secondary-text)]">Persistent State & Migrations</p>
                </div>
              </div>
              <p className="text-xs text-[var(--color-secondary-text)] leading-relaxed">
                PostgreSQL 15 with automated Prisma migrations, managing user profile states, contribution workflows, point balances, and audit logs.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-elevated-surface)] border border-[var(--color-border)] flex items-center justify-center text-purple-400 font-bold">
                  🔒
                </div>
                <div>
                  <h3 className="font-bold text-base">Auth.js v5 (NextAuth)</h3>
                  <p className="text-xs text-[var(--color-secondary-text)]">OAuth 2.0 & JWT Ingestion</p>
                </div>
              </div>
              <p className="text-xs text-[var(--color-secondary-text)] leading-relaxed">
                Seamless GitHub OAuth handshake extracting language statistics during JWT synthesis, securing server actions with cryptographically signed cookies.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-elevated-surface)] border border-[var(--color-border)] flex items-center justify-center text-blue-400 font-bold">
                  GH
                </div>
                <div>
                  <h3 className="font-bold text-base">GitHub Search REST API v3</h3>
                  <p className="text-xs text-[var(--color-secondary-text)]">Real-Time Ingestion Pipeline</p>
                </div>
              </div>
              <p className="text-xs text-[var(--color-secondary-text)] leading-relaxed">
                Automated querying with authenticated token rotation supporting 5,000 req/hr rate limits and graceful unauthenticated fallbacks.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-elevated-surface)] border border-[var(--color-border)] flex items-center justify-center text-sky-400 font-bold">
                  🎨
                </div>
                <div>
                  <h3 className="font-bold text-base">Tailwind CSS v4 & Motion</h3>
                  <p className="text-xs text-[var(--color-secondary-text)]">Framer Motion & Glassmorphism</p>
                </div>
              </div>
              <p className="text-xs text-[var(--color-secondary-text)] leading-relaxed">
                Engineered with modern CSS custom properties, dual light/dark themes, hardware-accelerated animations, and responsive layouts.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-elevated-surface)] border border-[var(--color-border)] flex items-center justify-center text-indigo-400 font-bold">
                  🐳
                </div>
                <div>
                  <h3 className="font-bold text-base">Docker & Render Deploy</h3>
                  <p className="text-xs text-[var(--color-secondary-text)]">Multi-Stage Containerization</p>
                </div>
              </div>
              <p className="text-xs text-[var(--color-secondary-text)] leading-relaxed">
                Zero-config production Dockerfile with non-root security privileges, healthcheck probes, and automatic migration deployments on boot.
              </p>
            </div>
          </div>
        </section>


        {/* ========================================================
            FREQUENTLY ASKED QUESTIONS (FAQ)
           ======================================================== */}
        <section id="faq" className="w-full max-w-5xl mx-auto px-6 py-24 border-t border-[var(--color-border)]/50">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="purple" className="mb-4">KNOWLEDGE BASE</Badge>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-balance mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-[var(--color-secondary-text)] text-base sm:text-lg leading-relaxed">
              Everything you need to know about the platform, security, workflows, and developer progression.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-semibold text-base sm:text-lg hover:text-[var(--color-primary-accent)] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="p-1 rounded-lg bg-[var(--color-elevated-surface)] text-[var(--color-secondary-text)] shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-6 pb-6 text-sm text-[var(--color-secondary-text)] leading-relaxed border-t border-[var(--color-border)]/50 pt-4"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            FINAL CALL TO ACTION (CTA)
           ======================================================== */}
        <section className="w-full max-w-7xl mx-auto px-6 py-20">
          <div className="rounded-3xl border border-[var(--color-primary-accent)]/40 bg-gradient-to-br from-[var(--color-primary-accent)]/20 via-[var(--color-card-bg)] to-purple-900/20 p-8 sm:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--color-primary-accent)]/20 text-xs font-semibold text-[var(--color-primary-accent)] border border-[var(--color-primary-accent)]/30">
                <Sparkles className="w-3.5 h-3.5" /> Start Your Journey Today
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-balance leading-tight">
                Ready to Ship Your First Verified Open Source Contribution?
              </h2>
              <p className="text-base sm:text-lg text-[var(--color-secondary-text)] max-w-2xl mx-auto text-balance leading-relaxed">
                Connect with GitHub in seconds. We’ll analyze your skills, recommend matched issues, and walk you across the finish line.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={handleStart}
                  disabled={isConnecting || isLoading}
                  className="w-full sm:w-auto h-12 px-8 text-base shadow-xl shadow-[var(--color-primary-accent)]/30 gap-2"
                >
                  <GithubIcon className="w-5 h-5" />
                  Connect GitHub & Start
                  <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
                </Button>
                <Button variant="secondary" size="lg" asChild className="w-full sm:w-auto h-12 px-6 text-base">
                  <Link href="/explore">Browse Issues Without Login</Link>
                </Button>
              </div>

              <p className="text-xs text-[var(--color-muted-text)] pt-2">
                100% Free & Open Source under MIT License • No credit card or intrusive permissions
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================
          ENTERPRISE FOOTER
         ======================================================== */}
      <footer className="w-full border-t border-[var(--color-border)] bg-[var(--color-secondary-bg)]/80 pt-16 pb-12 text-sm text-[var(--color-secondary-text)]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-accent)] flex items-center justify-center text-white">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-[var(--color-primary-text)] tracking-tight">
                OpenSource Companion
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm">
              An intelligent, research-grounded platform engineered to facilitate newcomer onboarding through automated issue acquisition, interpretable difficulty categorization, and a guided 6-stage contribution workflow.
            </p>
            <div className="flex items-center gap-2 text-xs text-[var(--color-muted-text)] pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span>System Status: Production Ready (Render)</span>
            </div>
          </div>

          {/* Nav Col 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary-text)]">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/explore" className="hover:text-[var(--color-primary-text)] transition-colors">
                  Explore Issues
                </Link>
              </li>
              <li>
                <Link href="/journey" className="hover:text-[var(--color-primary-text)] transition-colors">
                  Contribution Journey
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-[var(--color-primary-text)] transition-colors">
                  Global Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-[var(--color-primary-text)] transition-colors">
                  Badges & Achievements
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[var(--color-primary-text)] transition-colors">
                  Developer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Col 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary-text)]">Architecture</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-[var(--color-primary-text)] font-medium">Next.js 16</span> App Router
              </li>
              <li>
                <span className="text-[var(--color-primary-text)] font-medium">React 19</span> Server Components
              </li>
              <li>
                <span className="text-[var(--color-primary-text)] font-medium">PostgreSQL 15</span> Prisma ORM
              </li>
              <li>
                <span className="text-[var(--color-primary-text)] font-medium">Auth.js v5</span> GitHub OAuth
              </li>
              <li>
                <span className="text-[var(--color-primary-text)] font-medium">Docker</span> Multi-Stage Deploy
              </li>
            </ul>
          </div>

          {/* Nav Col 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary-text)]">Open Source & Docs</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/explore" className="hover:text-[var(--color-primary-text)] transition-colors">
                  Live Issue Feed
                </Link>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[var(--color-primary-text)] transition-colors flex items-center gap-1">
                  GitHub Repository <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <span className="text-[var(--color-muted-text)]">MIT License (Free & Open Source)</span>
              </li>
              <li>
                <span className="text-[var(--color-muted-text)]">Production Ready (Render)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-[var(--color-border)]/50 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--color-muted-text)] gap-4">
          <p>© {new Date().getFullYear()} OpenSource Companion. Built with pride for open source contributors worldwide.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[var(--color-secondary-text)]">Top</a>
            <a href="#workflow" className="hover:text-[var(--color-secondary-text)]">Workflow</a>
            <a href="#algorithm" className="hover:text-[var(--color-secondary-text)]">Matching</a>
            <a href="#architecture" className="hover:text-[var(--color-secondary-text)]">Architecture</a>
            <a href="#faq" className="hover:text-[var(--color-secondary-text)]">FAQ</a>
          </div>
        </div>
      </footer>

      {/* ========================================================
          INTERACTIVE MATCH SCORE DRAWER MODAL (SANDBOX)
         ======================================================== */}
      <AnimatePresence>
        {openDrawerIssue && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenDrawerIssue(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--color-card-bg)] border-l border-[var(--color-border)] shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Transparent Match Breakdown</h3>
                  <p className="text-xs text-[var(--color-secondary-text)]">{openDrawerIssue.repo}</p>
                </div>
                <button
                  onClick={() => setOpenDrawerIssue(null)}
                  className="p-2 rounded-lg hover:bg-[var(--color-elevated-surface)] text-[var(--color-secondary-text)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
                {/* Circular score */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 p-4 rounded-xl bg-[var(--color-elevated-surface)] border border-[var(--color-border)]/50 text-center sm:text-left">
                  <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="34" stroke="var(--color-border)" strokeWidth="6" fill="none" />
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        stroke="var(--color-primary-accent)"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray="213"
                        strokeDashoffset={213 - (213 * openDrawerIssue.matchScore) / 100}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-lg font-bold">{openDrawerIssue.matchScore}%</span>
                    </div>
                  </div>
                  <div>
                    <Badge variant="purple" className="mb-1">{openDrawerIssue.difficulty} Tier</Badge>
                    <h4 className="font-semibold text-sm leading-tight mb-1">{openDrawerIssue.title}</h4>
                    <p className="text-xs text-[var(--color-secondary-text)] font-mono">Bounty: +{openDrawerIssue.points} XP</p>
                  </div>
                </div>

                {/* Algorithmic Reason */}
                <div className="p-4 rounded-xl bg-[var(--color-primary-accent)]/10 border border-[var(--color-primary-accent)]/20 text-xs text-[var(--color-primary-text)] leading-relaxed">
                  <span className="font-semibold block mb-1">Recommendation Rationalization:</span>
                  {openDrawerIssue.reason}
                </div>

                {/* 4 Factor Weights */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-text)]">
                    Scoring Factor Decomposition
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-[var(--color-secondary-text)]">Language Alignment (M_skill)</span>
                        <span className="font-mono font-bold text-emerald-400">{openDrawerIssue.skillScore}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[var(--color-elevated-surface)] overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${openDrawerIssue.skillScore}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-[var(--color-secondary-text)]">Difficulty Tier Fit (M_diff)</span>
                        <span className="font-mono font-bold text-indigo-400">{openDrawerIssue.diffScore}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[var(--color-elevated-surface)] overflow-hidden">
                        <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${openDrawerIssue.diffScore}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-[var(--color-secondary-text)]">Repository Health (M_repo)</span>
                        <span className="font-mono font-bold text-purple-400">{openDrawerIssue.repoScore}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[var(--color-elevated-surface)] overflow-hidden">
                        <div className="h-full bg-purple-400 rounded-full" style={{ width: `${openDrawerIssue.repoScore}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-[var(--color-secondary-text)]">Semantic Overlap (M_sem)</span>
                        <span className="font-mono font-bold text-amber-400">{openDrawerIssue.semScore}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[var(--color-elevated-surface)] overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${openDrawerIssue.semScore}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--color-elevated-surface)] border border-[var(--color-border)] text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-muted-text)]">Estimated Effort</span>
                    <span className="font-semibold">{openDrawerIssue.effort}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-muted-text)]">Technologies</span>
                    <span className="font-semibold">{openDrawerIssue.languages.join(", ")}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[var(--color-border)] flex flex-col gap-2">
                <Button size="lg" onClick={handleStart} className="w-full gap-2">
                  <GithubIcon className="w-4 h-4" /> Enroll via GitHub Login
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setOpenDrawerIssue(null)} className="w-full">
                  Close Drawer
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Auth Connecting Transition Overlay */}
      <AnimatePresence>
        {isConnecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[var(--color-background)] flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-6 p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-2xl max-w-sm text-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-elevated-surface)] flex items-center justify-center shadow-xl border border-[var(--color-border)]">
                <GithubIcon className="w-8 h-8 text-[var(--color-primary-accent)] animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">Connecting to GitHub</h3>
                <p className="text-[var(--color-secondary-text)] text-xs">
                  Authenticating profile & scanning public language tags...
                </p>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-[var(--color-primary-accent)] border-t-transparent animate-spin" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
