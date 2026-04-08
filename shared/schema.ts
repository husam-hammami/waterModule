import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const facilities = pgTable("facilities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  status: text("status").notNull(), // 'operational', 'warning', 'offline'
  dailyProduction: real("daily_production").notNull(),
  efficiency: real("efficiency").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  facilityId: integer("facility_id").references(() => facilities.id),
  metricType: text("metric_type").notNull(),
  value: real("value").notNull(),
  unit: text("unit").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  facilityId: integer("facility_id").references(() => facilities.id),
  severity: text("severity").notNull(), // 'low', 'medium', 'high', 'critical'
  message: text("message").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const plcDataBlocks = pgTable("plc_data_blocks", {
  id: serial("id").primaryKey(),
  dbNumber: integer("db_number").notNull(),
  description: text("description").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const plcAddresses = pgTable("plc_addresses", {
  id: serial("id").primaryKey(),
  dbId: integer("db_id").references(() => plcDataBlocks.id),
  offset: integer("offset").notNull(),
  dataType: text("data_type").notNull(),
  length: integer("length").notNull(),
  tagName: text("tag_name").notNull(),
  description: text("description").notNull(),
  unit: text("unit").notNull(),
  orderId: text("order_id").notNull(),
  batchId: text("batch_id").notNull(),
  materialCode: text("material_code").notNull(),
  readInterval: integer("read_interval").notNull(),
  isActive: boolean("is_active").default(true),
});

export const insertFacilitySchema = createInsertSchema(facilities).omit({
  id: true,
  lastUpdated: true,
});

export const insertMetricSchema = createInsertSchema(metrics).omit({
  id: true,
  timestamp: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export const insertPlcDataBlockSchema = createInsertSchema(plcDataBlocks).omit({
  id: true,
  createdAt: true,
});

export const insertPlcAddressSchema = createInsertSchema(plcAddresses).omit({
  id: true,
});

export type Facility = typeof facilities.$inferSelect;
export type InsertFacility = z.infer<typeof insertFacilitySchema>;
export type Metric = typeof metrics.$inferSelect;
export type InsertMetric = z.infer<typeof insertMetricSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type PlcDataBlock = typeof plcDataBlocks.$inferSelect;
export type InsertPlcDataBlock = z.infer<typeof insertPlcDataBlockSchema>;
export type PlcAddress = typeof plcAddresses.$inferSelect;
export type InsertPlcAddress = z.infer<typeof insertPlcAddressSchema>;

// Chart data types
export type ChartDataPoint = {
  timestamp: string;
  value: number;
  label?: string;
};

export type FacilityMetrics = {
  flowRate: ChartDataPoint[];
  pressure: ChartDataPoint[];
  energyConsumption: ChartDataPoint[];
  qualityScore: ChartDataPoint[];
};
