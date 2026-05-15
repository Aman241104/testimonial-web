"use client";

import { MessageSquare, Users, User, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MobileNavProps {
  activeTab: "inbox" | "friends" | "profile";
  onTabChange: (tab: "inbox" | "friends" | "profile") => void;
  onShare: () => void;
}

export function MobileNav({ activeTab, onTabChange, onShare }: MobileNavProps) {
  const tabs = [
    { id: "inbox", label: "Inbox", icon: MessageSquare },
    { id: "friends", label: "Friends", icon: Users },
    { id: "profile", label: "Profile", icon: User },
  ] as const;

  return (
    <div className="sm:hidden fixed bottom-8 left-8 right-8 z-50">
      <div className="bg-slate-900/80 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[32px] p-2.5 flex items-center justify-between shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Active Tab Background "Pill" */}
        <div className="absolute inset-0 p-2.5 flex pointer-events-none">
          <div className="w-full h-full relative flex">
            {tabs.map((tab) => (
              <div key={`pill-${tab.id}`} className="flex-1 h-full relative">
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-primary rounded-2xl shadow-lg shadow-primary/40"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </div>
            ))}
            <div className="w-[60px]" /> {/* Spacer for share button */}
          </div>
        </div>

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 relative z-10 py-3 flex flex-col items-center justify-center gap-1 transition-colors duration-300",
                isActive ? "text-white" : "text-slate-400"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "scale-110" : "scale-100")} />
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          );
        })}

        <div className="w-[1px] h-8 bg-white/10 mx-1" />

        <button
          onClick={onShare}
          className="w-[60px] h-[60px] flex items-center justify-center relative z-10 text-white bg-white/10 rounded-2xl hover:bg-white/20 active:scale-90 transition-all"
        >
          <Share2 className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
