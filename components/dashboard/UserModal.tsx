"use client";

import React, { useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/constants/dummy";
import { useGetLinesQuery, useGetShiftsQuery } from "@/lib/redux/features/dashboard/dashboardApi";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  staffRole: z.string().optional(),
  line: z.string().min(1, "Line is required"),
  shift: z.string().min(1, "Shift is required"),
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

export const UserModal = ({ isOpen, onClose, onSubmit, initialData, mode, isLoading }: UserModalProps) => {
  const { data: linesData } = useGetLinesQuery({});
  const { data: shiftsData } = useGetShiftsQuery({});

  const linesList = Array.isArray(linesData) ? linesData : (linesData?.data || []);
  const shiftsList = Array.isArray(shiftsData) ? shiftsData : (shiftsData?.data || []);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  const selectedRole = watch("role");
  const isView = mode === "view";

  useEffect(() => {
    if (initialData) {
      // Map roles from backend (e.g. SUPERVISOR -> Supervisor)
      const rawRole = initialData.role || "";
      const mappedRole = rawRole.toUpperCase() === "SUPERVISOR" ? "Supervisor" :
                         rawRole.toUpperCase() === "OPERATOR" ? "Operator" :
                         rawRole.toUpperCase() === "STAFF" ? "Staff" : rawRole;

      reset({
        name: initialData.name || "",
        email: initialData.email || "",
        role: mappedRole,
        staffRole: initialData.staffRole || "",
        line: initialData.line || "",
        shift: initialData.shift || "",
      });
    } else {
      reset({ name: "", email: "", role: "", staffRole: "", line: "", shift: "" });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            {mode === "add" ? "+Add User" : mode === "edit" ? "Edit User" : "View User"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Name</label>
            <input
              {...register("name")}
              disabled={isView}
              className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm disabled:opacity-70"
              placeholder="e.g. John Doe"
            />
            {errors.name && <p className="text-[10px] text-red-500 font-semibold">{errors.name.message}</p>}
          </div>

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email</label>
            <input
              {...register("email")}
              disabled={isView}
              className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm disabled:opacity-70"
              placeholder="email@example.com"
            />
            {errors.email && <p className="text-[10px] text-red-500 font-semibold">{errors.email.message}</p>}
          </div>

          {/* Role selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Role</label>
            <div className="relative">
              <select
                {...register("role")}
                disabled={isView}
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none text-sm disabled:opacity-70"
              >
                <option value="">Select role</option>
                {ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.role && <p className="text-[10px] text-red-500 font-semibold">{errors.role.message}</p>}
          </div>

          {/* Staff Category role (only visible for Staff) */}
          {selectedRole === "Staff" && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Staff Role</label>
              <div className="relative">
                <select
                  {...register("staffRole")}
                  disabled={isView}
                  className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none text-sm disabled:opacity-70"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Line selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Line</label>
            <div className="relative">
              <select
                {...register("line")}
                disabled={isView}
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none text-sm disabled:opacity-70"
              >
                <option value="">Select Line</option>
                {linesList.map((line: any) => (
                  <option key={line.id || line._id} value={line.name}>{line.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.line && <p className="text-[10px] text-red-500 font-semibold">{errors.line.message}</p>}
          </div>

          {/* Shift selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Shift</label>
            <div className="relative">
              <select
                {...register("shift")}
                disabled={isView}
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none text-sm disabled:opacity-70"
              >
                <option value="">Select Shift</option>
                {shiftsList.map((shift: any) => (
                  <option key={shift.id || shift._id} value={shift.name}>{shift.name} ({shift.start} - {shift.end})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.shift && <p className="text-[10px] text-red-500 font-semibold">{errors.shift.message}</p>}
          </div>

          {!isView && (
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#101828] text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 mt-4 disabled:opacity-50 text-sm"
            >
              {isLoading ? "Processing..." : mode === "add" ? "Add User & Send Invite" : "Save Changes"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
