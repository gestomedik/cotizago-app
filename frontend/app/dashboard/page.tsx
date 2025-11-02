'use client'

import { useEffect, useState } from 'react'
import { FileText, CheckCircle, DollarSign, TrendingUp, Eye, ArrowUp, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { api } from "@/lib/api"
import type { DashboardResumen, ViajeProximo } from "@/lib/types"

export default function DashboardPage() {
  const [resumen, setResumen] = useState<DashboardResumen | null>(null)
  const [proximos, setProximos] = useState<ViajeProximo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState('Usuario')

  useEffect(() => {
    loadDashboardData()
    loadUserName()
  }, [])

  const loadUserName = () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        setUserName(user.nombre)
      }
    }
  }

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Cargar datos en paralelo
      const [resumenRes, proximosRes] = await Promise.all([
        api.dashboard.resumen(),
        api.dashboard.proximos()
      ])

      if (resumenRes.success && resumenRes.data) {
        setResumen(resumenRes.data)
      }

      if (proximosRes.success && proximosRes.data) {
        setProximos(proximosRes.data)
      }
    } catch (err) {
      console.error('Error cargando dashboard:', err)
      setError('Error al cargar los datos del dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getEstadoBadgeClass = (estado: string) => {
    const classes = {
      'cotizacion': 'bg-yellow-100 text-yellow-800',
      'reservacion': 'bg-blue-100 text-blue-800',
      'completada': 'bg-green-100 text-green-800',
      'cancelada': 'bg-red-100 text-red-800',
    }
    return classes[estado as keyof typeof classes] || 'bg-gray-100 text-gray-800'
  }

  const getEstadoLabel = (estado: string) => {
    const labels = {
      'cotizacion': 'Cotización',
      'reservacion': 'Reservación',
      'completada': 'Completada',
      'cancelada': 'Cancelada',
    }
    return labels[estado as keyof typeof labels] || estado
  }

  const currentDate = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const stats = resumen ? [
    {
      title: "Cotizaciones del Mes",
      value: resumen.cotizaciones_mes.toString(),
      description: "cotizaciones creadas",
      trend: "+12%",
      icon: FileText,
      iconColor: "text-[#00D4D4]",
      iconBg: "bg-[#00D4D4]/10",
    },
    {
      title: "Reservaciones",
      value: resumen.reservaciones_activas.toString(),
      description: "reservaciones activas",
      trend: "+8%",
      icon: CheckCircle,
      iconColor: "text-[#7CB342]",
      iconBg: "bg-[#7CB342]/10",
    },
    {
      title: "Ventas del Mes",
      value: formatCurrency(resumen.ventas_mes),
      description: "en ventas totales",
      trend: "+15%",
      icon: DollarSign,
      iconColor: "text-[#00D4D4]",
      iconBg: "bg-[#00D4D4]/10",
    },
    {
      title: "Comisión Acumulada",
      value: formatCurrency(resumen.comision_acumulada),
      description: "comisión este mes",
      trend: "+20%",
      icon: TrendingUp,
      iconColor: "text-[#7CB342]",
      iconBg: "bg-[#7CB342]/10",
    },
  ] : []

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="flex-1 lg:ml-60">
          <DashboardHeader title="Dashboard" />
          <main className="p-4 lg:p-6">
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-8 w-8 animate-spin text-[#00D4D4]" />
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="flex-1 lg:ml-60">
          <DashboardHeader title="Dashboard" />
          <main className="p-4 lg:p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
              <Button 
                onClick={loadDashboardData} 
                className="mt-4 bg-[#00D4D4] hover:bg-[#00B8B8]"
              >
                Reintentar
              </Button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-60">
        <DashboardHeader title="Dashboard" />

        <main className="p-4 lg:p-6">
          {/* Welcome Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl">
              Bienvenido de nuevo, {userName} 👋
            </h2>
            <p className="mt-1 text-sm text-gray-600 capitalize">{currentDate}</p>
          </div>

          {/* Statistics Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title} className="transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                    <div className={`rounded-full p-2 ${stat.iconBg}`}>
                      <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    <p className="mt-1 text-xs text-gray-600">{stat.description}</p>
                    <div className="mt-2 flex items-center gap-1 text-xs font-medium text-green-600">
                      <ArrowUp className="h-3 w-3" />
                      <span>{stat.trend} vs mes anterior</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Upcoming Trips Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Viajes Próximos</CardTitle>
            </CardHeader>
            <CardContent>
              {proximos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay viajes próximos programados
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Folio</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Destino</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead className="text-center">Pasajeros</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {proximos.map((trip) => (
                        <TableRow key={trip.folio} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-medium">{trip.folio}</TableCell>
                          <TableCell>{trip.cliente}</TableCell>
                          <TableCell>{trip.destino}</TableCell>
                          <TableCell>{formatDate(trip.fecha_salida)}</TableCell>
                          <TableCell className="text-center">{trip.num_pasajeros}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={getEstadoBadgeClass(trip.estado)}>
                              {getEstadoLabel(trip.estado)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}