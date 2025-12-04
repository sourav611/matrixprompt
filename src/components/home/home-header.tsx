"use client";

import {
  Menu,
  Search,
  Sparkles,
  X,
  ImageIcon,
  Bell,
  Command,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "../theme/mode-toggle";
import type { User } from "@supabase/supabase-js";
import UserProfile from "../auth/user-profile";

interface HomeHeaderProps {
  user: User | null;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: "photos-id", label: "Photos", href: "/" },
  { id: "illustrations-id", label: "Illustrations", href: "#illustrations" },
  { id: "doodle-id", label: "Doodles", href: "#doodles" },
];

export default function HomeHeader({ user }: HomeHeaderProps) {
  const [activeNav, setActiveNav] = useState("photos-id");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ease-in-out ${
        isScrolled || isMenuOpen
          ? "bg-background/80 backdrop-blur-2xl border-b border-border/40 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="h-5 w-5 text-primary transition-transform duration-500 group-hover:rotate-12" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Artesia
            </span>
          </Link>

          {/* Center: Floating Nav Island (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 rounded-full border border-border/40 bg-muted/20 p-1 backdrop-blur-md">
            {navItems.map((item) => (
              <Link
                href={item.href}
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className="relative px-4 py-1.5"
              >
                {activeNav === item.id && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-full bg-background shadow-sm"
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                  />
                )}
                <span
                  className={`relative z-10 text-sm font-medium transition-colors ${
                    activeNav === item.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right: Search & Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search Bar (Desktop) */}
            <div
              className={`hidden lg:flex items-center transition-all duration-300 ease-out rounded-full border ${
                searchFocused
                  ? "w-80 bg-background border-primary/30 ring-4 ring-primary/5"
                  : "w-64 bg-muted/30 border-transparent hover:bg-muted/50"
              }`}
            >
              <div className="pl-3 text-muted-foreground">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-full bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground/50"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <div className="pr-2">
                <kbd className="inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-50">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>

            {/* Mobile Search Trigger */}
            <button className="lg:hidden p-2 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
              <Search className="h-5 w-5" />
            </button>

            <div className="h-6 w-px bg-border/50 hidden sm:block" />

            {/* Theme & Auth Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <ModeToggle />
              </div>

              {!user && (
                <Link href="/auth" className="hidden sm:block">
                  <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Log in
                  </button>
                </Link>
              )}

              {user ? (
                <div className="flex items-center gap-3">
                  <button className="hidden sm:flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                    <Bell className="h-4 w-4" />
                  </button>
                  <UserProfile user={user} />
                </div>
              ) : (
                <Link href="/auth">
                  <button className="px-5 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 rounded-full shadow-sm shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    Sign up
                  </button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden p-2 -mr-2 hover:bg-muted/50 rounded-full text-muted-foreground hover:text-foreground transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-t border-border/40 bg-background/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="p-4 space-y-6">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeNav === item.id
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              
              <div className="space-y-4">
                <div className="px-4">
                  <div className="relative flex items-center rounded-xl border border-border/50 bg-muted/30">
                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="h-10 w-full bg-transparent pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between px-4 pt-4 border-t border-border/40">
                  <span className="text-sm font-medium text-muted-foreground">
                    Appearance
                  </span>
                  <ModeToggle />
                </div>

                {!user && (
                  <div className="grid grid-cols-2 gap-3 px-4 pb-2">
                    <Link href="/auth">
                      <button className="w-full py-2.5 text-sm font-medium border border-border rounded-xl hover:bg-muted transition-colors">
                        Log in
                      </button>
                    </Link>
                    <Link href="/auth">
                      <button className="w-full py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-colors">
                        Sign up
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
