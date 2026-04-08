import React from 'react'
import { X, BarChart3, Gauge, Activity, Network, Table, Zap } from 'lucide-react'

interface WidgetLibraryProps {
  onAddWidget: (type: 'kpi' | 'chart' | 'gauge' | 'network' | 'table' | 'process-flow') => void
  onClose: () => void
}

const widgetTypes = [
  { 
    type: 'gauge' as const, 
    name: 'Gauge', 
    description: 'Circular or linear gauges for single metrics',
    icon: Gauge,
    color: 'text-blue-400 border-blue-500/50 bg-blue-500/10'
  },
  { 
    type: 'chart' as const, 
    name: 'Chart', 
    description: 'Line, bar, pie, and area charts',
    icon: BarChart3,
    color: 'text-green-400 border-green-500/50 bg-green-500/10'
  },
  { 
    type: 'kpi' as const, 
    name: 'KPI Card', 
    description: 'Key performance indicator cards',
    icon: Activity,
    color: 'text-orange-400 border-orange-500/50 bg-orange-500/10'
  },
  { 
    type: 'network' as const, 
    name: 'Network View', 
    description: 'Network topology and connections',
    icon: Network,
    color: 'text-purple-400 border-purple-500/50 bg-purple-500/10'
  },
  { 
    type: 'table' as const, 
    name: 'Data Table', 
    description: 'Tabular data display',
    icon: Table,
    color: 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10'
  },
  { 
    type: 'process-flow' as const, 
    name: 'Process Flow', 
    description: 'Process diagrams and flows',
    icon: Zap,
    color: 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10'
  }
]

export function WidgetLibrary({ onAddWidget, onClose }: WidgetLibraryProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/95 border border-slate-700/50 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">Widget Library</h2>
            <p className="text-sm text-slate-400">Choose a widget type to add to your dashboard</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Widget Grid */}
        <div className="p-4 grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {widgetTypes.map((widget) => {
            const Icon = widget.icon
            return (
              <button
                key={widget.type}
                onClick={() => onAddWidget(widget.type)}
                className={`p-4 rounded-lg border transition-all duration-200 hover:scale-105 hover:shadow-lg text-left ${widget.color}`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-current/10">
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1">{widget.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {widget.description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
          <p className="text-xs text-slate-500 text-center">
            Click on any widget type to add it to your dashboard panel
          </p>
        </div>
      </div>
    </div>
  )
}