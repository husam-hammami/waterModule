import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Save, X, Database } from 'lucide-react';
import { DataSourceSelector, getParameterData } from './DataSourceSelector';

interface KPICardData {
  id: string;
  title: string;
  value: number;
  unit: string;
  chartType: 'sparkline' | 'progress' | 'gauge' | 'bar' | 'donut' | 'trend';
  color: string;
  data: number[];
  max?: number;
  subtitle?: string;
  borderColor: string;
  dataSource?: string;
  parameter?: string;
  displayFormat?: 'number' | 'percentage' | 'decimal' | 'currency';
  precision?: number;
}

interface KPIConfigurationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cards: KPICardData[];
  onSave: (cards: KPICardData[]) => void;
}

const CHART_TYPES = [
  { value: 'sparkline', label: 'Sparkline' },
  { value: 'progress', label: 'Progress Ring' },
  { value: 'gauge', label: 'Gauge' },
  { value: 'bar', label: 'Bar Chart' },
  { value: 'donut', label: 'Donut Chart' },
  { value: 'trend', label: 'Trend Line' }
];

const DISPLAY_FORMATS = [
  { value: 'number', label: 'Number' },
  { value: 'percentage', label: 'Percentage' },
  { value: 'decimal', label: 'Decimal' },
  { value: 'currency', label: 'Currency' }
];

const PRESET_COLORS = [
  '#00ffff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
  '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#10ac84',
  '#ee5a24', '#0abde3', '#3742fa', '#2f3542', '#ff6348', '#7bed9f'
];

export function KPIConfigurationDialog({ isOpen, onClose, cards, onSave }: KPIConfigurationDialogProps) {
  const [editableCards, setEditableCards] = useState<KPICardData[]>(cards);

  const handleAddCard = () => {
    const newCard: KPICardData = {
      id: `kpi-${Date.now()}`,
      title: 'NEW KPI',
      value: 0,
      unit: 'Units',
      chartType: 'sparkline',
      color: '#00ffff',
      data: [10, 20, 15, 25, 18, 22, 30],
      max: 100,
      borderColor: 'border-[hsl(180,100%,50%,0.3)]',
      dataSource: '',
      parameter: '',
      displayFormat: 'number',
      precision: 1
    };
    setEditableCards(prev => [...prev, newCard]);
  };

  const handleDataSourceChange = (cardId: string, dataSourceId: string) => {
    handleUpdateCard(cardId, 'dataSource', dataSourceId);
    handleUpdateCard(cardId, 'parameter', ''); // Reset parameter when data source changes
  };

  const handleParameterChange = (cardId: string, parameterId: string) => {
    handleUpdateCard(cardId, 'parameter', parameterId);
    
    // Auto-update card properties based on selected parameter
    const card = editableCards.find(c => c.id === cardId);
    if (card?.dataSource) {
      const paramData = getParameterData(card.dataSource, parameterId);
      if (paramData) {
        handleUpdateCard(cardId, 'title', paramData.name.toUpperCase());
        handleUpdateCard(cardId, 'value', paramData.currentValue);
        handleUpdateCard(cardId, 'unit', paramData.unit);
        handleUpdateCard(cardId, 'data', paramData.historicalData);
        handleUpdateCard(cardId, 'max', paramData.max);
      }
    }
  };

  const handleDeleteCard = (cardId: string) => {
    setEditableCards(prev => prev.filter(card => card.id !== cardId));
  };

  const handleUpdateCard = (cardId: string, field: keyof KPICardData, value: any) => {
    setEditableCards(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, [field]: value }
        : card
    ));
  };

  const handleSave = () => {
    onSave(editableCards);
    onClose();
  };

  const handleCancel = () => {
    setEditableCards(cards); // Reset to original
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-cyan-500/20">
        <DialogHeader>
          <DialogTitle className="text-cyan-300 text-xl font-bold">Configure KPI Cards</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {editableCards.map((card, index) => (
            <div key={card.id} className="p-4 border border-slate-600 rounded-lg bg-slate-800/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-cyan-300 font-semibold">KPI Card #{index + 1}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteCard(card.id)}
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
                  selectedDataSource={card.dataSource}
                  selectedParameter={card.parameter}
                  onDataSourceChange={(dataSourceId) => handleDataSourceChange(card.id, dataSourceId)}
                  onParameterChange={(parameterId) => handleParameterChange(card.id, parameterId)}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-slate-300">Title</Label>
                  <Input
                    value={card.title}
                    onChange={(e) => handleUpdateCard(card.id, 'title', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Value</Label>
                  <Input
                    type="number"
                    value={card.value}
                    onChange={(e) => handleUpdateCard(card.id, 'value', parseFloat(e.target.value) || 0)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Unit</Label>
                  <Input
                    value={card.unit}
                    onChange={(e) => handleUpdateCard(card.id, 'unit', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Chart Type</Label>
                  <Select
                    value={card.chartType}
                    onValueChange={(value) => handleUpdateCard(card.id, 'chartType', value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {CHART_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value} className="text-white">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Color</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {PRESET_COLORS.map(color => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded border-2 ${card.color === color ? 'border-white' : 'border-slate-600'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleUpdateCard(card.id, 'color', color)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300">Max Value</Label>
                  <Input
                    type="number"
                    value={card.max || 100}
                    onChange={(e) => handleUpdateCard(card.id, 'max', parseFloat(e.target.value) || 100)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Display Format</Label>
                  <Select
                    value={card.displayFormat || 'number'}
                    onValueChange={(value) => handleUpdateCard(card.id, 'displayFormat', value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {DISPLAY_FORMATS.map(format => (
                        <SelectItem key={format.value} value={format.value} className="text-white">
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Precision</Label>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    value={card.precision || 1}
                    onChange={(e) => handleUpdateCard(card.id, 'precision', parseInt(e.target.value) || 1)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            onClick={handleAddCard}
            className="w-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New KPI Card
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