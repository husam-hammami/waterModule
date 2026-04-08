import React, { useState } from 'react'
import { Search, Activity, BarChart3, Zap, Settings2, Database, Droplets } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

interface WaterParameter {
  id: string
  name: string
  category: string
  unit: string
  color: string
  description: string
  priority: 'high' | 'medium' | 'low'
  icon: React.ReactNode
}

interface DataSelectorProps {
  selectedParameters: Array<{
    id: string
    name: string
    unit: string
    color: string
    category: string
  }>
  onSelectionChange: (parameters: Array<{
    id: string
    name: string
    unit: string
    color: string
    category: string
  }>) => void
  maxSelections?: number
  mode?: 'single' | 'dual' | 'multiple'
}

// Water treatment parameters with enhanced metadata
const WATER_PARAMETERS: WaterParameter[] = [
  // Flow & Pressure (High Priority)
  {
    id: 'flow_rate',
    name: 'Flow Rate',
    category: 'Flow & Pressure',
    unit: 'L/min',
    color: '#00ffff',
    description: 'Water flow rate through treatment system',
    priority: 'high',
    icon: <Activity className="w-4 h-4" />
  },
  {
    id: 'inlet_pressure',
    name: 'Inlet Pressure',
    category: 'Flow & Pressure',
    unit: 'bar',
    color: '#06b6d4',
    description: 'Pressure at system inlet',
    priority: 'high',
    icon: <BarChart3 className="w-4 h-4" />
  },
  {
    id: 'outlet_pressure',
    name: 'Outlet Pressure',
    category: 'Flow & Pressure',
    unit: 'bar',
    color: '#0891b2',
    description: 'Pressure at system outlet',
    priority: 'high',
    icon: <BarChart3 className="w-4 h-4" />
  },
  
  // Water Quality (High Priority)
  {
    id: 'ph_level',
    name: 'pH Level',
    category: 'Water Quality',
    unit: 'pH',
    color: '#10b981',
    description: 'Water acidity/alkalinity measurement',
    priority: 'high',
    icon: <Droplets className="w-4 h-4" />
  },
  {
    id: 'turbidity',
    name: 'Turbidity',
    category: 'Water Quality',
    unit: 'NTU',
    color: '#059669',
    description: 'Water clarity measurement',
    priority: 'high',
    icon: <Droplets className="w-4 h-4" />
  },
  {
    id: 'chlorine_residual',
    name: 'Chlorine Residual',
    category: 'Water Quality',
    unit: 'mg/L',
    color: '#047857',
    description: 'Free chlorine concentration',
    priority: 'medium',
    icon: <Droplets className="w-4 h-4" />
  },
  {
    id: 'dissolved_oxygen',
    name: 'Dissolved Oxygen',
    category: 'Water Quality',
    unit: 'mg/L',
    color: '#065f46',
    description: 'Oxygen dissolved in water',
    priority: 'medium',
    icon: <Droplets className="w-4 h-4" />
  },
  
  // Energy (High Priority)
  {
    id: 'energy_consumption',
    name: 'Energy Consumption',
    category: 'Energy',
    unit: 'kWh',
    color: '#f59e0b',
    description: 'Total energy consumption',
    priority: 'high',
    icon: <Zap className="w-4 h-4" />
  },
  {
    id: 'power_demand',
    name: 'Power Demand',
    category: 'Energy',
    unit: 'kW',
    color: '#d97706',
    description: 'Current power demand',
    priority: 'medium',
    icon: <Zap className="w-4 h-4" />
  },
  {
    id: 'power_factor',
    name: 'Power Factor',
    category: 'Energy',
    unit: '',
    color: '#b45309',
    description: 'Electrical system efficiency',
    priority: 'low',
    icon: <Zap className="w-4 h-4" />
  },
  
  // Production
  {
    id: 'daily_production',
    name: 'Daily Production',
    category: 'Production',
    unit: 'm³/day',
    color: '#8b5cf6',
    description: 'Total daily water production',
    priority: 'high',
    icon: <Database className="w-4 h-4" />
  },
  {
    id: 'plant_efficiency',
    name: 'Plant Efficiency',
    category: 'Production',
    unit: '%',
    color: '#7c3aed',
    description: 'Overall plant efficiency',
    priority: 'high',
    icon: <Database className="w-4 h-4" />
  },
  
  // Maintenance
  {
    id: 'pump_speed',
    name: 'Pump Speed',
    category: 'Maintenance',
    unit: 'RPM',
    color: '#ef4444',
    description: 'Primary pump rotation speed',
    priority: 'medium',
    icon: <Settings2 className="w-4 h-4" />
  },
  {
    id: 'vibration_level',
    name: 'Vibration Level',
    category: 'Maintenance',
    unit: 'mm/s',
    color: '#dc2626',
    description: 'Equipment vibration monitoring',
    priority: 'medium',
    icon: <Settings2 className="w-4 h-4" />
  },
  {
    id: 'temperature',
    name: 'Temperature',
    category: 'Environmental',
    unit: '°C',
    color: '#f97316',
    description: 'Water temperature',
    priority: 'medium',
    icon: <Activity className="w-4 h-4" />
  }
]

export function DataSelector({ 
  selectedParameters, 
  onSelectionChange, 
  maxSelections = 10,
  mode = 'single'
}: DataSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(WATER_PARAMETERS.map(p => p.category)))]

  const filteredParameters = WATER_PARAMETERS
    .filter(param => {
      const matchesSearch = param.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           param.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = activeCategory === 'all' || param.category === activeCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return a.name.localeCompare(b.name)
    })

  const handleSelect = (param: WaterParameter) => {
    const isSelected = selectedParameters.some(p => p.id === param.id)
    
    if (isSelected) {
      onSelectionChange(selectedParameters.filter(p => p.id !== param.id))
    } else {
      const maxAllowed = mode === 'single' ? 1 : mode === 'dual' ? 2 : maxSelections
      if (selectedParameters.length < maxAllowed) {
        onSelectionChange([...selectedParameters, {
          id: param.id,
          name: param.name,
          unit: param.unit,
          color: param.color,
          category: param.category
        }])
      }
    }
  }

  const recommendations = WATER_PARAMETERS
    .filter(p => p.priority === 'high')
    .slice(0, 6)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-slate-300">
          Select Water Treatment Parameters
        </h4>
        <div className="text-xs text-slate-400">
          {selectedParameters.length}/{mode === 'dual' ? 2 : maxSelections}
        </div>
      </div>

      {/* Quick Recommendations */}
      {searchTerm === '' && activeCategory === 'all' && (
        <div className="bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-lg p-3">
          <h5 className="text-xs font-medium text-cyan-400 mb-2 flex items-center gap-1">
            <Activity className="w-3 h-3" />
            Recommended for Water Treatment
          </h5>
          <div className="grid grid-cols-2 gap-2">
            {recommendations.map((param) => (
              <button
                key={param.id}
                onClick={() => handleSelect(param)}
                disabled={mode === 'dual' && selectedParameters.length >= 2 && !selectedParameters.some(p => p.id === param.id)}
                className={cn(
                  'flex items-center gap-2 p-2 rounded text-xs transition-all',
                  selectedParameters.some(p => p.id === param.id)
                    ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-800/50 border border-slate-600/30 text-slate-300 hover:bg-slate-700/50',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <div style={{ color: param.color }}>{param.icon}</div>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium truncate">{param.name}</div>
                  <div className="opacity-70">{param.unit}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-400" />
          <Input
            placeholder="Search parameters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-8 text-sm bg-slate-800/50 border-slate-600/50"
          />
        </div>
        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="px-3 py-1 h-8 text-sm bg-slate-800/50 border border-slate-600/50 rounded-md text-slate-200"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Parameter List */}
      <div className="max-h-60 overflow-y-auto space-y-2">
        {filteredParameters.map((param) => {
          const isSelected = selectedParameters.some(p => p.id === param.id)
          const isDisabled = mode === 'dual' && selectedParameters.length >= 2 && !isSelected ||
                            mode === 'single' && selectedParameters.length >= 1 && !isSelected ||
                            selectedParameters.length >= maxSelections && !isSelected

          return (
            <div
              key={param.id}
              onClick={() => !isDisabled && handleSelect(param)}
              className={cn(
                'group cursor-pointer rounded-lg border p-3 transition-all duration-200',
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/50'
                  : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50',
                isDisabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="flex items-center gap-3">
                <div style={{ color: param.color }}>{param.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-200 truncate">{param.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{param.unit}</span>
                      {param.priority === 'high' && (
                        <div className="w-2 h-2 bg-green-400 rounded-full" title="High Priority" />
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{param.description}</div>
                  <div className="text-xs text-slate-600 mt-1">{param.category}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredParameters.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No parameters found</p>
        </div>
      )}
    </div>
  )
}