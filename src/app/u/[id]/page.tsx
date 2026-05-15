"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";
import { ComposeTestimonialModal } from "@/components/ComposeTestimonialModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SignInButton, useUser } from "@clerk/nextjs";

export default function PublicProfile() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn } = useUser();
  const userId = params.id as Id<"users">;
  
  const user = useQuery(api.users.getUser, { id: userId });
  const [isWriting, setIsWriting] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020817]">
        <div className="noise-overlay" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-primary p-6 rounded-3xl shadow-2xl"
        >
          <MessageSquare className="w-12 h-12 text-white" />
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-[#020817] transition-colors duration-1000 relative overflow-hidden flex flex-col items-center p-6 pt-12 lg:pt-24">
      <div className="noise-overlay" />
      
      {/* Immersive Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] lg:w-[50%] lg:h-[50%] bg-primary/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] lg:w-[40%] lg:h-[40%] bg-indigo-500/10 rounded-full blur-[140px] animate-pulse [animation-delay:3s]" />
      </div>

      <div className="max-w-2xl w-full space-y-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white group"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Explore Capsule.
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="glass-awwwards rounded-[64px] p-8 lg:p-16 border border-white/20 dark:border-white/5 text-center space-y-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-24 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative flex justify-center">
            <Avatar className="h-40 w-40 lg:h-56 lg:w-56 border-8 border-white dark:border-slate-800 shadow-2xl relative z-10 hover:scale-105 transition-transform duration-700">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback className="text-5xl lg:text-7xl font-serif font-black bg-primary text-white">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-4 -right-4 bg-primary p-4 rounded-3xl shadow-2xl text-white z-20 animate-bounce [animation-duration:3s]">
              <Sparkles className="h-8 w-8" />
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <h1 className="text-5xl lg:text-7xl font-serif font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
              {user.name}
            </h1>
            <div className="flex items-center justify-center gap-3">
              <span className="bg-primary/10 px-4 py-1.5 rounded-full text-primary font-black uppercase tracking-widest text-[10px] lg:text-xs backdrop-blur-md border border-primary/20">
                {user.college}
              </span>
              {user.batchYear && (
                <span className="bg-slate-100 dark:bg-white/5 px-4 py-1.5 rounded-full text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-[10px] lg:text-xs border border-slate-200 dark:border-white/5">
                  Class of &apos;{user.batchYear.slice(-2)}
                </span>
              )}
            </div>
            {user.bio && (
              <p className="text-xl lg:text-2xl text-slate-500 dark:text-slate-400 italic max-w-md mx-auto pt-4 leading-relaxed font-medium">
                &ldquo;{user.bio}&rdquo;
              </p>
            )}
          </div>

          <div className="pt-8 relative z-10 max-w-md mx-auto">
            {isSignedIn ? (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsWriting(true)}
                className="w-full bg-primary text-white py-6 rounded-[32px] text-xl font-black shadow-2xl shadow-primary/30 flex items-center justify-center group glow-primary-subtle"
              >
                Write a Testimonial
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </motion.button>
            ) : (
              <SignInButton mode="modal">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary text-white py-6 rounded-[32px] text-xl font-black shadow-2xl shadow-primary/30 glow-primary-subtle"
                >
                  Join to Contribute
                </motion.button>
              </SignInButton>
            )}
            <p className="text-[10px] lg:text-xs text-slate-400 mt-6 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              <Heart className="h-3 w-3 fill-red-500 text-red-500" />
              Direct to Vault &bull; Highly Encrypted
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center space-y-6 pt-4"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-slate-200 dark:bg-white/10" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">
              About the Vault
            </p>
            <div className="h-[1px] w-12 bg-slate-200 dark:bg-white/10" />
          </div>
          <div className="glass-awwwards rounded-[40px] p-8 lg:p-10 border border-white/10 text-sm lg:text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-balance">
            College Capsule is a high-fidelity digital time capsule. 
            We preserve the stories, memories, and nostalgia that defined your college years in a private, secure vault. 
            One link, forever preserved.
          </div>
        </motion.div>
      </div>

      <ComposeTestimonialModal
        receiver={user}
        isOpen={isWriting}
        onClose={() => setIsWriting(false)}
      />
    </main>
  );
}
