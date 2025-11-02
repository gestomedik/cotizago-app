"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  User,
  Users,
  MapPin,
  Package,
  FileCheck,
  ChevronRight,
  ChevronLeft,
  Search,
  Plus,
  Check,
  Loader2,
  AlertCircle,
  X,
  Plane,
  Ticket,
  Trash2,
  Hotel,
  Bus,
  DollarSign,
} from "lucide-react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

const steps = [
  { id: 1, name: "Cliente", icon: User },
  { id: 2, name: "Pasajeros", icon: Users },
  { id: 3, name: "Destino", icon: MapPin },
  { id: 4, name: "Vuelos", icon: Plane },
  { id: 5, name: "Hoteles", icon: Hotel },
  { id: 6, name: "Tours", icon: Ticket },
  { id: 7, name: "Otros", icon: Package },
  { id: 8, name: "Resumen", icon: FileCheck },
]

interface Cliente {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  ciudad?: string
  estado?: string
}

interface Pasajero {
  id: number
  cliente_id: number
  nombre: string
  apellido: string
  fecha_nacimiento: string
  edad: number
  tipo_pasajero: 'adulto' | 'nino' | 'infante'
  genero: 'masculino' | 'femenino' | 'otro'
}

interface Vuelo {
  aerolinea: string
  numero_vuelo: string
  origen: string
  destino: string
  fecha_salida: string
  hora_salida: string
  fecha_llegada: string
  hora_llegada: string
  tiene_escala: boolean
  duracion_vuelo: string
  duracion_escala: string
  costo_por_persona: number
}

interface HotelItem {
  nombre: string
  num_habitaciones: number
  tipo_habitacion: string
  incluye: string
  fecha_checkin: string
  fecha_checkout: string
  num_noches: number
  costo_total: number
}

interface Tour {
  nombre: string
  descripcion: string
  fecha: string
  hora_inicio: string
  duracion_horas: number
  costo_por_persona: number
  incluye: string
}

interface Transportacion {
  tipo: string
  descripcion: string
  fecha: string
  costo_total: number
}

export default function NewQuotationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [clientType, setClientType] = useState<"existing" | "new">("existing")
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [pasajeros, setPasajeros] = useState<Pasajero[]>([])
  const [selectedPasajeros, setSelectedPasajeros] = useState<number[]>([])

  const [newCliente, setNewCliente] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    estado: "",
    pais: "México",
    codigo_postal: "",
  })

  const [destinoData, setDestinoData] = useState({
    origen: "",
    destino: "",
    fecha_salida: "",
    fecha_regreso: "",
    tipo_viaje: "individual" as 'individual' | 'grupo',
    descripcion_general: "",
  })

  const [vuelos, setVuelos] = useState<Vuelo[]>([])
  const [newVuelo, setNewVuelo] = useState<Vuelo>({
    aerolinea: "",
    numero_vuelo: "",
    origen: "",
    destino: "",
    fecha_salida: "",
    hora_salida: "",
    fecha_llegada: "",
    hora_llegada: "",
    tiene_escala: false,
    duracion_vuelo: "",
    duracion_escala: "",
    costo_por_persona: 0,
  })

  const [hoteles, setHoteles] = useState<HotelItem[]>([])
  const [newHotel, setNewHotel] = useState<HotelItem>({
    nombre: "",
    num_habitaciones: 1,
    tipo_habitacion: "doble",
    incluye: "desayuno",
    fecha_checkin: "",
    fecha_checkout: "",
    num_noches: 0,
    costo_total: 0,
  })

  const [tours, setTours] = useState<Tour[]>([])
  const [newTour, setNewTour] = useState<Tour>({
    nombre: "",
    descripcion: "",
    fecha: "",
    hora_inicio: "",
    duracion_horas: 0,
    costo_por_persona: 0,
    incluye: "",
  })

  const [transportaciones, setTransportaciones] = useState<Transportacion[]>([])
  const [newTransportacion, setNewTransportacion] = useState<Transportacion>({
    tipo: "terrestre",
    descripcion: "",
    fecha: "",
    costo_total: 0,
  })

  const [costosData, setCostosData] = useState({
    costo_seguros: 0,
    otros_costos: 0,
    utilidad: 0,
  })

  // CAMBIO: Comisión en MONTO fijo, no porcentaje
  const [comisionMonto, setComisionMonto] = useState<number>(0)

  useEffect(() => {
    if (currentStep === 1) {
      loadClientes()
    }
  }, [currentStep])

  useEffect(() => {
    if (selectedClient && currentStep === 2) {
      loadPasajeros(selectedClient.id)
    }
  }, [selectedClient, currentStep])

  useEffect(() => {
    if (destinoData.origen && destinoData.destino) {
      setNewVuelo(prev => ({
        ...prev,
        origen: destinoData.origen,
        destino: destinoData.destino,
        fecha_salida: destinoData.fecha_salida,
        fecha_llegada: destinoData.fecha_regreso,
      }))
    }
  }, [destinoData])

  useEffect(() => {
    if (destinoData.fecha_salida && destinoData.fecha_regreso) {
      setNewHotel(prev => ({
        ...prev,
        fecha_checkin: destinoData.fecha_salida,
        fecha_checkout: destinoData.fecha_regreso,
      }))
    }
  }, [destinoData])

  useEffect(() => {
    if (newHotel.fecha_checkin && newHotel.fecha_checkout) {
      const checkin = new Date(newHotel.fecha_checkin)
      const checkout = new Date(newHotel.fecha_checkout)
      const noches = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24))
      setNewHotel(prev => ({ ...prev, num_noches: noches > 0 ? noches : 0 }))
    }
  }, [newHotel.fecha_checkin, newHotel.fecha_checkout])

  const loadClientes = async () => {
    try {
      setIsLoading(true)
      const response = await api.clientes.list()
      if (response.success && response.data) {
        setClientes(response.data)
      }
    } catch (err) {
      console.error('Error cargando clientes:', err)
      setError('Error al cargar clientes')
    } finally {
      setIsLoading(false)
    }
  }

  const loadPasajeros = async (clienteId: number) => {
    try {
      setIsLoading(true)
      const response = await api.pasajeros.list({ cliente_id: clienteId })
      if (response.success && response.data) {
        setPasajeros(response.data)
      }
    } catch (err) {
      console.error('Error cargando pasajeros:', err)
      setError('Error al cargar pasajeros')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCliente = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.clientes.create(newCliente)
      if (response.success && response.data) {
        setSelectedClient(response.data)
        setClientType("existing")
        await loadClientes()
        setCurrentStep(2)
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear cliente')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTogglePasajero = (pasajeroId: number) => {
    setSelectedPasajeros(prev => {
      if (prev.includes(pasajeroId)) {
        return prev.filter(id => id !== pasajeroId)
      } else {
        return [...prev, pasajeroId]
      }
    })
  }

  const handleAddVuelo = () => {
    if (!newVuelo.aerolinea) {
      setError('Completa al menos aerolínea del vuelo')
      return
    }
    // Permitir costo en cero
    setVuelos([...vuelos, { ...newVuelo }])
    setNewVuelo({
      aerolinea: "",
      numero_vuelo: "",
      origen: destinoData.origen,
      destino: destinoData.destino,
      fecha_salida: destinoData.fecha_salida,
      hora_salida: "",
      fecha_llegada: destinoData.fecha_regreso,
      hora_llegada: "",
      tiene_escala: false,
      duracion_vuelo: "",
      duracion_escala: "",
      costo_por_persona: 0,
    })
    setError(null)
  }

  const handleRemoveVuelo = (index: number) => {
    setVuelos(vuelos.filter((_, i) => i !== index))
  }

  const handleAddHotel = () => {
    if (!newHotel.nombre) {
      setError('Completa el nombre del hotel')
      return
    }
    // Permitir costo en cero
    setHoteles([...hoteles, { ...newHotel }])
    setNewHotel({
      nombre: "",
      num_habitaciones: 1,
      tipo_habitacion: "doble",
      incluye: "desayuno",
      fecha_checkin: destinoData.fecha_salida,
      fecha_checkout: destinoData.fecha_regreso,
      num_noches: 0,
      costo_total: 0,
    })
    setError(null)
  }

  const handleRemoveHotel = (index: number) => {
    setHoteles(hoteles.filter((_, i) => i !== index))
  }

  const handleAddTour = () => {
    if (!newTour.nombre) {
      setError('Completa el nombre del tour')
      return
    }
    // Permitir costo en cero
    setTours([...tours, { ...newTour }])
    setNewTour({
      nombre: "",
      descripcion: "",
      fecha: "",
      hora_inicio: "",
      duracion_horas: 0,
      costo_por_persona: 0,
      incluye: "",
    })
    setError(null)
  }

  const handleRemoveTour = (index: number) => {
    setTours(tours.filter((_, i) => i !== index))
  }

  const handleAddTransportacion = () => {
    if (!newTransportacion.descripcion) {
      setError('Completa descripción de la transportación')
      return
    }
    // Permitir costo en cero
    setTransportaciones([...transportaciones, { ...newTransportacion }])
    setNewTransportacion({
      tipo: "terrestre",
      descripcion: "",
      fecha: "",
      costo_total: 0,
    })
    setError(null)
  }

  const handleRemoveTransportacion = (index: number) => {
    setTransportaciones(transportaciones.filter((_, i) => i !== index))
  }

  const calcularCostoVuelos = () => {
    const numPasajeros = selectedPasajeros.length || 1
    return vuelos.reduce((total, vuelo) => total + (vuelo.costo_por_persona * numPasajeros), 0)
  }

  const calcularCostoHoteles = () => {
    return hoteles.reduce((total, hotel) => total + (hotel.costo_total || 0), 0)
  }

  const calcularCostoTours = () => {
    const numPasajeros = selectedPasajeros.length || 1
    return tours.reduce((total, tour) => total + (tour.costo_por_persona * numPasajeros), 0)
  }

  const calcularCostoTransportacion = () => {
    return transportaciones.reduce((total, t) => total + (t.costo_total || 0), 0)
  }

  const calcularCostoTotal = () => {
    return calcularCostoVuelos() + 
           calcularCostoHoteles() +
           calcularCostoTours() +
           calcularCostoTransportacion() +
           (costosData.costo_seguros || 0) +
           (costosData.otros_costos || 0)
  }

  const calcularPrecioFinal = () => {
    return calcularCostoTotal() + (costosData.utilidad || 0)
  }

  const filteredClients = clientes.filter(client => {
    const fullName = `${client.nombre} ${client.apellido}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase()) || 
           client.email.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const handleNext = () => {
    if (currentStep === 1 && !selectedClient) {
      setError('Selecciona o crea un cliente primero')
      return
    }
    if (currentStep === 2 && selectedPasajeros.length === 0) {
      setError('Selecciona al menos un pasajero')
      return
    }
    if (currentStep === 3 && (!destinoData.origen || !destinoData.destino || !destinoData.fecha_salida || !destinoData.fecha_regreso)) {
      setError('Completa todos los campos de destino')
      return
    }
    if (currentStep < 8) {
      setError(null)
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSaveCotizacion = async () => {
    if (!selectedClient) {
      setError('Selecciona un cliente')
      return
    }

    if (selectedPasajeros.length === 0) {
      setError('Selecciona al menos un pasajero')
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      const pasajerosSeleccionados = pasajeros.filter(p => selectedPasajeros.includes(p.id))
      const num_adultos = pasajerosSeleccionados.filter(p => p.tipo_pasajero === 'adulto').length
      const num_ninos = pasajerosSeleccionados.filter(p => p.tipo_pasajero === 'nino').length
      const num_infantes = pasajerosSeleccionados.filter(p => p.tipo_pasajero === 'infante').length

      const costo_total = calcularCostoTotal()
      const precio_venta_final = calcularPrecioFinal()
      const costo_vuelos = calcularCostoVuelos()
      const costo_hoteles = calcularCostoHoteles()
      const costo_tours = calcularCostoTours()
      const costo_transportes = calcularCostoTransportacion()
      
      // Comisión en MONTO fijo
      const monto_comision = Number(comisionMonto) || 0

      const userStr = localStorage.getItem('user')
      const user = userStr ? JSON.parse(userStr) : null
      const usuario_id = user?.id || 1

      const cotizacionData = {
        cliente_id: selectedClient.id,
        usuario_id: usuario_id,
        origen: destinoData.origen || "",
        destino: destinoData.destino || "",
        fecha_salida: destinoData.fecha_salida || "",
        fecha_regreso: destinoData.fecha_regreso || "",
        tipo_viaje: destinoData.tipo_viaje || "individual",
        num_adultos: num_adultos,
        num_ninos: num_ninos,
        num_infantes: num_infantes,
        descripcion_general: destinoData.descripcion_general || "",
        costo_vuelos: Number(costo_vuelos) || 0,
        costo_hoteles: Number(costo_hoteles) || 0,
        costo_transportes: Number(costo_transportes) || 0,
        costo_tours: Number(costo_tours) || 0,
        costo_seguros: Number(costosData.costo_seguros) || 0,
        otros_costos: Number(costosData.otros_costos) || 0,
        costo_total: Number(costo_total) || 0,
        utilidad: Number(costosData.utilidad) || 0,
        precio_venta_final: Number(precio_venta_final) || 0,
        monto_comision: monto_comision,
        pasajeros_ids: selectedPasajeros,
      }

      console.log('=== ENVIANDO COTIZACIÓN ===')
      console.log(JSON.stringify(cotizacionData, null, 2))

      const response = await api.cotizaciones.create(cotizacionData)
      
      console.log('=== RESPUESTA DEL SERVIDOR ===')
      console.log(response)

      if (response.success) {
        setShowSuccess(true)
        setTimeout(() => {
          router.push('/cotizaciones')
        }, 2000)
      } else {
        throw new Error(response.message || 'Error al guardar')
      }
    } catch (err: any) {
      console.error('=== ERROR AL GUARDAR ===', err)
      setError(err.message || 'Error al guardar cotización. Revisa la consola.')
    } finally {
      setIsSaving(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={() => setClientType("existing")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  clientType === "existing"
                    ? "bg-[#00D4D4] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Cliente Existente
              </button>
              <button
                onClick={() => setClientType("new")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  clientType === "new"
                    ? "bg-[#00D4D4] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Nuevo Cliente
              </button>
            </div>

            {clientType === "existing" ? (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Buscar cliente por nombre o email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[#00D4D4]" />
                  </div>
                ) : (
                  <div className="grid gap-3 max-h-96 overflow-y-auto">
                    {filteredClients.map((client) => (
                      <button
                        key={client.id}
                        onClick={() => setSelectedClient(client)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          selectedClient?.id === client.id
                            ? "border-[#00D4D4] bg-[#00D4D4]/5"
                            : "border-gray-200 hover:border-[#00D4D4]/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {client.nombre} {client.apellido}
                            </p>
                            <p className="text-sm text-gray-600">{client.email}</p>
                            <p className="text-sm text-gray-500">{client.telefono}</p>
                          </div>
                          {selectedClient?.id === client.id && (
                            <Check className="w-6 h-6 text-[#00D4D4] flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre *</Label>
                    <Input
                      value={newCliente.nombre}
                      onChange={(e) => setNewCliente({ ...newCliente, nombre: e.target.value })}
                      placeholder="Nombre"
                    />
                  </div>
                  <div>
                    <Label>Apellido *</Label>
                    <Input
                      value={newCliente.apellido}
                      onChange={(e) => setNewCliente({ ...newCliente, apellido: e.target.value })}
                      placeholder="Apellido"
                    />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={newCliente.email}
                      onChange={(e) => setNewCliente({ ...newCliente, email: e.target.value })}
                      placeholder="email@ejemplo.com"
                    />
                  </div>
                  <div>
                    <Label>Teléfono *</Label>
                    <Input
                      value={newCliente.telefono}
                      onChange={(e) => setNewCliente({ ...newCliente, telefono: e.target.value })}
                      placeholder="555-1234"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCreateCliente}
                  disabled={isLoading}
                  className="w-full bg-[#00D4D4] hover:bg-[#00D4D4]/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Cliente
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-gray-600 text-center mb-4">
              Cliente: <span className="font-semibold">{selectedClient?.nombre} {selectedClient?.apellido}</span>
            </p>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-[#00D4D4]" />
              </div>
            ) : pasajeros.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay pasajeros registrados para este cliente.
              </div>
            ) : (
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {pasajeros.map((pasajero) => (
                  <button
                    key={pasajero.id}
                    onClick={() => handleTogglePasajero(pasajero.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedPasajeros.includes(pasajero.id)
                        ? "border-[#00D4D4] bg-[#00D4D4]/5"
                        : "border-gray-200 hover:border-[#00D4D4]/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {pasajero.nombre} {pasajero.apellido}
                        </p>
                        <p className="text-sm text-gray-600">
                          {pasajero.edad} años • {pasajero.tipo_pasajero}
                        </p>
                      </div>
                      {selectedPasajeros.includes(pasajero.id) && (
                        <Check className="w-6 h-6 text-[#00D4D4] flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Pasajeros seleccionados: <span className="font-semibold">{selectedPasajeros.length}</span>
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Origen *</Label>
                <Input
                  value={destinoData.origen}
                  onChange={(e) => setDestinoData({ ...destinoData, origen: e.target.value })}
                  placeholder="Ciudad de origen"
                />
              </div>
              <div>
                <Label>Destino *</Label>
                <Input
                  value={destinoData.destino}
                  onChange={(e) => setDestinoData({ ...destinoData, destino: e.target.value })}
                  placeholder="Ciudad de destino"
                />
              </div>
              <div>
                <Label>Fecha de Salida *</Label>
                <Input
                  type="date"
                  value={destinoData.fecha_salida}
                  onChange={(e) => setDestinoData({ ...destinoData, fecha_salida: e.target.value })}
                />
              </div>
              <div>
                <Label>Fecha de Regreso *</Label>
                <Input
                  type="date"
                  value={destinoData.fecha_regreso}
                  onChange={(e) => setDestinoData({ ...destinoData, fecha_regreso: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Tipo de Viaje</Label>
              <select
                value={destinoData.tipo_viaje}
                onChange={(e) => setDestinoData({ ...destinoData, tipo_viaje: e.target.value as 'individual' | 'grupo' })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="individual">Individual</option>
                <option value="grupo">Grupo</option>
              </select>
            </div>
            <div>
              <Label>Descripción General</Label>
              <Textarea
                value={destinoData.descripcion_general}
                onChange={(e) => setDestinoData({ ...destinoData, descripcion_general: e.target.value })}
                placeholder="Describe el viaje..."
                rows={4}
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Vuelos agregados</h3>
                <p className="text-sm text-gray-600">
                  {vuelos.length} vuelo(s) • {selectedPasajeros.length} pasajero(s)
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Vuelos</p>
                <p className="text-2xl font-bold text-[#00D4D4]">
                  ${calcularCostoVuelos().toLocaleString()}
                </p>
              </div>
            </div>

            {vuelos.length > 0 && (
              <div className="space-y-3 mb-6">
                {vuelos.map((vuelo, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Plane className="w-5 h-5 text-[#00D4D4]" />
                          <p className="font-semibold">{vuelo.aerolinea}</p>
                          {vuelo.numero_vuelo && (
                            <span className="text-sm text-gray-600">#{vuelo.numero_vuelo}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">
                          {vuelo.origen} → {vuelo.destino}
                        </p>
                        <p className="text-sm text-gray-600">
                          Salida: {vuelo.fecha_salida} {vuelo.hora_salida}
                        </p>
                        {vuelo.tiene_escala && (
                          <p className="text-sm text-orange-600">Con escala ({vuelo.duracion_escala})</p>
                        )}
                        <p className="text-sm font-medium text-gray-900 mt-2">
                          ${vuelo.costo_por_persona.toLocaleString()} × {selectedPasajeros.length} = ${(vuelo.costo_por_persona * selectedPasajeros.length).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveVuelo(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-6">
              <h4 className="font-semibold mb-4">Agregar nuevo vuelo</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Aerolínea *</Label>
                  <Input
                    value={newVuelo.aerolinea}
                    onChange={(e) => setNewVuelo({ ...newVuelo, aerolinea: e.target.value })}
                    placeholder="Ej: Aeroméxico"
                  />
                </div>
                <div>
                  <Label>Número de Vuelo</Label>
                  <Input
                    value={newVuelo.numero_vuelo}
                    onChange={(e) => setNewVuelo({ ...newVuelo, numero_vuelo: e.target.value })}
                    placeholder="Ej: AM123"
                  />
                </div>
                <div>
                  <Label>Fecha Salida</Label>
                  <Input
                    type="date"
                    value={newVuelo.fecha_salida}
                    onChange={(e) => setNewVuelo({ ...newVuelo, fecha_salida: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Hora Salida</Label>
                  <Input
                    type="time"
                    value={newVuelo.hora_salida}
                    onChange={(e) => setNewVuelo({ ...newVuelo, hora_salida: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Duración del Vuelo</Label>
                  <Input
                    value={newVuelo.duracion_vuelo}
                    onChange={(e) => setNewVuelo({ ...newVuelo, duracion_vuelo: e.target.value })}
                    placeholder="Ej: 2h 30m"
                  />
                </div>
                <div>
                  <Label>Costo por Persona (puede ser 0)</Label>
                  <Input
                    type="number"
                    value={newVuelo.costo_por_persona}
                    onChange={(e) => setNewVuelo({ ...newVuelo, costo_por_persona: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="tiene_escala"
                      checked={newVuelo.tiene_escala}
                      onChange={(e) => setNewVuelo({ ...newVuelo, tiene_escala: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="tiene_escala">¿Tiene escala?</Label>
                  </div>
                </div>
                {newVuelo.tiene_escala && (
                  <div className="col-span-2">
                    <Label>Duración de Escala</Label>
                    <Input
                      value={newVuelo.duracion_escala}
                      onChange={(e) => setNewVuelo({ ...newVuelo, duracion_escala: e.target.value })}
                      placeholder="Ej: 1h 15m"
                    />
                  </div>
                )}
              </div>
              <Button
                onClick={handleAddVuelo}
                className="w-full mt-4 bg-[#00D4D4] hover:bg-[#00D4D4]/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Vuelo
              </Button>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Hoteles agregados</h3>
                <p className="text-sm text-gray-600">{hoteles.length} hotel(es)</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Hoteles</p>
                <p className="text-2xl font-bold text-[#00D4D4]">
                  ${calcularCostoHoteles().toLocaleString()}
                </p>
              </div>
            </div>

            {hoteles.length > 0 && (
              <div className="space-y-3 mb-6">
                {hoteles.map((hotel, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Hotel className="w-5 h-5 text-[#00D4D4]" />
                          <p className="font-semibold">{hotel.nombre}</p>
                        </div>
                        <p className="text-sm text-gray-700">
                          {hotel.num_habitaciones} hab. {hotel.tipo_habitacion} • {hotel.num_noches} noches
                        </p>
                        <p className="text-sm text-gray-600">
                          Incluye: {hotel.incluye}
                        </p>
                        <p className="text-sm text-gray-600">
                          {hotel.fecha_checkin} → {hotel.fecha_checkout}
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-2">
                          Total: ${hotel.costo_total.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveHotel(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-6">
              <h4 className="font-semibold mb-4">Agregar nuevo hotel</h4>
              <div className="space-y-4">
                <div>
                  <Label>Nombre del Hotel *</Label>
                  <Input
                    value={newHotel.nombre}
                    onChange={(e) => setNewHotel({ ...newHotel, nombre: e.target.value })}
                    placeholder="Ej: Hotel Cancún Palace"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Número de Habitaciones</Label>
                    <Input
                      type="number"
                      value={newHotel.num_habitaciones}
                      onChange={(e) => setNewHotel({ ...newHotel, num_habitaciones: parseInt(e.target.value) || 1 })}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label>Tipo de Habitación</Label>
                    <select
                      value={newHotel.tipo_habitacion}
                      onChange={(e) => setNewHotel({ ...newHotel, tipo_habitacion: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="sencilla">Sencilla</option>
                      <option value="doble">Doble</option>
                      <option value="triple">Triple</option>
                      <option value="suite">Suite</option>
                    </select>
                  </div>
                  <div>
                    <Label>Check-in</Label>
                    <Input
                      type="date"
                      value={newHotel.fecha_checkin}
                      onChange={(e) => setNewHotel({ ...newHotel, fecha_checkin: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Check-out</Label>
                    <Input
                      type="date"
                      value={newHotel.fecha_checkout}
                      onChange={(e) => setNewHotel({ ...newHotel, fecha_checkout: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>¿Qué incluye?</Label>
                  <select
                    value={newHotel.incluye}
                    onChange={(e) => setNewHotel({ ...newHotel, incluye: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="sin_alimentos">Sin alimentos</option>
                    <option value="desayuno">Desayuno incluido</option>
                    <option value="media_pension">Media pensión</option>
                    <option value="pension_completa">Pensión completa</option>
                    <option value="todo_incluido">Todo incluido</option>
                  </select>
                </div>
                <div>
                  <Label>Noches (calculado automático)</Label>
                  <Input
                    type="number"
                    value={newHotel.num_noches}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <Label>Costo Total (puede ser 0)</Label>
                  <Input
                    type="number"
                    value={newHotel.costo_total}
                    onChange={(e) => setNewHotel({ ...newHotel, costo_total: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddHotel}
                className="w-full mt-4 bg-[#00D4D4] hover:bg-[#00D4D4]/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Hotel
              </Button>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Tours agregados</h3>
                <p className="text-sm text-gray-600">
                  {tours.length} tour(s) • {selectedPasajeros.length} pasajero(s)
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Tours</p>
                <p className="text-2xl font-bold text-[#00D4D4]">
                  ${calcularCostoTours().toLocaleString()}
                </p>
              </div>
            </div>

            {tours.length > 0 && (
              <div className="space-y-3 mb-6">
                {tours.map((tour, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Ticket className="w-5 h-5 text-[#00D4D4]" />
                          <p className="font-semibold">{tour.nombre}</p>
                        </div>
                        {tour.descripcion && (
                          <p className="text-sm text-gray-600 mb-2">{tour.descripcion}</p>
                        )}
                        <p className="text-sm text-gray-700">
                          📅 {tour.fecha} • ⏰ {tour.hora_inicio} • ⌚ {tour.duracion_horas}h
                        </p>
                        {tour.incluye && (
                          <p className="text-sm text-gray-600 mt-1">Incluye: {tour.incluye}</p>
                        )}
                        <p className="text-sm font-medium text-gray-900 mt-2">
                          ${tour.costo_por_persona.toLocaleString()} × {selectedPasajeros.length} = ${(tour.costo_por_persona * selectedPasajeros.length).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveTour(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-6">
              <h4 className="font-semibold mb-4">Agregar nuevo tour</h4>
              <div className="space-y-4">
                <div>
                  <Label>Nombre del Tour *</Label>
                  <Input
                    value={newTour.nombre}
                    onChange={(e) => setNewTour({ ...newTour, nombre: e.target.value })}
                    placeholder="Ej: Tour por Chichen Itzá"
                  />
                </div>
                <div>
                  <Label>Descripción</Label>
                  <Textarea
                    value={newTour.descripcion}
                    onChange={(e) => setNewTour({ ...newTour, descripcion: e.target.value })}
                    placeholder="Describe el tour..."
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Fecha del Tour</Label>
                    <Input
                      type="date"
                      value={newTour.fecha}
                      onChange={(e) => setNewTour({ ...newTour, fecha: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Hora de Inicio</Label>
                    <Input
                      type="time"
                      value={newTour.hora_inicio}
                      onChange={(e) => setNewTour({ ...newTour, hora_inicio: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Duración (horas)</Label>
                    <Input
                      type="number"
                      value={newTour.duracion_horas}
                      onChange={(e) => setNewTour({ ...newTour, duracion_horas: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                      step="0.5"
                      min="0"
                    />
                  </div>
                  <div>
                    <Label>Costo por Persona (puede ser 0)</Label>
                    <Input
                      type="number"
                      value={newTour.costo_por_persona}
                      onChange={(e) => setNewTour({ ...newTour, costo_por_persona: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div>
                  <Label>¿Qué incluye?</Label>
                  <Input
                    value={newTour.incluye}
                    onChange={(e) => setNewTour({ ...newTour, incluye: e.target.value })}
                    placeholder="Ej: Transporte, guía, comida"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddTour}
                className="w-full mt-4 bg-[#00D4D4] hover:bg-[#00D4D4]/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Tour
              </Button>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Transportación</h3>
              {transportaciones.length > 0 && (
                <div className="space-y-3 mb-4">
                  {transportaciones.map((t, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg flex justify-between items-start">
                      <div>
                        <p className="font-semibold flex items-center gap-2">
                          <Bus className="w-5 h-5 text-[#00D4D4]" />
                          {t.tipo} - {t.descripcion}
                        </p>
                        <p className="text-sm text-gray-600">{t.fecha}</p>
                        <p className="text-sm font-medium">${t.costo_total.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveTransportacion(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Tipo</Label>
                  <select
                    value={newTransportacion.tipo}
                    onChange={(e) => setNewTransportacion({ ...newTransportacion, tipo: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="terrestre">Terrestre</option>
                    <option value="aereo">Aéreo</option>
                    <option value="maritimo">Marítimo</option>
                  </select>
                </div>
                <div>
                  <Label>Fecha</Label>
                  <Input
                    type="date"
                    value={newTransportacion.fecha}
                    onChange={(e) => setNewTransportacion({ ...newTransportacion, fecha: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Descripción</Label>
                  <Input
                    value={newTransportacion.descripcion}
                    onChange={(e) => setNewTransportacion({ ...newTransportacion, descripcion: e.target.value })}
                    placeholder="Ej: Traslado aeropuerto-hotel"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Costo Total (puede ser 0)</Label>
                  <Input
                    type="number"
                    value={newTransportacion.costo_total}
                    onChange={(e) => setNewTransportacion({ ...newTransportacion, costo_total: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddTransportacion}
                className="w-full bg-[#00D4D4] hover:bg-[#00D4D4]/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Transportación
              </Button>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-4">Otros Costos</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Costo Seguros (puede ser 0)</Label>
                  <Input
                    type="number"
                    value={costosData.costo_seguros}
                    onChange={(e) => setCostosData({ ...costosData, costo_seguros: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label>Otros Costos (puede ser 0)</Label>
                  <Input
                    type="number"
                    value={costosData.otros_costos}
                    onChange={(e) => setCostosData({ ...costosData, otros_costos: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-4">Utilidad y Comisión</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Monto de Utilidad (puede ser 0)</Label>
                  <Input
                    type="number"
                    value={costosData.utilidad}
                    onChange={(e) => setCostosData({ ...costosData, utilidad: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label>Comisión del Agente $ (puede ser 0)</Label>
                  <Input
                    type="number"
                    value={comisionMonto}
                    onChange={(e) => setComisionMonto(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ingresa el monto fijo de comisión
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 8:
        const costoTotal = calcularCostoTotal()
        const precioFinal = calcularPrecioFinal()
        const costoVuelos = calcularCostoVuelos()
        const costoHoteles = calcularCostoHoteles()
        const costoTours = calcularCostoTours()
        const costoTransporte = calcularCostoTransportacion()

        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cliente</h3>
                <p className="text-gray-700">
                  {selectedClient?.nombre} {selectedClient?.apellido}
                </p>
                <p className="text-sm text-gray-600">{selectedClient?.email}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Pasajeros ({selectedPasajeros.length})
                </h3>
                <div className="space-y-1">
                  {pasajeros
                    .filter(p => selectedPasajeros.includes(p.id))
                    .map(p => (
                      <p key={p.id} className="text-sm text-gray-700">
                        • {p.nombre} {p.apellido} ({p.tipo_pasajero})
                      </p>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Destino</h3>
                <p className="text-gray-700">
                  {destinoData.origen} → {destinoData.destino}
                </p>
                <p className="text-sm text-gray-600">
                  {destinoData.fecha_salida} hasta {destinoData.fecha_regreso}
                </p>
              </div>

              {vuelos.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Vuelos ({vuelos.length})
                  </h3>
                  {vuelos.map((v, i) => (
                    <p key={i} className="text-sm text-gray-700">
                      • {v.aerolinea} - {v.origen} → {v.destino}
                    </p>
                  ))}
                </div>
              )}

              {hoteles.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Hoteles ({hoteles.length})
                  </h3>
                  {hoteles.map((h, i) => (
                    <p key={i} className="text-sm text-gray-700">
                      • {h.nombre} - {h.num_noches} noches ({h.incluye})
                    </p>
                  ))}
                </div>
              )}

              {tours.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Tours ({tours.length})
                  </h3>
                  {tours.map((t, i) => (
                    <p key={i} className="text-sm text-gray-700">
                      • {t.nombre} ({t.fecha})
                    </p>
                  ))}
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Desglose de Costos</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vuelos:</span>
                    <span className="font-medium">${costoVuelos.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hoteles:</span>
                    <span className="font-medium">${costoHoteles.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tours:</span>
                    <span className="font-medium">${costoTours.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transportación:</span>
                    <span className="font-medium">${costoTransporte.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seguros:</span>
                    <span className="font-medium">${costosData.costo_seguros.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Otros:</span>
                    <span className="font-medium">${costosData.otros_costos.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Costo Total:</span>
                    <span>${costoTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#7CB342]">
                    <span>Utilidad:</span>
                    <span className="font-semibold">+${costosData.utilidad.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg text-[#00D4D4]">
                    <span>Precio Final:</span>
                    <span>${precioFinal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                  Comisión del Agente
                </h3>
                <div className="flex justify-between font-bold text-lg text-blue-900">
                  <span>Comisión Total:</span>
                  <span>${comisionMonto.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Nueva Cotización" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <Card className="p-8">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-8 overflow-x-auto">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center flex-shrink-0">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                            currentStep === step.id
                              ? "bg-[#00D4D4] border-[#00D4D4] text-white"
                              : currentStep > step.id
                              ? "bg-[#7CB342] border-[#7CB342] text-white"
                              : "bg-white border-gray-300 text-gray-400"
                          }`}
                        >
                          <step.icon className="w-5 h-5" />
                        </div>
                        <span className={`text-xs mt-2 font-medium text-center whitespace-nowrap ${
                          currentStep === step.id ? "text-[#00D4D4]" : "text-gray-500"
                        }`}>
                          {step.name}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`h-0.5 w-12 mx-2 ${
                          currentStep > step.id ? "bg-[#7CB342]" : "bg-gray-300"
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  {steps[currentStep - 1].name}
                </h2>
                <p className="text-gray-600 text-center">
                  Paso {currentStep} de {steps.length}
                </p>
              </div>

              {renderStepContent()}

              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  disabled={currentStep === 1}
                  className={currentStep === 1 ? 'invisible' : ''}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>

                {currentStep < 8 ? (
                  <Button 
                    onClick={handleNext} 
                    className="bg-[#00D4D4] hover:bg-[#00D4D4]/90"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSaveCotizacion} 
                    className="bg-[#00D4D4] hover:bg-[#00D4D4]/90"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Guardar Cotización
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">¡Cotización creada exitosamente!</h3>
            <p className="text-gray-600 mb-4">Redirigiendo a la lista de cotizaciones...</p>
            <Loader2 className="w-6 h-6 animate-spin text-[#00D4D4] mx-auto" />
          </Card>
        </div>
      )}
    </div>
  )
}
