"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useGetShiftsQuery,
  useAddShiftMutation,
  useDeleteShiftMutation,
  useGetLinesQuery,
  useAddLineMutation,
  useUpdateLineStatusMutation,
  useDeleteLineMutation,
  useGetDepartmentsQuery,
  useAddDepartmentMutation,
  useDeleteDepartmentMutation
} from "@/lib/redux/features/dashboard/dashboardApi";

export default function PlantConfigPage() {
  // Fetch live config data
  const { data: shiftsData, isLoading: isShiftsLoading } = useGetShiftsQuery({});
  const { data: linesData, isLoading: isLinesLoading } = useGetLinesQuery({});
  const { data: deptsData, isLoading: isDeptsLoading } = useGetDepartmentsQuery({});

  // Mutations
  const [addShift] = useAddShiftMutation();
  const [deleteShift] = useDeleteShiftMutation();
  const [addLine] = useAddLineMutation();
  const [deleteLine] = useDeleteLineMutation();
  const [updateLineStatus] = useUpdateLineStatusMutation();
  const [addDept] = useAddDepartmentMutation();
  const [deleteDept] = useDeleteDepartmentMutation();

  // Inputs
  const [shiftInput, setShiftInput] = useState({ name: "", start: "", end: "" });
  const [lineInput, setLineInput] = useState({ area: "", name: "" });
  const [deptInput, setDeptInput] = useState({ name: "" });

  // Safe list parsing
  const shifts = Array.isArray(shiftsData) ? shiftsData : (shiftsData?.data || []);
  const lines = Array.isArray(linesData) ? linesData : (linesData?.data || []);
  const departments = Array.isArray(deptsData) ? deptsData : (deptsData?.data || []);

  const handleAddShift = async () => {
    if (!shiftInput.name || !shiftInput.start || !shiftInput.end) {
      toast.error("Please fill all shift details");
      return;
    }
    try {
      await addShift(shiftInput).unwrap();
      setShiftInput({ name: "", start: "", end: "" });
      toast.success("Shift added successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add shift");
    }
  };

  const handleAddLine = async () => {
    if (!lineInput.name) {
      toast.error("Please enter line name");
      return;
    }
    try {
      await addLine({
        name: lineInput.name,
        area: lineInput.area || "General"
      }).unwrap();
      setLineInput({ area: "", name: "" });
      toast.success("Line added successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add line");
    }
  };

  const handleAddDept = async () => {
    if (!deptInput.name) {
      toast.error("Please enter department name");
      return;
    }
    try {
      await addDept({ name: deptInput.name }).unwrap();
      setDeptInput({ name: "" });
      toast.success("Department added successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add department");
    }
  };

  const toggleLineStatus = async (id: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";
      await updateLineStatus({ id, status: nextStatus }).unwrap();
      toast.success(`Line status updated to ${nextStatus}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update line status");
    }
  };

  const handleDeleteShift = async (id: string) => {
    try {
      await deleteShift(id).unwrap();
      toast.success("Shift deleted");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete shift");
    }
  };

  const handleDeleteLine = async (id: string) => {
    try {
      await deleteLine(id).unwrap();
      toast.success("Line deleted");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete line");
    }
  };

  const handleDeleteDept = async (id: string) => {
    try {
      await deleteDept(id).unwrap();
      toast.success("Department deleted");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete department");
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[#101828]">Plant Configuration</h1>
        <p className="text-sm text-gray-500 mt-1">Configure shifts, departments, areas, and production lines</p>
      </div>

      <div className="space-y-8 max-w-4xl">
        {/* Shift Setup */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[#101828] mb-6">Shift Setup</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Shift Name</label>
              <input
                value={shiftInput.name}
                onChange={(e) => setShiftInput({ ...shiftInput, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                placeholder="E.g., 1st Shift"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Start Time</label>
              <input
                type="time"
                value={shiftInput.start}
                onChange={(e) => setShiftInput({ ...shiftInput, start: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">End Time</label>
              <input
                type="time"
                value={shiftInput.end}
                onChange={(e) => setShiftInput({ ...shiftInput, end: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
              />
            </div>
          </div>

          <button
            onClick={handleAddShift}
            className="bg-[#101828] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 mb-8 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Shift</span>
          </button>

          {isShiftsLoading ? (
            <div className="text-sm text-gray-400 py-2">Loading shifts...</div>
          ) : (
            <div className="space-y-3">
              {shifts.length > 0 ? (
                shifts.map((shift: any) => (
                  <div key={shift.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                    <span className="text-sm font-bold text-gray-700">{shift.name} <span className="text-gray-400 ml-2 font-medium">{shift.start} - {shift.end}</span></span>
                    <button onClick={() => handleDeleteShift(shift.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-400 font-medium">No shifts configured.</div>
              )}
            </div>
          )}
        </div>

        {/* Departments Setup */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[#101828] mb-6">Department Setup</h2>

          <div className="grid grid-cols-1 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Department Name</label>
              <input
                value={deptInput.name}
                onChange={(e) => setDeptInput({ name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                placeholder="E.g., Maintenance, Quality, Production"
              />
            </div>
          </div>

          <button
            onClick={handleAddDept}
            className="bg-[#101828] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 mb-8 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>

          {isDeptsLoading ? (
            <div className="text-sm text-gray-400 py-2">Loading departments...</div>
          ) : (
            <div className="space-y-3">
              {departments.length > 0 ? (
                departments.map((dept: any) => (
                  <div key={dept.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                    <span className="text-sm font-bold text-gray-700">{dept.name}</span>
                    <button onClick={() => handleDeleteDept(dept.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-400 font-medium">No departments configured.</div>
              )}
            </div>
          )}
        </div>

        {/* Area / Line Setup */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[#101828] mb-6">Area / Line Setup</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Area Name</label>
              <input
                value={lineInput.area}
                onChange={(e) => setLineInput({ ...lineInput, area: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                placeholder="E.g., Plant A"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Line Name</label>
              <input
                value={lineInput.name}
                onChange={(e) => setLineInput({ ...lineInput, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                placeholder="e.g., Line 5"
              />
            </div>
          </div>

          <button
            onClick={handleAddLine}
            className="bg-[#101828] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 mb-8 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Line</span>
          </button>

          {isLinesLoading ? (
            <div className="text-sm text-gray-400 py-2">Loading lines...</div>
          ) : (
            <div className="space-y-3">
              {lines.length > 0 ? (
                lines.map((line: any) => (
                  <div key={line.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-gray-700">{line.name} <span className="text-gray-400 font-medium ml-1">({line.area})</span></span>
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-bold border",
                        line.status === "Active"
                          ? "bg-[#ECFDF3] text-[#027A48] border-[#ABEFC6]"
                          : "bg-[#F2F4F7] text-[#344054] border-[#EAECF0]"
                      )}>
                        {line.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleLineStatus(line.id, line.status)}
                        className={cn(
                          "w-10 h-5 rounded-full transition-all relative p-1",
                          line.status === "Active" ? "bg-emerald-500" : "bg-gray-300"
                        )}
                      >
                        <div className={cn(
                          "w-3 h-3 bg-white rounded-full transition-all",
                          line.status === "Active" ? "translate-x-5" : "translate-x-0"
                        )} />
                      </button>
                      <button onClick={() => handleDeleteLine(line.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-400 font-medium">No production lines configured.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
