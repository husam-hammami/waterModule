import React, { useState, useCallback, useEffect } from 'react'
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
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { Plus, Settings, X, Save, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DraggableWidget } from './DraggableWidget'
import { WaterWidget } from './WaterWidget'
import { WidgetLibrary } from './WidgetLibrary'
import { WidgetConfigPanel } from './WidgetConfigPanel'
import { ChartSelectionDialog } from './ChartSelectionDialog'
import { ChartWidget } from './ChartWidget'
import { usePersistentWidgets } from '../../hooks/usePersistentWidgets'

interface WaterWidgetType {
  id: string
  type: 'kpi' | 'chart' | 'gauge' | 'network' | 'table' | 'process-flow'
  title: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  config: {
    dataSource?: string
    parameters?: Array<{
      id: string
      name: string
      unit: string
      color: string
      category: string
    }>
    chartType?: 'line' | 'bar' | 'pie' | 'donut' | 'area' | 'scatter'
    displayMode?: 'single' | 'dual' | 'multiple'
    refreshInterval?: number
    thresholds?: Array<{ value: number; color: string; label: string }>
    styling?: {
      backgroundColor?: string
      borderColor?: string
      textColor?: string
    }
  }
  data?: any[]
}

interface CustomizableGaugesSectionProps {
  isCustomizing: boolean
  onCustomizationComplete: () => void
  position?: 'left' | 'right'
}

// Start with empty widgets - users will add their own custom ones
const getDefaultWidgets = (position: 'left' | 'right'): WaterWidgetType[] => {
  return []
}

export function CustomizableGaugesSection({ 
  isCustomizing, 
  onCustomizationComplete, 
  position = 'left' 
}: CustomizableGaugesSectionProps) {
  // Use the persistent widgets hook
  const {
    widgets,
    addWidget,
    updateWidget,
    deleteWidget,
    reorderWidgets,
    clearAllWidgets
  } = usePersistentWidgets(position);
  
  const [selectedWidget, setSelectedWidget] = useState<WaterWidgetType | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false)
  const [showChartDialog, setShowChartDialog] = useState(false)

  // Remove old persistence logic - now handled by the hook

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = widgets.findIndex((item) => item.id === active.id)
      const newIndex = widgets.findIndex((item) => item.id === over?.id)
      const newOrder = arrayMove(widgets, oldIndex, newIndex)
      
      console.log(`✓ Reordered widgets - moved from position ${oldIndex} to ${newIndex}`);
      reorderWidgets(newOrder);
    }

    setActiveId(null)
  }, [widgets, reorderWidgets])

  const addWidgetOld = useCallback((widgetType: WaterWidgetType['type']) => {
    const newWidget: WaterWidgetType = {
      id: `widget-${position}-${Date.now()}`,
      type: widgetType,
      title: `New ${widgetType.charAt(0).toUpperCase() + widgetType.slice(1)}`,
      position: { x: 0, y: widgets.length },
      size: { width: 360, height: widgetType === 'gauge' ? 180 : widgetType === 'kpi' ? 120 : 200 },
      config: {
        dataSource: 'water-treatment',
        displayMode: 'single',
        refreshInterval: 30,
        parameters: [
          { id: 'flow_rate', name: 'Flow Rate', unit: 'L/min', color: '#00ffff', category: 'Flow & Pressure' }
        ],
        thresholds: []
      }
    }
    addWidget(newWidget)
    setSelectedWidget(newWidget)
    setShowWidgetLibrary(false)
  }, [widgets.length, position, addWidget])

  const handleAddChart = useCallback((chartType: string, chartConfig: any) => {
    const newWidget: WaterWidgetType = {
      id: `chart-${position}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: chartConfig.type || 'gauge',
      title: chartConfig.title,
      position: { x: 0, y: widgets.length },
      size: { width: 360, height: 200 },
      config: {
        ...chartConfig,
        dataSource: 'water-treatment',
        refreshInterval: 30,
        createdAt: Date.now(),
        persistent: true // Mark as persistent
      }
    }
    
    addWidget(newWidget);
    console.log(`✓ Added new chart "${chartConfig.title}" to ${position} panel`);
  }, [widgets.length, position, addWidget])

  const updateWidgetOld = useCallback((updatedWidget: WaterWidgetType) => {
    updateWidget(updatedWidget);
    setSelectedWidget(updatedWidget);
  }, [updateWidget])

  const deleteWidgetOld = useCallback((widgetId: string) => {
    deleteWidget(widgetId);
    if (selectedWidget?.id === widgetId) {
      setSelectedWidget(null);
    }
  }, [selectedWidget, deleteWidget])

  const resetLayout = useCallback(() => {
    clearAllWidgets();
  }, [clearAllWidgets])

  const handleSave = useCallback(() => {
    onCustomizationComplete()
    setSelectedWidget(null)
  }, [onCustomizationComplete])

  return (
    <div className="h-full flex flex-col relative">
      {/* Simplified Header - Always show charts */}
      <div className="flex-shrink-0 p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg mb-2 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-slate-300">
            {position === 'left' ? 'Left' : 'Right'} Panel Charts
            <span className="text-xs text-slate-500 ml-2">
              ({widgets.length} charts)
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowChartDialog(true)}
              className="p-1.5 rounded bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30 transition-colors"
              title="Add Chart Widget"
            >
              <Plus size={14} />
            </button>
            {widgets.length > 0 && (
              <button
                onClick={resetLayout}
                className="p-1.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/50 hover:bg-orange-500/30 transition-colors"
                title="Clear All Charts"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>
        <div className="text-xs text-slate-500">
          Drag to reorder • Click to configure • Delete unwanted charts
        </div>
      </div>

      {/* Widgets Container */}
      <div className="flex-1 overflow-y-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToWindowEdges]}
        >
          <SortableContext 
            items={widgets.map(w => w.id)} 
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {widgets.map((widget) => (
                <div key={widget.id} className="relative">
                  <DraggableWidget
                    widget={widget}
                    isEditMode={true}
                    isSelected={selectedWidget?.id === widget.id}
                    onClick={() => setSelectedWidget(widget)}
                    onDelete={() => deleteWidgetOld(widget.id)}
                    onUpdate={updateWidgetOld}
                  />
                </div>
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeId ? (
              <DraggableWidget
                widget={widgets.find(w => w.id === activeId)!}
                isEditMode={isCustomizing}
                isSelected={false}
                onClick={() => {}}
                onDelete={() => {}}
                onUpdate={() => {}}
                isDragging
              />
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Empty State */}
        {widgets.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-800/50 flex items-center justify-center">
                <Plus size={24} className="text-slate-600" />
              </div>
              <p className="text-sm text-slate-400 mb-3">
                {position === 'left' ? 'Left Panel' : 'Right Panel'} - No custom widgets
              </p>
              <p className="text-xs text-slate-500 mb-4">
                Add widgets to customize this panel
              </p>
              <button
                onClick={() => setShowChartDialog(true)}
                className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded hover:bg-cyan-500/30 transition-colors"
              >
                <Plus size={16} className="inline mr-2" />
                Add First Chart
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Configuration Panel */}
      {isCustomizing && selectedWidget && (
        <div className="absolute top-0 right-0 w-80 h-full bg-slate-900/95 backdrop-blur-sm border-l border-slate-700/50 z-50">
          <WidgetConfigPanel
            widget={selectedWidget}
            onUpdate={updateWidgetOld}
            onClose={() => setSelectedWidget(null)}
          />
        </div>
      )}

      {/* Widget Library Modal */}
      {showWidgetLibrary && (
        <WidgetLibrary
          onAddWidget={addWidgetOld}
          onClose={() => setShowWidgetLibrary(false)}
        />
      )}

      {/* Chart Selection Dialog */}
      <ChartSelectionDialog
        isOpen={showChartDialog}
        onClose={() => setShowChartDialog(false)}
        onAddChart={handleAddChart}
        position={position}
      />
    </div>
  )
}