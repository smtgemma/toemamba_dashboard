"use client";

import React, { useState } from "react";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { User, Mail, Shield, LogOut, ChevronRight, Lock } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface StaffProfilePageProps {
   role: "Staff" | "Operator";
}

export default function StaffProfilePage({ role }: StaffProfilePageProps) {
   const router = useRouter();
   const [avatar, setAvatar] = useState("/avatar-placeholder.png");
   const [showPasswordForm, setShowPasswordForm] = useState(false);
   const fileInputRef = React.useRef<HTMLInputElement>(null);

   const handleLogout = () => {
      toast.success("Logged out successfully");
      router.push("/signin");
   };

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            setAvatar(reader.result as string);
            toast.success("Profile image updated locally");
         };
         reader.readAsDataURL(file);
      }
   };

   const handlePasswordSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      toast.success("Password changed successfully");
      setShowPasswordForm(false);
   };

   return (
      <StaffLayout category={role} showBack backHref={role === "Staff" ? "/staff" : "/operator"}>
         <div className="p-6 space-y-8 pb-10">
            {/* Profile Header & Image Upload */}
            <div className="flex flex-col items-center">
               <div className="relative mb-4 group">
                  <div className="w-28 h-28 rounded-full border-4 border-[#F2F4F7] overflow-hidden shadow-md relative">
                     <Image
                        src={avatar}
                        alt="Profile"
                        width={112}
                        height={112}
                        className="object-cover"
                     />
                     <div
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                     >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                     </div>
                  </div>
                  <input
                     type="file"
                     ref={fileInputRef}
                     onChange={handleImageChange}
                     className="hidden"
                     accept="image/*"
                  />
                  <div
                     onClick={() => fileInputRef.current?.click()}
                     className="absolute bottom-1 right-1 w-9 h-9 bg-[#101828] rounded-full border-2 border-white flex items-center justify-center text-white cursor-pointer hover:bg-gray-800 shadow-sm"
                  >
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                  </div>
               </div>
               <h2 className="text-xl font-bold text-gray-900">John Doe</h2>
               <p className="text-sm text-gray-500 font-medium">{role === "Staff" ? "Maintenance Technician" : "Machine Operator"}</p>
            </div>

            {/* Info Sections */}
            <div className="space-y-4">
               <div className="bg-[#F9FAFB]/80 border border-gray-100 rounded-2xl p-5 space-y-5">
                  <div className="flex items-center gap-4">
                     <div className="w-11 h-11 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 shadow-sm">
                        <User className="w-5 h-5" />
                     </div>
                     <div className="flex-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Full Name</p>
                        <p className="text-sm font-bold text-gray-700">John Doe</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 border-t border-gray-100/50 pt-5">
                     <div className="w-11 h-11 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 shadow-sm">
                        <Mail className="w-5 h-5" />
                     </div>
                     <div className="flex-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Email Address</p>
                        <p className="text-sm font-bold text-gray-700">john.doe@shyfty.com</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 border-t border-gray-100/50 pt-5">
                     <div className="w-11 h-11 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 shadow-sm">
                        <Shield className="w-5 h-5" />
                     </div>
                     <div className="flex-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Role Access</p>
                        <p className="text-sm font-bold text-gray-700 uppercase">{role}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Security Section */}
            <div className="space-y-3">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Security Settings</h3>
               <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <button
                     onClick={() => setShowPasswordForm(!showPasswordForm)}
                     className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                  >
                     <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-[#F4F3FF] flex items-center justify-center text-[#53389E]">
                           <Lock className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                           <span className="text-sm font-bold text-gray-700 block">Change Password</span>
                           <p className="text-xs text-gray-400 font-medium">Update your login credentials</p>
                        </div>
                     </div>
                     <ChevronRight className={cn("w-5 h-5 text-gray-400 transition-transform", showPasswordForm && "rotate-90")} />
                  </button>

                  {showPasswordForm && (
                     <form onSubmit={handlePasswordSubmit} className="p-5 bg-[#F9FAFB]/50 border-t border-gray-100 space-y-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-gray-600">Old Password</label>
                           <input
                              type="password"
                              className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-100 transition-all"
                              placeholder="••••••••"
                              required
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-gray-600">New Password</label>
                           <input
                              type="password"
                              className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-100 transition-all"
                              placeholder="••••••••"
                              required
                           />
                        </div>
                        <div className="space-y-2 pb-2">
                           <label className="text-xs font-bold text-gray-600">Confirm Password</label>
                           <input
                              type="password"
                              className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-100 transition-all"
                              placeholder="••••••••"
                              required
                           />
                        </div>
                        <button
                           type="submit"
                           className="w-full bg-[#101828] text-white py-3 rounded-xl text-sm font-bold shadow-md hover:bg-gray-800 transition-colors"
                        >
                           Update Password
                        </button>
                     </form>
                  )}
               </div>
            </div>

            {/* Logout */}
            <button
               onClick={handleLogout}
               className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-[#FEF3F2] border border-[#FEE4E2] text-[#B42318] font-bold hover:bg-[#FEE4E2] transition-colors shadow-sm"
            >
               <LogOut className="w-5 h-5" />
               <span>Sign Out</span>
            </button>
         </div>
      </StaffLayout>
   );
}
