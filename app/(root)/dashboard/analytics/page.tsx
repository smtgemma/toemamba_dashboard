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

  const mttrData = apiData.mttrTrend || [];
  const downtimeCauses = apiData.downtimeCauses || [];
  const shiftPerformance = apiData.shiftPerformance || [];

  const kpiMetrics = apiData.kpiMetrics || {
    avgMttr: "0m",
    avgResponseTime: "0m",
    repeatIssueRate: "0%",
    handoffCompletionRate: "0%"
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
            value={kpiMetrics.avgMttr || "0m"}
            icon={Clock}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatCard
            title="Avg. Response Time"
            value={kpiMetrics.avgResponseTime || "0m"}
            icon={Zap}
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <StatCard
            title="Repeat Issue Rate"
            value={kpiMetrics.repeatIssueRate || "0%"}
            icon={Repeat}
            color="text-orange-600"
            bg="bg-orange-50"
          />
          <StatCard
            title="Handoff Completion"
            value={kpiMetrics.handoffCompletionRate || "0%"}
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
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Issue Categories</p>
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  {downtimeCauses.length > 0 ? (
                    downtimeCauses.map((cause: any) => (
                      <div key={cause.name} className="flex items-center justify-between p-3 border border-gray-50 rounded-xl animate-in fade-in duration-300">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cause.color }} />
                          <span className="text-xs font-bold text-gray-700">{cause.name}</span>
                        </div>
                        <span className="text-xs font-bold text-gray-900">{cause.value} issues</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs text-gray-400 font-medium">
                      No categories tracked yet
                    </div>
                  )}
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
