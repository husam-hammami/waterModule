import { CyberpunkCard } from "../components/CyberpunkCard";
import { CyberpunkButton } from "../components/CyberpunkButton";
import { BarChart3, TrendingUp, Download, Filter } from "lucide-react";

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 mt-2">Data insights and performance metrics</p>
        </div>
        <div className="flex space-x-3">
          <CyberpunkButton variant="secondary" icon={Filter}>
            Filter
          </CyberpunkButton>
          <CyberpunkButton variant="primary" icon={Download}>
            Export
          </CyberpunkButton>
        </div>
      </div>

      {/* Example Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CyberpunkCard title="Traffic Analytics" icon={BarChart3} glowColor="cyan">
          <div className="space-y-4">
            <div className="text-center py-8">
              <TrendingUp className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Replace with your charts</h3>
              <p className="text-slate-400">Add your Chart.js or other visualization library here</p>
            </div>
          </div>
        </CyberpunkCard>

        <CyberpunkCard title="Performance Metrics" icon={TrendingUp} glowColor="green">
          <div className="space-y-4">
            <div className="text-center py-8">
              <BarChart3 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Add your data</h3>
              <p className="text-slate-400">Connect to your analytics backend</p>
            </div>
          </div>
        </CyberpunkCard>
      </div>
    </div>
  );
}