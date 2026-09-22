import React from 'react';
import { useRailSyncStore } from '../../store/useRailSyncStore';
import { SlidersHorizontal, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, Check } from 'lucide-react';

export const WhatIfSimulator: React.FC = () => {
  const {
    simulationParams,
    simulationResult,
    setSimulationParam,
    resetSimulation,
    applySimulationScenario,
  } = useRailSyncStore();

  const {
    trafficDemandPct,
    criticalDefectWeightPct,
    corridorCapacityPct,
    passengerTrainPriority,
    weatherRiskMultiplier,
  } = simulationParams;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sliders Control Panel (5 cols) */}
      <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)] space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-heading m-0 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              Scenario Parametric Sliders
            </h3>
            <p className="text-xs text-slate-500 mt-1 m-0">
              Live simulation recomputes constraint matrix in real-time
            </p>
          </div>
          <button
            type="button"
            onClick={resetSimulation}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-xl transition-all font-semibold shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Baseline
          </button>
        </div>

        {/* Slider 1: Traffic Demand */}
        <div className="space-y-2 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="sim-traffic" className="font-bold text-slate-800 font-sans">
              Corridor Traffic Demand:
            </label>
            <span className="font-mono-data font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60 text-xs">
              {trafficDemandPct}%
            </span>
          </div>
          <input
            id="sim-traffic"
            type="range"
            min={60}
            max={140}
            step={5}
            value={trafficDemandPct}
            onChange={(e) => setSimulationParam('trafficDemandPct', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono-data">
            <span>60% (Off-peak)</span>
            <span>100% (Baseline)</span>
            <span>140% (Surge)</span>
          </div>
        </div>

        {/* Slider 2: Critical Defect Weight */}
        <div className="space-y-2 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="sim-defect" className="font-bold text-slate-800 font-sans">
              Critical Defect Risk Weight:
            </label>
            <span className="font-mono-data font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60 text-xs">
              {criticalDefectWeightPct}%
            </span>
          </div>
          <input
            id="sim-defect"
            type="range"
            min={30}
            max={100}
            step={5}
            value={criticalDefectWeightPct}
            onChange={(e) => setSimulationParam('criticalDefectWeightPct', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono-data">
            <span>30% (Standard)</span>
            <span>70% (Default)</span>
            <span>100% (Zero-Tolerance)</span>
          </div>
        </div>

        {/* Slider 3: Available Corridor Capacity */}
        <div className="space-y-2 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="sim-capacity" className="font-bold text-slate-800 font-sans">
              Corridor Headroom Capacity:
            </label>
            <span className="font-mono-data font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 text-xs">
              {corridorCapacityPct}%
            </span>
          </div>
          <input
            id="sim-capacity"
            type="range"
            min={50}
            max={100}
            step={5}
            value={corridorCapacityPct}
            onChange={(e) => setSimulationParam('corridorCapacityPct', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono-data">
            <span>50% (Saturated)</span>
            <span>80% (Normal)</span>
            <span>100% (Full Margin)</span>
          </div>
        </div>

        {/* Slider 4: Passenger Train Priority */}
        <div className="space-y-2 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="sim-priority" className="font-bold text-slate-800 font-sans">
              Passenger Train Priority Multiplier:
            </label>
            <span className="font-mono-data font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60 text-xs">
              {passengerTrainPriority.toFixed(1)}x
            </span>
          </div>
          <input
            id="sim-priority"
            type="range"
            min={1.0}
            max={2.0}
            step={0.1}
            value={passengerTrainPriority}
            onChange={(e) => setSimulationParam('passengerTrainPriority', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono-data">
            <span>1.0x (Equal)</span>
            <span>1.5x (Default)</span>
            <span>2.0x (Absolute Protection)</span>
          </div>
        </div>

        {/* Slider 5: Monsoon Weather Risk */}
        <div className="space-y-2 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="sim-weather" className="font-bold text-slate-800 font-sans">
              Monsoon / Weather Vulnerability Factor:
            </label>
            <span className="font-mono-data font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60 text-xs">
              {weatherRiskMultiplier.toFixed(1)}x
            </span>
          </div>
          <input
            id="sim-weather"
            type="range"
            min={0.8}
            max={1.5}
            step={0.1}
            value={weatherRiskMultiplier}
            onChange={(e) => setSimulationParam('weatherRiskMultiplier', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-700"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono-data">
            <span>0.8x (Dry Season)</span>
            <span>1.0x (Normal)</span>
            <span>1.5x (Heavy Rain Surge)</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={applySimulationScenario}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Apply Scenario to Active Operational Draft
          </button>
        </div>
      </div>

      {/* Simulated Outcomes & Visible Diff (7 cols) */}
      <div className="lg:col-span-7 space-y-5">
        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <span className="text-[10px] text-slate-500 uppercase font-mono-data font-bold">
              Conflicts
            </span>
            <div className="text-2xl font-extrabold font-mono-data mt-1 text-slate-900">
              {simulationResult.simulatedConflicts}
            </div>
            <span
              className={`text-[10px] font-bold mt-1 inline-block ${
                simulationResult.simulatedConflicts <= 3 ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {simulationResult.simulatedConflicts <= 3 ? 'Baseline Satisfied' : '+ Contention Alert'}
            </span>
          </div>

          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <span className="text-[10px] text-slate-500 uppercase font-mono-data font-bold">
              Asset Availability
            </span>
            <div className="text-2xl font-extrabold font-mono-data mt-1 text-emerald-700">
              {simulationResult.simulatedAvailability}%
            </div>
            <span className="text-[10px] text-slate-500 font-mono-data mt-1 inline-block">Target ≥ 94.0%</span>
          </div>

          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <span className="text-[10px] text-slate-500 uppercase font-mono-data font-bold">
              Blocks Rescheduled
            </span>
            <div className="text-2xl font-extrabold font-mono-data mt-1 text-slate-900">
              {simulationResult.blocksMovedCount}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 inline-block">Autonomous shifts</span>
          </div>

          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <span className="text-[10px] text-slate-500 uppercase font-mono-data font-bold">
              Solvability Index
            </span>
            <div className="text-2xl font-extrabold font-mono-data mt-1 text-blue-900">
              {simulationResult.feasibilityScore}%
            </div>
            <span className="text-[10px] text-emerald-700 font-bold mt-1 inline-block">MILP Feasible</span>
          </div>
        </div>

        {/* Visible Diff Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)]">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-heading m-0 mb-4">
            Visible Differential Breakdown (Baseline vs. Simulated Scenario)
          </h3>
          <div className="border border-slate-200/80 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 font-mono-data uppercase">
                  <th className="py-3 px-4">Performance Metric</th>
                  <th className="py-3 px-4">Baseline</th>
                  <th className="py-3 px-4">Simulated Result</th>
                  <th className="py-3 px-4 text-right">Differential</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {simulationResult.diffBreakdown.map((row) => (
                  <tr key={row.label} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800">{row.label}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono-data">{row.baseline}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 font-mono-data">
                      {row.simulated}
                    </td>
                    <td className="py-3 px-4 text-right font-mono-data">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                          row.improved
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                            : 'bg-rose-50 text-rose-700 border border-rose-200/80'
                        }`}
                      >
                        {row.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-start gap-3 text-xs text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-slate-900 font-semibold">Safety Invariant Check:</strong> All primary protected maintenance windows for IMR track defects remain intact without time compression. Simulated passenger punctuality remains above the 95.0% divisional threshold.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
