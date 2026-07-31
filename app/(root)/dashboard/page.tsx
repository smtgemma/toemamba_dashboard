"use client";

import React, { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { IssueCard } from "@/components/dashboard/IssueCard";
import AppPagination from "@/components/shared/Pagination";
import { Sparkles, Loader2 } from "lucide-react";
import { useGetIssuesQuery, useGetAiSummaryQuery } from "@/lib/redux/features/issues/issuesApi";
import { useGetMeQuery } from "@/lib/redux/features/auth/authApi";

const ITEMS_PER_PAGE = 5;

export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch logged in user details
  const { data: userData } = useGetMeQuery({});
  const role = userData?.data?.role || "ADMIN";
  const displayRole = role === "SUPERVISOR" ? "Shift Supervisor" : "System Administrator";

  // Fetch active issues
  const { data: issuesData, isLoading: isIssuesLoading } = useGetIssuesQuery({
    status: statusFilter === "All" ? undefined : statusFilter,
    priority: priorityFilter || undefined
  });

  const { data: aiSummaryData } = useGetAiSummaryQuery({ role: role });

  const issuesList = useMemo(() => {
    return Array.isArray(issuesData) ? issuesData : (issuesData?.data || []);
  }, [issuesData]);

  const totalPages = Math.ceil(issuesList.length / ITEMS_PER_PAGE);

  const paginatedIssues = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return issuesList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [issuesList, currentPage]);

  const aiSummary = aiSummaryData?.data?.summary || "No critical operational continuity risks or carryover items have been analyzed for the current shift.";
  const aiBullets = aiSummaryData?.data?.bullets || [
    "Verify active shift handoffs to see dynamic AI-generated risk reports.",
    "Review reported machine status logs and maintenance tickets in the list below."
  ];

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
            <p className="font-semibold text-gray-200">{aiSummary}</p>
            <ul className="space-y-2.5 list-none">
              {aiBullets.map((bullet: string, index: number) => (
                <li key={index} className="flex items-start gap-2.5">
                  <span className="text-rose-400 mt-0.5">⚠️</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Shift Continuity Highlights</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Open Carryover</span>
                  <span className="text-xl font-extrabold text-white mt-1 block">
                    {issuesList.filter((issue: any) => issue.status === "Open" || issue.status === "In Progress").length} Items
                  </span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Under Watch</span>
                  <span className="text-xl font-extrabold text-amber-300 mt-1 block">
                    {issuesList.filter((issue: any) => issue.status === "Monitoring" || issue.isEscalating).length} Items
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
        {isIssuesLoading ? (
          <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 text-[#101828] animate-spin" />
            <span className="text-xs text-gray-400 font-semibold">Loading plant issues...</span>
          </div>
        ) : paginatedIssues.length > 0 ? (
          paginatedIssues.map((issue: any) => (
            <IssueCard key={issue.id || issue._id} {...issue} />
          ))
        ) : (
          <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-400 font-medium">No issues found matching the criteria.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <AppPagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </DashboardLayout>
  );
}
