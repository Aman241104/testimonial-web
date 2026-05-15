"use client";

import { AuthLoading, Authenticated } from "convex/react";
import { Show } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { Dashboard } from "@/components/Dashboard";
import { LandingPage } from "@/components/LandingPage";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <AuthLoading>
        <div className="flex h-screen items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-slate-500 font-medium animate-pulse">Loading your memories...</p>
          </div>
        </div>
      </AuthLoading>
      
      <Show when="signed-in">
        <Authenticated>
          <Dashboard />
        </Authenticated>
      </Show>
      
      <Show when="signed-out">
        <LandingPage />
      </Show>

      <Toaster position="top-center" richColors />
    </main>
  );
}
