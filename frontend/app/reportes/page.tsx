"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DollarSign,
  TrendingUp,
  CheckCircle,
  Receipt,
  Award,
  Clock,
  Printer,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Sample data for charts
const monthlyRevenueData = [
  { month: "Ene", ingresos: 95000, comisiones: 6650 },
  { month: "Feb", ingresos: 102000, comisiones: 7140 },
  { month: "Mar", ingresos: 118000, comisiones: 8260 },
  { month: "Abr", ingresos: 108000, comisiones: 7560 },
  { month: "May", ingresos: 125000, comisiones: 8750 },
  { month: "Jun", ingresos: 132000, comisiones: 9240 },
  { month: "Jul", ingresos: 145000, comisiones: 10150 },
  { month: "Ago", ingresos: 138000, comisiones: 9660 },
  { month: "Sep", ingresos: 152000, comisiones: 10640 },
  { month: "Oct", ingresos: 165000, comisiones: 11550 },
]

const salesCategoryData = [
  { name: "Nacional", value: 45, amount: 558610, color: "#2196F3" },
  { name: "Internacional", value: 35, amount: 436030, color: "#7CB342" },
  { name: "Paquetes", value: 20, amount: 251160, color: "#9C27B0" },
]

const topDestinations = [
  { name: "Cancún", sales: 34, amount: 425200, percentage: 80 },
  { name: "Los Cabos", sales: 28, amount: 356400, percentage: 65 },
  { name: "Puerto Vallarta", sales: 21, amount: 267800, percentage: 50 },
  { name: "Playa del Carmen", sales: 18, amount: 234900, percentage: 45 },
  { name: "Riviera Maya", sales: 15, amount: 198500, percentage: 35 },
]

const topAgents = [
  { name: "Admin Sistema", initials: "AS", commission: 45320, rank: 1, percentage: 52 },
  { name: "María González", initials: "MG", commission: 28450, rank: 2, percentage: 33 },
  { name: "Juan Pérez", initials: "JP", commission: 13436, rank: 3, percentage: 15 },
]

const commissionsData = [
  {
    folio: "CTZ-2025-089",
    client: "María González",
    destination: "Cancún",
    date: "15/10/2025",
    amount: 45500,
    percentage: 7,
    commission: 3185,
    status: "Pagada",
  },
  {
    folio: "CTZ-2025-087",
    client: "Juan Pérez",
    destination: "Los Cabos",
    date: "14/10/2025",
    amount: 28750,
    percentage: 7,
    commission: 2013,
    status: "Pagada",
  },
  {
    folio: "CTZ-2025-085",
    client: "Ana Martínez",
    destination: "Puerto Vallarta",
    date: "13/10/2025",
    amount: 67200,
    percentage: 7,
    commission: 4704,
    status: "Pendiente",
  },
  {
    folio: "CTZ-2025-082",
    client: "Carlos Rodríguez",
    destination: "Mazatlán",
    date: "12/10/2025",
    amount: 38900,
    percentage: 7,
    commission: 2723,
    status: "Pagada",
  },
  {
    folio: "CTZ-2025-078",
    client: "Laura Sánchez",
    destination: "Playa del Carmen",
    date: "11/10/2025",
    amount: 52300,
    percentage: 7,
    commission: 3661,
    status: "Pendiente",
  },
  {
    folio: "CTZ-2025-075",
    client: "Pedro López",
    destination: "Nueva York",
    date: "10/10/2025",
    amount: 95400,
    percentage: 7,
    commission: 6678,
    status: "Pagada",
  },
  {
    folio: "CTZ-2025-072",
    client: "Sofia García",
    destination: "Europa",
    date: "09/10/2025",
    amount: 125800,
    percentage: 7,
    commission: 8806,
    status: "Pagada",
  },
  {
    folio: "CTZ-2025-069",
    client: "Diego Hernández",
    destination: "Cancún",
    date: "08/10/2025",
    amount: 89600,
    percentage: 7,
    commission: 6272,
    status: "Pendiente",
  },
  {
    folio: "CTZ-2025-065",
    client: "Carmen Ruiz",
    destination: "Crucero",
    date: "07/10/2025",
    amount: 78900,
    percentage: 7,
    commission: 5523,
    status: "Pagada",
  },
  {
    folio: "CTZ-2025-061",
    client: "Roberto Torres",
    destination: "Disney",
    date: "06/10/2025",
    amount: 142300,
    percentage: 7,
    commission: 9961,
    status: "Pagada",
  },
]

const conversionRateData = [
  { month: "May", rate: 52 },
  { month: "Jun", rate: 48 },
  { month: "Jul", rate: 55 },
  { month: "Ago", rate: 51 },
  { month: "Sep", rate: 59 },
  { month: "Oct", rate: 57 },
]

export default function ReportesPage() {
  const [activeTab, setActiveTab] = useState("comisiones")
  const [dateRange, setDateRange] = useState("ultimo-mes")

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Reportes y Comisiones" />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-600">Dashboard &gt; Reportes</div>

            {/* Filters Bar */}
            <Card className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ultimo-mes">Último mes</SelectItem>
                      <SelectItem value="ultimos-3-meses">Últimos 3 meses</SelectItem>
                      <SelectItem value="este-ano">Este año</SelectItem>
                      <SelectItem value="personalizado">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-600">
                    Mostrando datos de: <span className="font-semibold">Octubre 2025</span>
                  </span>
                </div>

                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Exportar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Section 1: Financial Summary KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Total Revenue */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-[#00D4D4]/10 rounded-full">
                        <DollarSign className="h-6 w-6 text-[#00D4D4]" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">$1,245,800</div>
                    <div className="text-sm text-gray-600 mb-3">ingresos totales del período</div>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <ArrowUp className="h-4 w-4" />
                      <span className="font-semibold">+18%</span>
                      <span className="text-gray-500">vs período anterior</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Card 2: Commissions Earned */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-[#7CB342]/10 rounded-full">
                        <TrendingUp className="h-6 w-6 text-[#7CB342]" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">$87,206</div>
                    <div className="text-sm text-gray-600 mb-3">comisiones acumuladas</div>
                    <div className="flex items-center gap-1 text-sm text-green-600 mb-2">
                      <ArrowUp className="h-4 w-4" />
                      <span className="font-semibold">+22%</span>
                      <span className="text-gray-500">vs período anterior</span>
                    </div>
                    <div className="text-sm font-semibold text-[#7CB342]">7% promedio</div>
                  </div>
                </div>
              </Card>

              {/* Card 3: Converted Quotations */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-500/10 rounded-full">
                        <CheckCircle className="h-6 w-6 text-blue-500" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">89</div>
                    <div className="text-sm text-gray-600 mb-3">cotizaciones aceptadas</div>
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-semibold">57% tasa de conversión</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "57%" }}></div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">de 156 totales</div>
                  </div>
                </div>
              </Card>

              {/* Card 4: Average Ticket */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-orange-500/10 rounded-full">
                        <Receipt className="h-6 w-6 text-orange-500" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">$14,022</div>
                    <div className="text-sm text-gray-600 mb-3">valor promedio por venta</div>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <ArrowUp className="h-4 w-4" />
                      <span className="font-semibold">+5%</span>
                      <span className="text-gray-500">vs período anterior</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Section 2: Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                {/* Monthly Revenue Chart */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Evolución de Ingresos Mensuales</h3>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        6 meses
                      </Button>
                      <Button variant="ghost" size="sm" className="bg-gray-100">
                        12 meses
                      </Button>
                      <Button variant="ghost" size="sm">
                        Todo
                      </Button>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                        formatter={(value) => `$${value.toLocaleString()}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="ingresos"
                        stroke="#00D4D4"
                        strokeWidth={3}
                        dot={{ fill: "#00D4D4", r: 4 }}
                        name="Ingresos"
                      />
                      <Line
                        type="monotone"
                        dataKey="comisiones"
                        stroke="#7CB342"
                        strokeWidth={3}
                        dot={{ fill: "#7CB342", r: 4 }}
                        name="Comisiones"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Sales by Category Chart */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Distribución de Ventas por Tipo</h3>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 w-full">
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={salesCategoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {salesCategoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name, props) => [
                              `${value}% - $${props.payload.amount.toLocaleString()}`,
                              props.payload.name,
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {salesCategoryData.map((item) => (
                        <div key={item.name} className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                          <div>
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-sm text-gray-600">
                              {item.value}% - ${item.amount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="pt-3 border-t mt-3">
                        <div className="text-center text-sm font-semibold text-gray-700">156 ventas totales</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column - 1/3 width */}
              <div className="space-y-6">
                {/* Top Destinations */}
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="h-5 w-5 text-[#00D4D4]" />
                    <h3 className="text-lg font-semibold">Destinos Más Vendidos</h3>
                  </div>
                  <div className="space-y-4">
                    {topDestinations.map((dest, index) => (
                      <div key={dest.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold">{dest.name}</span>
                          <span className="text-sm font-bold text-[#00D4D4]">${dest.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#00D4D4] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${dest.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 w-12">{dest.sales} ventas</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Top Agents */}
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Award className="h-5 w-5 text-[#7CB342]" />
                    <h3 className="text-lg font-semibold">Top Agentes por Comisión</h3>
                  </div>
                  <div className="space-y-4">
                    {topAgents.map((agent) => (
                      <div key={agent.name} className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-[#00D4D4] flex items-center justify-center text-white font-semibold">
                            {agent.initials}
                          </div>
                          <div
                            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                              agent.rank === 1
                                ? "bg-yellow-400 text-yellow-900"
                                : agent.rank === 2
                                  ? "bg-gray-300 text-gray-700"
                                  : "bg-orange-400 text-orange-900"
                            }`}
                          >
                            {agent.rank}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{agent.name}</div>
                          <div className="text-lg font-bold text-[#00D4D4]">${agent.commission.toLocaleString()}</div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-[#7CB342] h-1.5 rounded-full"
                              style={{ width: `${agent.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* Section 3: Detailed Tables */}
            <Card className="p-6">
              {/* Tabs */}
              <div className="flex gap-4 border-b mb-6">
                <button
                  onClick={() => setActiveTab("comisiones")}
                  className={`pb-3 px-2 font-semibold transition-colors ${
                    activeTab === "comisiones"
                      ? "text-[#00D4D4] border-b-2 border-[#00D4D4]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Comisiones Detalladas
                </button>
                <button
                  onClick={() => setActiveTab("ventas")}
                  className={`pb-3 px-2 font-semibold transition-colors ${
                    activeTab === "ventas"
                      ? "text-[#00D4D4] border-b-2 border-[#00D4D4]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Historial de Ventas
                </button>
                <button
                  onClick={() => setActiveTab("clientes")}
                  className={`pb-3 px-2 font-semibold transition-colors ${
                    activeTab === "clientes"
                      ? "text-[#00D4D4] border-b-2 border-[#00D4D4]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Clientes Top
                </button>
              </div>

              {/* Commissions Table */}
              {activeTab === "comisiones" && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Folio</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Cliente</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Destino</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Fecha venta</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Monto venta</th>
                        <th className="text-center py-3 px-4 font-semibold text-sm text-gray-700">% Comisión</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Comisión ganada</th>
                        <th className="text-center py-3 px-4 font-semibold text-sm text-gray-700">Estado pago</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commissionsData.map((row, index) => (
                        <tr key={row.folio} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <button className="text-[#00D4D4] hover:underline font-medium">{row.folio}</button>
                          </td>
                          <td className="py-3 px-4">{row.client}</td>
                          <td className="py-3 px-4">{row.destination}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{row.date}</td>
                          <td className="py-3 px-4 text-right font-semibold">${row.amount.toLocaleString()}</td>
                          <td className="py-3 px-4 text-center">{row.percentage}%</td>
                          <td className="py-3 px-4 text-right font-bold text-[#00D4D4]">
                            ${row.commission.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                row.status === "Pagada"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 font-semibold">
                        <td colSpan={4} className="py-3 px-4">
                          10 registros
                        </td>
                        <td className="py-3 px-4 text-right">Total ventas: $764,650</td>
                        <td></td>
                        <td className="py-3 px-4 text-right text-[#00D4D4]">Total comisiones: $53,526</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-600">Mostrando 1-10 de 89</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="bg-[#00D4D4] text-white">
                        1
                      </Button>
                      <Button variant="outline" size="sm">
                        2
                      </Button>
                      <Button variant="outline" size="sm">
                        3
                      </Button>
                      <Button variant="outline" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "ventas" && (
                <div className="text-center py-12 text-gray-500">Historial de Ventas - Contenido próximamente</div>
              )}

              {activeTab === "clientes" && (
                <div className="text-center py-12 text-gray-500">Clientes Top - Contenido próximamente</div>
              )}
            </Card>

            {/* Section 4: Additional Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Conversion Rate Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-6">Tasa de Conversión por Mes</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={conversionRateData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                      formatter={(value) => `${value}%`}
                    />
                    <Bar dataKey="rate" fill="#7CB342" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <div className="text-sm text-gray-600">
                    Promedio: <span className="font-semibold text-[#7CB342]">54%</span>
                  </div>
                </div>
              </Card>

              {/* Average Response Time */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="h-5 w-5 text-[#00D4D4]" />
                  <h3 className="text-lg font-semibold">Tiempo Promedio de Respuesta</h3>
                </div>
                <div className="text-center py-8">
                  <div className="text-5xl font-bold text-[#00D4D4] mb-2">2.3</div>
                  <div className="text-lg text-gray-600 mb-6">días promedio</div>
                  <div className="text-sm text-gray-600 mb-4">tiempo promedio entre cotización y respuesta</div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-semibold">Meta: &lt;3 días</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
