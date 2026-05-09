"use client";

import React, { useState } from "react";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { Plus, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const OPERATOR_ISSUES = [
  { id: "o1", title: "Conveyor belt vibration", line: "Line 2", priority: "P2", status: "In progress" },
  { id: "o2", title: "Abnormal noise in motor", line: "Line 1", priority: "P1", status: "Open" },
];

export default function OperatorHomePage() {
  return (
    <StaffLayout category="Operator">
      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Hello, John</h2>
          <p className="text-sm text-gray-500">Report or track machine issues</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
           <Link href="/operator/report" className="flex flex-col items-center justify-center p-6 bg-[#101828] rounded-2xl text-white shadow-lg">
              <Plus className="w-8 h-8 mb-2" />
              <span className="text-sm font-bold">Report Issue</span>
           </Link>
           <div className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-700">
              <Clock className="w-8 h-8 mb-2 text-[#2E90FA]" />
              <span className="text-sm font-bold">History</span>
           </div>
        </div>

        {/* My Reported Issues */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Recent Reports</h3>
            <span className="text-xs font-bold text-[#7F56D9]">View All</span>
          </div>

          {OPERATOR_ISSUES.map((issue) => (
            <div key={issue.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white",
                    issue.priority === "P1" ? "bg-red-500" : "bg-orange-500"
                  )}>
                    {issue.priority}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{issue.title}</h4>
                    <p className="text-xs text-gray-500">{issue.line}</p>
                  </div>
               </div>
               <div className={cn(
                 "px-2 py-1 rounded-lg text-[10px] font-bold border",
                 issue.status === "Open" ? "bg-red-50 text-red-700 border-red-100" : "bg-blue-50 text-blue-700 border-blue-100"
               )}>
                 {issue.status}
               </div>
            </div>
          ))}
        </div>
      </div>
    </StaffLayout>
  );
}
