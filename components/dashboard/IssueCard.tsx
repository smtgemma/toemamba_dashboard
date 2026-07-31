"use client";

import React, { useState } from "react";
import { 
  Pencil, 
  Trash2, 
  ChevronDown, 
  Wrench, 
  Shield, 
  Factory, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { AssignIssueModal } from "./AssignIssueModal";
import { useGetDepartmentsQuery } from "@/lib/redux/features/dashboard/dashboardApi";
import { CATEGORIES } from "@/constants/dummy";

interface IssueCardProps {
  id?: string;
  priority: "P1" | "P2" | "P3";
  content: string;
  category?: string;
  line?: string;
  date?: string;
  status?: string;
  isNew?: boolean;
  carryoverAging?: string;
  isRecurring?: boolean;
  recurrenceText?: string;
  isEscalating?: boolean;
}

const priorityConfig = {
  P1: { color: "bg-[#D92D20]", label: "P1" },
  P2: { color: "bg-[#DC6803]", label: "P2" },
  P3: { color: "bg-[#667085]", label: "P3" },
};

const categoryIcons: Record<string, any> = {
  Maintenance: Wrench,
  Safety: Shield,
  Production: Factory,
  Quality: CheckCircle,
};

export const IssueCard = ({
  id,
  priority,
  content,
  category: initialCategory = "Maintenance",
  line = "Line 2",
  date = "2026-05-21",
  status = "Open",
  isNew = false,
  carryoverAging = "Open across 1 shift",
  isRecurring = false,
  recurrenceText = "",
  isEscalating = false,
}: IssueCardProps) => {
  const [isEditing, setIsEditing] = useState(isNew);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(initialCategory);
  const [textContent, setTextContent] = useState(content);

  const { data: deptsData } = useGetDepartmentsQuery({});
  const deptsList = Array.isArray(deptsData) ? deptsData : (deptsData?.data || []);
  const categoriesList = deptsList.length > 0 ? deptsList.map((d: any) => d.name) : CATEGORIES;

  const CategoryIcon = categoryIcons[currentCategory] || Wrench;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowCategoryDropdown(false);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setIsDeleteModalOpen(false);
    console.log("Deleting issue...");
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all mb-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("text-white text-[10px] font-bold px-2 py-0.5 rounded", priorityConfig[priority].color)}>
            {priorityConfig[priority].label}
          </span>
          {isEscalating && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
              <TrendingUp className="w-3 h-3" /> Escalating
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!isEditing && (
            <>
              <button onClick={handleEdit} className="text-gray-400 hover:text-gray-600 transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={handleDelete} className="text-red-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          <span className={cn(
            "px-3 py-1 rounded-lg text-xs font-bold border",
            status === "Open" ? "border-[#FDA29B] text-[#D92D20] bg-[#FEF3F2]" :
            status === "Monitoring" ? "border-[#FEDF89] text-[#B54708] bg-[#FFFAEB]" :
            status === "In Progress" ? "border-[#84CAFF] text-[#175CD3] bg-[#EFF8FF]" :
            "border-[#ABEFC6] text-[#067647] bg-[#ECFDF3]"
          )}>
            {status}
          </span>
        </div>
      </div>

      {isEditing ? (
        <div className="mb-2">
          <textarea
            className="w-full min-h-[100px] p-4 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none transition-all"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
          <p className="text-[10px] text-red-500 mt-2 font-semibold">
            *Add any missing details, temporary watches or warnings before saving.
          </p>
        </div>
      ) : (
        <p className="text-sm font-semibold text-gray-700 leading-relaxed">
          {textContent}
        </p>
      )}

      {/* AI Surface Alert for Recurring Problems */}
      {!isEditing && isRecurring && recurrenceText && (
        <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-amber-800">{recurrenceText}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-50 pt-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              disabled={!isEditing}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium text-gray-600",
                !isEditing && "border-transparent bg-transparent pl-0 hover:bg-transparent"
              )}
            >
              <CategoryIcon className="w-4 h-4 text-gray-400" />
              <span>{currentCategory}</span>
              {isEditing && <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
            </button>

            {isEditing && showCategoryDropdown && (
              <div className="absolute bottom-full left-0 mb-1 w-48 bg-white border border-gray-100 rounded-lg shadow-lg z-50 py-1">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCurrentCategory(cat);
                      setShowCategoryDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-gray-700 flex items-center gap-2"
                  >
                    {React.createElement(categoryIcons[cat] || Wrench, { className: "w-3.5 h-3.5 text-gray-400" })}
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden sm:block h-4 w-[1px] bg-gray-200" />

          <span className="text-xs text-gray-400 font-semibold">{line}</span>

          <div className="hidden sm:block h-4 w-[1px] bg-gray-200" />

          <span className="text-xs text-gray-400 font-semibold">{carryoverAging}</span>
        </div>

        {isEditing ? (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button 
              onClick={handleCancel}
              className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-white bg-[#101828] rounded-xl hover:bg-black transition-all"
            >
              Save and Confirm
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {status === "Open" && (
              <button 
                onClick={() => setIsAssignModalOpen(true)}
                className="px-4 py-2 bg-[#101828] text-white hover:bg-gray-800 text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                Assign Staff
              </button>
            )}
            <span className="text-xs text-gray-300 font-semibold">{date}</span>
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />

      <AssignIssueModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        issueId={id || ""}
        currentCategory={currentCategory}
      />
    </div>
  );
};
