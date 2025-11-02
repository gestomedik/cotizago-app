"use client"

import { useState, useEffect } from "react"
import { Search, Users, User, UserPlus, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import PassengerModal from "@/components/passenger-modal"
import { api } from "@/lib/api"

interface Pasajero {
  id: number
  cliente_id: number
  nombre: string
  apellido: string
  fecha_nacimiento: string
  edad: number
  tipo_pasajero: 'adulto' | 'nino' | 'infante'
  genero: 'masculino' | 'femenino' | 'otro'
  tipo_documento?: string
  numero_documento?: string
  pais_emision?: string
  fecha_emision?: string
  fecha_vencimiento?: string
  nacionalidad?: string
  alergias?: string
  condiciones_medicas?: string
  contacto_emergencia?: string
  telefono_emergencia?: string
  notas?: string
  cliente_nombre?: string
}

export default function PasajerosPage() {
  const [pasajeros, setPasajeros] = useState<Pasajero[]>([])
  const [filteredPasajeros, setFilteredPasajeros] = useState<Pasajero[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPassenger, setSelectedPassenger] = useState<Pasajero | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    loadPasajeros()
  }, [])

  useEffect(() => {
    filterPasajeros()
  }, [searchQuery, typeFilter, pasajeros])

  const loadPasajeros = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.pasajeros.list()
      
      if (response.success && response.data) {
        setPasajeros(response.data)
      }
    } catch (err: any) {
      console.error('Error cargando pasajeros:', err)
      setError('Error al cargar los pasajeros')
    } finally {
      setIsLoading(false)
    }
  }

  const filterPasajeros = () => {
    let filtered = [...pasajeros]

    // Filtrar por búsqueda
    if (searchQuery) {
      const term = searchQuery.toLowerCase()
      filtered = filtered.filter(pasajero => 
        `${pasajero.nombre} ${pasajero.apellido}`.toLowerCase().includes(term) ||
        pasajero.numero_documento?.toLowerCase().includes(term) ||
        pasajero.cliente_nombre?.toLowerCase().includes(term)
      )
    }

    // Filtrar por tipo
    if (typeFilter !== "all") {
      if (typeFilter === "adultos") {
        filtered = filtered.filter(p => p.tipo_pasajero === 'adulto')
      } else if (typeFilter === "menores") {
        filtered = filtered.filter(p => p.tipo_pasajero === 'nino')
      } else if (typeFilter === "infantes") {
        filtered = filtered.filter(p => p.tipo_pasajero === 'infante')
      }
    }

    setFilteredPasajeros(filtered)
  }

  const handleDeletePassenger = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este pasajero?')) return

    try {
      await api.pasajeros.delete(id)
      alert('Pasajero eliminado exitosamente')
      loadPasajeros()
    } catch (err: any) {
      console.error('Error eliminando pasajero:', err)
      alert(err.message || 'Error al eliminar el pasajero')
    }
  }

  const handleModalClose = (shouldReload?: boolean) => {
    setIsModalOpen(false)
    setSelectedPassenger(null)
    if (shouldReload) {
      loadPasajeros()
    }
  }

  const handleNewPassenger = () => {
    setSelectedPassenger(null)
    setIsModalOpen(true)
  }

  const handleEditPassenger = (pasajero: Pasajero) => {
    setSelectedPassenger(pasajero)
    setIsModalOpen(true)
  }

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      'adulto': 'Adulto',
      'nino': 'Menor',
      'infante': 'Infante'
    }
    return labels[tipo] || tipo
  }

  const getTypeBadgeColor = (tipo: string) => {
    switch (tipo) {
      case "adulto":
        return "bg-blue-500 text-white"
      case "nino":
        return "bg-orange-500 text-white"
      case "infante":
        return "bg-pink-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  // Calcular estadísticas
  const totalPasajeros = pasajeros.length
  const adultos = pasajeros.filter(p => p.tipo_pasajero === 'adulto').length
  const menores = pasajeros.filter(p => p.tipo_pasajero === 'nino').length
  const infantes = pasajeros.filter(p => p.tipo_pasajero === 'infante').length

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="flex-1 lg:ml-60">
          <DashboardHeader title="Pasajeros" />
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
          <DashboardHeader title="Pasajeros" />
          <main className="p-4 lg:p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
              <button 
                onClick={loadPasajeros}
                className="mt-4 px-4 py-2 bg-[#00D4D4] text-white rounded-lg hover:bg-[#00B8B8]"
              >
                Reintentar
              </button>
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
        <DashboardHeader title="Pasajeros" />

        <main className="p-4 lg:p-6">
          {/* Breadcrumb */}
          <div className="mb-4 text-sm text-gray-600">
            <span className="hover:text-[#00D4D4] cursor-pointer">Dashboard</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Pasajeros</span>
          </div>

          {/* Page Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Pasajeros</h1>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar pasajeros..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D4D4] focus:border-transparent"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D4D4] focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value="adultos">Adultos</option>
              <option value="menores">Menores</option>
              <option value="infantes">Infantes</option>
            </select>
            <button
              onClick={handleNewPassenger}
              className="px-6 py-2 bg-[#00D4D4] text-white rounded-lg hover:bg-[#00B8B8] transition-colors whitespace-nowrap font-medium"
            >
              + Nuevo Pasajero
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#00D4D4]/10 rounded-lg">
                  <Users className="w-6 h-6 text-[#00D4D4]" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{totalPasajeros}</h3>
              <p className="text-sm text-gray-600">pasajeros registrados</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <User className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{adultos}</h3>
              <p className="text-sm text-gray-600">mayores de 12 años</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <UserPlus className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{menores}</h3>
              <p className="text-sm text-gray-600">2 a 12 años</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-pink-500/10 rounded-lg">
                  <User className="w-6 h-6 text-pink-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{infantes}</h3>
              <p className="text-sm text-gray-600">menores de 2 años</p>
            </div>
          </div>

          {/* Passengers Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredPasajeros.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No se encontraron pasajeros
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pasajero
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Edad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente Asociado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Documento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nacionalidad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPasajeros.map((pasajero) => (
                        <tr key={pasajero.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-[#00D4D4] text-white flex items-center justify-center font-medium">
                                {getInitials(pasajero.nombre, pasajero.apellido)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {pasajero.nombre} {pasajero.apellido}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{pasajero.edad}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeColor(pasajero.tipo_pasajero)}`}
                            >
                              {getTipoLabel(pasajero.tipo_pasajero)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-[#00D4D4] hover:underline cursor-pointer">
                              {pasajero.cliente_nombre || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{pasajero.numero_documento || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{pasajero.nacionalidad || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditPassenger(pasajero)}
                                className="text-[#00D4D4] hover:text-[#00B8B8] p-1 hover:bg-[#00D4D4]/10 rounded transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeletePassenger(pasajero.id)}
                                className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{filteredPasajeros.length}</span> de{' '}
                    <span className="font-medium">{totalPasajeros}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Passenger Modal */}
      <PassengerModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        passenger={selectedPassenger} 
      />
    </div>
  )
}