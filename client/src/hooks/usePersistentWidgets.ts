import { useState, useEffect, useCallback, useRef } from 'react';
import { saveChart, saveAllCharts, loadCharts, deleteChart, clearAllCharts } from '../utils/chartPersistence';

interface WaterWidgetType {
  id: string;
  type: 'kpi' | 'chart' | 'gauge' | 'network' | 'table' | 'process-flow';
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: any;
  data?: any[];
}

export function usePersistentWidgets(position: 'left' | 'right') {
  // Prevent automatic clearing during HMR
  const isInitializedRef = useRef(false);
  const lastSaveRef = useRef<string>('');
  
  const [widgets, setWidgets] = useState<WaterWidgetType[]>(() => {
    const loadedWidgets = loadCharts(position);
    console.log(`🚀 INIT: Loading ${loadedWidgets.length} widgets for ${position} panel`);
    isInitializedRef.current = true;
    return loadedWidgets;
  });

  // Save widgets with HMR protection
  const saveWidgetsState = useCallback((widgetsToSave: WaterWidgetType[]) => {
    if (!isInitializedRef.current) return;
    
    const serialized = JSON.stringify(widgetsToSave);
    if (serialized === lastSaveRef.current) return; // Prevent duplicate saves
    
    lastSaveRef.current = serialized;
    saveAllCharts(widgetsToSave, position);
  }, [position]);

  // Auto-save when widgets change (with debouncing)
  useEffect(() => {
    if (!isInitializedRef.current) return;
    
    const timeoutId = setTimeout(() => {
      saveWidgetsState(widgets);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [widgets, saveWidgetsState]);

  // Add widget with immediate persistence
  const addWidget = useCallback((newWidget: WaterWidgetType) => {
    setWidgets(prev => {
      const updated = [...prev, newWidget];
      // Immediate save for critical operations
      saveChart(newWidget, position);
      return updated;
    });
  }, [position]);

  // Update widget with immediate persistence
  const updateWidget = useCallback((updatedWidget: WaterWidgetType) => {
    setWidgets(prev => {
      const updated = prev.map(widget => 
        widget.id === updatedWidget.id ? updatedWidget : widget
      );
      saveChart(updatedWidget, position);
      return updated;
    });
  }, [position]);

  // Delete widget with immediate persistence
  const deleteWidget = useCallback((widgetId: string) => {
    setWidgets(prev => {
      const updated = prev.filter(widget => widget.id !== widgetId);
      deleteChart(widgetId);
      return updated;
    });
  }, []);

  // Reorder widgets with immediate persistence
  const reorderWidgets = useCallback((reorderedWidgets: WaterWidgetType[]) => {
    const updatedWidgets = reorderedWidgets.map((widget, index) => ({
      ...widget,
      position: { ...widget.position, y: index }
    }));
    
    setWidgets(updatedWidgets);
    saveAllCharts(updatedWidgets, position);
  }, [position]);

  // Clear all widgets with confirmation
  const clearAllWidgets = useCallback(() => {
    if (widgets.length > 0) {
      const confirmed = window.confirm(
        `Are you sure you want to remove all ${widgets.length} charts from the ${position} panel? This action cannot be undone.`
      );
      if (!confirmed) return false;
    }
    
    setWidgets([]);
    clearAllCharts(position);
    return true;
  }, [widgets.length, position]);

  return {
    widgets,
    addWidget,
    updateWidget,
    deleteWidget,
    reorderWidgets,
    clearAllWidgets,
    saveWidgetsState
  };
}