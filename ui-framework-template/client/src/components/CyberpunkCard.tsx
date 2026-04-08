import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface CyberpunkCardProps {
  title?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  glowColor?: string;
  compact?: boolean;
}

export function CyberpunkCard({ 
  title, 
  icon: Icon, 
  children, 
  className = "", 
  glowColor = "cyan",
  compact = false 
}: CyberpunkCardProps) {
  const glowClass = {
    cyan: "hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:border-cyan-400/50",
    green: "hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:border-green-400/50",
    blue: "hover:shadow-[0_0_20px_rgba(0,128,255,0.3)] hover:border-blue-400/50",
    orange: "hover:shadow-[0_0_20px_rgba(255,128,0,0.3)] hover:border-orange-400/50",
    purple: "hover:shadow-[0_0_20px_rgba(128,0,255,0.3)] hover:border-purple-400/50",
    pink: "hover:shadow-[0_0_20px_rgba(255,0,255,0.3)] hover:border-pink-400/50"
  }[glowColor];

  return (
    <div className={`
      bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg
      transition-all duration-300 hover:bg-slate-800/70 ${glowClass}
      ${compact ? 'p-3' : 'p-4'} ${className}
    `}>
      {(title || Icon) && (
        <div className={`flex items-center justify-between ${compact ? 'mb-2' : 'mb-3'}`}>
          {title && (
            <h3 className={`font-semibold text-slate-300 ${compact ? 'text-sm' : 'text-lg'}`}>
              {title}
            </h3>
          )}
          {Icon && (
            <Icon className={`text-${glowColor}-400 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
          )}
        </div>
      )}
      {children}
    </div>
  );
}

interface StatusCardProps {
  label: string;
  value: string | number;
  status?: 'online' | 'warning' | 'offline';
  unit?: string;
  progress?: number;
  compact?: boolean;
}

export function StatusCard({ 
  label, 
  value, 
  status = 'online', 
  unit, 
  progress,
  compact = false 
}: StatusCardProps) {
  const statusConfig = {
    online: { color: 'bg-green-400', glow: 'green' },
    warning: { color: 'bg-orange-400', glow: 'orange' },
    offline: { color: 'bg-red-400', glow: 'red' }
  }[status];

  return (
    <CyberpunkCard compact={compact} glowColor={statusConfig.glow}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 ${statusConfig.color} rounded-full animate-pulse`}></div>
          <span className={`font-medium text-slate-300 ${compact ? 'text-sm' : 'text-base'}`}>
            {label}
          </span>
        </div>
        <div className="text-right">
          <span className={`font-bold text-white ${compact ? 'text-lg' : 'text-xl'}`}>
            {value}
          </span>
          {unit && (
            <span className="text-xs text-slate-400 ml-1">{unit}</span>
          )}
        </div>
      </div>
      {progress !== undefined && (
        <div className="mt-2">
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                status === 'online' ? 'bg-gradient-to-r from-green-400 to-cyan-400' :
                status === 'warning' ? 'bg-gradient-to-r from-orange-400 to-yellow-400' :
                'bg-gradient-to-r from-red-400 to-pink-400'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </CyberpunkCard>
  );
}