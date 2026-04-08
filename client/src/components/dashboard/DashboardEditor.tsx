import React, { useState, useCallback } from 'react'
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
  rectSortingStrategy
} from '@dnd-kit/sortable'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { DraggableWidget } from './DraggableWidget'
import { WidgetLibrary } from './WidgetLibrary'
import { WidgetConfigPanel } from './WidgetConfigPanel'
import { Save, Eye, Settings, Grid3x3, Plus, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface WaterWidget {
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

interface DashboardEditorProps {
  widgets: WaterWidget[]
  onSave: (widgets: WaterWidget[]) => void
  onPreview: () => void
  isEditMode: boolean
  onToggleEditMode: () => void
}

export function DashboardEditor({ 
  widgets, 
  onSave, 
  onPreview, 
  isEditMode, 
  onToggleEditMode 
}: DashboardEditorProps) {
  const [localWidgets, setLocalWidgets] = useState<WaterWidget[]>(widgets)
  const [selectedWidget, setSelectedWidget] = useState<WaterWidget | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false)
  const [gridLayout, setGridLayout] = useState<'auto' | '2x2' | '3x3' | '4x4' | 'custom'>('auto')

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
      setLocalWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }

    setActiveId(null)
  }, [])

  const addWidget = useCallback((widgetType: WaterWidget['type']) => {
    const newWidget: WaterWidget = {
      id: `widget-${Date.now()}`,
      type: widgetType,
      title: `New ${widgetType.charAt(0).toUpperCase() + widgetType.slice(1)} Widget`,
      position: { x: 0, y: 0 },
      size: { width: 300, height: 200 },
      config: {
        dataSource: 'water-treatment',
        displayMode: 'single',
        refreshInterval: 30,
        parameters: [],
        thresholds: []
      }
    }
    setLocalWidgets(prev => [...prev, newWidget])
    setSelectedWidget(newWidget)
    setShowWidgetLibrary(false)
  }, [])

  const updateWidget = useCallback((updatedWidget: WaterWidget) => {
    setLocalWidgets(prev => 
      prev.map(widget => 
        widget.id === updatedWidget.id ? updatedWidget : widget
      )
    )
    setSelectedWidget(updatedWidget)
  }, [])

  const deleteWidget = useCallback((widgetId: string) => {
    setLocalWidgets(prev => prev.filter(widget => widget.id !== widgetId))
    if (selectedWidget?.id === widgetId) {
      setSelectedWidget(null)
    }
  }, [selectedWidget])

  const handleSave = useCallback(() => {
    onSave(localWidgets)
  }, [localWidgets, onSave])

  const resetLayout = useCallback(() => {
    // Reset to default water treatment dashboard layout
    const defaultWidgets: WaterWidget[] = [
      {
        id: 'kpi-production',
        type: 'kpi',
        title: 'Daily Production',
        position: { x: 0, y: 0 },
        size: { width: 200, height: 120 },
        config: {
          dataSource: 'water-treatment',
          parameters: [{ id: 'daily_production', name: 'Daily Production', unit: 'm³/day', color: '#00ffff', category: 'Production' }],
          displayMode: 'single'
        }
      },
      {
        id: 'chart-quality',
        type: 'chart',
        title: 'Water Quality Trends',
        position: { x: 1, y: 0 },
        size: { width: 400, height: 300 },
        config: {
          dataSource: 'water-treatment',
          chartType: 'line',
          parameters: [
            { id: 'ph_level', name: 'pH Level', unit: 'pH', color: '#10b981', category: 'Quality' },
            { id: 'turbidity', name: 'Turbidity', unit: 'NTU', color: '#059669', category: 'Quality' }
          ],
          displayMode: 'multiple'
        }
      },
      {
        id: 'gauge-efficiency',
        type: 'gauge',
        title: 'Plant Efficiency',
        position: { x: 2, y: 0 },
        size: { width: 200, height: 200 },
        config: {
          dataSource: 'water-treatment',
          parameters: [{ id: 'plant_efficiency', name: 'Efficiency', unit: '%', color: '#f59e0b', category: 'Performance' }],
          displayMode: 'single'
        }
      }
    ]
    setLocalWidgets(defaultWidgets)
  }, [])

  const getGridClasses = () => {
    switch (gridLayout) {
      case '2x2': return 'grid-cols-2 gap-4'
      case '3x3': return 'grid-cols-3 gap-4'
      case '4x4': return 'grid-cols-4 gap-3'
      case 'custom': return 'grid-cols-1 lg:grid-cols-6 gap-4'
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
    }
  }

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Cyberpunk Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent opacity-20"
            style={{
              left: `${i * 7}%`,
              height: '100px',
              animation: `matrix-rain ${3 + Math.random() * 4}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Editor Toolbar */}
        <div className="holographic border-b border-cyan-500/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={onToggleEditMode}
                variant={isEditMode ? "default" : "outline"}
                className={cn(
                  'flex items-center gap-2 font-medium transition-all duration-200',
                  isEditMode 
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 hover:bg-cyan-500/30' 
                    : 'bg-slate-700/50 text-slate-300 border-slate-600/50 hover:bg-slate-600/50'
                )}
              >
                <Settings size={16} />
                {isEditMode ? 'Exit Edit Mode' : 'Edit Dashboard'}
              </Button>

              {isEditMode && (
                <>
                  <Button
                    onClick={() => setShowWidgetLibrary(true)}
                    className="bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30 flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Widget
                  </Button>

                  <Button
                    onClick={resetLayout}
                    variant="outline"
                    className="bg-orange-500/20 text-orange-400 border-orange-500/50 hover:bg-orange-500/30 flex items-center gap-2"
                  >
                    <RotateCcw size={16} />
                    Reset Layout
                  </Button>

                  <div className="flex items-center gap-2">
                    <Grid3x3 size={16} className="text-slate-400" />
                    <select
                      value={gridLayout}
                      onChange={(e) => setGridLayout(e.target.value as any)}
                      className="px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="auto">Auto Layout</option>
                      <option value="2x2">2×2 Grid</option>
                      <option value="3x3">3×3 Grid</option>
                      <option value="4x4">4×4 Grid</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              {isEditMode && (
                <Button
                  onClick={handleSave}
                  className="bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30 flex items-center gap-2"
                >
                  <Save size={16} />
                  Save Layout
                </Button>
              )}
              
              <Button
                onClick={onPreview}
                className="bg-purple-500/20 text-purple-400 border-purple-500/50 hover:bg-purple-500/30 flex items-center gap-2"
              >
                <Eye size={16} />
                Preview
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex min-h-0">
          {/* Main Dashboard Area */}
          <div className="flex-1 p-6 overflow-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToWindowEdges]}
            >
              <SortableContext 
                items={localWidgets.map(w => w.id)} 
                strategy={rectSortingStrategy}
              >
                <div className={cn('grid min-h-full', getGridClasses())}>
                  {localWidgets.map((widget) => (
                    <DraggableWidget
                      key={widget.id}
                      widget={widget}
                      isEditMode={isEditMode}
                      isSelected={selectedWidget?.id === widget.id}
                      onClick={() => setSelectedWidget(widget)}
                      onDelete={() => deleteWidget(widget.id)}
                      onUpdate={updateWidget}
                    />
                  ))}
                </div>
              </SortableContext>

              <DragOverlay>
                {activeId ? (
                  <DraggableWidget
                    widget={localWidgets.find(w => w.id === activeId)!}
                    isEditMode={isEditMode}
                    isSelected={false}
                    onClick={() => {}}
                    onDelete={() => {}}
                    onUpdate={() => {}}
                    isDragging
                  />
                ) : null}
              </DragOverlay>
            </DndContext>

            {localWidgets.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                    <Grid3x3 size={48} className="text-slate-600" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-300 mb-2">
                    No Widgets Added
                  </h3>
                  <p className="text-slate-500 mb-4">
                    Start building your water treatment dashboard by adding widgets
                  </p>
                  <Button
                    onClick={() => setShowWidgetLibrary(true)}
                    className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 hover:bg-cyan-500/30"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Your First Widget
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Configuration Panel */}
          {isEditMode && selectedWidget && (
            <div className="w-80 border-l border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
              <WidgetConfigPanel
                widget={selectedWidget}
                onUpdate={updateWidget}
                onClose={() => setSelectedWidget(null)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Widget Library Modal */}
      {showWidgetLibrary && (
        <WidgetLibrary
          onAddWidget={addWidget}
          onClose={() => setShowWidgetLibrary(false)}
        />
      )}
    </div>
  )
}