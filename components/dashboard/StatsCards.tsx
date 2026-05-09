"use client";

import React from "react";
import { AlertTriangle, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "P1 CRITICAL",
    value: "10",
    icon: ShieldAlert,
    color: "text-[#D92D20]",
    bgColor: "bg-white",
    borderColor: "border-[#FDA29B]",
    iconBg: "bg-[#D92D20]",
  },
  {
    label: "P2 HIGH",
    value: "16",
    icon: AlertTriangle,
    color: "text-[#DC6803]",
    bgColor: "bg-white",
    borderColor: "border-[#FEC84B]",
    iconBg: "bg-[#FEC84B]",
  },
  {
    label: "P3 MEDIUM",
    value: "8",
    icon: AlertCircle,
    color: "text-[#475467]",
    bgColor: "bg-white",
    borderColor: "border-[#D0D5DD]",
    iconBg: "bg-[#667085]",
  },
  {
    label: "Solved",
    value: "164",
    icon: CheckCircle2,
    color: "text-[#079455]",
    bgColor: "bg-white",
    borderColor: "border-[#73E2AD]",
    iconBg: "bg-[#079455]",
  },
];

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            "flex items-center justify-between p-6 rounded-xl border-2 shadow-sm transition-all hover:shadow-md",
            stat.bgColor,
            stat.borderColor
          )}
        >
          <div className={cn("p-2 rounded-lg text-white", stat.iconBg)}>
            <stat.icon className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-end">
            <span className={cn("text-xs font-bold uppercase tracking-wider", stat.color)}>
              {stat.label}
            </span>
            <span className="text-3xl font-black text-gray-900 mt-1">{stat.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
