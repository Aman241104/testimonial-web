"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";
import { ComposeTestimonialModal } from "@/components/ComposeTestimonialModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart, Sparkles, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function PublicProfile() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn } = useUser();
  const userId = params.id as Id<"users">;
  
  const user = useQuery(api.users.getUser, { id: userId });
  const [isWriting, setIsWriting] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center p-6 pt-12">
      <div className="max-w-md w-full space-y-8">
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-full text-slate-500 hover:text-slate-900"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back home
        </Button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] p-10 shadow-xl shadow-blue-100/50 border border-slate-100 text-center space-y-6 relative overflow-hidden"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <MessageSquare className="h-32 w-32 rotate-12" />
          </div>
          
          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-20 animate-pulse" />
            <Avatar className="h-32 w-32 border-4 border-white shadow-xl relative z-10">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback className="text-4xl font-black bg-blue-50 text-blue-600">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-2 relative z-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {user.name}
            </h1>
            <p className="text-lg font-semibold text-blue-600">
              {user.college} {user.batchYear && `\u0027${user.batchYear.slice(-2)}`}
            </p>
            {user.bio && (
              <p className="text-slate-500 italic max-w-xs mx-auto pt-2">
                &quot;{user.bio}&quot;
              </p>
            )}
          </div>

          <div className="pt-6 relative z-10">
            {isSignedIn ? (
              <Button 
                onClick={() => setIsWriting(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 py-8 rounded-3xl text-xl font-bold shadow-lg shadow-blue-200 group transition-all hover:scale-[1.02] active:scale-95"
              >
                Write a Testimonial
                <Sparkles className="ml-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 py-8 rounded-3xl text-xl font-bold shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95"
                >
                  Sign in to write
                </Button>
              </SignInButton>
            )}
            <p className="text-xs text-slate-400 mt-4 font-medium flex items-center justify-center gap-1">
              <Heart className="h-3 w-3 fill-red-400 text-red-400" />
              Only {user.name} will see your message
            </p>
          </div>
        </motion.div>

        <div className="text-center space-y-4 pt-4">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            What is this?
          </p>
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-100 text-sm text-slate-600 leading-relaxed">
            College Testimonials is a private way to share memories with your friends. 
            Write something heartfelt, funny, or nostalgic&mdash;it&apos;s a digital yearbook for the phone generation.
          </div>
        </div>
      </div>

      <ComposeTestimonialModal
        receiver={user}
        isOpen={isWriting}
        onClose={() => setIsWriting(false)}
      />
    </main>
  );
}
