"use client";

import { MessageSquare, Users, User, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface MobileNavProps {
  activeTab: "inbox" | "friends" | "profile";
  onTabChange: (tab: "inbox" | "friends" | "profile") => void;
  onShare: () => void;
}

export function MobileNav({ activeTab, onTabChange, onShare }: MobileNavProps) {
  const tabs = [
    { id: "inbox", label: "Vault", icon: MessageSquare },
    { id: "friends", label: "Social", icon: Users },
    { id: "profile", label: "Me", icon: User },
  ] as const;

  return (
    <div className="lg:hidden fixed bottom-6 left-0 right-0 z-[100] px-6 pointer-events-none">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-md mx-auto pointer-events-auto"
      >
        <div className="bg-[#020817]/80 backdrop-blur-3xl rounded-[40px] p-2 flex items-center gap-1 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10 ring-1 ring-white/5">
          <div className="flex-1 flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="relative flex-1 group"
                >
                  <div className={cn(
                    "relative z-10 flex flex-col items-center justify-center py-4 rounded-[32px] transition-all duration-500",
                    isActive ? "text-white" : "text-slate-500"
                  )}>
                    <Icon className={cn("h-5 w-5 mb-1 transition-transform duration-500", isActive && "scale-110")} />
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                      isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 hidden"
                    )}>
                      {tab.label}
                    </span>
                  </div>
                  
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="mobileActiveTab"
                        className="absolute inset-0 bg-primary rounded-[32px] shadow-[0_0_20px_rgba(var(--primary),0.3)] glow-primary-subtle"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>

          <div className="w-[1px] h-8 bg-white/10 mx-1" />

          <motion.button
            whileTap={{ scale: 0.9, rotate: -5 }}
            onClick={onShare}
            className="w-14 h-14 flex items-center justify-center bg-white/5 rounded-[32px] text-primary border border-white/10 hover:bg-white/10 transition-all group"
          >
            <Share2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

