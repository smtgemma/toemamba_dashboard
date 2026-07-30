"use client";

import React, { useMemo } from "react";
import { AlertTriangle, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetIssuesQuery } from "@/lib/redux/features/issues/issuesApi";

export const StatsCards = () => {
  const { data: issuesData } = useGetIssuesQuery({});
  const issuesList = Array.isArray(issuesData) ? issuesData : (issuesData?.data || []);

  const statsData = useMemo(() => {
    const p1Count = issuesList.filter((issue: any) => issue.priority === "P1" && issue.status !== "Resolved").length;
    const p2Count = issuesList.filter((issue: any) => issue.priority === "P2" && issue.status !== "Resolved").length;
    const p3Count = issuesList.filter((issue: any) => issue.priority === "P3" && issue.status !== "Resolved").length;
    const resolvedCount = issuesList.filter((issue: any) => issue.status === "Resolved").length;

    return [
      {
        label: "P1 CRITICAL",
        value: String(p1Count),
        icon: ShieldAlert,
        color: "text-[#D92D20]",
        bgColor: "bg-white",
        borderColor: "border-[#FDA29B]",
        iconBg: "bg-[#D92D20]",
      },
      {
        label: "P2 HIGH",
        value: String(p2Count),
        icon: AlertTriangle,
        color: "text-[#DC6803]",
        bgColor: "bg-white",
        borderColor: "border-[#FEC84B]",
        iconBg: "bg-[#FEC84B]",
      },
      {
        label: "P3 MEDIUM",
        value: String(p3Count),
        icon: AlertCircle,
        color: "text-[#475467]",
        bgColor: "bg-white",
        borderColor: "border-[#D0D5DD]",
        iconBg: "bg-[#667085]",
      },
      {
        label: "Resolved",
        value: String(resolvedCount),
        icon: CheckCircle2,
        color: "text-[#079455]",
        bgColor: "bg-white",
        borderColor: "border-[#73E2AD]",
        iconBg: "bg-[#079455]",
      },
    ];
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statsData.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            "flex items-center justify-between p-6 rounded-xl border-2 shadow-sm transition-all hover:shadow-md",
            stat.bgColor,
            stat.borderColor
          )}
        >
          <div className={cn("p-2 rounded-lg text-white", stat.iconBg)}>
            <stat.icon className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-end">
            <span className={cn("text-xs font-bold uppercase tracking-wider", stat.color)}>
              {stat.label}
            </span>
            <span className="text-3xl font-black text-gray-900 mt-1">{stat.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
