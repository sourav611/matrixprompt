"use client";

import { Menu, Search, Sparkles, X, Bell, UploadCloud } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "../theme/mode-toggle";
import type { User } from "@supabase/supabase-js";
import UserProfile from "../auth/user-profile";
import { usePathname } from "next/navigation";

interface HomeHeaderProps {
  user: User | null;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: "explore", label: "Explore", href: "/" },
  { id: "license", label: "License", href: "#" },
];

export default function HomeHeader({ user }: HomeHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    // Check initially
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamic styles based on scroll state and page
  const isTransparent = isHomePage && !isScrolled && !isMenuOpen;
  
  const textColorClass = isTransparent ? "text-white" : "text-foreground";
  const mutedTextClass = isTransparent ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-foreground";
  // const borderColorClass = isTransparent ? "border-white/20" : "border-border"; // Removed unused variable

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        !isTransparent
          ? "bg-background/85 backdrop-blur-2xl border-b border-border/40 shadow-sm py-2"
          : "bg-transparent border-b border-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-12 items-center justify-between gap-4">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2.5 group z-50 relative">
            <div className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 ${isTransparent ? "bg-white/20 backdrop-blur-md shadow-inner border border-white/10" : "bg-primary/10"}`}>
              <Sparkles className={`h-4.5 w-4.5 transition-colors duration-300 ${isTransparent ? "text-white" : "text-primary"}`} />
            </div>
            <span className={`text-lg font-bold tracking-tight transition-colors duration-300 ${textColorClass}`}>
              Artesia
            </span>
          </Link>

          {/* Center: Search Bar (Hidden at top of Home Page) */}
          <div 
            className={`
              hidden lg:flex flex-1 max-w-md mx-8 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] transform origin-center
              ${isTransparent 
                ? "opacity-0 scale-95 pointer-events-none translate-y-2" 
                : "opacity-100 scale-100 translate-y-0"
              }
            `}
          >
             <div className="relative w-full group">
               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                 <Search className="h-4 w-4" />
               </div>
               <input 
                 type="text" 
                 placeholder="Search photos..." 
                 className="h-10 w-full rounded-full bg-muted/50 border border-transparent focus:bg-background focus:border-primary/20 focus:ring-4 focus:ring-primary/5 pl-10 pr-4 text-sm outline-none transition-all duration-300 placeholder:text-muted-foreground/60"
               />
             </div>
          </div>

          {/* Right: Nav & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Desktop Nav Items */}
            <nav className="hidden md:flex items-center gap-6 mr-4">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-300 ${mutedTextClass}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className={`h-5 w-px hidden sm:block mx-1 transition-colors duration-500 ${isTransparent ? "bg-white/20" : "bg-border"}`} />

            {/* Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                 <ModeToggle />
              </div>

              {/* Upload Button */}
              <Link href={user ? "/admin/dashboard" : "/auth"}>
                 <button 
                   className={`
                     hidden sm:flex items-center gap-2 px-4 h-10 rounded-full text-sm font-medium transition-all duration-300 ease-out
                     ${isTransparent 
                        ? "bg-white/10 text-white hover:bg-white hover:text-black backdrop-blur-md border border-white/20 hover:border-white/50" 
                        : "bg-primary text-primary-foreground hover:opacity-90 shadow-sm shadow-primary/20 active:scale-95"}
                   `}
                 >
                   <UploadCloud size={16} />
                   <span>Upload</span>
                 </button>
              </Link>

              {user ? (
                <div className="flex items-center gap-3 ml-1">
                  <button className={`hidden sm:flex items-center justify-center h-9 w-9 rounded-full transition-colors duration-300 ${isTransparent ? "text-white hover:bg-white/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                    <Bell className="h-5 w-5" />
                  </button>
                  <UserProfile user={user} />
                </div>
              ) : (
                <Link href="/auth" className={`text-sm font-medium ml-2 px-3 py-1.5 rounded-md transition-colors ${isTransparent ? "text-white hover:bg-white/10" : "text-foreground hover:bg-muted"}`}>
                  Log In
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`sm:hidden p-2 -mr-2 rounded-full transition-colors duration-300 ${isTransparent ? "text-white hover:bg-white/20" : "text-muted-foreground hover:bg-muted"}`}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-0 z-40 bg-background/98 backdrop-blur-2xl flex flex-col sm:hidden pt-20"
          >
            <div className="flex-1 p-6 space-y-8 overflow-y-auto">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search photos..."
                  className="h-12 w-full rounded-2xl bg-muted/50 pl-11 pr-4 text-base outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <nav className="flex flex-col gap-1">
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-4 py-4 rounded-2xl text-lg font-medium hover:bg-muted transition-colors">
                  Explore
                </Link>
                <Link href="#" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-4 py-4 rounded-2xl text-lg font-medium hover:bg-muted transition-colors">
                  License
                </Link>
                 <Link href={user ? "/admin/dashboard" : "/auth"} onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-4 rounded-2xl text-lg font-medium hover:bg-muted transition-colors text-primary">
                  <UploadCloud className="mr-3 h-5 w-5" /> Upload Photo
                </Link>
              </nav>

              <div className="pt-8 border-t border-border/50">
                 <div className="flex items-center justify-between px-2 mb-6">
                    <span className="text-base font-medium text-muted-foreground">Appearance</span>
                    <ModeToggle />
                 </div>
                 
                 {!user && (
                    <div className="flex flex-col gap-3">
                      <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                        <button className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground text-base font-semibold shadow-lg shadow-primary/20 active:scale-95 transition-all">
                          Join Free
                        </button>
                      </Link>
                      <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                        <button className="w-full py-3.5 rounded-2xl border border-border/50 text-base font-medium hover:bg-muted active:scale-95 transition-all">
                          Log In
                        </button>
                      </Link>
                    </div>
                 )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}