"use client";

import React from "react";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { Plus, Clock, History, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function OperatorHomePage() {
  return (
    <StaffLayout category="Operators">
      <div className="p-6 space-y-10">
        {/* Welcome Section */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-[#101828]">Hello, John</h2>
          <p className="text-sm text-gray-500">Report or track machine issues</p>
        </div>

        {/* Action Buttons Hub */}
        <div className="grid grid-cols-2 gap-4">
          <Link 
            href="/operator/handoff" 
            className="group flex flex-col items-center justify-center p-8 bg-[#101828] rounded-[32px] text-white shadow-xl shadow-gray-200 active:scale-95 transition-all"
          >
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">Report Issue</span>
          </Link>

          <Link 
            href="/operator/history"
            className="group flex flex-col items-center justify-center p-8 bg-white border border-gray-100 rounded-[32px] text-gray-900 shadow-sm hover:shadow-md active:scale-95 transition-all"
          >
            <div className="w-14 h-14 bg-[#2E90FA]/10 rounded-2xl flex items-center justify-center mb-4 text-[#2E90FA] group-hover:scale-110 transition-transform">
              <Clock className="w-8 h-8" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">History</span>
          </Link>
        </div>

        {/* Recent Activity Mini-Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Recent Activity</h3>
             <Link href="/operator/history" className="text-xs font-bold text-[#2E90FA]">View All</Link>
          </div>
          
          <div className="space-y-3">
             {[
               { id: "1", title: "Conveyor belt vibration", line: "Line 2", status: "In progress", color: "bg-[#EFF8FF] text-[#175CD3]" },
               { id: "2", title: "Abnormal noise in motor", line: "Line 1", status: "Open", color: "bg-[#FEF3F2] text-[#B42318]" },
             ].map((item) => (
               <div key={item.id} className="flex items-center justify-between p-5 bg-[#F9FAFB] border border-gray-100 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400">
                        <FileText className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                        <p className="text-xs text-gray-500">{item.line}</p>
                     </div>
                  </div>
                  <div className={cn("px-3 py-1 rounded-lg text-[10px] font-bold border", item.color)}>
                     {item.status}
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Static Bottom Tabs for consistency */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-md h-20 bg-white border border-gray-100 rounded-[28px] shadow-2xl flex items-center p-1.5 z-[100]">
          <Link 
             href="/operator/handoff"
             className="flex-1 flex flex-col items-center justify-center gap-1 h-full rounded-[22px] transition-all text-gray-400 hover:text-gray-600"
          >
            <Plus className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Input</span>
          </Link>
          
          <Link 
             href="/operator/history"
             className="flex-1 flex flex-col items-center justify-center gap-1 h-full rounded-[22px] transition-all text-gray-400 hover:text-gray-600"
          >
            <History className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Review</span>
          </Link>
      </div>
    </StaffLayout>
  );
}
