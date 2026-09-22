import React, { useState } from 'react';
import { useRailSyncStore } from '../../store/useRailSyncStore';
import { Asset } from '../../types';
import { RISK_WEIGHTS, getRiskTier } from '../../utils/scoring';
import { StatusBadge } from '../common/StatusBadge';
import { Search, Filter, ShieldAlert } from 'lucide-react';

export const CriticalityEngine: React.FC = () => {
  const { assets, selectedAssetId, setSelectedAssetId, openOverrideModal } = useRailSyncStore();
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAssets = assets.filter((a) => {
    if (deptFilter !== 'All' && a.department !== deptFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.code.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.corridor.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Mathematical Formula Card */}
      <div className="p-5 sm:p-6 bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono-data">
              Composite Criticality Engine
            </span>
          </div>
          <div className="text-sm sm:text-base font-mono-data font-bold text-slate-900 mt-1.5 tracking-tight">
            Risk Score = Defect [0–35] + Traffic Exposure [0–30] + Asset Age [0–20] + Weather [0–15]
          </div>
          <p className="text-xs text-slate-500 mt-1 m-0 leading-relaxed font-sans">
            Continuous Bayesian dynamic scoring automatically recalculated whenever ultrasonic USFD, track recording cars, or traffic schedules ingest new telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono-data bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 shrink-0">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-rose-600 rounded-full"></span> Defect (35%)
          </span>
          <span className="flex items-center gap-1.5 ml-1">
            <span className="w-2.5 h-2.5 bg-blue-700 rounded-full"></span> Traffic (30%)
          </span>
          <span className="flex items-center gap-1.5 ml-1">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span> Age (20%)
          </span>
          <span className="flex items-center gap-1.5 ml-1">
            <span className="w-2.5 h-2.5 bg-slate-500 rounded-full"></span> Weather (15%)
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search asset code, corridor, or track section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-sans"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-sans cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Civil Engineering (P-Way)</option>
            <option value="Signal & Telecom">Signal & Telecom</option>
            <option value="Traction Distribution">Traction Distribution</option>
          </select>
        </div>
      </div>

      {/* Criticality Scoring Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono-data">
                <th className="py-3 px-4">Asset Code & Name</th>
                <th className="py-3 px-4">Corridor</th>
                <th className="py-3 px-4 text-center">Defect (35)</th>
                <th className="py-3 px-4 text-center">Traffic (30)</th>
                <th className="py-3 px-4 text-center">Age (20)</th>
                <th className="py-3 px-4 text-center">Env (15)</th>
                <th className="py-3 px-4" style={{ minWidth: '180px' }}>Weighted Factor Breakdown</th>
                <th className="py-3 px-4 text-right">Composite Score</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-sans">
              {filteredAssets.map((asset) => {
                const isSelected = asset.id === selectedAssetId;
                const tier = getRiskTier(asset.compositeRiskScore);

                return (
                  <tr
                    key={asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50/60'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono-data font-bold text-blue-900 text-xs block">
                        {asset.code}
                      </span>
                      <span className="text-[11px] text-slate-600 block truncate max-w-[220px] font-medium">
                        {asset.name}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{asset.corridor}</div>
                      <div className="text-[10px] text-slate-500 font-mono-data">{asset.locationKm}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono-data font-semibold text-slate-900">
                      {asset.defectScore}
                    </td>
                    <td className="py-3 px-4 text-center font-mono-data font-semibold text-slate-900">
                      {asset.trafficDensityScore}
                    </td>
                    <td className="py-3 px-4 text-center font-mono-data font-semibold text-slate-900">
                      {asset.assetAgeScore}
                    </td>
                    <td className="py-3 px-4 text-center font-mono-data font-semibold text-slate-900">
                      {asset.weatherVulnerabilityScore}
                    </td>
                    <td className="py-3 px-4">
                      {/* Horizontal stacked bar */}
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex shadow-2xs">
                        <div
                          style={{ width: `${(asset.defectScore / 100) * 100}%` }}
                          className="bg-rose-600 h-full"
                          title={`Defect: ${asset.defectScore}/35`}
                        />
                        <div
                          style={{ width: `${(asset.trafficDensityScore / 100) * 100}%` }}
                          className="bg-blue-700 h-full"
                          title={`Traffic: ${asset.trafficDensityScore}/30`}
                        />
                        <div
                          style={{ width: `${(asset.assetAgeScore / 100) * 100}%` }}
                          className="bg-amber-500 h-full"
                          title={`Age: ${asset.assetAgeScore}/20`}
                        />
                        <div
                          style={{ width: `${(asset.weatherVulnerabilityScore / 100) * 100}%` }}
                          className="bg-slate-400 h-full"
                          title={`Weather: ${asset.weatherVulnerabilityScore}/15`}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono-data">
                      <span
                        className={`font-bold px-2.5 py-1 rounded-full text-xs inline-block ${
                          tier.tier === 'Critical'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : tier.tier === 'High'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {asset.compositeRiskScore} / 100
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openOverrideModal({ assetCode: asset.code });
                        }}
                        className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
                      >
                        Override
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
