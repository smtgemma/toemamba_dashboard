"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useChangePasswordMutation } from "@/lib/redux/features/auth/authApi";
import { Eye, EyeOff } from "lucide-react";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, "Old password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export const ChangePasswordForm = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordValues) => {
    try {
      // Map body params to match backend DTO: currentPassword, newPassword, confirmPassword
      await changePassword({
        currentPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      }).unwrap();
      
      toast.success("Password changed successfully");
      reset();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm mt-8">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Security</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Old password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Old Password
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                {...register("oldPassword")}
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 pr-10 text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="text-xs text-red-500">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          {/* New password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                {...register("newPassword")}
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 pr-10 text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 pr-10 text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-[#101828] text-white font-bold rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 text-sm"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};
