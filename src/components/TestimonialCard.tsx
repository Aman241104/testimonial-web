"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Sparkles } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { Id } from "../../convex/_generated/dataModel";

interface TestimonialCardProps {
  testimonial: {
    _id: Id<"testimonials">;
    content: string;
    createdAt: number;
    authorName: string;
    authorImage?: string;
    isLiked?: boolean;
    theme?: string;
  };
}

const THEME_CLASSES: Record<string, string> = {
  blue: "from-blue-500/10 to-transparent",
  purple: "from-purple-500/10 to-transparent",
  rose: "from-rose-500/10 to-transparent",
  amber: "from-amber-500/10 to-transparent",
  emerald: "from-emerald-500/10 to-transparent",
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const toggleReaction = useMutation(api.testimonials.toggleReaction);
  const themeGradient = THEME_CLASSES[testimonial.theme || "blue"] || THEME_CLASSES.blue;
  
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Card className="overflow-hidden bg-white/50 dark:bg-white/1 backdrop-blur-3xl border border-white dark:border-white/5 rounded-[56px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] hover:shadow-[0_48px_80px_-24px_rgba(0,0,0,0.1)] transition-all duration-700">
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-1000", themeGradient)} />
        
        <CardContent className="pt-20 pb-16 px-12 lg:px-20 relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="absolute top-12 left-12 lg:left-20 text-primary opacity-20"
          >
            <Sparkles className="w-12 h-12" />
          </motion.div>
          
          <p className="text-4xl lg:text-6xl font-serif italic text-slate-900 dark:text-white leading-[1.1] tracking-tight text-pretty">
            &quot;{testimonial.content}&quot;
          </p>
        </CardContent>

        <CardFooter className="flex justify-between items-center py-10 px-12 lg:px-20 border-t border-white dark:border-white/5 bg-white/20 dark:bg-white/2 backdrop-blur-2xl relative z-10">
          <div className="flex items-center gap-6">
            <Avatar className="h-16 w-16 border-4 border-white dark:border-slate-800 shadow-xl group-hover:scale-110 transition-transform duration-700">
              <AvatarImage src={testimonial.authorImage} />
              <AvatarFallback className="font-black bg-primary text-white">{testimonial.authorName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {testimonial.authorName}
              </span>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                {new Date(testimonial.createdAt).toLocaleDateString(undefined, {
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.2, rotate: 15 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => toggleReaction({ id: testimonial._id })}
            className={cn(
              "w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-lg",
              testimonial.isLiked
                ? "bg-red-500 text-white shadow-red-200 dark:shadow-none"
                : "bg-white/50 dark:bg-white/5 text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-white/10"
            )}
          >
            <Heart className={cn("w-8 h-8 transition-transform", testimonial.isLiked && "fill-current")} />
          </motion.button>
        </CardFooter>
      </Card>
      
      {/* Dynamic Accent Decorative Element */}
      <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full bg-slate-100 dark:bg-white/2 rounded-[56px] scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-1000" />
    </motion.div>
  );
}
