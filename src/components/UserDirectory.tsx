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
    <Card className="h-full border-none shadow-none bg-white/50 dark:bg-slate-900/20 backdrop-blur-xl rounded-[40px] overflow-hidden transition-all duration-500">
      <CardHeader className="pb-6 pt-10 px-8">
        <div className="hidden sm:flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-2xl font-serif tracking-tight">Directory</CardTitle>
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-full border border-slate-200/50 dark:border-white/5">
            {filteredUsers?.length} Active
          </span>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search friends, college..."
            className="pl-11 bg-slate-100/50 dark:bg-slate-950/50 border-none shadow-inner focus:ring-2 focus:ring-primary/20 rounded-2xl transition-all h-12 text-sm font-medium placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-2 px-4">
        <div className="space-y-3 max-h-[500px] overflow-y-auto px-4 custom-scrollbar pb-10">
          <AnimatePresence mode="popLayout">
            {filteredUsers?.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 text-slate-500"
              >
                <div className="bg-slate-100 dark:bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="font-black text-slate-900 dark:text-white mb-2">No matches found</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 px-8 leading-relaxed">Try searching for a name, college, or graduation year.</p>
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
                  className="p-4 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-100 dark:border-white/5 rounded-3xl cursor-pointer transition-all duration-300 group flex items-center gap-4 shadow-sm hover:shadow-md"
                  onClick={() => onSelectUser(user)}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-800 shadow-sm group-hover:border-primary/40 transition-all duration-500 scale-100 group-hover:scale-105">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback className="font-black text-lg">{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors tracking-tight">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-wider">
                        {user.college || "Alumni"}
                      </p>
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
