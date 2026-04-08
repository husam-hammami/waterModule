import React, { useState, useEffect } from 'react';
import { DataSourceSelector, getParameterData, AVAILABLE_DATA_SOURCES } from './DataSourceSelector';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, X, Settings, TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';

export interface ChartDataBinding {
  id: string;
  dataSource: string;
  parameter: string;
  aggregation?: 'current' | 'average' | 'sum' | 'min' | 'max' | 'trend';
  timeRange?: '1h' | '6h' | '24h' | '7d' | '30d';
  refreshInterval?: number; // seconds
  displayFormat?: 'number' | 'percentage' | 'decimal' | 'currency';
  precision?: number;
  thresholds?: {
    warning?: number;
    critical?: number;
  };
}

export interface MultiSeriesBinding {
  bindings: ChartDataBinding[];
  chartType: 'line' | 'bar' | 'area' | 'scatter' | 'gauge' | 'donut' | 'radar';
  xAxisParameter?: string;
  yAxisParameters: string[];
  title: string;
  subtitle?: string;
}

interface ChartDataBindingProps {
  binding?: ChartDataBinding;
  multiSeries?: MultiSeriesBinding;
  onBindingChange: (binding: ChartDataBinding) => void;
  onMultiSeriesChange?: (multiSeries: MultiSeriesBinding) => void;
  isMultiSeries?: boolean;
  className?: string;
}

const AGGREGATION_TYPES = [
  { value: 'current', label: 'Current Value', description: 'Show the latest measurement' },
  { value: 'average', label: 'Average', description: 'Average over time period' },
  { value: 'sum', label: 'Sum', description: 'Total over time period' },
  { value: 'min', label: 'Minimum', description: 'Lowest value in time period' },
  { value: 'max', label: 'Maximum', description: 'Highest value in time period' },
  { value: 'trend', label: 'Trend Analysis', description: 'Show trend direction and rate' }
];

const TIME_RANGES = [
  { value: '1h', label: 'Last Hour' },
  { value: '6h', label: 'Last 6 Hours' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' }
];

const CHART_TYPES = [
  { value: 'line', label: 'Line Chart', icon: TrendingUp },
  { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
  { value: 'area', label: 'Area Chart', icon: Activity },
  { value: 'scatter', label: 'Scatter Plot', icon: Activity },
  { value: 'gauge', label: 'Gauge', icon: Activity },
  { value: 'donut', label: 'Donut Chart', icon: PieChart },
  { value: 'radar', label: 'Radar Chart', icon: Activity }
];

export function ChartDataBinding({ 
  binding, 
  multiSeries, 
  onBindingChange, 
  onMultiSeriesChange,
  isMultiSeries = false,
  className = "" 
}: ChartDataBindingProps) {
  const [currentBinding, setCurrentBinding] = useState<ChartDataBinding>(
    binding || {
      id: `binding-${Date.now()}`,
      dataSource: '',
      parameter: '',
      aggregation: 'current',
      timeRange: '24h',
      refreshInterval: 30,
      displayFormat: 'number',
      precision: 1
    }
  );

  const [currentMultiSeries, setCurrentMultiSeries] = useState<MultiSeriesBinding>(
    multiSeries || {
      bindings: [],
      chartType: 'line',
      yAxisParameters: [],
      title: 'Multi-Series Chart'
    }
  );

  useEffect(() => {
    if (binding) {
      setCurrentBinding(binding);
    }
  }, [binding]);

  useEffect(() => {
    if (multiSeries) {
      setCurrentMultiSeries(multiSeries);
    }
  }, [multiSeries]);

  const handleBindingUpdate = (field: keyof ChartDataBinding, value: any) => {
    const updated = { ...currentBinding, [field]: value };
    setCurrentBinding(updated);
    onBindingChange(updated);
  };

  const handleMultiSeriesUpdate = (field: keyof MultiSeriesBinding, value: any) => {
    const updated = { ...currentMultiSeries, [field]: value };
    setCurrentMultiSeries(updated);
    onMultiSeriesChange?.(updated);
  };

  const handleDataSourceChange = (dataSourceId: string) => {
    handleBindingUpdate('dataSource', dataSourceId);
    handleBindingUpdate('parameter', ''); // Reset parameter
  };

  const handleParameterChange = (parameterId: string) => {
    handleBindingUpdate('parameter', parameterId);
    
    // Auto-populate thresholds if available
    const paramData = getParameterData(currentBinding.dataSource, parameterId);
    if (paramData?.thresholds) {
      handleBindingUpdate('thresholds', paramData.thresholds);
    }
  };

  const addSeriesBinding = () => {
    const newBinding: ChartDataBinding = {
      id: `binding-${Date.now()}`,
      dataSource: '',
      parameter: '',
      aggregation: 'current',
      timeRange: '24h',
      refreshInterval: 30,
      displayFormat: 'number',
      precision: 1
    };
    
    const updatedBindings = [...currentMultiSeries.bindings, newBinding];
    handleMultiSeriesUpdate('bindings', updatedBindings);
  };

  const removeSeriesBinding = (bindingId: string) => {
    const updatedBindings = currentMultiSeries.bindings.filter(b => b.id !== bindingId);
    handleMultiSeriesUpdate('bindings', updatedBindings);
  };

  const updateSeriesBinding = (bindingId: string, field: keyof ChartDataBinding, value: any) => {
    const updatedBindings = currentMultiSeries.bindings.map(b => 
      b.id === bindingId ? { ...b, [field]: value } : b
    );
    handleMultiSeriesUpdate('bindings', updatedBindings);
  };

  if (isMultiSeries) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-cyan-300">Multi-Series Chart Configuration</h3>
          <Badge variant="outline" className="text-cyan-400 border-cyan-400">
            {currentMultiSeries.bindings.length} Series
          </Badge>
        </div>

        {/* Chart Type Selection */}
        <div>
          <Label className="text-slate-300 mb-2 block">Chart Type</Label>
          <div className="grid grid-cols-3 gap-2">
            {CHART_TYPES.map(type => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.value}
                  className={`p-3 rounded-lg border transition-colors ${
                    currentMultiSeries.chartType === type.value
                      ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300'
                      : 'border-slate-600 text-slate-400 hover:bg-slate-700'
                  }`}
                  onClick={() => handleMultiSeriesUpdate('chartType', type.value)}
                >
                  <IconComponent className="w-4 h-4 mx-auto mb-1" />
                  <div className="text-xs">{type.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart Title */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">Chart Title</Label>
            <Input
              value={currentMultiSeries.title}
              onChange={(e) => handleMultiSeriesUpdate('title', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label className="text-slate-300">Subtitle (Optional)</Label>
            <Input
              value={currentMultiSeries.subtitle || ''}
              onChange={(e) => handleMultiSeriesUpdate('subtitle', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Chart subtitle..."
            />
          </div>
        </div>

        {/* Data Series */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-slate-300">Data Series</Label>
            <Button
              size="sm"
              onClick={addSeriesBinding}
              className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Series
            </Button>
          </div>

          <div className="space-y-4">
            {currentMultiSeries.bindings.map((seriesBinding, index) => (
              <div key={seriesBinding.id} className="p-4 border border-slate-600 rounded-lg bg-slate-800/30">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-slate-300">
                    Series #{index + 1}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeSeriesBinding(seriesBinding.id)}
                    className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <DataSourceSelector
                  selectedDataSource={seriesBinding.dataSource}
                  selectedParameter={seriesBinding.parameter}
                  onDataSourceChange={(dataSourceId) => updateSeriesBinding(seriesBinding.id, 'dataSource', dataSourceId)}
                  onParameterChange={(parameterId) => updateSeriesBinding(seriesBinding.id, 'parameter', parameterId)}
                />

                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div>
                    <Label className="text-slate-300 text-xs">Aggregation</Label>
                    <Select
                      value={seriesBinding.aggregation}
                      onValueChange={(value) => updateSeriesBinding(seriesBinding.id, 'aggregation', value)}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {AGGREGATION_TYPES.map(agg => (
                          <SelectItem key={agg.value} value={agg.value} className="text-white">
                            {agg.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-slate-300 text-xs">Time Range</Label>
                    <Select
                      value={seriesBinding.timeRange}
                      onValueChange={(value) => updateSeriesBinding(seriesBinding.id, 'timeRange', value)}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {TIME_RANGES.map(range => (
                          <SelectItem key={range.value} value={range.value} className="text-white">
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-slate-300 text-xs">Refresh (sec)</Label>
                    <Input
                      type="number"
                      min="10"
                      max="3600"
                      value={seriesBinding.refreshInterval || 30}
                      onChange={(e) => updateSeriesBinding(seriesBinding.id, 'refreshInterval', parseInt(e.target.value) || 30)}
                      className="bg-slate-700 border-slate-600 text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Single series configuration
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-4 h-4 text-cyan-400" />
        <h3 className="text-lg font-semibold text-cyan-300">Data Binding Configuration</h3>
      </div>

      {/* Data Source Selection */}
      <DataSourceSelector
        selectedDataSource={currentBinding.dataSource}
        selectedParameter={currentBinding.parameter}
        onDataSourceChange={handleDataSourceChange}
        onParameterChange={handleParameterChange}
      />

      {/* Aggregation and Time Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-slate-300">Data Aggregation</Label>
          <Select
            value={currentBinding.aggregation}
            onValueChange={(value) => handleBindingUpdate('aggregation', value)}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {AGGREGATION_TYPES.map(agg => (
                <SelectItem key={agg.value} value={agg.value} className="text-white">
                  <div>
                    <div className="font-medium">{agg.label}</div>
                    <div className="text-xs text-slate-400">{agg.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-slate-300">Time Range</Label>
          <Select
            value={currentBinding.timeRange}
            onValueChange={(value) => handleBindingUpdate('timeRange', value)}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {TIME_RANGES.map(range => (
                <SelectItem key={range.value} value={range.value} className="text-white">
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Display Settings */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-slate-300">Display Format</Label>
          <Select
            value={currentBinding.displayFormat}
            onValueChange={(value) => handleBindingUpdate('displayFormat', value)}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="number" className="text-white">Number</SelectItem>
              <SelectItem value="percentage" className="text-white">Percentage</SelectItem>
              <SelectItem value="decimal" className="text-white">Decimal</SelectItem>
              <SelectItem value="currency" className="text-white">Currency</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-slate-300">Precision</Label>
          <Input
            type="number"
            min="0"
            max="5"
            value={currentBinding.precision || 1}
            onChange={(e) => handleBindingUpdate('precision', parseInt(e.target.value) || 1)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <div>
          <Label className="text-slate-300">Refresh Interval (sec)</Label>
          <Input
            type="number"
            min="10"
            max="3600"
            value={currentBinding.refreshInterval || 30}
            onChange={(e) => handleBindingUpdate('refreshInterval', parseInt(e.target.value) || 30)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </div>

      {/* Threshold Settings */}
      {currentBinding.parameter && (
        <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
          <Label className="text-slate-300 mb-2 block">Alert Thresholds</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-400 text-xs">Warning Threshold</Label>
              <Input
                type="number"
                value={currentBinding.thresholds?.warning || ''}
                onChange={(e) => handleBindingUpdate('thresholds', {
                  ...currentBinding.thresholds,
                  warning: parseFloat(e.target.value) || undefined
                })}
                className="bg-slate-700 border-slate-600 text-white text-sm"
                placeholder="Warning level..."
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs">Critical Threshold</Label>
              <Input
                type="number"
                value={currentBinding.thresholds?.critical || ''}
                onChange={(e) => handleBindingUpdate('thresholds', {
                  ...currentBinding.thresholds,
                  critical: parseFloat(e.target.value) || undefined
                })}
                className="bg-slate-700 border-slate-600 text-white text-sm"
                placeholder="Critical level..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Preview of Selected Data */}
      {currentBinding.dataSource && currentBinding.parameter && (
        <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
          <div className="text-sm text-cyan-300 font-medium mb-1">Data Preview</div>
          <div className="text-xs text-slate-400">
            Source: {AVAILABLE_DATA_SOURCES.find(ds => ds.id === currentBinding.dataSource)?.name}
          </div>
          <div className="text-xs text-slate-400">
            Parameter: {getParameterData(currentBinding.dataSource, currentBinding.parameter)?.name}
          </div>
        </div>
      )}
    </div>
  );
}