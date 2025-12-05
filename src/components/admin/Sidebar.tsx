"use client";

import { LayoutDashboard, Layers, LogOut, Sparkles, Settings, User, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, Variants } from "framer-motion";

export function AdminSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/manage", label: "Content", icon: Layers },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const sidebarVariants: Variants = {
    collapsed: { width: "72px", transition: { type: "spring", stiffness: 300, damping: 30 } },
    expanded: { width: "256px", transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  // Simplified text variants - no display:none, just opacity/position
  const textVariants: Variants = {
    collapsed: { opacity: 0, x: -10, pointerEvents: "none" },
    expanded: { opacity: 1, x: 0, pointerEvents: "auto", transition: { delay: 0.1, duration: 0.2 } },
  };

  return (
    <motion.aside
      initial="collapsed"
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="relative z-50 h-screen border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col shadow-xl shadow-black/5 overflow-hidden"
    >
      {/* Header / Logo */}
      <div className="h-16 flex items-center px-5 border-b border-sidebar-border/50 shrink-0 overflow-hidden">
        <div className="flex items-center gap-3 min-w-max">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-sidebar-primary to-sidebar-ring text-sidebar-primary-foreground shadow-md">
            <Sparkles size={18} fill="currentColor" className="opacity-90" />
          </div>
          <motion.div variants={textVariants} className="whitespace-nowrap">
            <span className="text-base font-bold tracking-tight text-sidebar-foreground">
              Artesia<span className="text-sidebar-primary">Flow</span>
            </span>
          </motion.div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto overflow-x-hidden scrollbar-thin">
        <div className="mb-2 px-2 overflow-hidden">
          <motion.p
            variants={textVariants}
            className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-2 whitespace-nowrap"
          >
            Menu
          </motion.p>
        </div>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 overflow-hidden ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/20"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <link.icon
                size={20}
                className={`shrink-0 transition-colors ${
                  !isActive && "group-hover:text-sidebar-foreground"
                }`}
              />
              <motion.span
                variants={textVariants}
                className="font-medium whitespace-nowrap text-sm"
              >
                {link.label}
              </motion.span>

              {/* Active Indicator for Collapsed State */}
              {!isExpanded && isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-sidebar-primary"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Section */}
      <div className="border-t border-sidebar-border p-3 shrink-0 bg-sidebar/50 backdrop-blur-sm overflow-hidden">
        <div className="flex flex-col gap-1 min-w-max">
          {/* User Profile Stub */}
          <button className="group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent/50">
            <div className="h-8 w-8 shrink-0 rounded-full bg-sidebar-accent border border-sidebar-border flex items-center justify-center overflow-hidden">
              <User size={16} className="text-sidebar-foreground/70" />
            </div>
            <motion.div
              variants={textVariants}
              className="flex flex-col items-start text-left"
            >
              <span className="text-xs font-semibold truncate w-32">
                Admin User
              </span>
              <span className="text-[10px] text-muted-foreground truncate w-32">
                admin@artesia.com
              </span>
            </motion.div>
            <motion.div variants={textVariants} className="ml-2">
              <ChevronRight
                size={14}
                className="text-muted-foreground group-hover:text-foreground"
              />
            </motion.div>
          </button>

          {/* Logout */}
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground/80 transition-all hover:bg-destructive/10 hover:text-destructive">
            <LogOut size={18} className="shrink-0" />
            <motion.span
              variants={textVariants}
              className="font-medium whitespace-nowrap text-sm"
            >
              Logout
            </motion.span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
}