import { useState, useEffect, useRef } from "react";
import { X, Save, Palette, Settings } from "lucide-react";

interface ChartConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
  initialConfig: any;
  chartType: string;
}

export function ChartConfigDialog({ isOpen, onClose, onSave, initialConfig, chartType }: ChartConfigDialogProps) {
  const [config, setConfig] = useState(initialConfig);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  // Live preview rendering
  useEffect(() => {
    if (!isOpen || !canvasRef.current || !config) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render preview based on chart type
    switch (chartType) {
      case 'gauge':
        renderGaugePreview(ctx, config, canvas.width, canvas.height);
        break;
      case 'line':
        renderLinePreview(ctx, config, canvas.width, canvas.height);
        break;
      case 'bar':
        renderBarPreview(ctx, config, canvas.width, canvas.height);
        break;
      case 'donut':
        renderDonutPreview(ctx, config, canvas.width, canvas.height);
        break;
      default:
        renderDefaultPreview(ctx, config, canvas.width, canvas.height);
    }
  }, [config, chartType, isOpen]);

  const renderGaugePreview = (ctx: CanvasRenderingContext2D, config: any, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    const value = config.value || 75;
    const max = config.max || 100;
    const percentage = (value / max) * 100;

    // Background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI * 0.75, Math.PI * 0.75);
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.3)';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Progress arc
    const startAngle = -Math.PI * 0.75;
    const endAngle = startAngle + (percentage / 100) * Math.PI * 1.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = config.color || '#06b6d4';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Center text
    ctx.fillStyle = 'white';
    ctx.font = '16px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`${value}${config.unit || ''}`, centerX, centerY);
  };

  const renderLinePreview = (ctx: CanvasRenderingContext2D, config: any, width: number, height: number) => {
    const data = [20, 45, 30, 60, 40, 80, 65];
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    ctx.strokeStyle = config.color || '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((value, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = padding + (1 - value / 100) * chartHeight;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
  };

  const renderBarPreview = (ctx: CanvasRenderingContext2D, config: any, width: number, height: number) => {
    const data = [60, 80, 45, 90];
    const padding = 20;
    const barWidth = (width - padding * 2) / data.length - 5;

    ctx.fillStyle = config.color || '#06b6d4';
    data.forEach((value, index) => {
      const x = padding + index * (barWidth + 5);
      const barHeight = (value / 100) * (height - padding * 2);
      const y = height - padding - barHeight;
      ctx.fillRect(x, y, barWidth, barHeight);
    });
  };

  const renderDonutPreview = (ctx: CanvasRenderingContext2D, config: any, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    const segments = config.segments || [
      { value: 40, color: '#10b981' },
      { value: 35, color: '#06b6d4' },
      { value: 25, color: '#8b5cf6' }
    ];

    let currentAngle = -Math.PI / 2;
    const total = segments.reduce((sum: number, seg: any) => sum + seg.value, 0);

    segments.forEach((segment: any) => {
      const sliceAngle = (segment.value / total) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, radius * 0.6, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fillStyle = segment.color;
      ctx.fill();
      
      currentAngle += sliceAngle;
    });
  };

  const renderDefaultPreview = (ctx: CanvasRenderingContext2D, config: any, width: number, height: number) => {
    ctx.fillStyle = 'rgba(71, 85, 105, 0.3)';
    ctx.fillRect(20, 20, width - 40, height - 40);
    ctx.fillStyle = 'white';
    ctx.font = '14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Chart Preview', width / 2, height / 2);
  };

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 max-w-4xl w-full mx-4 max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <Settings className="text-cyan-400" size={20} />
            <div>
              <h2 className="text-xl font-bold text-cyan-400">Configure Chart</h2>
              <p className="text-slate-400 text-sm mt-1">Customize your {config.title || 'chart'} settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex overflow-hidden" style={{ height: '500px' }}>
          {/* Configuration Panel */}
          <div className="w-1/2 p-6 overflow-y-auto border-r border-slate-700/50">
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Chart Title</label>
                <input
                  type="text"
                  value={config.title || ''}
                  onChange={(e) => setConfig({...config, title: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:border-cyan-500/50 focus:outline-none"
                  placeholder="Enter chart title"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Primary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.color || '#06b6d4'}
                    onChange={(e) => setConfig({...config, color: e.target.value})}
                    className="w-12 h-10 bg-slate-800/50 border border-slate-600/50 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.color || '#06b6d4'}
                    onChange={(e) => setConfig({...config, color: e.target.value})}
                    className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:border-cyan-500/50 focus:outline-none"
                    placeholder="#06b6d4"
                  />
                </div>
              </div>

              {/* Chart-specific configurations */}
              {chartType === 'gauge' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Current Value</label>
                    <input
                      type="number"
                      value={config.value || 0}
                      onChange={(e) => setConfig({...config, value: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:border-cyan-500/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Maximum Value</label>
                    <input
                      type="number"
                      value={config.max || 100}
                      onChange={(e) => setConfig({...config, max: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:border-cyan-500/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Unit</label>
                    <input
                      type="text"
                      value={config.unit || ''}
                      onChange={(e) => setConfig({...config, unit: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:border-cyan-500/50 focus:outline-none"
                      placeholder="L/s, PSI, %"
                    />
                  </div>
                </>
              )}

              {/* Refresh Rate */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Refresh Rate (seconds)</label>
                <select
                  value={config.refreshInterval || 30}
                  onChange={(e) => setConfig({...config, refreshInterval: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:border-cyan-500/50 focus:outline-none"
                >
                  <option value={5}>5 seconds</option>
                  <option value={10}>10 seconds</option>
                  <option value={30}>30 seconds</option>
                  <option value={60}>1 minute</option>
                  <option value={300}>5 minutes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-1/2 p-6">
            <div className="h-full flex flex-col">
              <h3 className="text-lg font-semibold text-slate-300 mb-4">Live Preview</h3>
              <div className="flex-1 bg-slate-800/30 rounded-lg border border-slate-700/50 flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={200}
                  className="max-w-full max-h-full"
                />
              </div>
              <div className="mt-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div className="text-sm text-slate-400">
                  <div><span className="text-slate-300">Title:</span> {config.title || 'Untitled Chart'}</div>
                  <div><span className="text-slate-300">Type:</span> {chartType.toUpperCase()}</div>
                  <div><span className="text-slate-300">Color:</span> <span style={{color: config.color}}>{config.color}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-700/50 bg-slate-900/50">
          <div className="text-sm text-slate-400">
            Configure your chart settings and see a live preview
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-cyan-600/80 text-white hover:bg-cyan-600 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-cyan-500/20"
            >
              <Save size={16} className="inline mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}