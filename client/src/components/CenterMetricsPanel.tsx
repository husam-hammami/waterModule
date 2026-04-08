import React, { useEffect, useRef, useState } from "react";
import { TrendingUp, Droplets, Zap, Activity, GripVertical, Trash2, Settings } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import {
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { GaugeConfigurationDialog } from './GaugeConfigurationDialog';

// Futuristic 3D Gauge component
function Futuristic3DGauge({ 
  value, 
  max, 
  color, 
  label, 
  size = 120 
}: { 
  value: number; 
  max: number; 
  color: string; 
  label: string; 
  size?: number; 
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 20;
    const percentage = (value / max) * 100;

    ctx.clearRect(0, 0, size, size);

    // Create gradient for 3D effect
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, color + '40');
    gradient.addColorStop(0.7, color + '20');
    gradient.addColorStop(1, color + '10');

    // Draw outer ring with 3D effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.3)';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Draw inner background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI * 0.75, Math.PI * 0.75);
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.2)';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw progress arc with consistent appearance
    const startAngle = -Math.PI * 0.75;
    const endAngle = startAngle + (percentage / 100) * Math.PI * 1.5;

    // Standard glow effect (no hover changes)
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Additional inner glow
    ctx.shadowBlur = 25;
    ctx.lineWidth = 8;
    ctx.stroke();

    // Reset shadow for other elements
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Draw center circle with 3D effect
    const centerGradient = ctx.createRadialGradient(
      centerX - 5, centerY - 5, 0,
      centerX, centerY, 15
    );
    centerGradient.addColorStop(0, color + '80');
    centerGradient.addColorStop(1, color + '20');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = centerGradient;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw tick marks
    for (let i = 0; i <= 10; i++) {
      const angle = startAngle + (i / 10) * Math.PI * 1.5;
      const x1 = centerX + Math.cos(angle) * (radius - 15);
      const y1 = centerY + Math.sin(angle) * (radius - 15);
      const x2 = centerX + Math.cos(angle) * (radius - 5);
      const y2 = centerY + Math.sin(angle) * (radius - 5);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw needle
    const needleAngle = startAngle + (percentage / 100) * Math.PI * 1.5;
    const needleLength = radius - 25;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.cos(needleAngle) * needleLength,
      centerY + Math.sin(needleAngle) * needleLength
    );
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Add needle glow
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.stroke();

  }, [value, max, color, size]);

  return (
    <div className="relative flex items-center justify-center">
      <div className="rounded-full transition-transform duration-300 hover:scale-125">
        <canvas ref={canvasRef} width={size} height={size} />
      </div>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-slate-400 font-mono">
        {label}
      </div>
    </div>
  );
}

// Individual gauge data interface
interface GaugeData {
  id: string;
  title: string;
  value: number;
  max: number;
  unit: string;
  color: string;
  icon: React.ElementType;
  change: string;
  status: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
}

// Sortable gauge item component
function SortableGauge({ gauge, onDelete, onConfigure }: { gauge: GaugeData; onDelete: (id: string) => void; onConfigure?: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: gauge.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = gauge.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'opacity-50 z-50' : 'z-10'} ring-2 ring-cyan-500/10 hover:ring-cyan-500/30 rounded-xl transition-all duration-200`}
    >
      <div className={`bg-gradient-to-br ${gauge.gradientFrom} ${gauge.gradientTo} rounded-xl p-6 border ${gauge.borderColor} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-600/5"></div>
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/80 to-transparent animate-pulse"></div>
        
        {/* Drag Handle and Delete Button - Always visible on hover */}
        <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 rounded-lg p-1 backdrop-blur-sm border border-slate-700/50">
          <button
            {...attributes}
            {...listeners}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-cyan-400 cursor-grab active:cursor-grabbing transition-colors"
            title="Drag to reorder"
          >
            <GripVertical className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConfigure && onConfigure();
            }}
            className="p-1.5 rounded hover:bg-cyan-700 text-slate-400 hover:text-cyan-400 transition-colors"
            title="Configure gauge"
          >
            <Settings className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(gauge.id);
            }}
            className="p-1.5 rounded hover:bg-red-700 text-slate-400 hover:text-red-400 transition-colors"
            title="Remove gauge"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4" style={{ color: gauge.color }} />
              <span className="text-sm font-semibold" style={{ color: gauge.color }}>{gauge.title}</span>
            </div>
            <div className="text-xs font-mono px-2 py-1 rounded" style={{ color: gauge.color, backgroundColor: `${gauge.color}20` }}>{gauge.change}</div>
          </div>
          
          <Futuristic3DGauge 
            value={gauge.value} 
            max={gauge.max} 
            color={gauge.color} 
            label={gauge.unit} 
            size={160} 
          />
          
          <div className="mt-2">
            <div className="text-white text-lg font-bold font-mono">{gauge.value > 1000 ? `${(gauge.value/1000).toFixed(1)}k` : gauge.value}</div>
            <div className="text-xs font-medium" style={{ color: gauge.color }}>{gauge.status}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_GAUGES: GaugeData[] = [
  {
    id: 'flow-rate',
    title: 'Flow Rate',
    value: 2400,
    max: 3000,
    unit: 'L/s',
    color: '#3b82f6',
    icon: Droplets,
    change: '+2.3%',
    status: 'OPTIMAL FLOW',
    gradientFrom: 'from-slate-900/90',
    gradientTo: 'via-blue-900/20 to-slate-800/80',
    borderColor: 'border-blue-500/30'
  },
  {
    id: 'pressure',
    title: 'Pressure',
    value: 85.2,
    max: 120,
    unit: 'PSI',
    color: '#f59e0b',
    icon: Activity,
    change: '-0.8%',
    status: 'STABLE',
    gradientFrom: 'from-slate-900/90',
    gradientTo: 'via-amber-900/20 to-slate-800/80',
    borderColor: 'border-amber-500/30'
  },
  {
    id: 'energy',
    title: 'Energy',
    value: 1850,
    max: 2500,
    unit: 'kW',
    color: '#10b981',
    icon: Zap,
    change: '+1.2%',
    status: 'EFFICIENT',
    gradientFrom: 'from-slate-900/90',
    gradientTo: 'via-emerald-900/20 to-slate-800/80',
    borderColor: 'border-emerald-500/30'
  },
  {
    id: 'quality',
    title: 'Quality',
    value: 97.8,
    max: 100,
    unit: '%',
    color: '#8b5cf6',
    icon: TrendingUp,
    change: '+0.5%',
    status: 'EXCELLENT',
    gradientFrom: 'from-slate-900/90',
    gradientTo: 'via-purple-900/20 to-slate-800/80',
    borderColor: 'border-purple-500/30'
  }
];

// Load gauges from localStorage
function loadGaugesFromStorage(): GaugeData[] {
  try {
    const stored = localStorage.getItem('hercules-center-gauges');
    if (stored) {
      const parsedGauges = JSON.parse(stored);
      // Restore icon functions since they can't be serialized
      return parsedGauges.map((gauge: any) => ({
        ...gauge,
        icon: DEFAULT_GAUGES.find(d => d.id === gauge.id)?.icon || Droplets
      }));
    }
  } catch (error) {
    console.warn('Failed to load center gauges from localStorage:', error);
  }
  return DEFAULT_GAUGES;
}

// Save gauges to localStorage
function saveGaugesToStorage(gauges: GaugeData[]) {
  try {
    // Remove icon functions before saving since they can't be serialized
    const serializable = gauges.map(({ icon, ...rest }) => rest);
    localStorage.setItem('hercules-center-gauges', JSON.stringify(serializable));
    console.log('🔒 SAVED: Center gauges positions to localStorage');
  } catch (error) {
    console.warn('Failed to save center gauges to localStorage:', error);
  }
}

export function CenterMetricsPanel() {
  const [gauges, setGauges] = useState<GaugeData[]>(() => loadGaugesFromStorage());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showConfigDialog, setShowConfigDialog] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setGauges((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        saveGaugesToStorage(newOrder);
        return newOrder;
      });
    }

    setActiveId(null);
  }

  function handleDelete(gaugeId: string) {
    setGauges((items) => {
      const filtered = items.filter((item) => item.id !== gaugeId);
      saveGaugesToStorage(filtered);
      return filtered;
    });
  }

  function handleConfigureGauges() {
    setShowConfigDialog(true);
  }

  function handleSaveGauges(updatedGauges: any[]) {
    setGauges(updatedGauges);
    saveGaugesToStorage(updatedGauges);
    setShowConfigDialog(false);
  }

  // Reset to default positions
  function resetToDefault() {
    setGauges(DEFAULT_GAUGES);
    saveGaugesToStorage(DEFAULT_GAUGES);
    console.log('🔄 RESET: Center gauges restored to default positions');
  }

  // Expose reset function globally for header button access
  React.useEffect(() => {
    (window as any).resetCenterGauges = resetToDefault;
    return () => {
      delete (window as any).resetCenterGauges;
    };
  }, []);

  const activeItem = activeId ? gauges.find((item) => item.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <SortableContext items={gauges.map(g => g.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-4 gap-6 mb-6">
          {gauges.map((gauge) => (
            <SortableGauge
              key={gauge.id}
              gauge={gauge}
              onDelete={handleDelete}
              onConfigure={handleConfigureGauges}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeItem ? (
          <SortableGauge gauge={activeItem} onDelete={() => {}} />
        ) : null}
      </DragOverlay>
      
      <GaugeConfigurationDialog
        isOpen={showConfigDialog}
        onClose={() => setShowConfigDialog(false)}
        gauges={gauges}
        onSave={handleSaveGauges}
      />
    </DndContext>
  );
}