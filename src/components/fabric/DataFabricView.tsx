import React from 'react';
import { useRailSyncStore } from '../../store/useRailSyncStore';
import { StatusBadge } from '../common/StatusBadge';
import { Layers, Activity, Database, Server, RefreshCw, CheckCircle2, Radio } from 'lucide-react';

export const DataFabricView: React.FC = () => {
  const { integrations, tickLiveIntegrations } = useRailSyncStore();

  const totalRecordsToday = integrations.reduce((acc, i) => acc + i.recordsSyncedToday, 0);

  return (
    <div className="space-y-6">
      {/* 3 Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono-data uppercase font-bold">
              Asset-Event Knowledge Graph
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center">
              <Database className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono-data mt-2">12,480</div>
          <span className="text-xs text-slate-500 mt-1 inline-block">
            P-Way, Signal & OHE assets mapped to timetable links
          </span>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono-data uppercase font-bold">
              Total Ingested Events (Today)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center">
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 font-mono-data mt-2">
            {totalRecordsToday.toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 mt-1 inline-block">
            Sub-second continuous telemetry synchronization
          </span>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono-data uppercase font-bold">
              Deployment Topology
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center">
              <Server className="w-4 h-4 text-slate-700" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-heading mt-2">Hybrid Cloud</div>
          <span className="text-xs text-slate-500 mt-1 inline-block">
            CRIS RailNet on-premise containerized cluster
          </span>
        </div>
      </div>

      {/* Integration Adapter Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-heading m-0">
                Indian Railways Subsystem Adapters (Legacy Interoperability)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 m-0">
              Non-invasive adapter-first architecture ingesting data from existing CRIS systems
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={tickLiveIntegrations}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Trigger Live Ping
            </button>
          </div>
        </div>

        <div className="border border-slate-200/80 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 font-mono-data uppercase">
                  <th className="py-3 px-4">System Code & Subsystem</th>
                  <th className="py-3 px-4">Protocol / Transport</th>
                  <th className="py-3 px-4 text-center">Sync Latency</th>
                  <th className="py-3 px-4 text-right">Synced Records</th>
                  <th className="py-3 px-4">Last Sync Timestamp</th>
                  <th className="py-3 px-4 text-right">Health Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {integrations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-data font-bold text-blue-900 text-xs px-2.5 py-0.5 bg-blue-50 border border-blue-200/60 rounded-full">
                          {item.code}
                        </span>
                        <span className="font-bold text-slate-900">{item.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">{item.subsystem}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                        {item.dataTypes}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono-data text-xs text-slate-700 font-semibold block">
                        {item.protocol}
                      </span>
                      <span className="font-mono-data text-[10px] text-slate-400 truncate block max-w-[200px]">
                        {item.endpoint}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono-data">
                      <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full text-xs">
                        {item.syncLatencySec}s
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono-data font-semibold text-slate-800">
                      {item.recordsSyncedToday.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono-data text-slate-600 text-xs">
                      {item.lastSyncTimestamp}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <StatusBadge label={item.status} variant="approved" size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Technical Architecture Note */}
        <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 text-xs text-slate-700 space-y-2">
          <div className="font-bold text-slate-900 flex items-center gap-2 font-heading">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            Indian Railways Data Security & Zero-Downtime Guarantee
          </div>
          <p className="m-0 leading-relaxed font-sans text-slate-600">
            RailSync integrates as a read-through analytical sidecar over CRIS enterprise databases. No legacy software schemas require modification. If any external source experiences transient network partitions, RailSync falls back to safe cached state estimation without interrupting scheduled train dispatching.
          </p>
        </div>
      </div>
    </div>
  );
};
