import { Route, Switch } from "wouter";
import { CyberpunkNavigation } from "./components/CyberpunkNavigation";
import { CyberpunkLayout } from "./components/CyberpunkLayout";
import { Home, Settings, Users, BarChart3, Activity, Bell } from "lucide-react";

// Example pages - replace with your own
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

// Your logo component - replace with your own
function AppLogo() {
  return (
    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
      <span className="text-white font-bold text-sm">A</span>
    </div>
  );
}

// Navigation items - customize for your app
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/" },
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "/analytics" },
  { id: "users", label: "Users", icon: Users, path: "/users" },
  { id: "activity", label: "Activity", icon: Activity, path: "/activity" },
  { id: "alerts", label: "Alerts", icon: Bell, path: "/alerts", badge: 3 },
  { id: "settings", label: "Settings", icon: Settings, path: "/settings" }
];

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <CyberpunkNavigation 
        items={navItems} 
        logo={<AppLogo />} 
        title="Your App Name"
      />
      
      <div className="lg:pl-64">
        <CyberpunkLayout showBackgroundEffects={true}>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/settings" component={Settings} />
            <Route>
              <div className="text-center py-12">
                <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                <p className="text-slate-400">Page not found</p>
              </div>
            </Route>
          </Switch>
        </CyberpunkLayout>
      </div>
    </div>
  );
}