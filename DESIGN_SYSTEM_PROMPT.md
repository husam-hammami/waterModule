# Hercules Cyberpunk Industrial Design System Template

## Design Philosophy & Aesthetic

Create a **futuristic cyberpunk-inspired industrial monitoring interface** with the following core principles:

### Visual Identity
- **Dark cyberpunk theme** with neon accents and holographic effects
- **Industrial monitoring aesthetic** suitable for enterprise dashboards
- **3D depth and dimensionality** throughout all components
- **Professional yet futuristic** appearance balancing usability with visual impact
- **High contrast** dark backgrounds with bright accent colors

### Color Palette
```css
/* Primary Dark Background */
--background: 222.2 84% 4.9%;
--card: 222.2 84% 4.9%;
--popover: 222.2 84% 4.9%;

/* Accent Colors */
--primary: 210 40% 98%;
--secondary: 217.2 32.6% 17.5%;
--muted: 217.2 32.6% 17.5%;

/* Neon Accent Colors */
--neon-cyan: #00ffff;
--neon-green: #00ff00;
--neon-blue: #0080ff;
--neon-orange: #ff8000;
--neon-purple: #8000ff;
--neon-pink: #ff00ff;

/* Status Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

## Typography System

### Font Families
- **Primary**: Inter (clean, modern sans-serif)
- **Monospace**: `font-mono` for technical data, timestamps, and metrics
- **Display**: Large headings with subtle letter spacing

### Text Hierarchy
- **Page Titles**: `text-2xl font-bold text-white`
- **Section Headers**: `text-lg font-semibold text-slate-300`
- **Data Labels**: `text-sm text-slate-400 font-mono`
- **Metric Values**: `text-xl font-bold text-white`
- **Technical Data**: `font-mono text-sm text-cyan-400`

## Layout Architecture

### Grid System
- **Dense information layout** maximizing screen real estate
- **No-scroll design** - all critical information visible without scrolling
- **Responsive grid** using CSS Grid and Flexbox
- **Component-based modular system**

### Spacing Scale
- **Tight spacing** between related elements: `gap-2` (8px)
- **Component separation**: `gap-4` (16px)
- **Section separation**: `gap-6` (24px)
- **Page margins**: `p-6` (24px)

### Panel Structure
```tsx
// Standard Panel Layout
<div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-lg font-semibold text-slate-300">Panel Title</h3>
    <Icon className="w-5 h-5 text-cyan-400" />
  </div>
  {/* Panel Content */}
</div>
```

## Component Library

### 1. Advanced 3D Gauges
- **Canvas-based rendering** with HTML5 Canvas API
- **Gradient fills** and glowing effects
- **Animated value transitions**
- **Hover scaling effects**: `hover:scale-110` to `hover:scale-125`

```tsx
// 3D Gauge Pattern
const draw3DGauge = (ctx, value, max, color) => {
  // Outer ring with gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, `${color}40`);
  gradient.addColorStop(1, `${color}80`);
  
  // Inner glow effect
  ctx.shadowBlur = 10;
  ctx.shadowColor = color;
  
  // Progress arc with rounded caps
  ctx.lineCap = 'round';
  ctx.lineWidth = 8;
};
```

### 2. Holographic Effects
- **Scanning line animations** moving across components
- **Particle systems** with floating elements
- **Glow effects** on interactive elements
- **Holographic borders** using CSS gradients

```css
/* Holographic Border Effect */
.holographic-border {
  background: linear-gradient(45deg, 
    transparent, 
    rgba(0, 255, 255, 0.1), 
    transparent, 
    rgba(0, 255, 255, 0.1), 
    transparent
  );
  animation: holographic-scan 3s infinite;
}

@keyframes holographic-scan {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

### 3. Interactive Network Maps
- **Hub-and-spoke topology** with central node
- **Animated connection lines** with data packets
- **Color-coded status indicators**
- **Smooth hover transitions**

```tsx
// Network Node Pattern
<div className="relative">
  <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_20px_rgba(0,255,255,0.8)]">
    <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-30"></div>
  </div>
  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-mono text-cyan-400">
    {nodeName}
  </div>
</div>
```

### 4. Data Visualization Components
- **Mini charts** embedded in cards: sparklines, donuts, progress rings
- **Real-time animations** for data updates
- **Chart.js integration** with custom themes
- **Responsive chart containers**

### 5. Status Cards & Metrics
- **Compact horizontal layout** for facility cards
- **Progress bars** with gradient fills
- **Status indicators** with color coding
- **Hover effects** with scaling and glow

```tsx
// Status Card Pattern
<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-lg p-3 
            hover:bg-slate-800/70 hover:border-cyan-400/50 transition-all duration-300
            hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]">
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      <span className="text-sm font-medium text-slate-300">Status Label</span>
    </div>
    <span className="text-lg font-bold text-white">Value</span>
  </div>
</div>
```

## Animation System

### Keyframe Animations
```css
/* Floating Particles */
@keyframes float-particle {
  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
  50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
}

/* Scanning Lines */
@keyframes scan-line {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100vw); }
}

/* Data Pulse */
@keyframes data-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
}

/* Matrix Rain */
@keyframes matrix-rain {
  0% { transform: translateY(-100vh); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
}
```

### Hover Effects
- **Scale transforms**: `hover:scale-105` to `hover:scale-125`
- **Glow effects**: `hover:shadow-[0_0_20px_rgba(color,0.5)]`
- **Border animations**: `hover:border-cyan-400/50`
- **Background transitions**: `hover:bg-slate-800/70`

## Interactive Elements

### Buttons
```tsx
// Primary Action Button
<button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg
                   transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]
                   active:scale-95 font-medium">
  Action Label
</button>

// Secondary Button
<button className="bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white
                   border border-slate-600 hover:border-cyan-400/50 px-4 py-2 rounded-lg
                   transition-all duration-200">
  Secondary Action
</button>
```

### Form Elements
```tsx
// Input Field
<input className="bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2
                  text-white placeholder-slate-400 focus:border-cyan-400
                  focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200
                  font-mono text-sm" />

// Select Dropdown
<select className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2
                   text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20">
  <option value="">Select Option</option>
</select>
```

## Background Effects

### Cyber Grid Pattern
```css
.cyber-grid {
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: grid-move 20s linear infinite;
}

@keyframes grid-move {
  0% { background-position: 0 0; }
  100% { background-position: 50px 50px; }
}
```

### Particle Systems
```tsx
// Floating Particles Component
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  {Array.from({ length: 50 }, (_, i) => (
    <div
      key={i}
      className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float-particle"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${3 + Math.random() * 4}s`
      }}
    />
  ))}
</div>
```

## Technical Implementation

### Required Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "chart.js": "^4.4.0",
    "lucide-react": "^0.294.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0"
  }
}
```

### Tailwind Configuration
```js
// tailwind.config.ts
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "float-particle": "float-particle 4s ease-in-out infinite",
        "scan-line": "scan-line 2s linear infinite",
        "data-pulse": "data-pulse 2s ease-in-out infinite",
        "matrix-rain": "matrix-rain 3s linear infinite"
      },
      boxShadow: {
        "glow-cyan": "0 0 20px rgba(0, 255, 255, 0.5)",
        "glow-green": "0 0 20px rgba(0, 255, 0, 0.5)"
      }
    }
  }
}
```

## Usage Instructions

### 1. Copy this prompt when starting a new project
### 2. Apply the color palette to your CSS variables
### 3. Use the component patterns for consistent UI elements
### 4. Implement the animation system for interactive effects
### 5. Follow the layout architecture for optimal information density

## Key Design Principles to Maintain

1. **Dark theme with neon accents** - Always use dark backgrounds with bright cyan/green accents
2. **Industrial monitoring aesthetic** - Professional yet futuristic appearance
3. **3D depth and dimensionality** - Use shadows, gradients, and layering
4. **Holographic effects** - Scanning lines, particles, and glow effects
5. **Dense information layout** - Maximize screen real estate usage
6. **Smooth animations** - All transitions should be 200-300ms
7. **Interactive feedback** - Hover effects with scaling and glow
8. **Monospace fonts** for technical data and metrics
9. **Color-coded status systems** - Green (good), Orange (warning), Red (error)
10. **Canvas-based visualizations** for complex graphics and gauges

This design system template will ensure consistent cyberpunk industrial aesthetics across all your future applications while maintaining professional usability and visual impact.