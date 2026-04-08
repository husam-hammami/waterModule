import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Settings, Trash2, RefreshCw, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WaterWidget } from './WaterWidget'
import { ChartWidget } from './ChartWidget'

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

interface DraggableWidgetProps {
  widget: WaterWidgetType
  isEditMode: boolean
  isSelected: boolean
  isDragging?: boolean
  onClick: () => void
  onDelete: () => void
  onUpdate: (widget: WaterWidgetType) => void
}

export function DraggableWidget({
  widget,
  isEditMode,
  isSelected,
  isDragging = false,
  onClick,
  onDelete,
  onUpdate
}: DraggableWidgetProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: widget.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsRefreshing(true)
    setError(null)
    
    try {
      // Simulate data refresh for water treatment systems
      await new Promise(resolve => setTimeout(resolve, 1000))
      // In real implementation, refresh water treatment data
    } catch (err) {
      setError('Failed to refresh data')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }

  const getWidgetSizeClass = () => {
    switch (widget.type) {
      case 'kpi':
        return 'col-span-1 row-span-1 min-h-[120px]'
      case 'chart':
        return 'col-span-2 row-span-2 min-h-[300px]'
      case 'gauge':
        return 'col-span-1 row-span-1 min-h-[200px]'
      case 'network':
        return 'col-span-3 row-span-2 min-h-[400px]'
      case 'table':
        return 'col-span-2 row-span-3 min-h-[400px]'
      case 'process-flow':
        return 'col-span-3 row-span-2 min-h-[350px]'
      default:
        return 'col-span-1 row-span-1 min-h-[150px]'
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group rounded-lg border transition-all duration-200 overflow-hidden',
        getWidgetSizeClass(),
        isSelected && isEditMode
          ? 'border-cyan-500 shadow-lg shadow-cyan-500/20 bg-slate-900/80'
          : 'border-slate-700/50 bg-slate-900/60 hover:border-slate-600/70',
        isDragging || isSortableDragging
          ? 'opacity-50 transform rotate-1 scale-105 z-50 shadow-2xl shadow-cyan-500/30'
          : 'opacity-100',
        isEditMode && 'cursor-pointer',
        error && 'border-red-500/50 bg-red-900/10'
      )}
      onClick={isEditMode ? onClick : undefined}
      {...attributes}
    >
      {/* Holographic Background Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-data-flow" />
        <div className="data-particle" style={{ top: '20%', animationDelay: '0s' }} />
        <div className="data-particle" style={{ top: '60%', animationDelay: '1s' }} />
      </div>

      {/* Edit Mode Controls */}
      {isEditMode && (
        <>
          {/* Drag Handle */}
          <div
            {...listeners}
            className="absolute top-3 left-3 p-2 rounded cursor-grab active:cursor-grabbing 
                       bg-slate-700/80 hover:bg-slate-600/80 opacity-0 group-hover:opacity-100 
                       transition-all duration-300 z-20 backdrop-blur-sm border border-slate-600/50"
          >
            <GripVertical size={16} className="text-cyan-400" />
          </div>

          {/* Widget Controls */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded bg-slate-700/80 hover:bg-slate-600/80 text-slate-400 
                         hover:text-cyan-400 transition-colors backdrop-blur-sm border border-slate-600/50"
            >
              <RefreshCw size={14} className={cn(isRefreshing && 'animate-spin')} />
            </button>
            
            <button
              onClick={handleDelete}
              className="p-2 rounded bg-slate-700/80 hover:bg-red-600/80 text-slate-400 
                         hover:text-red-400 transition-colors backdrop-blur-sm border border-slate-600/50"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Selection Indicator */}
          {isSelected && (
            <div className="absolute inset-0 border-2 border-cyan-500 rounded-lg pointer-events-none">
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/50"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/50"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/50"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/50"></div>
            </div>
          )}
        </>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-red-500/20 text-red-400 
                        px-3 py-1 rounded text-xs flex items-center gap-1 z-10 backdrop-blur-sm">
          <AlertTriangle size={12} />
          {error}
        </div>
      )}

      {/* Widget Content */}
      <div className={cn(
        'h-full w-full relative z-10',
        isEditMode && 'pointer-events-none'
      )}>
        <ChartWidget
          config={widget.config}
          onUpdate={(newConfig) => onUpdate({...widget, config: newConfig})}
          onDelete={onDelete}
          isEditMode={isEditMode}
        />
      </div>

      {/* Loading Overlay */}
      {isRefreshing && (
        <div className="absolute inset-0 bg-slate-900/70 rounded-lg flex items-center justify-center z-30 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-cyan-400">
            <RefreshCw size={16} className="animate-spin" />
            <span className="text-sm font-medium">Refreshing data...</span>
          </div>
        </div>
      )}

      {/* Widget Type Badge */}
      {isEditMode && (
        <div className="absolute bottom-3 left-3 px-2 py-1 bg-slate-800/80 text-slate-400 text-xs 
                        rounded opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm 
                        border border-slate-600/50">
          {widget.type.toUpperCase()}
        </div>
      )}
    </div>
  )
}