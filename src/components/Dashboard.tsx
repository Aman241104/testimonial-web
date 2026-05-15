"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { UserButton } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { MessageSquare, Share2, Sparkles, Users, UserCircle, Settings, Shield, Heart } from "lucide-react";
import { TestimonialCard } from "./TestimonialCard";
import { cn } from "@/lib/utils";
import { UserDirectory } from "./UserDirectory";
import { EditProfileModal } from "./EditProfileModal";
import { ComposeTestimonialModal } from "./ComposeTestimonialModal";
import { OnboardingModal } from "./OnboardingModal";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, useScroll, useTransform } from "framer-motion";
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

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.8]);

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
  const [flashbackInfo, setFlashbackInfo] = useState<{ 
    testimonial: Doc<"testimonials"> & { authorName: string; authorImage?: string }; 
    days: number 
  } | null>(null);

  useEffect(() => {
    if (myTestimonials) {
      const fb = myTestimonials.find(t => t.createdAt < Date.now() - 7 * 24 * 60 * 60 * 1000);
      if (fb) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFlashbackInfo({
          testimonial: fb,
          days: Math.floor((Date.now() - fb.createdAt) / (1000 * 60 * 60 * 24))
        });
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFlashbackInfo(null);
      }
    }
  }, [myTestimonials]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 flex">
        <div className="hidden lg:block w-80 glass-sidebar h-screen sticky top-0" />
        <div className="flex-1 p-10 space-y-10">
          <div className="flex justify-between items-center">
            <Skeleton className="h-12 w-48 rounded-2xl" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-[40px]" />
              ))}
            </div>
            <Skeleton className="h-[600px] w-full rounded-[40px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 flex transition-colors duration-500 selection:bg-primary/20">
      {/* Premium Sidebar - Large Screens Only */}
      <aside className="hidden lg:flex w-80 glass-sidebar h-screen sticky top-0 flex-col p-8 z-40">
        <div className="flex items-center gap-4 mb-12">
          <div className="bg-primary p-2.5 rounded-2xl shadow-xl shadow-primary/30 rotate-[-6deg] group hover:rotate-0 transition-transform duration-500">
            <MessageSquare className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
            College <span className="text-primary">Capsule</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: "inbox", label: "My Inbox", icon: MessageSquare },
            { id: "friends", label: "Directory", icon: Users },
            { id: "profile", label: "My Profile", icon: UserCircle },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as "inbox" | "friends" | "profile")}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black transition-all duration-300 group",
                activeTab === item.id 
                  ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" 
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
              )}
            >
              <item.icon className={cn("h-5 w-5", activeTab === item.id ? "text-white" : "group-hover:scale-110 transition-transform")} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 mt-8 border-t border-slate-200/50 dark:border-white/5">
          <button 
            onClick={() => setIsEditingProfile(true)}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:bg-slate-100 dark:hover:bg-white/5 group"
          >
            <Settings className="h-5 w-5 group-hover:rotate-45 transition-transform duration-500" />
            Settings
          </button>
          <div className="mt-6 flex items-center gap-4 px-4 py-3 bg-white/50 dark:bg-white/5 rounded-3xl border border-white dark:border-white/5 shadow-sm">
            <div className="scale-110"><UserButton /></div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-black text-slate-900 dark:text-white truncate">{me.name}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{me.college || 'Welcome!'}</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 relative">
        {/* Animated Background Accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[100px] animate-pulse [animation-delay:3s]" />
        </div>

        {/* Dynamic Header */}
        <header className="sticky top-0 z-30 w-full px-8 sm:px-12 h-24 flex items-center justify-between pointer-events-none">
          <motion.div 
            style={{ opacity: headerOpacity }}
            className="sm:hidden flex items-center gap-3 pointer-events-auto"
          >
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/30">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
          </motion.div>

          <div className="flex items-center gap-4 pointer-events-auto">
            <Button
              variant="ghost"
              className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white dark:border-white/5 px-6 h-12 rounded-2xl font-black text-slate-900 dark:text-white shadow-sm hover:shadow-md transition-all group"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Share Capsule
            </Button>
            <div className="lg:hidden"><ThemeToggle /></div>
            <div className="lg:hidden scale-110"><UserButton /></div>
            <div className="hidden lg:block"><ThemeToggle /></div>
          </div>
        </header>

        <main className="px-8 sm:px-12 pb-32 sm:pb-12 relative z-10 max-w-7xl mx-auto">
          {/* Hero Section for Dashboard */}
          <div className="mb-12">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-4"
            >
              {activeTab === "inbox" ? "Memories" : 
               activeTab === "friends" ? "People" : "Identity"}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl"
            >
              {activeTab === "inbox" ? `Reflecting on the ${myTestimonials.length} stories shared by your friends.` : 
               activeTab === "friends" ? "Connecting with the people who made college unforgettable." : 
               "Defining your story for the class of tomorrow."}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Main Feed */}
            <div className={cn(
              "lg:col-span-7 xl:col-span-8 space-y-10",
              activeTab !== "inbox" && "hidden lg:block"
            )}>
              {flashbackInfo && activeTab === "inbox" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-premium rounded-[48px] p-10 flex flex-col md:flex-row items-center md:items-start gap-8 relative group cursor-pointer hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                >
                  <div className="absolute top-0 right-0 p-20 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors duration-700" />
                  <div className="bg-primary/10 dark:bg-primary/20 p-5 rounded-3xl shrink-0 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                    <Sparkles className="h-10 w-10 text-primary" />
                  </div>
                  <div className="text-center md:text-left relative z-10">
                    <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-3 block">Flashback Moment</span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                      A message from {flashbackInfo.days} days ago
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium">
                      One of your earliest memories from <span className="text-slate-900 dark:text-white font-black underline decoration-primary decoration-4 underline-offset-4">{flashbackInfo.testimonial.authorName}</span> is waiting for a revisit.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === "inbox" && (
                <div className="space-y-8">
                  {myTestimonials.length === 0 ? (
                    <div className="glass-premium rounded-[48px] py-32 px-10 text-center border-dashed border-2">
                      <div className="bg-slate-100 dark:bg-white/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                        <MessageSquare className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Your inbox is a blank page</h3>
                      <p className="text-lg text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-10 font-medium">Start the conversation by sharing your profile link with friends.</p>
                      <Button 
                        onClick={handleShare}
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-16 px-10 text-lg font-black shadow-2xl shadow-primary/30 hover:scale-105 transition-all"
                      >
                        Launch My Capsule
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-8">
                      {myTestimonials.map((t) => (
                        <TestimonialCard key={t._id} testimonial={t} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Identity Tab Content for LG */}
              {activeTab === "profile" && (
                <div className="space-y-10 lg:hidden">
                  <div className="glass-premium rounded-[48px] p-10 text-center space-y-8">
                    <div className="relative inline-block">
                      <Avatar className="h-40 w-40 border-8 border-white dark:border-slate-800 shadow-2xl">
                        <AvatarImage src={me.imageUrl} />
                        <AvatarFallback className="text-5xl font-black">{me.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2 bg-primary p-3 rounded-2xl shadow-xl text-white">
                        <UserCircle className="h-6 w-6" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{me.name}</h3>
                      <p className="text-xl text-primary font-bold mt-2">{me.college} &apos;{me.batchYear?.slice(-2)}</p>
                    </div>
                    <div className="flex gap-4">
                      <Button 
                        variant="outline" 
                        className="flex-1 rounded-2xl h-14 font-bold text-lg dark:border-slate-700"
                        onClick={() => setIsEditingProfile(true)}
                      >
                        Edit Profile
                      </Button>
                      <Button 
                        className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 font-bold text-lg shadow-xl shadow-primary/20"
                        onClick={handleShare}
                      >
                        Share
                      </Button>
                    </div>
                    {me.bio && (
                      <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                        <p className="text-lg text-slate-600 dark:text-slate-400 italic leading-relaxed px-4">
                          &quot;{me.bio}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Columns */}
            <div className={cn(
              "lg:col-span-5 xl:col-span-4 space-y-10",
              activeTab === "inbox" ? "hidden lg:block" : 
              activeTab === "friends" ? "block" : "hidden lg:block"
            )}>
              <UserDirectory
                users={users}
                currentUser={me}
                onSelectUser={(user) => setSelectedUser(user)}
              />

              {/* Profile Overview Card (Fixed on LG) */}
              <div className="hidden lg:block glass-premium rounded-[40px] p-8 border border-white dark:border-white/5 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                <div className="flex items-center gap-4 mb-8">
                  <Avatar className="h-16 w-16 border-2 border-white dark:border-slate-800 shadow-lg">
                    <AvatarImage src={me.imageUrl} />
                    <AvatarFallback className="font-black">{me.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white tracking-tight">{me.name}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{me.college || 'Identity'}</p>
                  </div>
                </div>
                {me.bio ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic leading-relaxed mb-8 px-2">
                    &quot;{me.bio}&quot;
                  </p>
                ) : (
                  <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 mb-8 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No bio yet</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-slate-950 p-4 rounded-3xl border border-slate-100 dark:border-white/5 text-center shadow-sm">
                    <span className="block text-2xl font-black text-slate-900 dark:text-white">{myTestimonials.length}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Memories</span>
                  </div>
                  <div className="bg-white dark:bg-slate-950 p-4 rounded-3xl border border-slate-100 dark:border-white/5 text-center shadow-sm">
                    <span className="block text-2xl font-black text-slate-900 dark:text-white">{myTestimonials.filter(t => t.isLiked).length}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Favorites</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content for LG Identity Tab */}
            {activeTab === "profile" && (
              <div className="hidden lg:block lg:col-span-12 xl:col-span-12">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-premium rounded-[56px] overflow-hidden flex flex-col md:flex-row min-h-[500px]"
                >
                  <div className="w-full md:w-[40%] bg-primary p-12 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden">
                    {/* Decorative Patterns */}
                    <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl" />
                    
                    <Avatar className="h-56 w-56 border-8 border-white/30 shadow-2xl relative z-10 scale-110">
                      <AvatarImage src={me.imageUrl} />
                      <AvatarFallback className="text-6xl font-black text-white">{me.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="relative z-10">
                      <h3 className="text-5xl font-black text-white tracking-tighter mb-2">{me.name}</h3>
                      <div className="flex items-center justify-center gap-3">
                        <span className="bg-white/20 px-4 py-1.5 rounded-full text-white font-black uppercase tracking-widest text-xs backdrop-blur-md border border-white/20">
                          {me.college}
                        </span>
                        <span className="bg-white/20 px-4 py-1.5 rounded-full text-white font-black uppercase tracking-widest text-xs backdrop-blur-md border border-white/20">
                          &apos;{me.batchYear?.slice(-2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-16 flex flex-col justify-center space-y-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Personal Biography</h4>
                      <p className="text-3xl font-medium text-slate-900 dark:text-white leading-relaxed italic">
                        {me.bio ? `\u201C${me.bio}\u201D` : "Share a little about your journey and what this capsule means to you."}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                      <div className="p-8 bg-white dark:bg-slate-950 rounded-[32px] border border-slate-100 dark:border-white/5 shadow-sm">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Account Verified</h5>
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-xl">
                            <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">Active Profile</span>
                        </div>
                      </div>
                      <div className="p-8 bg-white dark:bg-slate-950 rounded-[32px] border border-slate-100 dark:border-white/5 shadow-sm">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Engagement</h5>
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-xl">
                            <Heart className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">{myTestimonials.length} Stories</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8">
                      <Button 
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-12 h-16 text-lg font-black shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all"
                        onClick={() => setIsEditingProfile(true)}
                      >
                        Edit Your Identity
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onShare={handleShare}
      />

      {/* Modals */}
      <EditProfileModal
        user={me}
        isOpen={isEditingProfile}
        onClose={() => setIsEditingProfile(false)}
      />

      <OnboardingModal
        currentUser={me}
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      <ComposeTestimonialModal
        receiver={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}