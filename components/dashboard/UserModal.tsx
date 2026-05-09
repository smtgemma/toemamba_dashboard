"use client";

import React, { useEffect, useState } from "react";
import { X, ChevronDown, Wrench, Shield, Factory, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/constants/dummy";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  staffRole: z.string().optional(),
  line: z.string().min(1, "Line is required"),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormValues) => void;
  initialData?: any;
  mode: "add" | "edit" | "view";
  isLoading?: boolean;
}

const ROLES = ["Supervisor", "Operator", "Staff"];
const LINES = ["Line 1", "Line 2", "Line 3", "Line 4", "All Areas"];

const staffRoleIcons: Record<string, any> = {
  Maintenance: Wrench,
  Safety: Shield,
  Production: Factory,
  Quality: CheckCircle,
};

export const UserModal = ({ isOpen, onClose, onSubmit, initialData, mode, isLoading }: UserModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  const selectedRole = watch("role");
  const isView = mode === "view";

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ name: "", email: "", role: "", staffRole: "", line: "" });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-gray-900">
            {mode === "add" ? "+Add user" : mode === "edit" ? "Edit user" : "View user"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">Name</label>
            <input
              {...register("name")}
              disabled={isView}
              className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-70"
              placeholder="e.g.. Line 2"
            />
            {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">Email</label>
            <input
              {...register("email")}
              disabled={isView}
              className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-70"
              placeholder="email@examole.com"
            />
            {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">Role</label>
            <div className="relative">
              <select
                {...register("role")}
                disabled={isView}
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none disabled:opacity-70"
              >
                <option value="">Select role</option>
                {ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.role && <p className="text-xs text-red-500 font-medium">{errors.role.message}</p>}
          </div>

          {selectedRole === "Staff" && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
              <label className="text-sm font-bold text-gray-900">Staff Role</label>
              <div className="relative">
                <select
                  {...register("staffRole")}
                  disabled={isView}
                  className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none disabled:opacity-70"
                >
                  <option value="">Staff roll</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">Line</label>
            <div className="relative">
              <select
                {...register("line")}
                disabled={isView}
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none disabled:opacity-70"
              >
                <option value="">e,g,. Line</option>
                {LINES.map((line) => (
                  <option key={line} value={line}>{line}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.line && <p className="text-xs text-red-500 font-medium">{errors.line.message}</p>}
          </div>

          {!isView && (
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#101828] text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 mt-4 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : mode === "add" ? "Add User" : "Save Changes"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
