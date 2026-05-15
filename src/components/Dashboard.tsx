"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { UserButton } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { MessageSquare, Settings, Share2, Calendar, Sparkles } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export function Dashboard() {
  const me = useQuery(api.users.getMe);
  const storeUser = useMutation(api.users.storeUser);
  const users = useQuery(api.users.listUsers);
  const myTestimonials = useQuery(api.testimonials.getMyTestimonials);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState<"inbox" | "friends" | "profile">("inbox");
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    storeUser();
  }, [storeUser]);

  useEffect(() => {
    if (me && (!me.college || !me.batchYear)) {
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
  const [flashbackInfo, setFlashbackInfo] = useState<{ testimonial: any; days: number } | null>(null);

  useEffect(() => {
    if (myTestimonials) {
      const fb = myTestimonials.find(t => t.createdAt < Date.now() - 7 * 24 * 60 * 60 * 1000);
      if (fb) {
        setFlashbackInfo({
          testimonial: fb,
          days: Math.floor((Date.now() - fb.createdAt) / (1000 * 60 * 60 * 24))
        });
      } else {
        setFlashbackInfo(null);
      }
    }
  }, [myTestimonials]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-2xl" />
              ))}
            </div>
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-24 sm:pb-8 transition-colors duration-500">
      {/* Desktop Header */}
      <header className="sticky top-0 z-30 w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md hidden sm:block">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/20">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              College Testimonials
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="text-slate-600 dark:text-slate-300 flex items-center gap-2 rounded-xl hidden md:flex"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              Share Profile
            </Button>
            <ThemeToggle />
            <UserButton />
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <div className="sm:hidden px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {activeTab === "inbox" ? "My Inbox" : 
             activeTab === "friends" ? "Find Friends" : "My Profile"}
          </h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserButton />
          </div>
        </div>
        {activeTab === "inbox" && (
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            {myTestimonials.length} memories received
          </p>
        )}
      </div>

      <main className="container mx-auto px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className={cn(
            "lg:col-span-2 space-y-6",
            activeTab !== "inbox" && "hidden sm:block"
          )}>
            <div className="hidden sm:flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  My Inbox
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  Welcome back, {me.name} {me.college && `from ${me.college}`}
                </p>
              </div>
            </div>

            {flashbackInfo && activeTab === "inbox" && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/50 rounded-3xl p-6 mb-6 flex items-start gap-4 shadow-sm"
              >
                <div className="bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded-2xl shrink-0">
                  <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                    Memory Spotlight <Sparkles className="h-4 w-4 text-indigo-500" />
                  </h3>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1 leading-relaxed">
                    {flashbackInfo.testimonial.authorName} wrote to you {flashbackInfo.days} days ago. Take a moment to look back!
                  </p>
                </div>
              </motion.div>
            )}

            {myTestimonials.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl py-20 px-6 text-center"
              >
                <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Your inbox is empty
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Share your profile link or ask your college friends to write
                  something nice about you!
                </p>
                <Button 
                  onClick={handleShare}
                  className="mt-6 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20"
                >
                  Share My Profile
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {myTestimonials.map((t) => (
                  <TestimonialCard key={t._id} testimonial={t} />
                ))}
              </div>
            )}
          </div>

          {/* Directory / Friends Area */}
          <div className={cn(
            "space-y-6",
            activeTab !== "friends" && "hidden lg:block"
          )}>
            <UserDirectory
              users={users}
              currentUser={me}
              onSelectUser={(user) => setSelectedUser(user)}
            />
          </div>

          {/* Profile Area (Mobile Only Tab) */}
          <div className={cn(
            "sm:hidden space-y-6",
            activeTab !== "profile" && "hidden"
          )}>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-28 w-28 border-4 border-white dark:border-slate-800 shadow-xl">
                  <AvatarImage src={me.imageUrl} />
                  <AvatarFallback className="text-3xl font-black">{me.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{me.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">{me.college} {me.batchYear && `\u0027${me.batchYear.slice(-2)}`}</p>
                </div>
                <div className="flex gap-3 w-full">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-2xl h-12 dark:border-slate-700"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    Edit Profile
                  </Button>
                  <Button 
                    className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 shadow-lg shadow-primary/20"
                    onClick={handleShare}
                  >
                    Share
                  </Button>
                </div>
              </div>

              {me.bio && (
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed text-center">
                    &quot;{me.bio}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

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
