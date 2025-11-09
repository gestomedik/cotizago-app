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
  Hotel,
  Bus,
  DollarSign,
  ShieldCheck
} from "lucide-react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

// ✅ IMPORTS DEFINITIVOS DE TUS NUEVOS COMPONENTES
import { VueloForm, VuelosLista, type Vuelo } from '@/components/cotizaciones/VueloForm';
import { HotelForm, HotelesLista, type HotelItem } from '@/components/cotizaciones/HotelForm';
import { TourForm, ToursLista, type TourItem } from '@/components/cotizaciones/TourForm';
import { TransporteForm, TransportesLista, type TransporteItem } from '@/components/cotizaciones/TransporteForm';
import { SeguroForm, type SeguroData } from '@/components/cotizaciones/SeguroForm';

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

  // ✅ ESTADOS PARA LOS SERVICIOS
  const [vuelos, setVuelos] = useState<Vuelo[]>([])
  const [hoteles, setHoteles] = useState<HotelItem[]>([])
  const [tours, setTours] = useState<TourItem[]>([])
  const [transportes, setTransportes] = useState<TransporteItem[]>([])
  const [seguro, setSeguro] = useState<SeguroData>({
    aseguradora: '',
    tipo_cobertura: '',
    costo_neto: 0,
    comision: 0,
    precio_venta: 0,
    costo_total: 0,
    precio_venta_total: 0
  })
  const [costosData, setCostosData] = useState({ otros_costos: 0 })
  const [comisionMonto, setComisionMonto] = useState<number>(0)

  // UI Helpers
  const [mostrarFormTransporte, setMostrarFormTransporte] = useState(false)

  // --- EFECTOS DE CARGA ---
  useEffect(() => {
    if (currentStep === 1) loadClientes()
  }, [currentStep])

  useEffect(() => {
    if (selectedClient && currentStep === 2) loadPasajeros(selectedClient.id)
  }, [selectedClient, currentStep])

  // --- FUNCIONES DE CARGA DE DATOS ---
  const loadClientes = async () => {
    try {
      setIsLoading(true)
      const response = await api.clientes.list()
      if (response.success && response.data) {
        setClientes(response.data)
      }
    } catch (err) {
      setError('Error al cargar clientes')
    } finally {
      setIsLoading(false)
    }
  }

  const loadPasajeros = async (clienteId: number) => {
    try {
      setIsLoading(true)
      const response = await api.pasajeros.list(clienteId)
      if (response.success && response.data) {
        setPasajeros(response.data)
      }
    } catch (err) {
      setError('Error al cargar pasajeros')
    } finally {
      setIsLoading(false)
    }
  }

  // --- MANEJADORES DE CLIENTE Y PASAJEROS ---
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

  // --- MANEJADORES DE SERVICIOS (NUEVOS COMPONENTES) ---
  const handleAgregarVuelo = (nuevo: Vuelo) => setVuelos([...vuelos, nuevo]);
  const handleEliminarVuelo = (id: string) => setVuelos(vuelos.filter(v => v.id !== id));

  const handleAgregarHotel = (nuevo: HotelItem) => setHoteles([...hoteles, nuevo]);
  const handleEliminarHotel = (id: string) => setHoteles(hoteles.filter(h => h.id !== id));

  const handleAgregarTour = (nuevo: TourItem) => setTours([...tours, nuevo]);
  const handleEliminarTour = (id: string) => setTours(tours.filter(t => t.id !== id));

  const handleAgregarTransporte = (item: TransporteItem) => {
    setTransportes([...transportes, item]);
    setMostrarFormTransporte(false);
  };
  const handleEliminarTransporte = (id: string) => {
    setTransportes(transportes.filter(t => t.id !== id));
  };

  // --- CÁLCULOS FINANCIEROS ---
  const calcularPrecioFinal = () => {
    const totalVuelos = vuelos.reduce((sum, v) => sum + (v.total_con_comision || 0), 0);
    const totalHoteles = hoteles.reduce((sum, h) => sum + (h.precio_venta_total || 0), 0);
    const totalTours = tours.reduce((sum, t) => sum + (t.precio_venta_total || 0), 0);
    const totalTransportes = transportes.reduce((sum, t) => sum + (t.precio_venta_total || 0), 0);
    const totalSeguros = seguro.precio_venta_total || 0;
    const totalOtros = costosData.otros_costos || 0;
    const comisionExtra = comisionMonto || 0;

    return totalVuelos + totalHoteles + totalTours + totalTransportes + totalSeguros + totalOtros + comisionExtra;
  }

  const calcularCostoNetoTotal = () => {
    return (
      vuelos.reduce((sum, v) => sum + (v.costo_total || 0), 0) +
      hoteles.reduce((sum, h) => sum + (h.costo_total || 0), 0) +
      tours.reduce((sum, t) => sum + (t.costo_total || 0), 0) +
      transportes.reduce((sum, t) => sum + (t.costo_total || 0), 0) + // Corregido: usa costo_total (no costo_neto, para estandarizar)
      (seguro.costo_total || 0) +
      (costosData.otros_costos || 0)
    );
  }

  // --- FILTRADO DE CLIENTES ---
  const filteredClients = clientes.filter(client => {
    const fullName = `${client.nombre} ${client.apellido}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase()) ||
           client.email.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // --- NAVEGACIÓN ---
  const handleNext = () => {
    if (currentStep === 1 && !selectedClient) { setError('Selecciona un cliente'); return; }
    if (currentStep === 2 && selectedPasajeros.length === 0) { setError('Selecciona al menos un pasajero'); return; }
    if (currentStep === 3 && (!destinoData.origen || !destinoData.destino)) { setError('Completa destino y origen'); return; }
    if (currentStep === 3 && (!destinoData.fecha_salida || !destinoData.fecha_regreso)) { setError('Completa las fechas'); return; }
    
    if (currentStep < 8) {
      setError(null)
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  // ====================================================================
  // 💾 GUARDAR COTIZACIÓN
  // ====================================================================
  const handleSaveCotizacion = async () => {
    if (!selectedClient) return;

    try {
      setIsLoading(true)
      setError(null)

      // Contadores de pasajeros
      // NOTA: Esto asume que tienes el objeto completo en 'pasajeros' para filtrar por tipo.
      // Si solo tienes IDs en 'selectedPasajeros', necesitamos buscar en el array completo.
      const paxSeleccionadosObjects = pasajeros.filter(p => selectedPasajeros.includes(p.id));
      
      const num_adultos = 1 + paxSeleccionadosObjects.filter(p => p.tipo_pasajero === 'adulto').length;
      const num_ninos = paxSeleccionadosObjects.filter(p => p.tipo_pasajero === 'nino').length;
      const num_infantes = paxSeleccionadosObjects.filter(p => p.tipo_pasajero === 'infante').length;
      const totalPasajeros = 1 + selectedPasajeros.length;

      // Totales
      const costo_total_neto = calcularCostoNetoTotal();
      const precio_venta_final = calcularPrecioFinal();
      const utilidad_total = precio_venta_final - costo_total_neto;

      // Comisiones
      const monto_comision_total = 
        vuelos.reduce((sum, v) => sum + (v.comision_vuelo || 0), 0) + // VueloForm ya entrega la comisión total del vuelo
        hoteles.reduce((sum, h) => sum + (h.comision_hotel || 0), 0) +
        tours.reduce((sum, t) => sum + (t.comision_tour || 0), 0) +
        transportes.reduce((sum, t) => sum + (t.comision_transporte || 0), 0) +
        (seguro.comision || 0) +
        comisionMonto;

      const userStr = localStorage.getItem('user');
      const agente_id = userStr ? JSON.parse(userStr).id : 1;

      // Preparar Payloads para la BD
      const hotelesPayload = hoteles.map(h => ({ ...h, num_personas: totalPasajeros }));
      const toursPayload = tours.map(t => ({ ...t, num_personas: t.cantidad_adultos + t.cantidad_ninos }));
      const transportesPayload = transportes.map(tr => ({
        ...tr, // Enviamos todo el objeto, el backend tomará lo que necesita
        fecha_servicio: destinoData.fecha_salida, // Default si no se capturó
        num_pasajeros: tr.capacidad_pasajeros,
        num_dias: 1
      }));
      const segurosPayload = (seguro.precio_venta_total > 0) ? [{
        ...seguro,
        fecha_inicio: destinoData.fecha_salida,
        fecha_fin: destinoData.fecha_regreso,
        num_personas: totalPasajeros
      }] : [];

      // Payload Principal
      const cotizacionData = {
        cliente_id: selectedClient.id,
        agente_id: agente_id,
        origen: destinoData.origen,
        destino: destinoData.destino,
        fecha_salida: destinoData.fecha_salida,
        fecha_regreso: destinoData.fecha_regreso,
        tipo_viaje: destinoData.tipo_viaje,
        num_adultos, num_ninos, num_infantes,
        num_pasajeros_total: totalPasajeros,
        descripcion_general: destinoData.descripcion_general,
        
        // Totales Financieros
        costo_total: costo_total_neto,
        utilidad: utilidad_total,
        precio_venta_final: precio_venta_final,
        monto_comision: monto_comision_total,
        
        // Desgloses (Opcional si tu BD los usa)
        costo_vuelos: vuelos.reduce((sum, v) => sum + v.costo_total, 0),
        costo_hoteles: hoteles.reduce((sum, h) => sum + h.costo_total, 0),
        costo_tours: tours.reduce((sum, t) => sum + t.costo_total, 0),
        costo_transportes: transportes.reduce((sum, t) => sum + t.costo_total, 0),
        costo_seguros: seguro.costo_total || 0,
        otros_costos: costosData.otros_costos || 0,

        estado: 'cotizacion',
        estado_pago: 'pendiente',
        paso_actual: 8,
        cotizacion_completa: 1,
        pasajeros_ids: selectedPasajeros,
        
        // Arrays de Servicios
        vuelos, 
        hoteles: hotelesPayload, 
        tours: toursPayload, 
        transportes: transportesPayload, 
        seguros: segurosPayload,
      }

      console.log('Enviando cotización:', cotizacionData);
      const response = await api.cotizaciones.create(cotizacionData)

      if (response.success) {
        setShowSuccess(true)
        setTimeout(() => router.push('/cotizaciones'), 2000)
      } else {
        throw new Error(response.error || 'Error al crear cotización')
      }

    } catch (error: any) {
      console.error('Error al guardar:', error);
      setError(error.message || 'Error al guardar la cotización')
    } finally {
      setIsLoading(false)
      setIsSaving(false)
    }
  }

  // ====================================================================
  // RENDERIZADO DE LOS PASOS (WIZARD)
  // ====================================================================
  const renderStepContent = () => {
    switch (currentStep) {
      // --- PASO 1: CLIENTE ---
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={() => setClientType("existing")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  clientType === "existing" ? "bg-[#00D4D4] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Cliente Existente
              </button>
              <button
                onClick={() => setClientType("new")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  clientType === "new" ? "bg-[#00D4D4] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                  <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-[#00D4D4]" /></div>
                ) : (
                  <div className="grid gap-3 max-h-96 overflow-y-auto">
                    {filteredClients.map((client) => (
                      <button
                        key={client.id}
                        onClick={() => setSelectedClient(client)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          selectedClient?.id === client.id ? "border-[#00D4D4] bg-[#00D4D4]/5" : "border-gray-200 hover:border-[#00D4D4]/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{client.nombre} {client.apellido}</p>
                            <p className="text-sm text-gray-600">{client.email}</p>
                          </div>
                          {selectedClient?.id === client.id && <Check className="w-6 h-6 text-[#00D4D4] flex-shrink-0" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Nombre *" value={newCliente.nombre} onChange={(e) => setNewCliente({ ...newCliente, nombre: e.target.value })} />
                  <Input placeholder="Apellido *" value={newCliente.apellido} onChange={(e) => setNewCliente({ ...newCliente, apellido: e.target.value })} />
                  <Input placeholder="Email *" type="email" value={newCliente.email} onChange={(e) => setNewCliente({ ...newCliente, email: e.target.value })} />
                  <Input placeholder="Teléfono *" value={newCliente.telefono} onChange={(e) => setNewCliente({ ...newCliente, telefono: e.target.value })} />
                </div>
                <Button onClick={handleCreateCliente} disabled={isLoading} className="w-full bg-[#00D4D4] hover:bg-[#00D4D4]/90">
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  {isLoading ? "Creando..." : "Crear Cliente"}
                </Button>
              </div>
            )}
          </div>
        )

      // --- PASO 2: PASAJEROS ---
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-center text-gray-600 mb-4">
              Cliente Principal: <span className="font-semibold">{selectedClient?.nombre} {selectedClient?.apellido}</span>
            </p>
            {isLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-[#00D4D4]" /></div>
            ) : pasajeros.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">No hay pasajeros registrados para este cliente.</div>
            ) : (
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {pasajeros.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleTogglePasajero(p.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedPasajeros.includes(p.id) ? "border-[#00D4D4] bg-[#00D4D4]/5" : "border-gray-200 hover:border-[#00D4D4]/50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{p.nombre} {p.apellido}</p>
                        <p className="text-sm text-gray-600 capitalize">{p.tipo_pasajero} • {p.edad} años</p>
                      </div>
                      {selectedPasajeros.includes(p.id) && <Check className="w-6 h-6 text-[#00D4D4]" />}
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div className="bg-[#00D4D4]/10 p-3 rounded-lg text-center">
              <p className="text-sm text-[#00D4D4] font-medium">
                Total Viajeros: {1 + selectedPasajeros.length} (Cliente + {selectedPasajeros.length} seleccionados)
              </p>
            </div>
          </div>
        )

      // --- PASO 3: DESTINO ---
      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Origen *</Label>
                <div className="relative mt-1.5">
                   <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                   <Input className="pl-9" value={destinoData.origen} onChange={(e) => setDestinoData({ ...destinoData, origen: e.target.value })} placeholder="Ciudad de origen" />
                </div>
              </div>
              <div>
                <Label>Destino *</Label>
                 <div className="relative mt-1.5">
                   <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                   <Input className="pl-9" value={destinoData.destino} onChange={(e) => setDestinoData({ ...destinoData, destino: e.target.value })} placeholder="Ciudad destino" />
                </div>
              </div>
              <div>
                <Label>Fecha de Salida *</Label>
                <Input type="date" className="mt-1.5" value={destinoData.fecha_salida} onChange={(e) => setDestinoData({ ...destinoData, fecha_salida: e.target.value })} />
              </div>
              <div>
                <Label>Fecha de Regreso *</Label>
                <Input type="date" className="mt-1.5" value={destinoData.fecha_regreso} onChange={(e) => setDestinoData({ ...destinoData, fecha_regreso: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Tipo de Viaje</Label>
              <select
                value={destinoData.tipo_viaje}
                onChange={(e) => setDestinoData({ ...destinoData, tipo_viaje: e.target.value as any })}
                className="w-full mt-1.5 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#00D4D4] outline-none"
              >
                <option value="individual">Individual / Familiar</option>
                <option value="grupo">Grupo</option>
                <option value="luna_miel">Luna de Miel</option>
              </select>
            </div>
            <div>
              <Label>Descripción General</Label>
              <Textarea
                value={destinoData.descripcion_general}
                onChange={(e) => setDestinoData({ ...destinoData, descripcion_general: e.target.value })}
                placeholder="Notas generales del viaje, requerimientos especiales..."
                rows={3}
                className="mt-1.5"
              />
            </div>
          </div>
        )

      // --- PASO 4: VUELOS ---
      case 4: {
        const totalPaxVuelos = 1 + selectedPasajeros.length;
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Vuelos</h3>
                <p className="text-sm text-gray-600">Gestiona los vuelos para {totalPaxVuelos} pasajero(s)</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Cotización</p>
                <p className="text-2xl font-bold text-[#00D4D4]">
                  ${calcularPrecioFinal().toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <VuelosLista vuelos={vuelos} onEliminar={handleEliminarVuelo} />
            <div className="mt-6">
              <VueloForm 
                onAgregar={handleAgregarVuelo} 
                onCancelar={() => {}} 
                numPasajeros={totalPaxVuelos}
                defaultOrigen={destinoData.origen}
                defaultDestino={destinoData.destino}
                fechaInicioViaje={destinoData.fecha_salida}
                fechaFinViaje={destinoData.fecha_regreso}
              />
            </div>
          </div>
        )
      }

      // --- PASO 5: HOTELES ---
      case 5: {
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Hospedaje</h3>
                <p className="text-sm text-gray-600">Agrega los hoteles para el viaje</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Cotización</p>
                <p className="text-2xl font-bold text-[#00D4D4]">
                  ${calcularPrecioFinal().toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <HotelesLista hoteles={hoteles} onEliminar={handleEliminarHotel} />
            <div className="mt-6">
              <HotelForm 
                onAgregar={handleAgregarHotel} 
                onCancelar={() => {}}
                defaultDestino={destinoData.destino}
                defaultCheckin={destinoData.fecha_salida}
                defaultCheckout={destinoData.fecha_regreso}
              />
            </div>
          </div>
        )
      }

      // --- PASO 6: TOURS ---
      case 6: {
        // Calculamos pasajeros para sugerir defaults
        const paxObjects = pasajeros.filter(p => selectedPasajeros.includes(p.id));
        const numAdultos = 1 + paxObjects.filter(p => p.tipo_pasajero === 'adulto').length;
        const numNinos = paxObjects.filter(p => p.tipo_pasajero !== 'adulto').length;

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Tours y Actividades</h3>
                <p className="text-sm text-gray-600">Agrega excursiones y experiencias</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Cotización</p>
                <p className="text-2xl font-bold text-[#00D4D4]">
                  ${calcularPrecioFinal().toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <ToursLista tours={tours} onEliminar={handleEliminarTour} />
            <div className="mt-6">
              <TourForm 
                onAgregar={handleAgregarTour} 
                onCancelar={() => {}}
                defaultUbicacion={destinoData.destino}
                defaultFecha={destinoData.fecha_salida}
                defaultNumAdultos={numAdultos}
                defaultNumNinos={numNinos}
              />
            </div>
          </div>
        )
      }

      // --- PASO 7: OTROS SERVICIOS ---
      case 7: {
        const totalPax = 1 + selectedPasajeros.length;
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-semibold text-xl">Otros Servicios</h3>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Cotización</p>
                <p className="text-2xl font-bold text-[#00D4D4]">
                  ${calcularPrecioFinal().toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* SECCIÓN 1: TRANSPORTES */}
            <div>
               <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-700 flex items-center gap-2">
                    <Bus className="w-5 h-5 text-[#00D4D4]"/> Transportación
                  </h4>
                  {!mostrarFormTransporte && (
                    <Button onClick={() => setMostrarFormTransporte(true)} variant="outline" size="sm" className="text-[#00D4D4] border-[#00D4D4] hover:bg-[#00D4D4]/10">
                        <Plus className="w-4 h-4 mr-1"/> Agregar
                    </Button>
                  )}
               </div>
               <TransportesLista items={transportes} onEliminar={handleEliminarTransporte} />
               {mostrarFormTransporte && (
                 <TransporteForm 
                    onAgregar={handleAgregarTransporte} 
                    onCancelar={() => setMostrarFormTransporte(false)}
                    defaultOrigen={destinoData.origen}
                    defaultDestino={destinoData.destino}
                    numPasajeros={totalPax}
                 />
               )}
            </div>

            {/* SECCIÓN 2: SEGURO */}
            <div className="border-t pt-8">
               <SeguroForm data={seguro} onChange={setSeguro} />
            </div>

            {/* SECCIÓN 3: OTROS COSTOS */}
            <div className="border-t pt-6 bg-gray-50 p-4 rounded-xl">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-500"/> Ajustes Finales
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Otros Costos (No comisionables)</Label>
                  <Input 
                    type="number" min="0" step="0.01" placeholder="0.00"
                    value={costosData.otros_costos || ''} 
                    onChange={e => setCostosData({ otros_costos: parseFloat(e.target.value) || 0 })} 
                    className="bg-white mt-1.5"
                  />
                  <p className="text-xs text-gray-500 mt-1">Cargos extra que se suman al costo neto.</p>
                </div>
                <div>
                  <Label>Ajuste de Comisión (Manual)</Label>
                  <Input 
                    type="number" min="0" step="0.01" placeholder="0.00"
                    value={comisionMonto || ''} 
                    onChange={e => setComisionMonto(parseFloat(e.target.value) || 0)} 
                    className="bg-white mt-1.5 border-green-200 focus-visible:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Monto extra a sumar a tu ganancia final.</p>
                </div>
              </div>
            </div>
          </div>
        )
      }

      // --- PASO 8: RESUMEN FINAL ---
      case 8: {
        const costoNetoTotal = calcularCostoNetoTotal();
        const precioFinal = calcularPrecioFinal();
        const utilidadReal = precioFinal - costoNetoTotal;
        
        // Calcular comisión total (suma de todas las comisiones individuales)
        const comisionVuelos = vuelos.reduce((sum, v) => sum + ((v.comision_vuelo || 0) * v.cantidad_pasajeros), 0);
        const comisionHoteles = hoteles.reduce((sum, h) => sum + (h.comision_hotel || 0), 0);
        const comisionTours = tours.reduce((sum, t) => sum + (t.comision_tour || 0), 0);
        const comisionTransportes = transportes.reduce((sum, t) => sum + (t.comision_transporte || 0), 0);
        const totalComisiones = comisionVuelos + comisionHoteles + comisionTours + comisionTransportes + (seguro.comision || 0) + comisionMonto;

        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-[#00D4D4]"/> Resumen de la Cotización
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                   <h4 className="font-medium text-gray-500 text-sm uppercase mb-2">Cliente</h4>
                   <p className="text-lg font-semibold text-gray-900">{selectedClient?.nombre} {selectedClient?.apellido}</p>
                   <p className="text-gray-600">{selectedClient?.email}</p>
                </div>
                <div>
                   <h4 className="font-medium text-gray-500 text-sm uppercase mb-2">Viaje</h4>
                   <p className="font-medium">{destinoData.origen} <ChevronRight className="inline w-4 h-4"/> {destinoData.destino}</p>
                   <p className="text-gray-600 text-sm flex items-center gap-1">
                     <div className="w-2 h-2 rounded-full bg-green-500"></div> {new Date(destinoData.fecha_salida).toLocaleDateString('es-MX', {day: 'numeric', month: 'short', year: 'numeric'})}
                     <div className="w-2 h-2 rounded-full bg-red-500 ml-2"></div> {new Date(destinoData.fecha_regreso).toLocaleDateString('es-MX', {day: 'numeric', month: 'short', year: 'numeric'})}
                   </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Desglose Financiero</h4>
                <div className="space-y-3 text-sm">
                    {/* ... (Líneas de desglose de costos netos si las quieres mostrar) ... */}
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-gray-600">Costo Neto Total (Proveedores):</span>
                        <span className="font-medium">${costoNetoTotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 bg-[#00D4D4]/5 px-4 rounded-lg -mx-4">
                        <span className="text-lg font-bold text-gray-900">Precio Final al Cliente:</span>
                        <span className="text-2xl font-bold text-[#00D4D4]">${precioFinal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <p className="text-xs text-green-700 uppercase font-bold mb-1">Tu Utilidad Real</p>
                            <p className="text-2xl font-bold text-green-600">+${utilidadReal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <p className="text-xs text-blue-700 uppercase font-bold mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3"/> Comisiones Totales</p>
                            <p className="text-xl font-bold text-blue-900">${totalComisiones.toLocaleString('es-MX', {minimumFractionDigits: 2})}</p>
                        </div>
                    </div>
                </div>
              </div>

            </div>
          </div>
        )
      }

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
          <div className="max-w-4xl mx-auto"> {/* Hice un poco más ancho el contenedor */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1"><p className="text-sm text-red-800">{error}</p></div>
                <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800"><X className="w-5 h-5" /></button>
              </div>
            )}

            <Card className="p-8 shadow-md border-0">
              {/* Progress Steps */}
              <div className="mb-10">
                <div className="flex justify-between items-center relative">
                  {/* Línea de fondo */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10 mx-10"></div>
                  
                  {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isPast = currentStep > step.id;
                    return (
                        <div key={step.id} className="flex flex-col items-center z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            isActive ? "bg-[#00D4D4] border-[#00D4D4] text-white shadow-md scale-110" : 
                            isPast ? "bg-green-500 border-green-500 text-white" : 
                            "bg-white border-gray-300 text-gray-400"
                        }`}>
                            {isPast ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                        </div>
                        <span className={`text-xs mt-2 font-medium ${isActive ? "text-[#00D4D4]" : isPast ? "text-green-600" : "text-gray-500"}`}>
                            {step.name}
                        </span>
                        </div>
                    );
                  })}
                </div>
              </div>

              {renderStepContent()}

              {/* Navegación */}
              <div className="flex justify-between mt-10 pt-6 border-t">
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  disabled={currentStep === 1}
                  className={`${currentStep === 1 ? 'invisible' : ''} px-6`}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Anterior
                </Button>

                {currentStep < 8 ? (
                  <Button 
                    onClick={handleNext} 
                    className="bg-[#00D4D4] hover:bg-[#00B8B8] px-6"
                  >
                    Siguiente <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSaveCotizacion} 
                    className="bg-green-600 hover:bg-green-700 px-8 py-6 text-lg"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Guardando...</>
                    ) : (
                      <><Check className="w-5 h-5 mr-2" /> Finalizar y Guardar</>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <Card className="max-w-md w-full p-10 text-center shadow-2xl scale-105">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold mb-3 text-gray-900">¡Cotización Creada!</h3>
            <p className="text-gray-600 mb-6">La cotización se ha guardado exitosamente en el sistema.</p>
            <div className="flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#00D4D4]" />
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}