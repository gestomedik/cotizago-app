"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
//import { VueloForm, VuelosLista } from '@/components/cotizaciones/VueloForm';
// Agrega HotelForm y HotelesLista a tus imports
import { VueloForm, VuelosLista, type Vuelo } from '@/components/cotizaciones/VueloForm';
import { HotelForm, HotelesLista, type HotelItem } from '@/components/cotizaciones/HotelForm';
import { TourForm, ToursLista, type Tour } from '@/components/cotizaciones/TourForm';
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
import { api } from "@/lib/api"

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
  fecha_llegada: string // Ya existía
  hora_llegada: string // Ya existía
  tiene_escala: boolean
  duracion_vuelo: string
  duracion_escala: string
  costo_por_persona: number
  precio_venta_por_persona: number // <-- AÑADIDO
  comision_vuelo: number // <-- AÑADIDO
  clase: string // <-- AÑADIDO
  incluye_equipaje_mano: boolean // <-- AÑADIDO
  incluye_equipaje_documentado: boolean // <-- AÑADIDO
  incluye_seleccion_asiento: boolean // <-- AÑADIDO
  incluye_tua: boolean // <-- AÑADIDO
  notas: string // <-- AÑADIDO
  total_con_comision?: number;
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
  precio_venta_total: number // <-- AÑADIDO
  comision_hotel: number // <-- AÑADIDO
}

interface Transportacion {
  tipo: string
  descripcion: string
  fecha: string
  costo_total: number
  precio_venta_total: number // <-- AÑADIDO
  comision_transporte: number // <-- AÑADIDO
  proveedor: string // <-- AÑADIDO
  notas: string // <-- AÑADIDO
}

interface Seguro {
  aseguradora: string
  tipo_cobertura: string
  monto_cobertura: number
  costo_total: number
  precio_venta_total: number
  comision: number
  notas: string
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

  const totalPasajerosReal = 1 + selectedPasajeros.length;

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
    precio_venta_por_persona: 0, // <-- AÑADIDO
    comision_vuelo: 0, // <-- AÑADIDO
    clase: "economica", // <-- AÑADIDO (default)
    incluye_equipaje_mano: true, // <-- AÑADIDO (default)
    incluye_equipaje_documentado: false, // <-- AÑADIDO (default)
    incluye_seleccion_asiento: false, // <-- AÑADIDO (default)
    incluye_tua: true, // <-- AÑADIDO (default)
    notas: "", // <-- AÑADIDO
  })

  const [hoteles, setHoteles] = useState<HotelItem[]>([])
  // REEMPLAZA este estado (aprox. línea 173)
  const [newHotel, setNewHotel] = useState<HotelItem>({
    nombre: "",
    num_habitaciones: 1,
    tipo_habitacion: "doble",
    incluye: "desayuno",
    fecha_checkin: "",
    fecha_checkout: "",
    num_noches: 0,
    costo_total: 0,
    precio_venta_total: 0, // <-- AÑADIDO
    comision_hotel: 0, // <-- AÑADIDO
  })

  const [tours, setTours] = useState<Tour[]>([])
  const [newTour, setNewTour] = useState<Tour>({
    nombre: "",
    descripcion: "",
    fecha: "",
    hora_inicio: "",
    duracion_horas: 0,
    costo_por_persona: 0,
    precio_venta_por_persona: 0, // <-- AÑADIDO
    comision_tour: 0, // <-- AÑADIDO
    proveedor: "", // <-- AÑADIDO
    incluye: "",
    notas: "", // <-- AÑADIDO
  })

  const [transportaciones, setTransportaciones] = useState<Transportacion[]>([])
  const [newTransportacion, setNewTransportacion] = useState<Transportacion>({
    tipo: "terrestre",
    descripcion: "",
    fecha: "",
    costo_total: 0,
    precio_venta_total: 0, // <-- AÑADIDO
    comision_transporte: 0, // <-- AÑADIDO
    proveedor: "", // <-- AÑADIDO
    notas: "", // <-- AÑADIDO
  })

  const [costosData, setCostosData] = useState({
    otros_costos: 0,
  })

  const [seguroData, setSeguroData] = useState<Seguro>({
    aseguradora: "",
    tipo_cobertura: "Viaje completo",
    monto_cobertura: 50000,
    costo_total: 0,
    precio_venta_total: 0,
    comision: 0,
    notas: "",
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
      const response = await api.pasajeros.list(clienteId)
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

  // ✅ Función simplificada: Recibe el vuelo listo del componente VueloForm
  const handleAgregarVuelo = (nuevoVuelo: Vuelo) => {
    setVuelos([...vuelos, nuevoVuelo]);
  };

  // ✅ Función corregida: Elimina por ID único, no por índice del array
  const handleEliminarVuelo = (idToDelete: string) => {
    setVuelos(vuelos.filter(v => v.id !== idToDelete));
  };

  // ✅ Función simplificada para agregar hoteles
  const handleAgregarHotel = (nuevoHotel: HotelItem) => {
    setHoteles([...hoteles, nuevoHotel]);
  };

  // ✅ Función corregida para eliminar por ID
  const handleEliminarHotel = (idToDelete: string) => {
    setHoteles(hoteles.filter(h => h.id !== idToDelete));
  };

  const handleAgregarTour = (nuevoTour: TourItem) => {
    setTours([...tours, nuevoTour]);
  };

  const handleEliminarTour = (idToDelete: string) => {
    setTours(tours.filter(t => t.id !== idToDelete));
  };

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
      precio_venta_total: 0, // <-- AÑADIDO
      comision_transporte: 0, // <-- AÑADIDO
      proveedor: "", // <-- AÑADIDO
      notas: "", // <-- AÑADIDO
    })
    setError(null)
  }

  const handleRemoveTransportacion = (index: number) => {
    setTransportaciones(transportaciones.filter((_, i) => i !== index))
  }

  // REEMPLAZA la función antigua con esta:
const calcularCostoVuelos = () => {
  return vuelos.reduce((total, vuelo) => total + (vuelo.total_con_comision || 0), 0);
}

  const calcularCostoHoteles = () => {
    return hoteles.reduce((total, hotel) => total + (hotel.precio_venta_total || 0), 0)
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
           (seguroData.costo_total || 0) + // <-- CORREGIDO
           (costosData.otros_costos || 0)
  }

  const calcularPrecioFinal = () => {
    // 1. Vuelos (usa 'total_con_comision')
    const totalVuelos = vuelos.reduce((sum, v) => sum + (Number(v.total_con_comision) || 0), 0);
    
    // 2. Hoteles (usa 'precio_venta_total')
    const totalHoteles = hoteles.reduce((sum, h) => sum + (Number(h.precio_venta_total) || 0), 0);
    
    // 3. Tours (✅ CORREGIDO: usa 'precio_venta_total' directamente)
    const totalTours = tours.reduce((sum, t) => sum + (Number(t.precio_venta_total) || 0), 0);
    
    // 4. Transportes (usa la lógica antigua por ahora)
    const totalTransportes = transportaciones.reduce((sum, tr) => sum + (Number(tr.costo_total) || 0), 0);
    
    // 5. Seguros y Otros
    const totalSeguros = Number(seguroData.precio_venta_total) || 0;
    const totalOtros = Number(costosData.otros_costos) || 0;

    return totalVuelos + totalHoteles + totalTours + totalTransportes + totalSeguros + totalOtros;
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

  // REEMPLAZA TODA LA FUNCIÓN handleSaveCotizacion (líneas 528-874) CON ESTO:

  const handleSaveCotizacion = async () => {
  // ==========================================
  // VALIDACIONES INICIALES
  // ==========================================
  if (!selectedClient) {
    setError('Selecciona un cliente')
    return
  }

  if (selectedPasajeros.length === 0) {
    setError('Selecciona al menos un pasajero')
    return
  }

  if (!destinoData.origen || !destinoData.destino) {
    setError('Completa el origen y destino del viaje')
    return
  }

  if (!destinoData.fecha_salida || !destinoData.fecha_regreso) {
    setError('Completa las fechas del viaje')
    return
  }

  try {
    setIsSaving(true)
    setError(null)

    // ==========================================
    // CALCULAR CONTADORES DE PASAJEROS POR TIPO
    // ==========================================
    const pasajerosSeleccionados = pasajeros.filter(p => selectedPasajeros.includes(p.id))
    const num_adultos = pasajerosSeleccionados.filter(p => p.tipo_pasajero === 'adulto').length
    const num_ninos = pasajerosSeleccionados.filter(p => p.tipo_pasajero === 'nino').length
    const num_infantes = pasajerosSeleccionados.filter(p => p.tipo_pasajero === 'infante').length

    // ==========================================
    // VUELOS - Según cotizacion_vuelos
    // ==========================================
    const vuelosPayload = vuelos.map(v => {
      // Obtenemos los valores del formulario
      const costoUnitario = Number(v.costo_por_persona) || 0
      const precioVentaUnitario = Number(v.precio_venta_por_persona) || costoUnitario // Si no hay precio, es igual al costo
      const comisionUnitario = Number(v.comision_vuelo) || 0
      const totalPasajeros = selectedPasajeros.length || 1
      
      // Calculamos totales y utilidad
      const costoTotal = costoUnitario * totalPasajeros
      const precioVentaTotal = precioVentaUnitario * totalPasajeros
      const utilidadVuelo = (precioVentaUnitario - costoUnitario) * totalPasajeros
      
      // Formateo de notas (incluye info extra del formulario)
      let notasVuelo = v.notas || ''
      if (v.numero_vuelo) notasVuelo += `\nNum Vuelo: ${v.numero_vuelo}`
      if (v.duracion_vuelo) notasVuelo += `\nDuración: ${v.duracion_vuelo}`
      if (v.tiene_escala && v.duracion_escala) notasVuelo += `\nEscala: ${v.duracion_escala}`

      return {
        // Campos básicos
        aerolinea: v.aerolinea || '',
        ruta: `${v.origen || destinoData.origen} → ${v.destino || destinoData.destino}`,
        fecha_salida: v.fecha_salida || destinoData.fecha_salida,
        hora_salida: v.hora_salida || '00:00:00', 
        fecha_regreso: v.fecha_llegada || destinoData.fecha_regreso, 
        hora_regreso: v.hora_llegada || '00:00:00', 
        clase: v.clase || 'economica',
        num_pasajeros: totalPasajeros,
        
        // --- Costos y precios CORREGIDOS ---
        costo_unitario: costoUnitario,
        costo_total: costoTotal,
        precio_venta_unitario: precioVentaUnitario,
        precio_venta_total: precioVentaTotal,
        comision_vuelo: comisionUnitario * totalPasajeros, // Comisión total
        utilidad: utilidadVuelo,
        
        // --- Servicios CORREGIDOS ---
        incluye_equipaje_mano: v.incluye_equipaje_mano ? 1 : 0,
        incluye_equipaje_documentado: v.incluye_equipaje_documentado ? 1 : 0,
        kg_equipaje_documentado: 0, 
        piezas_equipaje_documentado: 0, 
        incluye_seleccion_asiento: v.incluye_seleccion_asiento ? 1 : 0,
        incluye_tua: v.incluye_tua ? 1 : 0,
        notas: notasVuelo.trim() 
      }
    })

    // ==========================================
    // HOTELES - Según cotizacion_hoteles
    // ==========================================
    const hotelesPayload = hoteles.map(h => {
      // Obtenemos los valores del formulario
      const costoTotal = Number(h.costo_total) || 0
      const precioVentaTotal = Number(h.precio_venta_total) || costoTotal // Si no hay precio, es igual al costo
      const comision = Number(h.comision_hotel) || 0
      const noches = Number(h.num_noches) || 1
      
      // Calculamos la utilidad
      const utilidadHotel = precioVentaTotal - costoTotal

      // Calculamos los valores por noche
      const costoPorNoche = costoTotal / noches
      const precioVentaPorNoche = precioVentaTotal / noches
      
      // Calculamos los valores por persona 
      const totalPasajeros = selectedPasajeros.length || 1
      const precioVentaPorPersona = precioVentaTotal / totalPasajeros

      return {
        // Campos básicos
        nombre_hotel: h.nombre || '',
        destino: destinoData.destino,
        tipo_habitacion: h.tipo_habitacion || 'Doble',
        fecha_checkin: h.fecha_checkin || destinoData.fecha_salida,
        fecha_checkout: h.fecha_checkout || destinoData.fecha_regreso,
        num_noches: noches,
        num_habitaciones: Number(h.num_habitaciones) || 1,
        num_personas: totalPasajeros,
        plan_alimentacion: h.incluye || 'Sin alimentos',
        
        // --- Costos y precios CORREGIDOS ---
        costo_por_noche: costoPorNoche,
        costo_total: costoTotal,
        precio_venta_por_noche: precioVentaPorNoche,
        precio_venta_total: precioVentaTotal,
        precio_venta_por_persona: precioVentaPorPersona, 
        comision_hotel: comision,
        utilidad: utilidadHotel,
        notas: ''
      }
    })

    // ==========================================
    // TOURS - Según cotizacion_tours
    // ==========================================
    const toursPayload = tours.map(t => {
      // Obtenemos los valores del formulario
      const costoUnitario = Number(t.costo_por_persona) || 0
      const precioVentaUnitario = Number(t.precio_venta_por_persona) || costoUnitario // Si no hay precio, es igual al costo
      const comisionUnitario = Number(t.comision_tour) || 0
      const totalPasajeros = selectedPasajeros.length || 1
      
      // Calculamos totales y utilidad
      const costoTotal = costoUnitario * totalPasajeros
      const precioVentaTotal = precioVentaUnitario * totalPasajeros
      const comisionTotal = comisionUnitario * totalPasajeros
      const utilidadTotal = (precioVentaUnitario - costoUnitario) * totalPasajeros
      
      // Combinamos las notas
      let notasTour = t.notas || ''
      if (t.descripcion) notasTour = `${t.descripcion}\n${notasTour}`.trim()

      return {
        // Campos básicos
        nombre_tour: t.nombre || '',
        proveedor: t.proveedor || 'No especificado', 
        destino: destinoData.destino,
        fecha_tour: t.fecha || destinoData.fecha_salida,
        duracion: `${t.duracion_horas || 0} horas`, 
        num_personas: totalPasajeros,
        incluye: t.incluye || 'N/A', 
        
        // --- Costos y precios CORREGIDOS ---
        costo_por_persona: costoUnitario,
        costo_total: costoTotal,
        precio_venta_por_persona: precioVentaUnitario,
        precio_venta_total: precioVentaTotal,
        comision_tour: comisionTotal,
        utilidad: utilidadTotal,
        notas: notasTour 
      }
    })

    // ==========================================
    // TRANSPORTES - Según cotizacion_transportes
    // ==========================================
    const transportesPayload = transportaciones.map(tr => {
      // Obtenemos valores
      const costoTotal = Number(tr.costo_total) || 0
      const precioVentaTotal = Number(tr.precio_venta_total) || costoTotal
      const comision = Number(tr.comision_transporte) || 0
      const utilidad = precioVentaTotal - costoTotal
      
      // Combinamos notas
      let notasTransporte = tr.notas || ''
      if (tr.descripcion) notasTransporte = `${tr.descripcion}\n${notasTransporte}`.trim()
      
      return {
        // Campos básicos
        tipo_transporte: tr.tipo || 'terrestre',
        proveedor: tr.proveedor || 'No especificado', 
        origen: destinoData.origen,
        destino: destinoData.destino,
        fecha_servicio: tr.fecha || destinoData.fecha_salida,
        num_pasajeros: selectedPasajeros.length || 1,
        num_dias: 1, // Asumido
        
        // --- Costos y precios CORREGIDOS ---
        costo_total: costoTotal,
        precio_venta_total: precioVentaTotal,
        comision_transporte: comision,
        utilidad: utilidad,
        notas: notasTransporte 
      }
    })

    // ==========================================
    // SEGUROS - Según cotizacion_seguros
    // ==========================================
    const costoSeguro = Number(seguroData.costo_total) || 0
    const precioVentaSeguro = Number(seguroData.precio_venta_total) || costoSeguro
    const comisionSeguro = Number(seguroData.comision) || 0
    const utilidadSeguro = precioVentaSeguro - costoSeguro
    const totalPasajerosSeguro = selectedPasajeros.length || 1
    
    const segurosPayload = costoSeguro > 0 || precioVentaSeguro > 0 ? [{
      // Campos básicos
      aseguradora: seguroData.aseguradora || 'No especificado',
      tipo_cobertura: seguroData.tipo_cobertura || 'Viaje completo',
      fecha_inicio: destinoData.fecha_salida,
      fecha_fin: destinoData.fecha_regreso,
      num_personas: totalPasajerosSeguro,
      monto_cobertura: Number(seguroData.monto_cobertura) || 50000,
      
      // --- Costos y precios CORREGIDOS ---
      costo_por_persona: costoSeguro / totalPasajerosSeguro,
      costo_total: costoSeguro,
      precio_venta_por_persona: precioVentaSeguro / totalPasajerosSeguro,
      precio_venta_total: precioVentaSeguro,
      comision: comisionSeguro,
      utilidad: utilidadSeguro,
      notas: seguroData.notas || ''
    }] : []
    
    // Guardamos el costo para el payload principal
    const costo_seguros_calc = costoSeguro

    // ==========================================
    // CALCULAR COSTOS TOTALES (NUEVA LÓGICA)
    // ==========================================
    
    // --- COSTOS ---
    const costo_vuelos_calc = calcularCostoVuelos()
    const costo_hoteles_calc = calcularCostoHoteles()
    const costo_tours_calc = calcularCostoTours()
    const costo_transportes_calc = calcularCostoTransportacion()
    // (costo_seguros_calc se definió arriba)
    
    // Suma de todos los costos netos
    const costo_total_calc = costo_vuelos_calc + 
                             costo_hoteles_calc + 
                             costo_tours_calc + 
                             costo_transportes_calc + 
                             costo_seguros_calc + 
                             (Number(costosData.otros_costos) || 0)

    // --- PRECIOS DE VENTA ---
    const precio_vuelos_calc = vuelos.reduce((total, v) => total + (v.precio_venta_por_persona * (selectedPasajeros.length || 1)), 0)
    const precio_hoteles_calc = hoteles.reduce((total, h) => total + (h.precio_venta_total || 0), 0)
    const precio_tours_calc = tours.reduce((total, t) => total + (t.precio_venta_por_persona * (selectedPasajeros.length || 1)), 0)
    const precio_transportes_calc = transportaciones.reduce((total, tr) => total + (tr.precio_venta_total || 0), 0)
    const precio_seguros_calc = seguroData.precio_venta_total || 0
    
    // Suma de todos los precios de venta + otros costos (que se pasan directo)
    const precio_venta_final_calc = precio_vuelos_calc + 
                                    precio_hoteles_calc + 
                                    precio_tours_calc + 
                                    precio_transportes_calc + 
                                    precio_seguros_calc +
                                    (Number(costosData.otros_costos) || 0)

    // --- UTILIDAD ---
    // Utilidad total (Venta Final - Costo Total)
    const utilidad_total_calc = precio_venta_final_calc - costo_total_calc

    // --- COMISIÓN ---
    // Suma de todas las comisiones granulares
    const comision_vuelos = vuelos.reduce((sum, v) => sum + (v.comision_vuelo * (selectedPasajeros.length || 1)), 0)
    const comision_hoteles = hoteles.reduce((sum, h) => sum + h.comision_hotel, 0)
    const comision_tours = tours.reduce((sum, t) => sum + (t.comision_tour * (selectedPasajeros.length || 1)), 0)
    const comision_transportes = transportaciones.reduce((sum, tr) => sum + tr.comision_transporte, 0)
    const comision_seguros = seguroData.comision
    
    const monto_comision_total_calc = comision_vuelos + 
                                      comision_hoteles + 
                                      comision_tours + 
                                      comision_transportes + 
                                      comision_seguros

    // Obtener agente_id del usuario autenticado
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null
    const agente_id = user?.id || 1


    // ==========================================
    // PAYLOAD PRINCIPAL - Tabla cotizaciones
    // ==========================================
    const cotizacionData = {
      // IDs principales
      cliente_id: selectedClient.id,
      agente_id: agente_id,
      
      // Destino
      origen: destinoData.origen,
      destino: destinoData.destino,
      fecha_salida: destinoData.fecha_salida,
      fecha_regreso: destinoData.fecha_regreso,
      
      // Tipo y contadores
      tipo_viaje: destinoData.tipo_viaje || "individual",
      num_adultos: num_adultos,
      num_ninos: num_ninos,
      num_infantes: num_infantes,
      num_pasajeros_total: selectedPasajeros.length,
      
      // Descripción
      descripcion_general: destinoData.descripcion_general || `Viaje a ${destinoData.destino}`,
      notas_internas: "",
      
      // --- CAMPOS CORREGIDOS ---
      // Costos desglosados
      costo_vuelos: costo_vuelos_calc,
      costo_hoteles: costo_hoteles_calc,
      costo_transportes: costo_transportes_calc,
      costo_tours: costo_tours_calc,
      costo_seguros: costo_seguros_calc,
      otros_costos: Number(costosData.otros_costos) || 0,
      
      // Total y utilidad
      costo_total: costo_total_calc,
      utilidad: utilidad_total_calc,
      precio_venta_final: precio_venta_final_calc,
      
      // Comisión
      monto_comision: monto_comision_total_calc,
      // --- FIN DE CAMPOS CORREGIDOS ---
      
      // Estados
      estado: 'cotizacion',
      estado_pago: 'pendiente',
      paso_actual: 8,
      cotizacion_completa: 1,
      
      // Pasajeros
      pasajeros_ids: selectedPasajeros,
      
      // Arrays de servicios
      vuelos: vuelosPayload,
      hoteles: hotelesPayload,
      tours: toursPayload,
      transportes: transportesPayload,
      seguros: segurosPayload,
    }

    console.log('=== PAYLOAD FINAL COMPLETO ===')
    console.log(JSON.stringify(cotizacionData, null, 2))

    // Enviar al backend
    const response = await api.cotizaciones.create(cotizacionData)
    
    console.log('=== RESPUESTA DEL BACKEND ===')
    console.log(response)

    if (response.success) {
      setShowSuccess(true)
      setTimeout(() => {
        router.push('/cotizaciones')
      }, 2000)
    } else {
      throw new Error(response.error || 'Error al crear cotización')
    }

  } catch (error: any) {
    console.error('❌ ERROR COMPLETO:', error)
    setError(error.message || 'Error al guardar la cotización')
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
        // Calculamos el total real de personas (cliente + acompañantes)
        const totalPaxVuelos = 1 + selectedPasajeros.length;
        
        // ✅ Calculamos el GRAN TOTAL acumulado hasta este paso
        // (En este paso, es solo la suma de los vuelos, pero si hubiera pasos anteriores con costos, los sumaríamos aquí)
        const granTotalHastaAhora = calcularCostoVuelos();

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Vuelos del viaje</h3>
                {/* ✅ CORRECCIÓN: Usamos la variable totalPaxVuelos */}
                <p className="text-sm text-gray-600">
                  Gestiona los vuelos para los {totalPaxVuelos} pasajero(s)
                </p>
              </div>
              <div className="text-right">
                {/* ✅ CAMBIO DE TEXTO: Total Cotización */}
                <p className="text-sm text-gray-600">Total Cotización</p>
                <p className="text-2xl font-bold text-[#00D4D4]">
                  ${granTotalHastaAhora.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <VuelosLista 
              vuelos={vuelos} 
              onEliminar={handleEliminarVuelo} 
            />

            <div className="mt-6">
              <VueloForm 
                onAgregar={handleAgregarVuelo}
                onCancelar={() => {}}
                numPasajeros={totalPaxVuelos} // ✅ Pasamos el número correcto al form
                defaultOrigen={destinoData.origen}
                defaultDestino={destinoData.destino}
                fechaInicioViaje={destinoData.fecha_salida}
                fechaFinViaje={destinoData.fecha_regreso}
              />
            </div>
          </div>
        )

      case 5: {
        // ✅ Usamos la función general para obtener el Gran Total acumulado
        const granTotalHastaAhora = calcularPrecioFinal();
        
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Hospedaje</h3>
                <p className="text-sm text-gray-600">Agrega los hoteles para el viaje</p>
              </div>
              <div className="text-right">
                {/* ✅ CAMBIO DE TEXTO Y VALOR: Total Cotización */}
                <p className="text-sm text-gray-600">Total Cotización</p>
                <p className="text-2xl font-bold text-[#00D4D4]">
                  ${granTotalHastaAhora.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Lista de hoteles */}
            <HotelesLista hoteles={hoteles} onEliminar={handleEliminarHotel} />

            <div className="mt-6">
              {/* Formulario nuevo */}
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

      case 6: {
        // ✅ CÁLCULO INTELIGENTE DE PASAJEROS
        // Adultos: El cliente principal (1) + los pasajeros adicionales que sean 'adulto'
        const numAdultosTotal = 1 + selectedPasajeros.filter(p => p.tipo_pasajero === 'adulto').length;
        // Niños: Sumamos 'nino' e 'infante'
        const numNinosTotal = selectedPasajeros.filter(p => p.tipo_pasajero === 'nino' || p.tipo_pasajero === 'infante').length;

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Tours y Actividades</h3>
                <p className="text-sm text-gray-600">Agrega excursiones y experiencias</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Cotización</p>
                {/* ✅ El total ahora se actualizará correctamente al agregar tours */}
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
                // ✅ Pasamos los defaults calculados
                defaultUbicacion={destinoData.destino}
                defaultFecha={destinoData.fecha_salida}
                defaultNumAdultos={numAdultosTotal}
                defaultNumNinos={numNinosTotal}
              />
            </div>
          </div>
        )
      }

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
                        <p className="text-sm font-medium">
                          Costo: ${t.costo_total.toLocaleString()}
                        </p>
                        <p className="text-sm font-medium text-green-700">
                          Precio Venta: ${t.precio_venta_total.toLocaleString()}
                        </p>
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
              
              {/* --- LÓGICA DE CÁLCULO EN VIVO --- */}
              {(() => {
                const costoNeto = newTransportacion.costo_total || 0
                const precioVenta = newTransportacion.precio_venta_total || 0
                const utilidad = (precioVenta - costoNeto) || 0

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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
                        <Label>Proveedor</Label>
                        <Input
                          value={newTransportacion.proveedor}
                          onChange={(e) => setNewTransportacion({ ...newTransportacion, proveedor: e.target.value })}
                          placeholder="Ej: Transportes Gaviota"
                        />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Label>Descripción *</Label>
                      <Input
                        value={newTransportacion.descripcion}
                        onChange={(e) => setNewTransportacion({ ...newTransportacion, descripcion: e.target.value })}
                        placeholder="Ej: Traslado aeropuerto-hotel"
                      />
                    </div>
                    <div>
                      <Label>Fecha</Label>
                      <Input
                        type="date"
                        value={newTransportacion.fecha}
                        onChange={(e) => setNewTransportacion({ ...newTransportacion, fecha: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                      <div>
                        <Label>Costo Total (Neto)</Label>
                        <Input
                          type="number"
                          value={newTransportacion.costo_total}
                          onChange={(e) => setNewTransportacion({ ...newTransportacion, costo_total: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>Precio Venta Total</Label>
                        <Input
                          type="number"
                          value={newTransportacion.precio_venta_total}
                          onChange={(e) => setNewTransportacion({ ...newTransportacion, precio_venta_total: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>Comisión (Monto)</Label>
                        <Input
                          type="number"
                          value={newTransportacion.comision_transporte}
                          onChange={(e) => setNewTransportacion({ ...newTransportacion, comision_transporte: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>Utilidad (Auto)</Label>
                        <Input
                          value={utilidad.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                          readOnly
                          className="bg-green-100 border-green-300"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Notas</Label>
                      <Textarea
                        value={newTransportacion.notas}
                        onChange={(e) => setNewTransportacion({ ...newTransportacion, notas: e.target.value })}
                        placeholder="Detalles del servicio..."
                        rows={2}
                      />
                    </div>
                    
                  </div>
                )
              })()}

              <Button
                onClick={handleAddTransportacion}
                className="w-full mt-4 bg-[#00D4D4] hover:bg-[#00D4D4]/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Transportación
              </Button>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-4">Seguro de Viaje</h3>
              
              {/* --- LÓGICA DE CÁLCULO EN VIVO --- */}
              {(() => {
                const costoNeto = seguroData.costo_total || 0
                const precioVenta = seguroData.precio_venta_total || 0
                const utilidad = (precioVenta - costoNeto) || 0

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Aseguradora</Label>
                        <Input
                          value={seguroData.aseguradora}
                          onChange={(e) => setSeguroData({ ...seguroData, aseguradora: e.target.value })}
                          placeholder="Ej: AXA Seguros"
                        />
                      </div>
                      <div>
                        <Label>Tipo de Cobertura</Label>
                        <Input
                          value={seguroData.tipo_cobertura}
                          onChange={(e) => setSeguroData({ ...seguroData, tipo_cobertura: e.target.value })}
                          placeholder="Ej: Viaje completo"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Costo Total (Neto)</Label>
                        <Input
                          type="number"
                          value={seguroData.costo_total}
                          onChange={(e) => setSeguroData({ ...seguroData, costo_total: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>Precio Venta Total</Label>
                        <Input
                          type="number"
                          value={seguroData.precio_venta_total}
                          onChange={(e) => setSeguroData({ ...seguroData, precio_venta_total: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>Comisión (Monto)</Label>
                        <Input
                          type="number"
                          value={seguroData.comision}
                          onChange={(e) => setSeguroData({ ...seguroData, comision: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>Utilidad (Auto)</Label>
                        <Input
                          value={utilidad.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                          readOnly
                          className="bg-green-100 border-green-300"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Monto de Cobertura (Aprox)</Label>
                      <Input
                        type="number"
                        value={seguroData.monto_cobertura}
                        onChange={(e) => setSeguroData({ ...seguroData, monto_cobertura: parseFloat(e.target.value) || 0 })}
                        placeholder="50000"
                      />
                    </div>

                    <div>
                      <Label>Notas del Seguro</Label>
                      <Textarea
                        value={seguroData.notas}
                        onChange={(e) => setSeguroData({ ...seguroData, notas: e.target.value })}
                        placeholder="Detalles de la póliza..."
                        rows={2}
                      />
                    </div>
                  </div>
                )
              })()}
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-4">Otros Costos Adicionales</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Otros Costos (No comisionables)</Label>
                  <Input
                    type="number"
                    value={costosData.otros_costos}
                    onChange={(e) => setCostosData({ ...costosData, otros_costos: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Cargos extra que se suman al costo (ej. envío de docs).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 8:
        // 1. Calcular COSTOS NETOS REALES (lo que te cuesta a ti)
        const costoNetoVuelos = vuelos.reduce((sum, v) => sum + (v.costo_total || 0), 0);
        const costoNetoHoteles = hoteles.reduce((sum, h) => sum + (h.costo_total || 0), 0);
        const costoNetoTours = tours.reduce((sum, t) => sum + (t.costo_total || 0), 0); // Asumiendo que ya calculaste el total en el paso 6
        // Si tours no tiene costo_total, usa: tours.reduce((sum, t) => sum + (t.costo_por_persona * (selectedPasajeros.length + 1)), 0)
        const costoNetoTransportes = transportaciones.reduce((sum, tr) => sum + (tr.costo_total || 0), 0);
        const costoNetoSeguros = seguroData.costo_total || 0;
        const otrosCostos = costosData.otros_costos || 0;

        const granTotalCostoNeto = costoNetoVuelos + costoNetoHoteles + costoNetoTours + costoNetoTransportes + costoNetoSeguros + otrosCostos;

        // 2. Calcular PRECIO DE VENTA FINAL (lo que paga el cliente)
        // Usamos las funciones que ya tienes que suman los totales con comisión
        const precioFinal = calcularPrecioFinal(); 

        // 3. Calcular UTILIDAD REAL
        const utilidadReal = precioFinal - granTotalCostoNeto;

        // 4. Calcular COMISIONES TOTALES (para el agente)
        const totalPasajeros = selectedPasajeros.length + 1;
        // NOTA: Asegúrate de que v.comision_vuelo sea la unitaria. Si es así, multiplícala por pasajeros.
        // Si VueloForm ya guarda la comisión TOTAL en algún campo, úsalo directamente.
        // Basado en tu último VueloForm, comision_vuelo es UNITARIA.
        const comisionVuelosTotal = vuelos.reduce((sum, v) => sum + ((v.comision_vuelo || 0) * v.cantidad_pasajeros), 0);
        
        const totalComisiones = 
          comisionVuelosTotal +
          hoteles.reduce((sum, h) => sum + (h.comision_hotel || 0), 0) +
          tours.reduce((sum, t) => sum + (t.comision_tour || 0), 0) + // Revisa si es por persona o total
          transportaciones.reduce((sum, tr) => sum + (tr.comision_transporte || 0), 0) +
          (seguroData.comision || 0) +
          comisionMonto; // La comisión extra manual del paso 7

        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Resumen del Viaje</h3>
                <p className="text-gray-700">
                  {selectedClient?.nombre} {selectedClient?.apellido}
                </p>
                <p className="text-sm text-gray-600">
                  {destinoData.origen} → {destinoData.destino} ({new Date(destinoData.fecha_salida).toLocaleDateString('es-MX')} - {new Date(destinoData.fecha_regreso).toLocaleDateString('es-MX')})
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Desglose Financiero</h3>
                <div className="space-y-2 text-sm">
                  {/* COSTOS NETOS */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Costo Vuelos:</span>
                    <span className="font-medium">${costoNetoVuelos.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Costo Hoteles:</span>
                    <span className="font-medium">${costoNetoHoteles.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Costo Tours:</span>
                    <span className="font-medium">${costoNetoTours.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Costo Transportación:</span>
                    <span className="font-medium">${costoNetoTransportes.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Costo Seguros:</span>
                    <span className="font-medium">${costoNetoSeguros.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Otros Costos:</span>
                    <span className="font-medium">${otrosCostos.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                  </div>
                  
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Costo Neto Total:</span>
                    <span>${granTotalCostoNeto.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                  </div>

                  {/* UTILIDAD */}
                  <div className="flex justify-between text-green-600 text-base pt-2">
                    <span className="font-medium">Tu Utilidad Real:</span>
                    <span className="font-bold">+${utilidadReal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                  </div>

                  {/* PRECIO FINAL */}
                  <div className="border-t-2 border-[#00D4D4] pt-3 mt-2 flex justify-between text-xl">
                    <span className="font-bold text-gray-900">Precio Final al Cliente:</span>
                    <span className="font-bold text-[#00D4D4]">${precioFinal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                  </div>
                </div>
              </div>

              {/* COMISIONES AGENTE */}
              <div className="border-t pt-4 bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                        <DollarSign className="w-5 h-5" /> Comisión Total del Agente
                    </h3>
                    <span className="font-bold text-xl text-blue-900">
                        ${totalComisiones.toLocaleString('es-MX', {minimumFractionDigits: 2})}
                    </span>
                </div>
                <p className="text-xs text-blue-600/70 mt-1">
                    Suma de todas las comisiones configuradas en cada servicio.
                </p>
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
