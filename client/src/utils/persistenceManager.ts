// Global persistence manager to prevent chart loss during HMR
const STORAGE_PREFIX = 'hercules-dashboard-v2';
const LEFT_WIDGETS_KEY = `${STORAGE_PREFIX}-left-widgets`;
const RIGHT_WIDGETS_KEY = `${STORAGE_PREFIX}-right-widgets`;

interface PersistentChart {
  id: string;
  type: 'kpi' | 'chart' | 'gauge' | 'network' | 'table' | 'process-flow';
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: any;
  data?: any[];
  createdAt?: number;
  lastModified?: number;
}

class PersistenceManager {
  private static instance: PersistenceManager;
  private saveQueue: Map<string, PersistentChart[]> = new Map();
  private saveTimeout: number | null = null;

  static getInstance(): PersistenceManager {
    if (!PersistenceManager.instance) {
      PersistenceManager.instance = new PersistenceManager();
    }
    return PersistenceManager.instance;
  }

  // Immediate save for critical operations (adding/deleting charts)
  saveChartsImmediate(position: 'left' | 'right', charts: PersistentChart[]): void {
    try {
      const key = position === 'left' ? LEFT_WIDGETS_KEY : RIGHT_WIDGETS_KEY;
      const dataToSave = charts.map(chart => ({
        ...chart,
        createdAt: chart.createdAt || Date.now(),
        lastModified: Date.now()
      }));
      
      localStorage.setItem(key, JSON.stringify(dataToSave));
      console.log(`🔒 IMMEDIATE SAVE: ${charts.length} charts for ${position} panel`);
    } catch (error) {
      console.error('❌ Failed immediate save:', error);
    }
  }

  // Batch save for frequent operations (position changes)
  saveChartsBatch(position: 'left' | 'right', charts: PersistentChart[]): void {
    this.saveQueue.set(position, charts);
    
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    this.saveTimeout = setTimeout(() => {
      this.flushSaveQueue();
    }, 500);
  }

  private flushSaveQueue(): void {
    this.saveQueue.forEach((charts, positionKey) => {
      const position = positionKey as 'left' | 'right';
      this.saveChartsImmediate(position, charts);
    });
    this.saveQueue.clear();
    this.saveTimeout = null;
  }

  loadCharts(position: 'left' | 'right'): PersistentChart[] {
    try {
      const key = position === 'left' ? LEFT_WIDGETS_KEY : RIGHT_WIDGETS_KEY;
      const stored = localStorage.getItem(key);
      
      if (!stored) {
        console.log(`📂 No stored charts for ${position} panel`);
        return [];
      }
      
      const charts = JSON.parse(stored);
      console.log(`🔓 LOADED: ${charts.length} charts for ${position} panel`);
      return charts;
    } catch (error) {
      console.error('❌ Failed to load charts:', error);
      return [];
    }
  }

  clearCharts(position: 'left' | 'right'): void {
    const key = position === 'left' ? LEFT_WIDGETS_KEY : RIGHT_WIDGETS_KEY;
    localStorage.removeItem(key);
    console.log(`🗑️ CLEARED: All charts for ${position} panel`);
  }

  // Prevent data loss during page refresh/HMR
  beforeUnload(): void {
    this.flushSaveQueue();
  }
}

// Global instance
export const persistenceManager = PersistenceManager.getInstance();

// Setup beforeunload handler
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    persistenceManager.beforeUnload();
  });
}