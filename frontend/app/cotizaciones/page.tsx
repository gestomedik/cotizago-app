'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
  FileText, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import { api } from '@/lib/api';

interface Cotizacion {
  id: number;
  folio: string;
  cliente_id: number;
  cliente_nombre: string;
  cliente_apellido: string;
  destino: string;
  fecha_salida: string;
  fecha_regreso: string;
  num_adultos: number;
  num_ninos: number;
  num_infantes: number;
  precio_venta_final: number;
  estado: 'cotizacion' | 'reservacion' | 'cancelada' | 'completada';
  fecha_creacion: string;
}

export default function CotizacionesPage() {
  const router = useRouter();
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [filteredCotizaciones, setFilteredCotizaciones] = useState<Cotizacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<string>('todos');

  useEffect(() => {
    fetchCotizaciones();
  }, []);

  useEffect(() => {
    let filtered = cotizaciones;

    if (searchTerm) {
      filtered = filtered.filter(cot => 
        cot.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${cot.cliente_nombre} ${cot.cliente_apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cot.destino.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (estadoFiltro !== 'todos') {
      filtered = filtered.filter(cot => cot.estado === estadoFiltro);
    }

    setFilteredCotizaciones(filtered);
  }, [searchTerm, estadoFiltro, cotizaciones]);

  const fetchCotizaciones = async () => {
    try {
      setIsLoading(true);
      const response = await api.cotizaciones.list();
      
      if (response.success) {
        setCotizaciones(response.data || []);
        setFilteredCotizaciones(response.data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar las cotizaciones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCambiarEstado = async (id: number, nuevoEstado: string) => {
    if (!confirm(`¿Cambiar esta cotización a ${nuevoEstado}?`)) return;

    try {
      const response = await api.cotizaciones.cambiarEstado(id, nuevoEstado)
      
      if (response.success) {
        alert('Estado actualizado correctamente');
        fetchCotizaciones();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar el estado');
    }
  };

  const handleEliminar = async (id: number, folio: string) => {
    if (!confirm(`¿Estás seguro de eliminar la cotización ${folio}?`)) return;

    try {
      const response = await api.cotizaciones.delete(id);
      
      if (response.success) {
        alert('Cotización eliminada correctamente');
        fetchCotizaciones();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar la cotización');
    }
  };

  const getEstadoBadge = (estado: string) => {
    const badges = {
      cotizacion: 'bg-yellow-100 text-yellow-800',
      reservacion: 'bg-green-100 text-green-800',
      cancelada: 'bg-red-100 text-red-800',
      completada: 'bg-blue-100 text-blue-800'
    };
    
    const labels = {
      cotizacion: 'Cotización',
      reservacion: 'Reservación',
      cancelada: 'Cancelada',
      completada: 'Completada'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[estado as keyof typeof badges] || 'bg-gray-100 text-gray-800'}`}>
        {labels[estado as keyof typeof labels] || estado}
      </span>
    );
  };

  const stats = {
    total: cotizaciones.length,
    cotizaciones: cotizaciones.filter(c => c.estado === 'cotizacion').length,
    reservaciones: cotizaciones.filter(c => c.estado === 'reservacion').length,
    completadas: cotizaciones.filter(c => c.estado === 'completada').length
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className="flex-1 ml-60">
        <DashboardHeader title="Cotizaciones" />
        
        <main className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cotizaciones</h1>
                <p className="text-gray-600 mt-1">Gestiona todas las cotizaciones y reservaciones</p>
              </div>
              <Button
                onClick={() => router.push('/cotizaciones/nueva')}
                className="bg-[#00D4D4] hover:bg-[#00B8B8]"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nueva Cotización
              </Button>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cotizaciones</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.cotizaciones}</p>
                </div>
                <FileText className="w-8 h-8 text-yellow-400" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reservaciones</p>
                  <p className="text-2xl font-bold text-green-600">{stats.reservaciones}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completadas</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.completadas}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-400" />
              </div>
            </Card>
          </div>

          {/* Filtros */}
          <Card className="p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar por folio, cliente o destino..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <select
                  value={estadoFiltro}
                  onChange={(e) => setEstadoFiltro(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D4D4] focus:border-transparent"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="cotizacion">Cotización</option>
                  <option value="reservacion">Reservación</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Tabla */}
          <Card className="overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#00D4D4] mx-auto mb-2" />
                <p className="text-gray-600">Cargando cotizaciones...</p>
              </div>
            ) : filteredCotizaciones.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No hay cotizaciones para mostrar</p>
                <Button
                  onClick={() => router.push('/cotizaciones/nueva')}
                  variant="link"
                  className="text-[#00D4D4]"
                >
                  Crear primera cotización
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Folio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Destino
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha Salida
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pasajeros
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCotizaciones.map((cotizacion) => (
                      <tr key={cotizacion.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">{cotizacion.folio}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {cotizacion.cliente_nombre} {cotizacion.cliente_apellido}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{cotizacion.destino}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {new Date(cotizacion.fecha_salida).toLocaleDateString('es-MX')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {cotizacion.num_adultos + cotizacion.num_ninos + cotizacion.num_infantes}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            ${cotizacion.precio_venta_final.toLocaleString('es-MX', { 
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2 
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getEstadoBadge(cotizacion.estado)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => router.push(`/cotizaciones/${cotizacion.id}`)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Ver detalles"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => router.push(`/cotizaciones/${cotizacion.id}/editar`)}
                              className="text-yellow-600 hover:text-yellow-900 transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            {cotizacion.estado === 'cotizacion' && (
                              <button
                                onClick={() => handleCambiarEstado(cotizacion.id, 'reservacion')}
                                className="text-green-600 hover:text-green-900 transition-colors"
                                title="Cambiar a Reservación"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleEliminar(cotizacion.id, cotizacion.folio)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Resumen */}
          <div className="mt-4 text-sm text-gray-600">
            Mostrando {filteredCotizaciones.length} de {cotizaciones.length} cotizaciones
          </div>
        </main>
      </div>
    </div>
  );
}
