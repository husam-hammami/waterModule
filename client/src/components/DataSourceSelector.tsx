import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export interface DataSource {
  id: string;
  name: string;
  description: string;
  parameters: DataParameter[];
}

export interface DataParameter {
  id: string;
  name: string;
  unit: string;
  category: string;
  description: string;
  currentValue: number;
  historicalData: number[];
  min: number;
  max: number;
  thresholds?: {
    warning: number;
    critical: number;
  };
}

// Mock data sources for water treatment facilities
export const AVAILABLE_DATA_SOURCES: DataSource[] = [
  {
    id: 'facility-overview',
    name: 'Facility Overview',
    description: 'General facility performance metrics',
    parameters: [
      {
        id: 'daily-production',
        name: 'Daily Production',
        unit: 'ML/day',
        category: 'Production',
        description: 'Total water production per day',
        currentValue: 85.2,
        historicalData: [82, 84, 86, 85, 87, 85, 85],
        min: 0,
        max: 120,
        thresholds: { warning: 100, critical: 110 }
      },
      {
        id: 'efficiency',
        name: 'Overall Efficiency',
        unit: '%',
        category: 'Performance',
        description: 'System efficiency percentage',
        currentValue: 92.8,
        historicalData: [90, 91, 93, 92, 94, 93, 93],
        min: 0,
        max: 100,
        thresholds: { warning: 85, critical: 80 }
      },
      {
        id: 'facilities-online',
        name: 'Facilities Online',
        unit: 'Count',
        category: 'Status',
        description: 'Number of facilities currently online',
        currentValue: 8,
        historicalData: [10, 9, 8, 8, 9, 8, 8],
        min: 0,
        max: 10
      }
    ]
  },
  {
    id: 'water-quality',
    name: 'Water Quality',
    description: 'Water quality measurement parameters',
    parameters: [
      {
        id: 'ph-level',
        name: 'pH Level',
        unit: 'pH',
        category: 'Chemical',
        description: 'Water pH measurement',
        currentValue: 7.2,
        historicalData: [7.1, 7.2, 7.3, 7.2, 7.1, 7.2, 7.2],
        min: 6.0,
        max: 8.0,
        thresholds: { warning: 7.8, critical: 8.0 }
      },
      {
        id: 'turbidity',
        name: 'Turbidity',
        unit: 'NTU',
        category: 'Physical',
        description: 'Water clarity measurement',
        currentValue: 0.8,
        historicalData: [0.9, 0.8, 0.7, 0.8, 0.9, 0.8, 0.8],
        min: 0,
        max: 2.0,
        thresholds: { warning: 1.5, critical: 1.8 }
      },
      {
        id: 'chlorine-residual',
        name: 'Chlorine Residual',
        unit: 'mg/L',
        category: 'Chemical',
        description: 'Free chlorine concentration',
        currentValue: 1.2,
        historicalData: [1.1, 1.2, 1.3, 1.2, 1.1, 1.2, 1.2],
        min: 0,
        max: 3.0,
        thresholds: { warning: 2.5, critical: 2.8 }
      }
    ]
  },
  {
    id: 'energy-monitoring',
    name: 'Energy Monitoring',
    description: 'Power consumption and energy efficiency metrics',
    parameters: [
      {
        id: 'total-power-consumption',
        name: 'Total Power Consumption',
        unit: 'kW',
        category: 'Energy',
        description: 'Current total power usage',
        currentValue: 1850,
        historicalData: [1800, 1820, 1870, 1850, 1900, 1850, 1850],
        min: 0,
        max: 2500,
        thresholds: { warning: 2200, critical: 2400 }
      },
      {
        id: 'energy-efficiency',
        name: 'Energy Efficiency',
        unit: 'kWh/ML',
        category: 'Efficiency',
        description: 'Energy consumption per megalitre produced',
        currentValue: 0.45,
        historicalData: [0.47, 0.46, 0.44, 0.45, 0.43, 0.45, 0.45],
        min: 0,
        max: 1.0,
        thresholds: { warning: 0.7, critical: 0.8 }
      },
      {
        id: 'renewable-percentage',
        name: 'Renewable Energy %',
        unit: '%',
        category: 'Sustainability',
        description: 'Percentage of energy from renewable sources',
        currentValue: 35,
        historicalData: [32, 34, 36, 35, 37, 35, 35],
        min: 0,
        max: 100
      }
    ]
  },
  {
    id: 'process-flow',
    name: 'Process Flow',
    description: 'Flow rates and pressure measurements',
    parameters: [
      {
        id: 'inlet-flow-rate',
        name: 'Inlet Flow Rate',
        unit: 'L/s',
        category: 'Flow',
        description: 'Raw water inlet flow rate',
        currentValue: 985,
        historicalData: [970, 980, 990, 985, 1000, 985, 985],
        min: 0,
        max: 1200,
        thresholds: { warning: 1100, critical: 1150 }
      },
      {
        id: 'system-pressure',
        name: 'System Pressure',
        unit: 'PSI',
        category: 'Pressure',
        description: 'Main system pressure',
        currentValue: 85.2,
        historicalData: [83, 84, 86, 85, 87, 85, 85],
        min: 0,
        max: 120,
        thresholds: { warning: 110, critical: 115 }
      },
      {
        id: 'filter-backwash-cycles',
        name: 'Filter Backwash Cycles',
        unit: 'Cycles/day',
        category: 'Maintenance',
        description: 'Number of filter backwash cycles per day',
        currentValue: 12,
        historicalData: [11, 12, 13, 12, 11, 12, 12],
        min: 0,
        max: 20
      }
    ]
  },
  {
    id: 'alerts-maintenance',
    name: 'Alerts & Maintenance',
    description: 'System alerts and maintenance metrics',
    parameters: [
      {
        id: 'active-alerts',
        name: 'Active Alerts',
        unit: 'Count',
        category: 'Alerts',
        description: 'Number of currently active alerts',
        currentValue: 3,
        historicalData: [5, 4, 3, 3, 2, 3, 3],
        min: 0,
        max: 20,
        thresholds: { warning: 10, critical: 15 }
      },
      {
        id: 'maintenance-score',
        name: 'Maintenance Health Score',
        unit: 'Score',
        category: 'Maintenance',
        description: 'Overall maintenance health rating',
        currentValue: 87,
        historicalData: [85, 86, 88, 87, 89, 87, 87],
        min: 0,
        max: 100,
        thresholds: { warning: 70, critical: 60 }
      },
      {
        id: 'uptime-percentage',
        name: 'System Uptime',
        unit: '%',
        category: 'Reliability',
        description: 'System uptime percentage',
        currentValue: 99.2,
        historicalData: [99.1, 99.2, 99.3, 99.2, 99.1, 99.2, 99.2],
        min: 90,
        max: 100,
        thresholds: { warning: 95, critical: 92 }
      }
    ]
  }
];

interface DataSourceSelectorProps {
  selectedDataSource?: string;
  selectedParameter?: string;
  onDataSourceChange: (dataSourceId: string) => void;
  onParameterChange: (parameterId: string) => void;
  className?: string;
}

export function DataSourceSelector({
  selectedDataSource,
  selectedParameter,
  onDataSourceChange,
  onParameterChange,
  className = ""
}: DataSourceSelectorProps) {
  const currentDataSource = AVAILABLE_DATA_SOURCES.find(ds => ds.id === selectedDataSource);
  const availableParameters = currentDataSource?.parameters || [];

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label className="text-slate-300 mb-2 block">Data Source</Label>
        <Select value={selectedDataSource} onValueChange={onDataSourceChange}>
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue placeholder="Select data source..." />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            {AVAILABLE_DATA_SOURCES.map(source => (
              <SelectItem key={source.id} value={source.id} className="text-white">
                <div>
                  <div className="font-medium">{source.name}</div>
                  <div className="text-xs text-slate-400">{source.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {availableParameters.length > 0 && (
        <div>
          <Label className="text-slate-300 mb-2 block">Parameter</Label>
          <Select value={selectedParameter} onValueChange={onParameterChange}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select parameter..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {availableParameters.map(param => (
                <SelectItem key={param.id} value={param.id} className="text-white">
                  <div>
                    <div className="font-medium">{param.name}</div>
                    <div className="text-xs text-slate-400">
                      {param.category} • {param.unit} • Current: {param.currentValue}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedParameter && currentDataSource && (
        <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
          <div className="text-sm text-slate-300">
            <div className="font-medium mb-1">
              {availableParameters.find(p => p.id === selectedParameter)?.name}
            </div>
            <div className="text-xs text-slate-400">
              {availableParameters.find(p => p.id === selectedParameter)?.description}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get parameter data by ID
export function getParameterData(dataSourceId: string, parameterId: string): DataParameter | null {
  const dataSource = AVAILABLE_DATA_SOURCES.find(ds => ds.id === dataSourceId);
  if (!dataSource) return null;
  
  return dataSource.parameters.find(p => p.id === parameterId) || null;
}

// Helper function to get all parameters from a data source
export function getDataSourceParameters(dataSourceId: string): DataParameter[] {
  const dataSource = AVAILABLE_DATA_SOURCES.find(ds => ds.id === dataSourceId);
  return dataSource?.parameters || [];
}