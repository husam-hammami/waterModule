import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Save, X, Droplets, Activity, Zap, TrendingUp, Database } from 'lucide-react';
import { DataSourceSelector, getParameterData } from './DataSourceSelector';

interface GaugeData {
  id: string;
  title: string;
  value: number;
  max: number;
  unit: string;
  color: string;
  icon: any;
  change: string;
  status: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  dataSource?: string;
  parameter?: string;
  displayFormat?: 'number' | 'percentage' | 'decimal' | 'currency';
  precision?: number;
}

interface GaugeConfigurationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gauges: GaugeData[];
  onSave: (gauges: GaugeData[]) => void;
}

const PRESET_COLORS = [
  '#00ffff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
  '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#10ac84',
  '#ee5a24', '#0abde3', '#3742fa', '#2f3542', '#ff6348', '#7bed9f'
];

const AVAILABLE_ICONS = [
  { icon: Droplets, name: 'Droplets', value: 'droplets' },
  { icon: Activity, name: 'Activity', value: 'activity' },
  { icon: Zap, name: 'Zap', value: 'zap' },
  { icon: TrendingUp, name: 'Trending Up', value: 'trending-up' }
];

const getIconComponent = (iconValue: string) => {
  const found = AVAILABLE_ICONS.find(i => i.value === iconValue);
  return found ? found.icon : Droplets;
};

export function GaugeConfigurationDialog({ isOpen, onClose, gauges, onSave }: GaugeConfigurationDialogProps) {
  const [editableGauges, setEditableGauges] = useState<GaugeData[]>(gauges);

  const handleAddGauge = () => {
    const newGauge: GaugeData = {
      id: `gauge-${Date.now()}`,
      title: 'New Gauge',
      value: 0,
      max: 100,
      unit: 'Units',
      color: '#00ffff',
      icon: Droplets,
      change: '+0.0%',
      status: 'NORMAL',
      gradientFrom: 'from-slate-900/90',
      gradientTo: 'via-cyan-900/20 to-slate-800/80',
      borderColor: 'border-cyan-500/30',
      dataSource: '',
      parameter: '',
      displayFormat: 'number',
      precision: 1
    };
    setEditableGauges(prev => [...prev, newGauge]);
  };

  const handleDataSourceChange = (gaugeId: string, dataSourceId: string) => {
    handleUpdateGauge(gaugeId, 'dataSource', dataSourceId);
    handleUpdateGauge(gaugeId, 'parameter', ''); // Reset parameter when data source changes
  };

  const handleParameterChange = (gaugeId: string, parameterId: string) => {
    handleUpdateGauge(gaugeId, 'parameter', parameterId);
    
    // Auto-update gauge properties based on selected parameter
    const gauge = editableGauges.find(g => g.id === gaugeId);
    if (gauge?.dataSource) {
      const paramData = getParameterData(gauge.dataSource, parameterId);
      if (paramData) {
        handleUpdateGauge(gaugeId, 'title', paramData.name);
        handleUpdateGauge(gaugeId, 'value', paramData.currentValue);
        handleUpdateGauge(gaugeId, 'unit', paramData.unit);
        handleUpdateGauge(gaugeId, 'max', paramData.max);
        
        // Set status based on thresholds
        let status = 'NORMAL';
        if (paramData.thresholds) {
          if (paramData.currentValue >= paramData.thresholds.critical) {
            status = 'CRITICAL';
          } else if (paramData.currentValue >= paramData.thresholds.warning) {
            status = 'WARNING';
          }
        }
        handleUpdateGauge(gaugeId, 'status', status);
      }
    }
  };

  const handleDeleteGauge = (gaugeId: string) => {
    setEditableGauges(prev => prev.filter(gauge => gauge.id !== gaugeId));
  };

  const handleUpdateGauge = (gaugeId: string, field: keyof GaugeData, value: any) => {
    setEditableGauges(prev => prev.map(gauge => 
      gauge.id === gaugeId 
        ? { ...gauge, [field]: value }
        : gauge
    ));
  };

  const handleSave = () => {
    onSave(editableGauges);
    onClose();
  };

  const handleCancel = () => {
    setEditableGauges(gauges); // Reset to original
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-cyan-500/20">
        <DialogHeader>
          <DialogTitle className="text-cyan-300 text-xl font-bold">Configure Center Gauges</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {editableGauges.map((gauge, index) => (
            <div key={gauge.id} className="p-4 border border-slate-600 rounded-lg bg-slate-800/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-cyan-300 font-semibold">Gauge #{index + 1}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteGauge(gauge.id)}
                  className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Data Source Configuration */}
              <div className="col-span-full mb-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <Label className="text-cyan-300 font-medium">Data Source Configuration</Label>
                </div>
                <DataSourceSelector
                  selectedDataSource={gauge.dataSource}
                  selectedParameter={gauge.parameter}
                  onDataSourceChange={(dataSourceId) => handleDataSourceChange(gauge.id, dataSourceId)}
                  onParameterChange={(parameterId) => handleParameterChange(gauge.id, parameterId)}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-slate-300">Title</Label>
                  <Input
                    value={gauge.title}
                    onChange={(e) => handleUpdateGauge(gauge.id, 'title', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Value</Label>
                  <Input
                    type="number"
                    value={gauge.value}
                    onChange={(e) => handleUpdateGauge(gauge.id, 'value', parseFloat(e.target.value) || 0)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Max Value</Label>
                  <Input
                    type="number"
                    value={gauge.max}
                    onChange={(e) => handleUpdateGauge(gauge.id, 'max', parseFloat(e.target.value) || 100)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Unit</Label>
                  <Input
                    value={gauge.unit}
                    onChange={(e) => handleUpdateGauge(gauge.id, 'unit', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Status</Label>
                  <Input
                    value={gauge.status}
                    onChange={(e) => handleUpdateGauge(gauge.id, 'status', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Change</Label>
                  <Input
                    value={gauge.change}
                    onChange={(e) => handleUpdateGauge(gauge.id, 'change', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="+1.2%"
                  />
                </div>

                <div className="col-span-2">
                  <Label className="text-slate-300">Icon</Label>
                  <div className="flex gap-2 mt-1">
                    {AVAILABLE_ICONS.map(({ icon: IconComponent, name, value }) => (
                      <button
                        key={value}
                        className={`p-2 rounded border ${
                          gauge.icon === IconComponent 
                            ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300' 
                            : 'border-slate-600 text-slate-400 hover:bg-slate-700'
                        }`}
                        onClick={() => handleUpdateGauge(gauge.id, 'icon', IconComponent)}
                        title={name}
                      >
                        <IconComponent className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-2">
                  <Label className="text-slate-300">Color</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {PRESET_COLORS.map(color => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded border-2 ${gauge.color === color ? 'border-white' : 'border-slate-600'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleUpdateGauge(gauge.id, 'color', color)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Button
            onClick={handleAddGauge}
            className="w-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Gauge
          </Button>
        </div>

        <DialogFooter className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="text-slate-300 border-slate-600 hover:bg-slate-700"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}