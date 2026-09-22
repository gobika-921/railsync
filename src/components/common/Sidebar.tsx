import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarRange,
  ArrowLeftRight,
  Network,
  Activity,
  Sparkles,
  SlidersHorizontal,
  FileCheck2,
  AlertTriangle,
  BarChart3,
  Layers,
  Train,
  Menu,
  X
} from 'lucide-react';
import { useRailSyncStore } from '../../store/useRailSyncStore';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { alerts, requests } = useRailSyncStore();
  const pendingRequests = requests.filter((r) => r.status === 'Pending Review' || r.status === 'Negotiating').length;
  const criticalAlerts = alerts.filter((a) => a.level === 'Critical' && !a.acknowledged).length;

  const navGroups = [
    {
      group: 'Operations',
      items: [
        { name: 'Command Center', path: '/', icon: LayoutDashboard },
        { name: 'AI Block Planner', path: '/planner', icon: CalendarRange },
        { 
          name: 'Requests & Negotiation', 
          path: '/requests', 
          icon: ArrowLeftRight,
          badge: pendingRequests > 0 ? `${pendingRequests}` : undefined,
          badgeColor: 'bg-blue-100 text-blue-800'
        },
        { name: 'Corridor Network', path: '/network', icon: Network },
      ],
    },
    {
      group: 'AI Intelligence',
      items: [
        { name: 'Risk & Criticality Engine', path: '/risk', icon: Activity },
        { name: 'Predictive Maintenance', path: '/predictive', icon: Sparkles },
        { name: 'What-If Simulator', path: '/simulator', icon: SlidersHorizontal },
      ],
    },
    {
      group: 'Governance',
      items: [
        { name: 'Explainability & Audit', path: '/audit', icon: FileCheck2 },
        { 
          name: 'Alerts & Incidents', 
          path: '/alerts', 
          icon: AlertTriangle,
          badge: criticalAlerts > 0 ? `${criticalAlerts}` : undefined,
          badgeColor: 'bg-red-600 text-white'
        },
        { name: 'Reports & KPIs', path: '/reports', icon: BarChart3 },
      ],
    },
    {
      group: 'Platform',
      items: [
        { name: 'Unified Data Fabric', path: '/fabric', icon: Layers },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0B1120] text-slate-300 flex flex-col border-r border-slate-800/80 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20 ring-1 ring-white/15">
              <Train className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white font-heading tracking-tight">
                RailSync
              </div>
              <div className="text-[10px] text-slate-400 font-sans tracking-wide">
                Southern Railway Control
              </div>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800/60"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {navGroups.map((grp) => (
            <div key={grp.group} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono-data">
                {grp.group}
              </div>
              <nav className="space-y-1">
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 1024) onToggle();
                      }}
                      className={({ isActive }) =>
                        `group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-white text-slate-900 shadow-sm font-bold'
                            : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-2.5">
                            <Icon
                              className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                                isActive
                                  ? 'text-blue-600'
                                  : 'text-slate-400 group-hover:text-slate-200'
                              }`}
                            />
                            <span className={isActive ? 'text-slate-900 font-bold' : ''}>
                              {item.name}
                            </span>
                          </div>
                          {item.badge && (
                            <span
                              className={`text-[10px] font-mono-data font-bold px-2 py-0.5 rounded-full ${
                                isActive
                                  ? 'bg-rose-100 text-rose-700'
                                  : item.badgeColor
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Controller Profile Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center text-xs font-bold text-white border border-slate-700">
                SC
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950"></span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-200 truncate">
                K. Rajagopal (IRTS)
              </div>
              <div className="text-[10px] text-slate-400 font-mono-data truncate">
                Sr. Divisional Ops Mgr
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
