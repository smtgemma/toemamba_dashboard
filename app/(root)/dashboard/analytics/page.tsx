"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import {
  Clock,
  Zap,
  Repeat,
  FileText,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetAnalyticsQuery } from "@/lib/redux/features/issues/issuesApi";

export default function AnalyticsPage() {
  const { data: analyticsResponse, isLoading } = useGetAnalyticsQuery({});

  const apiData = analyticsResponse?.data || {};

  // Parse graphs and fall back to demo sets to keep dashboard populated
  const mttrData = apiData.mttr?.length ? apiData.mttr : [
    { name: "Mon", value: 45 },
    { name: "Tue", value: 38 },
    { name: "Wed", value: 42 },
    { name: "Thu", value: 30 },
    { name: "Fri", value: 35 },
    { name: "Sat", value: 25 },
    { name: "Sun", value: 20 },
  ];

  const downtimeCauses = apiData.downtimeCauses?.length ? apiData.downtimeCauses : [
    { name: "Electrical", value: 400, color: "#D92D20" },
    { name: "Mechanical", value: 300, color: "#F79009" },
    { name: "Software", value: 150, color: "#2E90FA" },
    { name: "Human Error", value: 100, color: "#667085" },
  ];

  const shiftPerformance = apiData.shiftPerformance?.length ? apiData.shiftPerformance : [
    { shift: "Shift 1", issues: 12, completion: 95 },
    { shift: "Shift 2", issues: 18, completion: 88 },
    { shift: "Shift 3", issues: 8, completion: 92 },
  ];

  const kpiMetrics = apiData.kpiMetrics || {
    avgMttr: "32m",
    avgResponseTime: "8.5m",
    repeatIssueRate: "14%",
    handoffCompletion: "91.4%"
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-8 pb-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Plant Analytics</h1>
            <p className="text-sm text-gray-500">Track MTTR, downtime, and team performance metrics</p>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
              <Loader2 className="w-4 h-4 animate-spin text-[#101828]" /> Updating live insights...
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="MTTR (Mean Time to Repair)"
            value={kpiMetrics.avgMttr || "32m"}
            change="-12%"
            isPositive
            icon={Clock}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatCard
            title="Avg. Response Time"
            value={kpiMetrics.avgResponseTime || "8.5m"}
            change="-5%"
            isPositive
            icon={Zap}
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <StatCard
            title="Repeat Issue Rate"
            value={kpiMetrics.repeatIssueRate || "14%"}
            change="+2%"
            isPositive={false}
            icon={Repeat}
            color="text-orange-600"
            bg="bg-orange-50"
          />
          <StatCard
            title="Handoff Completion"
            value={kpiMetrics.handoffCompletion || "91.4%"}
            change="+4%"
            isPositive
            icon={FileText}
            color="text-purple-600"
            bg="bg-purple-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* MTTR Trend */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">MTTR Trend (mins)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mttrData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E90FA" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#2E90FA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F4F7" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#667085', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#667085', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#2E90FA" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Downtime Mentions & Causes */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Downtime Insights</h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Mentions
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-[250px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={downtimeCauses}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {downtimeCauses.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color || "#667085"} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Top Keywords</p>
                <div className="space-y-2">
                  {[
                    { tag: "Line 2 Motor", count: 14, color: "bg-red-50 text-red-600" },
                    { tag: "Material Shortage", count: 12, color: "bg-orange-50 text-orange-600" },
                    { tag: "Hydraulic Leak", count: 8, color: "bg-blue-50 text-blue-600" },
                    { tag: "Safety Guard", count: 5, color: "bg-gray-50 text-gray-600" },
                  ].map((mention) => (
                    <div key={mention.tag} className="flex items-center justify-between p-3 border border-gray-50 rounded-xl">
                      <span className={cn("px-2 py-1 rounded-md text-[10px] font-bold", mention.color)}>
                        {mention.tag}
                      </span>
                      <span className="text-xs font-bold text-gray-900">{mention.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Open Issues by Shift */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Open Issues by Shift</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shiftPerformance}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F4F7" />
                  <XAxis dataKey="shift" axisLine={false} tickLine={false} tick={{ fill: '#667085', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#667085', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="issues" fill="#101828" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Handoff Completion Rate */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Shift Handoff Completion Rate (%)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={shiftPerformance}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F4F7" />
                  <XAxis dataKey="shift" axisLine={false} tickLine={false} tick={{ fill: '#667085', fontSize: 12 }} dy={10} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#667085', fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="completion" stroke="#7F56D9" strokeWidth={3} dot={{ r: 6, fill: '#7F56D9', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, change, isPositive, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl ${bg} ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isPositive ? '↓' : '↑'} {change}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
      </div>
    </div>
  );
}
