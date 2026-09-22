import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/common/Sidebar';
import { TopBar } from './components/common/TopBar';
import { OverrideModal } from './components/override/OverrideModal';
import { CommandCenter } from './components/dashboard/CommandCenter';
import { GanttTimeline } from './components/planner/GanttTimeline';
import { RequestTable } from './components/requests/RequestTable';
import { CorridorNetworkMap } from './components/network/CorridorNetworkMap';
import { CriticalityEngine } from './components/risk/CriticalityEngine';
import { ExplainableAIPanel } from './components/risk/ExplainableAIPanel';
import { PredictiveQueue } from './components/predict/PredictiveQueue';
import { WhatIfSimulator } from './components/simulator/WhatIfSimulator';
import { AuditTrail } from './components/audit/AuditTrail';
import { AlertRulesEngine } from './components/alerts/AlertRulesEngine';
import { ExecutiveReports } from './components/reports/ExecutiveReports';
import { DataFabricView } from './components/fabric/DataFabricView';

const PAGE_METADATA: Record<string, { title: string; subtitle: string; category: string }> = {
  '/': {
    category: 'Operations Command',
    title: 'Divisional Block Planning Control Tower',
    subtitle: 'Chennai Division (MAS) • Real-time corridor scheduling and conflict mediation',
  },
  '/planner': {
    category: 'Dynamic Scheduling',
    title: 'Interactive Block Schedule Gantt Matrix',
    subtitle: 'Corridor timetable windows • Multi-track conflict resolution and headway verification',
  },
  '/requests': {
    category: 'Requisitions',
    title: 'Cross-Department Requisition Management',
    subtitle: 'Evaluate maintenance requisitions against traffic paths with automated compromise slots',
  },
  '/network': {
    category: 'Topology & Infrastructure',
    title: 'Corridor Topology & Risk Schematic',
    subtitle: 'Corridor schematic • Section speeds, line densities, cautions, and active track blocks',
  },
  '/risk': {
    category: 'Asset Criticality',
    title: 'Dynamic Asset Criticality & Explainable AI',
    subtitle: 'Asset risk scoring with transparent algorithmic factor breakdowns',
  },
  '/predictive': {
    category: 'Condition Monitoring',
    title: 'Predictive Track & Asset Maintenance Queue',
    subtitle: 'Forecasted maintenance needs to schedule preventive blocks before degradation',
  },
  '/simulator': {
    category: 'Scenario Sandbox',
    title: 'What-If Parametric Constraint Simulator',
    subtitle: 'Adjust traffic volume, defect thresholds, and headway margins to evaluate network impact',
  },
  '/audit': {
    category: 'Audit & Governance',
    title: 'Autonomous Decisions & Controller Audit Trail',
    subtitle: 'Immutable log of automated planning actions and controller overrides',
  },
  '/alerts': {
    category: 'Safety & Incidents',
    title: 'Operational Rules Engine & Alert Stream',
    subtitle: 'Safety rule invariants and active operational dispatch notifications',
  },
  '/reports': {
    category: 'Analytics & KPIs',
    title: 'Executive KPI Dossier & Performance Audit',
    subtitle: 'Corridor availability trends and departmental block utilization metrics',
  },
  '/fabric': {
    category: 'Infrastructure Link',
    title: 'Unified Data Fabric & Interoperability',
    subtitle: 'Live synchronization with TMS, SMMS, TDMS, COA, and BDMS',
  },
};

const AppShell: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const location = useLocation();

  const currentMeta = PAGE_METADATA[location.pathname] || {
    category: 'Operations',
    title: 'RailSync Control Tower',
    subtitle: 'Southern Railway Autonomous Operations System',
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* View Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200/80">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-bold font-mono-data uppercase tracking-wider mb-2 border border-blue-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                {currentMeta.category}
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-heading tracking-tight m-0">
                {currentMeta.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 m-0 font-sans max-w-3xl">
                {currentMeta.subtitle}
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 text-xs shadow-2xs">
                <span className="text-[10px] text-slate-400 font-mono-data uppercase block">Division</span>
                <span className="font-bold text-slate-800 font-mono-data">MAS / CHENNAI</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 text-xs shadow-2xs">
                <span className="text-[10px] text-slate-400 font-mono-data uppercase block">Network Status</span>
                <span className="font-bold text-emerald-700 font-mono-data flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  OPTIMAL (96.2%)
                </span>
              </div>
            </div>
          </div>

          {/* View Content */}
          <Routes>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/planner" element={<GanttTimeline />} />
            <Route path="/requests" element={<RequestTable />} />
            <Route path="/network" element={<CorridorNetworkMap />} />
            <Route
              path="/risk"
              element={
                <div className="space-y-6">
                  <CriticalityEngine />
                  <ExplainableAIPanel />
                </div>
              }
            />
            <Route path="/predictive" element={<PredictiveQueue />} />
            <Route path="/simulator" element={<WhatIfSimulator />} />
            <Route path="/audit" element={<AuditTrail />} />
            <Route path="/alerts" element={<AlertRulesEngine />} />
            <Route path="/reports" element={<ExecutiveReports />} />
            <Route path="/fabric" element={<DataFabricView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Controller Override Modal */}
      <OverrideModal />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
