"use client";

import React, { useMemo } from "react";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { Plus, AlertTriangle, AlertCircle, Clock, FileText, ChevronRight, Sparkles, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DUMMY_ISSUES } from "@/constants/dummy";

export default function OperatorHomePage() {
  const operatorLine = "Line 2";

  // Filter issues for operator's line (Line 2)
  const lineIssues = useMemo(() => {
    return DUMMY_ISSUES.filter(issue => issue.line === operatorLine).slice(0, 5);
  }, [operatorLine]);

  return (
    <StaffLayout category="Operators">
      <div className="p-6 space-y-6">
        
        {/* Welcome Section */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-[#101828]">Hello, Ralph</h2>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Assigned to: {operatorLine}</p>
          </div>
          <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200">
            Active Shift
          </span>
        </div>

        {/* Report Issue Button (Hero Call to Action) */}
        <Link 
          href="/operator/handoff" 
          className="flex items-center justify-between p-5 bg-[#101828] text-white rounded-2xl shadow-lg shadow-gray-100 hover:bg-gray-900 active:scale-[0.98] transition-all duration-200 group"
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
              Prioritized operational checklist & watch conditions for {operatorLine}:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Critical Risk: Electrical Panel E-03</h4>
                  <p className="text-[11px] text-gray-300 mt-0.5">Showing intermittent fault codes. Line shutdown risk is high.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <RefreshCcw className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Repeat Problem: Conveyor 2 Jamming</h4>
                  <p className="text-[11px] text-gray-300 mt-0.5">Jammed 8 times this week. Monitor transition guide closely.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Carryover Issue: Boiler pressure drop</h4>
                  <p className="text-[11px] text-gray-300 mt-0.5">Open across 3 shifts. Feeds checked; upstream issue pending.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Issues On My Line */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Recent Issues On {operatorLine}</h3>
            <Link href="/operator/history" className="text-xs font-bold text-[#2E90FA] hover:underline">View History</Link>
          </div>
          
          <div className="space-y-3">
            {lineIssues.map((issue) => (
              <div key={issue.id} className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-shadow">
                
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

                <div className="flex items-center justify-between text-xs border-t border-gray-50 pt-3">
                  <span className="text-gray-400 font-medium">{issue.carryoverAging}</span>
                  {issue.isRecurring && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      <AlertCircle className="w-3 h-3" /> Recurring
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Footer Navigation Menu */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-md h-20 bg-white border border-gray-100 rounded-[28px] shadow-2xl flex items-center p-1.5 z-[100]">
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
