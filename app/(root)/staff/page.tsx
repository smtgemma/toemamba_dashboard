'use client'

import React, { useState, useMemo } from "react";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { Wrench, ChevronRight, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import AppPagination from "@/components/shared/Pagination";
import { DUMMY_ISSUES, PRIORITIES } from "@/constants/dummy";

const ITEMS_PER_PAGE = 3;

export default function StaffHomePage() {
  const [activeStatus, setActiveStatus] = useState("Approved");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredIssues = useMemo(() => {
    return DUMMY_ISSUES.filter((issue) => {
      const matchesStatus = activeStatus === "All" || issue.status === activeStatus;
      const matchesPriority = !priorityFilter || issue.priority === priorityFilter;
      // Filter for specific role if needed, but for now assuming dummy data is generic
      return matchesStatus && matchesPriority;
    });
  }, [activeStatus, priorityFilter]);

  const totalPages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);

  const paginatedIssues = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredIssues.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredIssues, currentPage]);

  const FILTERS = ["Approved", "In progress", "Resolved"];

  return (
    <StaffLayout category="Maintenance">
      <div className="p-6">
        {/* Task Hero Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#2E90FA] rounded-xl flex items-center justify-center">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#101828]">My Maintenance Tasks</h2>
            <p className="text-sm text-gray-500">{filteredIssues.length} active issues</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex items-center gap-2 pb-4 -mx-2 px-2 relative">
          {/* Priority Dropdown (The "All" equivalent) */}
          <div className="relative shrink-0">
            <button
              id="priority-filter-button"
              onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
              className={cn(
                "px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border transition-all h-10",
                priorityFilter
                  ? "bg-[#101828] text-white border-[#101828]"
                  : "bg-white text-gray-500 border-gray-100"
              )}
            >
              <span>{priorityFilter || "All"}</span>
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {showPriorityDropdown && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm md:bg-transparent md:backdrop-none md:absolute md:top-full md:left-0 md:mt-2 md:block">
                <div 
                  className="fixed inset-0 md:hidden" 
                  onClick={() => setShowPriorityDropdown(false)} 
                />
                <div className="w-full max-w-[280px] bg-white border border-gray-100 rounded-2xl shadow-2xl z-[70] overflow-hidden py-1 md:w-32 md:rounded-xl md:shadow-xl">
                  <div className="px-4 py-3 border-b border-gray-50 md:hidden">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Priority</p>
                  </div>
                  <button
                    onClick={() => {
                      setPriorityFilter("");
                      setShowPriorityDropdown(false);
                      setCurrentPage(1);
                    }}
                    className="w-full text-left px-5 py-4 md:px-4 md:py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 border-b border-gray-50"
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
                      className="w-full text-left px-5 py-4 md:px-4 md:py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                    >
                      Priority {p}
                    </button>
                  ))}
                  <button 
                    onClick={() => setShowPriorityDropdown(false)}
                    className="w-full py-4 text-sm font-bold text-[#7F56D9] md:hidden"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveStatus(filter);
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border shrink-0 h-10",
                  activeStatus === filter
                    ? "bg-[#101828] text-white border-[#101828]"
                    : "bg-white text-gray-500 border-gray-100"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Issues List */}
        <div className="space-y-4 mt-4 min-h-[400px]">
          {paginatedIssues.length > 0 ? (
            paginatedIssues.map((issue) => (
              <Link
                key={issue.id}
                href={`/staff/issue/${issue.id}`}
                className="block bg-[#F9FAFB]/50 border border-gray-50 rounded-2xl p-6 hover:bg-gray-50 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white",
                      issue.priority === "P1" ? "bg-[#D92D20]" :
                        issue.priority === "P2" ? "bg-[#F79009]" : "bg-[#667085]"
                    )}>
                      {issue.priority}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{issue.content}</h3>
                      <p className="text-sm text-gray-500">{issue.line}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <div className={cn(
                  "inline-flex px-4 py-1 rounded-lg border text-xs font-bold",
                  issue.status === "Approved" ? "border-[#FDB022] text-[#B54708] bg-[#FFFAEB]" :
                    issue.status === "In progress" ? "border-[#84CAFF] text-[#175CD3] bg-[#EFF8FF]" :
                      "border-[#ABEFC6] text-[#067647] bg-[#ECFDF3]"
                )}>
                  {issue.status}
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-20 bg-white border border-dashed border-gray-100 rounded-2xl">
              <p className="text-gray-400 font-medium">No issues found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <AppPagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </StaffLayout>
  );
}
