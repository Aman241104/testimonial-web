"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ChevronRight, 
  ChevronLeft, 
  Send, 
  Palette, 
  PenTool, 
  Eye,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Doc } from "../../convex/_generated/dataModel";

interface ComposeTestimonialModalProps {
  receiver: Doc<"users"> | null;
  isOpen: boolean;
  onClose: () => void;
}

const THEMES = [
  { id: "blue", name: "Electric Blue", class: "from-blue-500/10 to-transparent border-blue-500/20 text-blue-900 dark:text-blue-100", accent: "bg-blue-500" },
  { id: "purple", name: "Royal Purple", class: "from-purple-500/10 to-transparent border-purple-500/20 text-purple-900 dark:text-purple-100", accent: "bg-purple-500" },
  { id: "rose", name: "Warm Rose", class: "from-rose-500/10 to-transparent border-rose-500/20 text-rose-900 dark:text-rose-100", accent: "bg-rose-500" },
  { id: "amber", name: "Golden Amber", class: "from-amber-500/10 to-transparent border-amber-500/20 text-amber-900 dark:text-amber-100", accent: "bg-amber-500" },
  { id: "emerald", name: "Deep Emerald", class: "from-emerald-500/10 to-transparent border-emerald-500/20 text-emerald-900 dark:text-emerald-100", accent: "bg-emerald-500" },
];

const PROMPTS = [
  "What was our funniest memory together?",
  "What's one thing I'll always remember about you?",
  "How have you inspired me during college?",
  "What was your most 'legendary' moment?",
  "What's a message for your future self?",
];

export function ComposeTestimonialModal({
  receiver,
  isOpen,
  onClose,
}: ComposeTestimonialModalProps) {
  const sendTestimonial = useMutation(api.testimonials.sendTestimonial);
  const [step, setStep] = useState(1);
  const [content, setContent] = useState("");
  const [theme, setTheme] = useState("blue");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async () => {
    const r = receiver;
    if (!content.trim() || !r) return;
    setIsSending(true);
    try {
      await sendTestimonial({
        receiverId: r.tokenIdentifier,
        content: content.trim(),
        theme,
      });
      toast.success(`Message sent to ${r.name}!`);
      handleClose();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setContent("");
    setTheme("blue");
    onClose();
  };

  const currentTheme = THEMES.find(t => t.id === theme) || THEMES[0];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-[40px] border-white/10 dark:border-white/5 shadow-2xl bg-[#020817]">
        <div className="noise-overlay opacity-10" />
        <div className="flex flex-col h-[600px] sm:h-auto max-h-[90vh] relative z-10">
          {/* Header */}
          <DialogHeader className="p-8 border-b border-white/5">
            <div className="flex items-center gap-5">
              <Avatar className="h-14 w-14 border-2 border-white/20 shadow-xl">
                <AvatarImage src={receiver?.imageUrl} />
                <AvatarFallback className="font-serif font-black">{receiver?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl font-serif font-black text-white tracking-tight">
                  To {receiver?.name}
                </DialogTitle>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "h-1 w-6 rounded-full transition-all duration-500",
                          step >= i ? "bg-primary" : "bg-white/10"
                        )} 
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Phase {step} of 3
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Visual Identity
                    </label>
                    <p className="text-sm text-slate-400 font-medium">Choose a theme that matches the mood of your story.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-500 group",
                          theme === t.id 
                            ? "border-primary bg-primary/5 shadow-xl scale-[1.02]" 
                            : "border-white/5 hover:border-white/10 bg-white/2"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn("w-5 h-5 rounded-full shadow-inner", t.accent)} />
                          <span className={cn(
                            "font-bold tracking-tight text-lg",
                            theme === t.id ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                          )}>
                            {t.name}
                          </span>
                        </div>
                        {theme === t.id && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="space-y-3">
                    <label className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                      <PenTool className="h-4 w-4" />
                      The Narrative
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PROMPTS.map((p, i) => (
                        <button
                          key={i}
                          onClick={() => setContent(p + " ")}
                          className="text-[10px] px-3 py-1.5 bg-white/5 hover:bg-primary/20 text-slate-400 hover:text-white rounded-full border border-white/5 hover:border-primary/30 transition-all font-bold"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                    <Textarea
                      placeholder="Share a defining moment..."
                      className="relative min-h-[220px] text-xl p-6 rounded-3xl border-white/5 bg-white/2 focus:ring-primary focus:border-primary resize-none italic font-medium placeholder:text-slate-600 text-white"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                    <div className="absolute bottom-4 right-6 text-[10px] font-black text-slate-500 tracking-widest">
                      {content.length} CHARS
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      The Preview
                    </label>
                    <p className="text-sm text-slate-400 font-medium">Behold your message before it joins the Archive.</p>
                  </div>
                  
                  <div className={cn(
                    "p-10 rounded-[40px] border-2 shadow-2xl min-h-[250px] flex items-center justify-center text-center relative overflow-hidden group bg-gradient-to-br",
                    currentTheme.class
                  )}>
                    <div className="absolute top-4 left-6 text-primary opacity-20">
                      <Sparkles className="h-10 w-10" />
                    </div>
                    <p className="text-3xl font-serif italic leading-tight text-pretty relative z-10">
                      &ldquo;{content || "Your legacy here..."}&quot;
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-white/5 flex items-center gap-4">
            {step > 1 && (
              <Button
                variant="outline"
                className="rounded-full h-14 px-8 border-white/10 text-slate-400 hover:text-white hover:bg-white/5 font-bold"
                onClick={() => setStep(step - 1)}
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
            )}
            
            {step < 3 ? (
              <Button
                className="flex-1 rounded-full h-14 bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 glow-primary-subtle"
                onClick={() => setStep(step + 1)}
                disabled={step === 2 && !content.trim()}
              >
                Continue
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            ) : (
              <Button
                className="flex-1 rounded-full h-14 bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-2xl shadow-primary/40 glow-primary-subtle"
                onClick={handleSubmit}
                disabled={isSending || !content.trim()}
              >
                {isSending ? "Archiving..." : "Commit to Vault"}
                <Send className="h-5 w-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
