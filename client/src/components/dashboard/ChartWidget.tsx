import { useEffect, useRef, useState } from "react";
import { Settings, X } from "lucide-react";
import { ChartConfigDialog } from "./ChartConfigDialog";

interface ChartWidgetProps {
  config: any;
  onUpdate?: (config: any) => void;
  onDelete?: () => void;
  isEditMode?: boolean;
}

export function ChartWidget({ config, onUpdate, onDelete, isEditMode = false }: ChartWidgetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showConfigDialog, setShowConfigDialog] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    renderChart(canvasRef.current, config);
  }, [config]);

  const renderChart = (canvas: HTMLCanvasElement, config: any) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (config.chartType || config.type) {
      case 'gauge':
        renderGauge(ctx, config, canvas.width, canvas.height);
        break;
      case 'line':
        renderLineChart(ctx, config, canvas.width, canvas.height);
        break;
      case 'bar':
        renderBarChart(ctx, config, canvas.width, canvas.height);
        break;
      case 'donut':
        renderDonutChart(ctx, config, canvas.width, canvas.height);
        break;
      case 'progress':
        renderProgressBars(ctx, config, canvas.width, canvas.height);
        break;
      default:
        renderDefaultChart(ctx, config, canvas.width, canvas.height);
    }
  };

  const renderGauge = (ctx: CanvasRenderingContext2D, config: any, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    const value = config.value || 75;
    const max = config.max || 100;
    const percentage = (value / max) * 100;

    // Background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI * 0.75, Math.PI * 0.75);
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.3)';
    ctx.lineWidth = 12;
    ctx.stroke();

    // Progress arc
    const startAngle = -Math.PI * 0.75;
    const endAngle = startAngle + (percentage / 100) * Math.PI * 1.5;
    
    ctx.shadowColor = config.color || '#06b6d4';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = config.color || '#06b6d4';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Center text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 18px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`${value.toFixed(1)}`, centerX, centerY - 5);
    
    ctx.font = '12px system-ui';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(config.unit || '', centerX, centerY + 15);
  };

  const renderLineChart = (ctx: CanvasRenderingContext2D, config: any, width: number, height: number) => {
    const data = generateTimeSeriesData();
    const padding = 30;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    // Draw line
    ctx.strokeStyle = config.color || '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((value, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = padding + (1 - (value - min) / range) * chartHeight;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();

    // Add glow effect
    ctx.shadowColor = config.color || '#06b6d4';
    ctx.shadowBlur = 6;
    ctx.stroke();

    // Fill area under curve
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, (config.color || '#06b6d4') + '40');
    gradient.addColorStop(1, (config.color || '#06b6d4') + '05');
    
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
  };

  const renderBarChart = (ctx: CanvasRenderingContext2D, config: any, width: number, height: number) => {
    const data = [65, 80, 55, 75, 90];
    const padding = 30;
    const barWidth = (width - padding * 2) / data.length - 10;
    const maxValue = Math.max(...data);

    ctx.fillStyle = config.color || '#06b6d4';
    data.forEach((value, index) => {
      const x = padding + index * (barWidth + 10);
      const barHeight = (value / maxValue) * (height - padding * 2);
      const y = height - padding - barHeight;
      
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Add glow effect
      ctx.shadowColor = config.color || '#06b6d4';
      ctx.shadowBlur = 6;
      ctx.fillRect(x, y, barWidth, barHeight);
      ctx.shadowBlur = 0;
    });
  };

  const renderDonutChart = (ctx: CanvasRenderingContext2D, config: any, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    const segments = config.segments || [
      { name: 'Filtration', value: 96.8, color: '#10b981' },
      { name: 'Purification', value: 94.2, color: '#06b6d4' },
      { name: 'Disinfection', value: 98.5, color: '#8b5cf6' }
    ];

    let currentAngle = -Math.PI / 2;
    const total = segments.reduce((sum: number, seg: any) => sum + seg.value, 0);

    segments.forEach((segment: any) => {
      const sliceAngle = (segment.value / total) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, radius * 0.5, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fillStyle = segment.color;
      ctx.fill();
      
      currentAngle += sliceAngle;
    });
  };

  const renderProgressBars = (ctx: CanvasRenderingContext2D, config: any, width: number, height: number) => {
    const chemicals = config.chemicals || [
      { name: 'Chlorine', level: 85, color: '#06b6d4' },
      { name: 'Coagulant', level: 72, color: '#8b5cf6' },
      { name: 'pH Adjuster', level: 91, color: '#f59e0b' }
    ];

    const barHeight = 20;
    const spacing = 15;
    const startY = (height - (chemicals.length * (barHeight + spacing) - spacing)) / 2;

    chemicals.forEach((chemical: any, index: number) => {
      const y = startY + index * (barHeight + spacing);
      
      // Background bar
      ctx.fillStyle = 'rgba(71, 85, 105, 0.3)';
      ctx.fillRect(20, y, width - 40, barHeight);
      
      // Progress bar
      const progressWidth = ((width - 40) * chemical.level) / 100;
      ctx.fillStyle = chemical.color;
      ctx.fillRect(20, y, progressWidth, barHeight);
      
      // Label
      ctx.fillStyle = 'white';
      ctx.font = '12px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText(`${chemical.name}: ${chemical.level}%`, 25, y + 14);
    });
  };

  const renderDefaultChart = (ctx: CanvasRenderingContext2D, config: any, width: number, height: number) => {
    // Fallback chart
    ctx.fillStyle = 'rgba(71, 85, 105, 0.3)';
    ctx.fillRect(20, 20, width - 40, height - 40);
    ctx.fillStyle = 'white';
    ctx.font = '14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(config.title || 'Chart', width / 2, height / 2);
  };

  const generateTimeSeriesData = () => {
    return Array.from({ length: 12 }, () => 60 + Math.random() * 40);
  };

  const handleConfigSave = (newConfig: any) => {
    if (onUpdate) {
      onUpdate({ ...config, ...newConfig });
    }
  };

  return (
    <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-300 truncate">
          {config.title || 'Chart'}
        </h3>
        {isEditMode && (
          <div className="flex gap-1">
            <button
              onClick={() => setShowConfigDialog(true)}
              className="p-1 hover:bg-slate-700/50 rounded text-slate-400 hover:text-cyan-400 transition-colors"
              title="Configure Chart"
            >
              <Settings size={14} />
            </button>
            <button
              onClick={onDelete}
              className="p-1 hover:bg-slate-700/50 rounded text-slate-400 hover:text-red-400 transition-colors"
              title="Delete Chart"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={300}
          height={180}
          className="max-w-full max-h-full"
        />
      </div>

      {/* Configuration Dialog */}
      <ChartConfigDialog
        isOpen={showConfigDialog}
        onClose={() => setShowConfigDialog(false)}
        onSave={handleConfigSave}
        initialConfig={config}
        chartType={config.chartType || config.type || 'gauge'}
      />
    </div>
  );
}