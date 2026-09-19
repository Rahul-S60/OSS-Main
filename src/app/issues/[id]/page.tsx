"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Issue } from "@/data/issues";
import { fetchRecommendedIssues } from "@/app/actions/github";
import { enrollInIssue } from "@/app/actions/contributions";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
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

  if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 rounded-full border-2 border-[var(--color-primary-accent)] border-t-transparent animate-spin" /></div>;
  if (!issue) return <div className="p-8">Issue not found</div>;

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      await enrollInIssue({
        id: issue.id,
        title: issue.title,
        repository: issue.repository,
        description: issue.description,
        difficulty: issue.difficulty,
        estimatedEffort: issue.estimatedEffort,
        languages: issue.languages,
        technologies: issue.technologies,
      });
      
      setEnrollmentSuccess(true);
      addToast({ title: "Issue enrolled", type: "success" });
      
      // Navigate to contribution workspace after celebration
      setTimeout(() => {
        router.push(`/contributions/${issue.id}`);
      }, 2000);
    } catch (error) {
      console.error(error);
      addToast({ title: "Failed to enroll", type: "error" });
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 relative">
      <Link href="/explore" className="inline-flex items-center text-sm font-medium text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to explore
      </Link>

      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[var(--color-primary-accent)] font-medium">{issue.repository}</span>
            <span className="text-[var(--color-muted-text)]">#{issue.id}</span>
            <Badge variant="success" className="rounded-sm ml-2">OPEN</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">{issue.title}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="uppercase text-[10px]">{issue.difficulty}</Badge>
            <Badge variant="purple" className="uppercase text-[10px] font-bold">{issue.matchScore}% Match</Badge>
            {issue.languages.map(l => <Badge key={l} variant="outline">{l}</Badge>)}
            {issue.technologies.map(t => <Badge key={t} variant="outline">{t}</Badge>)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-[var(--color-border)] pb-2">Issue description</h2>
              <div className="prose prose-invert max-w-none text-[var(--color-secondary-text)]">
                <p>{issue.description}</p>
                <p>This is a simulated description for the demo. In a real environment, this would contain the full markdown content from GitHub, including steps to reproduce, expected behavior, and maintainer context.</p>
              </div>
            </section>

            {/* Why this matches you */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-[var(--color-border)] pb-2">Why this matches you</h2>
              <div className="p-4 rounded-xl bg-[var(--color-primary-accent)]/10 border border-[var(--color-primary-accent)]/20 text-sm">
                <p className="text-[var(--color-primary-text)] mb-3">{issue.reason}</p>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-[var(--color-secondary-text)] mb-1">
                      <span>Skill alignment</span>
                      <span className="font-medium text-[var(--color-primary-text)]">97%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--color-elevated-surface)] overflow-hidden">
                      <div className="h-full bg-[var(--color-primary-accent)] w-[97%]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-[var(--color-secondary-text)] mb-1">
                      <span>Difficulty fit</span>
                      <span className="font-medium text-[var(--color-primary-text)]">91%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--color-elevated-surface)] overflow-hidden">
                      <div className="h-full bg-[var(--color-primary-accent)] w-[91%]" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Difficulty Analysis */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-[var(--color-border)] pb-2">Difficulty analysis</h2>
              <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs text-[var(--color-muted-text)] uppercase font-semibold tracking-wider mb-1">Estimated difficulty</p>
                    <p className="text-lg font-bold uppercase text-[var(--color-primary-text)]">{issue.difficulty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[var(--color-muted-text)] uppercase font-semibold tracking-wider mb-1">Confidence</p>
                    <p className="text-lg font-bold text-[var(--color-success)]">91%</p>
                  </div>
                </div>
                
                <p className="text-xs text-[var(--color-secondary-text)] italic flex items-start gap-2 bg-[var(--color-elevated-surface)] p-3 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-[var(--color-warning)] shrink-0" />
                  Difficulty is an estimated category intended to support issue discovery, not an objective measure of task difficulty.
                </p>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            {/* Readiness Card */}
            <Card className="sticky top-24 border-[var(--color-primary-accent)]/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Contribution readiness</h3>
                  <span className="text-2xl font-bold text-[var(--color-primary-accent)]">84%</span>
                </div>
                
                <p className="text-sm text-[var(--color-secondary-text)] mb-6">You match 4 of 5 key requirements.</p>
                
                <div className="space-y-3 mb-6">
                  {issue.technologies.concat(issue.languages).slice(0, 4).map(tech => (
                    <div key={tech} className="flex items-center gap-2 text-sm text-[var(--color-primary-text)]">
                      <Check className="w-4 h-4 text-[var(--color-success)]" /> {tech}
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-sm text-[var(--color-primary-text)]">
                    <AlertTriangle className="w-4 h-4 text-[var(--color-warning)]" /> Advanced concepts
                  </div>
                </div>
                
                <div className="text-sm text-[var(--color-primary-text)] font-medium mb-6 p-3 bg-[var(--color-elevated-surface)] rounded-lg">
                  This issue appears well aligned with your current profile.
                </div>

                <div className="space-y-3">
                  <Button 
                    size="lg" 
                    className="w-full text-base font-semibold" 
                    onClick={handleEnroll}
                    disabled={isEnrolling || enrollmentSuccess}
                  >
                    {isEnrolling ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                        Analyzing...
                      </span>
                    ) : enrollmentSuccess ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" /> Enrolled
                      </span>
                    ) : (
                      "Enroll in this issue"
                    )}
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="ghost" className="flex-1">Save for later</Button>
                    {issue.url && (
                      <Button variant="outline" className="flex-1 group" asChild>
                        <Link href={issue.url} target="_blank" rel="noopener noreferrer">
                          View on GitHub
                          <ExternalLink className="w-4 h-4 ml-2 opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enrollment Transition Overlay */}
      <AnimatePresence>
        {enrollmentSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-[var(--color-background)]/90 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-[var(--color-card-bg)] border border-[var(--color-border)] p-8 rounded-2xl shadow-2xl text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--color-success)]/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-[var(--color-success)]" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">You're officially on this contribution.</h2>
              
              <div className="my-6 p-4 bg-[var(--color-elevated-surface)] rounded-xl border border-[var(--color-border)] text-left">
                <p className="text-xs text-[var(--color-muted-text)] font-semibold uppercase tracking-wider mb-1">Contribution {issue.id}</p>
                <p className="font-medium text-[var(--color-primary-text)] mb-3">{issue.repository}</p>
                <div className="flex justify-between text-sm text-[var(--color-secondary-text)]">
                  <span>6 steps</span>
                  <span>Effort: {issue.estimatedEffort}</span>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="w-6 h-6 border-2 border-[var(--color-primary-accent)] border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-sm text-[var(--color-secondary-text)] mt-4">Preparing your workspace...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
