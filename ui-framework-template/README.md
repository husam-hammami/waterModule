# Cyberpunk UI Framework Template

A complete, reusable UI/UX framework extracted from the Hercules Water Monitoring System, featuring cyberpunk-inspired industrial design with advanced 3D effects, holographic animations, and professional enterprise aesthetics.

## 🎨 Framework Features

### Core Components
- **CyberpunkLayout**: Main layout with background effects and header
- **CyberpunkCard**: Reusable card component with glow effects
- **CyberpunkButton**: Styled buttons with hover animations
- **CyberpunkNavigation**: Responsive sidebar navigation
- **CyberpunkGauge**: Circular and linear gauge components
- **CyberpunkChart**: Mini charts (sparklines, donuts, bar charts)

### Design System
- **Dark cyberpunk theme** with neon accents
- **Holographic effects** with scanning lines and particles
- **3D hover animations** with scaling and glow effects
- **Professional typography** with monospace for technical data
- **Responsive grid layouts** optimized for information density

### Built-in Effects
- **Floating particles** (50+ animated elements)
- **Cyber grid patterns** with moving animations
- **Scanning lines** across components
- **Glow effects** on interactive elements
- **Smooth transitions** (200-300ms duration)

## 🚀 Quick Start

### 1. Extract and Setup
```bash
# Extract the framework
tar -xzf ui-framework-template.tar.gz
cd ui-framework-template

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Open Browser
Navigate to `http://localhost:5000`

## 📁 Project Structure

```
ui-framework-template/
├── client/src/
│   ├── components/           # Reusable UI components
│   │   ├── CyberpunkLayout.tsx
│   │   ├── CyberpunkCard.tsx
│   │   ├── CyberpunkButton.tsx
│   │   ├── CyberpunkNavigation.tsx
│   │   ├── CyberpunkGauge.tsx
│   │   ├── CyberpunkChart.tsx
│   │   └── ui/              # shadcn/ui components
│   ├── pages/               # Example pages
│   │   ├── Dashboard.tsx
│   │   ├── Analytics.tsx
│   │   └── Settings.tsx
│   ├── lib/                 # Utilities
│   ├── hooks/               # Custom React hooks
│   ├── index.css            # Global styles with cyberpunk theme
│   ├── main.tsx             # React entry point
│   └── App.tsx              # Main app component
├── server/
│   └── index.ts             # Simple Express server
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind configuration
├── vite.config.ts           # Vite configuration
└── tsconfig.json            # TypeScript configuration
```

## 🎯 How to Use This Framework

### 1. Replace Example Content
- Update navigation items in `App.tsx`
- Replace example pages with your own components
- Connect to your backend API endpoints

### 2. Customize Your Brand
```tsx
// Replace the logo in App.tsx
function AppLogo() {
  return (
    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg">
      <YourLogoComponent />
    </div>
  );
}

// Update navigation items
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/" },
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "/analytics" },
  // Add your own navigation items
];
```

### 3. Add Your Data
```tsx
// Replace mock data with real API calls
export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: () => fetch('/api/dashboard').then(res => res.json())
  });

  return (
    <CyberpunkLayout title="Your App Name">
      <StatusCard
        label="Active Users"
        value={data?.activeUsers || 0}
        status="online"
        progress={data?.userGrowth || 0}
      />
      {/* Add your components */}
    </CyberpunkLayout>
  );
}
```

### 4. Backend Integration
```tsx
// Update server/index.ts with your API endpoints
app.get("/api/dashboard", (req, res) => {
  // Connect to your database
  // Return your data
  res.json({
    activeUsers: 2847,
    userGrowth: 85,
    // Your data here
  });
});
```

## 🎨 Component Usage Examples

### Status Cards
```tsx
<StatusCard
  label="System Status"
  value={95}
  unit="%"
  status="online"  // online | warning | offline
  progress={95}
  compact={false}
/>
```

### Gauges
```tsx
<CyberpunkGauge
  value={85}
  max={100}
  label="CPU Usage"
  unit="%"
  color="#00ffff"
  size={120}
/>

<LinearGauge
  value={67}
  max={100}
  label="Memory Usage"
  unit="%"
  color="#00ff00"
/>
```

### Charts
```tsx
<Sparkline 
  data={[10, 20, 15, 30, 25]} 
  color="#00ffff" 
  width={80} 
  height={40}
/>

<DonutChart 
  percentage={78} 
  color="#00ff00" 
  size={60}
/>

<MiniBarChart 
  data={[10, 20, 15, 30, 25]} 
  color="#0080ff" 
  width={80} 
  height={40}
/>
```

### Buttons
```tsx
<CyberpunkButton 
  variant="primary" 
  icon={Settings}
  onClick={() => console.log('clicked')}
>
  Save Changes
</CyberpunkButton>

<CyberpunkButton 
  variant="secondary" 
  size="sm"
  loading={isLoading}
>
  Cancel
</CyberpunkButton>
```

## 🎭 Color Themes

### Available Glow Colors
- `cyan` (default) - #00ffff
- `green` - #00ff00
- `blue` - #0080ff
- `orange` - #ff8000
- `purple` - #8000ff
- `pink` - #ff00ff

### Status Colors
- `online` - Green indicators
- `warning` - Orange indicators
- `offline` - Red indicators

## 🔧 Customization

### Modify Colors
Edit `client/src/index.css` to change the color scheme:
```css
:root {
  --neon-cyan: #00ffff;
  --neon-green: #00ff00;
  --neon-blue: #0080ff;
  /* Add your custom colors */
}
```

### Add New Components
1. Create component in `client/src/components/`
2. Follow the existing patterns for styling
3. Use the `CyberpunkCard` wrapper for consistency
4. Add hover effects and animations

### Background Effects
Control background effects per page:
```tsx
<CyberpunkLayout 
  showBackgroundEffects={true}  // Enable/disable effects
  title="Your Page"
>
  {/* Your content */}
</CyberpunkLayout>
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Environment Variables
```bash
# Optional - for database connections
DATABASE_URL=your_database_url

# Optional - for API keys
API_KEY=your_api_key
```

## 📝 Framework Benefits

### For Rapid Development
- **Pre-built components** - No need to design from scratch
- **Consistent styling** - All components follow the same design system
- **Responsive layouts** - Mobile-first approach built-in
- **TypeScript support** - Full type safety throughout

### For Professional Apps
- **Enterprise-grade aesthetics** - Professional cyberpunk design
- **Accessibility features** - Built on Radix UI primitives
- **Performance optimized** - Efficient animations and renders
- **Scalable architecture** - Easy to extend and customize

### For Client Demos
- **Impressive visuals** - 3D effects and animations
- **Industrial theming** - Perfect for technical applications
- **Interactive elements** - Engaging user experience
- **Professional branding** - Customizable logo and colors

## 🤝 Usage Tips

1. **Start with the example pages** - Modify Dashboard.tsx, Analytics.tsx, Settings.tsx
2. **Use the component library** - All components are pre-styled and ready to use
3. **Follow the color system** - Use the predefined glow colors for consistency
4. **Leverage the animations** - Built-in hover effects and transitions
5. **Keep the cyberpunk aesthetic** - Dark backgrounds with neon accents

This framework gives you everything needed to build sophisticated, professional applications with the exact same UI/UX as the Hercules Water Monitoring System. Simply replace the content with your own data and backend integration!