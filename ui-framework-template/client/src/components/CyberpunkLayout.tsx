import { ReactNode } from "react";

interface CyberpunkLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  logo?: ReactNode;
  showBackgroundEffects?: boolean;
}

export function CyberpunkLayout({ 
  children, 
  title, 
  subtitle, 
  logo, 
  showBackgroundEffects = true 
}: CyberpunkLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background Effects */}
      {showBackgroundEffects && (
        <>
          {/* Cyber Grid */}
          <div className="absolute inset-0 cyber-grid opacity-20"></div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 50 }, (_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              />
            ))}
          </div>
          
          {/* Scanning Lines */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-line"></div>
          </div>
        </>
      )}
      
      {/* Header */}
      {(title || subtitle || logo) && (
        <div className="relative z-10 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              {logo}
              <div>
                {title && <h1 className="text-2xl font-bold text-white">{title}</h1>}
                {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
              </div>
            </div>
            <div className="text-sm text-slate-400 font-mono">
              {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
}