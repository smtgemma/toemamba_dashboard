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

const DashboardLayoutSkeleton = () => (
  <div className="flex min-h-screen bg-[#F9FAFB]">
    {/* Sidebar Skeleton for Desktop */}
    <div className="hidden lg:block w-[260px] bg-white border-r border-gray-100 p-6 space-y-8 animate-pulse h-screen sticky top-0">
      <div className="w-[150px] h-6 bg-gray-100 rounded-md" />
      <div className="space-y-4 pt-10">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="flex items-center gap-3 py-3 px-4 rounded-xl bg-gray-50/50">
            <div className="w-5 h-5 bg-gray-100 rounded-md" />
            <div className="w-24 h-4 bg-gray-100 rounded-md" />
          </div>
        ))}
      </div>
    </div>

    {/* Main Content Area */}
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Header Skeleton for Mobile */}
      <header className="lg:hidden bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between animate-pulse">
        <div className="w-[150px] h-6 bg-gray-100 rounded-md" />
        <div className="w-6 h-6 bg-gray-100 rounded-full" />
      </header>

      {/* Main Body Skeleton */}
      <div className="p-6 lg:p-8 flex-1 space-y-6 animate-pulse">
        {/* Header Title placeholder */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="w-48 h-7 bg-gray-200 rounded-md" />
            <div className="w-32 h-4 bg-gray-200 rounded-md" />
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
        </div>

        {/* Content body placeholder */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="w-full h-8 bg-gray-100 rounded-xl" />
          <div className="space-y-3">
            <div className="w-full h-4 bg-gray-100 rounded-md" />
            <div className="w-5/6 h-4 bg-gray-100 rounded-md" />
            <div className="w-4/5 h-4 bg-gray-100 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const { user, isAdmin, isLoading } = useCurrentUser();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return <DashboardLayoutSkeleton />;
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
