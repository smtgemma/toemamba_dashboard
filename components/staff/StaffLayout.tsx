"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/lib/getCurrentUser";
import { useRouter } from "next/navigation";

interface StaffLayoutProps {
  children: React.ReactNode;
  category?: string;
  showBack?: boolean;
  backHref?: string;
  onBack?: () => void;
}

export const StaffLayout = ({ children, category = "Maintenance", showBack, backHref, onBack }: StaffLayoutProps) => {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      const normalizedRole = user.role?.toUpperCase();
      if (category === "Operator") {
        const allowed = ["OPERATOR", "ADMIN", "SUPER_ADMIN", "SUPERVISOR"];
        if (!allowed.includes(normalizedRole)) {
          router.push("/staff");
        }
      } else {
        const allowed = ["MAINTENANCE", "STAFF", "ADMIN", "SUPER_ADMIN", "SUPERVISOR"];
        if (!allowed.includes(normalizedRole)) {
          router.push("/operator");
        }
      }
    }
  }, [user, isLoading, category, router]);

  const normalizedRole = user?.role?.toUpperCase();
  const isAuthorized = user && (
    category === "Operator"
      ? ["OPERATOR", "ADMIN", "SUPER_ADMIN", "SUPERVISOR"].includes(normalizedRole)
      : ["MAINTENANCE", "STAFF", "ADMIN", "SUPER_ADMIN", "SUPERVISOR"].includes(normalizedRole)
  );

  if (isLoading || !user || !isAuthorized) {
    return (
      <div className="min-h-screen bg-white md:bg-[#F9FAFB] flex justify-center">
        <div className="w-full max-w-4xl bg-white min-h-screen p-6 animate-pulse space-y-6">
          <header className="flex h-[80px] items-center justify-between border-b border-gray-100 mb-6">
            <div className="w-32 h-6 bg-gray-100 rounded-md" />
            <div className="w-10 h-10 bg-gray-100 rounded-full" />
          </header>
          <div className="space-y-4">
            <div className="w-48 h-8 bg-gray-200 rounded-md" />
            <div className="w-full h-32 bg-gray-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:bg-[#F9FAFB] flex justify-center">
      <div className="w-full max-w-4xl bg-white min-h-screen shadow-sm relative overflow-x-hidden">
        {/* Header */}
        <header className="px-6 py-4 flex h-[80px] items-center justify-between border-b border-gray-200 sticky top-0 bg-white z-50">
          {showBack ? (
            <div className="flex items-center gap-4">
              {onBack ? (
                <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer">
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
              ) : (
                <Link href={backHref || "/staff"} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </Link>
              )}
              <h2 className="text-xl font-bold text-gray-900">Issue Details</h2>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center gap-4">
                <Link href="/staff">
                  <Image src={'/new-logo.png'} alt="new-logo Logo" width={200} height={24} className="object-contain w-[160px]" />
                </Link>
                <div className="flex items-center gap-2 px-3 py-1 bg-[#ECFDF3] rounded-full border border-[#ABEFC6]">
                  <div className="w-2 h-2 rounded-full bg-[#12B76A]" />
                  <span className="text-xs font-bold text-[#027A48]">{category}</span>
                </div>
              </div>
              <Link href={category === "Operator" ? "/operator/profile" : "/staff/profile"}>
                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                  <Image 
                    src={user?.profilePic || "/image.png"} 
                    alt="User" 
                    width={40} 
                    height={40} 
                    className="w-full h-full object-cover"
                  />
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
