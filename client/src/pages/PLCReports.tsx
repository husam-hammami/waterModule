import { useState } from 'react'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Calendar, FileText, Download, Printer, ChevronDown, ArrowLeft } from 'lucide-react'

// Mock data generators
const generateProductionData = (reportType: string) => {
  const baseData = [
    { date: '2025-01-01', line: 'Mix Line 1', product: 'Premium Mix A', batch: 'B001-2025', shift: 'Day', quantity: 1250, quality: 98.2, efficiency: 94.5, operator: 'Ahmed Al-Rashid' },
    { date: '2025-01-01', line: 'Mix Line 2', product: 'Standard Mix B', batch: 'B002-2025', shift: 'Day', quantity: 980, quality: 97.8, efficiency: 91.2, operator: 'Fatima Hassan' },
    { date: '2025-01-01', line: 'Pack Line A', product: 'Premium Mix A', batch: 'B001-2025', shift: 'Day', quantity: 1200, quality: 99.1, efficiency: 96.8, operator: 'Mohammed Zayed' },
    { date: '2025-01-02', line: 'Mix Line 1', product: 'Industrial Mix C', batch: 'B003-2025', shift: 'Night', quantity: 1180, quality: 96.9, efficiency: 89.3, operator: 'Sara Al-Mahmoud' },
    { date: '2025-01-02', line: 'Mix Line 2', product: 'Premium Mix A', batch: 'B004-2025', shift: 'Night', quantity: 1350, quality: 98.7, efficiency: 95.1, operator: 'Omar Khalil' },
    { date: '2025-01-02', line: 'Pack Line B', product: 'Standard Mix B', batch: 'B002-2025', shift: 'Night', quantity: 945, quality: 97.4, efficiency: 92.6, operator: 'Layla Mansour' },
    { date: '2025-01-03', line: 'Mix Line 1', product: 'Premium Mix A', batch: 'B005-2025', shift: 'Day', quantity: 1290, quality: 99.3, efficiency: 97.2, operator: 'Ahmed Al-Rashid' },
    { date: '2025-01-03', line: 'Mix Line 2', product: 'Specialty Mix D', batch: 'B006-2025', shift: 'Day', quantity: 850, quality: 98.9, efficiency: 93.8, operator: 'Nadia Qureshi' }
  ]

  if (reportType === 'weekly') {
    return baseData.slice(0, 6)
  } else if (reportType === 'daily') {
    return baseData.slice(0, 3)
  } else if (reportType === 'monthly') {
    return baseData
  } else if (reportType === 'detailed') {
    return baseData.map(item => ({
      ...item,
      startTime: '08:00',
      endTime: '16:00',
      downtime: Math.floor(Math.random() * 30),
      energyUsage: Math.floor(Math.random() * 500 + 200),
      materialWaste: Math.floor(Math.random() * 50 + 10)
    }))
  } else {
    return baseData.map(item => ({
      ...item,
      rawMaterial: Math.floor(Math.random() * 200 + 100),
      additives: Math.floor(Math.random() * 50 + 10),
      packaging: Math.floor(Math.random() * 100 + 50)
    }))
  }
}

const getColumns = (reportType: string) => {
  const baseColumns = ['Date', 'Line', 'Product', 'Batch', 'Shift', 'Quantity (kg)', 'Quality (%)', 'Efficiency (%)', 'Operator']
  
  if (reportType === 'detailed') {
    return [...baseColumns, 'Start Time', 'End Time', 'Downtime (min)', 'Energy (kWh)', 'Waste (kg)']
  } else if (reportType === 'material') {
    return [...baseColumns, 'Raw Material (kg)', 'Additives (kg)', 'Packaging (units)']
  }
  
  return baseColumns
}

export default function PLCReports() {
  const [, setLocation] = useLocation()
  const [activeTab, setActiveTab] = useState('weekly')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [productionLines, setProductionLines] = useState('All Lines')
  const [bins, setBins] = useState('All Bins')
  const [batches, setBatches] = useState('All Batches')
  
  const reportData = generateProductionData(activeTab)
  const columns = getColumns(activeTab)
  const recordCount = reportData.length

  const clearFilters = () => {
    setStartDate('')
    setEndDate('')
    setProductionLines('All Lines')
    setBins('All Bins')
    setBatches('All Batches')
  }

  const handleExportCSV = () => {
    const headers = columns.join(',')
    const csvContent = [
      headers,
      ...reportData.map(row => {
        const baseValues = [row.date, row.line, row.product, row.batch, row.shift, row.quantity, row.quality, row.efficiency, row.operator]
        if (activeTab === 'detailed') {
          baseValues.push((row as any).startTime, (row as any).endTime, (row as any).downtime, (row as any).energyUsage, (row as any).materialWaste)
        } else if (activeTab === 'material') {
          baseValues.push((row as any).rawMaterial, (row as any).additives, (row as any).packaging)
        }
        return baseValues.map(val => `"${val}"`).join(',')
      })
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${activeTab}_report_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    window.print()
  }

  const tabs = [
    { id: 'daily', label: 'Daily Report', icon: Calendar },
    { id: 'weekly', label: 'Weekly Report', icon: FileText },
    { id: 'monthly', label: 'Monthly Report', icon: Calendar },
    { id: 'detailed', label: 'Detailed Report', icon: FileText },
    { id: 'material', label: 'Material Consumption', icon: FileText }
  ]

  return (
    <div className="min-h-screen text-white relative z-10">
      {/* Header with Back Button */}
      <div className="border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation('/')}
              variant="outline"
              className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center gap-2">
              <ChevronDown className="h-4 w-4 text-cyan-400" />
              <h1 className="text-lg font-medium text-slate-200">Report Filters</h1>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleExportCSV}
              variant="outline" 
              size="sm" 
              className="bg-slate-800 border-green-500/30 text-green-400 hover:bg-green-500/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-slate-800 border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button 
              onClick={handlePrint}
              variant="outline" 
              size="sm" 
              className="bg-slate-800 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-6 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-medium">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white h-10"
              placeholder="mm/dd/yyyy"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-medium">End Date</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white h-10"
              placeholder="mm/dd/yyyy"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-medium">Production Lines</label>
            <Select value={productionLines} onValueChange={setProductionLines}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="All Lines">All Lines</SelectItem>
                <SelectItem value="Mix Line 1">Mix Line 1</SelectItem>
                <SelectItem value="Mix Line 2">Mix Line 2</SelectItem>
                <SelectItem value="Pack Line A">Pack Line A</SelectItem>
                <SelectItem value="Pack Line B">Pack Line B</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-medium">Bins</label>
            <Select value={bins} onValueChange={setBins}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="All Bins">All Bins</SelectItem>
                <SelectItem value="Bin 1-10">Bin 1-10</SelectItem>
                <SelectItem value="Bin 11-20">Bin 11-20</SelectItem>
                <SelectItem value="Bin 21-30">Bin 21-30</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-medium">Batches</label>
            <Select value={batches} onValueChange={setBatches}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="All Batches">All Batches</SelectItem>
                <SelectItem value="Batch 001-050">Batch 001-050</SelectItem>
                <SelectItem value="Batch 051-100">Batch 051-100</SelectItem>
                <SelectItem value="Batch 101-150">Batch 101-150</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={clearFilters}
            variant="outline"
            className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 h-10"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 pt-6">
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "default" : "outline"}
                className={
                  activeTab === tab.id
                    ? "bg-cyan-500 text-slate-900 border-cyan-500 hover:bg-cyan-400"
                    : "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
                }
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 pb-6">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-lg p-6 shadow-2xl shadow-cyan-500/10">
          <h2 className="text-xl font-medium text-white mb-2">
            {activeTab === 'weekly' && 'Weekly Production Summary'}
            {activeTab === 'daily' && 'Daily Production Summary'}
            {activeTab === 'monthly' && 'Monthly Production Summary'}
            {activeTab === 'detailed' && 'Detailed Production Report'}
            {activeTab === 'material' && 'Material Consumption Report'}
          </h2>
          
          <p className="text-sm text-slate-400 mb-6">
            {activeTab === 'weekly' && `Weekly aggregated production data from Mix Line 1 & 2 (${recordCount} records)`}
            {activeTab === 'daily' && `Daily production data from all production lines (${recordCount} records)`}
            {activeTab === 'monthly' && `Monthly aggregated production data from all facilities (${recordCount} records)`}
            {activeTab === 'detailed' && `Detailed production breakdown with quality metrics (${recordCount} records)`}
            {activeTab === 'material' && `Material usage and consumption tracking (${recordCount} records)`}
          </p>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  {columns.map((column, index) => (
                    <th key={index} className="text-left py-3 px-4 text-sm font-medium text-slate-300 bg-slate-800/50">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 text-sm text-white">{row.date}</td>
                    <td className="py-3 px-4 text-sm text-white">{row.line}</td>
                    <td className="py-3 px-4 text-sm text-white">{row.product}</td>
                    <td className="py-3 px-4 text-sm text-cyan-400 font-mono">{row.batch}</td>
                    <td className="py-3 px-4 text-sm text-white">{row.shift}</td>
                    <td className="py-3 px-4 text-sm text-green-400 font-mono">{row.quantity.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-green-400 font-mono">{row.quality}%</td>
                    <td className="py-3 px-4 text-sm text-blue-400 font-mono">{row.efficiency}%</td>
                    <td className="py-3 px-4 text-sm text-white">{row.operator}</td>
                    {activeTab === 'detailed' && (
                      <>
                        <td className="py-3 px-4 text-sm text-white font-mono">{(row as any).startTime}</td>
                        <td className="py-3 px-4 text-sm text-white font-mono">{(row as any).endTime}</td>
                        <td className="py-3 px-4 text-sm text-orange-400 font-mono">{(row as any).downtime}</td>
                        <td className="py-3 px-4 text-sm text-purple-400 font-mono">{(row as any).energyUsage}</td>
                        <td className="py-3 px-4 text-sm text-red-400 font-mono">{(row as any).materialWaste}</td>
                      </>
                    )}
                    {activeTab === 'material' && (
                      <>
                        <td className="py-3 px-4 text-sm text-yellow-400 font-mono">{(row as any).rawMaterial}</td>
                        <td className="py-3 px-4 text-sm text-yellow-400 font-mono">{(row as any).additives}</td>
                        <td className="py-3 px-4 text-sm text-yellow-400 font-mono">{(row as any).packaging}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Statistics */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <div className="text-xs text-slate-400 mb-1">Total Quantity</div>
              <div className="text-lg font-mono text-green-400">
                {reportData.reduce((sum, row) => sum + row.quantity, 0).toLocaleString()} kg
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <div className="text-xs text-slate-400 mb-1">Avg Quality</div>
              <div className="text-lg font-mono text-green-400">
                {(reportData.reduce((sum, row) => sum + row.quality, 0) / reportData.length).toFixed(1)}%
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <div className="text-xs text-slate-400 mb-1">Avg Efficiency</div>
              <div className="text-lg font-mono text-blue-400">
                {(reportData.reduce((sum, row) => sum + row.efficiency, 0) / reportData.length).toFixed(1)}%
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <div className="text-xs text-slate-400 mb-1">Production Lines</div>
              <div className="text-lg font-mono text-cyan-400">
                {new Set(reportData.map(row => row.line)).size}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}