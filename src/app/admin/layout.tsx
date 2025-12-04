"use client";

import { ModeToggle } from "@/components/theme/mode-toggle";
import {
  LayoutDashboard,
  LogOutIcon,
  Settings,

  ImagePlus,
} from "lucide-react";
import React, { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-background flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
        className={`fixed lg:static inset-y-0 left-0 z-50 ${
          sidebarExpanded ? "w-64" : "w-20"
        } bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col`}
      >
        

        <nav className="flex-1 p-4 space-y-2">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: ImagePlus, label: "Gallery", active: false },
            { icon: Settings, label: "Settings", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <item.icon size={20} />
              {sidebarExpanded && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button className="w-full flex items-center gap-4 p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-all">
            <LogOutIcon size={20} />
            {sidebarExpanded && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
             <ModeToggle />
             <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/50" />
          </div>
        </header>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
