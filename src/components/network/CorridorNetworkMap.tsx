import React, { useState } from 'react';
import { useRailSyncStore } from '../../store/useRailSyncStore';
import { CorridorNode, CorridorSegment } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Train, AlertTriangle, ShieldCheck, Gauge, Layers, Info } from 'lucide-react';

export const CorridorNetworkMap: React.FC = () => {
  const { nodes, segments, selectedNodeId, setSelectedNodeId, openOverrideModal, assets } = useRailSyncStore();

  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  // Connected assets
  const connectedAssets = assets.filter((a) =>
    activeNode.keyAssets.includes(a.code)
  );

  const getNodeColor = (node: CorridorNode) => {
    if (node.riskLevel === 'Critical') return '#DC2626'; // Deep signal red
    if (node.riskLevel === 'High') return '#D97706'; // Signal amber
    return '#1E3A8A'; // Muted rail blue
  };

  const getSegmentStroke = (seg: CorridorSegment) => {
    if (seg.status === 'Active Maintenance Block') return '#DC2626';
    if (seg.status === 'Speed Restricted') return '#D97706';
    return '#64748B'; // Muted slate track line
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* SVG Map Canvas */}
      <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-heading m-0 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Southern Railway — Chennai Pilot Division Topology
            </h3>
            <p className="text-xs text-slate-500 mt-1 m-0">
              Interactive topological vector network map • click or focus node to inspect section load
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono-data text-slate-600 bg-slate-50/80 px-3 py-1.5 rounded-xl border border-slate-200/60">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-700"></span> Normal
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> High Caution
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span> Critical Block
            </span>
          </div>
        </div>

        {/* SVG Container */}
        <div className="relative w-full aspect-16/10 bg-slate-50/50 rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center p-2">
          <svg
            viewBox="0 0 1000 620"
            className="w-full h-full select-none"
            role="region"
            aria-label="Corridor Network Topology Map"
          >
            <defs>
              {/* Pattern for railway ballast track ties */}
              <pattern id="trackTies" width="12" height="12" patternUnits="userSpaceOnUse">
                <line x1="6" y1="0" x2="6" y2="12" stroke="#CBD5E1" strokeWidth="1" />
              </pattern>
            </defs>

            {/* Background grid markings for engineering blueprint precision */}
            <g opacity="0.4" stroke="#E2E8F0" strokeWidth="0.5">
              {Array.from({ length: 11 }).map((_, i) => (
                <line key={`vx-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="620" />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <line key={`hy-${i}`} x1="0" y1={i * 100} x2="1000" y2={i * 100} />
              ))}
            </g>

            {/* Railway Track Segments (Lines between nodes) */}
            {segments.map((seg) => {
              const from = nodes.find((n) => n.id === seg.fromNodeId);
              const to = nodes.find((n) => n.id === seg.toNodeId);
              if (!from || !to) return null;

              const strokeColor = getSegmentStroke(seg);
              const isBlocked = seg.status === 'Active Maintenance Block';
              const isRestricted = seg.status === 'Speed Restricted';

              return (
                <g key={seg.id}>
                  {/* Outer track ballast base */}
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="#E2E8F0"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Railway track rail line */}
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={strokeColor}
                    strokeWidth={isBlocked ? '4' : '3'}
                    strokeDasharray={isBlocked ? '6 4' : isRestricted ? '8 4' : undefined}
                    strokeLinecap="round"
                  />
                </g>
              );
            })}

            {/* Station / Junction Nodes */}
            {nodes.map((node) => {
              const isSelected = node.id === activeNode.id;
              const nodeColor = getNodeColor(node);

              return (
                <g
                  key={node.id}
                  id={`node-${node.code}`}
                  tabIndex={0}
                  role="button"
                  aria-label={`Station ${node.name}, Risk Level ${node.riskLevel}, ${node.activeBlocks} active blocks`}
                  onClick={() => setSelectedNodeId(node.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedNodeId(node.id);
                    }
                  }}
                  className="cursor-pointer focus:outline-none group"
                >
                  {/* Selected halo ring */}
                  {isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="18"
                      fill="none"
                      stroke="#1E3A8A"
                      strokeWidth="2.5"
                      strokeDasharray="3 2"
                    />
                  )}

                  {/* Outer solid border */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? '12' : '9'}
                    fill="white"
                    stroke={nodeColor}
                    strokeWidth="3.5"
                    className="transition-transform group-hover:scale-110"
                  />

                  {/* Inner node core */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? '6' : '4.5'}
                    fill={nodeColor}
                  />

                  {/* Station Label */}
                  <text
                    x={node.x}
                    y={node.y - (isSelected ? 18 : 14)}
                    textAnchor="middle"
                    className={`font-mono-data text-[12px] font-bold ${
                      isSelected ? 'fill-blue-950 font-extrabold' : 'fill-slate-800'
                    }`}
                  >
                    {node.code}
                  </text>

                  {/* Subtitle / Station Name */}
                  <text
                    x={node.x}
                    y={node.y + (isSelected ? 24 : 20)}
                    textAnchor="middle"
                    className="text-[10px] font-sans fill-slate-500 font-medium"
                  >
                    {node.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 font-mono-data gap-2">
          <span>Quad Track: MAS - AJJ (130 km/h)</span>
          <span>Double Track: MS - TBM - CGL (110 km/h)</span>
          <span>North Freight: MAS - GDR (100 km/h)</span>
        </div>
      </div>

      {/* Node Inspection Detail Panel (4 cols) */}
      <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-data font-bold text-xs bg-blue-50 text-blue-900 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                  {activeNode.code}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 font-heading m-0">
                  {activeNode.name}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1 m-0 font-sans">
                {activeNode.corridorName}
              </p>
            </div>

            <StatusBadge
              label={activeNode.riskLevel}
              variant={
                activeNode.riskLevel === 'Critical'
                  ? 'critical'
                  : activeNode.riskLevel === 'High'
                  ? 'warning'
                  : 'normal'
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-500 uppercase font-mono-data font-bold">
                Daily Train Pairs
              </span>
              <div className="text-lg font-bold text-slate-900 font-mono-data mt-0.5">
                {activeNode.dailyTrainPairs}
              </div>
              <span className="text-[10px] text-slate-500 font-mono-data">Express + EMU + Freight</span>
            </div>

            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-500 uppercase font-mono-data font-bold">
                Caution Restriction
              </span>
              <div className="text-lg font-bold text-slate-900 font-mono-data mt-0.5">
                {activeNode.speedRestrictionKmph ? `${activeNode.speedRestrictionKmph} km/h` : '110 km/h PSR'}
              </div>
              <span className="text-[10px] text-amber-700 font-semibold font-mono-data">
                {activeNode.speedRestrictionKmph ? 'TSR Caution active' : 'Normal Track Speed'}
              </span>
            </div>
          </div>

          {/* Section Track Assets */}
          <div className="space-y-2.5 mt-3">
            <div className="text-xs font-bold text-slate-800 font-heading">
              Track Assets & Critical Infrastructure:
            </div>
            {connectedAssets.length === 0 ? (
              <div className="p-4 bg-slate-50/80 text-slate-500 rounded-xl text-xs border border-slate-200/60">
                No active defect alerts on this station's immediate lead track.
              </div>
            ) : (
              connectedAssets.map((ast) => (
                <div
                  key={ast.id}
                  className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center justify-between hover:bg-slate-100/60 transition-colors"
                >
                  <div>
                    <div className="font-mono-data text-xs font-bold text-slate-900">
                      {ast.code}
                    </div>
                    <div className="text-[11px] text-slate-600 truncate max-w-[180px]">
                      {ast.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono-data text-xs font-extrabold text-rose-600 block">
                      Score: {ast.compositeRiskScore}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono-data">
                      {ast.defectsPending} defect{ast.defectsPending === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-600">
            Active blocks: <strong className="text-slate-900 font-mono-data">{activeNode.activeBlocks}</strong>
          </span>
          <button
            type="button"
            onClick={() =>
              openOverrideModal({
                assetCode: activeNode.keyAssets[0] || `${activeNode.code}-YARD`,
              })
            }
            className="px-4 py-2 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-xl transition-colors shadow-2xs"
          >
            Create Section Block
          </button>
        </div>
      </div>
    </div>
  );
};
