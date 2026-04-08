import { ReactNode, ButtonHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";

interface CyberpunkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  glowColor?: string;
  loading?: boolean;
}

export function CyberpunkButton({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  glowColor,
  loading = false,
  className = "", 
  disabled,
  ...props 
}: CyberpunkButtonProps) {
  const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-600 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white border-slate-600 hover:border-cyan-400/50",
    ghost: "bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white border-slate-600 hover:border-cyan-400/50",
    danger: "bg-red-600 hover:bg-red-500 text-white border-red-600 hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      className={`
        ${variants[variant]} ${sizes[size]}
        border rounded-lg font-medium transition-all duration-200
        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center space-x-2
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {Icon && !loading && <Icon className="w-4 h-4" />}
      <span>{children}</span>
    </button>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  glowColor?: string;
  tooltip?: string;
}

export function IconButton({ 
  icon: Icon, 
  variant = 'secondary', 
  size = 'md', 
  glowColor,
  tooltip,
  className = "", 
  ...props 
}: IconButtonProps) {
  const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-600 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white border-slate-600 hover:border-cyan-400/50",
    ghost: "bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white border-slate-600 hover:border-cyan-400/50",
    danger: "bg-red-600 hover:bg-red-500 text-white border-red-600 hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
  };

  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <button
      className={`
        ${variants[variant]} ${sizes[size]}
        border rounded-lg transition-all duration-200
        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center
        ${className}
      `}
      title={tooltip}
      {...props}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
}