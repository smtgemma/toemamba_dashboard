"use client";

import React, { useState, useEffect } from "react";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { 
  FileText, 
  Upload, 
  Calendar, 
  Settings, 
  ChevronRight, 
  CheckCircle2, 
  Loader2,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCcw,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

type Step = "input" | "processing" | "summary";

export default function OperatorHandoffPage() {
  const [step, setStep] = useState<Step>("input");
  const [inputMode, setInputMode] = useState<"paste" | "upload">("paste");
  const [selectedShift, setSelectedShift] = useState("1st Shift");
  const [activeBottomTab, setActiveBottomTab] = useState<"input" | "review">("input");

  // Processing state
  const [processingSteps, setProcessingSteps] = useState([
    { label: "Extracting text", status: "complete" },
    { label: "Analyzing issues", status: "complete" },
    { label: "Assigning priorities", status: "loading" },
    { label: "Validating output", status: "pending" },
  ]);

  const handleGenerate = () => {
    setStep("processing");
    // Simulate processing
    setTimeout(() => {
      setProcessingSteps(prev => prev.map(s => s.label === "Assigning priorities" ? { ...s, status: "complete" } : s === prev[3] ? { ...s, status: "loading" } : s));
    }, 1500);
    setTimeout(() => {
      setStep("summary");
    }, 3000);
  };

  const renderInput = () => (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-[#101828]">Start Shift Handoff</h2>
        <p className="text-sm text-gray-500 px-6">
          upload or paste your shift notes. We'll structure automatically.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-3 bg-gray-50/50 p-1 rounded-2xl border border-gray-100">
        <button
          onClick={() => setInputMode("paste")}
          className={cn(
            "flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
            inputMode === "paste" ? "bg-[#101828] text-white shadow-md" : "text-gray-500 hover:bg-gray-100"
          )}
        >
          <FileText className="w-4 h-4" />
          Paste Text
        </button>
        <button
          onClick={() => setInputMode("upload")}
          className={cn(
            "flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
            inputMode === "upload" ? "bg-[#101828] text-white shadow-md" : "text-gray-500 hover:bg-gray-100"
          )}
        >
          <Upload className="w-4 h-4" />
          Upload File
        </button>
      </div>

      {/* Input Area */}
      {inputMode === "paste" ? (
        <textarea
          placeholder="Paste shift notes here..."
          className="w-full h-40 bg-[#F9FAFB] border border-gray-200 rounded-2xl p-5 text-sm focus:outline-none focus:ring-2 focus:ring-[#101828]/5 transition-all resize-none placeholder:text-gray-400"
        />
      ) : (
        <div className="w-full h-40 bg-[#F9FAFB] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center space-y-3 group cursor-pointer hover:border-[#101828]/20 transition-all">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 group-hover:text-[#101828]">
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900">Upload shift notes</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-1">(Hand writing or printed)</p>
            <p className="text-xs text-gray-400 mt-2">Make sure text is clear and readable</p>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700">Shift</label>
          <div className="grid grid-cols-3 gap-3">
            {["1st Shift", "2nd Shift", "3rd Shift"].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedShift(s)}
                className={cn(
                  "py-3.5 rounded-xl text-xs font-bold border transition-all",
                  selectedShift === s ? "border-[#101828] text-[#101828] bg-white shadow-sm" : "border-gray-100 text-gray-400 bg-white"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700">Date</label>
          <div className="relative">
            <input
              type="text"
              defaultValue="02,feb,2025"
              className="w-full py-4 px-5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none"
            />
            <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700">Area/Line</label>
          <input
            type="text"
            placeholder="e.g.. Line 2"
            className="w-full py-4 px-5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:bg-white transition-colors"
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="w-full bg-[#101828] text-white py-4 rounded-2xl font-bold shadow-lg shadow-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        Generate Shift Handoff
      </button>
    </div>
  );

  const renderProcessing = () => (
    <div className="flex flex-col items-center justify-center h-[70vh] p-8 space-y-12 animate-in fade-in duration-500">
      <div className="relative">
         <div className="w-24 h-24 rounded-full border-4 border-gray-100 border-t-[#101828] animate-spin" />
      </div>

      <div className="text-center space-y-8 w-full max-w-xs">
        <h2 className="text-lg font-bold text-gray-900">Processing shift notes....</h2>
        
        <div className="space-y-3">
          {processingSteps.map((s, i) => (
            <div key={i} className={cn(
              "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
              s.status === "complete" ? "bg-[#F9FAFB] border-gray-100 text-gray-900" :
              s.status === "loading" ? "bg-white border-[#101828] text-gray-900 shadow-sm" :
              "bg-white border-transparent text-gray-300"
            )}>
              <div className="flex items-center gap-3">
                {s.status === "complete" ? <CheckCircle2 className="w-5 h-5 text-gray-900" /> :
                 s.status === "loading" ? <RefreshCcw className="w-5 h-5 animate-spin" /> :
                 <div className="w-5 h-5 rounded-full bg-gray-200" />}
                <span className="text-sm font-bold">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-sm text-gray-400">This usually takes less than 30 seconds.</p>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="p-6 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[#101828]">Shift Handoff Summary</h2>
        <p className="text-sm text-gray-500">Review the structured handoff before submission</p>
      </div>

      {/* AI Intelligence Card */}
      <div className="bg-[#F9FAFB] border border-gray-100 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#101828]" />
        <p className="text-sm font-medium text-gray-700 leading-relaxed">
          3 operational issues detected. 1 critical item requires immediate attention.
        </p>
      </div>

      {/* Issues Detected Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-gray-900">Issue</h3>
          <h3 className="text-sm font-bold text-gray-900">Priority</h3>
        </div>

        <div className="space-y-2">
          {[
            { title: "Line 2 stopped - motor failure", priority: "P1-Critical", color: "bg-[#FEF3F2] text-[#B42318] border-[#FEE4E2]" },
            { title: "Material shortage — Line 4", priority: "P2-Warning", color: "bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]" },
            { title: "Area cleanup pending", priority: "P3-Info", color: "bg-[#F9FAFB] text-[#475467] border-[#EAECF0]" },
          ].map((issue, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-50 rounded-xl shadow-sm">
              <span className="text-xs font-bold text-gray-700">{issue.title}</span>
              <div className={cn("px-2 py-1.5 rounded-lg text-[10px] font-bold border flex items-center gap-1", issue.color)}>
                {issue.priority.includes("Critical") && <AlertCircle className="w-3 h-3" />}
                {issue.priority.includes("Warning") && <AlertCircle className="w-3 h-3" />}
                {issue.priority}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checklists */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
             <CheckCircle2 className="w-5 h-5 text-gray-900" />
             <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Action Checklist</h4>
          </div>
          <div className="space-y-2">
            {["Maintenance to inspect motor (Line 2)", "Confirm material delivery ETA", "Complete housekeeping before next shift"].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-[#F9FAFB] border border-gray-100 rounded-xl">
                 <Check className="w-4 h-4 text-gray-900" />
                 <span className="text-xs font-medium text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
             <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-400 font-bold text-[10px]">?</div>
             <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Pending Questions</h4>
          </div>
          <div className="space-y-2">
            {["Was motor replacement completed?", "Has material arrived for Line 4?"].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-[#F9FAFB] border border-gray-100 rounded-xl opacity-60">
                 <div className="w-4 h-4 rounded-full border border-gray-300" />
                 <span className="text-xs font-medium text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <button 
           onClick={() => toast.success("Handoff submitted!")}
           className="w-full bg-[#101828] text-white py-4 rounded-2xl font-bold shadow-lg active:scale-[0.98] transition-all"
        >
          Submit for Supervisor Review
        </button>
        <button 
           onClick={() => setStep("input")}
           className="w-full bg-white text-gray-700 py-4 rounded-2xl font-bold border border-gray-200 active:scale-[0.98] transition-all"
        >
          Start Over
        </button>
      </div>
    </div>
  );

  return (
    <StaffLayout category="Operators" showBack={step !== "input"} onBack={() => setStep("input")}>
      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {step === "input" && renderInput()}
        {step === "processing" && renderProcessing()}
        {step === "summary" && renderSummary()}
      </div>

      {/* Bottom Navigation */}
      {step !== "processing" && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-md h-20 bg-white border border-gray-100 rounded-[28px] shadow-2xl flex items-center p-1.5 z-[100]">
          <button 
             onClick={() => {
               setActiveBottomTab("input");
               setStep("input");
             }}
             className={cn(
               "flex-1 flex flex-col items-center justify-center gap-1 h-full rounded-[22px] transition-all",
               activeBottomTab === "input" ? "bg-[#101828] text-white" : "text-gray-400 hover:text-gray-600"
             )}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Input</span>
          </button>
          
          <button 
             onClick={() => {
               setActiveBottomTab("review");
               router.push("/operator"); // Go to the dashboard list
             }}
             className={cn(
               "flex-1 flex flex-col items-center justify-center gap-1 h-full rounded-[22px] transition-all",
               activeBottomTab === "review" ? "bg-[#101828] text-white" : "text-gray-400 hover:text-gray-600"
             )}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Review</span>
          </button>
        </div>
      )}
    </StaffLayout>
  );
}
