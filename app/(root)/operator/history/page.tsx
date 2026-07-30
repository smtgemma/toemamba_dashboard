"use client";

import React, { useState, useMemo } from "react";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { 
  Wrench, 
  ShieldAlert, 
  Box, 
  Clock,
  History as HistoryIcon,
  Plus,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useGetIssuesQuery } from "@/lib/redux/features/issues/issuesApi";
import { useGetMeQuery } from "@/lib/redux/features/auth/authApi";

const categoryIcons: Record<string, any> = {
  Maintenance: Wrench,
  Safety: ShieldAlert,
  Production: Box,
  Quality: Clock,
};

const priorityColors: Record<string, string> = {
  P1: "bg-[#D92D20]",
  P2: "bg-[#F79009]",
  P3: "bg-[#667085]",
};

export default function OperatorHistoryPage() {
  const [activeTab, setActiveTab] = useState<"Pending" | "Solved">("Pending");
  
  const { data: userData } = useGetMeQuery({});
  const operatorLine = userData?.data?.line || "Line 2";

  // Fetch issues for Operator's specific line
  const { data: issuesData, isLoading } = useGetIssuesQuery({ line: operatorLine });
  
  const issuesList = useMemo(() => {
    return Array.isArray(issuesData) ? issuesData : (issuesData?.data || []);
  }, [issuesData]);

  // Filter issues: Solved (Resolved) vs Pending (Open, In Progress, Monitoring)
  const filteredIssues = useMemo(() => {
    return issuesList.filter((issue: any) => {
      const isResolved = issue.status === "Resolved";
      return activeTab === "Pending" ? !isResolved : isResolved;
    });
  }, [issuesList, activeTab]);

  return (
    <StaffLayout category="Operators" showBack backHref="/operator">
      <div className="flex flex-col h-full bg-white relative">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 sticky top-0 bg-white z-10 px-6">
          {(["Pending", "Solved"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-4 text-sm font-bold transition-all relative",
                activeTab === tab ? "text-[#101828]" : "text-gray-400"
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#101828] animate-in fade-in" />
              )}
            </button>
          ))}
        </div>

        {/* List Content */}
        <div className="p-6 space-y-4 pb-32">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 text-[#101828] animate-spin" />
            </div>
          ) : filteredIssues.length > 0 ? (
            filteredIssues.map((issue: any) => {
              const CategoryIcon = categoryIcons[issue.category] || Wrench;
              const priorityBg = priorityColors[issue.priority] || "bg-gray-400";

              return (
                <div key={issue.id || issue._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in">
                   <div className="flex items-center justify-between">
                      <div className={cn("px-2.5 py-0.5 rounded font-bold text-white text-xs", priorityBg)}>
                         {issue.priority}
                      </div>
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-lg text-[10px] font-bold border",
                        issue.status === "Open" ? "border-[#FDA29B] text-[#D92D20] bg-[#FEF3F2]" :
                        issue.status === "Monitoring" ? "border-[#FEDF89] text-[#B54708] bg-[#FFFAEB]" :
                        issue.status === "In Progress" ? "border-[#84CAFF] text-[#175CD3] bg-[#EFF8FF]" :
                        "border-[#ABEFC6] text-[#067647] bg-[#ECFDF3]"
                      )}>
                        {issue.status}
                      </span>
                   </div>

                   <p className="text-sm font-medium text-gray-600 leading-relaxed">
                      {issue.content}
                   </p>

                   <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-4">
                      <div className="flex items-center gap-2 text-gray-400">
                         <CategoryIcon className="w-4 h-4" />
                         <span className="text-xs font-bold tracking-wide">{issue.category || "Maintenance"}</span>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{issue.carryoverAging || "Open across 1 shift"}</span>
                   </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20">
               <p className="text-gray-400 font-medium italic">No {activeTab.toLowerCase()} issues found on {operatorLine}.</p>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-md h-20 bg-white border border-gray-100 rounded-[28px] shadow-2xl flex items-center p-1.5 z-[100]">
          <Link 
             href="/operator/handoff"
             className="flex-1 flex flex-col items-center justify-center gap-1 h-full rounded-[22px] transition-all text-gray-400 hover:text-gray-600"
          >
            <Plus className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Input</span>
          </Link>
          
          <div 
             className="flex-1 flex flex-col items-center justify-center gap-1 h-full rounded-[22px] transition-all bg-[#101828] text-white"
          >
            <HistoryIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Review</span>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
