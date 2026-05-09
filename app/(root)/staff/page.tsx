"use client";

import React, { useState } from "react";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { Wrench, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const STAFF_ISSUES = [
  { id: "1", title: "Line 3 sensor failure", line: "Line 3", priority: "P1", status: "Approved" },
  { id: "2", title: "Line 3 sensor failure", line: "Line 3", priority: "P2", status: "Approved" },
  { id: "3", title: "Line 3 sensor failure", line: "Line 3", priority: "P3", status: "Approved" },
];

const FILTERS = ["All", "Approved", "In progress", "Resolved"];

export default function StaffHomePage() {
  const [activeFilter, setActiveFilter] = useState("Approved");

  return (
    <StaffLayout category="Maintenance">
      <div className="p-6">
        {/* Task Hero Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#2E90FA] rounded-xl flex items-center justify-center">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#101828]">My Maintenance Tasks</h2>
            <p className="text-sm text-gray-500">3 active issues</p>
          </div>
        </div>

        {/* Horizontal Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 -mx-2 px-2 no-scrollbar">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border",
                activeFilter === filter 
                  ? "bg-[#101828] text-white border-[#101828]" 
                  : "bg-white text-gray-500 border-gray-100"
              )}
            >
              {filter === "All" ? (
                <div className="flex items-center gap-2">
                   <span>All</span>
                   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 4H14M4.66667 8H11.3333M7.33333 12H8.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                </div>
              ) : filter}
            </button>
          ))}
        </div>

        {/* Issues List */}
        <div className="space-y-4 mt-4">
          {STAFF_ISSUES.map((issue) => (
            <Link 
              key={issue.id} 
              href={`/staff/issue/${issue.id}`}
              className="block bg-[#F9FAFB]/50 border border-gray-50 rounded-2xl p-6 hover:bg-gray-50 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white",
                    issue.priority === "P1" ? "bg-[#D92D20]" : 
                    issue.priority === "P2" ? "bg-[#F79009]" : "bg-[#667085]"
                  )}>
                    {issue.priority}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{issue.title}</h3>
                    <p className="text-sm text-gray-500">{issue.line}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <div className="inline-flex px-4 py-1 rounded-lg border border-[#FDB022] text-[#B54708] bg-[#FFFAEB] text-xs font-bold">
                {issue.status}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </StaffLayout>
  );
}
