"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: string;
}

export const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  if (isAdmin) {
    return (
      <div className="flex min-h-screen bg-[#F9FAFB]">
        {/* Sidebar for Desktop */}
        <div className="hidden lg:block sticky top-0 h-screen">
          <Sidebar />
        </div>

        {/* Sidebar for Mobile */}
        <div className={cn(
          "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
          <div className={cn(
            "absolute left-0 top-0 bottom-0 w-64 bg-white transition-transform duration-300",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <div className="absolute right-4 top-4">
               <button onClick={() => setIsSidebarOpen(false)}>
                 <X className="w-6 h-6 text-gray-500" />
               </button>
            </div>
            <Sidebar />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          {/* Mobile Header for Admin */}
          <header className="lg:hidden bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
             <Image src="/logo.png" alt="Shyfty" width={80} height={24} className="h-6 w-auto" />
             <button onClick={() => setIsSidebarOpen(true)}>
               <Menu className="w-6 h-6 text-gray-500" />
             </button>
          </header>
          
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    );
  }

  // Supervisor Layout (No Sidebar)
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <Image
          src="/logo.png"
          alt="Shyfty"
          width={100}
          height={32}
          className="h-8 w-auto"
        />
        <div className="flex items-center gap-4">
           {/* Simple Avatar for Supervisor */}
           <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
              <Image src="/avatar-placeholder.png" alt="User" width={40} height={40} />
           </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-8">
        {children}
      </main>
    </div>
  );
};
