import React, { useState } from 'react'
import { X, Save, Database, BarChart3, Palette, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataSelector } from './DataSelector'
import { ChartTypeSelector } from './ChartTypeSelector'
import { DisplayModeSelector } from './DisplayModeSelector'
import { SketchPicker } from 'react-color'

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

interface WidgetConfigPanelProps {
  widget: WaterWidgetType
  onUpdate: (widget: WaterWidgetType) => void
  onClose: () => void
}

export function WidgetConfigPanel({ widget, onUpdate, onClose }: WidgetConfigPanelProps) {
  const [activeTab, setActiveTab] = useState('data')
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null)

  const handleTitleChange = (title: string) => {
    onUpdate({ ...widget, title })
  }

  const handleConfigChange = (configUpdates: Partial<WaterWidgetType['config']>) => {
    onUpdate({
      ...widget,
      config: { ...widget.config, ...configUpdates }
    })
  }

  const handleParameterSelection = (parameters: Array<{
    id: string
    name: string
    unit: string
    color: string
    category: string
  }>) => {
    handleConfigChange({ parameters })
  }

  const handleColorChange = (paramId: string, color: string) => {
    const parameters = widget.config.parameters?.map(p => 
      p.id === paramId ? { ...p, color } : p
    )
    handleConfigChange({ parameters })
  }

  const maxParameters = widget.config.displayMode === 'single' ? 1 : 
                      widget.config.displayMode === 'dual' ? 2 : 10

  return (
    <div className="h-full flex flex-col bg-slate-900/50 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div>
          <h3 className="text-lg font-medium text-slate-200">Configure Widget</h3>
          <p className="text-sm text-slate-400">{widget.type.toUpperCase()} Widget</p>
        </div>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-slate-200"
        >
          <X size={16} />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database size={14} />
              Data
            </TabsTrigger>
            <TabsTrigger value="display" className="flex items-center gap-2">
              <BarChart3 size={14} />
              Display
            </TabsTrigger>
            <TabsTrigger value="style" className="flex items-center gap-2">
              <Palette size={14} />
              Style
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings2 size={14} />
              Settings
            </TabsTrigger>
          </TabsList>

          <div className="p-4 space-y-6">
            <TabsContent value="data" className="space-y-6">
              {/* Widget Title */}
              <div className="space-y-2">
                <Label htmlFor="widget-title">Widget Title</Label>
                <Input
                  id="widget-title"
                  value={widget.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter widget title"
                  className="bg-slate-800/50 border-slate-600/50"
                />
              </div>

              {/* Data Selection */}
              <Card className="bg-slate-800/30 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-slate-200">Data Parameters</CardTitle>
                  <CardDescription>
                    Select water treatment parameters to display
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataSelector
                    selectedParameters={widget.config.parameters || []}
                    onSelectionChange={handleParameterSelection}
                    maxSelections={maxParameters}
                    mode={widget.config.displayMode || 'single'}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="display" className="space-y-6">
              {/* Display Mode */}
              <Card className="bg-slate-800/30 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-slate-200">Display Mode</CardTitle>
                  <CardDescription>
                    Choose how to display the data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DisplayModeSelector
                    widgetType={widget.type}
                    value={widget.config.displayMode || 'single'}
                    onChange={(mode) => handleConfigChange({ displayMode: mode })}
                  />
                </CardContent>
              </Card>

              {/* Chart Type (for chart widgets) */}
              {widget.type === 'chart' && (
                <Card className="bg-slate-800/30 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-slate-200">Chart Type</CardTitle>
                    <CardDescription>
                      Select the visualization type
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartTypeSelector
                      value={widget.config.chartType || 'line'}
                      onChange={(chartType) => handleConfigChange({ chartType })}
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="style" className="space-y-6">
              {/* Parameter Colors */}
              {widget.config.parameters && widget.config.parameters.length > 0 && (
                <Card className="bg-slate-800/30 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-slate-200">Parameter Colors</CardTitle>
                    <CardDescription>
                      Customize colors for each parameter
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {widget.config.parameters.map((param) => (
                      <div key={param.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-6 h-6 rounded border border-slate-500 cursor-pointer"
                            style={{ backgroundColor: param.color }}
                            onClick={() => setShowColorPicker(showColorPicker === param.id ? null : param.id)}
                          />
                          <div>
                            <div className="text-sm font-medium text-slate-200">{param.name}</div>
                            <div className="text-xs text-slate-400">{param.category}</div>
                          </div>
                        </div>
                        <div className="text-xs text-slate-400">{param.unit}</div>

                        {/* Color Picker */}
                        {showColorPicker === param.id && (
                          <div className="absolute z-50 mt-2">
                            <div 
                              className="fixed inset-0" 
                              onClick={() => setShowColorPicker(null)}
                            />
                            <SketchPicker
                              color={param.color}
                              onChange={(color) => handleColorChange(param.id, color.hex)}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Widget Styling */}
              <Card className="bg-slate-800/30 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-slate-200">Widget Styling</CardTitle>
                  <CardDescription>
                    Customize widget appearance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Background</Label>
                      <div 
                        className="w-full h-8 rounded border border-slate-600 cursor-pointer"
                        style={{ backgroundColor: widget.config.styling?.backgroundColor || '#1e293b' }}
                        onClick={() => setShowColorPicker('background')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Border</Label>
                      <div 
                        className="w-full h-8 rounded border border-slate-600 cursor-pointer"
                        style={{ backgroundColor: widget.config.styling?.borderColor || '#06b6d4' }}
                        onClick={() => setShowColorPicker('border')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Text</Label>
                      <div 
                        className="w-full h-8 rounded border border-slate-600 cursor-pointer"
                        style={{ backgroundColor: widget.config.styling?.textColor || '#e2e8f0' }}
                        onClick={() => setShowColorPicker('text')}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              {/* Refresh Interval */}
              <Card className="bg-slate-800/30 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-slate-200">Refresh Settings</CardTitle>
                  <CardDescription>
                    Configure data refresh interval
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="refresh-interval">Refresh Interval (seconds)</Label>
                    <Input
                      id="refresh-interval"
                      type="number"
                      value={widget.config.refreshInterval || 30}
                      onChange={(e) => handleConfigChange({ refreshInterval: parseInt(e.target.value) })}
                      min="5"
                      max="3600"
                      className="bg-slate-800/50 border-slate-600/50"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Thresholds */}
              <Card className="bg-slate-800/30 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-slate-200">Alert Thresholds</CardTitle>
                  <CardDescription>
                    Set warning and critical thresholds
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-slate-400">
                    Threshold configuration coming soon...
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex justify-end gap-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50"
          >
            Cancel
          </Button>
          <Button
            className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 hover:bg-cyan-500/30"
          >
            <Save size={16} className="mr-2" />
            Apply Changes
          </Button>
        </div>
      </div>
    </div>
  )
}