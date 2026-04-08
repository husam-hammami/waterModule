import { type Facility, type InsertFacility, type Metric, type InsertMetric, type Alert, type InsertAlert } from "@shared/schema";

export interface IStorage {
  // Facilities
  getAllFacilities(): Promise<Facility[]>;
  getFacility(id: number): Promise<Facility | undefined>;
  createFacility(facility: InsertFacility): Promise<Facility>;
  
  // Metrics
  getFacilityMetrics(facilityId: number): Promise<Metric[]>;
  createMetric(metric: InsertMetric): Promise<Metric>;
  
  // Alerts
  getAllAlerts(): Promise<Alert[]>;
  getFacilityAlerts(facilityId: number): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: number, updates: Partial<Alert>): Promise<Alert | undefined>;
}

export class MemStorage implements IStorage {
  private facilities: Map<number, Facility>;
  private metrics: Map<number, Metric>;
  private alerts: Map<number, Alert>;
  private currentFacilityId: number;
  private currentMetricId: number;
  private currentAlertId: number;

  constructor() {
    this.facilities = new Map();
    this.metrics = new Map();
    this.alerts = new Map();
    this.currentFacilityId = 1;
    this.currentMetricId = 1;
    this.currentAlertId = 1;
    
    // Initialize with mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Add mock facilities
    const mockFacilities = [
      { name: "Mumbai Water Treatment Plant", location: "Mumbai", status: "operational", dailyProduction: 2847, efficiency: 94, latitude: 19.0760, longitude: 72.8777 },
      { name: "Delhi Water Treatment Plant", location: "Delhi", status: "warning", dailyProduction: 1923, efficiency: 76, latitude: 28.7041, longitude: 77.1025 },
      { name: "Chennai Water Treatment Plant", location: "Chennai", status: "operational", dailyProduction: 2456, efficiency: 89, latitude: 13.0827, longitude: 80.2707 },
      { name: "Kolkata Water Treatment Plant", location: "Kolkata", status: "offline", dailyProduction: 856, efficiency: 32, latitude: 22.5726, longitude: 88.3639 },
      { name: "Bangalore Water Treatment Plant", location: "Bangalore", status: "operational", dailyProduction: 2234, efficiency: 87, latitude: 12.9716, longitude: 77.5946 },
      { name: "Hyderabad Water Treatment Plant", location: "Hyderabad", status: "operational", dailyProduction: 2678, efficiency: 91, latitude: 17.3850, longitude: 78.4867 },
      { name: "Pune Water Treatment Plant", location: "Pune", status: "warning", dailyProduction: 1756, efficiency: 68, latitude: 18.5204, longitude: 73.8567 },
      { name: "Ahmedabad Water Treatment Plant", location: "Ahmedabad", status: "operational", dailyProduction: 2112, efficiency: 85, latitude: 23.0225, longitude: 72.5714 },
      { name: "Jaipur Water Treatment Plant", location: "Jaipur", status: "operational", dailyProduction: 1890, efficiency: 83, latitude: 26.9124, longitude: 75.7873 },
      { name: "Lucknow Water Treatment Plant", location: "Lucknow", status: "operational", dailyProduction: 1634, efficiency: 79, latitude: 26.8467, longitude: 80.9462 },
    ];

    mockFacilities.forEach(facility => {
      const id = this.currentFacilityId++;
      this.facilities.set(id, {
        id,
        ...facility,
        lastUpdated: new Date(),
      });
    });

    // Add mock alerts
    const mockAlerts = [
      { facilityId: 4, severity: "critical", message: "Kolkata Facility Offline", isActive: true },
      { facilityId: 2, severity: "medium", message: "Delhi High Pressure Detected", isActive: true },
      { facilityId: 7, severity: "medium", message: "Pune Maintenance Due", isActive: true },
    ];

    mockAlerts.forEach(alert => {
      const id = this.currentAlertId++;
      this.alerts.set(id, {
        id,
        ...alert,
        createdAt: new Date(),
      });
    });
  }

  async getAllFacilities(): Promise<Facility[]> {
    return Array.from(this.facilities.values());
  }

  async getFacility(id: number): Promise<Facility | undefined> {
    return this.facilities.get(id);
  }

  async createFacility(insertFacility: InsertFacility): Promise<Facility> {
    const id = this.currentFacilityId++;
    const facility: Facility = {
      ...insertFacility,
      id,
      lastUpdated: new Date(),
    };
    this.facilities.set(id, facility);
    return facility;
  }

  async getFacilityMetrics(facilityId: number): Promise<Metric[]> {
    return Array.from(this.metrics.values()).filter(m => m.facilityId === facilityId);
  }

  async createMetric(insertMetric: InsertMetric): Promise<Metric> {
    const id = this.currentMetricId++;
    const metric: Metric = {
      id,
      facilityId: insertMetric.facilityId || null,
      metricType: insertMetric.metricType,
      value: insertMetric.value,
      unit: insertMetric.unit,
      timestamp: new Date(),
    };
    this.metrics.set(id, metric);
    return metric;
  }

  async getAllAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values());
  }

  async getFacilityAlerts(facilityId: number): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(a => a.facilityId === facilityId);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = this.currentAlertId++;
    const alert: Alert = {
      id,
      facilityId: insertAlert.facilityId || null,
      severity: insertAlert.severity,
      message: insertAlert.message,
      isActive: insertAlert.isActive ?? true,
      createdAt: new Date(),
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async updateAlert(id: number, updates: Partial<Alert>): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    
    const updatedAlert = { ...alert, ...updates };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }
}

export const storage = new MemStorage();