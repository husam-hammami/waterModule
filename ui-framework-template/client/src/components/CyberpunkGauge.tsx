import { useEffect, useRef } from "react";

interface CyberpunkGaugeProps {
  value: number;
  max: number;
  label: string;
  unit?: string;
  color?: string;
  size?: number;
  showValue?: boolean;
  animate?: boolean;
}

export function CyberpunkGauge({ 
  value, 
  max, 
  label, 
  unit = "", 
  color = "#00ffff", 
  size = 120,
  showValue = true,
  animate = true
}: CyberpunkGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 20;
    const progress = Math.min(value / max, 1);

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Background ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.3)';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Progress ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (progress * 2 * Math.PI));
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.stroke();

    // Inner glow
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 15, 0, 2 * Math.PI);
    ctx.strokeStyle = `${color}20`;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = color;
    ctx.fill();

    // Value text
    if (showValue) {
      ctx.font = `bold ${size / 8}px Inter`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = 0;
      ctx.fillText(`${value}${unit}`, centerX, centerY);
    }
  }, [value, max, color, size, unit, showValue]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="transition-transform duration-300 hover:scale-110">
        <canvas ref={canvasRef} width={size} height={size} />
      </div>
      <div className="mt-2 text-xs text-slate-400 font-mono text-center">
        {label}
      </div>
    </div>
  );
}

interface LinearGaugeProps {
  value: number;
  max: number;
  label: string;
  unit?: string;
  color?: string;
  height?: number;
  showValue?: boolean;
}

export function LinearGauge({ 
  value, 
  max, 
  label, 
  unit = "", 
  color = "#00ffff", 
  height = 8,
  showValue = true 
}: LinearGaugeProps) {
  const progress = Math.min(value / max, 1);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400 font-mono">{label}</span>
        {showValue && (
          <span className="text-sm text-white font-bold">
            {value}{unit}
          </span>
        )}
      </div>
      <div className="w-full bg-slate-700 rounded-full" style={{ height }}>
        <div 
          className="h-full rounded-full transition-all duration-500 relative overflow-hidden"
          style={{ 
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${color}40, ${color})`
          }}
        >
          <div 
            className="absolute inset-0 animate-pulse"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}80, transparent)`,
              animation: 'shimmer 2s infinite'
            }}
          />
        </div>
      </div>
    </div>
  );
}