"use client";

import React, { useState } from "react";
import { Pencil, Trash2, ChevronDown, Wrench, Shield, Factory, CheckCircle, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { CATEGORIES } from "@/constants/dummy";

interface IssueCardProps {
  priority: "P1" | "P2" | "P3";
  content: string;
  category?: string;
  line?: string;
  date?: string;
  status?: string;
  isNew?: boolean;
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
  priority,
  content,
  category: initialCategory = "Maintenance",
  line = "Line 2",
  date = "02,feb,2025",
  status = "Open",
  isNew = false,
}: IssueCardProps) => {
  const [isEditing, setIsEditing] = useState(isNew);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(initialCategory);
  const [textContent, setTextContent] = useState(content);

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
    // Logic to delete the issue
    setIsDeleteModalOpen(false);
    console.log("Deleting issue...");
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={cn("text-white text-[10px] font-bold px-2 py-0.5 rounded", priorityConfig[priority].color)}>
            {priorityConfig[priority].label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing && (
            <>
              <button onClick={handleEdit} className="text-gray-400 hover:text-gray-600">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={handleDelete} className="text-red-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          <Badge variant="outline" className="text-[#9E77ED] border-[#D6BBFB] bg-[#F9F5FF] font-semibold px-3">
            {status}
          </Badge>
        </div>
      </div>

      {isEditing ? (
        <div className="mb-4">
          <textarea
            className="w-full min-h-[100px] p-4 bg-[#F9FAFB] border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none transition-all"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
          <p className="text-[10px] text-red-500 mt-2 font-medium">
            *Add any missing information or unclear points for the next shift to address.
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          {textContent}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CategoryIcon className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-600">{currentCategory}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {showCategoryDropdown && (
              <div className="absolute bottom-full left-0 mb-1 w-48 bg-white border border-gray-100 rounded-lg shadow-lg z-50 py-1">
                {CATEGORIES.map((cat) => (
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

          <span className="text-xs text-gray-400">{line}</span>

          <div className="hidden sm:block h-4 w-[1px] bg-gray-200" />

          <span className="text-xs text-gray-400">{date}</span>
        </div>

        {isEditing ? (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button 
              onClick={handleCancel}
              className="w-full sm:w-auto px-5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="w-full sm:w-auto px-5 py-2 text-sm font-semibold text-white bg-[#079455] rounded-lg hover:bg-[#067647] transition-all"
            >
              Save and Approve
            </button>
          </div>
        ) : (
          <button className="text-xs font-bold text-[#2E90FA] hover:underline self-start sm:self-center">
            Show more
          </button>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
