"use client";

import React, { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { IssueCard } from "@/components/dashboard/IssueCard";
import { DUMMY_ISSUES } from "@/constants/dummy";
import AppPagination from "@/components/shared/Pagination";

const ITEMS_PER_PAGE = 5;

export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState("Open");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Simplified role handling for now
  const role = "ADMIN";
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
