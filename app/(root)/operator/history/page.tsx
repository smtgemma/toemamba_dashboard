"use client";

import React, { useState } from "react";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { 
  FileText, 
  CheckCircle2, 
  Wrench, 
  ShieldAlert, 
  Box, 
  Clock,
  History,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const ISSUES = [
  {
    id: "1",
    priority: "P1",
    status: "Pending",
    category: "Maintenance",
    content: "Electrical panel showing intermittent fault codes. Risk of unexpected shutdown on Line A.",
    icon: Wrench,
    color: "bg-[#D92D20]"
  },
  {
    id: "2",
    priority: "P1",
    status: "Pending",
    category: "Safety",
    content: "Electrical panel showing intermittent fault codes. Risk of unexpected shutdown on Line A.",
    icon: ShieldAlert,
    color: "bg-[#D92D20]"
  },
  {
    id: "3",
    priority: "P2",
    status: "Pending",
    category: "Production",
    content: "Electrical panel showing intermittent fault codes. Risk of unexpected shutdown on Line A.",
    icon: Box,
    color: "bg-[#F79009]"
  },
  {
    id: "4",
    priority: "P3",
    status: "Pending",
    category: "Maintenance",
    content: "Electrical panel showing intermittent fault codes. Risk of unexpected shutdown on Line A.",
    icon: Clock,
    color: "bg-[#667085]"
  },
];

export default function OperatorHistoryPage() {
  const [activeTab, setActiveTab] = useState<"Pending" | "Solved">("Pending");

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
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#101828] animate-in fade-in slide-in-from-left-2" />
              )}
            </button>
          ))}
        </div>

        {/* List Content */}
        <div className="p-6 space-y-4 pb-32">
          {ISSUES.filter(i => (activeTab === "Pending" ? i.status === "Pending" : i.status === "Solved")).map((issue) => (
            <div key={issue.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in duration-500">
               <div className="flex items-center justify-between">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-sm", issue.color)}>
                     {issue.priority}
                  </div>
                  <div className="bg-[#FFFAEB] border border-[#FEDF89] text-[#B54708] px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                     {issue.status}
                  </div>
               </div>

               <p className="text-sm font-medium text-gray-600 leading-relaxed">
                  {issue.content}
               </p>

               <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-4">
                  <div className="flex items-center gap-2 text-gray-400">
                     <issue.icon className="w-4 h-4" />
                     <span className="text-xs font-bold tracking-wide">{issue.category}</span>
                  </div>
                  <button className="text-[#2E90FA] text-xs font-bold hover:underline">
                     Show more
                  </button>
               </div>
            </div>
          ))}
          
          {ISSUES.filter(i => (activeTab === "Pending" ? i.status === "Pending" : i.status === "Solved")).length === 0 && (
            <div className="text-center py-20">
               <p className="text-gray-400 font-medium italic">No {activeTab.toLowerCase()} issues found.</p>
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
            <History className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Review</span>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
