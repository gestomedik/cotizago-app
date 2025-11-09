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
  User, Users, MapPin, Package, FileCheck, ChevronRight, ChevronLeft,
  Search, Plus, Check, Loader2, AlertCircle, X, Plane, Ticket, Hotel,
  Bus, DollarSign, ShieldCheck, Printer
} from "lucide-react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

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
  id: number; nombre: string; apellido: string; email: string; telefono: string;
}

interface Pasajero {
  id: number; cliente_id: number; nombre: string; apellido: string;
  fecha_nacimiento: string; edad: number;
  tipo_pasajero: 'adulto' | 'nino' | 'infante';
  genero: 'masculino' | 'femenino' | 'otro';
}

interface QuotationWizardProps {
  cotizacionId?: number;
}

export function QuotationWizard({ cotizacionId }: QuotationWizardProps) {
  const router = useRouter()
  const isEditing = !!cotizacionId;

  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const [clientType, setClientType] = useState<"existing" | "new">("existing")
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [pasajeros, setPasajeros] = useState<Pasajero[]>([])
  const [selectedPasajeros, setSelectedPasajeros] = useState<number[]>([])
  const [newCliente, setNewCliente] = useState({ nombre: "", apellido: "", email: "", telefono: "", direccion: "", ciudad: "", estado: "", pais: "México", codigo_postal: "" })

  const [destinoData, setDestinoData] = useState({ origen: "", destino: "", fecha_salida: "", fecha_regreso: "", tipo_viaje: "individual" as 'individual' | 'grupo', descripcion_general: "" })

  const [vuelos, setVuelos] = useState<Vuelo[]>([])
  const [hoteles, setHoteles] = useState<HotelItem[]>([])
  const [tours, setTours] = useState<TourItem[]>([])
  const [transportes, setTransportes] = useState<TransporteItem[]>([])
  const [seguro, setSeguro] = useState<SeguroData>({ aseguradora: '', tipo_cobertura: '', costo_neto: 0, comision: 0, precio_venta: 0, precio_venta_total: 0, costo_total: 0, monto_cobertura: 0 })
  const [costosData, setCostosData] = useState({ otros_costos: 0 })
  const [comisionMonto, setComisionMonto] = useState<number>(0)
  const [mostrarFormTransporte, setMostrarFormTransporte] = useState(false)

  useEffect(() => {
    if (isEditing && cotizacionId) {
        loadCotizacionData(cotizacionId);
    } else {
        if (currentStep === 1) loadClientes();
    }
  }, [cotizacionId, isEditing]);

  useEffect(() => {
    if (selectedClient) loadPasajeros(selectedClient.id);
  }, [selectedClient]);

  const loadClientes = async () => { try { setIsLoading(true); const res = await api.clientes.list(); if (res.success) setClientes(res.data || []) } catch (err) { setError('Error al cargar clientes') } finally { setIsLoading(false) } }
  const loadPasajeros = async (id: number) => { try { setIsLoading(true); const res = await api.pasajeros.list(id); if (res.success) setPasajeros(res.data || []) } catch (err) { setError('Error al cargar pasajeros') } finally { setIsLoading(false) } }

  const loadCotizacionData = async (id: number) => {
    try {
        setIsLoading(true);
        const res = await api.cotizaciones.get(id);
        if (!res.success || !res.data) throw new Error("No se pudo cargar la cotización");
        const data = res.data;

        const clientesRes = await api.clientes.list();
        if (clientesRes.success) {
            setClientes(clientesRes.data);
            const cliente = clientesRes.data.find((c: Cliente) => c.id === data.cliente_id);
            if (cliente) {
                setSelectedClient(cliente);
                const paxRes = await api.pasajeros.list(cliente.id);
                if (paxRes.success) {
                    setPasajeros(paxRes.data);
                    if (data.pasajeros_ids && Array.isArray(data.pasajeros_ids)) {
                        setSelectedPasajeros(data.pasajeros_ids.map((pid: any) => Number(pid)));
                    } else if (data.pasajeros && Array.isArray(data.pasajeros)) {
                        setSelectedPasajeros(data.pasajeros.map((p: any) => Number(p.id)));
                    }
                }
            }
        }

        setDestinoData({
            origen: data.origen || '',
            destino: data.destino || '',
            fecha_salida: data.fecha_salida ? data.fecha_salida.split(' ')[0] : '',
            fecha_regreso: data.fecha_regreso ? data.fecha_regreso.split(' ')[0] : '',
            tipo_viaje: data.tipo_viaje || 'individual',
            descripcion_general: data.descripcion_general || ''
        });

        if (data.vuelos) setVuelos(data.vuelos.map((v: any) => ({ ...v, id: v.id.toString(), total_con_comision: Number(v.precio_venta_total), costo_total: Number(v.costo_total), comision_vuelo: Number(v.comision_vuelo), costo_unitario: Number(v.costo_unitario), tiene_escala_ida: v.tiene_escala_ida == 1, tiene_escala_regreso: v.tiene_escala_regreso == 1, incluye_equipaje_mano: v.incluye_equipaje_mano == 1, incluye_tua: v.incluye_tua == 1, incluye_equipaje_documentado: v.incluye_equipaje_documentado == 1, incluye_seleccion_asiento: v.incluye_seleccion_asiento == 1 })));
        if (data.hoteles) setHoteles(data.hoteles.map((h: any) => ({ ...h, id: h.id.toString(), nombre: h.nombre_hotel, precio_venta_total: Number(h.precio_venta_total), costo_total: Number(h.costo_total), comision_hotel: Number(h.comision_hotel), plan_alimentacion: h.plan_alimentacion || h.plan_alimenticio })));
        if (data.tours) setTours(data.tours.map((t: any) => ({ ...t, id: t.id.toString(), precio_venta_total: Number(t.precio_venta_total), costo_total: Number(t.costo_total), comision_tour: Number(t.comision_tour), precio_venta_adulto: Number(t.precio_venta_adulto), precio_venta_nino: Number(t.precio_venta_nino) })));
        //if (data.transportes) setTransportes(data.transportes.map((tr: any) => ({ ...tr, id: tr.id.toString(), tipo: tr.tipo_transporte, descripcion: tr.notas, costo_neto: Number(tr.costo_total), precio_venta: Number(tr.precio_venta_total), comision: Number(tr.comision_transporte) })));
        if (data.transportes) setTransportes(data.transportes.map((tr: any) => ({ ...tr, id: tr.id.toString(), tipo_transporte: tr.tipo_transporte, descripcion: tr.notas, capacidad_pasajeros: tr.num_pasajeros, costo_total: Number(tr.costo_total), precio_venta_total: Number(tr.precio_venta_total), comision_transporte: Number(tr.comision_transporte)})));
        if (data.seguros && data.seguros.length > 0) {
            const s = data.seguros[0];
            setSeguro({ aseguradora: s.aseguradora, tipo_cobertura: s.tipo_cobertura, monto_cobertura: Number(s.monto_cobertura), costo_neto: Number(s.costo_total), precio_venta: Number(s.precio_venta_total), costo_total: Number(s.costo_total), precio_venta_total: Number(s.precio_venta_total), comision: Number(s.comision), notas: s.notas });
        }
        setCostosData({ otros_costos: Number(data.otros_costos) || 0 });
        // Si tu BD guarda el ajuste manual de comisión, cárgalo aquí:
        // setComisionMonto(Number(data.comision_monto_extra) || 0);

    } catch (err: any) { console.error(err); setError("Error al cargar datos."); } finally { setIsLoading(false); }
  };

  const handleCreateCliente = async () => { try { setIsLoading(true); setError(null); const res = await api.clientes.create(newCliente); if (res.success) { setSelectedClient(res.data); setClientType("existing"); await loadClientes(); setCurrentStep(2); } } catch (err: any) { setError(err.message || 'Error al crear cliente'); } finally { setIsLoading(false); } }
  const handleTogglePasajero = (id: number) => { setSelectedPasajeros(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]); }

  const handleAgregarVuelo = (v: Vuelo) => setVuelos([...vuelos, v]);
  const handleEliminarVuelo = (id: string) => setVuelos(vuelos.filter(v => v.id !== id));
  const handleAgregarHotel = (h: HotelItem) => setHoteles([...hoteles, h]);
  const handleEliminarHotel = (id: string) => setHoteles(hoteles.filter(h => h.id !== id));
  const handleAgregarTour = (t: TourItem) => setTours([...tours, t]);
  const handleEliminarTour = (id: string) => setTours(tours.filter(t => t.id !== id));
  const handleAgregarTransporte = (t: TransporteItem) => { setTransportes([...transportes, t]); setMostrarFormTransporte(false); };
  const handleEliminarTransporte = (id: string) => setTransportes(transportes.filter(t => t.id !== id));

  const calcularPrecioFinal = () => {
    return vuelos.reduce((s, v) => s + (v.total_con_comision || 0), 0) + hoteles.reduce((s, h) => s + (h.precio_venta_total || 0), 0) + tours.reduce((s, t) => s + (t.precio_venta_total || 0), 0) + transportes.reduce((s, t) => s + (t.precio_venta || t.precio_venta_total || 0), 0) + (seguro.precio_venta || seguro.precio_venta_total || 0) + (costosData.otros_costos || 0) + (comisionMonto || 0);
  }
  const calcularCostoNetoTotal = () => {
    return vuelos.reduce((s, v) => s + (v.costo_total || 0), 0) + hoteles.reduce((s, h) => s + (h.costo_total || 0), 0) + tours.reduce((s, t) => s + (t.costo_total || 0), 0) + transportes.reduce((s, t) => s + (t.costo_neto || t.costo_total || 0), 0) + (seguro.costo_neto || seguro.costo_total || 0) + (costosData.otros_costos || 0);
  }

  const filteredClients = clientes.filter(c => `${c.nombre} ${c.apellido}`.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()));
  const handleNext = () => {
    if (currentStep === 1 && !selectedClient) return setError('Selecciona un cliente');
    if (currentStep === 2 && selectedPasajeros.length === 0) return setError('Selecciona pasajeros');
    if (currentStep === 3 && (!destinoData.origen || !destinoData.destino || !destinoData.fecha_salida || !destinoData.fecha_regreso)) return setError('Completa los datos del viaje');
    if (currentStep < 8) { setError(null); setCurrentStep(currentStep + 1); }
  }
  const handlePrevious = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); }

  const handleSaveCotizacion = async () => {
    if (!selectedClient) return;
    try {
      setIsLoading(true); setError(null);
      const totalPasajeros = 1 + selectedPasajeros.length;
      const paxObjs = pasajeros.filter(p => selectedPasajeros.includes(p.id));
      const costo_total_neto = calcularCostoNetoTotal();
      const precio_venta_final = calcularPrecioFinal();
      const utilidad_total = precio_venta_final - costo_total_neto;
      const monto_comision_total = vuelos.reduce((s, v) => s + ((v.comision_vuelo || 0) * (v.cantidad_pasajeros||1)), 0) + hoteles.reduce((s, h) => s + (h.comision_hotel || 0), 0) + tours.reduce((s, t) => s + (t.comision_tour || 0), 0) + transportes.reduce((s, t) => s + (t.comision || 0), 0) + (seguro.comision || 0) + comisionMonto;
      const userStr = localStorage.getItem('user');
      const agente_id = userStr ? JSON.parse(userStr).id : 1;

      const cotizacionData = {
        cliente_id: selectedClient.id, agente_id, origen: destinoData.origen, destino: destinoData.destino,
        fecha_salida: destinoData.fecha_salida, fecha_regreso: destinoData.fecha_regreso, tipo_viaje: destinoData.tipo_viaje,
        num_adultos: 1 + paxObjs.filter(p => p.tipo_pasajero === 'adulto').length,
        num_ninos: paxObjs.filter(p => p.tipo_pasajero === 'nino').length,
        num_infantes: paxObjs.filter(p => p.tipo_pasajero === 'infante').length,
        num_pasajeros_total: totalPasajeros, descripcion_general: destinoData.descripcion_general,
        costo_total: costo_total_neto, utilidad: utilidad_total, precio_venta_final, monto_comision: monto_comision_total,
        otros_costos: costosData.otros_costos || 0, estado: 'cotizacion', estado_pago: 'pendiente', paso_actual: 8, cotizacion_completa: 1,
        pasajeros_ids: selectedPasajeros,
        vuelos,
        hoteles: hoteles.map(h => ({ ...h, nombre_hotel: h.nombre, num_personas: totalPasajeros })),
        tours: tours.map(t => ({ ...t, num_personas: t.cantidad_adultos + t.cantidad_ninos })),
        transportes: transportes.map(tr => ({ tipo_transporte: tr.tipo, proveedor: tr.proveedor || '', origen: tr.origen || destinoData.origen, destino: tr.destino || destinoData.destino, fecha_servicio: destinoData.fecha_salida, num_pasajeros: tr.capacidad_pasajeros, costo_total: tr.costo_neto, precio_venta_total: tr.precio_venta, comision_transporte: tr.comision, utilidad: tr.comision, notas: tr.descripcion })),
        seguros: (seguro.precio_venta > 0) ? [{ ...seguro, costo_total: seguro.costo_neto, precio_venta_total: seguro.precio_venta, fecha_inicio: destinoData.fecha_salida, fecha_fin: destinoData.fecha_regreso, num_personas: totalPasajeros }] : []
      };

      let response;
      if (isEditing && cotizacionId) { response = await api.cotizaciones.update(cotizacionId, cotizacionData); } 
      else { response = await api.cotizaciones.create(cotizacionData); }

      if (response.success) { setShowSuccess(true); setTimeout(() => router.push('/cotizaciones'), 2000); }
      else { throw new Error(response.error || 'Error al guardar'); }
    } catch (error: any) { setError(error.message || 'Error al guardar'); } finally { setIsLoading(false); setIsSaving(false); }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return (<div className="space-y-6"><div className="flex gap-4 justify-center mb-6"><button onClick={() => setClientType("existing")} className={`px-6 py-3 rounded-lg font-medium transition-colors ${clientType === "existing" ? "bg-[#00D4D4] text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>Cliente Existente</button><button onClick={() => setClientType("new")} className={`px-6 py-3 rounded-lg font-medium transition-colors ${clientType === "new" ? "bg-[#00D4D4] text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>Nuevo Cliente</button></div>{clientType === "existing" ? (<div className="space-y-4"><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/><Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-12" placeholder="Buscar cliente por nombre o email..."/></div>{isLoading ? (<div className="flex justify-center py-12"><Loader2 className="w-10 h-10 animate-spin text-[#00D4D4]" /></div>) : (<div className="grid gap-3 max-h-96 overflow-y-auto pr-2">{filteredClients.map(c => (<button key={c.id} onClick={() => setSelectedClient(c)} className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${selectedClient?.id === c.id ? "border-[#00D4D4] bg-[#00D4D4]/5 ring-2 ring-[#00D4D4]/20" : "border-gray-100 bg-white hover:border-[#00D4D4]/30"}`}><div className="flex justify-between items-center"><div><p className="font-bold text-gray-900 text-lg">{c.nombre} {c.apellido}</p><p className="text-sm text-gray-500 flex items-center gap-2 mt-1">{c.email} {c.telefono && <span>• {c.telefono}</span>}</p></div>{selectedClient?.id === c.id && <div className="bg-[#00D4D4] rounded-full p-1"><Check className="w-4 h-4 text-white"/></div>}</div></button>))}</div>)}</div>) : (<div className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><Label>Nombre *</Label><Input value={newCliente.nombre} onChange={(e) => setNewCliente({...newCliente, nombre: e.target.value})} className="mt-1.5"/></div><div><Label>Apellido *</Label><Input value={newCliente.apellido} onChange={(e) => setNewCliente({...newCliente, apellido: e.target.value})} className="mt-1.5"/></div><div><Label>Email *</Label><Input type="email" value={newCliente.email} onChange={(e) => setNewCliente({...newCliente, email: e.target.value})} className="mt-1.5"/></div><div><Label>Teléfono</Label><Input value={newCliente.telefono} onChange={(e) => setNewCliente({...newCliente, telefono: e.target.value})} className="mt-1.5"/></div></div><Button onClick={handleCreateCliente} disabled={isLoading} className="w-full bg-[#00D4D4] hover:bg-[#00B8B8] h-12 text-lg">{isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin"/> Creando...</> : <><Plus className="w-5 h-5 mr-2"/> Crear Cliente</>}</Button></div>)}</div>)
      case 2: return (<div className="space-y-6"><div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center"><p className="text-blue-900">Seleccionando pasajeros para: <strong>{selectedClient?.nombre} {selectedClient?.apellido}</strong></p></div>{isLoading ? (<div className="flex justify-center py-12"><Loader2 className="w-10 h-10 animate-spin text-[#00D4D4]" /></div>) : pasajeros.length === 0 ? (<div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed"><Users className="w-12 h-12 mx-auto text-gray-300 mb-3"/><p className="text-gray-500">No hay pasajeros registrados para este cliente.</p></div>) : (<div className="grid gap-3 max-h-96 overflow-y-auto pr-2">{pasajeros.map(p => (<button key={p.id} onClick={() => handleTogglePasajero(p.id)} className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${selectedPasajeros.includes(p.id) ? "border-[#00D4D4] bg-[#00D4D4]/5 ring-2 ring-[#00D4D4]/20" : "border-gray-100 bg-white hover:border-[#00D4D4]/30"}`}><div className="flex justify-between items-center"><div><p className="font-bold text-gray-900">{p.nombre} {p.apellido}</p><p className="text-sm text-gray-500 mt-1 capitalize flex items-center gap-2"><span className={`px-2 py-0.5 rounded-full text-xs ${p.tipo_pasajero === 'adulto' ? 'bg-blue-100 text-blue-700' : p.tipo_pasajero === 'nino' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{p.tipo_pasajero}</span> • {p.edad} años</p></div>{selectedPasajeros.includes(p.id) && <div className="bg-[#00D4D4] rounded-full p-1"><Check className="w-4 h-4 text-white"/></div>}</div></button>))}</div>)}<div className="flex justify-between items-center bg-gray-900 text-white p-4 rounded-xl"><span>Total Viajeros:</span><span className="font-bold text-xl"><span className="text-[#00D4D4]">1</span> (Cliente) + <span className="text-[#00D4D4]">{selectedPasajeros.length}</span> (Acompañantes) = {1 + selectedPasajeros.length}</span></div></div>)
      case 3: return (<div className="space-y-6"><div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><Label className="mb-1.5 block">Origen *</Label><div className="relative"><MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><Input value={destinoData.origen} onChange={e => setDestinoData({...destinoData, origen: e.target.value})} className="pl-10 h-11" placeholder="Ciudad de origen"/></div></div><div><Label className="mb-1.5 block">Destino Principal *</Label><div className="relative"><MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#00D4D4]"/><Input value={destinoData.destino} onChange={e => setDestinoData({...destinoData, destino: e.target.value})} className="pl-10 h-11 border-[#00D4D4]/50" placeholder="Ciudad destino"/></div></div></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div><Label className="mb-1.5 block">Fecha de Salida *</Label><Input type="date" value={destinoData.fecha_salida} onChange={e => setDestinoData({...destinoData, fecha_salida: e.target.value})} className="h-11"/></div><div><Label className="mb-1.5 block">Fecha de Regreso *</Label><Input type="date" value={destinoData.fecha_regreso} onChange={e => setDestinoData({...destinoData, fecha_regreso: e.target.value})} className="h-11"/></div><div><Label className="mb-1.5 block">Tipo de Viaje</Label><select value={destinoData.tipo_viaje} onChange={e => setDestinoData({...destinoData, tipo_viaje: e.target.value as any})} className="w-full h-11 px-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#00D4D4] outline-none"><option value="individual">Individual / Familiar</option><option value="grupo">Grupo</option><option value="luna_miel">Luna de Miel</option><option value="boda">Boda Destino</option></select></div></div><div><Label className="mb-1.5 block">Notas / Descripción General</Label><Textarea value={destinoData.descripcion_general} onChange={e => setDestinoData({...destinoData, descripcion_general: e.target.value})} placeholder="Requerimientos especiales, motivo del viaje..." rows={4} className="resize-none"/></div></div></div>)
      case 4: { const totalPax = 1 + selectedPasajeros.length; return (<div className="space-y-6"><div className="flex justify-between items-center mb-4"><h3 className="font-semibold text-lg">Vuelos ({totalPax} pax)</h3><div className="text-right"><p className="text-sm text-gray-500">Total Cotización</p><p className="text-2xl font-bold text-[#00D4D4]">${calcularPrecioFinal().toLocaleString('es-MX', {minimumFractionDigits: 2})}</p></div></div><VuelosLista vuelos={vuelos} onEliminar={handleEliminarVuelo} /><div className="mt-6"><VueloForm onAgregar={handleAgregarVuelo} onCancelar={() => {}} numPasajeros={totalPax} defaultOrigen={destinoData.origen} defaultDestino={destinoData.destino} fechaInicioViaje={destinoData.fecha_salida} fechaFinViaje={destinoData.fecha_regreso} /></div></div>) }
      case 5: { return (<div className="space-y-6"><div className="flex justify-between items-center mb-4"><h3 className="font-semibold text-lg">Hospedaje</h3><div className="text-right"><p className="text-sm text-gray-500">Total Cotización</p><p className="text-2xl font-bold text-[#00D4D4]">${calcularPrecioFinal().toLocaleString('es-MX', {minimumFractionDigits: 2})}</p></div></div><HotelesLista hoteles={hoteles} onEliminar={handleEliminarHotel} /><div className="mt-6"><HotelForm onAgregar={handleAgregarHotel} onCancelar={() => {}} defaultDestino={destinoData.destino} defaultCheckin={destinoData.fecha_salida} defaultCheckout={destinoData.fecha_regreso} /></div></div>) }
      case 6: { const totalPax = 1 + selectedPasajeros.length; const paxObjs = pasajeros.filter(p => selectedPasajeros.includes(p.id)); return (<div className="space-y-6"><div className="flex justify-between items-center mb-4"><h3 className="font-semibold text-lg">Tours y Actividades</h3><div className="text-right"><p className="text-sm text-gray-500">Total Cotización</p><p className="text-2xl font-bold text-[#00D4D4]">${calcularPrecioFinal().toLocaleString('es-MX', {minimumFractionDigits: 2})}</p></div></div><ToursLista tours={tours} onEliminar={handleEliminarTour} /><div className="mt-6"><TourForm onAgregar={handleAgregarTour} onCancelar={() => {}} defaultUbicacion={destinoData.destino} defaultFecha={destinoData.fecha_salida} defaultNumAdultos={1 + paxObjs.filter(p => p.tipo_pasajero === 'adulto').length} defaultNumNinos={paxObjs.filter(p => p.tipo_pasajero !== 'adulto').length} /></div></div>) }
      case 7: { const totalPax = 1 + selectedPasajeros.length; return (<div className="space-y-8"><div className="flex justify-between items-center border-b pb-4"><h3 className="font-semibold text-xl">Otros Servicios</h3><div className="text-right"><p className="text-sm text-gray-500">Total Cotización</p><p className="text-2xl font-bold text-[#00D4D4]">${calcularPrecioFinal().toLocaleString('es-MX', {minimumFractionDigits: 2})}</p></div></div><div><div className="flex justify-between items-center mb-4"><h4 className="font-medium text-gray-700 flex items-center gap-2"><Bus className="w-5 h-5 text-[#00D4D4]"/> Transportación</h4>{!mostrarFormTransporte && (<Button onClick={() => setMostrarFormTransporte(true)} variant="outline" size="sm" className="text-[#00D4D4] border-[#00D4D4] hover:bg-[#00D4D4]/10"><Plus className="w-4 h-4 mr-1"/> Agregar</Button>)}</div><TransportesLista items={transportes} onEliminar={handleEliminarTransporte} />{mostrarFormTransporte && (<TransporteForm onAgregar={handleAgregarTransporte} onCancelar={() => setMostrarFormTransporte(false)} defaultOrigen={destinoData.origen} defaultDestino={destinoData.destino} numPasajeros={totalPax} />)}</div><div className="border-t pt-8"><SeguroForm data={seguro} onChange={setSeguro} /></div><div className="border-t pt-6 bg-gray-50 p-4 rounded-xl"><h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2"><DollarSign className="w-5 h-5 text-gray-500"/> Ajustes Finales</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><Label>Otros Costos (No comisionables)</Label><Input type="number" min="0" step="0.01" placeholder="0.00" value={costosData.otros_costos || ''} onChange={e => setCostosData({ otros_costos: parseFloat(e.target.value) || 0 })} className="bg-white mt-1.5"/><p className="text-xs text-gray-500 mt-1">Cargos extra que se suman al costo neto.</p></div><div><Label>Ajuste de Comisión (Manual)</Label><Input type="number" min="0" step="0.01" placeholder="0.00" value={comisionMonto || ''} onChange={e => setComisionMonto(parseFloat(e.target.value) || 0)} className="bg-white mt-1.5 border-green-200 focus-visible:ring-green-500"/><p className="text-xs text-gray-500 mt-1">Monto extra a sumar a tu ganancia final.</p></div></div></div></div>) }

      case 8: {
        const paxObjs = pasajeros.filter(p => selectedPasajeros.includes(p.id));
        const numAdultos = 1 + paxObjs.filter(p => p.tipo_pasajero === 'adulto').length;
        const numNinos = paxObjs.filter(p => p.tipo_pasajero === 'nino' || p.tipo_pasajero === 'infante').length;
        const precioFinal = calcularPrecioFinal();
        
        //const totalComisionVuelos = vuelos.reduce((sum, v) => sum + ((v.comision_vuelo || 0) * v.cantidad_pasajeros), 0);
        //const totalComisionHoteles = hoteles.reduce((sum, h) => sum + (h.comision_hotel || 0), 0);
        //const totalComisionTours = tours.reduce((sum, t) => sum + (t.comision_tour || 0), 0);
        //const totalComisionTransportes = transportes.reduce((sum, t) => sum + (t.comision_transporte || 0), 0);
        //const totalComisionSeguro = seguro.comision || 0;
        const totalComisionVuelos = vuelos.reduce((sum, v) => sum + ((Number(v.comision_vuelo) || 0) * (v.cantidad_pasajeros || 1)), 0);
        const totalComisionHoteles = hoteles.reduce((sum, h) => sum + (Number(h.comision_hotel) || 0), 0);
        const totalComisionTours = tours.reduce((sum, t) => sum + (Number(t.comision_tour) || 0), 0);
        const totalComisionTransportes = transportes.reduce((sum, t) => sum + (Number(t.comision_transporte) || Number(t.comision) || 0), 0);
        const totalComisionSeguro = Number(seguro.comision) || 0;
        const totalComisionExtra = Number(comisionMonto) || 0;
        
        const totalComisiones = totalComisionVuelos + totalComisionHoteles + totalComisionTours + totalComisionTransportes + totalComisionSeguro + comisionMonto;
        const porcentajeUtilidad = precioFinal > 0 ? (totalComisiones / precioFinal) * 100 : 0;

        return (
          <div className="space-y-8 bg-slate-50 p-6 rounded-xl" id="printable-area">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center border-b pb-4 mb-6">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><FileCheck className="w-6 h-6 text-[#00D4D4]"/> Resumen de la Cotización</h3>
                  <Button onClick={() => window.print()} variant="outline" className="no-print flex gap-2 items-center border-[#00D4D4] text-[#00D4D4] hover:bg-[#00D4D4]/10"><Printer className="w-4 h-4"/> Imprimir / PDF</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div><h4 className="font-bold text-xs text-slate-400 uppercase mb-2 flex items-center gap-1"><User className="w-3.5 h-3.5"/> Cliente</h4><div className="text-lg font-bold text-slate-900">{selectedClient?.nombre} {selectedClient?.apellido}</div><div className="text-sm text-slate-500">{selectedClient?.email}</div></div>
                <div><h4 className="font-bold text-xs text-slate-400 uppercase mb-2 flex items-center gap-1"><Users className="w-3.5 h-3.5"/> Pasajeros ({1 + selectedPasajeros.length})</h4><div className="flex gap-3"><span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{numAdultos} Adultos</span>{numNinos > 0 && <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">{numNinos} Menores</span>}</div></div>
                <div><h4 className="font-bold text-xs text-slate-400 uppercase mb-2 flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> Viaje</h4><div className="font-bold text-slate-900">{destinoData.origen} → {destinoData.destino}</div><div className="text-sm text-slate-500 mt-1">{new Date(destinoData.fecha_salida).toLocaleDateString('es-MX')} - {new Date(destinoData.fecha_regreso).toLocaleDateString('es-MX')}</div></div>
              </div>
            </div>

            <div className="space-y-6">
              {vuelos.length > 0 && (<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"><h5 className="font-bold text-slate-700 mb-4 flex items-center justify-between"><span className="flex items-center gap-2"><Plane className="w-5 h-5 text-[#00D4D4]"/> Vuelos</span><span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">Comisión Total: ${totalComisionVuelos.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span></h5><div className="space-y-4">{vuelos.map((v, i) => (<div key={i} className="text-sm border-l-4 border-[#00D4D4] pl-4 py-3 bg-slate-50 rounded-r-lg"><div className="flex justify-between items-start mb-2"><div><span className="font-bold text-base text-slate-900">{v.aerolinea}</span><span className="text-slate-500 ml-2">({v.tipo_vuelo} • {v.cantidad_pasajeros} pax)</span></div><div className="text-right"><p className="font-bold text-slate-900">${v.total_con_comision?.toLocaleString('es-MX', {minimumFractionDigits: 2})}</p><p className="text-xs text-green-600 font-medium">+${(v.comision_vuelo * v.cantidad_pasajeros).toLocaleString('es-MX', {minimumFractionDigits: 2})} com.</p></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-600"><div>🛫 <strong>IDA:</strong> {new Date(v.fecha_salida).toLocaleDateString('es-MX', {day: '2-digit', month: 'short'})} • {v.hora_salida} → {v.hora_llegada}</div>{v.tipo_vuelo === 'redondo' && v.fecha_regreso && <div>🛬 <strong>REGRESO:</strong> {new Date(v.fecha_regreso).toLocaleDateString('es-MX', {day: '2-digit', month: 'short'})} • {v.hora_regreso} → {v.hora_regreso_llegada}</div>}</div></div>))}</div></div>)}
              {hoteles.length > 0 && (<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"><h5 className="font-bold text-slate-700 mb-4 flex items-center justify-between"><span className="flex items-center gap-2"><Hotel className="w-5 h-5 text-[#00D4D4]"/> Hospedaje</span><span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">Comisión Total: ${totalComisionHoteles.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span></h5><div className="space-y-3">{hoteles.map((h, i) => (<div key={i} className="flex justify-between items-center text-sm border-b border-slate-100 pb-3"><div><p className="font-bold text-base text-slate-900">{h.nombre}</p><p className="text-slate-600">{h.num_habitaciones} hab. <strong>{h.tipo_habitacion}</strong> ({h.plan_alimentacion.replace('_', ' ')})</p><p className="text-xs text-slate-500">{new Date(h.fecha_checkin).toLocaleDateString('es-MX', {day: 'numeric', month: 'short'})} - {new Date(h.fecha_checkout).toLocaleDateString('es-MX', {day: 'numeric', month: 'short'})} ({h.num_noches} noches)</p></div><div className="text-right min-w-[120px]"><p className="font-bold text-slate-900">${h.precio_venta_total.toLocaleString('es-MX', {minimumFractionDigits: 2})}</p><p className="text-xs text-green-600 font-medium">+${h.comision_hotel.toLocaleString('es-MX', {minimumFractionDigits: 2})} com.</p></div></div>))}</div></div>)}
              {tours.length > 0 && (<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"><h5 className="font-bold text-slate-700 mb-4 flex items-center justify-between"><span className="flex items-center gap-2"><Ticket className="w-5 h-5 text-[#00D4D4]"/> Tours</span><span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">Comisión Total: ${totalComisionTours.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span></h5><div className="space-y-3">{tours.map((t, i) => (<div key={i} className="flex justify-between items-center text-sm border-b border-slate-100 pb-3"><div><p className="font-bold text-base text-slate-900">{t.nombre_tour}</p><p className="text-slate-600 flex items-center gap-2">📅 {new Date(t.fecha_tour).toLocaleDateString('es-MX', {day: 'numeric', month: 'long', year: 'numeric'})} {t.hora_inicio && <span>• ⏰ {t.hora_inicio}</span>}</p><p className="text-xs text-slate-500">({t.cantidad_adultos} Adultos, {t.cantidad_ninos} Niños)</p></div><div className="text-right min-w-[120px]"><p className="font-bold text-slate-900">${t.precio_venta_total.toLocaleString('es-MX', {minimumFractionDigits: 2})}</p><p className="text-xs text-green-600 font-medium">+${t.comision_tour.toLocaleString('es-MX', {minimumFractionDigits: 2})} com.</p></div></div>))}</div></div>)}
              {(transportes.length > 0 || seguro.precio_venta > 0 || costosData.otros_costos > 0 || comisionMonto > 0) && (
                 <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h5 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-[#00D4D4]"/> Otros Servicios</h5>
                    <div className="space-y-3 text-sm">
                        {transportes.map((tr, i) => (
                            <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-2"><div><span className="font-medium flex items-center gap-1"><Bus className="w-3.5 h-3.5 text-slate-400"/> {tr.tipo_transporte}</span><span className="text-slate-500 text-xs ml-5">{tr.descripcion}</span></div><div className="text-right"><span className="font-bold">${(tr.precio_venta || 0).toLocaleString('es-MX', {minimumFractionDigits: 2})}</span><span className="text-green-600 text-xs ml-2">(+${(tr.comision || 0).toLocaleString('es-MX', {minimumFractionDigits: 2})})</span></div></div>
                        ))}
                        {seguro.precio_venta > 0 && (
                            <div className="flex justify-between items-center border-b border-slate-50 pb-2"><div><span className="font-medium flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-slate-400"/> Seguro: {seguro.aseguradora}</span><span className="text-slate-500 text-xs ml-5">{seguro.tipo_cobertura}</span></div><div className="text-right"><span className="font-bold">${seguro.precio_venta.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span><span className="text-green-600 text-xs ml-2">(+${seguro.comision.toLocaleString('es-MX', {minimumFractionDigits: 2})})</span></div></div>
                        )}
                         {costosData.otros_costos > 0 && (<div className="flex justify-between items-center pt-2"><span className="font-medium text-slate-500">Otros Costos/Ajustes</span><span className="font-bold">${costosData.otros_costos.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span></div>)}
                         {comisionMonto > 0 && (<div className="flex justify-between items-center pt-2 text-green-700"><span className="font-medium">Ajuste Comisión Extra</span><span className="font-bold">+${comisionMonto.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span></div>)}
                    </div>
                 </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="bg-slate-800 p-6 rounded-xl text-white shadow-lg flex flex-col justify-between"><div><p className="text-slate-400 text-sm font-bold mb-1 uppercase tracking-wider">Precio Final al Cliente</p><p className="text-4xl font-bold text-[#00D4D4]">${precioFinal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</p></div><p className="text-xs text-slate-500 mt-4">Total a cobrar incluyendo todos los servicios.</p></div>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm flex flex-col justify-between"><div><p className="text-blue-700 text-sm font-bold mb-1 uppercase tracking-wider flex items-center gap-1"><DollarSign className="w-4 h-4"/> Comisiones Totales</p><p className="text-3xl font-bold text-blue-900">${totalComisiones.toLocaleString('es-MX', {minimumFractionDigits: 2})}</p></div><p className="text-xs text-blue-600/70 mt-4">Suma de todas tus ganancias.</p></div>
                <div className={`p-6 rounded-xl border shadow-sm flex flex-col justify-between ${porcentajeUtilidad >= 10 ? 'bg-green-50 border-green-100' : 'bg-yellow-50 border-yellow-100'}`}><div><p className={`text-sm font-bold mb-1 uppercase tracking-wider ${porcentajeUtilidad >= 10 ? 'text-green-700' : 'text-yellow-700'}`}>% de Utilidad</p><p className={`text-3xl font-bold ${porcentajeUtilidad >= 10 ? 'text-green-600' : 'text-yellow-600'}`}>{porcentajeUtilidad.toFixed(1)}%</p></div><p className={`text-xs mt-4 ${porcentajeUtilidad >= 10 ? 'text-green-600/70' : 'text-yellow-600/70'}`}>Margen de ganancia sobre el precio final.</p></div>
            </div>
          </div>
        )
      }
      default: return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title={isEditing ? `Editar Cotización #${cotizacionId}` : "Nueva Cotización"} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            {error && <div className="mb-6 bg-red-50 p-4 rounded-lg text-red-800 flex justify-between"><p>{error}</p><X className="cursor-pointer" onClick={() => setError(null)}/></div>}
            <Card className="p-8 shadow-md border-0">
              <div className="mb-10 flex justify-between relative">{steps.map((s,i)=><div key={s.id} className="flex flex-col items-center z-10"><div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep===s.id?"bg-[#00D4D4] border-[#00D4D4] text-white shadow-md scale-110":currentStep>s.id?"bg-green-500 border-green-500 text-white":"bg-white border-gray-300 text-gray-400"}`}>{currentStep>s.id?<Check className="w-5 h-5"/>:<s.icon className="w-5 h-5"/>}</div><span className={`text-xs mt-2 font-medium ${currentStep===s.id?"text-[#00D4D4]":currentStep>s.id?"text-green-600":"text-gray-500"}`}>{s.name}</span></div>)}<div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10 mx-10"></div></div>
              {renderStepContent()}
              <div className="flex justify-between mt-10 pt-6 border-t"><Button onClick={handlePrevious} variant="outline" disabled={currentStep===1} className={`${currentStep===1?'invisible':''} px-6`}><ChevronLeft className="w-4 h-4 mr-2"/> Anterior</Button>{currentStep<8?(<Button onClick={handleNext} className="bg-[#00D4D4] hover:bg-[#00B8B8] px-6">Siguiente <ChevronRight className="w-4 h-4 ml-2"/></Button>):(<Button onClick={handleSaveCotizacion} className="bg-green-600 hover:bg-green-700 px-8 py-6 text-lg" disabled={isSaving}>{isSaving?<><Loader2 className="w-5 h-5 mr-2 animate-spin"/> Guardando...</>:<><Check className="w-5 h-5 mr-2"/> {isEditing?'Actualizar':'Finalizar y Guardar'}</>}</Button>)}</div>
            </Card>
          </div>
        </main>
      </div>
      {showSuccess && <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"><Card className="p-10 text-center shadow-2xl scale-105"><Check className="w-16 h-16 text-green-600 mx-auto mb-4"/><h3 className="text-3xl font-bold">¡Éxito!</h3></Card></div>}
    </div>
  )
}