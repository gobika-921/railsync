import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  ShieldAlert, 
  Radio, 
  Train, 
  Sliders, 
  RefreshCw,
  ExternalLink,
  Menu
} from 'lucide-react';
import { useRailSyncStore } from '../../store/useRailSyncStore';
import { Link, useNavigate } from 'react-router-dom';

interface TopBarProps {
  onToggleSidebar?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const { alerts, openOverrideModal, tickLiveIntegrations, integrations } = useRailSyncStore();
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live periodic heartbeat simulation
  useEffect(() => {
    const syncInterval = setInterval(() => {
      tickLiveIntegrations();
    }, 4000);
    return () => clearInterval(syncInterval);
  }, [tickLiveIntegrations]);

  const unreadAlerts = alerts.filter((a) => !a.acknowledged);
  const avgLatency = Math.round(
    integrations.reduce((acc, i) => acc + i.syncLatencySec, 0) / integrations.length
  );

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Left: Division Context & Breadcrumb */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-900 via-indigo-900 to-blue-800 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-1 ring-blue-500/20">
            <Train className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-sm tracking-tight text-slate-900">
                RailSync
              </span>
              <span className="text-[10px] bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded-full font-mono-data border border-blue-200/60">
                MAS CONTROL
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-sans flex items-center gap-1.5">
              <span className="font-medium text-slate-600">Southern Railway</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">Chennai Central Division</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Search & Real Operational Status Beacon */}
      <div className="hidden md:flex items-center gap-3 flex-1 max-w-xl justify-center">
        {/* Modern Spotlight Search Bar */}
        <div className="relative w-full max-w-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 hover:bg-slate-100 border border-slate-200/70 text-slate-500 text-xs transition-colors cursor-pointer group">
            <Sliders className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
            <span className="flex-1 font-sans text-[11px]">Quick search corridors, assets...</span>
            <kbd className="hidden sm:inline-block text-[9px] font-mono-data bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Live CRIS Telemetry Beacon */}
        <Link
          to="/fabric"
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50/80 border border-slate-200/80 hover:bg-slate-100 transition-all text-xs text-slate-700 shadow-2xs group"
          title="Inspect Unified Data Fabric (TMS, SMMS, TDMS, COA, BDMS)"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span className="font-mono-data font-semibold text-[11px] text-slate-800 group-hover:text-blue-900">
            CRIS SYNC
          </span>
          <span className="text-[10px] text-slate-500 font-mono-data">{avgLatency}s</span>
        </Link>
      </div>

      {/* Right: Clock & Quick Action Controls */}
      <div className="flex items-center gap-2.5">
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs font-mono-data text-slate-700 shadow-2xs">
          <Radio className="w-3.5 h-3.5 text-blue-800 animate-pulse" />
          <span className="font-semibold text-slate-900">{currentTime || '09:38:18'}</span>
          <span className="text-slate-400 text-[10px]">IST</span>
        </div>

        <button
          id="topbar-override-btn"
          type="button"
          onClick={() => openOverrideModal()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-semibold transition-all shadow-xs hover:shadow-sm active:scale-98"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-white" />
          <span className="hidden sm:inline">Controller</span> Override
        </button>

        <Link
          to="/alerts"
          id="topbar-alerts-link"
          className="relative p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shadow-2xs"
          aria-label="View notifications and alert feed"
        >
          <Bell className="w-4 h-4" />
          {unreadAlerts.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full font-mono-data shadow-xs animate-pulse">
              {unreadAlerts.length}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};
