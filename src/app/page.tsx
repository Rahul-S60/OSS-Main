"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { GitPullRequest as Github, ArrowRight, Code2, Compass, CheckCircle2, GitMerge } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isConnecting, setIsConnecting] = useState(false);
  const isLoading = status === "loading";

  const handleStart = async () => {
    setIsConnecting(true);
    // Trigger real GitHub authentication flow
    // NextAuth will handle redirecting to GitHub and back to our app callback
    // We set callbackUrl to /onboarding so they arrive at the right place
    await signIn("github", { callbackUrl: "/onboarding" });
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-[var(--color-primary-accent)]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <header className="container mx-auto px-6 h-20 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-accent)] flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">OpenSource Companion</span>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 text-sm font-medium text-[var(--color-secondary-text)]">
            <a href="#how-it-works" className="hover:text-[var(--color-primary-text)] transition-colors">How it works</a>
            <a href="#features" className="hover:text-[var(--color-primary-text)] transition-colors">Features</a>
          </nav>
          {session ? (
            <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")} className="gap-2">
              Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={handleStart} disabled={isConnecting || isLoading} className="gap-2">
                <Github className="w-4 h-4" />
                Login
              </Button>
              <Button size="sm" onClick={handleStart} disabled={isConnecting || isLoading}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 mt-16 md:mt-24">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance leading-tight">
              Your path into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-accent)] to-purple-400">
                open source
              </span> starts here.
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-lg md:text-xl text-[var(--color-secondary-text)] max-w-2xl mx-auto text-balance">
              Discover issues that match your skills, get guided through your first contribution, 
              and build your open-source journey one merge at a time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full flex justify-center pt-4"
          >
            {session ? (
              <div className="flex flex-col items-center gap-4 bg-[var(--color-elevated-surface)] border border-[var(--color-border)] p-6 rounded-2xl w-full max-w-md shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 w-full">
                  <img src={session.user?.image || "https://github.com/ghost.png"} alt="User" className="w-12 h-12 rounded-full border border-[var(--color-border)]" />
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-medium text-[var(--color-primary-text)] truncate">Welcome back, {session.user?.name}!</p>
                    <p className="text-sm text-[var(--color-secondary-text)]">You are already logged in.</p>
                  </div>
                </div>
                <Button size="lg" onClick={() => router.push("/dashboard")} className="w-full group">
                  Go to Dashboard <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                <Button size="lg" onClick={handleStart} disabled={isConnecting || isLoading} className="w-full sm:w-auto group">
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 mr-2 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Github className="mr-2 h-5 w-5" />
                      Login
                      <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
                <Button variant="secondary" size="lg" onClick={handleStart} disabled={isConnecting || isLoading} className="w-full sm:w-auto">
                  Sign Up
                </Button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Feature Preview Steps */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full max-w-5xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-4 gap-6 mb-32"
          id="how-it-works"
        >
          {[
            { step: "01", title: "Build your profile", icon: <Github className="w-5 h-5" /> },
            { step: "02", title: "Find your match", icon: <Compass className="w-5 h-5" /> },
            { step: "03", title: "Follow the path", icon: <CheckCircle2 className="w-5 h-5" /> },
            { step: "04", title: "Grow your profile", icon: <GitMerge className="w-5 h-5" /> },
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-border)] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-[var(--color-muted-text)]">{item.step}</span>
                <div className="text-[var(--color-primary-accent)]">
                  {item.icon}
                </div>
              </div>
              <h3 className="font-medium text-lg">{item.title}</h3>
            </div>
          ))}
        </motion.div>
      </main>
      
      {/* Auth Transition Overlay */}
      <AnimatePresence>
        {isConnecting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[var(--color-background)] flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-elevated-surface)] flex items-center justify-center shadow-xl border border-[var(--color-border)]">
                <Github className="w-8 h-8 text-[var(--color-primary-text)] animate-pulse" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-xl font-medium">Connecting to GitHub</h2>
                <p className="text-[var(--color-secondary-text)] text-sm">Authenticating your developer profile...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
