import React, { useRef, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, RadialLinearScale } from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
);

interface ChartRendererProps {
  chartConfig: {
    title: string;
    type: string;
    chartType: string;
    color: string;
    dataSources: Array<{
      id: string;
      name: string;
      unit: string;
      description: string;
    }>;
    unit: string;
    value?: number;
    max?: number;
    segments?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    chemicals?: Array<{
      name: string;
      level: number;
      color: string;
    }>;
  };
  className?: string;
  height?: string;
}

function generateMockData(chartType: string, dataSources: any[], color: string) {
  const now = new Date();
  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = new Date(now.getTime() - (11 - i) * 60 * 60 * 1000);
    return hour.getHours().toString().padStart(2, '0') + ':00';
  });

  switch (chartType) {
    case 'line':
      return {
        labels: hours,
        datasets: dataSources.map((source, index) => ({
          label: source.name,
          data: Array.from({ length: 12 }, () => 70 + Math.random() * 30),
          borderColor: index === 0 ? color : `hsl(${200 + index * 60}, 70%, 50%)`,
          backgroundColor: `${index === 0 ? color : `hsl(${200 + index * 60}, 70%, 50%)`}20`,
          tension: 0.4,
          fill: false,
          pointRadius: 3,
          pointHoverRadius: 6,
        }))
      };

    case 'bar':
      return {
        labels: dataSources.map(source => source.name.split(' ')[0]),
        datasets: [{
          label: 'Current Level',
          data: dataSources.map(() => 60 + Math.random() * 40),
          backgroundColor: dataSources.map((_, index) => 
            index === 0 ? color + '80' : `hsl(${200 + index * 60}, 70%, 50%)80`
          ),
          borderColor: dataSources.map((_, index) => 
            index === 0 ? color : `hsl(${200 + index * 60}, 70%, 50%)`
          ),
          borderWidth: 2,
        }]
      };

    case 'area':
      return {
        labels: hours,
        datasets: dataSources.map((source, index) => ({
          label: source.name,
          data: Array.from({ length: 12 }, () => 50 + Math.random() * 50),
          borderColor: index === 0 ? color : `hsl(${200 + index * 60}, 70%, 50%)`,
          backgroundColor: `${index === 0 ? color : `hsl(${200 + index * 60}, 70%, 50%)`}40`,
          tension: 0.4,
          fill: true,
          pointRadius: 2,
        }))
      };

    default:
      return {
        labels: hours,
        datasets: [{
          label: dataSources[0]?.name || 'Data',
          data: Array.from({ length: 12 }, () => 70 + Math.random() * 30),
          borderColor: color,
          backgroundColor: color + '20',
          tension: 0.4,
          fill: false,
        }]
      };
  }
}

function GaugeChart({ value, max, color, label, unit }: { value: number; max: number; color: string; label: string; unit: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = 80;
    const centerY = 70;
    const radius = 50;
    const progress = value / max;

    ctx.clearRect(0, 0, 160, 120);

    // Background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.3)';
    ctx.lineWidth = 12;
    ctx.stroke();

    // Progress arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + (Math.PI * progress));
    ctx.strokeStyle = color;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center text
    ctx.fillStyle = color;
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(value)}`, centerX, centerY - 5);
    
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText(unit, centerX, centerY + 10);

  }, [value, max, color, unit]);

  return <canvas ref={canvasRef} width={160} height={120} />;
}

function DonutChart({ segments, title }: { segments: any[], title: string }) {
  const data = {
    labels: segments.map(s => s.name),
    datasets: [{
      data: segments.map(s => s.value),
      backgroundColor: segments.map(s => s.color + '80'),
      borderColor: segments.map(s => s.color),
      borderWidth: 2,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: '#ffffff',
          font: { size: 10 },
          usePointStyle: true,
        }
      }
    },
    cutout: '60%',
  };

  return <Chart type="doughnut" data={data} options={options} />;
}

function ProgressBars({ chemicals }: { chemicals: any[] }) {
  return (
    <div className="space-y-3">
      {chemicals.map((chemical, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">{chemical.name}</span>
            <span style={{ color: chemical.color }}>{Math.round(chemical.level)}%</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${chemical.level}%`, 
                backgroundColor: chemical.color 
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartRenderer({ chartConfig, className = "", height = "h-40" }: ChartRendererProps) {
  const { title, type, chartType, color, dataSources, value = 75, max = 100, segments, chemicals } = chartConfig;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: type === 'donut' ? true : (dataSources && dataSources.length > 1),
        position: 'bottom' as const,
        labels: {
          color: '#ffffff',
          font: { size: 10 },
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#06b6d4',
        bodyColor: '#ffffff',
        borderColor: color,
        borderWidth: 1,
      }
    },
    scales: type === 'donut' ? {} : {
      x: {
        grid: { color: 'rgba(71, 85, 105, 0.3)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(71, 85, 105, 0.3)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      }
    }
  };

  return (
    <div className={`bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-cyan-300">{title}</h4>
        <div className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded-full">
          {(type || 'CHART').toUpperCase()}
        </div>
      </div>
      
      <div className={height}>
        {type === 'gauge' && (
          <div className="flex justify-center items-center h-full">
            <GaugeChart 
              value={value} 
              max={max} 
              color={color} 
              label={title}
              unit={dataSources?.[0]?.unit || ''}
            />
          </div>
        )}
        
        {type === 'donut' && segments && (
          <DonutChart segments={segments} title={title} />
        )}
        
        {type === 'progress' && chemicals && (
          <div className="flex justify-center items-center h-full">
            <div className="w-full max-w-xs">
              <ProgressBars chemicals={chemicals} />
            </div>
          </div>
        )}
        
        {type && ['line', 'bar', 'area'].includes(type) && (
          <Chart 
            type={type === 'area' ? 'line' : type as any}
            data={generateMockData(type, dataSources || [], color)}
            options={chartOptions}
          />
        )}
      </div>
    </div>
  );
}