"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Sparkles, Download, Loader2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { Id } from "../../convex/_generated/dataModel";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { toast } from "sonner";

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
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const themeGradient = THEME_CLASSES[testimonial.theme || "blue"] || THEME_CLASSES.blue;

  const handleExport = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    
    // Slight delay to ensure any hover states are settled if triggered via click
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#020817', // Match dark background
        style: {
          transform: 'scale(1)',
          borderRadius: '56px',
        }
      });
      
      const link = document.createElement('a');
      link.download = `capsule-${testimonial.authorName.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Memory exported to gallery!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export memory.");
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div ref={cardRef}>
        <Card className="overflow-hidden bg-[#020817] lg:bg-white/5 dark:bg-white/1 backdrop-blur-3xl border border-white/10 dark:border-white/5 rounded-[56px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] hover:shadow-[0_48px_80px_-24px_rgba(0,0,0,0.1)] transition-all duration-700">
          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-1000", themeGradient)} />
          
          <CardContent className="pt-12 pb-10 px-8 lg:pt-20 lg:pb-16 lg:px-20 relative z-10">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="absolute top-6 left-8 lg:top-12 lg:left-20 text-primary opacity-20"
            >
              <Sparkles className="w-8 h-8 lg:w-12 lg:h-12" />
            </motion.div>
            
            <p className="text-2xl lg:text-6xl font-serif italic text-white lg:text-slate-900 dark:text-white leading-tight lg:leading-[1.1] tracking-tight text-pretty">
              &quot;{testimonial.content}&quot;
            </p>
          </CardContent>

          <CardFooter className="flex justify-between items-center py-6 px-8 lg:py-10 lg:px-20 border-t border-white/5 bg-white/5 dark:bg-white/2 backdrop-blur-2xl relative z-10">
            <div className="flex items-center gap-4 lg:gap-6">
              <Avatar className="h-12 w-12 lg:h-16 lg:w-16 border-2 lg:border-4 border-white/10 dark:border-slate-800 shadow-xl group-hover:scale-110 transition-transform duration-700">
                <AvatarImage src={testimonial.authorImage} />
                <AvatarFallback className="font-black bg-primary text-white">{testimonial.authorName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-white lg:text-slate-900 dark:text-white">
                <span className="text-base lg:text-xl font-black tracking-tight">
                  {testimonial.authorName}
                </span>
                <span className="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] opacity-50">
                  {new Date(testimonial.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleExport}
                disabled={isExporting}
                className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl lg:rounded-3xl flex items-center justify-center transition-all duration-500 bg-white/5 border border-white/10 text-white hover:bg-primary hover:text-white hover:border-primary disabled:opacity-50"
              >
                {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.2, rotate: 15 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => toggleReaction({ id: testimonial._id })}
                className={cn(
                  "w-12 h-12 lg:w-16 lg:h-16 rounded-2xl lg:rounded-3xl flex items-center justify-center transition-all duration-500 shadow-lg",
                  testimonial.isLiked
                    ? "bg-red-500 text-white shadow-red-200 dark:shadow-none"
                    : "bg-white/5 dark:bg-white/5 text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-white/10 border border-white/10"
                )}
              >
                <Heart className={cn("w-5 h-5 lg:w-8 lg:h-8 transition-transform", testimonial.isLiked && "fill-current")} />
              </motion.button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Dynamic Accent Decorative Element */}
      <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full bg-slate-100 dark:bg-white/2 rounded-[56px] scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-1000" />
    </motion.div>
  );
}
