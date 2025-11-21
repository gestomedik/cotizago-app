'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Download, Printer, Share2, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import Image from 'next/image';

interface Cotizacion {
    id: number;
    folio: string;
    cliente_id: number;
    cliente_nombre: string;
    cliente_apellido: string;
    cliente_email: string;
    cliente_telefono: string;
    agente_nombre: string;
    destino: string;
    origen: string;
    fecha_salida: string;
    fecha_regreso: string;
    num_noches: number;
    num_adultos: number;
    num_ninos: number;
    num_infantes: number;
    num_pasajeros_total: number;
    descripcion_general: string;
    precio_venta_final: number;
    costo_total: number;
    utilidad: number;
    estado: string;
    fecha_creacion: string;
    vuelos?: any[];
    hoteles?: any[];
    tours?: any[];
    transportes?: any[];
    seguros?: any[];
}

export default function CotizacionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        // Get current user from localStorage
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    setCurrentUser(JSON.parse(userStr));
                } catch (e) {
                    console.error('Error parsing user:', e);
                }
            }
        }

        if (params.id) {
            fetchCotizacion();
        }
    }, [params.id]);

    const fetchCotizacion = async () => {
        try {
            setIsLoading(true);
            const response = await api.cotizaciones.get(Number(params.id));

            if (response.success) {
                setCotizacion(response.data);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar la cotización');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExportPDF = async () => {
        // Implementaremos esto después con jsPDF
        alert('Funcionalidad de exportación PDF próximamente');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#00D4D4] mx-auto mb-4" />
                    <p className="text-gray-600">Cargando cotización...</p>
                </div>
            </div>
        );
    }

    if (!cotizacion) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Cotización no encontrada</p>
                    <Button onClick={() => router.push('/cotizaciones')} variant="outline">
                        Volver a cotizaciones
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Action Bar - Hidden on print */}
            <div className="bg-white border-b border-gray-200 print:hidden sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            onClick={() => router.push('/cotizaciones')}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver
                        </Button>

                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handlePrint}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Printer className="w-4 h-4" />
                                Imprimir
                            </Button>
                            <Button
                                onClick={handleExportPDF}
                                className="flex items-center gap-2 bg-[#00D4D4] hover:bg-[#00B8B8]"
                            >
                                <Download className="w-4 h-4" />
                                Exportar PDF
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8 flex items-start gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Image
                            src="/images/logo-experiencias-la-silla.png"
                            alt="Experiencias la Silla Logo"
                            width={200}
                            height={150}
                            className="object-contain"
                        />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 text-right">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Experiencias la Silla - Agencia de Viajes</h2>
                        <p className="text-xl font-bold text-[#FF4D8D] mb-2">81 1529 4248</p>
                        <p className="text-sm text-gray-600">
                            Asesor de viaje: {currentUser ? `${currentUser.nombre} ${currentUser.apellido}` : cotizacion.agente_nombre}, {' '}
                            {new Date().toLocaleDateString('es-MX')} {new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </p>
                    </div>
                </div>

                {/* Package Information */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Paquete: {cotizacion.origen} - {cotizacion.destino}
                    </h3>
                    {
                        cotizacion.hoteles && cotizacion.hoteles.length > 0 && (
                            <p className="text-gray-700">
                                ★ Habitación en Hotel {cotizacion.hoteles[0].nombre_hotel}
                            </p>
                        )
                    }
                </div>

                {/* Featured Section - Hotel Image and Trip Details */}
                <div className="mb-6 grid grid-cols-3 gap-6">
                    {/* Hotel Image */}
                    <div className="relative h-48 rounded-lg overflow-hidden bg-gray-200">
                        {cotizacion.hoteles && cotizacion.hoteles.length > 0 && cotizacion.hoteles[0].imagen_url ? (
                            <Image
                                src={cotizacion.hoteles[0].imagen_url}
                                alt={cotizacion.hoteles[0].nombre_hotel}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center">
                                <p className="text-white text-2xl font-bold">{cotizacion.destino}</p>
                            </div>
                        )}
                    </div>

                    {/* Trip Details */}
                    <div className="col-span-2 h-48 flex flex-col justify-center space-y-4 bg-gray-50 p-6 rounded-lg">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Llegada</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {new Date(cotizacion.fecha_salida).toLocaleDateString('es-MX', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Salida</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {new Date(cotizacion.fecha_regreso).toLocaleDateString('es-MX', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Duración</p>
                            <p className="text-lg font-semibold text-gray-900">{cotizacion.num_noches} noches</p>
                        </div>
                    </div>
                </div>

                {/* Room and Passenger Information */}
                <div className="mb-6 grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                    {/* Number of Rooms */}
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Habitaciones</p>
                        <p className="font-semibold text-gray-900">
                            {cotizacion.hoteles && cotizacion.hoteles.length > 0 ? cotizacion.hoteles.length : 1}
                            {' '}{(cotizacion.hoteles && cotizacion.hoteles.length > 1) ? 'Habitaciones' : 'Habitación'}
                        </p>
                    </div>

                    {/* Number of Passengers */}
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Pasajeros</p>
                        <p className="font-semibold text-gray-900">
                            {cotizacion.num_adultos} {cotizacion.num_adultos === 1 ? 'Adulto' : 'Adultos'}
                            {cotizacion.num_ninos > 0 && `, ${cotizacion.num_ninos} ${cotizacion.num_ninos === 1 ? 'Niño' : 'Niños'}`}
                            {cotizacion.num_infantes > 0 && `, ${cotizacion.num_infantes} ${cotizacion.num_infantes === 1 ? 'Infante' : 'Infantes'}`}
                        </p>
                    </div>

                    {/* Room Type */}
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Tipo de Habitación</p>
                        <p className="font-semibold text-gray-900">
                            {cotizacion.hoteles && cotizacion.hoteles.length > 0
                                ? `${cotizacion.hoteles[0].tipo_habitacion || 'No especificado'} + ${cotizacion.hoteles[0].plan_alimentacion || 'Sin alimentos'}`
                                : 'No especificado'}
                        </p>
                    </div>
                </div>


                {/* Flight Details */}
                {
                    cotizacion.vuelos && cotizacion.vuelos.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Vuelos</h3>
                            {cotizacion.vuelos.map((vuelo: any, index: number) => (
                                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-sm text-gray-600">Aerolínea</p>
                                            <p className="font-semibold text-gray-900">{vuelo.aerolinea}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Vuelo</p>
                                            <p className="font-semibold text-gray-900">{vuelo.numero_vuelo}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Salida</p>
                                            <p className="font-semibold text-gray-900">
                                                {new Date(vuelo.fecha_salida).toLocaleDateString('es-MX')} {vuelo.hora_salida}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Llegada</p>
                                            <p className="font-semibold text-gray-900">
                                                {new Date(vuelo.fecha_llegada).toLocaleDateString('es-MX')} {vuelo.hora_llegada}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Ruta</p>
                                            <p className="font-semibold text-gray-900">{vuelo.ruta}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Clase</p>
                                            <p className="font-semibold text-gray-900 capitalize">{vuelo.clase}</p>
                                        </div>
                                    </div>
                                    {vuelo.tiene_escala_ida && (
                                        <div className="mt-2 pt-2 border-t border-gray-300">
                                            <p className="text-sm text-gray-600">
                                                Escala en {vuelo.lugar_escala_ida} - Duración: {vuelo.duracion_escala_ida}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )
                }

                {/* Tours */}
                {
                    cotizacion.tours && cotizacion.tours.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Tours y Actividades</h3>
                            {cotizacion.tours.map((tour: any, index: number) => (
                                <div key={index} className="mb-3 p-4 bg-gray-50 rounded-lg">
                                    <p className="font-semibold text-gray-900">{tour.nombre_tour}</p>
                                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                        <p className="text-gray-600">Fecha: {new Date(tour.fecha_tour).toLocaleDateString('es-MX')}</p>
                                        <p className="text-gray-600">Duración: {tour.duracion} horas</p>
                                    </div>
                                    {tour.incluye && (
                                        <p className="text-sm text-gray-600 mt-2">Incluye: {tour.incluye}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )
                }

                {/* Total */}
                <div className="flex justify-end mb-8">
                    <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Total del Paquete</p>
                        <p className="text-3xl font-bold text-[#FF4D8D]">
                            ${cotizacion.precio_venta_final.toLocaleString('es-MX', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </p>
                    </div>
                </div>

                {/* Reservation Information */}
                <div className="border-t-2 border-gray-200 pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Cómo hacer tu reservación</h3>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <p className="font-semibold text-gray-900 mb-2">Por ventas</p>
                            <p className="text-gray-700">Llamar al 81 1529 4248</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 mb-2">Por correo</p>
                            <p className="text-gray-700">contacto@experienciaslasilla.com</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-semibold text-gray-900 mb-2">Experiencias la Silla - Agencia de Viajes</p>
                        <p className="text-sm text-gray-700">Teléfono: 81 1529 4248</p>
                        <p className="text-sm text-gray-700">Dirección: Cerro Lucana Num. 36, Frac. Bosques de las Parras, Monterrey NL, CP 64618</p>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                        Este presupuesto está en dólares para propósitos de estimación y no constituye una oferta impresa.
                        Está sujeto a ajustes pendientes en el momento del servicio.
                    </p>
                </div>
            </div>
        </div >
    );
}
