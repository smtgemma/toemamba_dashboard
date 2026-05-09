"use client";

import React, { useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUSES, PRIORITIES } from "@/constants/dummy";

interface DashboardFiltersProps {
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
  activeStatus: string;
  activePriority: string;
}

export const DashboardFilters = ({
  onStatusChange,
  onPriorityChange,
  activeStatus,
  activePriority
}: DashboardFiltersProps) => {
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <h2 className="text-xl font-bold text-gray-900">Open Issues</h2>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
            className="flex items-center gap-6 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-[#101828] hover:bg-gray-50 transition-all shadow-sm"
          >
            <span>{activePriority || "All"}</span>
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {showPriorityDropdown && (
            <div className="absolute top-full left-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden py-1">
              <button
                onClick={() => {
                  onPriorityChange("");
                  setShowPriorityDropdown(false);
                }}
                className={cn(
                  "w-full text-center cursor-pointer px-4 py-2.5 text-sm font-bold border-b border-gray-50 hover:bg-gray-50",
                  !activePriority ? "text-[#101828]" : "text-[#98A2B3]"
                )}
              >
                All
              </button>
              {PRIORITIES.map((priority, index) => (
                <button
                  key={priority}
                  onClick={() => {
                    onPriorityChange(priority);
                    setShowPriorityDropdown(false);
                  }}
                  className={cn(
                    "w-full text-center cursor-pointer px-4 py-2.5 text-sm font-semibold hover:bg-gray-50",
                    activePriority === priority ? "text-[#101828]" : "text-[#98A2B3]",
                    index !== PRIORITIES.length - 1 && "border-b border-gray-50"
                  )}
                >
                  {priority}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center bg-[#F2F4F7] p-1 rounded-xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => onStatusChange("All")}
            className={cn(
              "px-4 py-2 text-xs font-semibold cursor-pointer rounded-lg whitespace-nowrap transition-all",
              activeStatus === "All"
                ? "bg-[#101828] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            All
          </button>
          {STATUSES.map((option) => (
            <button
              key={option}
              onClick={() => onStatusChange(option)}
              className={cn(
                "px-4 py-2 text-xs font-semibold cursor-pointer rounded-lg whitespace-nowrap transition-all",
                activeStatus === option
                  ? "bg-[#101828] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
