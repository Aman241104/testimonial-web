"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EditProfileModalProps {
  user: Doc<"users"> | undefined;
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ user, isOpen, onClose }: EditProfileModalProps) {
  const updateProfile = useMutation(api.users.updateProfile);
  const [college, setCollege] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCollege(user.college || "");
      setBatchYear(user.batchYear || "");
      setBio(user.bio || "");
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile({ college, batchYear, bio });
      toast.success("Profile updated successfully!");
      onClose();
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
          <DialogDescription>
            Update your college details so your friends can find you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="college" className="font-semibold">College Name</Label>
            <Input
              id="college"
              placeholder="e.g. Stanford University"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="batchYear" className="font-semibold">Batch Year</Label>
            <Input
              id="batchYear"
              placeholder="e.g. 2024"
              value={batchYear}
              onChange={(e) => setBatchYear(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="font-semibold">Short Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell your friends what you've been up to..."
              className="h-24 resize-none rounded-xl"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-6 font-bold"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
