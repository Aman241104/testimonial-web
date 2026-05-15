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
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 min-h-screen relative overflow-hidden transition-colors duration-500">
      {/* Premium Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
      
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl w-full text-center space-y-12 relative z-10"
      >
        <motion.div variants={item} className="flex justify-center">
          <div className="bg-primary p-5 rounded-[32px] shadow-2xl shadow-primary/20 relative group">
            <div className="absolute inset-0 bg-white/20 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <MessageSquare className="w-12 h-12 text-white relative z-10" />
          </div>
        </motion.div>

        <motion.div variants={item} className="space-y-6">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
            College <span className="text-primary inline-flex items-center">Testimonials <Sparkles className="h-10 w-10 ml-2 hidden md:block" /></span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            The private digital time capsule for your college memories. 
            Tell your friends what they truly meant to you.
          </p>
        </motion.div>

        <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <SignInButton mode="modal">
            <Button size="lg" className="px-12 py-8 text-xl bg-primary hover:bg-primary/90 rounded-[24px] shadow-2xl shadow-primary/30 transition-all hover:scale-[1.03] active:scale-95 font-bold">
              Start Your Capsule
            </Button>
          </SignInButton>
          <Button size="lg" variant="outline" className="px-12 py-8 text-xl rounded-[24px] border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 font-bold">
            Learn More
          </Button>
        </motion.div>

        <motion.div 
          variants={item}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12"
        >
          <div className="p-10 bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 text-left group hover:border-primary/20 transition-colors">
            <div className="bg-blue-50 dark:bg-blue-900/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Secure Auth</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Enterprise-grade security powered by Clerk.</p>
          </div>
          <div className="p-10 bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 text-left group hover:border-primary/20 transition-colors">
            <div className="bg-purple-50 dark:bg-purple-900/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <EyeOff className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">100% Private</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Messages are only visible to the receiver.</p>
          </div>
          <div className="p-10 bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 text-left group hover:border-primary/20 transition-colors">
            <div className="bg-amber-50 dark:bg-amber-900/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Real-time</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Instant delivery powered by Convex.</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
