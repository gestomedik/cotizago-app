'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Ticket, X } from 'lucide-react';

interface Tour {
  id: string;
  nombre_tour: string;
  proveedor: string;
  ubicacion: string;
  duracion_horas: number;
  fecha_tour: string;
  hora_inicio: string;
  incluye: string;
  no_incluye: string;
  costo_por_adulto: number;
  costo_por_nino: number;
  cantidad_adultos: number;
  cantidad_ninos: number;
  costo_total: number;
  comision_tour: number;
  total_con_comision: number;
}

interface TourFormProps {
  onAgregar: (tour: Tour) => void;
  onCancelar: () => void;
  numAdultos: number;
  numNinos: number;
}

export function TourForm({ onAgregar, onCancelar, numAdultos, numNinos }: TourFormProps) {
  const [tour, setTour] = useState<Partial<Tour>>({
    cantidad_adultos: numAdultos,
    cantidad_ninos: numNinos,
    costo_por_adulto: 0,
    costo_por_nino: 0,
    comision_tour: 0,
  });

  const handleChange = (field: string, value: any) => {
    setTour(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calcularTotal = () => {
    const costoAdultos = (tour.costo_por_adulto || 0) * (tour.cantidad_adultos || 0);
    const costoNinos = (tour.costo_por_nino || 0) * (tour.cantidad_ninos || 0);
    const costoTotal = costoAdultos + costoNinos;
    const totalConComision = costoTotal + (tour.comision_tour || 0);
    
    return { costoAdultos, costoNinos, costoTotal, totalConComision };
  };

  const handleSubmit = () => {
    const { costoTotal, totalConComision } = calcularTotal();
    
    const tourCompleto: Tour = {
      id: Date.now().toString(),
      nombre_tour: tour.nombre_tour || '',
      proveedor: tour.proveedor || '',
      ubicacion: tour.ubicacion || '',
      duracion_horas: tour.duracion_horas || 0,
      fecha_tour: tour.fecha_tour || '',
      hora_inicio: tour.hora_inicio || '',
      incluye: tour.incluye || '',
      no_incluye: tour.no_incluye || '',
      costo_por_adulto: tour.costo_por_adulto || 0,
      costo_por_nino: tour.costo_por_nino || 0,
      cantidad_adultos: tour.cantidad_adultos || 0,
      cantidad_ninos: tour.cantidad_ninos || 0,
      costo_total: costoTotal,
      comision_tour: tour.comision_tour || 0,
      total_con_comision: totalConComision,
    };
    
    onAgregar(tourCompleto);
  };

  const { costoAdultos, costoNinos, costoTotal, totalConComision } = calcularTotal();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-[#00D4D4]" />
          <h3 className="font-semibold text-lg">Agregar Tour</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancelar}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label>Nombre del tour *</Label>
          <Input
            value={tour.nombre_tour || ''}
            onChange={(e) => handleChange('nombre_tour', e.target.value)}
            placeholder="Ej: Tour a Chichen Itzá"
          />
        </div>

        <div>
          <Label>Proveedor</Label>
          <Input
            value={tour.proveedor || ''}
            onChange={(e) => handleChange('proveedor', e.target.value)}
            placeholder="Nombre del proveedor"
          />
        </div>

        <div>
          <Label>Ubicación</Label>
          <Input
            value={tour.ubicacion || ''}
            onChange={(e) => handleChange('ubicacion', e.target.value)}
            placeholder="Ej: Cancún"
          />
        </div>

        <div>
          <Label>Fecha del tour *</Label>
          <Input
            type="date"
            value={tour.fecha_tour || ''}
            onChange={(e) => handleChange('fecha_tour', e.target.value)}
          />
        </div>

        <div>
          <Label>Hora de inicio</Label>
          <Input
            type="time"
            value={tour.hora_inicio || ''}
            onChange={(e) => handleChange('hora_inicio', e.target.value)}
          />
        </div>

        <div>
          <Label>Duración (horas)</Label>
          <Input
            type="number"
            min="0"
            step="0.5"
            value={tour.duracion_horas || 0}
            onChange={(e) => handleChange('duracion_horas', parseFloat(e.target.value))}
          />
        </div>

        <div className="md:col-span-2">
          <Label>¿Qué incluye?</Label>
          <Textarea
            value={tour.incluye || ''}
            onChange={(e) => handleChange('incluye', e.target.value)}
            placeholder="Ej: Transporte, guía, comida, entradas..."
            rows={3}
          />
        </div>

        <div className="md:col-span-2">
          <Label>¿Qué no incluye?</Label>
          <Textarea
            value={tour.no_incluye || ''}
            onChange={(e) => handleChange('no_incluye', e.target.value)}
            placeholder="Ej: Propinas, bebidas alcohólicas..."
            rows={2}
          />
        </div>

        {/* Costos por tipo de pasajero */}
        <div className="md:col-span-2 mt-4">
          <h4 className="font-medium mb-3">Costos por pasajero</h4>
        </div>

        <div>
          <Label>Costo por adulto *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={tour.costo_por_adulto || 0}
              onChange={(e) => handleChange('costo_por_adulto', parseFloat(e.target.value) || 0)}
              className="pl-7"
            />
          </div>
        </div>

        <div>
          <Label>Cantidad de adultos</Label>
          <Input
            type="number"
            min="0"
            value={tour.cantidad_adultos || 0}
            onChange={(e) => handleChange('cantidad_adultos', parseInt(e.target.value))}
          />
        </div>

        <div>
          <Label>Costo por niño</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={tour.costo_por_nino || 0}
              onChange={(e) => handleChange('costo_por_nino', parseFloat(e.target.value) || 0)}
              className="pl-7"
            />
          </div>
        </div>

        <div>
          <Label>Cantidad de niños</Label>
          <Input
            type="number"
            min="0"
            value={tour.cantidad_ninos || 0}
            onChange={(e) => handleChange('cantidad_ninos', parseInt(e.target.value))}
          />
        </div>

        <div className="md:col-span-2">
          <Label>Comisión del tour</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={tour.comision_tour || 0}
              onChange={(e) => handleChange('comision_tour', parseFloat(e.target.value) || 0)}
              className="pl-7"
            />
          </div>
        </div>
      </div>

      {/* Totales */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Adultos</p>
            <p className="font-semibold">${costoAdultos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-gray-500">
              ${(tour.costo_por_adulto || 0).toFixed(2)} × {tour.cantidad_adultos || 0}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Niños</p>
            <p className="font-semibold">${costoNinos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-gray-500">
              ${(tour.costo_por_nino || 0).toFixed(2)} × {tour.cantidad_ninos || 0}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Comisión</p>
            <p className="font-semibold text-green-600">
              +${(tour.comision_tour || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Total</p>
            <p className="font-semibold text-xl text-[#00D4D4]">
              ${totalConComision.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="mt-6 flex gap-3">
        <Button onClick={handleSubmit} className="flex-1 bg-[#00D4D4] hover:bg-[#00B8B8]">
          Agregar Tour
        </Button>
        <Button onClick={onCancelar} variant="outline" className="flex-1">
          Cancelar
        </Button>
      </div>
    </Card>
  );
}

// Lista de tours agregados
interface ToursListaProps {
  tours: Tour[];
  onEliminar: (id: string) => void;
}

export function ToursLista({ tours, onEliminar }: ToursListaProps) {
  if (tours.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500">
        <Ticket className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>No se han agregado tours</p>
      </Card>
    );
  }

  const totalTours = tours.reduce((sum, t) => sum + t.costo_total, 0);
  const totalComisiones = tours.reduce((sum, t) => sum + t.comision_tour, 0);
  const totalGeneral = tours.reduce((sum, t) => sum + t.total_con_comision, 0);

  return (
    <div className="space-y-3">
      {tours.map((tour) => (
        <Card key={tour.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Ticket className="w-4 h-4 text-[#00D4D4]" />
                <span className="font-semibold">{tour.nombre_tour}</span>
              </div>
              
              <div className="text-sm space-y-1">
                {tour.proveedor && (
                  <p className="text-gray-600">Proveedor: {tour.proveedor}</p>
                )}
                {tour.ubicacion && (
                  <p className="text-gray-600">Ubicación: {tour.ubicacion}</p>
                )}
                <p className="text-gray-600">
                  Fecha: {tour.fecha_tour} {tour.hora_inicio && `• ${tour.hora_inicio}`}
                </p>
                {tour.duracion_horas > 0 && (
                  <p className="text-gray-600">Duración: {tour.duracion_horas} hora(s)</p>
                )}
                <p className="text-gray-600">
                  {tour.cantidad_adultos} adulto(s) • {tour.cantidad_ninos} niño(s)
                </p>
                
                {tour.incluye && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-green-700">Incluye:</p>
                    <p className="text-xs text-gray-600">{tour.incluye}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-right ml-4">
              <div className="mb-2">
                <p className="text-xs text-gray-500">Base</p>
                <p className="font-medium">${tour.costo_total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="mb-2">
                <p className="text-xs text-gray-500">Comisión</p>
                <p className="font-medium text-green-600">+${tour.comision_tour.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="mb-3">
                <p className="text-xs text-gray-500">Total</p>
                <p className="font-bold text-lg text-[#00D4D4]">
                  ${tour.total_con_comision.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEliminar(tour.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {/* Totales generales */}
      <Card className="p-4 bg-gray-50">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total tours</p>
            <p className="text-lg font-bold">${totalTours.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total comisiones</p>
            <p className="text-lg font-bold text-green-600">${totalComisiones.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total general</p>
            <p className="text-xl font-bold text-[#00D4D4]">${totalGeneral.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
