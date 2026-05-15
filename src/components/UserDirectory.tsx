"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UserDirectoryProps {
  users: any[];
  currentUser: any;
  onSelectUser: (user: any) => void;
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
    <Card className="h-full border-slate-200 shadow-sm rounded-3xl overflow-hidden border-none sm:border">
      <CardHeader className="pb-4 bg-slate-50/50">
        <div className="hidden sm:flex items-center gap-2 mb-4">
          <div className="bg-blue-100 p-2 rounded-xl">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <CardTitle className="text-xl font-bold">Find Friends</CardTitle>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search name, college, or year..."
            className="pl-9 bg-white border-slate-200 focus:ring-blue-500 rounded-xl transition-all h-12 sm:h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {filteredUsers?.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-slate-500 text-sm"
              >
                <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="h-6 w-6 text-slate-300" />
                </div>
                No friends found matching &quot;{searchTerm}&quot;
              </motion.div>
            ) : (
              filteredUsers?.map((user) => (
                <motion.div
                  key={user._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 border border-slate-100 bg-white hover:border-blue-200 hover:bg-blue-50/30 rounded-2xl cursor-pointer transition-all group flex items-center gap-4 shadow-sm hover:shadow-md"
                  onClick={() => onSelectUser(user)}
                >
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm group-hover:border-blue-200 transition-colors">
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-slate-500 truncate">
                        {user.college || "No college set"}
                      </p>
                      {user.batchYear && (
                        <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-bold">
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
