"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useSetupPasswordMutation } from "@/lib/redux/features/auth/authApi";

function SetupPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [setupPassword, { isLoading }] = useSetupPasswordMutation();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing invitation token.");
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invitation token is missing. Please contact the administrator.");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await setupPassword({
        token,
        password: formData.newPassword,
      }).unwrap();

      toast.success("Account password configured successfully!");
      setTimeout(() => {
        router.push("/signin");
      }, 1500);
    } catch (error: any) {
      const errMsg = error?.data?.message || "Failed to configure account password. Link may have expired.";
      toast.error(errMsg);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-4 flex justify-center">
        <Link href="/">
          <Image
            src="/new-logo.png"
            alt="Logo"
            width={200}
            height={70}
            className="object-contain w-[200px]"
            priority
          />
        </Link>
      </div>

      <div className="mb-6 w-full text-center">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Configure Password</h1>
        <p className="text-sm text-gray-400">Configure password for your invited shift account</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* New Password */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 block">New Password</label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 pr-10 text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 block">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 pr-10 text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full !mt-6 rounded-xl bg-black py-6 text-sm text-white cursor-pointer flex items-center justify-center font-medium hover:bg-gray-800 transition-all"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Setting Password...
            </div>
          ) : (
            "Set Password & Continue"
          )}
        </Button>

        <div className="w-full flex justify-center mt-6">
          <Link
            href="/signin"
            className="text-xs font-bold text-blue-600 hover:text-blue-500 hover:underline"
          >
            Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function SetupPasswordPage() {
  return (
    <div className="flex h-screen bg-[#f7f8fa] items-center justify-center p-4">
      <div className="max-w-xl w-full rounded-3xl border border-violet-400 bg-white shadow-sm overflow-hidden">
        <div className="w-full p-6 lg:p-8 flex flex-col items-center justify-center">
          <Suspense fallback={<div className="text-sm text-gray-400">Loading password setup page...</div>}>
            <SetupPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
