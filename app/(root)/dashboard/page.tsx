"use client";

import React, { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { IssueCard } from "@/components/dashboard/IssueCard";
import { DUMMY_ISSUES } from "@/constants/dummy";
import AppPagination from "@/components/shared/Pagination";
import { Sparkles } from "lucide-react";

const ITEMS_PER_PAGE = 5;

export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Simplified role handling for now
  const role = "SUPERVISOR";
  const displayRole = "Shift Supervisor";

  const filteredIssues = useMemo(() => {
    return DUMMY_ISSUES.filter((issue) => {
      const matchesStatus = statusFilter === "All" || issue.status === statusFilter;
      const matchesPriority = !priorityFilter || issue.priority === priorityFilter;
      return matchesStatus && matchesPriority;
    });
  }, [statusFilter, priorityFilter]);

  const totalPages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);

  const paginatedIssues = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredIssues.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredIssues, currentPage]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, priorityFilter]);

  return (
    <DashboardLayout role={role}>
      <DashboardHeader role={displayRole} />

      {/* HERO FEATURE: NEXT SHIFT NEEDS TO KNOW */}
      <div className="bg-[#101828] text-white border border-gray-800 rounded-3xl p-6 relative overflow-hidden shadow-xl mb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8 pointer-events-none" />

        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-black uppercase tracking-widest text-purple-300">
            Next Shift Needs To Know (AI Summary)
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3 text-sm text-gray-300 border-r border-gray-800/60 pr-0 lg:pr-6">
            <p className="font-semibold text-gray-200">Critical operational continuity risks & carryover items:</p>
            <ul className="space-y-2.5 list-none">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 mt-0.5">⚠️</span>
                <span><strong>Line 2 Electrical Panel</strong>: Escalating intermittent codes. Line shutdown for 10 min during shift. High risk of unexpected Line A stoppage.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-400 mt-0.5">⚙️</span>
                <span><strong>Conveyor 2 Guide Rail</strong>: Under Watch/Monitoring. Repeated mechanical failure (8 jams this week). Temporary fix no longer reliable.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-sky-400 mt-0.5">⚡</span>
                <span><strong>Line 2 Steam Line</strong>: Critical pressure drop to 4.2 bar (from 6 bar). Maintenance crew currently investigating main boiler house feed.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Shift Continuity Highlights</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Open Carryover</span>
                  <span className="text-xl font-extrabold text-white mt-1 block">
                    {DUMMY_ISSUES.filter(issue => issue.status === "Open" || issue.status === "In Progress").length} Items
                  </span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Under Watch</span>
                  <span className="text-xl font-extrabold text-amber-300 mt-1 block">
                    {DUMMY_ISSUES.filter(issue => issue.status === "Monitoring" || issue.isEscalating).length} Items
                  </span>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-gray-400 mt-4 font-semibold italic">
              *AI analysis generated from operator handoffs and maintenance updates.
            </div>
          </div>
        </div>
      </div>

      <StatsCards />

      <DashboardFilters
        activeStatus={statusFilter}
        activePriority={priorityFilter}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
      />

      <div className="space-y-4">
        {paginatedIssues.length > 0 ? (
          paginatedIssues.map((issue) => (
            <IssueCard key={issue.id} {...issue as any} />
          ))
        ) : (
          <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-400 font-medium">No issues found matching the criteria.</p>
          </div>
        )}
      </div>

      <AppPagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </DashboardLayout>
  );
}
