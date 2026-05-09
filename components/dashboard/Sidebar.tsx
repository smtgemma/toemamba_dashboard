"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  UserCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "User Management",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    label: "Plant Configuration",
    href: "/dashboard/plant-config",
    icon: Settings,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: UserCircle,
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-100 p-6">
      <div className="mb-10 px-2">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo.png" // Replace with actual logo path
            alt="Shyfty"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-[#F3F4F6] text-black font-semibold shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-black" : "text-gray-400 group-hover:text-gray-600"
                )}
              />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-gray-100 pt-6">
        <button
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[#F04438] bg-[#FEF3F2] hover:bg-[#FEE4E2] transition-all duration-200"
          onClick={() => {
            // Handle logout
          }}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
};
