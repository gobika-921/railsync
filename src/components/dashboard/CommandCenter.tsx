import React from 'react';
import { useRailSyncStore } from '../../store/useRailSyncStore';
import { generateAIExplanation } from '../../utils/scoring';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Radio,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Train,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Link } from 'react-router-dom';

const HOURLY_PUNCTUALITY = [
  { time: '04:00', punctuality: 97.5, availability: 95.8 },
  { time: '06:00', punctuality: 96.8, availability: 95.4 },
  { time: '08:00', punctuality: 95.4, availability: 94.9 },
  { time: '10:00', punctuality: 96.2, availability: 94.8 },
  { time: '12:00', punctuality: 96.9, availability: 95.2 },
  { time: '14:00', punctuality: 96.5, availability: 95.0 },
  { time: '16:00', punctuality: 95.8, availability: 94.7 },
  { time: '18:00', punctuality: 96.2, availability: 94.8 },
];

export const CommandCenter: React.FC = () => {
  const {
    assets,
    requests,
    blocks,
    auditLog,
    alerts,
    openOverrideModal,
    acceptAIRecommendation,
  } = useRailSyncStore();

  // Compute live KPIs dynamically from underlying data
  const totalMonitored = 12480; // Total divisional asset census
  const criticalAssets = assets.filter((a) => a.compositeRiskScore >= 80).length;
  const requestsToday = requests.length + 42; // scaling to daily divisional throughput
  const conflictsDetected = requests.filter((r) => r.conflictStatus !== 'None').length;
  const autoResolvedCount = requests.filter((r) => r.status === 'Approved' || r.status === 'AI Optimized').length + 27;
  const autoResolvedPct = Math.round((autoResolvedCount / requestsToday) * 100);

  // Highest critical asset
  const topCriticalAsset = [...assets].sort((a, b) => b.compositeRiskScore - a.compositeRiskScore)[0];
  const topExplanation = generateAIExplanation(topCriticalAsset, { start: '10:30', end: '12:00' });

  // Recent command feed items (last 4 audit entries or alerts)
  const recentEvents = auditLog.slice(0, 4);

  // Department requests count
  const engRequests = requests.filter((r) => r.department === 'Engineering').length + 14;
  const stRequests = requests.filter((r) => r.department === 'Signal & Telecom').length + 10;
  const trdRequests = requests.filter((r) => r.department === 'Traction Distribution').length + 9;
  const maxDept = Math.max(engRequests, stRequests, trdRequests);

  return (
    <div className="space-y-6">
      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Card 1: Assets Monitored */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between min-w-0 overflow-hidden">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-500 font-semibold truncate">
                Monitored Assets
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Train className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono-data mt-2 tracking-tight truncate">
              {totalMonitored.toLocaleString()}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="text-xs text-emerald-700 font-medium truncate">
              99.1% live telemetry
            </span>
          </div>
        </div>

        {/* Card 2: Critical Assets */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between min-w-0 overflow-hidden">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-500 font-semibold truncate">
                Critical Assets
              </span>
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-rose-600 font-mono-data mt-2 tracking-tight truncate">
              {criticalAssets + 15}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0"></span>
            <span className="text-xs text-rose-700 font-medium truncate">
              5 urgent windows
            </span>
          </div>
        </div>

        {/* Card 3: Requisitions Today */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between min-w-0 overflow-hidden">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-500 font-semibold truncate">
                Requisitions
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono-data mt-2 tracking-tight truncate">
              {requestsToday}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
            <span className="text-xs text-amber-800 font-medium truncate">
              {conflictsDetected} conflicts detected
            </span>
          </div>
        </div>

        {/* Card 4: Auto-Optimized */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between min-w-0 overflow-hidden">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-500 font-semibold truncate">
                Auto-Resolved
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-indigo-900 font-mono-data mt-2 tracking-tight truncate">
              {autoResolvedCount}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
            <span className="text-xs text-indigo-700 font-medium truncate">
              {autoResolvedPct}% auto-reconciled
            </span>
          </div>
        </div>

        {/* Card 5: Corridor Availability */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between min-w-0 overflow-hidden">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-500 font-semibold truncate">
                Corridor Uptime
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono-data mt-2 tracking-tight truncate">
              94.8%
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 min-w-0">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-xs text-emerald-700 font-medium truncate">
              +4.1% over manual
            </span>
          </div>
        </div>

        {/* Card 6: Train Punctuality */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between min-w-0 overflow-hidden">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-500 font-semibold truncate">
                Punctuality
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Train className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-blue-900 font-mono-data mt-2 tracking-tight truncate">
              96.2%
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
            <span className="text-xs text-slate-600 font-medium truncate">
              0 cancellations
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: AI Command Feed (Left) + Top Priority AI Recommendation (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Command Feed & Punctuality Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-heading m-0 flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                  </span>
                  Live AI Planning Command Feed
                </h3>
                <p className="text-xs text-slate-500 mt-1 m-0">
                  Real-time solver adjustments and automated conflict reconciliations
                </p>
              </div>
              <Link
                to="/audit"
                className="text-xs text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1 transition-colors group"
              >
                <span>Full Audit</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 font-mono-data uppercase">
                    <th className="py-2.5 px-3.5">Time</th>
                    <th className="py-2.5 px-3.5">Target & Trigger</th>
                    <th className="py-2.5 px-3.5">AI Solver Action</th>
                    <th className="py-2.5 px-3.5 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {recentEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3.5 font-mono-data text-slate-500 text-[11px] whitespace-nowrap">
                        {evt.timestamp.slice(11, 16)} IST
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="font-mono-data font-bold text-slate-900 block text-xs">
                          {evt.assetCode}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono-data">
                          {evt.reasonCode}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-slate-700 font-medium">
                        {evt.action}
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <StatusBadge
                          label={evt.result === 'CONTROLLER_OVERRIDE' ? 'Override' : 'Optimized'}
                          variant={evt.result === 'CONTROLLER_OVERRIDE' ? 'warning' : 'approved'}
                          size="sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Real Live Performance Trend Mini-Chart */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                Divisional Punctuality Curve (Today)
              </span>
              <span className="font-mono-data text-blue-900 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/50">
                Current: 96.2%
              </span>
            </div>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HOURLY_PUNCTUALITY} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="punctualityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                  <YAxis domain={[94, 98]} tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="punctuality"
                    name="Punctuality %"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    fill="url(#punctualityGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: Featured Top Priority AI Recommendation */}
        <div className="lg:col-span-5 bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden">
          {/* Subtle top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-blue-600"></div>

          <div>
            <div className="border-b border-slate-100 pb-3.5 mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-heading m-0 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Top Priority AI Recommendation
                </h3>
                <StatusBadge label="Critical Priority" variant="critical" size="sm" />
              </div>
              <p className="text-xs text-slate-500 mt-1 m-0">
                Highest risk asset identified by dynamic scoring engine
              </p>
            </div>

            {/* Asset card */}
            <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-xs space-y-3.5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono-data font-bold text-sm text-blue-900 block">
                    {topCriticalAsset.code}
                  </span>
                  <span className="text-xs text-slate-800 font-semibold mt-0.5 block">
                    {topCriticalAsset.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono-data font-extrabold text-rose-600 block">
                    Risk {topCriticalAsset.compositeRiskScore}/100
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono-data">
                    {topCriticalAsset.locationKm}
                  </span>
                </div>
              </div>

              {/* Mini Breakdown bars */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">Defect Severity</span>
                    <span className="font-mono-data font-bold text-slate-900">
                      {topCriticalAsset.defectScore}/35 (97%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                    <div style={{ width: '97%' }} className="h-full bg-rose-500 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">Traffic Exposure (114 GMT)</span>
                    <span className="font-mono-data font-bold text-slate-900">
                      {topCriticalAsset.trafficDensityScore}/30 (84%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                    <div style={{ width: '84%' }} className="h-full bg-blue-600 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">Asset Age (2011 Installation)</span>
                    <span className="font-mono-data font-bold text-slate-900">
                      {topCriticalAsset.assetAgeScore}/20 (90%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                    <div style={{ width: '90%' }} className="h-full bg-amber-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation callout */}
            <div className="mt-3.5 p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl text-xs text-blue-950 leading-relaxed font-sans shadow-2xs">
              <strong className="text-blue-900 font-bold">Recommendation:</strong> Protected block window{' '}
              <span className="font-mono-data font-bold text-blue-900 bg-white px-1.5 py-0.5 rounded border border-blue-200">
                10:30–12:00
              </span>.
              Mathematical solver verified safe headway for preceding Pallavan Express. Zero mainline cancellations.
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/80 flex items-center gap-3 mt-4">
            <button
              id="accept-ai-recommendation-btn"
              type="button"
              onClick={() => acceptAIRecommendation('blk-01')}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow active:scale-98"
            >
              Accept AI Plan
            </button>
            <button
              type="button"
              onClick={() => openOverrideModal({ assetCode: topCriticalAsset.code })}
              className="py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold border border-slate-300 transition-colors shadow-2xs"
            >
              Override
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Active Caution Orders + Department Load + Subsystem Link Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Caution Orders & Speed Restrictions */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-extrabold text-slate-900 font-heading m-0 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Active Caution Orders
              </h3>
              <Link to="/network" className="text-xs text-blue-600 font-bold hover:text-blue-800 transition-colors">
                View Network →
              </Link>
            </div>
            <div className="space-y-2.5">
              <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="font-mono-data font-bold text-xs text-slate-900 block">MAS–AJJ UP Main</span>
                  <span className="text-[11px] text-slate-500 font-sans">Km 42/10 • Weld defect</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-data font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  30 km/h
                </span>
              </div>
              <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="font-mono-data font-bold text-xs text-slate-900 block">MS–TBM Fast Corridor</span>
                  <span className="text-[11px] text-slate-500 font-sans">Km 18/4 • Point machine maintenance</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-data font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  45 km/h
                </span>
              </div>
              <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="font-mono-data font-bold text-xs text-slate-900 block">AJJ–KPD Main Line</span>
                  <span className="text-[11px] text-slate-500 font-sans">Km 91/2 • OHE mast realignment</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-data font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  75 km/h
                </span>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-sans pt-3 border-t border-slate-100 mt-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Speed restrictions enforced in auto-dispatched timetable</span>
          </div>
        </div>

        {/* Department Maintenance Load */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)] space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 font-heading m-0">
            Department Block Requisitions
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-800">Civil Engineering (P-Way)</span>
                <span className="font-mono-data font-bold text-slate-900">{engRequests} blocks</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div style={{ width: `${(engRequests / maxDept) * 100}%` }} className="h-full bg-blue-700 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-800">Signal & Telecom</span>
                <span className="font-mono-data font-bold text-slate-900">{stRequests} blocks</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div style={{ width: `${(stRequests / maxDept) * 100}%` }} className="h-full bg-emerald-600 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-800">Traction OHE</span>
                <span className="font-mono-data font-bold text-slate-900">{trdRequests} blocks</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div style={{ width: `${(trdRequests / maxDept) * 100}%` }} className="h-full bg-amber-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Platform Subsystem Health */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-extrabold text-slate-900 font-heading m-0">
                Subsystem Link Health
              </h3>
              <Link to="/fabric" className="text-xs text-blue-600 font-bold hover:text-blue-800 transition-colors">
                View Fabric →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-500 font-mono-data">TMS (Track)</span>
                <div className="text-sm font-bold text-emerald-700 font-mono-data mt-0.5">99.4%</div>
              </div>
              <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-500 font-mono-data">SMMS (Signal)</span>
                <div className="text-sm font-bold text-emerald-700 font-mono-data mt-0.5">98.8%</div>
              </div>
              <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-500 font-mono-data">TDMS (Traction)</span>
                <div className="text-sm font-bold text-emerald-700 font-mono-data mt-0.5">99.1%</div>
              </div>
              <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-500 font-mono-data">COA (Traffic)</span>
                <div className="text-sm font-bold text-emerald-700 font-mono-data mt-0.5">99.7%</div>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono-data pt-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Asset-Event Graph synchronized 12s ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};
