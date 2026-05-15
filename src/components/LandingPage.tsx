"use client";

import { SignInButton } from "@clerk/nextjs";
import { MessageSquare, Shield, EyeOff, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

export function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  } as const;

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
  } as const;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#fafafa] dark:bg-slate-950 min-h-screen relative overflow-hidden transition-colors duration-500">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50" />
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
      </div>
      
      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl w-full text-center space-y-16 relative z-10"
      >
        <motion.div variants={item} className="flex justify-center">
          <div className="bg-primary p-6 rounded-[32px] shadow-2xl shadow-primary/30 relative group">
            <div className="absolute inset-0 bg-white/30 rounded-[32px] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110" />
            <MessageSquare className="w-14 h-14 text-white relative z-10" />
          </div>
        </motion.div>

        <motion.div variants={item} className="space-y-8">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85]">
            College <br />
            <span className="text-primary inline-flex items-center gap-4">
              Testimonials 
              <motion.div
                animate={{ rotate: [0, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-12 w-12 text-primary hidden md:block" />
              </motion.div>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            A private digital time capsule for your college memories. 
            Capture the words that last a lifetime.
          </p>
        </motion.div>

        <motion.div variants={item} className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
          <SignInButton mode="modal">
            <Button size="lg" className="px-14 py-8 text-xl bg-primary hover:bg-primary/90 text-white rounded-[28px] shadow-2xl shadow-primary/40 transition-all hover:scale-[1.05] active:scale-95 font-black">
              Create Your Capsule
            </Button>
          </SignInButton>
          <Button size="lg" variant="outline" className="px-14 py-8 text-xl rounded-[28px] border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900 font-bold transition-all hover:scale-[1.02]">
            Explore
          </Button>
        </motion.div>

        <motion.div 
          variants={item}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12"
        >
          {[
            { icon: Shield, title: "Secure", desc: "Enterprise auth by Clerk", color: "blue" },
            { icon: EyeOff, title: "Private", desc: "100% receiver-only", color: "purple" },
            { icon: Zap, title: "Instant", desc: "Real-time by Convex", color: "amber" }
          ].map((feature, i) => (
            <div key={i} className="p-10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[44px] border border-white dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none space-y-4 text-left group hover:translate-y-[-8px] transition-all duration-300">
              <div className={`bg-${feature.color}-50 dark:bg-${feature.color}-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}>
                <feature.icon className={`w-8 h-8 text-${feature.color}-600 dark:text-${feature.color}-400`} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{feature.title}</h3>
              <p className="text-base text-slate-500 dark:text-slate-400 leading-snug font-medium">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
