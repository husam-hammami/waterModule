import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { FacilityCard } from "@/components/FacilityCard";
import { NetworkTopology } from "@/components/NetworkTopology";
import { LeftDashboardPanel } from "@/components/LeftDashboardPanel";
import { RightDashboardPanel } from "@/components/RightDashboardPanel";
import { CenterMetricsPanel } from "@/components/CenterMetricsPanel";
import { CustomizableKPICards } from "@/components/CustomizableKPICards";
import { CustomizableGaugesSection } from "@/components/dashboard/CustomizableGaugesSection";
import { DraggablePanel } from "@/components/dashboard/DraggablePanel";
import { ChartSelectionDialog } from "@/components/dashboard/ChartSelectionDialog";
import { KPIConfigurationDialog } from "@/components/KPIConfigurationDialog";
import { GaugeConfigurationDialog } from "@/components/GaugeConfigurationDialog";
import { loadCharts, saveAllCharts, isItemDeleted } from "@/utils/chartPersistence";
import { usePersistentWidgets } from "@/hooks/usePersistentWidgets";
import { mockFacilities, aggregateMetrics } from "@/lib/mockData";
import { Facility } from "@shared/schema";
import herculesLogo from "../assets/hercules-logo-final.png";
import { Droplets, Activity, Zap, TrendingUp } from "lucide-react";
import { ChartRenderer } from "@/components/dashboard/ChartRenderer";
import { useConfirmation } from "@/hooks/useConfirmation";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

export default function Dashboard() {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [showAddChartDialog, setShowAddChartDialog] = useState(false);
  const [showKPIConfig, setShowKPIConfig] = useState(false);
  const [showGaugeConfig, setShowGaugeConfig] = useState(false);
  const [, setLocation] = useLocation();
  const [leftCharts, setLeftCharts] = useState<any[]>([]);
  const [rightCharts, setRightCharts] = useState<any[]>([]);
  const [kpiCards, setKpiCards] = useState<any[]>([]);
  const [centerGauges, setCenterGauges] = useState<any[]>([]);
  const { confirmation, confirm, closeConfirmation } = useConfirmation();
  
  // Use persistent widgets hooks for proper drag and drop persistence
  const leftPersistence = usePersistentWidgets('left');
  const rightPersistence = usePersistentWidgets('right');

  // Load KPI cards and gauges from localStorage on mount
  useEffect(() => {
    try {
      // Load KPI cards
      const savedKPICards = localStorage.getItem('hercules-kpi-cards');
      if (savedKPICards) {
        setKpiCards(JSON.parse(savedKPICards));
      }

      // Load center gauges  
      const savedGauges = localStorage.getItem('hercules-center-gauges');
      if (savedGauges) {
        const parsedGauges = JSON.parse(savedGauges);
        // Add icon components back since they can't be serialized
        const gaugesWithIcons = parsedGauges.map((gauge: any) => ({
          ...gauge,
          icon: gauge.id === 'flow' ? Droplets : 
                gauge.id === 'pressure' ? Activity :
                gauge.id === 'energy' ? Zap : 
                gauge.id === 'quality' ? TrendingUp : Droplets
        }));
        setCenterGauges(gaugesWithIcons);
      }
    } catch (error) {
      console.warn('Failed to load dashboard configuration:', error);
    }
  }, []);

  const handleResetLayout = async () => {
    const confirmed = await confirm({
      title: 'Reset Dashboard',
      message: 'Are you sure you want to reset all dashboard components? This action cannot be undone and will restore all panels to their default configuration.',
      confirmText: 'Reset All',
      cancelText: 'Keep Layout',
      variant: 'warning'
    });

    if (confirmed) {
      // Reset all dashboard components
      leftPersistence.clearAllWidgets();
      rightPersistence.clearAllWidgets();
      
      // Reset center gauges through global function
      if ((window as any).resetCenterGauges) {
        (window as any).resetCenterGauges();
      }
      
      // Reset KPI cards through global function
      if ((window as any).resetKPICards) {
        (window as any).resetKPICards();
      }
      
      // Clear any remaining chart data
      localStorage.removeItem('hercules-charts-v3');
      
      console.log('🔄 Complete dashboard reset: KPI cards, center gauges, side panels, and charts restored to default');
    }
  };

  const handleFacilityClick = (facility: Facility) => {
    setSelectedFacility(facility);
    setLocation(`/facility/${facility.id}/overview`);
  };

  // Load charts on component mount and when needed
  useEffect(() => {
    const refreshCharts = () => {
      try {
        const leftSavedCharts = loadCharts('left');
        const rightSavedCharts = loadCharts('right');
        setLeftCharts(leftSavedCharts);
        setRightCharts(rightSavedCharts);
      } catch (error) {
        console.error('Error loading charts:', error);
        setLeftCharts([]);
        setRightCharts([]);
      }
    };

    refreshCharts();
    
    // No automatic refresh - only reload when user manually adds charts
  }, []);

  // Load charts from persistence and add to panel items
  const getLeftPanelItems = () => {
    const savedCharts = leftCharts;
    const savedPanelOrder = leftPersistence.widgets;
    
    const staticItems = [
    {
      id: 'system-health',
      title: 'System Health',
      content: (
        <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[hsl(158,100%,50%)] rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-[hsl(158,100%,50%)]">System Health</span>
              <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded-full">LIVE</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xs text-slate-400 mb-1">OPTIMAL</div>
              <div className="text-2xl font-bold text-[hsl(158,100%,50%)]">12ms</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400 mb-1">HIGH</div>
              <div className="text-2xl font-bold text-[hsl(212,100%,50%)]">89.2 MB/s</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400 mb-1">NORMAL</div>
              <div className="text-2xl font-bold text-[hsl(20,100%,50%)]">34%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400 mb-1">MINIMAL</div>
              <div className="text-2xl font-bold text-[hsl(270,100%,70%)]">0.02%</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'flow-pressure-gauges',
      title: 'Flow & Pressure',
      content: (
        <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[hsl(212,100%,50%)]">Flow Rate</span>
            <span className="text-xs text-slate-400">L/s</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative w-20 h-20 mx-auto">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="hsl(240, 3.7%, 15.9%)" strokeWidth="4" fill="none" />
                <circle cx="40" cy="40" r="32" stroke="hsl(212, 100%, 50%)" strokeWidth="4" fill="none"
                  strokeDasharray={`${85.2 * 2} ${(100 - 85.2) * 2}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-[hsl(212,100%,50%)]">85.2</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400 mb-1">PSI</div>
              <div className="text-2xl font-bold text-[hsl(212,100%,50%)]">847</div>
              <div className="text-xs text-[hsl(158,100%,50%)]">EFFICIENT</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'quality-energy-metrics',
      title: 'Quality & Energy',
      content: (
        <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[hsl(270,100%,70%)]">Quality</span>
            <span className="text-xs text-slate-400">Score</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative w-20 h-20 mx-auto">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="hsl(240, 3.7%, 15.9%)" strokeWidth="4" fill="none" />
                <circle cx="40" cy="40" r="32" stroke="hsl(270, 100%, 70%)" strokeWidth="4" fill="none"
                  strokeDasharray={`${94.7 * 2} ${(100 - 94.7) * 2}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-[hsl(270,100%,70%)]">94.7</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400 mb-1">EXCELLENT</div>
              <div className="text-xs text-[hsl(158,100%,50%)]">EXCELLENT</div>
            </div>
          </div>
        </div>
      )
    }
    ];

    const chartItems = savedCharts.map((chart: any) => ({
      id: chart.id, // Use original chart ID without extra prefix
      title: chart.title,
      content: (
        <ChartRenderer 
          chartConfig={chart.config} 
          className="mb-4"
          height="h-40"
        />
      )
    }));

    return [...chartItems, ...staticItems];
  };

  // Load charts from persistence and add to right panel items  
  const getRightPanelItems = () => {
    const savedCharts = rightCharts;
    const savedPanelOrder = rightPersistence.widgets;
    
    const staticItems = [
    {
      id: 'production-stats',
      title: 'Production Stats',
      content: (
        <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-300">Production Stats</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Total Output</span>
                <span className="text-[hsl(180,100%,50%)]">18.4M L</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-[hsl(180,100%,50%)] to-[hsl(212,100%,50%)] h-2 rounded-full" 
                     style={{ width: '87%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Daily Target</span>
                <span className="text-[hsl(158,100%,50%)]">87%</span>
              </div>
              <div className="text-xs text-slate-500">12 hours remaining</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'efficiency-gauge',
      title: 'Efficiency Gauge',
      content: (
        <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[hsl(20,100%,50%)]">Efficiency</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative w-20 h-20 mx-auto">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="hsl(240, 3.7%, 15.9%)" strokeWidth="4" fill="none" />
                <circle cx="40" cy="40" r="32" stroke="hsl(20, 100%, 50%)" strokeWidth="4" fill="none"
                  strokeDasharray={`${94.5 * 2} ${(100 - 94.5) * 2}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-[hsl(20,100%,50%)]">94.5%</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400 mb-1">Efficiency</div>
              <div className="text-xs text-[hsl(158,100%,50%)]">EXCELLENT</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'quality-score',
      title: 'Quality Score',
      content: (
        <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[hsl(158,100%,50%)]">Quality Score</span>
          </div>
          <div className="relative w-20 h-20 mx-auto">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle cx="40" cy="40" r="32" stroke="hsl(240, 3.7%, 15.9%)" strokeWidth="4" fill="none" />
              <circle cx="40" cy="40" r="32" stroke="hsl(158, 100%, 50%)" strokeWidth="4" fill="none"
                strokeDasharray={`${97 * 2} ${(100 - 97) * 2}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-[hsl(158,100%,50%)]">97</span>
            </div>
          </div>
          <div className="text-center mt-2">
            <div className="text-xs text-[hsl(158,100%,50%)]">Excellent</div>
          </div>
        </div>
      )
    }
    ];

    const chartItems = savedCharts.map((chart: any) => ({
      id: chart.id, // Use original chart ID without extra prefix
      title: chart.title,
      content: (
        <ChartRenderer 
          chartConfig={chart.config} 
          className="mb-4"
          height="h-40"
        />
      )
    }));

    const allItems = [...chartItems, ...staticItems];
    
    // Filter out deleted items first
    const nonDeletedItems = allItems.filter(item => !isItemDeleted(item.id));
    
    // Sort items based on saved positions if any exist
    if (savedPanelOrder.length > 0) {
      const orderedItems = savedPanelOrder
        .map(savedItem => nonDeletedItems.find(item => item.id === savedItem.id))
        .filter((item): item is NonNullable<typeof item> => Boolean(item));
      
      // Add any new items that weren't in the saved order
      const newItems = nonDeletedItems.filter(item => 
        !savedPanelOrder.find(saved => saved.id === item.id)
      );
      
      return [...orderedItems, ...newItems];
    }
    
    return nonDeletedItems;
  };

  return (
    <div className="min-h-screen overflow-y-scroll relative" style={{ height: 'auto' }}>
      {/* Main Layout Container - Flexbox Layout with Full Page Scrolling */}
      <div className="p-2 flex flex-col gap-2 relative z-10" style={{ minHeight: 'calc(100vh + 400px)' }}>
        
        {/* Header Control Panel */}
        <div className="flex-shrink-0 h-16 holographic rounded-lg p-3 flex items-center justify-between relative overflow-hidden">
          {/* Scanning Line Effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[hsl(180,100%,50%)] to-transparent animate-data-flow" />
            <div className="data-particle" style={{ top: '50%', animationDelay: '0s' }} />
            <div className="data-particle" style={{ top: '30%', animationDelay: '1s' }} />
            <div className="data-particle" style={{ top: '70%', animationDelay: '2s' }} />
          </div>
          
          <div className="flex items-center justify-between absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/70 to-slate-900/90 backdrop-blur-md rounded-lg px-6 py-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/10 z-10">
            {/* Left side - Logo and branding */}
            <div className="flex items-center space-x-3">
              <img 
                src={herculesLogo} 
                alt="Hercules v2.0" 
                className="h-10 w-auto object-contain"
                style={{ 
                  filter: 'brightness(0) invert(1)',
                  opacity: 0.95,
                  imageRendering: 'crisp-edges'
                }}
              />
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent"></div>
              <div className="text-sm text-slate-300 font-bold tracking-wider uppercase" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                Water Management System
              </div>
            </div>
            
            {/* Right side - Navigation icons and system info */}
            <div className="flex items-center space-x-6 text-xs font-mono">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[hsl(158,100%,50%)] rounded-full animate-pulse"></div>
              </div>
              <div className="text-slate-400">|</div>
              
              {/* Navigation Icons */}
              <div className="flex items-center space-x-2">
                <Link href="/plc-configuration">
                  <button className="p-2 rounded-md transition-colors duration-200 bg-slate-600/20 text-slate-300 border border-slate-500/40 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/40 group" title="PLC Configuration">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </Link>
                <Link href="/plc-reports">
                  <button className="p-2 rounded-md transition-colors duration-200 bg-slate-600/20 text-slate-300 border border-slate-500/40 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/40 group" title="PLC Reports">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </Link>
              </div>
              
              <div className="text-slate-400">|</div>
              <button 
                onClick={() => setShowAddChartDialog(true)}
                className="px-3 py-2 rounded-md font-semibold transition-colors duration-200 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30"
              >
                + Add New Chart
              </button>
              <button 
                onClick={handleResetLayout}
                className="px-3 py-2 rounded-md font-semibold transition-colors duration-200 bg-slate-600/20 text-slate-300 border border-slate-500/40 hover:bg-slate-600/30"
              >
                ↻ Reset Layout
              </button>
              <div className="text-slate-400">|</div>
              <div className="text-slate-300">{new Date().toLocaleString()}</div>
              <div className="text-slate-400">|</div>
              
            </div>
          </div>
        </div>

        {/* KPI Overview Row - Fully Customizable */}
        <div className="relative group">
          <CustomizableKPICards />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
            <button
              onClick={() => setShowKPIConfig(true)}
              className="p-1.5 rounded-md bg-slate-800/90 border border-slate-600/50 text-cyan-400 hover:text-cyan-300 hover:bg-slate-700/90 transition-colors"
              title="Customize KPI Cards"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content Area - Three Column Layout with Center Metrics */}
        <div className="flex-1 flex gap-1">
          {/* Left Dashboard Panel - Full Width */}
          <div className="w-96 flex-shrink-0">
            <DraggablePanel
              items={getLeftPanelItems()}
              isCustomizing={false}
              onReorder={(newOrder) => {
                // Convert to proper widget format and save
                const widgets = newOrder.map((item, index) => ({
                  id: item.id,
                  type: 'kpi' as const,
                  title: item.title,
                  position: { x: 0, y: index },
                  size: { width: 1, height: 1 },
                  config: {},
                  data: []
                }));
                leftPersistence.reorderWidgets(widgets);
              }}
              onDelete={(itemId) => {
                leftPersistence.deleteWidget(itemId);
              }}
              onConfigure={(itemId) => console.log('Configure item:', itemId)}
              className="min-h-full"
            />
            
            {/* Hidden chart section for persistence */}
            <div style={{ display: 'none' }}>
              <CustomizableGaugesSection 
                isCustomizing={false}
                onCustomizationComplete={() => {}}
                position="left"
              />
            </div>
          </div>

          {/* Center - Metrics and Network Topology */}
          <div className="flex-1 flex flex-col gap-1">
            {/* Center Metrics Panel - Now Customizable */}
            <div className="relative group">
              <CenterMetricsPanel />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                <button
                  onClick={() => setShowGaugeConfig(true)}
                  className="p-1.5 rounded-md bg-slate-800/90 border border-slate-600/50 text-cyan-400 hover:text-cyan-300 hover:bg-slate-700/90 transition-colors"
                  title="Customize Center Gauges"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1" style={{ minHeight: '600px', maxHeight: '700px' }}>
              <NetworkTopology 
                facilities={mockFacilities}
                onFacilityClick={handleFacilityClick}
              />
            </div>
          </div>

          {/* Right Dashboard Panel - Full Width */}
          <div className="w-96 flex-shrink-0">
            <DraggablePanel
              items={getRightPanelItems()}
              isCustomizing={false}
              onReorder={(newOrder) => {
                // Convert to proper widget format and save
                const widgets = newOrder.map((item, index) => ({
                  id: item.id,
                  type: 'kpi' as const,
                  title: item.title,
                  position: { x: 0, y: index },
                  size: { width: 1, height: 1 },
                  config: {},
                  data: []
                }));
                rightPersistence.reorderWidgets(widgets);
              }}
              onDelete={(itemId) => {
                rightPersistence.deleteWidget(itemId);
              }}
              onConfigure={(itemId) => console.log('Configure item:', itemId)}
              className="min-h-full"
            />
            
            {/* Hidden chart section for persistence */}
            <div style={{ display: 'none' }}>
              <CustomizableGaugesSection 
                isCustomizing={false}
                onCustomizationComplete={() => {}}
                position="right"
              />
            </div>
          </div>
        </div>

        
        {/* Bottom spacer to ensure scrolling */}
        <div className="h-32"></div>
        
      </div>

      {/* Global Add Chart Dialog */}
      <ChartSelectionDialog
        isOpen={showAddChartDialog}
        onClose={() => setShowAddChartDialog(false)}
        onAddChart={(chartType, chartConfig, targetPanel = 'left') => {
          // Import chart persistence functions
          import('@/utils/chartPersistence').then(({ saveChart }) => {
            const newWidget = {
              id: `chart-${targetPanel}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: chartConfig.type || 'gauge',
              title: chartConfig.title,
              position: { x: 0, y: 0 },
              size: { width: 360, height: 200 },
              config: {
                ...chartConfig,
                dataSource: 'water-treatment',
                refreshInterval: 30,
                createdAt: Date.now(),
                persistent: true
              }
            };
            
            saveChart(newWidget, targetPanel);
            console.log(`✓ Added new chart "${chartConfig.title}" to ${targetPanel} panel`);
            
            // Force refresh of the panels to show new chart
            window.location.reload();
          });
          
          setShowAddChartDialog(false);
        }}
        position="left"
      />

      {/* KPI Configuration Dialog */}
      <KPIConfigurationDialog
        isOpen={showKPIConfig}
        onClose={() => setShowKPIConfig(false)}
        cards={kpiCards}
        onSave={(newCards) => {
          setKpiCards(newCards);
          // Force refresh to apply changes
          window.location.reload();
        }}
      />

      {/* Gauge Configuration Dialog */}
      <GaugeConfigurationDialog
        isOpen={showGaugeConfig}
        onClose={() => setShowGaugeConfig(false)}
        gauges={centerGauges}
        onSave={(newGauges) => {
          setCenterGauges(newGauges);
          // Force refresh to apply changes
          window.location.reload();
        }}
      />

      {/* Ambient Glow Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[hsl(180,100%,50%)] rounded-full opacity-5 blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[hsl(270,100%,50%)] rounded-full opacity-5 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-[hsl(158,100%,50%)] rounded-full opacity-5 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Confirmation Dialog */}
      {confirmation && (
        <ConfirmationDialog
          isOpen={confirmation.isOpen}
          onClose={closeConfirmation}
          onConfirm={confirmation.onConfirm}
          title={confirmation.options.title}
          message={confirmation.options.message}
          confirmText={confirmation.options.confirmText}
          cancelText={confirmation.options.cancelText}
          variant={confirmation.options.variant}
        />
      )}
    </div>
  );
}
