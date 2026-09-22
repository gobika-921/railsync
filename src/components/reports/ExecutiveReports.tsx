import React from 'react';
import { exportToCSV, triggerPrintReport } from '../../utils/export';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Download, Printer, TrendingUp, CheckCircle2, FileText, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const TREND_DATA = [
  { month: 'Apr 26', baseline: 90.2, railsync: 91.5, punctuality: 94.1 },
  { month: 'May 26', baseline: 90.5, railsync: 92.4, punctuality: 94.8 },
  { month: 'Jun 26', baseline: 89.8, railsync: 93.1, punctuality: 95.0 },
  { month: 'Jul 26', baseline: 91.0, railsync: 93.9, punctuality: 95.5 },
  { month: 'Aug 26', baseline: 90.4, railsync: 94.2, punctuality: 95.9 },
  { month: 'Sep 26', baseline: 90.7, railsync: 94.8, punctuality: 96.2 },
];

const DEPT_UTILIZATION_DATA = [
  { dept: 'Engineering', requestedHours: 140, sanctionedHours: 118, efficiency: 84 },
  { dept: 'Signal & Telecom', requestedHours: 92, sanctionedHours: 85, efficiency: 92 },
  { dept: 'Traction OHE', requestedHours: 84, sanctionedHours: 74, efficiency: 88 },
  { dept: 'Joint Blocks', requestedHours: 42, sanctionedHours: 39, efficiency: 93 },
];

const KPI_SUMMARY_ROWS = [
  { metric: 'Unplanned Asset Downtime (hrs/mo)', baseline: '412 hrs', railsync: '321 hrs', variance: '-22.1%', status: 'Favorable' },
  { metric: 'Departmental Corridor Conflicts', baseline: '84 conflicts', railsync: '58 conflicts', variance: '-31.0%', status: 'Favorable' },
  { metric: 'Overall Track Asset Availability', baseline: '90.7%', railsync: '94.8%', variance: '+4.1%', status: 'Favorable' },
  { metric: 'Passenger Train Punctuality (MAS Div)', baseline: '94.5%', railsync: '96.2%', variance: '+1.7%', status: 'Favorable' },
  { metric: 'Speed Restriction Imposition (PSR/TSR)', baseline: '28 locations', railsync: '16 locations', variance: '-42.8%', status: 'Favorable' },
  { metric: 'Controller Manual Override Rate', baseline: '— (Manual)', railsync: '14.2%', variance: 'Target < 15%', status: 'Healthy Adoption' },
];

export const ExecutiveReports: React.FC = () => {
  const handleExportCSV = () => {
    exportToCSV('IndianRailways-RailSync-Executive-Report', KPI_SUMMARY_ROWS, [
      { key: 'metric', label: 'Operational KPI Metric' },
      { key: 'baseline', label: 'Pre-RailSync Baseline' },
      { key: 'railsync', label: 'RailSync AI Result' },
      { key: 'variance', label: 'Performance Variance' },
      { key: 'status', label: 'Audit Status' },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-heading m-0">
              Executive KPI & Performance Audit Dossier
            </h2>
            <span className="text-[10px] bg-blue-50 text-blue-900 font-mono-data font-bold px-2.5 py-0.5 rounded-full border border-blue-200/60">
              OFFICIAL USE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 m-0">
            Southern Railway — Chennai Division (MAS) • Monthly Synthesis
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="print-report-btn"
            type="button"
            onClick={triggerPrintReport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            Print / PDF
          </button>
          <button
            id="export-report-csv-btn"
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV Dataset
          </button>
        </div>
      </div>

      {/* 4 High-Level Impact Numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <span className="text-[11px] text-slate-500 font-mono-data uppercase font-bold">
            Asset Downtime Reduction
          </span>
          <div className="text-3xl font-extrabold text-emerald-700 font-mono-data mt-2 flex items-center gap-1">
            <ArrowDownRight className="w-6 h-6 text-emerald-600" />
            -22.1%
          </div>
          <span className="text-xs text-slate-500 mt-1 inline-block">91 hours saved per month</span>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <span className="text-[11px] text-slate-500 font-mono-data uppercase font-bold">
            Conflicting Requisitions
          </span>
          <div className="text-3xl font-extrabold text-emerald-700 font-mono-data mt-2 flex items-center gap-1">
            <ArrowDownRight className="w-6 h-6 text-emerald-600" />
            -31.0%
          </div>
          <span className="text-xs text-slate-500 mt-1 inline-block">Auto-negotiated cross-department</span>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <span className="text-[11px] text-slate-500 font-mono-data uppercase font-bold">
            Corridor Availability
          </span>
          <div className="text-3xl font-extrabold text-blue-900 font-mono-data mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-6 h-6 text-blue-600" />
            94.8%
          </div>
          <span className="text-xs text-slate-500 mt-1 inline-block">+4.1% above manual baseline</span>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <span className="text-[11px] text-slate-500 font-mono-data uppercase font-bold">
            Controller Override Rate
          </span>
          <div className="text-3xl font-extrabold text-slate-900 font-mono-data mt-2">
            14.2%
          </div>
          <span className="text-xs text-emerald-700 font-bold mt-1 inline-block">Within target bounds (&lt;15%)</span>
        </div>
      </div>

      {/* Real Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Availability & Punctuality Trend Chart */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)]">
          <div className="mb-4">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-heading m-0">
              Availability vs. Punctuality Trajectory (6-Month Horizon)
            </h3>
            <p className="text-xs text-slate-500 mt-1 m-0">
              Proves block grant increases without degrading timetable adherence
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRailsync" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[88, 98]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="railsync"
                  name="RailSync Availability %"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRailsync)"
                />
                <Area
                  type="monotone"
                  dataKey="baseline"
                  name="Pre-AI Baseline %"
                  stroke="#94A3B8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorBaseline)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Departmental Block Sanction Efficiency */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)]">
          <div className="mb-4">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-heading m-0">
              Departmental Block Sanction Efficiency (Hours Granted vs. Requisitioned)
            </h3>
            <p className="text-xs text-slate-500 mt-1 m-0">
              High fulfillment across Engineering, S&T and Traction
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPT_UTILIZATION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="dept" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="requestedHours" name="Requested Hours" fill="#CBD5E1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="sanctionedHours" name="Sanctioned Hours" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed KPI Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)]">
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-heading m-0 mb-4">
          Executive KPI Variance Table
        </h3>
        <div className="border border-slate-200/80 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 font-mono-data uppercase">
                <th className="py-3 px-4">Performance Dimension</th>
                <th className="py-3 px-4">Manual Historical Baseline</th>
                <th className="py-3 px-4">RailSync AI Achieved</th>
                <th className="py-3 px-4">Net Variance</th>
                <th className="py-3 px-4 text-right">Operational Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {KPI_SUMMARY_ROWS.map((row) => (
                <tr key={row.metric} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{row.metric}</td>
                  <td className="py-3 px-4 text-slate-600 font-mono-data">{row.baseline}</td>
                  <td className="py-3 px-4 font-bold text-blue-900 font-mono-data">{row.railsync}</td>
                  <td className="py-3 px-4 font-mono-data font-bold text-emerald-700">{row.variance}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
