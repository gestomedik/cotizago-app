"use client"

import { useState, useEffect } from "react"
import { Users, CheckCircle, UserPlus, Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ClientModal } from "@/components/client-modal"
import { api } from "@/lib/api"

interface Cliente {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  telefono_secundario?: string
  direccion?: string
  ciudad?: string
  estado?: string
  pais?: string
  codigo_postal?: string
  es_recurrente: number
  total_viajes: number
  fecha_ultimo_viaje?: string
  notas?: string
  fecha_registro: string
}

function getInitials(nombre: string, apellido: string) {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("todos")

  // Cargar clientes al montar el componente
  useEffect(() => {
    loadClientes()
  }, [])

  // Filtrar clientes cuando cambia la búsqueda o el filtro
  useEffect(() => {
    filterClientes()
  }, [searchTerm, filter, clientes])

  const loadClientes = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.clientes.list()
      
      if (response.success && response.data) {
        setClientes(response.data)
      }
    } catch (err: any) {
      console.error('Error cargando clientes:', err)
      setError('Error al cargar los clientes')
    } finally {
      setIsLoading(false)
    }
  }

  const filterClientes = () => {
    let filtered = [...clientes]

    // Filtrar por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(cliente => 
        `${cliente.nombre} ${cliente.apellido}`.toLowerCase().includes(term) ||
        cliente.email?.toLowerCase().includes(term) ||
        cliente.telefono?.includes(term)
      )
    }

    // Filtrar por estado (basado en si tiene viajes recientes)
    if (filter === "activos") {
      filtered = filtered.filter(cliente => cliente.total_viajes > 0)
    } else if (filter === "inactivos") {
      filtered = filtered.filter(cliente => cliente.total_viajes === 0)
    }

    setFilteredClientes(filtered)
  }

  const handleNewClient = () => {
    setSelectedClient(null)
    setIsModalOpen(true)
  }

  const handleEditClient = (cliente: Cliente) => {
    setSelectedClient(cliente)
    setIsModalOpen(true)
  }

  const handleDeleteClient = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return

    try {
      await api.clientes.delete(id)
      alert('Cliente eliminado exitosamente')
      loadClientes() // Recargar la lista
    } catch (err: any) {
      console.error('Error eliminando cliente:', err)
      alert(err.message || 'Error al eliminar el cliente')
    }
  }

  const handleModalClose = (shouldReload?: boolean) => {
    setIsModalOpen(false)
    setSelectedClient(null)
    if (shouldReload) {
      loadClientes()
    }
  }

  // Calcular estadísticas
  const totalClientes = clientes.length
  const clientesActivos = clientes.filter(c => c.total_viajes > 0).length
  const clientesNuevosMes = clientes.filter(c => {
    const fechaRegistro = new Date(c.fecha_registro)
    const hoy = new Date()
    return fechaRegistro.getMonth() === hoy.getMonth() && 
           fechaRegistro.getFullYear() === hoy.getFullYear()
  }).length

  const stats = [
    {
      title: "Total Clientes",
      value: totalClientes.toString(),
      description: "clientes registrados",
      icon: Users,
      iconColor: "text-[#00D4D4]",
      iconBg: "bg-[#00D4D4]/10",
    },
    {
      title: "Activos",
      value: clientesActivos.toString(),
      description: "clientes con viajes",
      icon: CheckCircle,
      iconColor: "text-[#7CB342]",
      iconBg: "bg-[#7CB342]/10",
    },
    {
      title: "Este Mes",
      value: clientesNuevosMes.toString(),
      description: "nuevos este mes",
      icon: UserPlus,
      iconColor: "text-[#00D4D4]",
      iconBg: "bg-[#00D4D4]/10",
    },
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="flex-1 lg:ml-60">
          <DashboardHeader title="Clientes" />
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
          <DashboardHeader title="Clientes" />
          <main className="p-4 lg:p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
              <Button 
                onClick={loadClientes} 
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

      <div className="flex-1 lg:ml-60">
        <DashboardHeader title="Clientes" />

        <main className="p-4 lg:p-6">
          {/* Breadcrumb */}
          <div className="mb-4 text-sm text-gray-600">
            <span className="hover:text-[#00D4D4] cursor-pointer">Dashboard</span>
            <span className="mx-2">&gt;</span>
            <span className="font-medium text-gray-900">Clientes</span>
          </div>

          {/* Top Section: Search, Filter, New Button */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input 
                  type="search" 
                  placeholder="Buscar clientes..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="activos">Activos</SelectItem>
                  <SelectItem value="inactivos">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleNewClient} className="bg-[#00D4D4] hover:bg-[#00D4D4]/90 text-white">
              <UserPlus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
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
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Clients Table */}
          <Card>
            <CardContent className="p-0">
              {filteredClientes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No se encontraron clientes
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>Nombre completo</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Teléfono</TableHead>
                          <TableHead>Ciudad</TableHead>
                          <TableHead className="text-center">Viajes</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredClientes.map((cliente) => (
                          <TableRow key={cliente.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell>
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-[#00D4D4] text-white text-xs">
                                  {getInitials(cliente.nombre, cliente.apellido)}
                                </AvatarFallback>
                              </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">
                              {cliente.nombre} {cliente.apellido}
                            </TableCell>
                            <TableCell className="text-gray-600">{cliente.email || '-'}</TableCell>
                            <TableCell className="text-gray-600">{cliente.telefono || '-'}</TableCell>
                            <TableCell className="text-gray-600">{cliente.ciudad || '-'}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                {cliente.total_viajes}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={
                                  cliente.total_viajes > 0
                                    ? "bg-[#7CB342]/10 text-[#7CB342]"
                                    : "bg-gray-100 text-gray-600"
                                }
                              >
                                {cliente.total_viajes > 0 ? 'Activo' : 'Inactivo'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEditClient(cliente)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-600 hover:text-red-700"
                                  onClick={() => handleDeleteClient(cliente.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between border-t px-4 py-4">
                    <p className="text-sm text-gray-600">
                      Mostrando {filteredClientes.length} de {totalClientes} clientes
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Client Modal */}
      <ClientModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        client={selectedClient} 
      />
    </div>
  )
}