import React, { useState } from 'react';
import { useRailSyncStore } from '../../store/useRailSyncStore';
import { AlertItem, AlertRule } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { AlertTriangle, ShieldAlert, CheckCircle2, Info, BellRing, ToggleLeft, ToggleRight, Check } from 'lucide-react';

export const AlertRulesEngine: React.FC = () => {
  const { alerts, alertRules, acknowledgeAlert, dismissAlert, toggleAlertRule } = useRailSyncStore();
  const [filterLevel, setFilterLevel] = useState<string>('All');

  const filteredAlerts = alerts.filter((a) =>
    filterLevel === 'All' ? true : a.level === filterLevel
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Active Live Alert Feed (5 cols) */}
      <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)] space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-heading m-0 flex items-center gap-2">
              <BellRing className="w-4 h-4 text-blue-600" />
              Live Operational Alert Feed
            </h3>
            <p className="text-xs text-slate-500 mt-1 m-0">
              Evaluated against real-time sensor streams and corridor traffic
            </p>
          </div>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="text-xs bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-sans cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
          >
            <option value="All">All Levels</option>
            <option value="Critical">Critical</option>
            <option value="Warning">Warning</option>
            <option value="Resolved">Resolved</option>
            <option value="Info">Info</option>
          </select>
        </div>

        <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500">
              No active alerts matching filter.
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isCrit = alert.level === 'Critical';
              const isWarn = alert.level === 'Warning';
              const isRes = alert.level === 'Resolved';

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    alert.acknowledged
                      ? 'bg-slate-50/60 border-slate-200/80 opacity-75'
                      : isCrit
                      ? 'bg-rose-50/70 border-rose-200/80 shadow-2xs'
                      : isWarn
                      ? 'bg-amber-50/70 border-amber-200/80'
                      : isRes
                      ? 'bg-emerald-50/70 border-emerald-200/80'
                      : 'bg-blue-50/70 border-blue-200/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-data text-[10px] text-slate-500 font-semibold">
                        {alert.timestamp}
                      </span>
                      <StatusBadge
                        label={alert.level}
                        variant={
                          isCrit
                            ? 'critical'
                            : isWarn
                            ? 'warning'
                            : isRes
                            ? 'approved'
                            : 'info'
                        }
                        size="sm"
                      />
                    </div>
                    <span className="text-[10px] font-mono-data text-slate-400">
                      {alert.ruleTriggered}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-900 mt-2 font-heading">
                    {alert.title}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 m-0 font-sans leading-relaxed">
                    {alert.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono-data text-[11px]">
                      Corridor: <strong className="text-slate-700">{alert.corridor}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      {!alert.acknowledged ? (
                        <button
                          type="button"
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-blue-950 px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          Ack
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-700 font-bold">
                          ✓ Acknowledged
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => dismissAlert(alert.id)}
                        className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right: Rules Engine Configuration Table (7 cols) */}
      <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)] space-y-5">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-heading m-0 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            Active Rule Evaluation Engine
          </h3>
          <p className="text-xs text-slate-500 mt-1 m-0">
            Rules continuously evaluate incoming telemetry against safety and timetable constraints
          </p>
        </div>

        <div className="border border-slate-200/80 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 font-mono-data uppercase">
                  <th className="py-3 px-4">Rule Code & Name</th>
                  <th className="py-3 px-4">Condition & Trigger Action</th>
                  <th className="py-3 px-4 text-center">Evaluations</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {alertRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono-data font-bold text-blue-900 text-xs px-2 py-0.5 bg-blue-50 border border-blue-200/60 rounded-full inline-block">
                        {rule.ruleCode}
                      </span>
                      <span className="text-xs font-bold text-slate-900 block mt-1">
                        {rule.name}
                      </span>
                      <StatusBadge
                        label={rule.severity}
                        variant={rule.severity === 'Critical' ? 'critical' : 'warning'}
                        size="sm"
                        className="mt-1"
                      />
                    </td>
                    <td className="py-3.5 px-4 space-y-1.5">
                      <div className="font-mono-data text-[11px] text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                        <strong className="text-slate-900">IF:</strong> {rule.condition}
                      </div>
                      <div className="text-[11px] text-blue-900 font-semibold">
                        <strong>THEN:</strong> {rule.triggerAction}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono-data font-bold text-slate-700">
                      {rule.evaluationsCount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => toggleAlertRule(rule.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          rule.enabled
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-500 border border-slate-300'
                        }`}
                      >
                        {rule.enabled ? 'ACTIVE' : 'MUTED'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 text-xs text-slate-600 font-sans">
          <strong className="text-slate-900 font-semibold">Safety Compliance:</strong> Rule triggers are logged to the Section Controller Console and cross-referenced with RDSO Standard Operating Procedures.
        </div>
      </div>
    </div>
  );
};
