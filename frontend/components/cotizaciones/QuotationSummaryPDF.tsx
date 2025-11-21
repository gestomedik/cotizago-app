import React from 'react'
import { Plane, Hotel, Ticket, Bus, ShieldCheck, MapPin, Users, User, Calendar } from 'lucide-react'

interface Cliente {
    nombre: string
    apellido: string
    email: string
    telefono: string
}

interface Pasajero {
    nombre: string
    apellido: string
    tipo_pasajero: 'adulto' | 'nino' | 'infante'
}

interface Vuelo {
    aerolinea: string
    tipo_vuelo: 'sencillo' | 'redondo'
    fecha_salida: string
    hora_salida: string
    hora_llegada: string
    fecha_regreso?: string
    hora_regreso?: string
    hora_regreso_llegada?: string
    cantidad_pasajeros: number
    total_con_comision: number
    tiene_escala_ida: boolean
    tiene_escala_regreso: boolean
}

interface HotelItem {
    nombre: string
    tipo_habitacion: string
    num_habitaciones: number
    plan_alimentacion: string
    fecha_checkin: string
    fecha_checkout: string
    num_noches: number
    precio_venta_total: number
}

interface TourItem {
    nombre_tour: string
    fecha_tour: string
    hora_inicio?: string
    cantidad_adultos: number
    cantidad_ninos: number
    precio_venta_total: number
}

interface TransporteItem {
    tipo_transporte: string
    descripcion: string
    precio_venta: number
}

interface SeguroData {
    aseguradora: string
    tipo_cobertura: string
    precio_venta: number
}

interface QuotationSummaryPDFProps {
    cliente: Cliente
    pasajeros: Pasajero[]
    selectedPasajeros: number[]
    allPasajeros: any[]
    vuelos: Vuelo[]
    hoteles: HotelItem[]
    tours: TourItem[]
    transportes: TransporteItem[]
    seguro: SeguroData
    destinoData: {
        origen: string
        destino: string
        fecha_salida: string
        fecha_regreso: string
    }
    precioFinal: number
    agenciaInfo?: {
        nombre?: string
        telefono?: string
        email?: string
        direccion?: string
    }
}

export function QuotationSummaryPDF({
    cliente,
    pasajeros,
    selectedPasajeros,
    allPasajeros,
    vuelos,
    hoteles,
    tours,
    transportes,
    seguro,
    destinoData,
    precioFinal,
    agenciaInfo = {}
}: QuotationSummaryPDFProps) {
    const selectedPax = allPasajeros.filter(p => selectedPasajeros.includes(p.id))
    const numAdultos = 1 + selectedPax.filter(p => p.tipo_pasajero === 'adulto').length
    const numNinos = selectedPax.filter(p => p.tipo_pasajero !== 'adulto').length

    // Calcular días del viaje
    const fechaSalida = new Date(destinoData.fecha_salida)
    const fechaRegreso = new Date(destinoData.fecha_regreso)
    const diasViaje = Math.ceil((fechaRegreso.getTime() - fechaSalida.getTime()) / (1000 * 60 * 60 * 24))

    return (
        <div className="bg-white" style={{ width: '210mm', minHeight: '297mm', padding: '20mm', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {/* Header con Logo y Título */}
            <div className="mb-8 pb-6 border-b-2 border-[#00D4D4]">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-[#00D4D4] mb-2">
                            {agenciaInfo.nombre || 'CotizaGO'}
                        </h1>
                        <p className="text-gray-600 text-sm">Agencia de Viajes</p>
                        {agenciaInfo.telefono && (
                            <p className="text-gray-600 text-sm">Tel: {agenciaInfo.telefono}</p>
                        )}
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">Presupuesto de viaje</h2>
                        <p className="text-sm text-gray-500">
                            Fecha: {new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Información del Paquete */}
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#e6f9f9', border: '2px solid #00D4D4' }}>
                <h3 className="font-bold text-xl text-gray-800 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#00D4D4]" />
                    Paquete: {destinoData.origen} → {destinoData.destino}
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500 font-medium">Llegada</p>
                        <p className="font-bold text-gray-800">
                            {new Date(destinoData.fecha_salida).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Salida</p>
                        <p className="font-bold text-gray-800">
                            {new Date(destinoData.fecha_regreso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Duración</p>
                        <p className="font-bold text-gray-800">{diasViaje} noches</p>
                    </div>
                </div>
            </div>

            {/* Tabla de Pasajeros */}
            <div className="mb-6">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-gray-800">
                    <Users className="w-5 h-5 text-[#00D4D4]" />
                    Pasajeros
                </h4>
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Habitación</th>
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Tipo</th>
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Pasajero</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2">1</td>
                            <td className="border border-gray-300 px-3 py-2">
                                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                    Adulto
                                </span>
                            </td>
                            <td className="border border-gray-300 px-3 py-2 font-medium">
                                {cliente.nombre} {cliente.apellido}
                            </td>
                        </tr>
                        {selectedPax.map((pax, idx) => (
                            <tr key={idx}>
                                <td className="border border-gray-300 px-3 py-2">{Math.floor(idx / 2) + 1}</td>
                                <td className="border border-gray-300 px-3 py-2">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${pax.tipo_pasajero === 'adulto' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                                        }`}>
                                        {pax.tipo_pasajero === 'adulto' ? 'Adulto' : 'Menor'}
                                    </span>
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                    {pax.nombre} {pax.apellido}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Vuelos Detallados */}
            {vuelos.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-gray-800">
                        <Plane className="w-5 h-5 text-[#00D4D4]" />
                        Vuelos (incluye TUA)
                    </h4>
                    {vuelos.map((vuelo, idx) => (
                        <div key={idx} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                <span className="font-bold text-gray-800">{vuelo.aerolinea}</span>
                                <span className="text-gray-600 ml-2">• {vuelo.cantidad_pasajeros} pasajeros</span>
                            </div>
                            <div className="p-4">
                                {/* IDA */}
                                <div className="mb-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-[#00D4D4] text-white px-2 py-1 rounded text-xs font-bold">IDA</div>
                                        <span className="text-sm text-gray-600">
                                            {new Date(vuelo.fecha_salida).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-800">{destinoData.origen}</div>
                                            <div className="text-gray-600">{vuelo.hora_salida}</div>
                                        </div>
                                        <div className="text-gray-400">→</div>
                                        <div className="flex-1 text-right">
                                            <div className="font-bold text-gray-800">{destinoData.destino}</div>
                                            <div className="text-gray-600">{vuelo.hora_llegada}</div>
                                        </div>
                                    </div>
                                    {vuelo.tiene_escala_ida && (
                                        <p className="text-xs text-orange-600 mt-1">⚠ Incluye escala</p>
                                    )}
                                </div>

                                {/* REGRESO */}
                                {vuelo.tipo_vuelo === 'redondo' && vuelo.fecha_regreso && (
                                    <div className="pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">REGRESO</div>
                                            <span className="text-sm text-gray-600">
                                                {new Date(vuelo.fecha_regreso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex-1">
                                                <div className="font-bold text-gray-800">{destinoData.destino}</div>
                                                <div className="text-gray-600">{vuelo.hora_regreso || 'N/A'}</div>
                                            </div>
                                            <div className="text-gray-400">→</div>
                                            <div className="flex-1 text-right">
                                                <div className="font-bold text-gray-800">{destinoData.origen}</div>
                                                <div className="text-gray-600">{vuelo.hora_regreso_llegada || 'N/A'}</div>
                                            </div>
                                        </div>
                                        {vuelo.tiene_escala_regreso && (
                                            <p className="text-xs text-orange-600 mt-1">⚠ Incluye escala</p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="bg-gray-50 px-4 py-2 text-right font-bold text-gray-800">
                                ${vuelo.total_con_comision.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Hoteles */}
            {hoteles.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-gray-800">
                        <Hotel className="w-5 h-5 text-[#00D4D4]" />
                        Hospedaje
                    </h4>
                    {hoteles.map((hotel, idx) => (
                        <div key={idx} className="mb-2 border border-gray-200 rounded p-3">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <p className="font-bold text-gray-800">{hotel.nombre}</p>
                                    <p className="text-sm text-gray-600">
                                        {hotel.num_habitaciones} hab. {hotel.tipo_habitacion} • {hotel.plan_alimentacion.replace('_', ' ')}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(hotel.fecha_checkin).toLocaleDateString('es-MX')} - {new Date(hotel.fecha_checkout).toLocaleDateString('es-MX')} ({hotel.num_noches} noches)
                                    </p>
                                </div>
                                <div className="text-right font-bold text-gray-800">
                                    ${hotel.precio_venta_total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tours */}
            {tours.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-gray-800">
                        <Ticket className="w-5 h-5 text-[#00D4D4]" />
                        Tours y Actividades
                    </h4>
                    {tours.map((tour, idx) => (
                        <div key={idx} className="mb-2 border border-gray-200 rounded p-3 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-gray-800">{tour.nombre_tour}</p>
                                <p className="text-sm text-gray-600">
                                    {new Date(tour.fecha_tour).toLocaleDateString('es-MX')} {tour.hora_inicio && `• ${tour.hora_inicio}`}
                                </p>
                            </div>
                            <div className="font-bold text-gray-800">
                                ${tour.precio_venta_total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Total */}
            <div className="mt-8 pt-6 border-t-2 border-gray-300">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-gray-600 text-sm">Total Pesos</p>
                        <p className="text-xs text-gray-500 mt-1">No incluye gastos extras como propinas o extras personales.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-[#00D4D4]">
                            $ {precioFinal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer - Información de Contacto */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
                <h5 className="font-bold text-gray-800 mb-2">Cómo hacer tu reservación</h5>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-semibold">Por correo:</p>
                        <p>{agenciaInfo.email || 'contacto@cotizago.com'}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Por teléfono:</p>
                        <p>{agenciaInfo.telefono || '81 1234 5678'}</p>
                    </div>
                </div>
                {agenciaInfo.direccion && (
                    <p className="mt-3 text-xs">{agenciaInfo.direccion}</p>
                )}
                <p className="mt-4 text-xs text-gray-500">
                    Este presupuesto es válido hasta la confirmación y está sujeto a disponibilidad.
                </p>
            </div>
        </div>
    )
}
