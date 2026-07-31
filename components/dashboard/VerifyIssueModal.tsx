"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { useVerifyIssueMutation } from "@/lib/redux/features/issues/issuesApi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VerifyIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  issueId: string;
}

export const VerifyIssueModal = ({ isOpen, onClose, issueId }: VerifyIssueModalProps) => {
  const [approved, setApproved] = useState(true);
  const [note, setNote] = useState("");

  const [verifyIssue, { isLoading: isVerifying }] = useVerifyIssueMutation();

  useEffect(() => {
    if (isOpen) {
      setApproved(true);
      setNote("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      toast.error("Please enter a verification note detailing audit results.");
      return;
    }

    try {
      await verifyIssue({
        id: issueId,
        approved,
        note
      }).unwrap();

      toast.success(approved ? "Issue verified & closed successfully!" : "Issue rejected & reopened.");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit verification");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Verify Resolution</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Action selection */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-900 uppercase tracking-widest block">Audit Decision</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setApproved(true)}
                className={cn(
                  "py-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer",
                  approved
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-extrabold shadow-sm"
                    : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50"
                )}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Approve & Close
              </button>
              <button
                type="button"
                onClick={() => setApproved(false)}
                className={cn(
                  "py-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer",
                  !approved
                    ? "bg-rose-50 border-rose-200 text-rose-700 font-extrabold shadow-sm"
                    : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50"
                )}
              >
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Reject & Reopen
              </button>
            </div>
          </div>

          {/* Audit Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-900 uppercase tracking-widest block">Verification Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={approved 
                ? "Describe audit findings. (e.g. Checked guide rail calibration, belt runs smoothly.)" 
                : "Reason for rejection. (e.g. Steam pressure is still fluctuating below 5 bar.)"}
              className="w-full h-28 bg-[#F9FAFB] border border-gray-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#101828]/10 placeholder:text-gray-400 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className={cn(
              "w-full text-white py-3.5 rounded-xl text-xs font-black shadow-md cursor-pointer transition-all flex items-center justify-center gap-2",
              approved ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
            )}
          >
            {isVerifying && <Loader2 className="w-4 h-4 animate-spin" />}
            Confirm Audit Sign-off
          </button>
        </form>
      </div>
    </div>
  );
};
