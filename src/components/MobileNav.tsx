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
    <div className="sm:hidden fixed bottom-6 left-6 right-6 z-50">
      <div className="glass-dark rounded-[32px] p-2 flex items-center justify-between shadow-2xl border-white/10 relative overflow-hidden">
        {/* Active Tab Background "Pill" */}
        <div className="absolute inset-0 p-2 flex pointer-events-none">
          <div className="w-full h-full relative flex">
            {tabs.map((tab, idx) => (
              <div key={`pill-${tab.id}`} className="flex-1 h-full relative">
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-primary/20 rounded-2xl border border-primary/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
            ))}
            <div className="w-[56px]" /> {/* Spacer for share button */}
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
                "flex-1 flex flex-col items-center gap-1 py-3 transition-all relative z-10",
                isActive ? "text-primary scale-105" : "text-slate-400"
              )}
            >
              <Icon className={cn("h-6 w-6", isActive && "fill-primary/10")} />
              <span className="text-[10px] font-bold tracking-tight uppercase">
                {tab.label}
              </span>
            </button>
          );
        })}
        
        <button
          onClick={onShare}
          className="bg-primary p-4 rounded-2xl shadow-lg shadow-primary/20 active:scale-90 transition-all z-10"
        >
          <Share2 className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  );
}
