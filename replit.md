# Hercules - Water Monitoring System

## Overview

This is a modern full-stack web application designed for monitoring and managing water treatment facilities across multiple locations. The system provides real-time dashboards, facility monitoring, metrics tracking, and alert management with a cyberpunk-themed industrial interface. Built with React, Express, PostgreSQL, and featuring a sophisticated UI with real-time data visualization.

## System Architecture

### Technology Stack
- **Frontend**: React with TypeScript, Vite build system
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom cyberpunk theme
- **Charts**: Chart.js for data visualization
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

### Architecture Pattern
The application follows a monorepo structure with clear separation of concerns:
- **Client-side SPA**: React application with component-based architecture
- **RESTful API**: Express server providing facility, metrics, and alerts endpoints
- **Shared Schema**: Common TypeScript types and Drizzle schema definitions
- **Database Layer**: PostgreSQL with Drizzle ORM for type-safe database operations

## Key Components

### Frontend Architecture
- **Component Structure**: Modular React components with UI components library
- **Styling System**: Tailwind CSS with custom CSS variables for theming
- **Data Visualization**: Chart.js integration for real-time facility metrics
- **Responsive Design**: Mobile-first approach with custom breakpoints
- **State Management**: TanStack Query for server state, local state with React hooks

### Backend Architecture
- **API Layer**: Express.js with TypeScript providing RESTful endpoints
- **Database Integration**: Drizzle ORM with PostgreSQL for data persistence
- **Error Handling**: Centralized error handling middleware
- **Logging**: Custom request/response logging system
- **Development Tools**: Hot reloading with Vite integration

### Database Schema
```typescript
// Facilities: Core facility information with location and status
facilities: {
  id, name, location, status, dailyProduction, efficiency, 
  latitude, longitude, lastUpdated
}

// Metrics: Time-series data for facility measurements
metrics: {
  id, facilityId, metricType, value, unit, timestamp
}

// Alerts: Facility alert and notification system
alerts: {
  id, facilityId, severity, message, isActive, createdAt
}
```

## Data Flow

### Client-Server Communication
1. **Frontend** makes HTTP requests to `/api/*` endpoints
2. **Express server** processes requests and validates data using Zod schemas
3. **Database operations** performed through Drizzle ORM
4. **Response data** flows back through the same path with error handling

### Real-time Updates
- TanStack Query handles data fetching and caching
- Periodic refetching for real-time dashboard updates
- Optimistic updates for better user experience

### State Management
- **Server state**: Managed by TanStack Query (facilities, metrics, alerts)
- **Client state**: React hooks for UI state and component interactions
- **Form state**: React Hook Form with Zod validation

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver for Neon
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **chart.js**: Data visualization and charting
- **@radix-ui/***: Accessible UI component primitives
- **wouter**: Lightweight client-side routing

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast bundling for production builds

### UI Enhancement
- **class-variance-authority**: Type-safe CSS class variants
- **clsx**: Conditional className utility
- **date-fns**: Date manipulation and formatting

## Deployment Strategy

### Environment Configuration
- **Development**: Local development with Vite dev server
- **Production**: Built with Vite and served by Express
- **Database**: Requires `DATABASE_URL` environment variable

### Build Process
1. **Frontend build**: Vite bundles React app to `dist/public`
2. **Backend build**: ESBuild bundles server to `dist/index.js`
3. **Database migrations**: Drizzle Kit handles schema changes

### Deployment Platform
- **Replit**: Configured for autoscale deployment
- **Port configuration**: Internal port 5000, external port 80
- **Environment**: Node.js 20 with PostgreSQL 16

### Production Considerations
- Static file serving through Express in production
- Environment-based configuration switching
- Database connection pooling through connection string

## Changelog
- June 25, 2025: Initial setup with basic water treatment facility dashboard
- June 25, 2025: Enhanced to advanced futuristic 3D cyberpunk dashboard with:
  - Compact horizontal facility cards with status indicators and progress bars
  - Holographic interactive map with animated 3D markers
  - Advanced 3D gauges using Canvas API for visual effects
  - Real-time data streams with sparkline charts
  - Matrix rain background effects and cyber grid patterns
  - Comprehensive analytics panels with radar charts and heatmaps
  - Dense grid layout optimized for no-scroll viewing
- June 25, 2025: Completed comprehensive multi-page dashboard system with:
  - Main Dashboard: All 10 facilities overview with aggregate KPIs, interactive map, quick filters
  - Facility Overview: Plant layout with interactive hotspots, KPIs, shift summary, environmental impact
  - Process Flow: Animated PFD with live tags, pump statuses, process bottlenecks
  - Water Quality: Lab vs inline comparison, regulatory compliance, auto-generated reports
  - Energy Monitoring: kWh/m³ analysis, power breakdown, generator status, cost optimization
  - Maintenance: Active alarms by severity, MTBF analysis, planned vs unplanned maintenance
  - Chemical Dosing: Real-time dosing rates, tank levels, forecast vs actual usage, refill alerts
  - Full navigation system between all pages with cyberpunk-themed UI consistency
- June 25, 2025: Updated facility locations to Saudi Arabian cities and regions:
  - Changed application name to "Hercules - Water Monitoring System"
  - Localized all 10 facilities to authentic Saudi Arabian locations (Riyadh, Jeddah, Dammam, Medina, Mecca, Tabuk, Al-Khobar, Abha, Jubail, Ha'il)
  - Updated coordinates and facility names to reflect regional context
- June 25, 2025: Enhanced network map visualization and readability:
  - Established Riyadh as central hub with hub-and-spoke network topology connecting to all 9 other Saudi cities
  - Fixed overlapping city name issues by adjusting coordinates for better geographic distribution
  - Improved text readability with larger fonts, clean shadows, and enhanced contrast
  - Resized layout to maximize network map area while compacting data streams section
  - Added bidirectional data flow animations and enhanced network monitoring background elements
- June 26, 2025: Fixed network packet animation system:
  - Packets now properly originate from Riyadh hub and flow to all 9 cities (not just 3)
  - Dynamic color coding: Green (quality), Blue (flow), Orange (pressure), Red (alerts), Purple (energy)
  - Smart status-based coloring: Warning facilities send orange packets, offline send red packets
  - Added reverse data flow with status report packets from cities back to Riyadh
  - 27 outbound + 9 inbound packets creating realistic network monitoring visualization
  - Implemented intelligent packet routing: green packets only to green nodes, orange to orange, red to red
  - Reduced packet frequency from 3-4s to 6-8s timing for more realistic industrial monitoring pace
  - Single targeted packet per facility instead of multiple random packets
- June 26, 2025: Enhanced KPI metrics cards with intelligent visualizations:
  - Transformed static KPI cards into genius visualized dashboard components
  - Added Canvas-based mini charts: sparklines, progress rings, gauges, bar charts, donuts, trend indicators
  - Maintained exact same size and alignment (h-16 grid-cols-6) while adding meaningful visual data
  - Each chart type optimized for specific metric: production trends, efficiency progress, energy gauges, facility status bars, alert donuts, quality trends
  - Custom color-coded visualizations matching cyberpunk theme with authentic water treatment data patterns
  - Implemented dual display system: clear numerical values (left) + clean accurate graphs (right)
  - Enhanced chart readability with indicator dots, needle pointers, and trend lines without text overlays
  - Professional horizontal layout maximizing both numerical readability and visual context
- June 26, 2025: Integrated authentic Hercules PNG logo to dashboard header:
  - Added precise PNG logo image as provided by client
  - Clean header layout with logo, subtitle, and timestamp
  - Professional brand integration maintaining cyberpunk aesthetic
  - Proper image handling with object-contain for quality preservation
- June 26, 2025: Completed comprehensive redesign of all dashboard pages with innovative 3D futuristic aesthetics:
  - Redesigned FacilityOverview with interactive SVG plant layout and live component details
  - Created WaterQuality with 3D parameter grid, holographic compliance dashboard, and treatment efficiency visualization
  - Built ProcessFlow with animated SVG equipment visualization, real-time flow simulation, and interactive equipment details
  - Enhanced Maintenance with severity-based alarm system, MTBF analytics, and expandable alert cards
  - Upgraded ChemicalDosing with 3D tank level visualization, usage forecasting, and dosing pump controls
  - Added comprehensive 3D animation system with 20+ custom keyframes for particle effects and transitions
  - Implemented holographic effects, scanning lines, particle systems, and enhanced cyberpunk styling
- June 26, 2025: Redesigned Energy Monitoring with comprehensive analytics and extensive gauge systems:
  - Added detailed electrical parameters monitoring (voltage, current, frequency, THD, power factor)
  - Implemented 3D power distribution hub with radial consumer nodes and connection animations
  - Created dual gauge system: circular gauges for efficiency metrics and linear progress bars
  - Added comprehensive cost analysis, renewable energy tracking, and CO2 emissions monitoring
  - Integrated power quality trends with historical data visualization and forecasting predictions
  - Enhanced with 50+ floating energy particles, advanced grid patterns, and electrical circuit aesthetics
  - Maintained clean dense layout with all information visible without scrolling
- January 5, 2025: Added PLC Configuration and Reports system:
  - Integrated PLC Configuration and PLC Reports pages accessible via top navigation bar icons
  - Added settings gear icon for PLC Configuration (/plc-configuration route)
  - Added chart icon for PLC Reports (/plc-reports route) 
  - Replaced PLC Reports with comprehensive Reports component featuring:
    - Advanced drag-and-drop tab management with admin controls
    - Multiple report types: Production, Quality, Maintenance, Energy
    - Comprehensive filter system with date ranges, products, batches, shifts
    - Export functionality (Print and CSV download)
    - Admin column configuration with custom column creation and editing
    - Editable data cells in admin mode for real-time data management
    - Professional cyberpunk-themed styling consistent with existing dashboard

## User Preferences

Preferred communication style: Simple, everyday language.