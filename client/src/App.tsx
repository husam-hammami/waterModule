import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { VideoBackground } from "@/components/VideoBackground";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import DashboardEditor from "@/pages/DashboardEditor";
import FacilityOverview from "@/pages/FacilityOverview";
import ProcessFlow from "@/pages/ProcessFlow";
import WaterQuality from "@/pages/WaterQuality";
import EnergyMonitoring from "@/pages/EnergyMonitoring";
import Maintenance from "@/pages/Maintenance";
import ChemicalDosing from "@/pages/ChemicalDosing";
import PLCConfiguration from "@/pages/PLCConfiguration";
import PLCReports from "@/pages/PLCReports";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard-editor" component={DashboardEditor} />
      <Route path="/plc-configuration" component={PLCConfiguration} />
      <Route path="/plc-reports" component={PLCReports} />
      <Route path="/facility/:id/overview" component={FacilityOverview} />
      <Route path="/facility/:id/process" component={ProcessFlow} />
      <Route path="/facility/:id/quality" component={WaterQuality} />
      <Route path="/facility/:id/energy" component={EnergyMonitoring} />
      <Route path="/facility/:id/maintenance" component={Maintenance} />
      <Route path="/facility/:id/chemical" component={ChemicalDosing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="relative min-h-screen">
          <VideoBackground opacity={0.9} />
          <div className="relative z-10">
            <Router />
          </div>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
