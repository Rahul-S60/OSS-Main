"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Code2, Layers, UserCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const STEPS = ["Profile", "Skills", "Experience", "Ready"];

export default function OnboardingFlow() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  
  // State for Step 2
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["Python", "JavaScript", "TypeScript", "React", "FastAPI", "Git"]);
  const availableSkills = ["Go", "Java", "Rust", "C++", "Django", "Node.js", "Vue", "Docker", "PostgreSQL"];
  
  // State for Step 3
  const [experience, setExperience] = useState<string | null>(null);

  // State for Step 4 (Analysis)
  const [analysisStep, setAnalysisStep] = useState(0);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      router.push("/dashboard");
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  useEffect(() => {
    if (currentStep === 3) {
      // Run analysis animation
      const interval = setInterval(() => {
        setAnalysisStep(prev => {
          if (prev >= 4) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* Top Progress Bar */}
      <header className="h-16 border-b border-[var(--color-border)] flex items-center justify-center px-6">
        <div className="flex items-center gap-2 max-w-md w-full justify-between">
          {STEPS.map((step, idx) => (
            <div key={step} className="flex flex-col items-center gap-2 flex-1 relative">
              <div className={cn(
                "w-full h-1 rounded-full transition-colors duration-300",
                idx <= currentStep ? "bg-[var(--color-primary-accent)]" : "bg-[var(--color-elevated-surface)]"
              )} />
              <span className={cn(
                "text-xs font-medium transition-colors",
                idx === currentStep ? "text-[var(--color-primary-text)]" : "text-[var(--color-muted-text)]"
              )}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">Welcome, {session?.user?.name?.split(" ")[0] || 'Contributor'}.</h1>
                <p className="text-[var(--color-secondary-text)]">We found your GitHub profile.</p>
              </div>

              <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--color-border)] bg-[var(--color-elevated-surface)]">
                  <img src={session?.user?.image || "https://github.com/ghost.png"} alt={session?.user?.name || "User"} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{session?.user?.name}</h3>
                  <p className="text-[var(--color-muted-text)]">@{(session?.user as any)?.username}</p>
                </div>
                
                <div className="flex gap-4 text-sm text-[var(--color-secondary-text)] mt-2">
                  <div className="flex items-center gap-1"><Code2 className="w-4 h-4" /> {(session?.user as any)?.public_repos || 0} repos</div>
                  <div className="flex items-center gap-1"><UserCircle2 className="w-4 h-4" /> {(session?.user as any)?.followers || 0} followers</div>
                </div>

                <div className="w-full bg-[var(--color-elevated-surface)] rounded-lg p-3 mt-2">
                  <p className="text-xs text-[var(--color-muted-text)] mb-2 uppercase tracking-wider font-semibold">Detected Languages</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {((session?.user as any)?.languages || ["JavaScript"]).map((lang: string) => (
                      <span key={lang} className="px-2 py-1 bg-[var(--color-primary-accent)]/10 text-[var(--color-primary-accent)] rounded text-xs font-medium">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Button size="lg" className="w-full group" onClick={nextStep}>
                Continue <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-lg space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">What do you work with?</h1>
                <p className="text-[var(--color-secondary-text)]">Select the technologies you're most comfortable with.</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {[...selectedSkills, ...availableSkills.filter(s => !selectedSkills.includes(s))].map(skill => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={cn(
                          "px-4 py-2 rounded-full border text-sm font-medium transition-colors",
                          isSelected 
                            ? "bg-[var(--color-primary-accent)] border-[var(--color-primary-accent)] text-white shadow-sm" 
                            : "bg-transparent border-[var(--color-border)] text-[var(--color-secondary-text)] hover:border-[var(--color-muted-text)] hover:text-[var(--color-primary-text)]"
                        )}
                      >
                        {skill}
                      </motion.button>
                    );
                  })}
                </div>
                <p className="text-center text-sm text-[var(--color-muted-text)] mt-6">
                  {selectedSkills.length} technologies selected
                </p>
              </div>

              <div className="flex gap-4 w-full">
                <Button variant="outline" size="lg" className="w-full flex-1" onClick={prevStep}>
                  Back
                </Button>
                <Button size="lg" className="w-full flex-[2] group" onClick={nextStep} disabled={selectedSkills.length === 0}>
                  Continue <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-lg space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">What's your open-source experience?</h1>
                <p className="text-[var(--color-secondary-text)]">This helps us recommend the right issues.</p>
              </div>

              <div className="space-y-4">
                {[
                  { id: "Beginner", label: "I'm new to open source", desc: "We'll prioritize well-scoped issues and guide you through the process." },
                  { id: "Intermediate", label: "I've made a few contributions", desc: "You know the basics but want help finding good projects." },
                  { id: "Advanced", label: "I regularly contribute", desc: "Show me challenging issues across top repositories." }
                ].map((level) => (
                  <div
                    key={level.id}
                    onClick={() => setExperience(level.id)}
                    className={cn(
                      "p-5 rounded-xl border cursor-pointer transition-all duration-200",
                      experience === level.id 
                        ? "border-[var(--color-primary-accent)] bg-[var(--color-primary-accent)]/5" 
                        : "border-[var(--color-border)] bg-[var(--color-card-bg)] hover:border-[var(--color-muted-text)]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-[var(--color-primary-text)]">{level.id}</h3>
                      {experience === level.id && <Check className="w-5 h-5 text-[var(--color-primary-accent)]" />}
                    </div>
                    <p className="text-[var(--color-primary-text)] font-medium mt-1">{level.label}</p>
                    {experience === level.id && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: "auto" }} 
                        className="text-sm text-[var(--color-secondary-text)] mt-2"
                      >
                        {level.desc}
                      </motion.p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-4 w-full">
                <Button variant="outline" size="lg" className="w-full flex-1" onClick={prevStep}>
                  Back
                </Button>
                <Button size="lg" className="w-full flex-[2] group" onClick={nextStep} disabled={!experience}>
                  Continue <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md space-y-8"
            >
              {analysisStep < 4 ? (
                <div className="text-center space-y-8 py-12">
                  <h1 className="text-2xl font-semibold tracking-tight">Building your contributor profile</h1>
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-[var(--color-elevated-surface)]" />
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-[var(--color-primary-accent)] border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                  </div>
                  <div className="space-y-4 text-left max-w-[250px] mx-auto">
                    {[
                      "Reading GitHub profile",
                      "Understanding your technologies",
                      "Calibrating experience level",
                      "Preparing your recommendations"
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        {analysisStep > idx ? (
                          <Check className="w-5 h-5 text-[var(--color-success)] shrink-0" />
                        ) : analysisStep === idx ? (
                          <Loader2 className="w-5 h-5 text-[var(--color-primary-accent)] animate-spin shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-[var(--color-border)] shrink-0" />
                        )}
                        <span className={cn(
                          "text-sm font-medium transition-colors",
                          analysisStep >= idx ? "text-[var(--color-primary-text)]" : "text-[var(--color-muted-text)]"
                        )}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-[var(--color-success)]" />
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight">Your contributor profile is ready.</h1>
                  </div>

                  <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-[var(--color-muted-text)] uppercase tracking-wider font-semibold mb-1">Contributor level</p>
                        <p className="font-medium">{experience}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--color-muted-text)] uppercase tracking-wider font-semibold mb-1">Profile confidence</p>
                        <p className="font-medium text-[var(--color-success)]">94%</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-muted-text)] uppercase tracking-wider font-semibold mb-2">Primary skills</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSkills.slice(0, 5).map(skill => (
                          <span key={skill} className="px-2 py-1 bg-[var(--color-elevated-surface)] rounded text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button size="lg" className="w-full" onClick={nextStep}>
                    Show me my issues
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
