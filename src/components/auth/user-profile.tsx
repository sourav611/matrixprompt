"use client";
import { User } from "@supabase/supabase-js";
import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Download,
  FolderHeart,
  Image as ImageIcon,
  LogOut,
  User as UserIcon,
  Sparkles,
  Settings,
  CreditCard,
} from "lucide-react";
import { userLogoutAction } from "@/actions/users";
import Link from "next/link";

interface UserProfileProps {
  user: User | null;
}

export default function UserProfile({ user }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Generate initials or fallback
  const userInitials = user?.email?.substring(0, 2).toUpperCase() || "U";
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative flex h-9 w-9 items-center justify-center rounded-full overflow-hidden border transition-all duration-300 ease-out
          ${isOpen ? "ring-2 ring-primary ring-offset-2 border-transparent" : "border-border hover:border-primary/50"}
        `}
      >
        {user?.user_metadata?.avatar_url ? (
           <img 
             src={user.user_metadata.avatar_url} 
             alt="Avatar" 
             className="h-full w-full object-cover" 
           />
        ) : (
           <div className="h-full w-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
             {userInitials}
           </div>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="absolute right-0 mt-3 w-72 origin-top-right rounded-2xl bg-popover/95 backdrop-blur-xl border border-border/50 shadow-2xl ring-1 ring-black/5 z-50 overflow-hidden"
          >
            {/* Header Section */}
            <div className="p-4 border-b border-border/40 bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary border border-primary/10">
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="h-full w-full object-cover rounded-full" />
                  ) : (
                    <span className="font-bold text-sm">{userInitials}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              
              {/* Upgrade Banner */}
              <div className="mt-3">
                <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border border-primary/10 hover:border-primary/30 transition-all group">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-primary fill-primary/20" />
                    <span className="text-xs font-medium text-primary">Upgrade Plan</span>
                  </div>
                  <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded uppercase tracking-wide group-hover:scale-105 transition-transform">
                    Pro
                  </span>
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <div className="space-y-0.5">
                <Link href="/profile" onClick={() => setIsOpen(false)}>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground/80 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
                    <UserIcon size={16} />
                    Profile
                  </button>
                </Link>
                <Link href="/collections" onClick={() => setIsOpen(false)}>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground/80 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
                    <FolderHeart size={16} />
                    Collections
                  </button>
                </Link>
                <Link href="/admin/dashboard" onClick={() => setIsOpen(false)}>
                   <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground/80 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
                    <ImageIcon size={16} />
                    Manage Images
                  </button>
                </Link>
              </div>

              <div className="my-2 h-px bg-border/50 mx-2" />

              <div className="space-y-0.5">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground/80 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Download size={16} />
                  <span className="flex-1 text-left">Downloads</span>
                  <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-md">
                    5 left
                  </span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground/80 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
                  <CreditCard size={16} />
                  Billing
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground/80 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Settings size={16} />
                  Settings
                </button>
              </div>

              <div className="my-2 h-px bg-border/50 mx-2" />

              <button
                onClick={async () => {
                  setIsOpen(false);
                  await userLogoutAction();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
