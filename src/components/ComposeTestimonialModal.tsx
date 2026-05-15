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
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ComposeTestimonialModalProps {
  receiver: any;
  isOpen: boolean;
  onClose: () => void;
}

const THEMES = [
  { id: "blue", name: "Classic Blue", class: "bg-blue-50 border-blue-200 text-blue-900", accent: "bg-blue-600" },
  { id: "purple", name: "Royal Purple", class: "bg-purple-50 border-purple-200 text-purple-900", accent: "bg-purple-600" },
  { id: "rose", name: "Warm Rose", class: "bg-rose-50 border-rose-200 text-rose-900", accent: "bg-rose-600" },
  { id: "amber", name: "Golden Amber", class: "bg-amber-50 border-amber-200 text-amber-900", accent: "bg-amber-600" },
  { id: "emerald", name: "Deep Emerald", class: "bg-emerald-50 border-emerald-200 text-emerald-900", accent: "bg-emerald-600" },
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
    if (!content.trim()) return;
    setIsSending(true);
    try {
      await sendTestimonial({
        receiverId: receiver.tokenIdentifier,
        content: content.trim(),
        theme,
      });
      toast.success(`Message sent to ${receiver.name}!`);
      handleClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
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
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <div className="flex flex-col h-[600px] sm:h-auto max-h-[90vh]">
          {/* Header */}
          <DialogHeader className="p-6 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarImage src={receiver?.imageUrl} />
                <AvatarFallback>{receiver?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900">
                  To {receiver?.name}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "h-1 w-8 rounded-full transition-colors",
                          step >= i ? "bg-blue-600" : "bg-slate-200"
                        )} 
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Step {step} of 3
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Palette className="h-4 w-4 text-blue-600" />
                      Pick a Theme
                    </label>
                    <p className="text-sm text-slate-500">Choose how your message will look in their inbox.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl border-2 transition-all group",
                          theme === t.id 
                            ? "border-blue-600 bg-blue-50 shadow-md scale-[1.02]" 
                            : "border-slate-100 hover:border-slate-200 bg-white"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn("w-4 h-4 rounded-full", t.accent)} />
                          <span className={cn(
                            "font-semibold",
                            theme === t.id ? "text-blue-700" : "text-slate-600"
                          )}>
                            {t.name}
                          </span>
                        </div>
                        {theme === t.id && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <PenTool className="h-4 w-4 text-blue-600" />
                      Write Your Message
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {PROMPTS.map((p, i) => (
                        <button
                          key={i}
                          onClick={() => setContent(p + " ")}
                          className="text-[10px] px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-full border border-slate-100 hover:border-blue-200 transition-colors"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <Textarea
                      placeholder="Write something heartfelt..."
                      className="min-h-[200px] text-lg p-4 rounded-2xl border-slate-200 focus:ring-blue-500 resize-none italic"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                    <div className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-400">
                      {content.length} characters
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-600" />
                      Final Preview
                    </label>
                    <p className="text-sm text-slate-500">Here&apos;s how it will appear to {receiver.name}.</p>
                  </div>
                  
                  <div className={cn(
                    "p-8 rounded-3xl border-2 shadow-sm min-h-[200px] flex items-center justify-center text-center paper-grain",
                    currentTheme.class
                  )}>
                    <p className="text-xl italic font-serif leading-relaxed">
                      &quot;{content || "Your message here..."}&quot;
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
            {step > 1 && (
              <Button
                variant="outline"
                className="rounded-2xl h-12 px-6"
                onClick={() => setStep(step - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            
            {step < 3 ? (
              <Button
                className="flex-1 rounded-2xl h-12 bg-blue-600 hover:bg-blue-700 font-bold"
                onClick={() => setStep(step + 1)}
                disabled={step === 2 && !content.trim()}
              >
                Next Step
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                className="flex-1 rounded-2xl h-12 bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-200"
                onClick={handleSubmit}
                disabled={isSending || !content.trim()}
              >
                {isSending ? "Sending..." : "Send Testimonial"}
                <Send className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
