import { CyberpunkCard } from "../components/CyberpunkCard";
import { CyberpunkButton } from "../components/CyberpunkButton";
import { Settings as SettingsIcon, Save, User, Bell, Shield } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-2">Manage your application preferences</p>
        </div>
        <CyberpunkButton variant="primary" icon={Save}>
          Save Changes
        </CyberpunkButton>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CyberpunkCard title="User Profile" icon={User} glowColor="cyan">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
              <input
                type="text"
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </CyberpunkCard>

        <CyberpunkCard title="Notifications" icon={Bell} glowColor="green">
          <div className="space-y-4">
            {[
              { label: "Email notifications", description: "Receive updates via email" },
              { label: "Push notifications", description: "Get real-time alerts" },
              { label: "SMS alerts", description: "Critical alerts via SMS" }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-300">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.description}</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked={index === 0}
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </div>
              </div>
            ))}
          </div>
        </CyberpunkCard>

        <CyberpunkCard title="Security" icon={Shield} glowColor="orange">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
              <input
                type="password"
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
              <input
                type="password"
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                placeholder="Enter new password"
              />
            </div>
            <CyberpunkButton variant="secondary" size="sm">
              Update Password
            </CyberpunkButton>
          </div>
        </CyberpunkCard>

        <CyberpunkCard title="Appearance" icon={SettingsIcon} glowColor="purple">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Theme</label>
              <select className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200">
                <option value="cyberpunk">Cyberpunk Dark</option>
                <option value="neon">Neon Blue</option>
                <option value="matrix">Matrix Green</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
              <select className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </CyberpunkCard>
      </div>
    </div>
  );
}