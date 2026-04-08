import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChartDataBinding, MultiSeriesBinding } from '../ChartDataBinding';
import { Settings, Palette, Database, Eye, Save, X } from 'lucide-react';

export interface WidgetConfiguration {
  id: string;
  type: 'chart' | 'kpi' | 'gauge' | 'table' | 'map' | 'status';
  title: string;
  subtitle?: string;
  size: 'small' | 'medium' | 'large' | 'full';
  position: { x: number; y: number; w: number; h: number };
  dataBinding?: ChartDataBinding;
  multiSeriesBinding?: MultiSeriesBinding;
  styling: {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    accentColor: string;
    borderRadius: number;
    opacity: number;
  };
  display: {
    showTitle: boolean;
    showSubtitle: boolean;
    showLegend: boolean;
    showGrid: boolean;
    showTooltips: boolean;
    animationDuration: number;
  };
  refreshInterval: number;
  isVisible: boolean;
}

interface WidgetConfigurationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  widget?: WidgetConfiguration;
  onSave: (widget: WidgetConfiguration) => void;
}

const WIDGET_TYPES = [
  { value: 'chart', label: 'Chart Widget', description: 'Line, bar, area charts' },
  { value: 'kpi', label: 'KPI Card', description: 'Key performance indicators' },
  { value: 'gauge', label: 'Gauge', description: 'Circular progress gauges' },
  { value: 'table', label: 'Data Table', description: 'Tabular data display' },
  { value: 'map', label: 'Map Widget', description: 'Geographic visualization' },
  { value: 'status', label: 'Status Board', description: 'System status indicators' }
];

const WIDGET_SIZES = [
  { value: 'small', label: 'Small (2x2)', w: 2, h: 2 },
  { value: 'medium', label: 'Medium (4x3)', w: 4, h: 3 },
  { value: 'large', label: 'Large (6x4)', w: 6, h: 4 },
  { value: 'full', label: 'Full Width (12x6)', w: 12, h: 6 }
];

const COLOR_PRESETS = [
  { name: 'Cyan', primary: '#00ffff', secondary: '#0891b2', background: 'rgba(0, 255, 255, 0.1)' },
  { name: 'Blue', primary: '#3b82f6', secondary: '#1d4ed8', background: 'rgba(59, 130, 246, 0.1)' },
  { name: 'Green', primary: '#10b981', secondary: '#047857', background: 'rgba(16, 185, 129, 0.1)' },
  { name: 'Purple', primary: '#8b5cf6', secondary: '#7c3aed', background: 'rgba(139, 92, 246, 0.1)' },
  { name: 'Orange', primary: '#f59e0b', secondary: '#d97706', background: 'rgba(245, 158, 11, 0.1)' },
  { name: 'Red', primary: '#ef4444', secondary: '#dc2626', background: 'rgba(239, 68, 68, 0.1)' }
];

export function WidgetConfigurationDialog({ 
  isOpen, 
  onClose, 
  widget, 
  onSave 
}: WidgetConfigurationDialogProps) {
  const [configuration, setConfiguration] = useState<WidgetConfiguration>(
    widget || {
      id: `widget-${Date.now()}`,
      type: 'chart',
      title: 'New Widget',
      subtitle: '',
      size: 'medium',
      position: { x: 0, y: 0, w: 4, h: 3 },
      styling: {
        backgroundColor: 'rgba(0, 255, 255, 0.1)',
        borderColor: '#00ffff',
        textColor: '#ffffff',
        accentColor: '#00ffff',
        borderRadius: 8,
        opacity: 0.9
      },
      display: {
        showTitle: true,
        showSubtitle: true,
        showLegend: true,
        showGrid: true,
        showTooltips: true,
        animationDuration: 300
      },
      refreshInterval: 30,
      isVisible: true
    }
  );

  const [activeTab, setActiveTab] = useState('general');

  const updateConfiguration = (field: keyof WidgetConfiguration, value: any) => {
    setConfiguration(prev => ({ ...prev, [field]: value }));
  };

  const updateStyling = (field: keyof WidgetConfiguration['styling'], value: any) => {
    setConfiguration(prev => ({
      ...prev,
      styling: { ...prev.styling, [field]: value }
    }));
  };

  const updateDisplay = (field: keyof WidgetConfiguration['display'], value: any) => {
    setConfiguration(prev => ({
      ...prev,
      display: { ...prev.display, [field]: value }
    }));
  };

  const applyColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    updateStyling('backgroundColor', preset.background);
    updateStyling('borderColor', preset.primary);
    updateStyling('accentColor', preset.primary);
  };

  const handleDataBindingChange = (binding: ChartDataBinding) => {
    updateConfiguration('dataBinding', binding);
  };

  const handleMultiSeriesBindingChange = (binding: MultiSeriesBinding) => {
    updateConfiguration('multiSeriesBinding', binding);
  };

  const handleSave = () => {
    const selectedSize = WIDGET_SIZES.find(s => s.value === configuration.size);
    if (selectedSize) {
      updateConfiguration('position', {
        ...configuration.position,
        w: selectedSize.w,
        h: selectedSize.h
      });
    }
    onSave(configuration);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-800 border-slate-600 text-white overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl text-cyan-300 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Widget Configuration
            </DialogTitle>
            <Badge variant="outline" className="text-slate-300">
              {configuration.type.toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 bg-slate-700">
            <TabsTrigger value="general" className="data-[state=active]:bg-cyan-500/20">General</TabsTrigger>
            <TabsTrigger value="data" className="data-[state=active]:bg-cyan-500/20">Data</TabsTrigger>
            <TabsTrigger value="styling" className="data-[state=active]:bg-cyan-500/20">Styling</TabsTrigger>
            <TabsTrigger value="display" className="data-[state=active]:bg-cyan-500/20">Display</TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-cyan-500/20">Preview</TabsTrigger>
          </TabsList>

          {/* General Configuration */}
          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Widget Type</Label>
                <Select value={configuration.type} onValueChange={(value) => updateConfiguration('type', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {WIDGET_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value} className="text-white">
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-slate-400">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300">Widget Size</Label>
                <Select value={configuration.size} onValueChange={(value) => updateConfiguration('size', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {WIDGET_SIZES.map(size => (
                      <SelectItem key={size.value} value={size.value} className="text-white">
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Title</Label>
                <Input
                  value={configuration.title}
                  onChange={(e) => updateConfiguration('title', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Widget title..."
                />
              </div>

              <div>
                <Label className="text-slate-300">Subtitle (Optional)</Label>
                <Input
                  value={configuration.subtitle || ''}
                  onChange={(e) => updateConfiguration('subtitle', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Widget subtitle..."
                />
              </div>
            </div>

            <div>
              <Label className="text-slate-300">Refresh Interval (seconds)</Label>
              <Input
                type="number"
                min="10"
                max="3600"
                value={configuration.refreshInterval}
                onChange={(e) => updateConfiguration('refreshInterval', parseInt(e.target.value) || 30)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </TabsContent>

          {/* Data Configuration */}
          <TabsContent value="data" className="space-y-4">
            <ChartDataBinding
              binding={configuration.dataBinding}
              multiSeries={configuration.multiSeriesBinding}
              onBindingChange={handleDataBindingChange}
              onMultiSeriesChange={handleMultiSeriesBindingChange}
              isMultiSeries={configuration.type === 'chart'}
            />
          </TabsContent>

          {/* Styling Configuration */}
          <TabsContent value="styling" className="space-y-4">
            <div>
              <Label className="text-slate-300 mb-3 block">Color Presets</Label>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_PRESETS.map(preset => (
                  <button
                    key={preset.name}
                    className="p-3 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors"
                    onClick={() => applyColorPreset(preset)}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.primary, borderColor: preset.secondary }}
                      />
                      <span className="text-sm text-slate-300">{preset.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Border Color</Label>
                <Input
                  type="color"
                  value={configuration.styling.borderColor}
                  onChange={(e) => updateStyling('borderColor', e.target.value)}
                  className="bg-slate-700 border-slate-600 h-10"
                />
              </div>

              <div>
                <Label className="text-slate-300">Accent Color</Label>
                <Input
                  type="color"
                  value={configuration.styling.accentColor}
                  onChange={(e) => updateStyling('accentColor', e.target.value)}
                  className="bg-slate-700 border-slate-600 h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Border Radius</Label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={configuration.styling.borderRadius}
                  onChange={(e) => updateStyling('borderRadius', parseInt(e.target.value) || 0)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label className="text-slate-300">Opacity</Label>
                <Input
                  type="number"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={configuration.styling.opacity}
                  onChange={(e) => updateStyling('opacity', parseFloat(e.target.value) || 0.9)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </TabsContent>

          {/* Display Configuration */}
          <TabsContent value="display" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-slate-300 font-medium">Visibility Options</h4>
                <div className="space-y-3">
                  {Object.entries(configuration.display).map(([key, value]) => {
                    if (key === 'animationDuration') return null;
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <Label className="text-slate-400 text-sm">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => updateDisplay(key as keyof typeof configuration.display, e.target.checked)}
                          className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label className="text-slate-300">Animation Duration (ms)</Label>
                <Input
                  type="number"
                  min="0"
                  max="2000"
                  value={configuration.display.animationDuration}
                  onChange={(e) => updateDisplay('animationDuration', parseInt(e.target.value) || 300)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </TabsContent>

          {/* Preview */}
          <TabsContent value="preview" className="space-y-4">
            <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-600">
              <div className="text-center text-slate-300">
                <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Widget Preview</h3>
                <p className="text-sm text-slate-400">
                  Preview functionality will be available once the widget is saved and rendered.
                </p>
                <div className="mt-4 p-4 bg-slate-800/50 rounded border border-slate-600">
                  <div className="text-sm text-slate-300 mb-1">{configuration.title}</div>
                  {configuration.subtitle && (
                    <div className="text-xs text-slate-400 mb-2">{configuration.subtitle}</div>
                  )}
                  <div className="text-xs text-slate-500">
                    Type: {configuration.type} • Size: {configuration.size} • Refresh: {configuration.refreshInterval}s
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-600">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400">
              {configuration.dataBinding ? 'Data source configured' : 'No data source'}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30"
            >
              <Save className="w-4 h-4 mr-1" />
              Save Widget
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}