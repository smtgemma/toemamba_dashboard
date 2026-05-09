"use client";

import React from "react";

import { Clock } from "lucide-react";

interface DashboardHeaderProps {
  role: string;
}

export const DashboardHeader = ({ role }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-sm text-gray-500 capitalize">{role}</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 md:gap-6">
        <div className="flex flex-col md:items-end">
          <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-500">Current Shift</span>
          <span className="text-lg md:text-xl font-bold text-gray-900">Day Shift</span>
        </div>

        <div className="hidden md:block h-10 w-[1px] bg-gray-200" />

        <div className="flex flex-col gap-1">
          <div className="flex items-center md:justify-end gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold uppercase text-emerald-500">Active</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>06:00 - 14:00 • February</span>
          </div>
        </div>
      </div>
    </div>
  );
};
