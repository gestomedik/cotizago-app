"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { DollarSign, Clock, Users, Percent, Info, Plus, Trash2, Receipt, Download, CheckCircle } from "lucide-react"

export default function ComisionesPage() {
  const [activeTab, setActiveTab] = useState("agents")
  const [showTierModal, setShowTierModal] = useState(false)
  const [showPaymentDetailModal, setShowPaymentDetailModal] = useState(false)
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<any>(null)

  // Sample agents data
  const agents = [
    {
      id: 1,
      name: "María González",
      role: "Agente",
      initials: "MG",
      active: true,
      sales: 18,
      totalSold: 623400,
      commission: 43638,
      commissionType: "standard",
      commissionRate: 7,
      goal: 500000,
      goalMet: true,
    },
    {
      id: 2,
      name: "Juan Pérez",
      role: "Agente",
      initials: "JP",
      active: true,
      sales: 12,
      totalSold: 425500,
      commission: 29785,
      commissionType: "custom",
      commissionRate: 7.5,
      goal: 400000,
      goalMet: true,
    },
    {
      id: 3,
      name: "Ana Martínez",
      role: "Agente Senior",
      initials: "AM",
      active: true,
      sales: 22,
      totalSold: 812300,
      commission: 65896,
      commissionType: "tiered",
      tieredLevels: 3,
      goal: 700000,
      goalMet: true,
    },
    {
      id: 4,
      name: "Carlos Rodríguez",
      role: "Agente",
      initials: "CR",
      active: true,
      sales: 8,
      totalSold: 287600,
      commission: 20132,
      commissionType: "custom",
      commissionRate: 6.5,
      bonus: 2,
      goal: 300000,
      goalMet: false,
    },
    {
      id: 5,
      name: "Laura Sánchez",
      role: "Agente Senior",
      initials: "LS",
      active: true,
      sales: 15,
      totalSold: 548900,
      commission: 38423,
      commissionType: "custom",
      commissionRate: 8,
      goal: 500000,
      goalMet: true,
    },
    {
      id: 6,
      name: "Pedro López",
      role: "Agente",
      initials: "PL",
      active: true,
      sales: 10,
      totalSold: 356200,
      commission: 24934,
      commissionType: "fixed",
      fixedAmount: 2500,
      goal: 350000,
      goalMet: true,
    },
  ]

  // Sample tiered rules
  const tieredRules = [
    {
      id: 1,
      name: "Comisión Escalonada Estándar",
      usedBy: ["Ana Martínez", "Roberto Torres"],
      active: true,
      tiers: [
        { level: 1, name: "Inicial", from: 0, to: 300000, rate: 6, color: "bg-green-500" },
        { level: 2, name: "Medio", from: 300001, to: 600000, rate: 7.5, color: "bg-blue-500" },
        { level: 3, name: "Alto", from: 600001, to: null, rate: 9, color: "bg-purple-500" },
      ],
    },
    {
      id: 2,
      name: "Senior Performance",
      usedBy: ["Laura Sánchez"],
      active: true,
      tiers: [
        { level: 1, name: "Nivel 1", from: 0, to: 400000, rate: 7, color: "bg-green-500" },
        { level: 2, name: "Nivel 2", from: 400001, to: 800000, rate: 8.5, color: "bg-blue-500" },
        { level: 3, name: "Nivel 3", from: 800001, to: null, rate: 10, color: "bg-purple-500" },
      ],
    },
    {
      id: 3,
      name: "Plan de Inicio",
      usedBy: [],
      active: false,
      tiers: [
        { level: 1, name: "Nivel 1", from: 0, to: 200000, rate: 5, color: "bg-green-500" },
        { level: 2, name: "Nivel 2", from: 200001, to: null, rate: 6.5, color: "bg-blue-500" },
      ],
    },
  ]

  // Sample payment history
  const paymentHistory = [
    {
      id: 1,
      period: "Oct 2025",
      agent: "María González",
      initials: "MG",
      sales: 18,
      totalSold: 623400,
      rate: 7,
      commission: 43638,
      status: "paid",
      paidDate: "01/11/2025",
    },
    {
      id: 2,
      period: "Oct 2025",
      agent: "Juan Pérez",
      initials: "JP",
      sales: 12,
      totalSold: 425500,
      rate: 7.5,
      commission: 31913,
      status: "paid",
      paidDate: "01/11/2025",
    },
    {
      id: 3,
      period: "Oct 2025",
      agent: "Ana Martínez",
      initials: "AM",
      sales: 22,
      totalSold: 812300,
      rate: 8.1,
      commission: 65896,
      status: "pending",
      paidDate: null,
    },
    {
      id: 4,
      period: "Oct 2025",
      agent: "Carlos Rodríguez",
      initials: "CR",
      sales: 8,
      totalSold: 287600,
      rate: 6.5,
      commission: 18694,
      status: "pending",
      paidDate: null,
    },
    {
      id: 5,
      period: "Oct 2025",
      agent: "Laura Sánchez",
      initials: "LS",
      sales: 15,
      totalSold: 548900,
      rate: 7.8,
      commission: 42814,
      status: "processing",
      paidDate: null,
    },
    {
      id: 6,
      period: "Sep 2025",
      agent: "María González",
      initials: "MG",
      sales: 16,
      totalSold: 558200,
      rate: 7,
      commission: 39074,
      status: "paid",
      paidDate: "01/10/2025",
    },
    {
      id: 7,
      period: "Sep 2025",
      agent: "Juan Pérez",
      initials: "JP",
      sales: 10,
      totalSold: 389400,
      rate: 7.5,
      commission: 29205,
      status: "paid",
      paidDate: "01/10/2025",
    },
    {
      id: 8,
      period: "Sep 2025",
      agent: "Ana Martínez",
      initials: "AM",
      sales: 19,
      totalSold: 734500,
      rate: 7.8,
      commission: 57291,
      status: "paid",
      paidDate: "01/10/2025",
    },
    {
      id: 9,
      period: "Ago 2025",
      agent: "María González",
      initials: "MG",
      sales: 14,
      totalSold: 489300,
      rate: 7,
      commission: 34251,
      status: "paid",
      paidDate: "01/09/2025",
    },
    {
      id: 10,
      period: "Ago 2025",
      agent: "Pedro López",
      initials: "PL",
      sales: 11,
      totalSold: 412800,
      rate: 7,
      commission: 28896,
      status: "paid",
      paidDate: "01/09/2025",
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: "Pagado", className: "bg-green-100 text-green-800" },
      pending: { label: "Pendiente", className: "bg-yellow-100 text-yellow-800" },
      processing: { label: "Procesando", className: "bg-blue-100 text-blue-800" },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Configuración de Comisiones" />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-600">Dashboard &gt; Configuración &gt; Comisiones de Agentes</div>

            {/* Top Section */}
            <div className="flex flex-col lg:flex-row gap-4 items-start justify-between">
              <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">
                  Configura las comisiones individuales para cada agente. Las comisiones pueden ser fijas o escalonadas
                  según el volumen de ventas.
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="outline">Aplicar comisión estándar a todos</Button>
                <Button className="bg-[#00D4D4] hover:bg-[#00B8B8] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Regla de Comisión
                </Button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#00D4D4]/10 rounded-lg">
                    <DollarSign className="h-6 w-6 text-[#00D4D4]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">$87,206</p>
                    <p className="text-sm text-gray-600">Total Pagado Este Mes</p>
                    <p className="text-xs text-gray-500">comisiones pagadas</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">$24,890</p>
                    <p className="text-sm text-gray-600">Pendiente de Pago</p>
                    <p className="text-xs text-gray-500">comisiones pendientes</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">6</p>
                    <p className="text-sm text-gray-600">Agentes Activos</p>
                    <p className="text-xs text-gray-500">generando comisiones</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#7CB342]/10 rounded-lg">
                    <Percent className="h-6 w-6 text-[#7CB342]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">7.2%</p>
                    <p className="text-sm text-gray-600">Comisión Promedio</p>
                    <p className="text-xs text-gray-500">promedio del equipo</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="agents">Comisiones por Agente</TabsTrigger>
                <TabsTrigger value="rules">Reglas Escalonadas</TabsTrigger>
                <TabsTrigger value="history">Historial de Pagos</TabsTrigger>
              </TabsList>

              {/* Tab 1: Commissions by Agent */}
              <TabsContent value="agents" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {agents.map((agent) => (
                    <Card key={agent.id} className="p-6 hover:shadow-lg transition-shadow">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-[#00D4D4] text-white">{agent.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{agent.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {agent.role}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`active-${agent.id}`} className="text-sm">
                            Activo
                          </Label>
                          <Switch id={`active-${agent.id}`} checked={agent.active} />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-600">Ventas del mes</p>
                          <p className="text-lg font-semibold">{agent.sales}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Total vendido</p>
                          <p className="text-lg font-semibold">${agent.totalSold.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Comisión acumulada</p>
                          <p className="text-lg font-semibold text-[#00D4D4]">${agent.commission.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Commission Configuration */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm">Configuración de Comisión</h4>

                        <RadioGroup defaultValue={agent.commissionType}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="standard" id={`standard-${agent.id}`} />
                            <Label htmlFor={`standard-${agent.id}`} className="flex-1">
                              <span className="font-medium">Comisión Estándar (7%)</span>
                              <p className="text-xs text-gray-500">Usa la comisión por defecto del sistema</p>
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="custom" id={`custom-${agent.id}`} />
                            <Label htmlFor={`custom-${agent.id}`}>Comisión Personalizada</Label>
                          </div>
                        </RadioGroup>

                        {agent.commissionType === "custom" && (
                          <div className="ml-6 space-y-3 p-4 bg-gray-50 rounded-lg">
                            <div className="space-y-2">
                              <Label>Porcentaje Fijo</Label>
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  placeholder="7.5"
                                  defaultValue={agent.commissionRate}
                                  className="w-24"
                                />
                                <span className="flex items-center">%</span>
                              </div>
                              <div className="flex gap-2 text-sm">
                                <Checkbox id={`nacional-${agent.id}`} defaultChecked />
                                <Label htmlFor={`nacional-${agent.id}`}>Nacional</Label>
                                <Checkbox id={`internacional-${agent.id}`} defaultChecked />
                                <Label htmlFor={`internacional-${agent.id}`}>Internacional</Label>
                                <Checkbox id={`paquetes-${agent.id}`} defaultChecked />
                                <Label htmlFor={`paquetes-${agent.id}`}>Paquetes</Label>
                              </div>
                            </div>
                          </div>
                        )}

                        {agent.commissionType === "tiered" && (
                          <div className="ml-6 p-4 bg-gray-50 rounded-lg">
                            <Button variant="outline" size="sm" onClick={() => setShowTierModal(true)}>
                              Configurar escalones
                            </Button>
                            <p className="text-xs text-gray-600 mt-2">{agent.tieredLevels} niveles configurados</p>
                          </div>
                        )}

                        {agent.commissionType === "fixed" && (
                          <div className="ml-6 p-4 bg-gray-50 rounded-lg">
                            <Label>Monto Fijo por Venta</Label>
                            <div className="flex gap-2 mt-2">
                              <span className="flex items-center">$</span>
                              <Input
                                type="number"
                                placeholder="2500"
                                defaultValue={agent.fixedAmount}
                                className="w-32"
                              />
                            </div>
                          </div>
                        )}

                        {/* Additional Settings */}
                        <div className="space-y-3 pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <Checkbox id={`bonus-${agent.id}`} defaultChecked={!!agent.bonus} />
                            <Label htmlFor={`bonus-${agent.id}`} className="text-sm">
                              Aplicar bonificación por meta cumplida
                            </Label>
                          </div>
                          {agent.bonus && (
                            <div className="ml-6 flex gap-2 items-center">
                              <Input type="number" placeholder="2" defaultValue={agent.bonus} className="w-20" />
                              <span className="text-sm">% extra cuando se cumple la meta</span>
                            </div>
                          )}

                          <div className="flex gap-2 items-center">
                            <Label className="text-sm">Meta mensual:</Label>
                            <span className="text-sm">$</span>
                            <Input type="number" placeholder="500000" defaultValue={agent.goal} className="w-32" />
                            {agent.goalMet && <CheckCircle className="h-4 w-4 text-green-600" />}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-between items-center mt-6 pt-4 border-t">
                        <Button variant="link" className="text-gray-600 p-0 h-auto">
                          Restablecer a estándar
                        </Button>
                        <Button className="bg-[#00D4D4] hover:bg-[#00B8B8] text-white">Guardar Configuración</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Tab 2: Tiered Rules */}
              <TabsContent value="rules" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-600">
                    Configura comisiones que aumentan según el volumen de ventas alcanzado
                  </p>
                  <Button className="bg-[#00D4D4] hover:bg-[#00B8B8] text-white" onClick={() => setShowTierModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Nueva Regla
                  </Button>
                </div>

                <div className="space-y-4">
                  {tieredRules.map((rule) => (
                    <Card key={rule.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{rule.name}</h3>
                          <p className="text-sm text-gray-600">
                            Usado por: {rule.usedBy.length > 0 ? rule.usedBy.join(", ") : "Ningún agente"}
                          </p>
                        </div>
                        {getStatusBadge(rule.active ? "paid" : "pending")}
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 text-sm font-medium">Nivel</th>
                              <th className="text-left py-2 text-sm font-medium">Desde</th>
                              <th className="text-left py-2 text-sm font-medium">Hasta</th>
                              <th className="text-left py-2 text-sm font-medium">Comisión</th>
                              <th className="text-left py-2 text-sm font-medium">Rango</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rule.tiers.map((tier) => (
                              <tr key={tier.level} className="border-b">
                                <td className="py-3 text-sm">
                                  {tier.level} - {tier.name}
                                </td>
                                <td className="py-3 text-sm">${tier.from.toLocaleString()}</td>
                                <td className="py-3 text-sm">
                                  {tier.to ? `$${tier.to.toLocaleString()}` : "en adelante"}
                                </td>
                                <td className="py-3 text-sm font-semibold">{tier.rate}%</td>
                                <td className="py-3">
                                  <div className={`h-2 rounded ${tier.color} w-full max-w-[200px]`} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex gap-2 mt-4 pt-4 border-t">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button variant="outline" size="sm">
                          Duplicar
                        </Button>
                        <Button variant="outline" size="sm">
                          {rule.active ? "Desactivar" : "Activar"}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Tab 3: Payment History */}
              <TabsContent value="history" className="space-y-4">
                {/* Filters */}
                <Card className="p-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[200px]">
                      <Label className="text-sm mb-2">Período</Label>
                      <Select defaultValue="3months">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3months">Últimos 3 meses</SelectItem>
                          <SelectItem value="6months">Últimos 6 meses</SelectItem>
                          <SelectItem value="year">Último año</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <Label className="text-sm mb-2">Agente</Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los agentes</SelectItem>
                          {agents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id.toString()}>
                              {agent.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <Label className="text-sm mb-2">Estado</Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="paid">Pagado</SelectItem>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="processing">Procesando</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" className="mt-6 bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar a Excel
                    </Button>
                  </div>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-6">
                    <p className="text-sm text-gray-600 mb-2">Total pagado período</p>
                    <p className="text-3xl font-bold">$261,618</p>
                  </Card>
                  <Card className="p-6">
                    <p className="text-sm text-gray-600 mb-2">Pendiente de pago</p>
                    <p className="text-3xl font-bold text-orange-600">$24,890</p>
                  </Card>
                  <Card className="p-6">
                    <p className="text-sm text-gray-600 mb-2">Próximo pago programado</p>
                    <p className="text-3xl font-bold">01/Nov/2025</p>
                  </Card>
                </div>

                {/* Payments Table */}
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-medium">Período</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Agente</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Ventas</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Total Vendido</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">% Comisión</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Comisión</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Estado</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Fecha Pago</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentHistory.map((payment) => (
                          <tr key={payment.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm">{payment.period}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-[#00D4D4] text-white text-xs">
                                    {payment.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{payment.agent}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm">{payment.sales}</td>
                            <td className="py-3 px-4 text-sm">${payment.totalSold.toLocaleString()}</td>
                            <td className="py-3 px-4 text-sm">{payment.rate}%</td>
                            <td className="py-3 px-4 text-sm font-semibold">${payment.commission.toLocaleString()}</td>
                            <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                            <td className="py-3 px-4 text-sm">{payment.paidDate || "-"}</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                {payment.status === "paid" && (
                                  <Button variant="ghost" size="sm" onClick={() => setShowPaymentDetailModal(true)}>
                                    <Receipt className="h-4 w-4" />
                                  </Button>
                                )}
                                {payment.status === "pending" && (
                                  <Button variant="outline" size="sm" onClick={() => setShowMarkPaidModal(true)}>
                                    Marcar pagado
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Audit Log */}
                <Card className="p-4">
                  <h4 className="font-semibold text-sm mb-3">Registro de Cambios</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>María González - Comisión actualizada a 7.5% - 15/Oct/2025 por Admin Sistema</p>
                    <p>Nueva regla 'Senior Performance' creada - 10/Oct/2025 por Admin Sistema</p>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Tiered Rule Modal */}
      <Dialog open={showTierModal} onOpenChange={setShowTierModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nueva Regla Escalonada</DialogTitle>
            <DialogDescription>Configura los niveles de comisión según el volumen de ventas</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nombre de la regla*</Label>
              <Input placeholder="Ej: Comisión Premium" />
            </div>
            <div>
              <Label>Descripción (opcional)</Label>
              <Input placeholder="Descripción de la regla" />
            </div>
            <div className="space-y-3">
              <Label>Niveles de Comisión</Label>
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2 items-center">
                  <Input placeholder="Desde $" />
                  <Input placeholder="Hasta $" />
                  <Input placeholder="%" />
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Nivel
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTierModal(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#00D4D4] hover:bg-[#00B8B8] text-white">Guardar Regla</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Detail Modal */}
      <Dialog open={showPaymentDetailModal} onOpenChange={setShowPaymentDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle de Pago</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Agente</Label>
                <p className="font-semibold">María González</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Período</Label>
                <p className="font-semibold">Octubre 2025</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Desglose de Ventas</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>18 ventas realizadas</span>
                  <span className="font-semibold">$623,400</span>
                </div>
                <div className="flex justify-between">
                  <span>Comisión aplicada (7%)</span>
                  <span className="font-semibold text-[#00D4D4]">$43,638</span>
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estado</span>
                {getStatusBadge("paid")}
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">Fecha de pago</span>
                <span className="font-semibold">01/11/2025</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Descargar Comprobante PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark as Paid Modal */}
      <Dialog open={showMarkPaidModal} onOpenChange={setShowMarkPaidModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcar como Pagado</DialogTitle>
            <DialogDescription>Confirma el pago de la comisión</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Fecha de pago*</Label>
              <Input type="date" />
            </div>
            <div>
              <Label>Método de pago*</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer">Transferencia</SelectItem>
                  <SelectItem value="cash">Efectivo</SelectItem>
                  <SelectItem value="check">Cheque</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Número de referencia</Label>
              <Input placeholder="Ej: REF-12345" />
            </div>
            <div>
              <Label>Notas (opcional)</Label>
              <Input placeholder="Notas adicionales" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMarkPaidModal(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#00D4D4] hover:bg-[#00B8B8] text-white">Confirmar Pago</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
