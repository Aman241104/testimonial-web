"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Doc } from "../../convex/_generated/dataModel";

interface UserDirectoryProps {
  users: Doc<"users">[];
  currentUser: Doc<"users"> | undefined;
  onSelectUser: (user: Doc<"users">) => void;
}

export function UserDirectory({ users, currentUser, onSelectUser }: UserDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users?.filter(
    (user) =>
      user.tokenIdentifier !== currentUser?.tokenIdentifier &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.college?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.batchYear?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card className="h-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl rounded-[40px] overflow-hidden transition-all duration-500">
      <CardHeader className="pb-6 pt-8 px-8 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="hidden sm:flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-2xl">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-black tracking-tight">Directory</CardTitle>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full shadow-sm">
            {filteredUsers?.length} Active
          </span>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search friends, college..."
            className="pl-12 bg-white dark:bg-slate-900 border-none shadow-sm focus:ring-2 focus:ring-primary/20 rounded-2xl transition-all h-14 text-lg font-medium placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-6 px-4">
        <div className="space-y-3 max-h-[600px] overflow-y-auto px-4 custom-scrollbar pb-6">
          <AnimatePresence mode="popLayout">
            {filteredUsers?.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 text-slate-500"
              >
                <div className="bg-slate-50 dark:bg-slate-800/50 w-20 h-20 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Search className="h-10 w-10 text-slate-200" />
                </div>
                <p className="font-bold text-lg text-slate-400">No matches found</p>
                <p className="text-sm opacity-60 px-8">Try searching for a name, college, or graduation year.</p>
              </motion.div>
            ) : (
              filteredUsers?.map((user) => (
                <motion.div
                  key={user._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ x: 4 }}
                  className="p-5 bg-white dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800/50 hover:border-primary/20 rounded-3xl cursor-pointer transition-all duration-300 group flex items-center gap-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-primary/5"
                  onClick={() => onSelectUser(user)}
                >
                  <div className="relative">
                    <Avatar className="h-14 w-14 border-2 border-white dark:border-slate-700 shadow-md group-hover:border-primary/40 transition-all duration-500 scale-100 group-hover:scale-105">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback className="font-black text-xl">{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-slate-800 rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors text-lg tracking-tight">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs font-bold text-slate-400 truncate uppercase tracking-wider">
                        {user.college || "Alumni"}
                      </p>
                      {user.batchYear && (
                        <span className="text-[10px] px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg font-black tracking-tighter">
                          &apos;{user.batchYear.slice(-2)}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
