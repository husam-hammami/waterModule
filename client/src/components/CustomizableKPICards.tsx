import React, { useState, useRef, useEffect } from "react";
import { GripVertical, Trash2, Settings } from "lucide-react";
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
import { KPIConfigurationDialog } from './KPIConfigurationDialog';

// Mini chart component for KPI visualizations
function MiniChart({ 
  type, 
  value, 
  data = [], 
  max = 100, 
  color = "#00ffff" 
}: { 
  type: string; 
  value: number; 
  data?: number[]; 
  max?: number; 
  color?: string; 
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 48;
    const height = 32;
    ctx.clearRect(0, 0, width, height);

    switch (type) {
      case 'sparkline':
        if (data.length > 1) {
          const maxVal = Math.max(...data);
          const minVal = Math.min(...data);
          const range = maxVal - minVal || 1;
          
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          
          data.forEach((val, i) => {
            const x = (i / (data.length - 1)) * (width - 4) + 2;
            const y = height - 4 - ((val - minVal) / range) * (height - 8);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          
          ctx.stroke();
          
          // Add glow effect
          ctx.shadowColor = color;
          ctx.shadowBlur = 8;
          ctx.stroke();
        }
        break;

      case 'progress':
        const percentage = (value / max) * 100;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 4;
        
        // Background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.3)';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Progress arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (percentage / 100) * 2 * Math.PI);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.stroke();
        break;

      case 'gauge':
        const gaugePercentage = (value / max) * 100;
        const gaugeCenterX = width / 2;
        const gaugeCenterY = height - 4;
        const gaugeRadius = Math.min(width, height * 2) / 2 - 4;
        
        // Background arc
        ctx.beginPath();
        ctx.arc(gaugeCenterX, gaugeCenterY, gaugeRadius, Math.PI, 0);
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.3)';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Progress arc
        ctx.beginPath();
        ctx.arc(gaugeCenterX, gaugeCenterY, gaugeRadius, Math.PI, Math.PI + (gaugePercentage / 100) * Math.PI);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.stroke();
        break;

      case 'bar':
        if (data.length > 0) {
          const maxVal = Math.max(...data);
          const barWidth = (width - 8) / data.length;
          
          data.forEach((val, i) => {
            const barHeight = (val / maxVal) * (height - 8);
            const x = i * barWidth + 4;
            const y = height - 4 - barHeight;
            
            ctx.fillStyle = color;
            ctx.fillRect(x, y, barWidth - 1, barHeight);
          });
        }
        break;

      case 'donut':
        const donutPercentage = (value / max) * 100;
        const donutCenterX = width / 2;
        const donutCenterY = height / 2;
        const outerRadius = Math.min(width, height) / 2 - 2;
        const innerRadius = outerRadius - 6;
        
        // Background
        ctx.beginPath();
        ctx.arc(donutCenterX, donutCenterY, outerRadius, 0, 2 * Math.PI);
        ctx.arc(donutCenterX, donutCenterY, innerRadius, 0, 2 * Math.PI, true);
        ctx.fillStyle = 'rgba(71, 85, 105, 0.3)';
        ctx.fill();
        
        // Progress
        ctx.beginPath();
        ctx.arc(donutCenterX, donutCenterY, outerRadius, -Math.PI / 2, -Math.PI / 2 + (donutPercentage / 100) * 2 * Math.PI);
        ctx.arc(donutCenterX, donutCenterY, innerRadius, -Math.PI / 2 + (donutPercentage / 100) * 2 * Math.PI, -Math.PI / 2, true);
        ctx.fillStyle = color;
        ctx.fill();
        break;

      case 'trend':
        if (data.length > 1) {
          const maxVal = Math.max(...data);
          const minVal = Math.min(...data);
          const range = maxVal - minVal || 1;
          
          // Line
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          
          data.forEach((val, i) => {
            const x = (i / (data.length - 1)) * (width - 8) + 4;
            const y = height - 8 - ((val - minVal) / range) * (height - 16);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          
          ctx.stroke();
          
          // Trend indicator dot
          const lastValue = data[data.length - 1];
          const lastX = width - 4;
          const lastY = height - 8 - ((lastValue - minVal) / range) * (height - 16);
          
          ctx.beginPath();
          ctx.arc(lastX, lastY, 2, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }
        break;
    }
  }, [type, value, data, max, color]);

  return <canvas ref={canvasRef} width={48} height={32} className="rounded" />;
}

// KPI card data interface
interface KPICardData {
  id: string;
  title: string;
  value: number | string;
  unit: string;
  chartType: 'sparkline' | 'progress' | 'gauge' | 'bar' | 'donut' | 'trend';
  color: string;
  data?: number[];
  max?: number;
  subtitle?: string;
  borderColor: string;
}

// Sortable KPI card component
function SortableKPICard({ card, onDelete, onConfigure }: { card: KPICardData; onDelete: (id: string) => void; onConfigure?: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`cyberpunk-card rounded-lg p-2 flex items-center ${card.borderColor} relative group ${
        isDragging ? 'opacity-50 z-50' : 'z-10'
      }`}
    >
      {/* Drag Handle, Configure, and Delete Buttons */}
      <div className="absolute top-1 right-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 rounded p-1">
        <button
          {...attributes}
          {...listeners}
          className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-cyan-400 cursor-grab active:cursor-grabbing transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onConfigure && onConfigure();
          }}
          className="p-1 rounded hover:bg-cyan-700 text-slate-400 hover:text-cyan-400 transition-colors"
          title="Configure KPI"
        >
          <Settings className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(card.id);
          }}
          className="p-1 rounded hover:bg-red-700 text-slate-400 hover:text-red-400 transition-colors"
          title="Delete card"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Card Content */}
      <div className="flex-1 min-w-0">
        <div className="text-xs text-[hsl(180,100%,50%)] font-mono tracking-wider leading-none mb-1">
          {card.title}
        </div>
        <div className="text-lg text-white font-mono font-bold leading-none">
          {card.value}{typeof card.value === 'number' && card.value < 10 ? '' : 'K'}
        </div>
        <div className="text-xs text-gray-400 font-mono leading-none">
          {card.subtitle || card.unit}
        </div>
      </div>
      <div className="ml-2 chart-3d-hover rounded">
        <MiniChart 
          type={card.chartType} 
          value={typeof card.value === 'number' ? card.value : 0}
          data={card.data}
          max={card.max}
          color={card.color} 
        />
      </div>
    </div>
  );
}

// Default KPI cards data
const DEFAULT_KPI_CARDS: KPICardData[] = [
  {
    id: 'total-output',
    title: 'TOTAL OUTPUT',
    value: 45.2,
    unit: 'm³/day',
    chartType: 'sparkline',
    color: '#00ffff',
    data: [38, 42, 39, 44, 47, 45, 45.2],
    borderColor: 'border-[hsl(180,100%,50%,0.3)]'
  },
  {
    id: 'avg-efficiency',
    title: 'AVG EFFICIENCY',
    value: 94,
    unit: '%',
    chartType: 'progress',
    color: '#00ff88',
    max: 100,
    subtitle: 'Target: 95%',
    borderColor: 'border-[hsl(158,100%,50%,0.3)]'
  },
  {
    id: 'energy-usage',
    title: 'ENERGY USAGE',
    value: 2.4,
    unit: 'kWh/m³',
    chartType: 'gauge',
    color: '#ffaa00',
    max: 4,
    borderColor: 'border-[hsl(45,100%,50%,0.3)]'
  },
  {
    id: 'facilities',
    title: 'FACILITIES',
    value: 8,
    unit: 'Online',
    chartType: 'bar',
    color: '#00ff88',
    data: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    subtitle: '8 of 10',
    borderColor: 'border-[hsl(158,100%,50%,0.3)]'
  },
  {
    id: 'active-alerts',
    title: 'ACTIVE ALERTS',
    value: 3,
    unit: 'Active',
    chartType: 'donut',
    color: '#ff6b6b',
    data: [1, 2, 0, 1, 0, 2, 1],
    max: 10,
    borderColor: 'border-[hsl(0,70%,60%,0.3)]'
  },
  {
    id: 'quality-score',
    title: 'QUALITY SCORE',
    value: 97,
    unit: 'Score',
    chartType: 'trend',
    color: '#8b5cf6',
    data: [95, 96, 94, 97, 98, 96, 97],
    borderColor: 'border-[hsl(258,90%,66%,0.3)]'
  }
];

// Load KPI cards from localStorage
function loadKPICardsFromStorage(): KPICardData[] {
  try {
    const stored = localStorage.getItem('hercules-kpi-cards');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load KPI cards from localStorage:', error);
  }
  return DEFAULT_KPI_CARDS;
}

// Save KPI cards to localStorage
function saveKPICardsToStorage(cards: KPICardData[]) {
  try {
    localStorage.setItem('hercules-kpi-cards', JSON.stringify(cards));
    console.log('🔒 SAVED: KPI cards positions to localStorage');
  } catch (error) {
    console.warn('Failed to save KPI cards to localStorage:', error);
  }
}

export function CustomizableKPICards() {
  const [cards, setCards] = useState<KPICardData[]>(() => loadKPICardsFromStorage());
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
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        saveKPICardsToStorage(newOrder);
        return newOrder;
      });
    }

    setActiveId(null);
  }

  function handleDelete(cardId: string) {
    setCards((items) => {
      const filtered = items.filter((item) => item.id !== cardId);
      saveKPICardsToStorage(filtered);
      return filtered;
    });
  }

  function handleConfigureCards() {
    setShowConfigDialog(true);
  }

  function handleSaveCards(updatedCards: any[]) {
    setCards(updatedCards);
    saveKPICardsToStorage(updatedCards);
    setShowConfigDialog(false);
  }

  // Reset to default positions
  function resetToDefault() {
    setCards(DEFAULT_KPI_CARDS);
    saveKPICardsToStorage(DEFAULT_KPI_CARDS);
    console.log('🔄 RESET: KPI cards restored to default positions');
  }

  // Add new KPI card (for future use with Add Chart dialog)
  function addNewCard(cardData: Partial<KPICardData>) {
    const newCard: KPICardData = {
      id: `kpi-${Date.now()}`,
      title: cardData.title || 'NEW METRIC',
      value: cardData.value || 0,
      unit: cardData.unit || 'Units',
      chartType: cardData.chartType || 'sparkline',
      color: cardData.color || '#00ffff',
      data: cardData.data || [0, 0, 0, 0, 0],
      max: cardData.max || 100,
      borderColor: cardData.borderColor || 'border-[hsl(180,100%,50%,0.3)]'
    };

    setCards((items) => {
      const newCards = [...items, newCard];
      saveKPICardsToStorage(newCards);
      return newCards;
    });
  }

  // Expose functions globally for header button access
  React.useEffect(() => {
    (window as any).resetKPICards = resetToDefault;
    (window as any).addNewKPICard = addNewCard;
    return () => {
      delete (window as any).resetKPICards;
      delete (window as any).addNewKPICard;
    };
  }, []);

  const activeItem = activeId ? cards.find((item) => item.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <SortableContext items={cards.map(c => c.id)} strategy={rectSortingStrategy}>
        <div className="h-16 flex-shrink-0 grid grid-cols-6 gap-2 items-stretch">
          {cards.map((card) => (
            <SortableKPICard
              key={card.id}
              card={card}
              onDelete={handleDelete}
              onConfigure={handleConfigureCards}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay modifiers={[restrictToWindowEdges]}>
        {activeItem ? (
          <div className={`cyberpunk-card rounded-lg p-2 flex items-center ${activeItem.borderColor}`}>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-[hsl(180,100%,50%)] font-mono tracking-wider leading-none mb-1">
                {activeItem.title}
              </div>
              <div className="text-lg text-white font-mono font-bold leading-none">
                {activeItem.value}{typeof activeItem.value === 'number' && activeItem.value < 10 ? '' : 'K'}
              </div>
              <div className="text-xs text-gray-400 font-mono leading-none">
                {activeItem.subtitle || activeItem.unit}
              </div>
            </div>
            <div className="ml-2 chart-3d-hover rounded">
              <MiniChart 
                type={activeItem.chartType} 
                value={typeof activeItem.value === 'number' ? activeItem.value : 0}
                data={activeItem.data}
                max={activeItem.max}
                color={activeItem.color} 
              />
            </div>
          </div>
        ) : null}
      </DragOverlay>
      
      <KPIConfigurationDialog
        isOpen={showConfigDialog}
        onClose={() => setShowConfigDialog(false)}
        cards={cards}
        onSave={handleSaveCards}
      />
    </DndContext>
  );
}