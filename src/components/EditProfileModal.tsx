"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Loader2, User, Camera, GraduationCap, Quote, Layout, LogOut } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EditProfileModalProps {
  user: Doc<"users"> | undefined;
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ user: convexUser, isOpen, onClose }: EditProfileModalProps) {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();
  const updateProfile = useMutation(api.users.updateProfile);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [college, setCollege] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Use setTimeout to avoid synchronous setState in effect
    const timeout = setTimeout(() => {
      if (clerkUser) {
        setFirstName(clerkUser.firstName || "");
        setLastName(clerkUser.lastName || "");
      }
      if (convexUser) {
        setCollege(convexUser.college || "");
        setBatchYear(convexUser.batchYear || "");
        setBio(convexUser.bio || "");
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [convexUser, clerkUser, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clerkUser) return;
    
    setIsLoading(true);
    try {
      // Update Clerk Data (Name)
      await clerkUser.update({
        firstName,
        lastName,
      });

      // Update Convex Data (College, Bio, etc)
      await updateProfile({ college, batchYear, bio });
      
      toast.success("Identity updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !clerkUser) return;
    
    setIsLoading(true);
    try {
      await clerkUser.setProfileImage({ file });
      toast.success("Profile image updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update image.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-[40px] border-white/10 dark:border-white/5 shadow-2xl bg-[#020817]">
        <div className="noise-overlay opacity-10" />
        <div className="relative z-10 flex flex-col max-h-[90vh]">
          {/* Header */}
          <DialogHeader className="p-8 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 p-2.5 rounded-2xl">
                <Layout className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-serif font-black text-white tracking-tight">Edit Identity</DialogTitle>
                <DialogDescription className="text-slate-500 font-medium mt-1">
                  Define how you are perceived in the vault.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-white/10 group-hover:border-primary/50 transition-all duration-500 shadow-2xl">
                  <AvatarImage src={clerkUser?.imageUrl} />
                  <AvatarFallback className="text-4xl font-serif font-black bg-primary text-white">
                    {firstName[0]}
                  </AvatarFallback>
                </Avatar>
                
                <label className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                  <Camera className="h-8 w-8 text-white" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                </label>
                
                <div className="absolute -bottom-2 -right-2 bg-primary p-2.5 rounded-2xl shadow-xl text-white pointer-events-none">
                  <Camera className="h-4 w-4" />
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Change Avatar</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name Section */}
              <div className="space-y-4 sm:col-span-2">
                <div className="flex items-center gap-2 text-primary">
                  <User className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Personal Name</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-white/5 border-white/5 focus:border-primary rounded-2xl h-12 font-bold text-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-white/5 border-white/5 focus:border-primary rounded-2xl h-12 font-bold text-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* College Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <GraduationCap className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Institution</span>
                </div>
                <Input
                  placeholder="e.g. Stanford University"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="bg-white/5 border-white/5 focus:border-primary rounded-2xl h-12 font-bold text-white transition-all"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Layout className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Batch Year</span>
                </div>
                <Input
                  placeholder="e.g. 2024"
                  value={batchYear}
                  onChange={(e) => setBatchYear(e.target.value)}
                  className="bg-white/5 border-white/5 focus:border-primary rounded-2xl h-12 font-bold text-white transition-all"
                />
              </div>

              {/* Bio Section */}
              <div className="space-y-4 sm:col-span-2">
                <div className="flex items-center gap-2 text-primary">
                  <Quote className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Brief Narrative</span>
                </div>
                <Textarea
                  placeholder="Tell your friends what you've been up to..."
                  className="bg-white/5 border-white/5 focus:border-primary rounded-[32px] min-h-[120px] p-6 font-medium italic text-white resize-none transition-all placeholder:text-slate-600"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="p-8 border-t border-white/5 bg-black/20 backdrop-blur-xl flex flex-col gap-4">
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-full h-14 border-white/10 text-slate-400 hover:text-white hover:bg-white/5 font-bold"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                onClick={handleSubmit}
                className="flex-[2] bg-primary hover:bg-primary/90 rounded-full h-14 text-white font-black text-lg shadow-2xl shadow-primary/20 glow-primary-subtle transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Finalize Changes"
                )}
              </Button>
            </div>
            
            <button 
              type="button"
              onClick={() => signOut()}
              className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-600 hover:text-red-500 uppercase tracking-[0.3em] transition-colors pt-2 group"
            >
              <LogOut className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              Sign out of Vault
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
