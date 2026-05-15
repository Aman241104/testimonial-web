"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
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
  blue: "bg-blue-50 border-blue-100 text-blue-900 shadow-blue-50",
  purple: "bg-purple-50 border-purple-100 text-purple-900 shadow-purple-50",
  rose: "bg-rose-50 border-rose-100 text-rose-900 shadow-rose-50",
  amber: "bg-amber-50 border-amber-100 text-amber-900 shadow-amber-50",
  emerald: "bg-emerald-50 border-emerald-100 text-emerald-900 shadow-emerald-50",
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const toggleReaction = useMutation(api.testimonials.toggleReaction);
  const themeClass = THEME_CLASSES[testimonial.theme || "blue"] || THEME_CLASSES.blue;
  
  // Create a stable random rotation based on ID
  const rotation = (testimonial._id.charCodeAt(testimonial._id.length - 1) % 4) - 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: rotation - 2 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative pt-6 group"
    >
      <div 
        className="washi-tape mix-blend-multiply dark:mix-blend-overlay opacity-60"
        style={{ transform: `translateX(-50%) rotate(${rotation * 2 + 3}deg)` }}
      />
      <Card className={cn(
        "overflow-hidden transition-all border-none shadow-[0_10px_40px_rgba(0,0,0,0.04)] dark:shadow-none rounded-[40px] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:translate-y-[-4px] paper-grain relative",
        themeClass
      )}>
        <div className="absolute top-0 right-0 p-12 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <CardContent className="pt-12 pb-10 px-10 relative z-10">
          <p className="leading-relaxed text-3xl font-handwriting text-balance">
            &quot;{testimonial.content}&quot;
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center bg-white/40 dark:bg-black/20 backdrop-blur-md py-6 px-10 border-t border-black/5 dark:border-white/5 relative z-10">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-800 shadow-md">
              <AvatarImage src={testimonial.authorImage} />
              <AvatarFallback className="font-black bg-white/50">{testimonial.authorName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight opacity-90">
                {testimonial.authorName}
              </span>
              <span className="text-[11px] opacity-50 uppercase tracking-[0.2em] font-black">
                {new Date(testimonial.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleReaction({ id: testimonial._id })}
            className={cn(
              "p-3.5 rounded-2xl transition-all shadow-sm",
              testimonial.isLiked
                ? "text-red-500 bg-white dark:bg-slate-900 shadow-red-100 dark:shadow-none"
                : "text-slate-400 hover:text-red-400 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10"
            )}
          >
            <Heart
              className={cn("h-6 w-6 transition-all", testimonial.isLiked && "fill-current scale-110")}
            />
          </motion.button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
