"use client";

import React, { useState, useMemo } from "react";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { 
  Wrench, 
  ChevronRight, 
  SlidersHorizontal, 
  AlertTriangle, 
  Clock, 
  Sparkles,
  AlertCircle,
  Activity,
  History,
  TrendingUp,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import AppPagination from "@/components/shared/Pagination";
import { DUMMY_ISSUES, PRIORITIES } from "@/constants/dummy";

const ITEMS_PER_PAGE = 3;

export default function StaffHomePage() {
  const [activeStatus, setActiveStatus] = useState("Open");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Status List matching the client's new flow
  const STATUS_FLOW = ["Open", "Monitoring", "In Progress", "Resolved"];

  // 1. Filtered issues based on Status & Priority
  const filteredIssues = useMemo(() => {
    return DUMMY_ISSUES.filter((issue) => {
      const matchesStatus = activeStatus === "All" || issue.status.toLowerCase() === activeStatus.toLowerCase();
      const matchesPriority = !priorityFilter || issue.priority === priorityFilter;
      return matchesStatus && matchesPriority;
    });
  }, [activeStatus, priorityFilter]);

  const totalPages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);

  const paginatedIssues = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredIssues.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredIssues, currentPage]);

  // 2. Carryover & Open Issues (all issues with status Open or In Progress)
  const carryoverIssues = useMemo(() => {
    return DUMMY_ISSUES.filter(issue => issue.status === "Open" || issue.status === "In Progress");
  }, []);

  // 3. Escalating & Monitoring Issues (status Monitoring or marked as escalating)
  const watchIssues = useMemo(() => {
    return DUMMY_ISSUES.filter(issue => issue.status === "Monitoring" || issue.isEscalating);
  }, []);

  // 4. Recurring Problems list
  const recurringProblems = useMemo(() => {
    return DUMMY_ISSUES.filter(issue => issue.isRecurring);
  }, []);

  return (
    <StaffLayout category="Maintenance">
      <div className="p-6 space-y-8 pb-24">
        
        {/* Header Widget */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-[#101828] rounded-xl flex items-center justify-center text-white">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#101828]">Operational Issues</h2>
            <p className="text-sm text-gray-500">{carryoverIssues.length} active carryover items</p>
          </div>
        </div>

        {/* HERO FEATURE: NEXT SHIFT NEEDS TO KNOW */}
        <div className="bg-[#101828] text-white border border-gray-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-black uppercase tracking-widest text-purple-300">
              Next Shift Needs To Know (AI Summary)
            </h3>
          </div>

          <div className="space-y-3 text-sm text-gray-300">
            <p className="font-semibold text-gray-200">Summary of risks, watches & repeat occurrences:</p>
            <ul className="space-y-2 list-none">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 mt-0.5">⚠️</span>
                <span><strong>Boiler pressure drop</strong> is open across 3 shifts; feeds checked, upstream feeds require boiler house investigation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-400 mt-0.5">⚙️</span>
                <span><strong>Conveyor 2 Guide Rail</strong> is under Watch/Monitoring status due to repeat jam occurrences.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-sky-400 mt-0.5">⚡</span>
                <span><strong>Panel E-03</strong> is escalating with frequent intermittent codes; high risk of unexpected Line A shutdown.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* AI RECURRING ISSUE DETECTION ALERTS */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            Surfaced Recurring Patterns
          </h3>
          
          <div className="space-y-3">
            {recurringProblems.map((problem) => (
              <div 
                key={problem.id} 
                className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-start gap-3"
              >
                <div className="p-2 bg-rose-100 text-rose-700 rounded-lg mt-0.5">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-rose-800 uppercase tracking-wider">Recurring Pattern</h4>
                  <p className="text-sm font-semibold text-rose-900 mt-1">{problem.recurrenceText}</p>
                  <p className="text-xs text-rose-600/80 mt-0.5">Surfaced automatically across multiple shifts.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN LIST WITH FILTERS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">All Issues Log</h3>
          </div>

          {/* Filters Section */}
          <div className="flex items-center gap-2 pb-2 overflow-x-auto no-scrollbar">
            {/* Priority Button */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all h-9 bg-white text-gray-500 border-gray-100",
                  priorityFilter && "bg-[#101828] text-white border-[#101828]"
                )}
              >
                <span>{priorityFilter || "All Priorities"}</span>
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>

              {showPriorityDropdown && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/25 backdrop-blur-sm md:absolute md:inset-auto md:top-full md:left-0 md:mt-2 md:block">
                  <div className="fixed inset-0 md:hidden" onClick={() => setShowPriorityDropdown(false)} />
                  <div className="w-full max-w-[280px] bg-white border border-gray-100 rounded-2xl shadow-2xl z-[70] overflow-hidden py-1 md:w-36 md:rounded-xl">
                    <button
                      onClick={() => {
                        setPriorityFilter("");
                        setShowPriorityDropdown(false);
                        setCurrentPage(1);
                      }}
                      className="w-full text-left px-5 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50"
                    >
                      All Priorities
                    </button>
                    {PRIORITIES.map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setPriorityFilter(p);
                          setShowPriorityDropdown(false);
                          setCurrentPage(1);
                        }}
                        className="w-full text-left px-5 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 border-t border-gray-50"
                      >
                        Priority {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1.5">
              {STATUS_FLOW.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setActiveStatus(status);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 h-9",
                    activeStatus.toLowerCase() === status.toLowerCase()
                      ? "bg-[#101828] text-white border-[#101828]"
                      : "bg-white text-gray-500 border-gray-100"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Issues List */}
          <div className="space-y-3">
            {paginatedIssues.length > 0 ? (
              paginatedIssues.map((issue) => (
                <Link
                  key={issue.id}
                  href={`/staff/issue/${issue.id}`}
                  className="block bg-white border border-gray-100 rounded-2xl p-5 hover:bg-gray-50/50 transition-all shadow-sm relative group"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0",
                        issue.priority === "P1" ? "bg-[#D92D20]" :
                        issue.priority === "P2" ? "bg-[#F79009]" : "bg-[#667085]"
                      )}>
                        {issue.priority}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 group-hover:text-black line-clamp-1 pr-4">
                          {issue.content}
                        </h4>
                        <p className="text-xs text-gray-400 font-semibold">{issue.line} • {issue.category}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>

                  <div className="flex flex-wrap gap-2 items-center justify-between border-t border-gray-50 pt-3 mt-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-lg text-[10px] font-bold border",
                        issue.status === "Open" ? "border-[#FDA29B] text-[#D92D20] bg-[#FEF3F2]" :
                        issue.status === "Monitoring" ? "border-[#FEDF89] text-[#B54708] bg-[#FFFAEB]" :
                        issue.status === "In Progress" ? "border-[#84CAFF] text-[#175CD3] bg-[#EFF8FF]" :
                        "border-[#ABEFC6] text-[#067647] bg-[#ECFDF3]"
                      )}>
                        {issue.status}
                      </span>
                      <span className="text-gray-400 font-medium">{issue.carryoverAging}</span>
                    </div>

                    {issue.isEscalating && (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-rose-100">
                        <TrendingUp className="w-3 h-3" /> Escalating
                      </span>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl">
                <p className="text-gray-400 text-sm font-semibold">No issues found matching criteria</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-2">
              <AppPagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>

        {/* SHIFT TIMELINE LOG */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <History className="w-4 h-4 text-gray-500" />
            Shift timeline / issue log
          </h3>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="relative border-l border-gray-100 ml-3 pl-6 space-y-6">
              
              <div className="relative">
                <span className="absolute -left-[31px] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 ring-4 ring-white" />
                <div className="text-xs text-gray-400 font-bold">Today, 06:45 • 1st Shift</div>
                <h4 className="text-sm font-bold text-gray-800 mt-1">Issue Escalated (Line 2 Electrical Panel)</h4>
                <p className="text-xs text-gray-500 mt-0.5">Critical: Intermittent code frequency increased. Line shut down for 10 min.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 ring-4 ring-white" />
                <div className="text-xs text-gray-400 font-bold">Yesterday, 14:00 • 2nd Shift</div>
                <h4 className="text-sm font-bold text-gray-800 mt-1">Temporary Fix Applied (Line 1 Motor hum)</h4>
                <p className="text-xs text-gray-500 mt-0.5">Adjusted motor mounts. Vibration reduced. Put on Watch/Monitoring status.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#2E90FA] ring-4 ring-white" />
                <div className="text-xs text-gray-400 font-bold">Yesterday, 11:30 • 2nd Shift</div>
                <h4 className="text-sm font-bold text-gray-800 mt-1">Issue Resolved (Line 4 Oil Leak)</h4>
                <p className="text-xs text-gray-500 mt-0.5">Replaced seals, topped up hydraulic fluid. Verified leak stopped.</p>
              </div>
              
            </div>
          </div>
        </div>

      </div>
    </StaffLayout>
  );
}
