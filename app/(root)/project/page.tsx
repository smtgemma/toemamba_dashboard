"use client";

import React from "react";

export default function ProjectPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Workspace</h1>
        <p className="text-gray-500 mb-6">
          This area is designated for Maintenance and Operator roles to manage their specific tasks and workflows.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[#F9F5FF] rounded-xl border border-[#D6BBFB]">
            <span className="block text-sm font-bold text-[#7F56D9]">Maintenance</span>
          </div>
          <div className="p-4 bg-[#ECFDF3] rounded-xl border border-[#ABEFC6]">
            <span className="block text-sm font-bold text-[#067647]">Operator</span>
          </div>
        </div>
      </div>
    </div>
  );
}
