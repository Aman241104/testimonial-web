"use client";

import { SignInButton } from "@clerk/nextjs";
import { MessageSquare, Shield, EyeOff, Zap, Sparkles, ArrowRight, PlayCircle } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { useRef } from "react";

export function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  } as const;

  const titleReveal = {
    hidden: { y: "100%" },
    show: { 
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      }
    },
  } as const;

  const itemFade = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
  } as const;

  return (
    <div ref={containerRef} className="relative min-h-[200vh] bg-[#fafafa] dark:bg-[#020817] transition-colors duration-700">
      <section className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        {/* Immersive Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:64px_64px] opacity-30" />
          <motion.div 
            style={{ y }}
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[180px] animate-pulse" 
          />
          <motion.div 
            style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]) }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[180px] animate-pulse [animation-delay:2s]" 
          />
        </div>

        <div className="absolute top-12 left-12 z-50">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="bg-primary p-2 rounded-xl shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight">College Capsule</span>
          </motion.div>
        </div>

        <div className="absolute top-12 right-12 z-50">
          <ThemeToggle />
        </div>

        <motion.div
          style={{ opacity, scale }}
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-7xl w-full text-center"
        >
          <div className="reveal-text mb-6 inline-block overflow-hidden">
            <motion.span 
              variants={titleReveal}
              className="block text-sm font-black uppercase tracking-[0.5em] text-primary"
            >
              The Digital Time Capsule
            </motion.span>
          </div>

          <div className="space-y-4 mb-12">
            <div className="reveal-text overflow-hidden">
              <motion.h1 
                variants={titleReveal}
                className="text-7xl md:text-[12rem] font-serif italic tracking-tighter leading-[0.8] text-slate-900 dark:text-white"
              >
                Capture the
              </motion.h1>
            </div>
            <div className="reveal-text overflow-hidden">
              <motion.h1 
                variants={titleReveal}
                className="text-7xl md:text-[12rem] font-serif font-black tracking-tighter leading-[0.8] text-slate-900 dark:text-white"
              >
                Memories.
              </motion.h1>
            </div>
          </div>

          <motion.p 
            variants={itemFade}
            className="text-xl md:text-3xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-16 font-medium text-balance"
          >
            A high-fidelity digital vault for the stories that defined your college journey. 
            Keep them private. Keep them forever.
          </motion.p>

          <motion.div 
            variants={itemFade}
            className="flex flex-col sm:flex-row gap-8 justify-center items-center"
          >
            <SignInButton mode="modal">
              <button className="group relative px-12 py-6 bg-primary text-white rounded-full font-black text-xl overflow-hidden transition-all hover:pr-16 active:scale-95 glow-primary-subtle">
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </SignInButton>
            
            <button className="flex items-center gap-4 text-slate-900 dark:text-white font-bold text-xl group">
              <div className="w-16 h-16 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                <PlayCircle className="w-8 h-8 group-hover:text-white transition-colors" />
              </div>
              How it works
            </button>
          </motion.div>
        </motion.div>

        {/* Floating Accents */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-[10%] hidden xl:block"
        >
          <div className="glass-awwwards p-8 rounded-[40px] border-white/20">
            <Sparkles className="w-12 h-12 text-primary mb-4" />
            <p className="font-serif italic text-2xl text-slate-400">&quot;The best way to remember.&quot;</p>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="relative z-20 px-6 pb-40 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {[
            { icon: Shield, title: "Vault-Grade Security", desc: "Your memories are encrypted and protected by industry-standard authentication.", color: "blue" },
            { icon: EyeOff, title: "Deep Privacy", desc: "Choose who sees your capsule. Full control over every memory shared.", color: "purple" },
            { icon: Zap, title: "Real-time Sync", desc: "Experience your stories as they happen with instant, real-time updates.", color: "amber" }
          ].map((feature, i) => (
            <div key={i} className="group relative p-12 rounded-[56px] bg-white/50 dark:bg-white/2 backdrop-blur-3xl border border-white dark:border-white/5 hover:border-primary/50 transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[56px]" />
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 border border-white dark:border-white/10">
                  <feature.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-4xl font-serif font-black mb-6 text-slate-900 dark:text-white tracking-tight">{feature.title}</h3>
                <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
