"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface StaffLayoutProps {
  children: React.ReactNode;
  category?: string;
  showBack?: boolean;
  backHref?: string;
}

export const StaffLayout = ({ children, category = "Maintenance", showBack, backHref }: StaffLayoutProps) => {
  return (
    <div className="min-h-screen bg-white md:bg-[#F9FAFB] flex justify-center">
      <div className="w-full max-w-md md:max-w-xl bg-white min-h-screen shadow-sm relative overflow-x-hidden">
        {/* Header */}
        <header className="px-6 py-4 flex h-[80px] items-center justify-between border-b border-gray-200 sticky top-0 bg-white z-50">
          {showBack ? (
            <div className="flex items-center gap-4">
              <Link href={backHref || "/staff"} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </Link>
              <h2 className="text-xl font-bold text-gray-900">Issue Details</h2>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center gap-4">
                <Link href="/staff">
                  <Image src="/logo.png" alt="Shyfty" width={80} height={24} className="h-auto w-[80px]" />
                </Link>
                <div className="flex items-center gap-2 px-3 py-1 bg-[#ECFDF3] rounded-full border border-[#ABEFC6]">
                  <div className="w-2 h-2 rounded-full bg-[#12B76A]" />
                  <span className="text-xs font-bold text-[#027A48]">{category}</span>
                </div>
              </div>
              <Link href={category === "Operator" ? "/operator/profile" : "/staff/profile"}>
                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                  <Image src="/avatar-placeholder.png" alt="User" width={40} height={40} />
                </div>
              </Link>
            </>
          )}
        </header>

        <main className="pb-20">
          {children}
        </main>
      </div>
    </div>
  );
};
