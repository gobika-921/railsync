import React from 'react';

type BadgeVariant =
  | 'critical'
  | 'warning'
  | 'normal'
  | 'info'
  | 'approved'
  | 'pending'
  | 'rejected'
  | 'neutral';

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const getStyle = (): string => {
    switch (variant) {
      case 'critical':
        return 'bg-rose-50 text-rose-700 border-rose-200/80 font-bold';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-200/80 font-semibold';
      case 'normal':
      case 'approved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-semibold';
      case 'info':
        return 'bg-blue-50 text-blue-800 border-blue-200/80 font-semibold';
      case 'pending':
        return 'bg-slate-100 text-slate-700 border-slate-200/80 font-semibold';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200/80 font-semibold';
      case 'neutral':
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 font-medium';
    }
  };

  const getDotColor = (): string => {
    switch (variant) {
      case 'critical':
        return 'bg-rose-600';
      case 'warning':
        return 'bg-amber-500';
      case 'normal':
      case 'approved':
        return 'bg-emerald-600';
      case 'info':
        return 'bg-blue-600';
      case 'pending':
        return 'bg-slate-400';
      case 'rejected':
        return 'bg-red-600';
      case 'neutral':
      default:
        return 'bg-slate-400';
    }
  };

  const sizeStyle =
    size === 'sm'
      ? 'text-[10px] px-2 py-0.5 tracking-wider gap-1.5'
      : 'text-[11px] px-2.5 py-1 tracking-wide gap-1.5';

  return (
    <span
      className={`inline-flex items-center uppercase border rounded-full font-mono-data whitespace-nowrap select-none shadow-2xs ${getStyle()} ${sizeStyle} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`}></span>
      {label}
    </span>
  );
};
