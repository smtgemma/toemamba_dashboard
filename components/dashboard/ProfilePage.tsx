"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProfileImageUploader } from "./ProfileImageUploader";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { useGetMeQuery } from "@/lib/redux/features/auth/authApi";
import { useUpdateProfileMutation } from "@/lib/redux/features/user/userApi";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

export const ProfilePage = () => {
  const { data: userData, isLoading: isFetching } = useGetMeQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { register, handleSubmit, reset } = useForm({
    values: {
      fullName: userData?.data?.fullName || "",
      email: userData?.data?.email || "",
      role: userData?.data?.role || "Employee",
    }
  });

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-10">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-all">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your personal information and security settings.</p>
        </div>
        <div className="w-20" /> {/* Spacer for centering */}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Basic info</h3>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <ProfileImageUploader 
            initialImage={userData?.data?.profilePic} 
            onImageChange={setSelectedFile} 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Display Name</label>
              <input
                type="text"
                {...register("fullName")}
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Rajendra Raw"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Roll</label>
              <input
                type="text"
                {...register("role")}
                disabled
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed"
                placeholder="Employee"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Email Address</label>
              <input
                type="email"
                {...register("email")}
                disabled
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed"
                placeholder="alma.lawson@example.com"
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-8 py-3 bg-[#101828] text-white font-bold rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <ChangePasswordForm />
    </div>
  );
};
