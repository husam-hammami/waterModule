// Simple and robust chart persistence without complex types
const CHART_STORAGE_KEY = 'hercules-charts-v3';
const DELETED_ITEMS_KEY = 'hercules-deleted-items-v1';

interface StoredChart {
  id: string;
  type: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: any;
  panel: 'left' | 'right';
  createdAt: number;
}

// Global storage to prevent loss during HMR - initialize immediately
const chartStorage: Map<string, StoredChart> = new Map();
const deletedItems: Set<string> = new Set();

// Initialize storage immediately when module loads
function initializeStorage() {
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem(CHART_STORAGE_KEY);
      if (stored) {
        const allCharts: StoredChart[] = JSON.parse(stored);
        allCharts.forEach(chart => chartStorage.set(chart.id, chart));
        console.log(`📥 Initialized with ${allCharts.length} charts from localStorage`);
      }
      
      // Load deleted items
      const deletedStored = localStorage.getItem(DELETED_ITEMS_KEY);
      if (deletedStored) {
        const deletedList: string[] = JSON.parse(deletedStored);
        deletedList.forEach(id => deletedItems.add(id));
        console.log(`🗑️ Loaded ${deletedList.length} deleted items from localStorage`);
      }
    } catch (error) {
      console.error('❌ Failed to initialize from localStorage:', error);
    }
  }
}

// Initialize immediately
initializeStorage();

export function saveChart(chart: any, panel: 'left' | 'right'): void {
  try {
    const storedChart: StoredChart = {
      id: chart.id,
      type: chart.type,
      title: chart.title,
      position: chart.position,
      size: chart.size,
      config: chart.config,
      panel,
      createdAt: chart.createdAt || Date.now()
    };
    
    chartStorage.set(chart.id, storedChart);
    
    // Force immediate localStorage save
    const allCharts = Array.from(chartStorage.values());
    localStorage.setItem(CHART_STORAGE_KEY, JSON.stringify(allCharts));
    
    console.log(`🔒 PERMANENTLY SAVED: Chart "${chart.title}" to ${panel} panel (${allCharts.length} total charts)`);
  } catch (error) {
    console.error('❌ Failed to save chart:', error);
  }
}

export function saveAllCharts(charts: any[], panel: 'left' | 'right'): void {
  try {
    // Remove old charts for this panel
    const entriesToDelete: string[] = [];
    chartStorage.forEach((chart, id) => {
      if (chart.panel === panel) {
        entriesToDelete.push(id);
      }
    });
    entriesToDelete.forEach(id => chartStorage.delete(id));
    
    // Add new charts with immediate save
    charts.forEach((chart, index) => {
      const storedChart: StoredChart = {
        id: chart.id,
        type: chart.type,
        title: chart.title,
        position: { ...chart.position, y: index }, // Update position based on order
        size: chart.size,
        config: chart.config,
        panel,
        createdAt: chart.createdAt || Date.now()
      };
      chartStorage.set(chart.id, storedChart);
    });
    
    // Force immediate localStorage save
    const allCharts = Array.from(chartStorage.values());
    localStorage.setItem(CHART_STORAGE_KEY, JSON.stringify(allCharts));
    
    console.log(`🔒 BATCH SAVED: ${charts.length} charts to ${panel} panel (${allCharts.length} total)`);
  } catch (error) {
    console.error('❌ Failed to batch save charts:', error);
  }
}

export function loadCharts(panel: 'left' | 'right'): any[] {
  try {
    // Always refresh from localStorage to get latest data
    const stored = localStorage.getItem(CHART_STORAGE_KEY);
    if (stored) {
      const allCharts: StoredChart[] = JSON.parse(stored);
      // Clear and reload to ensure fresh data
      chartStorage.clear();
      allCharts.forEach(chart => chartStorage.set(chart.id, chart));
    }
    
    // Filter charts for this panel
    const panelCharts = Array.from(chartStorage.values())
      .filter(chart => chart.panel === panel)
      .sort((a, b) => a.createdAt - b.createdAt);
    
    console.log(`🔓 LOADED: ${panelCharts.length} charts for ${panel} panel`);
    console.log(`📊 Current chart titles: ${panelCharts.map(c => c.title).join(', ')}`);
    return panelCharts;
  } catch (error) {
    console.error('❌ Failed to load charts:', error);
    return [];
  }
}

export function deleteChart(chartId: string): void {
  chartStorage.delete(chartId);
  
  // Add to deleted items list to prevent recreation
  deletedItems.add(chartId);
  
  // Update localStorage
  const allCharts = Array.from(chartStorage.values());
  localStorage.setItem(CHART_STORAGE_KEY, JSON.stringify(allCharts));
  
  const deletedList = Array.from(deletedItems);
  localStorage.setItem(DELETED_ITEMS_KEY, JSON.stringify(deletedList));
  
  console.log(`🗑️ DELETED: Chart ${chartId} - added to permanent deletion list`);
}

export function clearAllCharts(panel: 'left' | 'right'): void {
  // Remove charts for this panel
  const entriesToDelete: string[] = [];
  chartStorage.forEach((chart, id) => {
    if (chart.panel === panel) {
      entriesToDelete.push(id);
    }
  });
  entriesToDelete.forEach(id => chartStorage.delete(id));
  
  // Update localStorage
  const allCharts = Array.from(chartStorage.values());
  localStorage.setItem(CHART_STORAGE_KEY, JSON.stringify(allCharts));
  
  console.log(`🗑️ CLEARED: All charts for ${panel} panel`);
}

// Check if an item is deleted
export function isItemDeleted(itemId: string): boolean {
  return deletedItems.has(itemId);
}

// Restore a deleted item
export function restoreDeletedItem(itemId: string): void {
  deletedItems.delete(itemId);
  const deletedList = Array.from(deletedItems);
  localStorage.setItem(DELETED_ITEMS_KEY, JSON.stringify(deletedList));
  console.log(`♻️ RESTORED: Item ${itemId} removed from deletion list`);
}

// Prevent data loss during page refresh
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (chartStorage.size > 0) {
      try {
        const allCharts = Array.from(chartStorage.values());
        localStorage.setItem(CHART_STORAGE_KEY, JSON.stringify(allCharts));
        console.log('💾 Emergency save before page unload');
      } catch (error) {
        console.error('❌ Emergency save failed:', error);
      }
    }
  });
  
  // Additional initialization check
  initializeStorage();
}