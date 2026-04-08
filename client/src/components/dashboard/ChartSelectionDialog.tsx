import { useState } from "react";
import { X, Plus, ChevronDown, Check } from "lucide-react";

interface ChartSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChart: (chartType: string, chartConfig: any, targetPanel?: 'left' | 'right') => void;
  position?: 'left' | 'right';
}

const chartTypes = [
  { id: 'line', name: 'Line Chart', description: 'Supports multiple datasets' },
  { id: 'bar', name: 'Bar Chart', description: 'Great for comparing values' },
  { id: 'gauge', name: 'Gauge Chart', description: 'Perfect for single metrics' },
  { id: 'donut', name: 'Donut Chart', description: 'Show percentage breakdowns' },
  { id: 'area', name: 'Area Chart', description: 'Show trends with filled areas' },
  { id: 'progress', name: 'Progress Bars', description: 'Multiple progress indicators' }
];

const colorOptions = [
  { id: 'cyan', name: 'Cyan', value: '#06b6d4' },
  { id: 'blue', name: 'Blue', value: '#3b82f6' },
  { id: 'green', name: 'Green', value: '#10b981' },
  { id: 'purple', name: 'Purple', value: '#8b5cf6' },
  { id: 'orange', name: 'Orange', value: '#f59e0b' },
  { id: 'red', name: 'Red', value: '#ef4444' },
  { id: 'pink', name: 'Pink', value: '#ec4899' },
  { id: 'indigo', name: 'Indigo', value: '#6366f1' }
];

const dataSources = [
  { id: 'production', name: 'Production Output', unit: 'm³/day', description: 'Daily water production metrics' },
  { id: 'energy', name: 'Energy Consumption', unit: 'kWh', description: 'Power usage and efficiency' },
  { id: 'quality', name: 'Water Quality Score', unit: 'score', description: 'Overall quality metrics' },
  { id: 'pressure', name: 'System Pressure', unit: 'PSI', description: 'Water pressure monitoring' },
  { id: 'flow', name: 'Flow Rate', unit: 'L/s', description: 'Water flow measurements' },
  { id: 'chemical', name: 'Chemical Levels', unit: 'mg/L', description: 'Chemical dosing levels' },
  { id: 'temperature', name: 'Temperature', unit: '°C', description: 'Water temperature monitoring' },
  { id: 'ph', name: 'pH Level', unit: 'pH', description: 'Water acidity/alkalinity' }
];

export function ChartSelectionDialog({ isOpen, onClose, onAddChart, position = 'left' }: ChartSelectionDialogProps) {
  const [chartTitle, setChartTitle] = useState('');
  const [selectedChartType, setSelectedChartType] = useState('line');
  const [selectedColor, setSelectedColor] = useState('cyan');
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>(['production']);
  const [showChartDropdown, setShowChartDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [targetPanel, setTargetPanel] = useState<'left' | 'right'>(position);

  if (!isOpen) return null;

  const handleDataSourceToggle = (sourceId: string) => {
    setSelectedDataSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleAddChart = () => {
    if (!chartTitle.trim()) return;
    
    const selectedChart = chartTypes.find(t => t.id === selectedChartType);
    const selectedColorObj = colorOptions.find(c => c.id === selectedColor);
    const selectedSources = dataSources.filter(s => selectedDataSources.includes(s.id));
    
    const chartConfig = {
      title: chartTitle,
      type: selectedChartType,
      chartType: selectedChartType,
      color: selectedColorObj?.value || '#06b6d4',
      dataSources: selectedSources,
      unit: selectedSources[0]?.unit || '',
      value: 75 + Math.random() * 25, // Dynamic initial value
      max: selectedChartType === 'gauge' ? 100 : undefined,
      segments: selectedChartType === 'donut' ? [
        { name: 'Active', value: 65, color: selectedColorObj?.value || '#06b6d4' },
        { name: 'Standby', value: 25, color: '#64748b' },
        { name: 'Offline', value: 10, color: '#ef4444' }
      ] : undefined,
      chemicals: selectedChartType === 'progress' ? selectedSources.map((source, i) => ({
        name: source.name,
        level: 70 + Math.random() * 25,
        color: colorOptions[i % colorOptions.length].value
      })) : undefined
    };

    onAddChart(selectedChartType, chartConfig, targetPanel);
    
    // Reset form
    setChartTitle('');
    setSelectedChartType('line');
    setSelectedColor('cyan');
    setSelectedDataSources(['production']);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-slate-800/95 backdrop-blur-md border border-slate-600/50 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50 shrink-0">
          <h2 className="text-xl font-bold text-cyan-400">Add New Chart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Target Panel Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Add to Panel</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTargetPanel('left')}
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-colors ${
                    targetPanel === 'left'
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-700/50 border-slate-600/50 text-slate-400 hover:bg-slate-700/70'
                  }`}
                >
                  Left Panel
                </button>
                <button
                  onClick={() => setTargetPanel('right')}
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-colors ${
                    targetPanel === 'right'
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-700/50 border-slate-600/50 text-slate-400 hover:bg-slate-700/70'
                  }`}
                >
                  Right Panel
                </button>
              </div>
            </div>

            {/* Chart Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Chart Title</label>
              <input
                type="text"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                placeholder="Enter chart title"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
              />
            </div>

            {/* Chart Type */}
            <div className="relative">
              <label className="block text-sm font-medium text-slate-300 mb-2">Chart Type</label>
              <button
                onClick={() => setShowChartDropdown(!showChartDropdown)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-left text-white hover:bg-slate-700/70 focus:border-cyan-500/50 focus:outline-none flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-sm">{chartTypes.find(t => t.id === selectedChartType)?.name}</div>
                  <div className="text-xs text-cyan-400">✓ {chartTypes.find(t => t.id === selectedChartType)?.description}</div>
                </div>
                <ChevronDown size={16} className={`transition-transform ${showChartDropdown ? 'rotate-180' : ''}`} />
              </button>
            
              {showChartDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-700/95 border border-slate-600/50 rounded-lg shadow-xl z-10 max-h-32 overflow-y-auto">
                  {chartTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedChartType(type.id);
                        setShowChartDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-slate-600/50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className="font-medium text-white text-sm">{type.name}</div>
                      <div className="text-xs text-slate-400">{type.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chart Color */}
            <div className="relative">
              <label className="block text-sm font-medium text-slate-300 mb-2">Chart Color</label>
              <button
                onClick={() => setShowColorDropdown(!showColorDropdown)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-left text-white hover:bg-slate-700/70 focus:border-cyan-500/50 focus:outline-none flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: colorOptions.find(c => c.id === selectedColor)?.value }}
                  />
                  <span className="text-sm">{colorOptions.find(c => c.id === selectedColor)?.name}</span>
                </div>
                <ChevronDown size={16} className={`transition-transform ${showColorDropdown ? 'rotate-180' : ''}`} />
              </button>
            
              {showColorDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-700/95 border border-slate-600/50 rounded-lg shadow-xl z-10 max-h-32 overflow-y-auto">
                  {colorOptions.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => {
                        setSelectedColor(color.id);
                        setShowColorDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-slate-600/50 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2"
                    >
                      <div 
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="text-white text-sm">{color.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Data Sources */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Data Sources (Select multiple)</label>
              <div className="text-xs text-cyan-400 mb-2">✓ This chart type supports multiple data sources for comparison</div>
              
              <div className="max-h-32 overflow-y-auto bg-slate-700/30 border border-slate-600/50 rounded-lg">
                {dataSources.map((source) => (
                  <label
                    key={source.id}
                    className="flex items-start gap-2 p-2 hover:bg-slate-600/30 cursor-pointer border-b border-slate-600/30 last:border-b-0"
                  >
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={selectedDataSources.includes(source.id)}
                        onChange={() => handleDataSourceToggle(source.id)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                        selectedDataSources.includes(source.id)
                          ? 'bg-cyan-500 border-cyan-500'
                          : 'border-slate-500'
                      }`}>
                        {selectedDataSources.includes(source.id) && (
                          <Check size={10} className="text-white" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white text-sm">{source.name}</div>
                      <div className="text-xs text-slate-400">Unit: {source.unit}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-700/50 shrink-0">
          <button
            onClick={onClose}
            className="px-3 py-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleAddChart}
            disabled={!chartTitle.trim()}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
              chartTitle.trim()
                ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
            }`}
          >
            Save Chart
          </button>
        </div>
      </div>
    </div>
  );
}