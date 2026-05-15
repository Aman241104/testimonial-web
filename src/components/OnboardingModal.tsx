"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Building2, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { Doc } from "../../convex/_generated/dataModel";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Doc<"users"> | undefined;
}

export function OnboardingModal({ isOpen, onClose, currentUser }: OnboardingModalProps) {
  const updateProfile = useMutation(api.users.updateProfile);
  const [college, setCollege] = useState(currentUser?.college || "");
  const [batchYear, setBatchYear] = useState(currentUser?.batchYear || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!college || !batchYear) {
      toast.error("Please fill in your college and batch year");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({
        college,
        batchYear,
        bio,
      });
      toast.success("Profile updated! Welcome to College Testimonials.");
      onClose();
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader className="space-y-3">
          <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-2 mx-auto sm:mx-0">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold">Complete Your Profile</DialogTitle>
          <DialogDescription>
            Help your friends find you by adding your college details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="college" className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-400" />
                College Name
              </Label>
              <Input
                id="college"
                placeholder="e.g. Stanford University"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="rounded-xl border-slate-200 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batchYear" className="text-sm font-semibold flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-slate-400" />
                Batch Year
              </Label>
              <Input
                id="batchYear"
                placeholder="e.g. 2024"
                value={batchYear}
                onChange={(e) => setBatchYear(e.target.value)}
                className="rounded-xl border-slate-200 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-semibold flex items-center gap-2">
                <UserCircle className="h-4 w-4 text-slate-400" />
                Short Bio (Optional)
              </Label>
              <Input
                id="bio"
                placeholder="Tell friends what you're up to!"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="rounded-xl border-slate-200 focus:ring-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-6 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Let's Go!"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
