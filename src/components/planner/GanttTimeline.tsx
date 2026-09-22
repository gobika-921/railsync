import React, { useState } from 'react';
import { useRailSyncStore } from '../../store/useRailSyncStore';
import { BlockScheduleItem, Department } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Clock, AlertTriangle, CheckCircle2, ChevronRight, Filter } from 'lucide-react';

export const GanttTimeline: React.FC = () => {
  const { blocks, selectedBlockId, setSelectedBlockId, moveBlock, openOverrideModal } = useRailSyncStore();
  const [filterDept, setFilterDept] = useState<string>('All');
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);

  // Timeline hours from 08:00 to 20:00 (12 hours)
  const START_HOUR = 8;
  const END_HOUR = 21;
  const TOTAL_HOURS = END_HOUR - START_HOUR;
  const hours = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => START_HOUR + i);

  const departments: Department[] = [
    'Engineering',
    'Signal & Telecom',
    'Traction Distribution',
  ];

  const filteredBlocks = blocks.filter((b) =>
    filterDept === 'All' ? true : b.department === filterDept
  );

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || blocks[0];

  const getDepartmentRowStyle = (dept: Department) => {
    switch (dept) {
      case 'Engineering':
        return 'border-l-4 border-l-blue-900';
      case 'Signal & Telecom':
        return 'border-l-4 border-l-emerald-700';
      case 'Traction Distribution':
        return 'border-l-4 border-l-amber-600';
      default:
        return 'border-l-4 border-l-slate-400';
    }
  };

  const getBlockColorClass = (item: BlockScheduleItem) => {
    const isSelected = item.id === selectedBlockId;
    const base = isSelected ? 'ring-2 ring-blue-900 shadow-md' : 'hover:brightness-95';

    if (item.priority === 'Critical') {
      return `${base} bg-red-800 text-white border-red-900`;
    }
    if (item.department === 'Engineering') {
      return `${base} bg-blue-900 text-white border-blue-950`;
    }
    if (item.department === 'Signal & Telecom') {
      return `${base} bg-emerald-800 text-white border-emerald-950`;
    }
    if (item.department === 'Traction Distribution') {
      return `${base} bg-amber-700 text-white border-amber-900`;
    }
    return `${base} bg-slate-800 text-white border-slate-900`;
  };

  const formatHour = (hour: number) => {
    const h = Math.floor(hour);
    const m = Math.round((hour % 1) * 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-5">
      {/* Controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.02)]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Department:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Engineering', 'Signal & Telecom', 'Traction Distribution'].map((dept) => {
              const count = dept === 'All' ? blocks.length : blocks.filter((b) => b.department === dept).length;
              const isActive = filterDept === dept;
              return (
                <button
                  key={dept}
                  onClick={() => setFilterDept(dept)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-900 text-white font-bold shadow-xs'
                      : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 font-medium'
                  }`}
                >
                  <span>{dept}</span>
                  <span className={`text-[10px] font-mono-data px-1.5 py-0.2 rounded-full ${isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-200/70 text-slate-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-data text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-rose-600 rounded-full"></span>
            Critical P-Way
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-blue-700 rounded-full"></span>
            Engineering
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></span>
            Signal & Telecom
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
            Traction OHE
          </span>
        </div>
      </div>

      {/* Main Gantt Grid Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <div className="min-w-[960px]">
            {/* Header: Timeline Hours */}
            <div className="grid grid-cols-[220px_1fr] bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-mono-data text-[11px]">
              <div className="p-3 font-bold uppercase tracking-wider text-slate-500 border-r border-slate-200/80 flex items-center justify-between">
                <span>Department / Corridor</span>
                <Clock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="grid grid-cols-13 divide-x divide-slate-200/60">
                {hours.map((h) => (
                  <div key={h} className="py-2.5 text-center font-semibold text-slate-600">
                    {String(h).padStart(2, '0')}:00
                  </div>
                ))}
              </div>
            </div>

            {/* Department Rows */}
            {departments
              .filter((d) => (filterDept === 'All' ? true : d === filterDept))
              .map((dept) => {
                const deptBlocks = filteredBlocks.filter((b) => b.department === dept);

                return (
                  <div
                    key={dept}
                    className="grid grid-cols-[220px_1fr] border-b border-slate-200/60 min-h-[96px] bg-white hover:bg-slate-50/30 transition-colors"
                  >
                    {/* Row Label */}
                    <div className="p-4 border-r border-slate-200/80 bg-slate-50/40 flex flex-col justify-center">
                      <div className="text-xs font-extrabold text-slate-900 font-heading">
                        {dept}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono-data mt-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        <span>{deptBlocks.length} window{deptBlocks.length === 1 ? '' : 's'}</span>
                      </div>
                    </div>

                    {/* Timeline Canvas Row */}
                    <div className="relative grid grid-cols-13 divide-x divide-slate-100 p-2">
                      {/* Grid background lines */}
                      {hours.map((h) => (
                        <div key={h} className="h-full min-h-[72px]" />
                      ))}

                      {/* Render scheduled blocks inside this row */}
                      {deptBlocks.map((block) => {
                        // Calculate percentage position
                        const leftPct = Math.max(
                          0,
                          Math.min(100, ((block.startHour - START_HOUR) / TOTAL_HOURS) * 100)
                        );
                        const widthPct = Math.max(
                          4,
                          Math.min(100 - leftPct, (block.durationHours / TOTAL_HOURS) * 100)
                        );

                        const hasConflict = block.conflictWithIds && block.conflictWithIds.length > 0;
                        const isSelected = selectedBlockId === block.id;

                        return (
                          <div
                            key={block.id}
                            id={`block-${block.id}`}
                            onClick={() => setSelectedBlockId(block.id)}
                            style={{
                              left: `${leftPct}%`,
                              width: `${widthPct}%`,
                              top: '8px',
                              bottom: '8px',
                            }}
                            className={`absolute z-10 rounded-xl p-2.5 border flex flex-col justify-between cursor-pointer transition-all ${
                              isSelected ? 'ring-2 ring-blue-500 ring-offset-2 scale-[1.02] shadow-md z-20' : 'hover:scale-[1.01] shadow-xs'
                            } ${getBlockColorClass(block)}`}
                          >
                            <div className="flex items-center justify-between gap-1 overflow-hidden">
                              <span className="text-[11px] font-bold font-mono-data truncate">
                                {block.code}
                              </span>
                              {hasConflict && (
                                <span
                                  className="bg-amber-400 text-amber-950 px-1.5 py-0.2 text-[9px] font-extrabold rounded font-mono-data shrink-0 animate-pulse"
                                  title="Corridor overlap detected with another block"
                                >
                                  CONFLICT
                                </span>
                              )}
                              {block.priority === 'Critical' && (
                                <span className="bg-rose-950 text-rose-200 px-1.5 py-0.2 text-[9px] font-extrabold rounded font-mono-data shrink-0">
                                  CRIT
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] truncate opacity-95 font-medium">
                              {block.title}
                            </div>
                            <div className="flex items-center justify-between text-[9px] font-mono-data opacity-90 pt-0.5 border-t border-white/15">
                              <span>
                                {formatHour(block.startHour)} – {formatHour(block.startHour + block.durationHours)}
                              </span>
                              <span className="font-bold">Risk: {block.riskScore}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Timeline Bottom Summary */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 font-sans">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Safety headways mathematically verified by solver
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-700" />
              Total Sectional Detention: <strong className="text-slate-900 font-mono-data">34 mins</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono-data">
            <span>Tip: Click any block to inspect or shift slot window</span>
          </div>
        </div>
      </div>

      {/* Selected Block Inspection Drawer / Card */}
      {selectedBlock && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono-data text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                  {selectedBlock.code}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 font-heading m-0">
                  {selectedBlock.title}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1.5 m-0 font-sans">
                {selectedBlock.department} • Corridor: <strong className="text-slate-800">{selectedBlock.corridor}</strong> • Track: <span className="font-mono-data text-slate-800 font-semibold">{selectedBlock.track}</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <StatusBadge
                label={selectedBlock.status}
                variant={
                  selectedBlock.status === 'Approved'
                    ? 'approved'
                    : selectedBlock.status === 'Proposed'
                    ? 'warning'
                    : 'critical'
                }
              />
              <button
                type="button"
                onClick={() => openOverrideModal({ assetCode: selectedBlock.title, blockId: selectedBlock.id })}
                className="px-3.5 py-2 text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 rounded-xl border border-slate-300 transition-colors shadow-2xs"
              >
                Manual Override
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 block text-[10px] uppercase font-mono-data font-bold">
                Scheduled Slot
              </span>
              <span className="text-sm font-bold text-slate-900 font-mono-data mt-1 block">
                {formatHour(selectedBlock.startHour)} – {formatHour(selectedBlock.startHour + selectedBlock.durationHours)}
              </span>
              <span className="text-[11px] text-slate-500 font-mono-data mt-0.5 block">
                Duration: {Math.round(selectedBlock.durationHours * 60)} minutes
              </span>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 block text-[10px] uppercase font-mono-data font-bold">
                Criticality & Risk
              </span>
              <span className="text-sm font-bold text-rose-600 font-mono-data mt-1 block">
                {selectedBlock.riskScore} / 100
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Priority: {selectedBlock.priority}
              </span>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 block text-[10px] uppercase font-mono-data font-bold">
                Punctuality Impact
              </span>
              <span className="text-sm font-bold text-slate-900 font-mono-data mt-1 block">
                {selectedBlock.trafficImpactDelayMins} mins delay
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
                0 Passenger train cancellations
              </span>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 block text-[10px] uppercase font-mono-data font-bold">
                Required Equipment
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {selectedBlock.requiredEquipments.map((eq) => (
                  <span
                    key={eq}
                    className="bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[10px] font-medium text-slate-700 shadow-2xs"
                  >
                    {eq}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Time adjustment slider for this block */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">
                  Interactive Timeline Nudge (Simulate Slot Shift):
                </span>
                <span className="font-mono-data font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {formatHour(selectedBlock.startHour)}
                </span>
              </div>
              <input
                type="range"
                min={8}
                max={18}
                step={0.25}
                value={selectedBlock.startHour}
                onChange={(e) => moveBlock(selectedBlock.id, parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
              />
            </div>
            <div className="flex items-center gap-2 self-end">
              <button
                onClick={() => moveBlock(selectedBlock.id, Math.max(8, selectedBlock.startHour - 0.5))}
                className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-2xs"
              >
                -30m
              </button>
              <button
                onClick={() => moveBlock(selectedBlock.id, Math.min(18, selectedBlock.startHour + 0.5))}
                className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-2xs"
              >
                +30m
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
