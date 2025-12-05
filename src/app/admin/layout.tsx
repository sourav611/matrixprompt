"use client";

import { ModeToggle } from "@/components/theme/mode-toggle";
import React from "react";
import { AdminSidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex overflow-hidden font-sans">
      {/* Sidebar */}
      <AdminSidebar />

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
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </main>
    </div>
  );
}
