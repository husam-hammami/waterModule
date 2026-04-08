import { useState, useMemo } from 'react'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery } from '@tanstack/react-query'
import { PlcDataBlock, PlcAddress } from '@/../../shared/schema'
import { 
  Plus, 
  Settings, 
  Database, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  ArrowLeft
} from 'lucide-react'

// Mock data for PLC Configuration (will be replaced with API calls)
const mockDataBlocks = [
  { id: 4, dbNumber: 1999, description: "MASA Production Data Block", isActive: true, createdAt: new Date() },
  { id: 5, dbNumber: 2000, description: "Material Consumption Block", isActive: true, createdAt: new Date() },
]

const mockPlcAddresses = [
  // Mixing Line 1 - Order and Batch Information
  {
    id: 1,
    dbId: 5,
    offset: 0,
    dataType: 'dint',
    length: 4,
    tagName: 'Order_ID',
    description: 'Order ID',
    unit: '',
    orderId: 'NA',
    batchId: 'NA',
    materialCode: 'NA',
    readInterval: 5000,
    isActive: true,
  },
  {
    id: 2,
    dbId: 5,
    offset: 4,
    dataType: 'string',
    length: 34,
    tagName: 'Order_Name',
    description: 'Order Name [String[32]]',
    unit: '',
    orderId: 'NA',
    batchId: 'NA',
    materialCode: 'NA',
    readInterval: 5000,
    isActive: true,
  },
  {
    id: 3,
    dbId: 5,
    offset: 38,
    dataType: 'int',
    length: 2,
    tagName: 'Batch_ID',
    description: 'Batch ID',
    unit: '',
    orderId: 'NA',
    batchId: 'NA',
    materialCode: 'NA',
    readInterval: 5000,
    isActive: true,
  },
  // Bin 1 Configuration
  {
    id: 4,
    dbId: 5,
    offset: 40,
    dataType: 'string',
    length: 6,
    tagName: 'Bin1_Name',
    description: 'Bin1 Name [String[4]]',
    unit: '',
    orderId: 'NA',
    batchId: 'NA',
    materialCode: 'NA',
    readInterval: 5000,
    isActive: true,
  },
  {
    id: 5,
    dbId: 5,
    offset: 46,
    dataType: 'dint',
    length: 4,
    tagName: 'Bin1_MatCode',
    description: 'Bin1 Material Code',
    unit: '',
    orderId: 'NA',
    batchId: 'NA',
    materialCode: 'NA',
    readInterval: 5000,
    isActive: true,
  },
  {
    id: 6,
    dbId: 5,
    offset: 50,
    dataType: 'string',
    length: 27,
    tagName: 'Bin1_MatName',
    description: 'Bin1 Material Name [String[25]]',
    unit: '',
    orderId: 'NA',
    batchId: 'NA',
    materialCode: 'NA',
    readInterval: 5000,
    isActive: true,
  },
  {
    id: 7,
    dbId: 5,
    offset: 77,
    dataType: 'real',
    length: 4,
    tagName: 'Bin1_Qty_SP',
    description: 'Bin1 Quantity Setpoint',
    unit: 'kg',
    orderId: 'NA',
    batchId: 'NA',
    materialCode: 'NA',
    readInterval: 2000,
    isActive: true,
  },
  {
    id: 8,
    dbId: 5,
    offset: 81,
    dataType: 'real',
    length: 4,
    tagName: 'Bin1_Qty_Out',
    description: 'Bin1 Quantity Out',
    unit: 'kg',
    orderId: 'NA',
    batchId: 'NA',
    materialCode: 'NA',
    readInterval: 2000,
    isActive: true,
  },
  {
    id: 9,
    dbId: 5,
    offset: 85,
    dataType: 'bool',
    length: 1,
    tagName: 'Bin1_Dosed',
    description: 'Bin1 Dosed Status',
    unit: '',
    orderId: 'NA',
    batchId: 'NA',
    materialCode: 'NA',
    readInterval: 1000,
    isActive: true,
  }
]

interface PLCConfigurationProps {}

// Live Readings Component
interface LiveReadingsViewProps {
  dbNumber: number
  addresses: PlcAddress[]
}

function LiveReadingsView({ dbNumber, addresses }: LiveReadingsViewProps) {
  const { data: readings = [], isLoading, error } = useQuery<any[]>({
    queryKey: ['plc-readings', dbNumber],
    queryFn: async () => {
      // Mock live data for demonstration
      return addresses.map(addr => ({
        addressId: addr.id,
        plcAddress: generatePlcAddress(dbNumber, addr.offset, addr.dataType),
        tagName: addr.tagName,
        description: addr.description,
        value: Math.random() * 100,
        unit: addr.unit,
        dataType: addr.dataType,
        quality: 'GOOD',
        timestamp: new Date().toISOString()
      }))
    },
    refetchInterval: 5000,
    retry: 3,
    retryDelay: 1000,
  })
  
  const formatValue = (value: any, dataType: string) => {
    if (value === null || value === undefined) return '-'
    
    switch (dataType) {
      case 'bool':
        return value ? '✓ TRUE' : '✗ FALSE'
      case 'real':
      case 'float':
        return typeof value === 'number' ? value.toFixed(2) : value
      case 'int':
      case 'dint':
        return value.toString()
      case 'string':
        return value || ''
      default:
        return value.toString()
    }
  }
  
  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    return `${Math.floor(minutes / 60)}h ago`
  }
  
  return (
    <Card className="bg-slate-800/30 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-400" />
            Live PLC Readings - DB{dbNumber}
          </span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-normal">PLC Connected</span>
          </div>
        </CardTitle>
        <CardDescription className="text-slate-400">
          Real-time data from MASA DB1999 mixing line addresses
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
            Connecting to PLC...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-400">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            Failed to connect to PLC
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">PLC Address</TableHead>
                  <TableHead className="text-slate-300">Tag Name</TableHead>
                  <TableHead className="text-slate-300">Description</TableHead>
                  <TableHead className="text-slate-300">Current Value</TableHead>
                  <TableHead className="text-slate-300">Unit</TableHead>
                  <TableHead className="text-slate-300">Data Type</TableHead>
                  <TableHead className="text-slate-300">Quality</TableHead>
                  <TableHead className="text-slate-300">Last Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {readings.map((reading: any) => (
                  <TableRow key={reading.addressId} className="border-slate-700 hover:bg-slate-700/30">
                    <TableCell className="font-mono text-cyan-400 text-xs">
                      {reading.plcAddress}
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      {reading.tagName}
                    </TableCell>
                    <TableCell className="text-slate-300 text-sm">
                      {reading.description}
                    </TableCell>
                    <TableCell className="font-mono text-cyan-400">
                      {formatValue(reading.value, reading.dataType)}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {reading.unit || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        ['float', 'real', 'dint'].includes(reading.dataType) ? 'default' : 
                        reading.dataType === 'bool' ? 'destructive' :
                        'secondary'
                      } className="text-xs">
                        {reading.dataType.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-600/20 text-green-400 border-green-600/50">
                        {reading.quality}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {getTimeAgo(reading.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Generate correct Siemens S7 PLC Address based on data type and offset
const generatePlcAddress = (dbNumber: number, offset: number, dataType: string): string => {
  switch (dataType.toLowerCase()) {
    case 'bool':
      return `DB${dbNumber}.DBX${offset}.0`
    case 'int':
      return `DB${dbNumber}.DBW${offset}`
    case 'dint':
      return `DB${dbNumber}.DBD${offset}`
    case 'real':
    case 'float':
      return `DB${dbNumber}.DBD${offset}`
    case 'string':
      return `DB${dbNumber}.DBB${offset}`
    case 'struct':
      return `DB${dbNumber}.DBX${offset}`
    default:
      return `DB${dbNumber}.DBW${offset}`
  }
}

export function PLCConfiguration({}: PLCConfigurationProps) {
  const [, setLocation] = useLocation()
  
  // Use mock data for display
  const { data: dataBlocks = mockDataBlocks, refetch: refetchDataBlocks } = useQuery<PlcDataBlock[]>({
    queryKey: ['plc-datablocks'],
    queryFn: () => Promise.resolve(mockDataBlocks),
  })

  const { data: plcAddresses = mockPlcAddresses, refetch: refetchAddresses } = useQuery<PlcAddress[]>({
    queryKey: ['plc-addresses'],
    queryFn: () => Promise.resolve(mockPlcAddresses),
  })

  const [selectedDataBlock, setSelectedDataBlock] = useState<number>(1999)
  const [isAddingDataBlock, setIsAddingDataBlock] = useState(false)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Filter addresses based on selected data block and search
  const filteredAddresses = useMemo(() => {
    let filtered = plcAddresses.filter(addr => {
      const db = dataBlocks.find(db => db.id === addr.dbId)
      return db?.dbNumber === selectedDataBlock
    })

    if (searchTerm) {
      filtered = filtered.filter(addr => 
        addr.tagName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        addr.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (addr.materialCode && addr.materialCode.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(addr => addr.isActive === (statusFilter === 'active'))
    }

    return filtered
  }, [plcAddresses, selectedDataBlock, searchTerm, statusFilter, dataBlocks])

  const KPICards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Database className="h-4 w-4 text-cyan-400" />
            Data Blocks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{dataBlocks.length}</div>
          <p className="text-xs text-slate-400">Active: {dataBlocks.filter(db => db.isActive).length}</p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Settings className="h-4 w-4 text-green-400" />
            PLC Addresses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{plcAddresses.length}</div>
          <p className="text-xs text-slate-400">Active: {plcAddresses.filter(addr => addr.isActive).length}</p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-400" />
            Read Interval
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">5s</div>
          <p className="text-xs text-slate-400">Average interval</p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-400">Online</div>
          <p className="text-xs text-slate-400">PLC connected</p>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen text-white relative z-10 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => setLocation('/')}
            variant="outline"
            className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              PLC Configuration
            </h1>
            <p className="text-slate-400">Configure PLC Data Blocks and Addresses for Production Monitoring</p>
          </div>
          
          <div className="w-[140px]"></div> {/* Spacer for centering */}
        </div>
        
        <KPICards />

        <Tabs defaultValue="addresses" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-700/50">
            <TabsTrigger value="addresses" className="data-[state=active]:bg-cyan-600">PLC Addresses</TabsTrigger>
            <TabsTrigger value="datablocks" className="data-[state=active]:bg-cyan-600">Data Blocks</TabsTrigger>
            <TabsTrigger value="readings" className="data-[state=active]:bg-cyan-600">Live Readings</TabsTrigger>
          </TabsList>

          <TabsContent value="addresses" className="space-y-4">
            {/* Filters and Controls */}
            <Card className="bg-slate-800/60 backdrop-blur-md border-slate-700/50 shadow-2xl shadow-cyan-500/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-cyan-400" />
                    PLC Address Configuration
                  </span>
                  <Button 
                    onClick={() => setIsAddingAddress(true)}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-slate-300">Data Block</Label>
                    <Select value={selectedDataBlock.toString()} onValueChange={(value) => setSelectedDataBlock(parseInt(value))}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dataBlocks.map(db => (
                          <SelectItem key={db.id} value={db.dbNumber.toString()}>
                            DB{db.dbNumber} - {db.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-slate-300">Search</Label>
                    <Input
                      placeholder="Search addresses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Status Filter</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PLC Addresses Table */}
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">PLC Address</TableHead>
                      <TableHead className="text-slate-300">Tag Name</TableHead>
                      <TableHead className="text-slate-300">Description</TableHead>
                      <TableHead className="text-slate-300">Data Type</TableHead>
                      <TableHead className="text-slate-300">Unit</TableHead>
                      <TableHead className="text-slate-300">Material Code</TableHead>
                      <TableHead className="text-slate-300">Interval</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAddresses.map((address) => (
                      <TableRow key={address.id} className="border-slate-700 hover:bg-slate-700/30">
                        <TableCell className="font-mono text-cyan-400">
                          {generatePlcAddress(selectedDataBlock, address.offset, address.dataType)}
                        </TableCell>
                        <TableCell className="text-white font-medium">{address.tagName}</TableCell>
                        <TableCell className="text-slate-300">{address.description}</TableCell>
                        <TableCell>
                          <Badge variant={
                            ['float', 'real', 'dint'].includes(address.dataType) ? 'default' : 
                            address.dataType === 'bool' ? 'destructive' :
                            'secondary'
                          }>
                            {address.dataType.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">{address.unit || '-'}</TableCell>
                        <TableCell className="text-cyan-400">{address.materialCode || '-'}</TableCell>
                        <TableCell className="text-slate-300">{address.readInterval}ms</TableCell>
                        <TableCell>
                          <Badge variant={address.isActive ? 'default' : 'destructive'}>
                            {address.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-slate-600">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-slate-600 text-red-400">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="datablocks" className="space-y-4">
            <Card className="bg-slate-800/60 backdrop-blur-md border-slate-700/50 shadow-2xl shadow-cyan-500/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-cyan-400" />
                    Data Blocks Management
                  </span>
                  <Button 
                    onClick={() => setIsAddingDataBlock(true)}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Data Block
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">DB Number</TableHead>
                      <TableHead className="text-slate-300">Description</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Addresses</TableHead>
                      <TableHead className="text-slate-300">Created</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataBlocks.map((db) => (
                      <TableRow key={db.id} className="border-slate-700 hover:bg-slate-700/30">
                        <TableCell className="font-mono text-cyan-400">DB{db.dbNumber}</TableCell>
                        <TableCell className="text-white">{db.description}</TableCell>
                        <TableCell>
                          <Badge variant={db.isActive ? 'default' : 'destructive'}>
                            {db.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {plcAddresses.filter(addr => addr.dbId === db.id).length}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {new Date(db.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-slate-600">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-slate-600 text-red-400">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="readings" className="space-y-4">
            <LiveReadingsView dbNumber={selectedDataBlock} addresses={filteredAddresses} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default PLCConfiguration