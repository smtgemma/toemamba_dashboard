"use client";

import React, { useMemo } from "react";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { Plus, AlertTriangle, AlertCircle, Clock, FileText, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useGetIssuesQuery, useGetAiSummaryQuery } from "@/lib/redux/features/issues/issuesApi";
import { useGetMeQuery } from "@/lib/redux/features/auth/authApi";

const CardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 animate-pulse">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 w-2/3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          </div>
          <div className="h-6 bg-gray-100 rounded w-16" />
        </div>
        <div className="h-8 bg-gray-50 rounded w-full border border-gray-100/50" />
      </div>
    ))}
  </div>
);

export default function OperatorHomePage() {
  const { data: userData } = useGetMeQuery({});
  const operatorName = userData?.data?.fullName || "Operator";
  const operatorLine = userData?.data?.line || "Line 2";

  // Fetch issues for the operator's line
  const { data: issuesData, isLoading: isIssuesLoading } = useGetIssuesQuery({ line: operatorLine });
  const { data: aiSummaryData } = useGetAiSummaryQuery({ role: "OPERATOR" });

  const lineIssues = useMemo(() => {
    const rawList = Array.isArray(issuesData) ? issuesData : (issuesData?.data || []);
    return rawList.slice(0, 6);
  }, [issuesData]);

  const aiSummary = aiSummaryData?.data?.summary || "No continuity risks detected for this line. Review active items below.";
  const aiBullets = aiSummaryData?.data?.bullets || [
    "Verify parameters and clean guide rails before shift completion.",
    "Monitor conveyor belts and note mechanical deviations."
  ];

  return (
    <StaffLayout category="Operator">
      <div className="p-6 space-y-6">
        
        {/* Welcome Section */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-[#101828]">Hello, {operatorName}</h2>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Assigned to: {operatorLine}</p>
          </div>
          <span className="text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200">
            Active Shift
          </span>
        </div>

        {/* Report Issue Button - Tablet Friendly Touch Target */}
        <Link 
          href="/operator/handoff" 
          className="flex items-center justify-between p-6 bg-[#101828] text-white rounded-2xl shadow-lg shadow-gray-100 hover:bg-gray-900 active:scale-[0.98] transition-all duration-200 group min-h-[56px]"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="block text-sm font-bold uppercase tracking-wider">Report Issue</span>
              <span className="text-xs text-gray-400">File a new issue or handoff shift</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* NEXT SHIFT NEEDS TO KNOW - Hero Feature */}
        <div className="bg-gradient-to-br from-[#101828] to-[#1D2939] border border-gray-800 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-purple-500/20 text-purple-300 rounded-lg">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-purple-300">
              Next Shift Needs To Know (AI Generated)
            </h3>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-200 leading-relaxed">
              {aiSummary}
            </p>
            
            <div className="space-y-3">
              {aiBullets.map((bullet: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] text-gray-300 leading-relaxed">{bullet}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Issues On My Line */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Recent Issues On {operatorLine}</h3>
            <Link href="/operator/history" className="text-xs font-bold text-[#2E90FA] hover:underline">View History</Link>
          </div>
          
          {isIssuesLoading ? (
            <CardSkeleton />
          ) : lineIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lineIssues.map((issue: any) => (
                <div key={issue.id || issue._id} className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded text-white shrink-0",
                          issue.priority === "P1" ? "bg-[#D92D20]" :
                          issue.priority === "P2" ? "bg-[#DC6803]" : "bg-[#667085]"
                        )}>
                          {issue.priority}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{issue.content}</h4>
                      </div>
                      
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-lg text-[10px] font-bold border shrink-0",
                        issue.status === "Open" ? "border-[#FDA29B] text-[#D92D20] bg-[#FEF3F2]" :
                        issue.status === "Monitoring" ? "border-[#FEDF89] text-[#B54708] bg-[#FFFAEB]" :
                        issue.status === "In Progress" ? "border-[#84CAFF] text-[#175CD3] bg-[#EFF8FF]" :
                        "border-[#ABEFC6] text-[#067647] bg-[#ECFDF3]"
                      )}>
                        {issue.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-gray-50 pt-3 mt-4">
                    <span className="text-gray-400 font-medium">{issue.carryoverAging || "Open across 1 shift"}</span>
                    {issue.isRecurring && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                        <AlertCircle className="w-3 h-3" /> Recurring
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white border border-dashed border-gray-200 rounded-2xl">
              <p className="text-xs text-gray-400 font-medium">No recent issues found on {operatorLine}.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Footer Navigation Menu */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-lg h-20 bg-white border border-gray-100 rounded-[28px] shadow-2xl flex items-center p-1.5 z-[100]">
        <Link 
          href="/operator/handoff"
          className="flex-1 flex flex-col items-center justify-center gap-1 h-full rounded-[22px] transition-all text-gray-400 hover:text-gray-600"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Report</span>
        </Link>
        
        <Link 
          href="/operator/history"
          className="flex-1 flex flex-col items-center justify-center gap-1 h-full rounded-[22px] transition-all text-gray-400 hover:text-gray-600"
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">History</span>
        </Link>
      </div>
    </StaffLayout>
  );
}
