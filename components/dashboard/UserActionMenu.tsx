"use client";

import React, { useState } from "react";
import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserActionMenuProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const UserActionMenu = ({ onView, onEdit, onDelete }: UserActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreVertical className="w-5 h-5 text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden py-1">
            <button
              onClick={() => {
                onView();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4 text-gray-400" />
              View
            </button>
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Pencil className="w-4 h-4 text-gray-400" />
              Edit
            </button>
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};
