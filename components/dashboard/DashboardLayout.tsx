"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/lib/getCurrentUser";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: string;
}

export const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const { user, isAdmin, isLoading } = useCurrentUser();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="flex min-h-screen bg-[#F9FAFB]">
        {/* Sidebar for Desktop */}
        <div className="hidden lg:block sticky top-0 h-screen">
          <Sidebar />
        </div>

        {/* Sidebar for Mobile */}
        <div
          className={cn(
            "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div
            className={cn(
              "absolute left-0 top-0 bottom-0 w-64 bg-white transition-transform duration-300",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
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
            <Image
              src={"/new-logo.png"}
              alt="new-logo Logo"
              width={200}
              height={24}
              className="object-contain w-[150px]"
            />
            <button onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6 text-gray-500" />
            </button>
          </header>

          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    );
  }

  // Supervisor Layout (No Sidebar)
  return (
    <div className="min-h-screen  bg-[#F9FAFB]">
      <header className="bg-white border-b h-20 border-gray-100 px-8 lg:px-16 py-4 flex items-center justify-between">
        <Image
          src={"/new-logo.png"}
          alt="new-logo Logo"
          width={200}
          height={24}
          className="object-contain w-[150px]"
        />
        <div className="flex items-center gap-4">
          {/* Sign Out Button for Supervisor */}
          <button
            onClick={() => {
              Cookies.remove("token");
              toast.success("Logged out successfully");
              router.push("/signin");
            }}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 bg-[#FEF3F2] border border-[#FEE4E2] hover:bg-[#FEE4E2] rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          {/* Simple Avatar for Supervisor */}
          <Link
            href="/dashboard/profile"
            className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Image
              src={user?.profilePic || "/image.png"}
              alt="User"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-8">{children}</main>
    </div>
  );
};
