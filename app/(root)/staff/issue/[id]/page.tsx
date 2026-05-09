"use client";

import React, { useState } from "react";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { AlertTriangle, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function StaffIssueDetailsPage({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState("Submit");
  const [note, setNote] = useState("");

  const handleAction = () => {
    toast.success(`Action saved as ${status}`);
  };

  return (
    <StaffLayout showBack backHref="/staff">
      <div className="p-6 space-y-6">
        {/* Main Issue Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 bg-[#D92D20] rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0">
              P1
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Line 3 sensor failure</h3>
              <p className="text-sm text-gray-500">Line 3</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Detected From</p>
              <p className="text-sm font-bold text-gray-700">Shift Notes (3rd Shift)</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Area / Line</p>
              <p className="text-sm font-bold text-gray-700">Line 3</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Priority</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#D92D20]" />
                <span className="text-sm font-bold text-gray-700">P1</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Assigned Owner</p>
              <p className="text-sm font-bold text-gray-700">Maintenance</p>
            </div>
          </div>
        </div>

        {/* Issues Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#B54708]" />
            <h4 className="font-bold text-gray-900">Issues</h4>
          </div>
          <div className="bg-[#FEF3F2] border border-[#FEE4E2] rounded-2xl p-6">
            <p className="text-sm font-medium text-[#B42318] mb-4">
              Line was stopped for 40 minutes. Sensor type unclear.
            </p>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F79009]" />
              <span className="text-xs font-bold text-[#B54708]">Missing info</span>
            </div>
          </div>
        </div>

        {/* Maintenance Action Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#2E90FA]" />
            <h4 className="font-bold text-gray-900">Maintenance Action</h4>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Add Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Proximity sensor malfunction or e.g., Sensor replaced and wiring checked"
              className="w-full h-32 bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E90FA]/20 placeholder:text-gray-400 resize-none"
            />
          </div>
        </div>

        {/* Status Selection */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700">Status</label>
          <div className="grid grid-cols-3 gap-3">
            {["Submit", "In Progress", "Resolved"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "py-3 rounded-xl text-sm font-bold border transition-all",
                  status === s 
                    ? "bg-[#101828] text-white border-[#101828]" 
                    : "bg-white text-gray-500 border-gray-100"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleAction}
          className="w-full bg-[#101828] text-white py-4 rounded-2xl font-bold shadow-lg shadow-gray-200 mt-4 active:scale-95 transition-transform"
        >
          Confirm Action
        </button>
      </div>
    </StaffLayout>
  );
}
