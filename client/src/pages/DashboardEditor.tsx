import React, { useState } from 'react'
import { DashboardEditor as DashboardEditorComponent } from '@/components/dashboard/DashboardEditor'

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

// Default water treatment dashboard widgets
const defaultWidgets: WaterWidget[] = [
  {
    id: 'kpi-production',
    type: 'kpi',
    title: 'Daily Production',
    position: { x: 0, y: 0 },
    size: { width: 200, height: 120 },
    config: {
      dataSource: 'water-treatment',
      parameters: [{ 
        id: 'daily_production', 
        name: 'Daily Production', 
        unit: 'm³/day', 
        color: '#00ffff', 
        category: 'Production' 
      }],
      displayMode: 'single'
    }
  },
  {
    id: 'kpi-efficiency',
    type: 'kpi',
    title: 'Plant Efficiency',
    position: { x: 1, y: 0 },
    size: { width: 200, height: 120 },
    config: {
      dataSource: 'water-treatment',
      parameters: [{ 
        id: 'plant_efficiency', 
        name: 'Efficiency', 
        unit: '%', 
        color: '#8b5cf6', 
        category: 'Performance' 
      }],
      displayMode: 'single'
    }
  },
  {
    id: 'chart-quality',
    type: 'chart',
    title: 'Water Quality Trends',
    position: { x: 2, y: 0 },
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
    id: 'gauge-pressure',
    type: 'gauge',
    title: 'System Pressure',
    position: { x: 0, y: 1 },
    size: { width: 200, height: 200 },
    config: {
      dataSource: 'water-treatment',
      parameters: [{ 
        id: 'inlet_pressure', 
        name: 'Pressure', 
        unit: 'bar', 
        color: '#06b6d4', 
        category: 'Flow & Pressure' 
      }],
      displayMode: 'single'
    }
  },
  {
    id: 'chart-energy',
    type: 'chart',
    title: 'Energy Consumption',
    position: { x: 1, y: 1 },
    size: { width: 400, height: 250 },
    config: {
      dataSource: 'water-treatment',
      chartType: 'bar',
      parameters: [{ 
        id: 'energy_consumption', 
        name: 'Energy', 
        unit: 'kWh', 
        color: '#f59e0b', 
        category: 'Energy' 
      }],
      displayMode: 'single'
    }
  }
]

export default function DashboardEditor() {
  const [widgets, setWidgets] = useState<WaterWidget[]>(defaultWidgets)
  const [isEditMode, setIsEditMode] = useState(true)

  const handleSave = (updatedWidgets: WaterWidget[]) => {
    setWidgets(updatedWidgets)
    console.log('Dashboard saved:', updatedWidgets)
  }

  const handlePreview = () => {
    setIsEditMode(false)
    console.log('Preview mode activated')
  }

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  return (
    <div className="h-screen">
      <DashboardEditorComponent
        widgets={widgets}
        onSave={handleSave}
        onPreview={handlePreview}
        isEditMode={isEditMode}
        onToggleEditMode={handleToggleEditMode}
      />
    </div>
  )
}