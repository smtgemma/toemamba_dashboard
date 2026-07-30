"use client";

import React, { useState, useEffect } from "react";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { 
  AlertTriangle, 
  Wrench, 
  Clock, 
  User, 
  TrendingUp, 
  CheckCircle,
  Play,
  RotateCcw,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useGetIssueByIdQuery, useUpdateIssueStatusMutation } from "@/lib/redux/features/issues/issuesApi";

export default function StaffIssueDetailsPage({ params }: { params: { id: string } }) {
  const { data: issueData, isLoading: isFetching } = useGetIssueByIdQuery(params.id);
  const [updateIssueStatus, { isLoading: isUpdating }] = useUpdateIssueStatusMutation();

  const issue = issueData?.data || issueData || null;

  const [status, setStatus] = useState("Open");
  const [note, setNote] = useState("");

  // Sync state once data loads
  useEffect(() => {
    if (issue) {
      setStatus(issue.status);
    }
  }, [issue]);

  const handleAction = async () => {
    if (!note.trim()) {
      toast.error("Please log a brief operational note before updating the state.");
      return;
    }

    try {
      await updateIssueStatus({
        id: params.id,
        status,
        note,
        isTemporaryFix: status === "Monitoring"
      }).unwrap();
      
      toast.success(`Handoff log saved! State set to ${status}.`);
      setNote("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update state.");
    }
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "report":
        return <Play className="w-3.5 h-3.5 text-blue-600" />;
      case "temp_fix":
        return <Wrench className="w-3.5 h-3.5 text-amber-600" />;
      case "handoff":
        return <RotateCcw className="w-3.5 h-3.5 text-purple-600" />;
      case "escalation":
        return <TrendingUp className="w-3.5 h-3.5 text-rose-600" />;
      case "resolution":
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-gray-600" />;
    }
  };

  const getTimelineColor = (type: string) => {
    switch (type) {
      case "report":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "temp_fix":
        return "bg-amber-50 border-amber-200 text-amber-700";
      case "handoff":
        return "bg-purple-50 border-purple-200 text-purple-700";
      case "escalation":
        return "bg-rose-50 border-rose-200 text-rose-700";
      case "resolution":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  if (isFetching) {
    return (
      <StaffLayout showBack backHref="/staff">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 text-[#101828] animate-spin" />
        </div>
      </StaffLayout>
    );
  }

  if (!issue) {
    return (
      <StaffLayout showBack backHref="/staff">
        <div className="text-center py-20 text-xs text-gray-400 font-medium">
          Issue details not found.
        </div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout showBack backHref="/staff">
      <div className="p-6 space-y-6 pb-24">
        
        {/* Main Issue Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white shrink-0 shadow-sm",
              issue.priority === "P1" ? "bg-[#D92D20]" :
              issue.priority === "P2" ? "bg-[#F79009]" : "bg-[#667085]"
            )}>
              {issue.priority}
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900 leading-snug">{issue.content}</h3>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{issue.line} • {issue.category}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-5 gap-x-4 border-t border-gray-50 pt-5 text-xs">
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Aging Status</p>
              <p className="font-bold text-gray-700">{issue.carryoverAging || "Open across 1 shift"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Area / Line</p>
              <p className="font-bold text-gray-700">{issue.line}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Priority Level</p>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  issue.priority === "P1" ? "bg-[#D92D20]" :
                  issue.priority === "P2" ? "bg-[#F79009]" : "bg-[#667085]"
                )} />
                <span className="font-bold text-gray-700">Priority {issue.priority}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Assigned Group</p>
              <p className="font-bold text-gray-700">{issue.category}</p>
            </div>
          </div>
        </div>

        {/* RECURRING PROBLEM ALERT */}
        {issue.isRecurring && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-800 uppercase tracking-widest">Recurring Pattern Surfaced</h4>
              <p className="text-sm font-semibold text-rose-900 mt-1">{issue.recurrenceText}</p>
            </div>
          </div>
        )}

        {/* ISSUE TIMELINE VIEW */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            Issue Shift Timeline
          </h4>
          
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <div className="relative border-l border-gray-100 ml-4 pl-6 space-y-6">
              {issue.timeline && issue.timeline.length > 0 ? (
                issue.timeline.map((event: any, index: number) => (
                  <div key={index} className="relative">
                    <span className={cn(
                      "absolute -left-[37px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 ring-4 ring-white",
                      getTimelineColor(event.type)
                    )}>
                      {getTimelineIcon(event.type)}
                    </span>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">
                          {event.createdAt ? new Date(event.createdAt).toLocaleDateString() : event.date}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
                          <User className="w-3 h-3 text-gray-400" /> {event.actorName || event.user}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-gray-800 mt-1 capitalize">
                        {event.type.replace("_", " ")}
                      </h5>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed bg-gray-50/50 p-2.5 rounded-xl border border-gray-50">
                        {event.note}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-400 font-medium">No timeline events logged.</div>
              )}
            </div>
          </div>
        </div>

        {/* Maintenance Action Section */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <Wrench className="w-4 h-4 text-gray-500" />
            Log Handoff Note
          </h4>
          
          <div className="space-y-2">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Provide a detailed log update. (e.g. Cleared guide rails transition jams, verified Line 2 operational continuity.)"
              className="w-full h-28 bg-white border border-gray-200 rounded-2xl p-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#101828]/10 placeholder:text-gray-400 resize-none"
            />
          </div>
        </div>

        {/* Status Selection */}
        <div className="space-y-3">
          <label className="text-xs font-black text-gray-900 uppercase tracking-widest">Update State</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {["Open", "Monitoring", "In Progress", "Resolved"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "py-2.5 rounded-xl text-xs font-bold border transition-all h-10",
                  status.toLowerCase() === s.toLowerCase()
                    ? "bg-[#101828] text-white border-[#101828] shadow-sm" 
                    : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleAction}
          disabled={isUpdating}
          className="w-full bg-[#101828] text-white py-4 rounded-2xl font-bold shadow-lg shadow-gray-100 mt-4 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
          Confirm State Change & Note
        </button>
      </div>
    </StaffLayout>
  );
}
