"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useAddShiftMutation,
  useDeleteShiftMutation,
  useAddLineMutation,
  useDeleteLineMutation,
  useUpdateLineStatusMutation
} from "@/lib/redux/features/dashboard/dashboardApi";

export default function PlantConfigPage() {
  // Local state for demo purposes
  const [shifts, setShifts] = useState([
    { id: "s1", name: "1st Shift", start: "06:00", end: "14:00" },
    { id: "s2", name: "2nd Shift", start: "14:00", end: "22:00" },
    { id: "s3", name: "3rd Shift", start: "22:00", end: "06:00" },
  ]);

  const [lines, setLines] = useState([
    { id: "l1", name: "Line 1", status: "Active" },
    { id: "l2", name: "Line 2", status: "Active" },
    { id: "l3", name: "Line 3", status: "Active" },
    { id: "l4", name: "Line 4", status: "Inactive" },
  ]);

  const [shiftInput, setShiftInput] = useState({ name: "", start: "", end: "" });
  const [lineInput, setLineInput] = useState({ area: "", name: "" });

  const handleAddShift = () => {
    if (!shiftInput.name || !shiftInput.start || !shiftInput.end) {
      toast.error("Please fill all shift details");
      return;
    }
    const newShift = { ...shiftInput, id: `s${Date.now()}` };
    setShifts([...shifts, newShift]);
    setShiftInput({ name: "", start: "", end: "" });
    toast.success("Shift added");
  };

  const handleAddLine = () => {
    if (!lineInput.name) {
      toast.error("Please enter line name");
      return;
    }
    const newLine = { id: `l${Date.now()}`, name: lineInput.name, status: "Active" };
    setLines([...lines, newLine]);
    setLineInput({ area: "", name: "" });
    toast.success("Line added");
  };

  const toggleLineStatus = (id: string) => {
    setLines(lines.map(l =>
      l.id === id ? { ...l, status: l.status === "Active" ? "Inactive" : "Active" } : l
    ));
  };

  const deleteShift = (id: string) => {
    setShifts(shifts.filter(s => s.id !== id));
  };

  const deleteLine = (id: string) => {
    setLines(lines.filter(l => l.id !== id));
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[#101828]">Plant Configuration</h1>
        <p className="text-sm text-gray-500 mt-1">Configure shifts, areas, and production lines</p>
      </div>

      <div className="space-y-8 max-w-">
        {/* Shift Setup */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[#101828] mb-6">Shift Setup</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Shift Name</label>
              <input
                value={shiftInput.name}
                onChange={(e) => setShiftInput({ ...shiftInput, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="E.g., A Shift"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Start Time</label>
              <input
                type="time"
                value={shiftInput.start}
                onChange={(e) => setShiftInput({ ...shiftInput, start: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">End Time</label>
              <input
                type="time"
                value={shiftInput.end}
                onChange={(e) => setShiftInput({ ...shiftInput, end: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <button
            onClick={handleAddShift}
            className="bg-[#101828] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 mb-8"
          >
            <Plus className="w-4 h-4" />
            <span>Add Shift</span>
          </button>

          <div className="space-y-3">
            {shifts.map((shift) => (
              <div key={shift.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                <span className="text-sm font-bold text-gray-700">{shift.name} <span className="text-gray-400 ml-2 font-medium">{shift.start} - {shift.end}</span></span>
                <button onClick={() => deleteShift(shift.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
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
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="E.g., Plant A"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Line Name</label>
              <input
                value={lineInput.name}
                onChange={(e) => setLineInput({ ...lineInput, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="e.g., Line 1"
              />
            </div>
          </div>

          <button
            onClick={handleAddLine}
            className="bg-[#101828] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 mb-8"
          >
            <Plus className="w-4 h-4" />
            <span>Add Line</span>
          </button>

          <div className="space-y-3">
            {lines.map((line) => (
              <div key={line.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-700">{line.name}</span>
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
                    onClick={() => toggleLineStatus(line.id)}
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
                  <button onClick={() => deleteLine(line.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="bg-[#101828] text-white px-10 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
          Save Configurator
        </button>
      </div>
    </DashboardLayout>
  );
}
