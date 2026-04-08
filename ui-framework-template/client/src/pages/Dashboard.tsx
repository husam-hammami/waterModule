import { CyberpunkCard, StatusCard } from "../components/CyberpunkCard";
import { CyberpunkGauge, LinearGauge } from "../components/CyberpunkGauge";
import { Sparkline, DonutChart, MiniBarChart } from "../components/CyberpunkChart";
import { CyberpunkButton } from "../components/CyberpunkButton";
import { Activity, Zap, Users, TrendingUp, Settings } from "lucide-react";

export default function Dashboard() {
  // Example data - replace with your real data
  const sampleData = [65, 78, 90, 81, 56, 70, 85, 92, 88, 76, 82, 95];
  const barData = [10, 20, 15, 30, 25, 35, 40, 28, 22, 18];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-2">Welcome to your cyberpunk dashboard</p>
        </div>
        <div className="flex space-x-3">
          <CyberpunkButton variant="secondary" icon={Settings}>
            Settings
          </CyberpunkButton>
          <CyberpunkButton variant="primary" icon={Activity}>
            View Details
          </CyberpunkButton>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          label="Active Users"
          value={2847}
          status="online"
          progress={85}
        />
        <StatusCard
          label="System Load"
          value={67}
          unit="%"
          status="warning"
          progress={67}
        />
        <StatusCard
          label="Revenue"
          value="$12.4K"
          status="online"
          progress={92}
        />
        <StatusCard
          label="Errors"
          value={3}
          status="offline"
          progress={12}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Circular Gauges */}
        <CyberpunkCard title="System Performance" icon={Activity} glowColor="cyan">
          <div className="grid grid-cols-2 gap-4">
            <CyberpunkGauge
              value={85}
              max={100}
              label="CPU Usage"
              unit="%"
              color="#00ffff"
              size={100}
            />
            <CyberpunkGauge
              value={67}
              max={100}
              label="Memory"
              unit="%"
              color="#00ff00"
              size={100}
            />
          </div>
        </CyberpunkCard>

        {/* Linear Gauges */}
        <CyberpunkCard title="Resources" icon={Zap} glowColor="green">
          <div className="space-y-4">
            <LinearGauge
              value={78}
              max={100}
              label="Disk Usage"
              unit="%"
              color="#00ff00"
            />
            <LinearGauge
              value={45}
              max={100}
              label="Network"
              unit="%"
              color="#0080ff"
            />
            <LinearGauge
              value={92}
              max={100}
              label="Bandwidth"
              unit="%"
              color="#ff8000"
            />
          </div>
        </CyberpunkCard>

        {/* Mini Charts */}
        <CyberpunkCard title="Analytics" icon={TrendingUp} glowColor="blue">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Trends</span>
              <Sparkline data={sampleData} color="#00ffff" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Performance</span>
              <DonutChart percentage={78} color="#00ff00" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Activity</span>
              <MiniBarChart data={barData} color="#0080ff" />
            </div>
          </div>
        </CyberpunkCard>
      </div>

      {/* Large Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <CyberpunkCard title="Recent Activity" icon={Activity} glowColor="purple">
          <div className="space-y-3">
            {[
              { type: "info", message: "System updated successfully", time: "2 min ago" },
              { type: "warning", message: "High memory usage detected", time: "5 min ago" },
              { type: "success", message: "Backup completed", time: "12 min ago" },
              { type: "error", message: "Authentication failed", time: "18 min ago" }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  item.type === 'success' ? 'bg-green-400' :
                  item.type === 'warning' ? 'bg-orange-400' :
                  item.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                } animate-pulse`} />
                <div className="flex-1">
                  <p className="text-sm text-slate-300">{item.message}</p>
                  <p className="text-xs text-slate-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CyberpunkCard>

        {/* System Status */}
        <CyberpunkCard title="System Status" icon={Users} glowColor="orange">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Uptime</span>
                  <span className="text-lg font-bold text-green-400">99.9%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="h-2 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full" style={{ width: '99.9%' }} />
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Response</span>
                  <span className="text-lg font-bold text-cyan-400">145ms</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Throughput</span>
                <span className="text-lg font-bold text-white">2.4K req/s</span>
              </div>
              <Sparkline data={sampleData} color="#00ff00" width={200} height={30} />
            </div>
          </div>
        </CyberpunkCard>
      </div>
    </div>
  );
}