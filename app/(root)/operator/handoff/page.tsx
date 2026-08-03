"use client";

import React, { useState, useEffect, useRef } from "react";
import { StaffLayout } from "@/components/staff/StaffLayout";
import { 
  FileText, 
  Upload, 
  Mic,
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  Loader2,
  AlertCircle,
  Clock,
  RefreshCcw,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAnalyzeIssueMutation, useSubmitIssueMutation } from "@/lib/redux/features/issues/issuesApi";
import { useGetLinesQuery, useGetShiftsQuery } from "@/lib/redux/features/dashboard/dashboardApi";
import { useGetMeQuery } from "@/lib/redux/features/auth/authApi";

type Step = "input" | "processing" | "summary";

export default function OperatorHandoffPage() {
  const router = useRouter();
  const { data: userData } = useGetMeQuery({});
  const { data: linesData } = useGetLinesQuery({});
  const { data: shiftsData } = useGetShiftsQuery({});

  const linesList = Array.isArray(linesData) ? linesData : (linesData?.data || []);
  const shiftsList = Array.isArray(shiftsData) ? shiftsData : (shiftsData?.data || []);

  const [analyzeIssue] = useAnalyzeIssueMutation();
  const [submitIssue, { isLoading: isSubmitting }] = useSubmitIssueMutation();

  const [step, setStep] = useState<Step>("input");
  const [inputMode, setInputMode] = useState<"paste" | "voice" | "image">("paste");
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedLine, setSelectedLine] = useState("");
  const [formattedDate, setFormattedDate] = useState("2026-07-30");

  const [activeBottomTab, setActiveBottomTab] = useState<"input" | "review">("input");

  // Input states
  const [textNotes, setTextNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transcribedText, setTranscribedText] = useState("");

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Response Data
  const [aiData, setAiData] = useState<any>(null);

  // Auto-fill Operator settings
  useEffect(() => {
    if (userData?.data?.lineId) {
      setSelectedLine(userData.data.lineId);
    } else if (userData?.data?.line) {
      const matchedLine = linesList.find((l: any) => l.name === userData.data.line || l.id === userData.data.line || l._id === userData.data.line);
      if (matchedLine) {
        setSelectedLine(matchedLine.id || matchedLine._id);
      } else {
        setSelectedLine(userData.data.line);
      }
    } else if (linesList.length > 0) {
      setSelectedLine(linesList[0].id || linesList[0]._id);
    }

    if (userData?.data?.shiftId) {
      setSelectedShift(userData.data.shiftId);
    } else if (userData?.data?.shift) {
      const matchedShift = shiftsList.find((s: any) => s.name === userData.data.shift || s.id === userData.data.shift || s._id === userData.data.shift);
      if (matchedShift) {
        setSelectedShift(matchedShift.id || matchedShift._id);
      } else {
        setSelectedShift(userData.data.shift);
      }
    } else if (shiftsList.length > 0) {
      setSelectedShift(shiftsList[0].id || shiftsList[0]._id);
    }

    // Set today's date
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    setFormattedDate(`${yyyy}-${mm}-${dd}`);
  }, [userData, linesList, shiftsList]);

  // Stop recording if switching tabs
  useEffect(() => {
    if (inputMode !== "voice" && isRecording) {
      if (mediaRecorder) {
        try {
          mediaRecorder.stop();
          mediaRecorder.stream.getTracks().forEach((track) => track.stop());
        } catch (e) {
          console.error("Error stopping recorder on tab change:", e);
        }
      }
      setIsRecording(false);
    }
  }, [inputMode, isRecording, mediaRecorder]);

  // Audio Recording API
  const handleToggleRecord = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        let chunks: Blob[] = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: "audio/wav" });
          const audioFile = new File([audioBlob], "voice-note.wav", { type: "audio/wav" });
          setSelectedFile(audioFile);
          setTranscribedText("Voice recording attached successfully.");
          toast.success("Voice recording captured!");
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
        toast.info("Recording voice note...");
      } catch (err) {
        toast.error("Microphone access denied or not supported.");
      }
    } else {
      if (mediaRecorder) {
        mediaRecorder.stop();
        setIsRecording(false);
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`Attached photo: ${file.name}`);
    }
  };

  const handleGenerate = async () => {
    if (inputMode === "paste" && !textNotes.trim()) {
      toast.error("Please enter shift notes first.");
      return;
    }
    if (inputMode !== "paste" && !selectedFile) {
      toast.error("Please capture voice or upload file first.");
      return;
    }
    if (!selectedLine) {
      toast.error("Please configure/select a production line.");
      return;
    }

    setStep("processing");

    try {
      let payload: any;
      if (inputMode === "paste") {
        payload = {
          type: "text",
          line: selectedLine,
          shift: selectedShift,
          content: textNotes
        };
      } else {
        const formData = new FormData();
        formData.append("type", inputMode);
        formData.append("line", selectedLine);
        formData.append("shift", selectedShift);
        if (selectedFile) {
          formData.append("file", selectedFile);
        }
        payload = formData;
      }

      const res = await analyzeIssue(payload).unwrap();
      setAiData(res.data);
      setStep("summary");
      toast.success("AI analysis completed successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "AI parsing failed. Please check files or input text.");
      setStep("input");
    }
  };

  const handleSubmitHandoff = async () => {
    if (!aiData) return;
    try {
      const issuesList = aiData.detectedIssues || [];
      const primaryIssue = issuesList[0];
      const priorityVal = primaryIssue ? primaryIssue.priority : "P3";

      await submitIssue({
        content: aiData.extractedText || textNotes || "Operator shift notes",
        priority: priorityVal,
        category: "Maintenance", 
        line: selectedLine,
        shift: selectedShift,
        date: formattedDate,
        aiAnalysis: {
          summary: aiData.summary || "Shift report summary",
          checklist: aiData.checklist || [],
          pendingQuestions: aiData.pendingQuestions || []
        }
      }).unwrap();

      toast.success("Shift handoff submitted successfully!");
      router.push("/operator");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit handoff");
    }
  };

  const renderInput = () => (
    <div className="p-6 space-y-6 animate-in fade-in duration-300">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-[#101828]">Start Shift Handoff</h2>
        <p className="text-xs text-gray-500 px-4">
          Upload or capture your shift notes. The AI assistant will structure and categorize them automatically.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-3 gap-2 bg-gray-50/50 p-1 rounded-2xl border border-gray-100">
        <button
          onClick={() => { setInputMode("paste"); setSelectedFile(null); }}
          className={cn(
            "flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all",
            inputMode === "paste" ? "bg-[#101828] text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"
          )}
        >
          <FileText className="w-4 h-4" />
          Text
        </button>
        <button
          onClick={() => { setInputMode("voice"); setSelectedFile(null); }}
          className={cn(
            "flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all",
            inputMode === "voice" ? "bg-[#101828] text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"
          )}
        >
          <Mic className="w-4 h-4" />
          Voice
        </button>
        <button
          onClick={() => { setInputMode("image"); setSelectedFile(null); }}
          className={cn(
            "flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all",
            inputMode === "image" ? "bg-[#101828] text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"
          )}
        >
          <Upload className="w-4 h-4" />
          Photo/OCR
        </button>
      </div>

      {/* Input Area */}
      {inputMode === "paste" ? (
        <textarea
          value={textNotes}
          onChange={(e) => setTextNotes(e.target.value)}
          placeholder="Type or paste shift notes here..."
          className="w-full h-40 bg-[#F9FAFB] border border-gray-200 rounded-2xl p-5 text-sm focus:outline-none focus:ring-2 focus:ring-[#101828]/5 transition-all resize-none placeholder:text-gray-400"
        />
      ) : inputMode === "voice" ? (
        <div className="w-full min-h-[160px] bg-[#F9FAFB] border border-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center space-y-6">
          {transcribedText ? (
            <div className="w-full space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-gray-400">Captured Recording</span>
                  <button onClick={() => { setTranscribedText(""); setSelectedFile(null); }} className="text-[10px] font-bold text-red-500">Reset</button>
               </div>
               <p className="text-sm font-semibold text-gray-700 leading-relaxed italic">"{transcribedText}"</p>
            </div>
          ) : (
            <>
              <button 
                onClick={handleToggleRecord}
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
                  isRecording 
                    ? "bg-red-500 text-white animate-pulse scale-110 shadow-red-200" 
                    : "bg-[#101828] text-white hover:scale-105 shadow-gray-200"
                )}
              >
                <Mic className={cn("w-6 h-6", isRecording && "animate-bounce")} />
              </button>
              <p className="text-xs font-bold text-gray-900">
                {isRecording ? "Listening... Tap to save recording" : "Tap to record voice notes"}
              </p>
            </>
          )}
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-40 bg-[#F9FAFB] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center space-y-3 group cursor-pointer hover:border-[#101828]/20 transition-all p-4"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 group-hover:text-[#101828]">
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900">
              {selectedFile ? selectedFile.name : "Upload notes photo"}
            </p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-1">Supports PNG, JPG, or PDF scans</p>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Line</label>
          <div className="relative">
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none text-sm appearance-none"
            >
              <option value="">Select Line</option>
              {linesList.map((line: any) => (
                <option key={line.id || line._id} value={line.id || line._id}>{line.name}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Shift</label>
          <div className="grid grid-cols-3 gap-2">
            {shiftsList.length > 0 ? (
              shiftsList.map((s: any) => (
                <button
                  key={s.id || s._id}
                  type="button"
                  onClick={() => setSelectedShift(s.id || s._id)}
                  className={cn(
                    "py-3 px-2 rounded-xl text-xs font-bold border transition-all h-10 truncate cursor-pointer",
                    selectedShift === (s.id || s._id) ? "border-[#101828] text-[#101828] bg-white shadow-sm font-black" : "border-gray-100 text-gray-400 bg-white hover:bg-gray-50"
                  )}
                >
                  {s.name}
                </button>
              ))
            ) : (
              <div className="col-span-3 text-center text-xs text-gray-400 font-medium">Loading shifts...</div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Date</label>
          <div className="relative">
            <input
              type="date"
              value={formattedDate}
              onChange={(e) => setFormattedDate(e.target.value)}
              className="w-full py-3 px-4 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="w-full bg-[#101828] text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
      >
        Generate Shift Handoff
      </button>
    </div>
  );

  const renderProcessing = () => (
    <div className="flex flex-col items-center justify-center h-[70vh] p-8 space-y-8 animate-in fade-in duration-300">
      <div className="relative">
         <Loader2 className="w-16 h-16 text-[#101828] animate-spin" />
      </div>

      <div className="text-center space-y-4 w-full max-w-xs">
        <h2 className="text-base font-bold text-gray-900">Analyzing shift handoff notes...</h2>
        <div className="space-y-2 text-xs text-gray-400 font-medium">
          <p>Analyzing parameters, extracting downtime events, and prioritizing carryover alerts.</p>
        </div>
      </div>
    </div>
  );

  const renderSummary = () => {
    if (!aiData) return null;

    const issues = aiData.detectedIssues || [];
    const checklist = aiData.checklist || [];
    const questions = aiData.pendingQuestions || [];

    return (
      <div className="p-6 space-y-6 animate-in slide-in-from-bottom-4 duration-300">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#101828]">Shift Handoff Summary</h2>
          <p className="text-xs text-gray-500">Review detected structural items</p>
        </div>

        {/* AI Summary Banner */}
        <div className="bg-[#F9FAFB] border-l-4 border-[#101828] rounded-r-2xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-700 leading-relaxed">
            {aiData.summary || "No critical carryover risks found."}
          </p>
        </div>

        {/* Extracted Text */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Raw Transcription</h3>
          <p className="text-xs bg-[#F9FAFB] p-3 rounded-xl border border-gray-100 text-gray-500 leading-relaxed max-h-24 overflow-y-auto italic">
            "{aiData.extractedText || textNotes}"
          </p>
        </div>

        {/* Issues list */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Surfaced Operational Issues</h3>
          <div className="space-y-2">
            {issues.length > 0 ? (
              issues.map((issue: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <span className="text-xs font-bold text-gray-700">{issue.title}</span>
                  <span className={cn(
                    "px-2.5 py-1 rounded-lg text-[9px] font-black border flex items-center gap-1 shrink-0",
                    issue.priority === "P1" ? "bg-[#FEF3F2] text-[#B42318] border-[#FEE4E2]" :
                    issue.priority === "P2" ? "bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]" :
                    "bg-[#F9FAFB] text-[#475467] border-[#EAECF0]"
                  )}>
                    {issue.priority === "P1" && <AlertCircle className="w-3 h-3" />}
                    Priority {issue.priority}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 font-medium">No distinct failures found in logs.</p>
            )}
          </div>
        </div>

        {/* Checklists */}
        <div className="space-y-5">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
               <CheckCircle2 className="w-4.5 h-4.5 text-gray-900" />
               <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Action Checklist</h4>
            </div>
            <div className="space-y-2">
              {checklist.length > 0 ? (
                checklist.map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-2.5 p-3.5 bg-[#F9FAFB] border border-gray-100 rounded-xl">
                     <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                     <span className="text-xs font-bold text-gray-600">{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 font-medium">No actions checklist required.</p>
              )}
            </div>
          </div>

          {/* Pending questions */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
               <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-400 font-bold text-[9px]">?</div>
               <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Pending Questions</h4>
            </div>
            <div className="space-y-2">
              {questions.length > 0 ? (
                questions.map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-2.5 p-3.5 bg-[#F9FAFB] border border-gray-100 rounded-xl opacity-80">
                     <div className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0" />
                     <span className="text-xs font-bold text-gray-600">{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 font-medium">No pending questions.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <button 
             onClick={handleSubmitHandoff}
             disabled={isSubmitting}
             className="w-full bg-[#101828] text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Submit Handoff Report
          </button>
          <button 
             onClick={() => { setStep("input"); setAiData(null); }}
             className="w-full bg-white text-gray-700 py-3.5 rounded-2xl font-bold border border-gray-200 hover:bg-gray-50 transition-all text-xs"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  };

  return (
    <StaffLayout category="Operators" showBack={step !== "input"} onBack={() => { setStep("input"); setAiData(null); }}>
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
               router.push("/operator"); 
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
