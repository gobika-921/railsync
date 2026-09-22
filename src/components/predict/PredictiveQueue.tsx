import React, { useState } from 'react';
import { useRailSyncStore } from '../../store/useRailSyncStore';
import { PredictiveItem } from '../../types';
import { DataTable, Column } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import { Sparkles, AlertCircle, Clock, CheckCircle2, TrendingUp, CalendarPlus } from 'lucide-react';

export const PredictiveQueue: React.FC = () => {
  const { predictive, openOverrideModal } = useRailSyncStore();
  const [trendFilter, setTrendFilter] = useState<string>('All');

  const filteredItems = predictive.filter((p) =>
    trendFilter === 'All' ? true : p.trend === trendFilter
  );

  const columns: Column<PredictiveItem>[] = [
    {
      key: 'assetCode',
      header: 'Asset & Component',
      width: '180px',
      render: (row) => (
        <div>
          <span className="font-mono-data font-bold text-blue-900 text-xs block">
            {row.assetCode}
          </span>
          <span className="text-[11px] text-slate-700 font-medium block">{row.componentName}</span>
          <span className="text-[10px] text-slate-500 font-mono-data">{row.corridor}</span>
        </div>
      ),
    },
    {
      key: 'predictedFailure',
      header: 'Predicted Anomaly & Mode',
      render: (row) => (
        <div className="space-y-0.5">
          <div className="text-xs font-semibold text-slate-900">{row.predictedFailure}</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-2">
            <span>Potential Service Impact: {row.estimatedDelayRiskMins}m detention</span>
          </div>
        </div>
      ),
    },
    {
      key: 'horizonDays',
      header: 'Failure Horizon',
      width: '130px',
      render: (row) => (
        <div className="font-mono-data">
          <span className="font-bold text-red-700 text-xs flex items-center gap-1">
            <Clock className="w-3 h-3 text-red-600" />
            {row.horizonDays}
          </span>
          <span className="text-[10px] text-slate-500">Telemetry Forecast</span>
        </div>
      ),
    },
    {
      key: 'currentDegradationPct',
      header: 'Degradation',
      width: '130px',
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono-data">
            <span className="text-slate-600 font-medium">Wear:</span>
            <span className="font-bold text-slate-900">{row.currentDegradationPct}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
            <div
              style={{ width: `${row.currentDegradationPct}%` }}
              className={`h-full rounded-full transition-all ${
                row.currentDegradationPct >= 75
                  ? 'bg-rose-600'
                  : row.currentDegradationPct >= 60
                  ? 'bg-amber-500'
                  : 'bg-blue-600'
              }`}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'confidencePct',
      header: 'AI Confidence',
      width: '110px',
      align: 'center',
      render: (row) => (
        <span className="font-mono-data font-bold text-xs bg-slate-100 px-2.5 py-0.5 rounded-full text-slate-800">
          {row.confidencePct}%
        </span>
      ),
    },
    {
      key: 'trend',
      header: 'Degradation Trend',
      width: '120px',
      render: (row) => {
        if (row.trend === 'Accelerating') {
          return <StatusBadge label="Accelerating" variant="critical" size="sm" />;
        }
        if (row.trend === 'Steady') {
          return <StatusBadge label="Steady Pace" variant="warning" size="sm" />;
        }
        return <StatusBadge label="Mild" variant="normal" size="sm" />;
      },
    },
    {
      key: 'action',
      header: 'Proactive Action',
      width: '160px',
      align: 'right',
      sortable: false,
      render: (row) => (
        <button
          type="button"
          onClick={() =>
            openOverrideModal({
              assetCode: row.assetCode,
            })
          }
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-900 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/80 rounded-xl transition-all shadow-2xs ml-auto"
        >
          <CalendarPlus className="w-3.5 h-3.5 text-blue-700" />
          Reserve Block
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4 KPI summary cards for Predictive Maintenance */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <span className="text-[11px] text-slate-500 font-mono-data uppercase font-bold">
            Predicted Failures (7-day)
          </span>
          <div className="text-3xl font-extrabold text-rose-600 font-mono-data mt-2">7</div>
          <span className="text-xs text-slate-500 mt-1 inline-block">3 requiring immediate protected window</span>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <span className="text-[11px] text-slate-500 font-mono-data uppercase font-bold">
            Early Degradation Warnings
          </span>
          <div className="text-3xl font-extrabold text-amber-600 font-mono-data mt-2">21</div>
          <span className="text-xs text-slate-500 mt-1 inline-block">Across 14 corridor subsections</span>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <span className="text-[11px] text-slate-500 font-mono-data uppercase font-bold">
            Suggested Preventive Blocks
          </span>
          <div className="text-3xl font-extrabold text-emerald-700 font-mono-data mt-2">12</div>
          <span className="text-xs text-slate-500 mt-1 inline-block">Optimized into natural traffic gaps</span>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <span className="text-[11px] text-slate-500 font-mono-data uppercase font-bold">
            Ensemble Model Confidence
          </span>
          <div className="text-3xl font-extrabold text-blue-900 font-mono-data mt-2">91.4%</div>
          <span className="text-xs text-slate-500 mt-1 inline-block">Validated against Indian Railways logs</span>
        </div>
      </div>

      {/* Predictive Queue Table */}
      <DataTable
        id="predictive-datatable"
        data={filteredItems}
        columns={columns}
        searchPlaceholder="Filter predictive queue by asset, component or failure mode..."
        searchableKey={(p) => `${p.assetCode} ${p.componentName} ${p.predictedFailure} ${p.corridor}`}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Trend:</span>
            <select
              value={trendFilter}
              onChange={(e) => setTrendFilter(e.target.value)}
              className="text-xs bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-sans cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            >
              <option value="All">All Trends</option>
              <option value="Accelerating">Accelerating Wear</option>
              <option value="Steady">Steady Pace</option>
              <option value="Mild">Mild / Low Risk</option>
            </select>
          </div>
        }
      />
    </div>
  );
};
