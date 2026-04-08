import { ReactNode, useState } from "react";
import { Menu, X, LucideIcon } from "lucide-react";
import { Link, useLocation } from "wouter";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: string | number;
}

interface CyberpunkNavigationProps {
  items: NavItem[];
  logo?: ReactNode;
  title?: string;
  className?: string;
}

export function CyberpunkNavigation({ 
  items, 
  logo, 
  title, 
  className = "" 
}: CyberpunkNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`
        hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50
        bg-slate-900/95 backdrop-blur-sm border-r border-slate-700
        ${className}
      `}>
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo/Header */}
          <div className="flex items-center h-16 px-6 border-b border-slate-700">
            {logo}
            {title && (
              <span className="ml-3 text-xl font-bold text-white">{title}</span>
            )}
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {items.map((item) => {
              const isActive = location === item.path;
              const Icon = item.icon;
              
              return (
                <Link key={item.id} href={item.path}>
                  <div className={`
                    flex items-center px-3 py-2 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-400/30 shadow-[0_0_10px_rgba(0,255,255,0.2)]' 
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:border-slate-600 border border-transparent'
                    }
                  `}>
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="flex items-center">
          {logo}
          {title && (
            <span className="ml-3 text-xl font-bold text-white">{title}</span>
          )}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed inset-0 z-50 transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}>
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
        <div className={`
          fixed top-0 left-0 bottom-0 w-64 bg-slate-900/95 backdrop-blur-sm border-r border-slate-700
          transition-transform duration-300 transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex items-center h-16 px-6 border-b border-slate-700">
            {logo}
            {title && (
              <span className="ml-3 text-xl font-bold text-white">{title}</span>
            )}
          </div>
          
          <nav className="px-4 py-4 space-y-2">
            {items.map((item) => {
              const isActive = location === item.path;
              const Icon = item.icon;
              
              return (
                <Link key={item.id} href={item.path}>
                  <div 
                    className={`
                      flex items-center px-3 py-2 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-400/30 shadow-[0_0_10px_rgba(0,255,255,0.2)]' 
                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:border-slate-600 border border-transparent'
                      }
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}