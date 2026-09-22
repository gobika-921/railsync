import React from 'react';

interface CardProps {
  id?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  id,
  title,
  subtitle,
  action,
  children,
  className = '',
  headerClassName = '',
}) => {
  return (
    <section
      id={id}
      className={`bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-150 ${className}`}
    >
      {(title || action || subtitle) && (
        <div className={`px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-b from-white to-slate-50/40 ${headerClassName}`}>
          <div>
            {title && (
              <h2 className="text-[14px] font-extrabold text-slate-900 tracking-tight font-heading m-0 flex items-center gap-2">
                {title}
              </h2>
            )}
            {subtitle && <p className="text-[11px] text-slate-500 mt-0.5 m-0 font-sans">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
};
