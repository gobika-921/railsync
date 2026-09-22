import React, { useState } from 'react';
import { useRailSyncStore } from '../../store/useRailSyncStore';
import { AuditEntry } from '../../types';
import { DataTable, Column } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import { exportToCSV } from '../../utils/export';
import { Download, Filter, ShieldCheck, UserCheck, Bot } from 'lucide-react';

export const AuditTrail: React.FC = () => {
  const { auditLog, openOverrideModal } = useRailSyncStore();
  const [actorFilter, setActorFilter] = useState<string>('All');

  const filteredLog = auditLog.filter((entry) => {
    if (actorFilter === 'All') return true;
    if (actorFilter === 'AI' && entry.actor.includes('AI')) return true;
    if (actorFilter === 'Controller' && !entry.actor.includes('AI')) return true;
    return true;
  });

  const handleExportCSV = () => {
    exportToCSV('RailSync-Audit-Trail', filteredLog, [
      { key: 'timestamp', label: 'Timestamp (IST)' },
      { key: 'actor', label: 'Actor' },
      { key: 'role', label: 'Role / Subsystem' },
      { key: 'action', label: 'Action Taken' },
      { key: 'assetCode', label: 'Asset / Target' },
      { key: 'reasonCode', label: 'Reason Code' },
      { key: 'justification', label: 'Operational Justification' },
      { key: 'result', label: 'Result Code' },
      { key: 'safetyCleared', label: 'Safety Certified' },
    ]);
  };

  const columns: Column<AuditEntry>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      width: '150px',
      render: (row) => (
        <span className="font-mono-data text-xs text-slate-700 font-semibold">
          {row.timestamp}
        </span>
      ),
    },
    {
      key: 'actor',
      header: 'Actor & Role',
      width: '180px',
      render: (row) => {
        const isAI = row.actor.includes('AI');
        return (
          <div className="flex items-start gap-2.5">
            <div className={`p-1.5 rounded-xl shrink-0 mt-0.5 ${isAI ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
              {isAI ? <Bot className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
            </div>
            <div>
              <span className="font-bold text-slate-900 text-xs block">{row.actor}</span>
              <span className="text-[11px] text-slate-500 font-sans block mt-0.5">{row.role}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'action',
      header: 'Decision & Target',
      width: '200px',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 text-xs block">{row.action}</span>
          <span className="font-mono-data text-[11px] text-blue-900 font-bold block mt-0.5">{row.assetCode}</span>
        </div>
      ),
    },
    {
      key: 'justification',
      header: 'Operational Justification & Reason Code',
      render: (row) => (
        <div className="space-y-1">
          <span className="font-mono-data text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full inline-block border border-slate-200/60">
            {row.reasonCode}
          </span>
          <p className="text-xs text-slate-700 leading-relaxed m-0 font-sans">{row.justification}</p>
        </div>
      ),
    },
    {
      key: 'result',
      header: 'Resolution Result',
      width: '150px',
      align: 'right',
      render: (row) => {
        switch (row.result) {
          case 'CONTROLLER_OVERRIDE':
            return <StatusBadge label="Override" variant="warning" size="sm" />;
          case 'MANUAL_APPROVAL':
            return <StatusBadge label="Manual Sanc" variant="approved" size="sm" />;
          case 'REJECTED':
            return <StatusBadge label="Rejected" variant="rejected" size="sm" />;
          case 'AUTO_RESOLVED':
          default:
            return <StatusBadge label="Auto Resolved" variant="info" size="sm" />;
        }
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Table with controls */}
      <DataTable
        id="audit-trail-datatable"
        data={filteredLog}
        columns={columns}
        searchPlaceholder="Search audit log by actor, asset code, or reason code..."
        searchableKey={(e) => `${e.actor} ${e.role} ${e.action} ${e.assetCode} ${e.reasonCode} ${e.justification}`}
        actions={
          <div className="flex items-center gap-2">
            <select
              value={actorFilter}
              onChange={(e) => setActorFilter(e.target.value)}
              className="text-xs bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-sans cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            >
              <option value="All">All Actors</option>
              <option value="AI">AI Autonomous Solver</option>
              <option value="Controller">Human Controller</option>
            </select>

            <button
              id="export-audit-csv-btn"
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>

            <button
              type="button"
              onClick={() => openOverrideModal()}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              New Override
            </button>
          </div>
        }
      />
    </div>
  );
};
