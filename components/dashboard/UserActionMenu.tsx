"use client";

import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserActionMenuProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const UserActionMenu = ({ onView, onEdit, onDelete }: UserActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = 132; // Exact height of the 3-button menu
      const spaceBelow = window.innerHeight - rect.bottom;
      const shouldOpenUp = spaceBelow < menuHeight + 16;

      // Position absolute coordinate relative to document body
      setCoords({
        top: shouldOpenUp
          ? rect.top + window.scrollY - menuHeight - 6
          : rect.bottom + window.scrollY + 6,
        left: rect.right + window.scrollX - 160, // Align right edge of menu (160px width)
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block">
      <button 
        ref={buttonRef}
        onClick={handleToggle}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreVertical className="w-5 h-5 text-gray-500" />
      </button>

      {isOpen && typeof document !== "undefined" && createPortal(
        <>
          {/* Overlay to catch clicks and close menu */}
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Menu container positioned absolute relative to body */}
          <div 
            style={{ 
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: "160px"
            }}
            className="bg-white border border-gray-100 rounded-xl shadow-xl z-[9999] overflow-hidden py-1 animate-in fade-in duration-100"
          >
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
        </>,
        document.body
      )}
    </div>
  );
};
