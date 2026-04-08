import React from 'react';
import backgroundVideo from "@assets/20250725_1923_Futuristic Neon Serenity_simple_compose_01k112wfdvfd5v7jndrbpsca92_1754437615780.mp4";

interface VideoBackgroundProps {
  className?: string;
  opacity?: number;
}

export function VideoBackground({ className = "", opacity = 0.8 }: VideoBackgroundProps) {
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {/* Full-screen Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          filter: 'blur(0.5px) brightness(0.7) contrast(1.3)',
          opacity: opacity
        }}
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      {/* Enhanced Overlay Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/60 via-slate-900/50 to-slate-950/60"></div>
      
      {/* Cyber Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-pulse 4s ease-in-out infinite alternate'
        }}
      ></div>

      {/* Holographic Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,rgba(0,255,255,0.08)_0%,transparent_50%)]"></div>
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_75%,rgba(255,0,255,0.08)_0%,transparent_50%)]"></div>
      <div className="absolute center right-0 w-full h-full bg-[radial-gradient(circle_at_80%_60%,rgba(255,170,255,0.08)_0%,transparent_50%)]"></div>
    </div>
  );
}