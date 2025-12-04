"use client";

import {
  Menu,
  Search,
  Sparkles,
  X,
  ImageIcon,
  Bell,
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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out border-b ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-border/40 shadow-sm py-2"
          : "bg-background/0 border-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Logo & Nav */}
          <div className="flex items-center gap-6 md:gap-8">
            <Link href="/" className="group flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Sparkles className="h-5 w-5 text-primary transition-transform group-hover:rotate-12" />
              </div>
              <span className="text-xl font-semibold tracking-tight">
                Artesia
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  href={item.href}
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className="relative px-3 py-1.5"
                >
                  {activeNav === item.id && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-muted rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span
                    className={`text-sm font-medium transition-colors ${
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
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden sm:block">
            <div
              className={`relative group flex items-center transition-all duration-300 rounded-full border bg-muted/40 hover:bg-muted/60 ${
                searchFocused
                  ? "bg-background shadow-lg ring-2 ring-primary/20 border-primary/50"
                  : "border-transparent"
              }`}
            >
              <Search
                className={`absolute left-4 h-4 w-4 transition-colors ${
                  searchFocused ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <input
                type="text"
                placeholder="Search incredible visuals..."
                className="w-full bg-transparent pl-11 pr-24 py-2.5 text-sm focus:outline-none placeholder:text-muted-foreground/70"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <div className="absolute right-2 flex items-center gap-1">
                <kbd className="hidden lg:inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
                <button className="p-1.5 hover:bg-background rounded-full transition-colors text-muted-foreground hover:text-foreground">
                  <ImageIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search Trigger */}
          <button className="sm:hidden p-2 hover:bg-muted rounded-full">
            <Search className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {!user && (
              <Link href="/auth" className="hidden sm:block">
                <button className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-full transition-colors">
                  Log in
                </button>
              </Link>
            )}
            
            <button className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-primary rounded-full border-2 border-background" />
            </button>

            {user ? (
              <UserProfile user={user} />
            ) : (
               <Link href="/auth">
                <button className="px-5 py-2 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 rounded-full shadow-sm hover:shadow-md transition-all">
                  Sign up
                </button>
              </Link>
            )}

            {/* Mobile Menu */}
            <div className="relative sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
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

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-t bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeNav === item.id
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="pt-4 border-t flex items-center justify-between px-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Theme
                </span>
                <ModeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
