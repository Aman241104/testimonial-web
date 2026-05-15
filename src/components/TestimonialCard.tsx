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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative pt-3"
    >
      <div className="washi-tape mix-blend-overlay"></div>
      <Card className={cn(
        "overflow-hidden transition-all border-2 shadow-sm rounded-3xl hover:shadow-md hover:scale-[1.01] paper-grain",
        themeClass
      )}>
        <CardContent className="pt-8 pb-6 px-8">
          <p className="leading-relaxed text-2xl font-handwriting">
            &quot;{testimonial.content}&quot;
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center bg-white/40 backdrop-blur-sm py-4 px-8 border-t border-black/5">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarImage src={testimonial.authorImage} />
              <AvatarFallback>{testimonial.authorName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-bold opacity-90">
                {testimonial.authorName}
              </span>
              <span className="text-[10px] opacity-60 uppercase tracking-widest font-bold">
                {new Date(testimonial.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => toggleReaction({ id: testimonial._id })}
            className={cn(
              "p-2.5 rounded-full transition-colors",
              testimonial.isLiked
                ? "text-red-500 bg-white shadow-sm"
                : "text-slate-400 hover:text-red-400 hover:bg-white/50"
            )}
          >
            <Heart
              className={cn("h-5 w-5", testimonial.isLiked && "fill-current")}
            />
          </motion.button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
