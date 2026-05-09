"use client";

import React, { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { IssueCard } from "@/components/dashboard/IssueCard";
import { DUMMY_ISSUES } from "@/constants/dummy";

export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState("Open");
  const [priorityFilter, setPriorityFilter] = useState("");

  // Simplified role handling for now
  const role = "Super";
  const displayRole = "Shift Supervisor";

  const filteredIssues = useMemo(() => {
    return DUMMY_ISSUES.filter((issue) => {
      const matchesStatus = statusFilter === "All" || issue.status === statusFilter;
      const matchesPriority = !priorityFilter || issue.priority === priorityFilter;
      return matchesStatus && matchesPriority;
    });
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
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => (
            <IssueCard key={issue.id} {...issue as any} />
          ))
        ) : (
          <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-400 font-medium">No issues found matching the criteria.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
