"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { MessageSquare, Share2, Sparkles, Users, UserCircle, Settings } from "lucide-react";
import { TestimonialCard } from "./TestimonialCard";
import { cn } from "@/lib/utils";
import { UserDirectory } from "./UserDirectory";
import { EditProfileModal } from "./EditProfileModal";
import { ComposeTestimonialModal } from "./ComposeTestimonialModal";
import { OnboardingModal } from "./OnboardingModal";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Doc } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

export function Dashboard() {
  const me = useQuery(api.users.getMe);
  const storeUser = useMutation(api.users.storeUser);
  const users = useQuery(api.users.listUsers);
  const myTestimonials = useQuery(api.testimonials.getMyTestimonials);

  const [selectedUser, setSelectedUser] = useState<Doc<"users"> | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState<"inbox" | "friends" | "profile">("inbox");
  const [showOnboarding, setShowOnboarding] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    storeUser();
  }, [storeUser]);

  useEffect(() => {
    if (me && (!me.college || !me.batchYear)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowOnboarding(true);
    }
  }, [me]);

  const handleShare = async () => {
    if (!me) return;
    const shareUrl = `${window.location.origin}/u/${me._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Write a testimonial for ${me.name}!`,
          text: "Tell me what I meant to you during college!",
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Profile link copied to clipboard!");
    }
  };

  const isLoading = !me || !users || !myTestimonials;

  return (
    <div ref={containerRef} className="min-h-screen bg-[#fafafa] dark:bg-[#020817] flex selection:bg-primary/30 transition-colors duration-1000 overflow-x-hidden">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-primary p-6 rounded-3xl shadow-2xl"
          >
            <MessageSquare className="w-12 h-12 text-white" />
          </motion.div>
        </div>
      ) : (
        <>
          {/* Immersive Background Blur */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] lg:w-[40%] lg:h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] lg:w-[30%] lg:h-[30%] bg-indigo-500/5 rounded-full blur-[120px]" />
          </div>

          {/* Sidebar - Desktop Only */}
          <aside className="hidden lg:flex w-24 xl:w-80 h-screen sticky top-0 flex-col py-12 px-6 z-50 bg-white/50 dark:bg-[#020817] border-r border-white dark:border-white/5">
            <div className="flex items-center gap-4 mb-20 justify-center xl:justify-start">
              <div className="bg-primary p-3 rounded-2xl shadow-xl rotate-[-10deg] hover:rotate-0 transition-transform duration-500 cursor-pointer">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h1 className="hidden xl:block text-xl font-serif font-black tracking-tighter text-slate-900 dark:text-white">
                Capsule.
              </h1>
            </div>

            <nav className="flex-1 flex flex-col gap-6 items-center xl:items-stretch">
              {[
                { id: "inbox", label: "Memories", icon: MessageSquare },
                { id: "friends", label: "Directory", icon: Users },
                { id: "profile", label: "Identity", icon: UserCircle },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as "inbox" | "friends" | "profile")}
                  className={cn(
                    "relative group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300",
                    activeTab === item.id 
                      ? "bg-primary text-white shadow-xl shadow-primary/40" 
                      : "text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                  )}
                >
                  <item.icon className="h-6 w-6 shrink-0" />
                  <span className="hidden xl:block font-bold tracking-tight">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-auto space-y-8 flex flex-col items-center xl:items-stretch">
              <button 
                onClick={() => setIsEditingProfile(true)}
                className="flex items-center gap-4 p-4 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Settings className="h-6 w-6 hover:rotate-90 transition-transform duration-500" />
                <span className="hidden xl:block font-bold tracking-tight">Settings</span>
              </button>
              
              {/* Unified Profile Trigger */}
              <button 
                onClick={() => setIsEditingProfile(true)}
                className="p-2 xl:p-4 bg-white dark:bg-white/5 rounded-3xl border border-white dark:border-white/5 shadow-sm flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-white/10 transition-all group"
              >
                <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-md group-hover:scale-110 transition-transform">
                  <AvatarImage src={me.imageUrl} />
                  <AvatarFallback className="font-serif font-black bg-primary text-white">{me.name[0]}</AvatarFallback>
                </Avatar>
                <div className="hidden xl:flex flex-col text-left min-w-0">
                  <span className="text-xs font-black text-slate-900 dark:text-white truncate">{me.name}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{me.college || 'Alumni'}</span>
                </div>
              </button>
            </div>
          </aside>

          <main className="flex-1 relative z-10 pb-32 lg:pb-0">
            <header className="h-20 lg:h-24 px-6 lg:px-16 flex items-center justify-between sticky top-0 bg-background/50 backdrop-blur-xl z-40 border-b border-white dark:border-white/5">
              <div className="flex items-center gap-3 lg:hidden">
                <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-serif font-black tracking-tight">Capsule.</span>
              </div>
              
              <div className="flex items-center gap-4 lg:gap-6 ml-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    className="rounded-full px-5 lg:px-8 h-10 lg:h-12 text-xs lg:text-sm font-bold border-slate-200 dark:border-white/10 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                    onClick={handleShare}
                  >
                    <Share2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 mr-2" />
                    <span className="hidden sm:inline">Share Capsule</span>
                    <span className="sm:hidden">Share</span>
                  </Button>
                </motion.div>
                <ThemeToggle />
                
                {/* Mobile Identity Trigger */}
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="lg:hidden"
                >
                  <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-md">
                    <AvatarImage src={me.imageUrl} />
                    <AvatarFallback className="font-serif font-black bg-primary text-white">{me.name[0]}</AvatarFallback>
                  </Avatar>
                </button>
              </div>
            </header>

            <div className="px-6 lg:px-16 py-10 lg:py-24 max-w-7xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-12 lg:mb-20 space-y-2 lg:space-y-4">
                  <span className="text-[10px] lg:text-sm font-black uppercase tracking-[0.4em] text-primary block reveal-text">Digital Vault</span>
                  <h1 className="text-5xl lg:text-[7rem] font-serif font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white">
                    {activeTab === "inbox" ? "The Archive" : activeTab === "friends" ? "Network" : "Identity"}
                  </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                  {/* Main Content Area */}
                  <div className="lg:col-span-8">
                    {activeTab === "inbox" && (
                      <div className="space-y-8 lg:space-y-12">
                        {myTestimonials.length === 0 ? (
                          <div className="group relative p-12 lg:p-32 rounded-[48px] lg:rounded-[64px] bg-white/50 dark:bg-white/2 backdrop-blur-3xl border-2 border-dashed border-slate-200 dark:border-white/10 text-center overflow-hidden">
                            <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <motion.div 
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 10, repeat: Infinity }}
                              className="bg-slate-100 dark:bg-white/5 w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mx-auto mb-8 lg:mb-10 relative z-10"
                            >
                              <MessageSquare className="w-8 h-8 lg:w-10 lg:h-10 text-slate-300 dark:text-slate-600" />
                            </motion.div>
                            <h2 className="text-3xl lg:text-5xl font-serif font-black mb-4 lg:mb-6 text-slate-900 dark:text-white relative z-10">Your story begins here.</h2>
                            <p className="text-base lg:text-xl text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 lg:mb-12 font-medium leading-relaxed relative z-10 text-balance">
                              Share your link and let the people who knew you best fill these pages.
                            </p>
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleShare}
                              className="px-8 lg:px-12 py-4 lg:py-6 bg-primary text-white rounded-full font-black text-lg lg:text-xl shadow-2xl shadow-primary/30 relative z-10 glow-primary-subtle"
                            >
                              Launch My Capsule
                            </motion.button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-8 lg:gap-12">
                            {myTestimonials.map((t, i) => (
                              <motion.div 
                                key={t._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                viewport={{ once: true, margin: "-100px" }}
                              >
                                <TestimonialCard testimonial={t} />
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "profile" && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 lg:p-20 rounded-[48px] lg:rounded-[64px] bg-primary text-white relative overflow-hidden shadow-2xl"
                      >
                        <div className="absolute top-0 right-0 p-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="relative z-10 flex flex-col md:flex-row gap-8 lg:gap-12 items-center text-center md:text-left">
                          <Avatar className="h-32 w-32 lg:h-48 lg:w-48 border-4 lg:border-8 border-white/20 shadow-2xl">
                            <AvatarImage src={me.imageUrl} />
                            <AvatarFallback className="text-4xl lg:text-6xl font-black">{me.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-4 lg:space-y-6">
                            <div className="space-y-1 lg:space-y-2">
                              <h2 className="text-4xl lg:text-6xl font-serif font-black tracking-tight">{me.name}</h2>
                              <p className="text-lg lg:text-2xl font-bold opacity-80">{me.college} &apos;{me.batchYear?.slice(-2)}</p>
                            </div>
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                              <Button size="lg" className="rounded-full px-6 lg:px-8 bg-white text-primary hover:bg-white/90 font-black h-12 lg:h-14 text-sm lg:text-base" onClick={() => setIsEditingProfile(true)}>Edit Identity</Button>
                              <Button size="lg" variant="ghost" className="rounded-full px-6 lg:px-8 text-white hover:bg-white/10 font-bold h-12 lg:h-14 text-sm lg:text-base" onClick={handleShare}>Share Link</Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Sidebar Info Area */}
                  <div className={cn(
                    "lg:col-span-4 space-y-8 lg:space-y-12",
                    activeTab !== "friends" && "hidden lg:block"
                  )}>
                    <div className="sticky top-28 lg:top-32">
                      <UserDirectory users={users} currentUser={me} onSelectUser={setSelectedUser} />
                      
                      {activeTab === "inbox" && (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                          className="mt-8 lg:mt-12 p-6 lg:p-8 rounded-[32px] lg:rounded-[40px] bg-slate-900 text-white relative overflow-hidden group shadow-xl"
                        >
                          <Sparkles className="w-8 h-8 lg:w-10 lg:h-10 text-primary mb-4 lg:mb-6 group-hover:rotate-12 transition-transform duration-500" />
                          <h4 className="text-xl lg:text-2xl font-serif font-black mb-2 lg:mb-4 tracking-tight">Your Legacy.</h4>
                          <p className="text-sm lg:text-base text-slate-400 font-medium leading-relaxed">
                            Every story shared here adds a brushstroke to the portrait of who you were.
                          </p>
                          <div className="absolute -bottom-10 -right-10 w-32 h-32 lg:w-40 lg:h-40 bg-primary/10 rounded-full blur-2xl" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </main>

          <MobileNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as "inbox" | "friends" | "profile")} onShare={handleShare} />

          {/* Experimental Modals */}
          <AnimatePresence>
            {isEditingProfile && (
              <EditProfileModal user={me} isOpen={isEditingProfile} onClose={() => setIsEditingProfile(false)} />
            )}
          </AnimatePresence>

          <OnboardingModal currentUser={me} isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
          
          <ComposeTestimonialModal receiver={selectedUser} isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} />
        </>
      )}
    </div>
  );
}