"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Circle, Copy, Terminal, GitPullRequest as Github, 
  GitPullRequest, Play, Check, AlertTriangle
} from "lucide-react";
import { Issue } from "@/data/issues";
import { fetchRecommendedIssues } from "@/app/actions/github";
import { useDemoStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PRAnalysis } from "@/components/features/PRAnalysis";
import { SuccessOverlay } from "@/components/features/SuccessOverlay";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

const STEPS = [
  "Understand",
  "Setup",
  "Implement",
  "Commit",
  "Pull Request",
  "Merge"
];

export default function ContributionWorkspace() {
  const params = useParams();
  const router = useRouter();
  const { state, updateState } = useDemoStore();
  const { addToast } = useToast();
  
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);

  const issueId = params.id as string;
  
  useEffect(() => {
    async function loadIssue() {
      try {
        const data = await fetchRecommendedIssues();
        const found = data.find(i => i.id === issueId);
        setIssue(found || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadIssue();
  }, [issueId]);
  
  const currentStep = state.contributionStep;
  
  const [copied, setCopied] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSimulatingMerge, setIsSimulatingMerge] = useState(false);

  if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 rounded-full border-2 border-[var(--color-primary-accent)] border-t-transparent animate-spin" /></div>;
  if (!issue) return <div className="p-8">Contribution not found</div>;

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      updateState({ contributionStep: currentStep + 1 });
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    addToast({ title: "Copied to clipboard", type: "success" });
    setTimeout(() => setCopied(null), 2000);
  };

  const handlePRSubmit = () => {
    updateState({ prSubmitted: true });
    nextStep();
  };

  const simulateMerge = () => {
    setIsSimulatingMerge(true);
    setTimeout(() => {
      setIsSimulatingMerge(false);
      updateState({ 
        prMerged: true, 
        points: state.points + 100,
        unlockedBadges: [...state.unlockedBadges, "first_merge"]
      });
      setShowSuccess(true);
    }, 2500);
  };

  const onContinueAfterMerge = () => {
    setShowSuccess(false);
    router.push("/achievements");
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-6 relative">
      {/* Left Column: Navigation */}
      <div className="w-full md:w-64 shrink-0 overflow-y-auto">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted-text)] mb-4">Contribution Path</h2>
        <div className="space-y-1 relative border-l border-[var(--color-border)] ml-3">
          {STEPS.map((stepName, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <div key={idx} className="relative pl-6 py-3">
                <div className={cn(
                  "absolute -left-[9px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 ring-4 ring-[var(--color-background)] flex items-center justify-center transition-colors",
                  isCompleted ? "bg-[var(--color-success)] border-[var(--color-success)]" :
                  isCurrent ? "bg-[var(--color-background)] border-[var(--color-primary-accent)]" :
                  "bg-[var(--color-background)] border-[var(--color-border)]"
                )}>
                  {isCompleted && <Check className="w-2.5 h-2.5 text-white" />}
                  {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-accent)]" />}
                </div>
                <div className={cn(
                  "font-medium transition-colors text-sm",
                  isCompleted ? "text-[var(--color-secondary-text)]" :
                  isCurrent ? "text-[var(--color-primary-text)] font-semibold" :
                  "text-[var(--color-muted-text)]"
                )}>
                  {String(idx + 1).padStart(2, '0')} {stepName}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Center Column: Active Step Workspace */}
      <div className="flex-1 min-w-0 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl flex flex-col overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-elevated-surface)]/50 shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Step {currentStep + 1}: {STEPS[currentStep]}</h1>
            <div className="text-sm font-medium text-[var(--color-secondary-text)]">
              {issue.repository} <span className="mx-2">•</span> #{issue.id}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Understand */}
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto space-y-8"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2">Understand the issue</h2>
                  <p className="text-[var(--color-secondary-text)]">Before writing code, make sure you understand what needs to change.</p>
                </div>
                
                <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated-surface)]">
                  <h3 className="font-semibold mb-4">Checklist</h3>
                  <div className="space-y-3">
                    {["Read issue description", "Understand expected behavior", "Identify affected files", "Check existing tests"].map((item, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-[var(--color-border)] text-[var(--color-primary-accent)] focus:ring-[var(--color-primary-accent)] bg-transparent" />
                        <span className="text-sm text-[var(--color-primary-text)] group-hover:text-[var(--color-primary-accent)] transition-colors">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[var(--color-primary-accent)]/10 border border-[var(--color-primary-accent)]/20">
                  <h3 className="font-semibold text-[var(--color-primary-accent)] mb-2 flex items-center gap-2">
                    <Github className="w-4 h-4" /> Maintainer notes
                  </h3>
                  <p className="text-sm text-[var(--color-primary-text)]">
                    "Thanks for looking into this! The relevant code is mostly in `fastapi/exceptions.py`. You'll want to check how Pydantic validation errors are formatted before being sent to the client."
                  </p>
                </div>

                <div className="pt-4">
                  <Button size="lg" className="w-full" onClick={nextStep}>
                    Mark as understood
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Setup */}
            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto space-y-8"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2">Setup workspace</h2>
                  <p className="text-[var(--color-secondary-text)]">Run these commands in your terminal to get started.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { id: "clone", label: "Clone repository", cmd: `git clone https://github.com/${issue.repository}.git` },
                    { id: "cd", label: "Navigate to directory", cmd: `cd ${issue.repository.split('/')[1]}` },
                    { id: "branch", label: "Create branch", cmd: `git checkout -b fix-validation-errors` }
                  ].map((cmd) => (
                    <div key={cmd.id} className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated-surface)] flex flex-col gap-2">
                      <span className="text-sm font-medium text-[var(--color-secondary-text)]">{cmd.label}</span>
                      <div className="flex items-center gap-2 bg-[var(--color-background)] rounded-lg p-3">
                        <Terminal className="w-4 h-4 text-[var(--color-muted-text)] shrink-0" />
                        <code className="text-sm font-mono flex-1 overflow-x-auto text-[var(--color-primary-text)]">{cmd.cmd}</code>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="shrink-0 h-8 w-8" 
                          onClick={() => copyToClipboard(cmd.cmd, cmd.id)}
                        >
                          {copied === cmd.id ? <Check className="w-4 h-4 text-[var(--color-success)]" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button size="lg" className="w-full" onClick={nextStep}>
                    Workspace ready
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Implement */}
            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto space-y-8"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2">Implement changes</h2>
                  <p className="text-[var(--color-secondary-text)]">It's time to write some code.</p>
                </div>

                <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated-surface)]">
                  <h3 className="font-semibold mb-4">Implementation Checklist</h3>
                  <div className="space-y-3">
                    {["Locate validation handler", "Update error message", "Add test case", "Run test suite", "Review changes"].map((item, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-[var(--color-border)] text-[var(--color-primary-accent)] focus:ring-[var(--color-primary-accent)] bg-transparent" />
                        <span className="text-sm text-[var(--color-primary-text)] group-hover:text-[var(--color-primary-accent)] transition-colors">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-[var(--color-border)]">
                  <div className="bg-[var(--color-elevated-surface)] px-4 py-2 border-b border-[var(--color-border)] text-xs font-mono text-[var(--color-secondary-text)]">
                    fastapi/exceptions.py
                  </div>
                  <div className="p-4 bg-[var(--color-background)] overflow-x-auto">
                    <pre className="text-sm font-mono text-[var(--color-secondary-text)]">
                      <code>
{`def request_validation_exception_handler(
    request: Request, 
    exc: RequestValidationError
) -> JSONResponse:
    # Update this formatting logic
    errors = exc.errors()
    return JSONResponse(
        status_code=422,
        content={"detail": format_errors(errors)},
    )`}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="pt-4">
                  <Button size="lg" className="w-full" onClick={nextStep}>
                    Implementation complete
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Commit */}
            {currentStep === 3 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto space-y-8"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2">Commit your changes</h2>
                  <p className="text-[var(--color-secondary-text)]">Format your commit according to repository guidelines.</p>
                </div>

                <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated-surface)] space-y-4">
                  <h3 className="font-medium text-sm text-[var(--color-secondary-text)] uppercase tracking-wider">Suggested commit message</h3>
                  <div className="p-4 bg-[var(--color-background)] rounded-lg font-mono text-sm border border-[var(--color-border)] relative group">
                    <p>fix: improve validation error messages</p>
                    <br/>
                    <p>Closes #{issue.id}</p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" 
                      onClick={() => copyToClipboard(`fix: improve validation error messages\n\nCloses #${issue.id}`, "commit")}
                    >
                      {copied === "commit" ? <Check className="w-4 h-4 text-[var(--color-success)]" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5">
                  <h3 className="font-semibold text-amber-500 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Before submitting
                  </h3>
                  <ul className="text-sm text-[var(--color-secondary-text)] space-y-2 list-disc list-inside">
                    <li>Run tests: <code className="text-xs bg-[var(--color-background)] px-1 rounded">pytest tests/</code></li>
                    <li>Follow formatting rules (Black, isort)</li>
                    <li>Ensure you referenced the issue number</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <Button size="lg" className="w-full" onClick={nextStep}>
                    Mark complete
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Pull Request */}
            {currentStep === 4 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto space-y-8"
              >
                {!showAnalysis ? (
                  <>
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Prepare your Pull Request</h2>
                      <p className="text-[var(--color-secondary-text)]">Review your PR details before analysis.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated-surface)] space-y-4">
                        <div>
                          <label className="text-xs font-semibold text-[var(--color-muted-text)] uppercase tracking-wider mb-1 block">Title</label>
                          <div className="p-3 bg-[var(--color-background)] rounded-lg text-sm border border-[var(--color-border)]">
                            Improve validation error messages
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-[var(--color-muted-text)] uppercase tracking-wider mb-1 block">Description</label>
                          <div className="p-3 bg-[var(--color-background)] rounded-lg text-sm border border-[var(--color-border)] h-24 text-[var(--color-secondary-text)]">
                            This PR improves validation error clarity and adds coverage for the updated behavior. Fixes #{issue.id}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated-surface)]">
                        <div className="space-y-3">
                          {["Tests added", "Tests passing", "Documentation checked", "Issue linked"].map((item, i) => (
                            <label key={i} className="flex items-center gap-3 cursor-pointer group">
                              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-[var(--color-border)] text-[var(--color-primary-accent)] focus:ring-[var(--color-primary-accent)] bg-transparent" />
                              <span className="text-sm text-[var(--color-primary-text)]">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button size="lg" className="w-full text-lg" onClick={() => setShowAnalysis(true)}>
                        Analyze Pull Request
                      </Button>
                    </div>
                  </>
                ) : (
                  <PRAnalysis onSubmit={handlePRSubmit} />
                )}
              </motion.div>
            )}

            {/* Step 6: Merge (Live Tracking) */}
            {currentStep === 5 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto space-y-8"
              >
                <div className="text-center space-y-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-primary-accent)]/20 flex items-center justify-center mx-auto mb-4">
                    <GitPullRequest className="w-8 h-8 text-[var(--color-primary-accent)]" />
                  </div>
                  <h2 className="text-2xl font-bold">Pull Request submitted</h2>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[var(--color-muted-text)]">#421</span>
                    <span className="font-medium">{issue.title}</span>
                    <Badge variant="success" className="ml-2">OPEN</Badge>
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)]">
                  <h3 className="font-semibold mb-6">Contribution activity</h3>
                  <div className="space-y-6 border-l border-[var(--color-border)] ml-3">
                    <div className="relative pl-6">
                      <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-[var(--color-success)]/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-[var(--color-success)]" />
                      </div>
                      <p className="text-sm font-medium">Pull request opened</p>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-[var(--color-success)]/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-[var(--color-success)]" />
                      </div>
                      <p className="text-sm font-medium">CI checks passed</p>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-[var(--color-primary-accent)]/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[var(--color-primary-accent)] animate-pulse" />
                      </div>
                      <p className="text-sm font-medium text-[var(--color-primary-text)]">Waiting for maintainer review</p>
                      <p className="text-xs text-[var(--color-secondary-text)] mt-1">Simulate the review and merge process below.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="gap-2 border-[var(--color-primary-accent)] text-[var(--color-primary-accent)] hover:bg-[var(--color-primary-accent)] hover:text-white"
                    onClick={simulateMerge}
                    disabled={isSimulatingMerge}
                  >
                    {isSimulatingMerge ? (
                      <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    ) : (
                      <Play className="w-5 h-5 fill-current" />
                    )}
                    {isSimulatingMerge ? "Processing..." : "Simulate Merge (Demo Mode)"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <SuccessOverlay 
        isVisible={showSuccess} 
        onContinue={onContinueAfterMerge}
        pointsEarned={100}
      />
    </div>
  );
}
