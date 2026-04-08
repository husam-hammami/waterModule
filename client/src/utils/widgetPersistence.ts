// Widget persistence utilities
export const STORAGE_KEYS = {
  LEFT_WIDGETS: 'hercules-dashboard-widgets-left',
  RIGHT_WIDGETS: 'hercules-dashboard-widgets-right',
  WIDGET_SETTINGS: 'hercules-dashboard-settings'
};

export interface PersistedWidget {
  id: string;
  type: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: any;
  createdAt: number;
  lastModified: number;
  persistent: boolean;
}

export const saveWidgets = (position: 'left' | 'right', widgets: any[]) => {
  try {
    const key = position === 'left' ? STORAGE_KEYS.LEFT_WIDGETS : STORAGE_KEYS.RIGHT_WIDGETS;
    const persistedWidgets = widgets.map(widget => ({
      ...widget,
      lastModified: Date.now(),
      persistent: true
    }));
    
    localStorage.setItem(key, JSON.stringify(persistedWidgets));
    console.log(`✅ PERSISTENCE: Saved ${widgets.length} widgets for ${position} panel to localStorage`);
    return true;
  } catch (error) {
    console.error('❌ PERSISTENCE: Failed to save widgets:', error);
    return false;
  }
};

export const loadWidgets = (position: 'left' | 'right'): any[] => {
  try {
    const key = position === 'left' ? STORAGE_KEYS.LEFT_WIDGETS : STORAGE_KEYS.RIGHT_WIDGETS;
    const stored = localStorage.getItem(key);
    
    if (!stored) {
      console.log(`📂 PERSISTENCE: No stored widgets found for ${position} panel`);
      return [];
    }
    
    const widgets = JSON.parse(stored);
    console.log(`✅ PERSISTENCE: Loaded ${widgets.length} widgets for ${position} panel from localStorage`);
    return widgets;
  } catch (error) {
    console.error('❌ PERSISTENCE: Failed to load widgets:', error);
    return [];
  }
};

export const clearWidgets = (position: 'left' | 'right') => {
  try {
    const key = position === 'left' ? STORAGE_KEYS.LEFT_WIDGETS : STORAGE_KEYS.RIGHT_WIDGETS;
    localStorage.removeItem(key);
    console.log(`🗑️ PERSISTENCE: Cleared all widgets for ${position} panel`);
    return true;
  } catch (error) {
    console.error('❌ PERSISTENCE: Failed to clear widgets:', error);
    return false;
  }
};

export const validateWidgetIntegrity = (widgets: any[]): any[] => {
  return widgets.filter(widget => {
    const isValid = widget.id && widget.title && widget.config;
    if (!isValid) {
      console.warn('⚠️ PERSISTENCE: Removing invalid widget:', widget);
    }
    return isValid;
  });
};