import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface WaterWidgetType {
  id: string
  type: 'kpi' | 'chart' | 'gauge' | 'network' | 'table' | 'process-flow'
  title: string
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
    thresholds?: Array<{
      value: number
      color: string
      label: string
    }>
  }
}

interface WaterWidgetProps {
  widget: WaterWidgetType
  className?: string
}

// Mock water treatment data generator
const generateWaterData = (parameterId: string) => {
  const baseValues: Record<string, number> = {
    'daily_production': 1250,
    'ph_level': 7.2,
    'turbidity': 0.8,
    'chlorine_residual': 1.2,
    'plant_efficiency': 94,
    'energy_consumption': 450,
    'flow_rate': 180,
    'pressure': 2.8,
    'temperature': 22
  }
  
  const base = baseValues[parameterId] || 50
  return base + (Math.random() - 0.5) * base * 0.1
}

const generateTimeSeriesData = (parameterId: string, points: number = 24) => {
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(Date.now() - (points - i) * 60000).toISOString(),
    value: generateWaterData(parameterId)
  }))
}

// KPI Widget for Water Treatment
function WaterKPIWidget({ widget, className }: WaterWidgetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    if (!canvasRef.current || !widget.config.parameters?.[0]) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const dpr = window.devicePixelRatio || 1
    canvas.width = 80 * dpr
    canvas.height = 40 * dpr
    canvas.style.width = '80px'
    canvas.style.height = '40px'
    ctx.scale(dpr, dpr)
    
    const timeData = generateTimeSeriesData(widget.config.parameters[0].id, 12)
    const values = timeData.map(d => d.value)
    
    ctx.clearRect(0, 0, 80, 40)
    ctx.strokeStyle = widget.config.parameters[0].color || '#00ffff'
    ctx.lineWidth = 2
    ctx.beginPath()
    
    const max = Math.max(...values)
    const min = Math.min(...values)
    const range = max - min || 1
    
    values.forEach((value, i) => {
      const x = (i / (values.length - 1)) * 70 + 5
      const y = 35 - ((value - min) / range) * 30
      
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    
    ctx.stroke()
    ctx.shadowColor = widget.config.parameters[0].color || '#00ffff'
    ctx.shadowBlur = 3
    ctx.stroke()
    
  }, [widget.config.parameters])
  
  const parameter = widget.config.parameters?.[0]
  const currentValue = parameter ? generateWaterData(parameter.id) : 0
  
  return (
    <div className={cn(
      "holographic rounded-lg p-4 relative overflow-hidden border border-cyan-500/20",
      "bg-gradient-to-br from-slate-900/90 via-slate-800/70 to-slate-900/90",
      "shadow-lg shadow-cyan-500/10 h-full",
      className
    )}>
      <div className="relative z-10 flex items-center justify-between h-full">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-slate-300 mb-1 truncate">
            {widget.title}
          </h3>
          <div className="text-2xl font-bold text-cyan-400">
            {currentValue.toFixed(1)}
          </div>
          {parameter && (
            <div className="text-xs text-slate-500 mt-1">
              {parameter.unit}
            </div>
          )}
        </div>
        
        <div className="ml-3">
          <canvas ref={canvasRef} className="opacity-70" />
        </div>
      </div>
    </div>
  )
}

// Chart Widget for Water Treatment
function WaterChartWidget({ widget, className }: WaterWidgetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    if (!canvasRef.current || !widget.config.parameters?.[0]) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const dpr = window.devicePixelRatio || 1
    canvas.width = 300 * dpr
    canvas.height = 200 * dpr
    canvas.style.width = '300px'
    canvas.style.height = '200px'
    ctx.scale(dpr, dpr)
    
    ctx.clearRect(0, 0, 300, 200)
    
    if (widget.config.chartType === 'line' || !widget.config.chartType) {
      drawWaterLineChart(ctx, widget)
    } else if (widget.config.chartType === 'bar') {
      drawWaterBarChart(ctx, widget)
    } else if (widget.config.chartType === 'pie' || widget.config.chartType === 'donut') {
      drawWaterPieChart(ctx, widget)
    }
    
  }, [widget.config.parameters, widget.config.chartType])
  
  const drawWaterLineChart = (ctx: CanvasRenderingContext2D, widget: WaterWidgetType) => {
    const parameters = widget.config.parameters || []
    parameters.forEach((param, paramIndex) => {
      const timeData = generateTimeSeriesData(param.id, 24)
      const values = timeData.map(d => d.value)
      const max = Math.max(...values)
      const min = Math.min(...values)
      const range = max - min || 1
      
      // Draw grid for first parameter
      if (paramIndex === 0) {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)'
        ctx.lineWidth = 1
        for (let i = 0; i <= 4; i++) {
          const y = (i / 4) * 160 + 20
          ctx.beginPath()
          ctx.moveTo(20, y)
          ctx.lineTo(280, y)
          ctx.stroke()
        }
      }
      
      // Draw line
      ctx.strokeStyle = param.color
      ctx.lineWidth = 2
      ctx.beginPath()
      
      values.forEach((value, i) => {
        const x = (i / (values.length - 1)) * 260 + 20
        const y = 180 - ((value - min) / range) * 160
        
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      ctx.stroke()
    })
  }
  
  const drawWaterBarChart = (ctx: CanvasRenderingContext2D, widget: WaterWidgetType) => {
    const parameters = widget.config.parameters || []
    const barWidth = 260 / parameters.length - 10
    
    parameters.forEach((param, i) => {
      const value = generateWaterData(param.id)
      const maxValue = 100 // Normalized max value
      const x = (i * (barWidth + 10)) + 20
      const height = (value / maxValue) * 160
      const y = 180 - height
      
      const gradient = ctx.createLinearGradient(x, y, x, 180)
      gradient.addColorStop(0, param.color)
      gradient.addColorStop(1, param.color + '30')
      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, height)
      
      ctx.strokeStyle = param.color
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, barWidth, height)
    })
  }
  
  const drawWaterPieChart = (ctx: CanvasRenderingContext2D, widget: WaterWidgetType) => {
    const parameters = widget.config.parameters || []
    const centerX = 150
    const centerY = 100
    const outerRadius = 60
    const innerRadius = widget.config.chartType === 'donut' ? 30 : 0
    
    const total = parameters.reduce((sum, param) => sum + generateWaterData(param.id), 0)
    let currentAngle = -Math.PI / 2
    
    parameters.forEach((param) => {
      const value = generateWaterData(param.id)
      const sliceAngle = (value / total) * 2 * Math.PI
      
      ctx.beginPath()
      ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle)
      if (innerRadius > 0) {
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true)
      } else {
        ctx.lineTo(centerX, centerY)
      }
      ctx.closePath()
      
      ctx.fillStyle = param.color
      ctx.fill()
      ctx.strokeStyle = '#1e293b'
      ctx.lineWidth = 2
      ctx.stroke()
      
      currentAngle += sliceAngle
    })
  }
  
  return (
    <div className={cn(
      "holographic rounded-lg p-4 relative overflow-hidden border border-cyan-500/20",
      "bg-gradient-to-br from-slate-900/90 via-slate-800/70 to-slate-900/90",
      "shadow-lg shadow-cyan-500/10 h-full",
      className
    )}>
      <div className="relative z-10 h-full flex flex-col">
        <h3 className="text-sm font-medium text-slate-300 mb-3 truncate">
          {widget.title}
        </h3>
        <div className="flex-1 flex items-center justify-center">
          <canvas ref={canvasRef} className="max-w-full max-h-full" />
        </div>
      </div>
    </div>
  )
}

// Gauge Widget for Water Treatment
function WaterGaugeWidget({ widget, className }: WaterWidgetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    if (!canvasRef.current || !widget.config.parameters?.[0]) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const dpr = window.devicePixelRatio || 1
    canvas.width = 180 * dpr
    canvas.height = 180 * dpr
    canvas.style.width = '180px'
    canvas.style.height = '180px'
    ctx.scale(dpr, dpr)
    
    const parameter = widget.config.parameters[0]
    const value = generateWaterData(parameter.id)
    const maxValue = 100 // Normalized max
    const percentage = Math.min(value / maxValue, 1)
    
    const centerX = 90
    const centerY = 90
    const radius = 70
    const startAngle = Math.PI * 0.75
    const endAngle = Math.PI * 2.25
    const currentAngle = startAngle + (endAngle - startAngle) * percentage
    
    ctx.clearRect(0, 0, 180, 180)
    
    // Background arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)'
    ctx.lineWidth = 8
    ctx.stroke()
    
    // Value arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, currentAngle)
    ctx.strokeStyle = parameter.color
    ctx.lineWidth = 8
    ctx.stroke()
    
    // Center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2)
    ctx.fillStyle = parameter.color
    ctx.fill()
    
    // Needle
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    const needleX = centerX + Math.cos(currentAngle) * (radius - 10)
    const needleY = centerY + Math.sin(currentAngle) * (radius - 10)
    ctx.lineTo(needleX, needleY)
    ctx.strokeStyle = parameter.color
    ctx.lineWidth = 3
    ctx.stroke()
    
    // Value text
    ctx.font = '16px monospace'
    ctx.fillStyle = parameter.color
    ctx.textAlign = 'center'
    ctx.fillText(value.toFixed(1), centerX, centerY + 25)
    
  }, [widget.config.parameters])
  
  const parameter = widget.config.parameters?.[0]
  
  return (
    <div className={cn(
      "holographic rounded-lg p-4 relative overflow-hidden border border-cyan-500/20",
      "bg-gradient-to-br from-slate-900/90 via-slate-800/70 to-slate-900/90",
      "shadow-lg shadow-cyan-500/10 h-full",
      className
    )}>
      <div className="relative z-10 h-full flex flex-col">
        <h3 className="text-sm font-medium text-slate-300 mb-2 text-center">
          {widget.title}
        </h3>
        <div className="flex-1 flex items-center justify-center">
          <canvas ref={canvasRef} />
        </div>
        {parameter && (
          <div className="text-xs text-slate-500 text-center mt-2">
            {parameter.unit}
          </div>
        )}
      </div>
    </div>
  )
}

export function WaterWidget({ widget, className }: WaterWidgetProps) {
  switch (widget.type) {
    case 'kpi':
      return <WaterKPIWidget widget={widget} className={className} />
    case 'chart':
      return <WaterChartWidget widget={widget} className={className} />
    case 'gauge':
      return <WaterGaugeWidget widget={widget} className={className} />
    default:
      return (
        <div className={cn(
          "holographic rounded-lg p-4 relative overflow-hidden border border-cyan-500/20",
          "bg-gradient-to-br from-slate-900/90 via-slate-800/70 to-slate-900/90",
          "shadow-lg shadow-cyan-500/10 h-full flex items-center justify-center",
          className
        )}>
          <div className="text-slate-400 text-center">
            <div className="text-2xl mb-2">🚧</div>
            <div className="text-sm">{widget.type.toUpperCase()}</div>
            <div className="text-xs opacity-70">Widget type not implemented</div>
          </div>
        </div>
      )
  }
}