"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronDown, Loader2 } from "lucide-react";
import { useGetAllUserQuery } from "@/lib/redux/features/user/userApi";
import { useAssignIssueMutation } from "@/lib/redux/features/issues/issuesApi";
import { useGetDepartmentsQuery } from "@/lib/redux/features/dashboard/dashboardApi";
import { CATEGORIES } from "@/constants/dummy";
import { toast } from "sonner";

interface AssignIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  issueId: string;
  currentCategory?: string;
}

export const AssignIssueModal = ({ isOpen, onClose, issueId, currentCategory = "Maintenance" }: AssignIssueModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [assignedUserId, setAssignedUserId] = useState("");
  const [note, setNote] = useState("");

  const { data: deptsData } = useGetDepartmentsQuery({});
  const { data: staffData, isLoading: isStaffLoading } = useGetAllUserQuery({ role: "MAINTENANCE" });
  const [assignIssue, { isLoading: isAssigning }] = useAssignIssueMutation();

  const deptsList = Array.isArray(deptsData) ? deptsData : (deptsData?.data || []);
  const categoriesList = deptsList.length > 0 ? deptsList.map((d: any) => d.name) : CATEGORIES;

  const staffList = Array.isArray(staffData) ? staffData : (staffData?.data || []);
  const filteredStaff = staffList.filter((s: any) => s.staffRole === selectedCategory);

  useEffect(() => {
    setSelectedCategory(currentCategory);
    setAssignedUserId("");
    setNote("");
  }, [issueId, currentCategory, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignedUserId) {
      toast.error("Please select a technician to assign.");
      return;
    }

    try {
      await assignIssue({
        id: issueId,
        staffCategory: selectedCategory,
        assignedUserId,
        note: note || `Assigned to technician for resolution.`
      }).unwrap();

      toast.success("Issue assigned successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to assign issue");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Assign Maintenance Staff</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Staff Category</label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setAssignedUserId("");
                }}
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm appearance-none"
              >
                {categoriesList.map((cat: string) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* User selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Technician / Owner</label>
            <div className="relative">
              {isStaffLoading ? (
                <div className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-xs text-gray-400 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading staff...
                </div>
              ) : (
                <>
                  <select
                    value={assignedUserId}
                    onChange={(e) => setAssignedUserId(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm appearance-none"
                    required
                  >
                    <option value="">Select Technician</option>
                    {filteredStaff.map((staff: any) => (
                      <option key={staff.id || staff._id} value={staff.id || staff._id}>
                        {staff.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </>
              )}
            </div>
            {!isStaffLoading && filteredStaff.length === 0 && (
              <p className="text-[10px] text-amber-600 font-semibold mt-1">
                *No active staff members are registered under {selectedCategory} category.
              </p>
            )}
          </div>

          {/* Note input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Assignment Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Inspect guide rails, verify noise level, and report back."
              className="w-full h-24 px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm placeholder:text-gray-400 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isAssigning || !assignedUserId}
            className="w-full py-3.5 bg-[#101828] text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 mt-4 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isAssigning && <Loader2 className="w-4 h-4 animate-spin" />}
            Assign Task
          </button>
        </form>
      </div>
    </div>
  );
};
