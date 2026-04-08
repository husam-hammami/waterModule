import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFacilitySchema, insertMetricSchema, insertAlertSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Facilities endpoints
  app.get("/api/facilities", async (req, res) => {
    try {
      const facilities = await storage.getAllFacilities();
      res.json(facilities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch facilities" });
    }
  });

  app.get("/api/facilities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const facility = await storage.getFacility(id);
      
      if (!facility) {
        return res.status(404).json({ message: "Facility not found" });
      }
      
      res.json(facility);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch facility" });
    }
  });

  app.post("/api/facilities", async (req, res) => {
    try {
      const facilityData = insertFacilitySchema.parse(req.body);
      const facility = await storage.createFacility(facilityData);
      res.status(201).json(facility);
    } catch (error) {
      res.status(400).json({ message: "Invalid facility data" });
    }
  });

  // Metrics endpoints
  app.get("/api/facilities/:id/metrics", async (req, res) => {
    try {
      const facilityId = parseInt(req.params.id);
      const metrics = await storage.getFacilityMetrics(facilityId);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  app.post("/api/metrics", async (req, res) => {
    try {
      const metricData = insertMetricSchema.parse(req.body);
      const metric = await storage.createMetric(metricData);
      res.status(201).json(metric);
    } catch (error) {
      res.status(400).json({ message: "Invalid metric data" });
    }
  });

  // Alerts endpoints
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAllAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.get("/api/facilities/:id/alerts", async (req, res) => {
    try {
      const facilityId = parseInt(req.params.id);
      const alerts = await storage.getFacilityAlerts(facilityId);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch facility alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const alertData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(alertData);
      res.status(201).json(alert);
    } catch (error) {
      res.status(400).json({ message: "Invalid alert data" });
    }
  });

  app.patch("/api/alerts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { isActive } = req.body;
      
      const alert = await storage.updateAlert(id, { isActive });
      
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to update alert" });
    }
  });

  // Dashboard aggregation endpoints
  app.get("/api/dashboard/overview", async (req, res) => {
    try {
      const facilities = await storage.getAllFacilities();
      const alerts = await storage.getAllAlerts();
      
      const overview = {
        totalFacilities: facilities.length,
        operationalCount: facilities.filter((f: any) => f.status === 'operational').length,
        warningCount: facilities.filter((f: any) => f.status === 'warning').length,
        offlineCount: facilities.filter((f: any) => f.status === 'offline').length,
        totalProduction: facilities.reduce((sum: number, f: any) => sum + f.dailyProduction, 0),
        averageEfficiency: facilities.reduce((sum: number, f: any) => sum + f.efficiency, 0) / facilities.length,
        activeAlerts: alerts.filter((a: any) => a.isActive).length,
        criticalAlerts: alerts.filter((a: any) => a.isActive && a.severity === 'critical').length,
      };
      
      res.json(overview);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard overview" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
