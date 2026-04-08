import { useEffect, useRef } from "react";

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  showDots?: boolean;
}

export function Sparkline({ 
  data, 
  color = "#00ffff", 
  width = 80, 
  height = 40,
  showDots = false 
}: SparklineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const stepX = width / (data.length - 1);

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 4;
    ctx.shadowColor = color;

    ctx.beginPath();
    data.forEach((value, index) => {
      const x = index * stepX;
      const y = height - ((value - min) / range) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw dots
    if (showDots) {
      ctx.fillStyle = color;
      ctx.shadowBlur = 6;
      data.forEach((value, index) => {
        const x = index * stepX;
        const y = height - ((value - min) / range) * height;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  }, [data, color, width, height, showDots]);

  return (
    <div className="transition-transform duration-300 hover:scale-105">
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
}

interface DonutChartProps {
  percentage: number;
  color?: string;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
}

export function DonutChart({ 
  percentage, 
  color = "#00ffff", 
  size = 60, 
  strokeWidth = 6,
  showValue = true 
}: DonutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - strokeWidth;
    const progress = Math.min(percentage / 100, 1);

    ctx.clearRect(0, 0, size, size);

    // Background ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.3)';
    ctx.lineWidth = strokeWidth;
    ctx.stroke();

    // Progress ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (progress * 2 * Math.PI));
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 6;
    ctx.shadowColor = color;
    ctx.stroke();

    // Center value
    if (showValue) {
      ctx.font = `bold ${size / 5}px Inter`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = 0;
      ctx.fillText(`${Math.round(percentage)}%`, centerX, centerY);
    }
  }, [percentage, color, size, strokeWidth, showValue]);

  return (
    <div className="transition-transform duration-300 hover:scale-105">
      <canvas ref={canvasRef} width={size} height={size} />
    </div>
  );
}

interface BarChartProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  showValues?: boolean;
}

export function MiniBarChart({ 
  data, 
  color = "#00ffff", 
  width = 80, 
  height = 40,
  showValues = false 
}: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const max = Math.max(...data);
    const barWidth = width / data.length;
    const gap = barWidth * 0.1;

    ctx.fillStyle = color;
    ctx.shadowBlur = 4;
    ctx.shadowColor = color;

    data.forEach((value, index) => {
      const barHeight = (value / max) * height;
      const x = index * barWidth + gap / 2;
      const y = height - barHeight;

      ctx.fillRect(x, y, barWidth - gap, barHeight);
    });
  }, [data, color, width, height]);

  return (
    <div className="transition-transform duration-300 hover:scale-105">
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
}