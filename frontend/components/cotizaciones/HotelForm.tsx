'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Hotel as HotelIcon, X } from 'lucide-react';

interface Hotel {
  id: string;
  nombre_hotel: string;
  categoria: number;
  ubicacion: string;
  direccion: string;
  fecha_checkin: string;
  fecha_checkout: string;
  num_noches: number;
  num_habitaciones: number;
  tipo_habitacion: string;
  plan_alimenticio: string;
  costo_por_noche: number;
  costo_total: number;
  comision_hotel: number;
  total_con_comision: number;
}

interface HotelFormProps {
  onAgregar: (hotel: Hotel) => void;
  onCancelar: () => void;
}

export function HotelForm({ onAgregar, onCancelar }: HotelFormProps) {
  const [hotel, setHotel] = useState<Partial<Hotel>>({
    categoria: 3,
    num_habitaciones: 1,
    costo_por_noche: 0,
    comision_hotel: 0,
  });

  const handleChange = (field: string, value: any) => {
    let updatedHotel = { ...hotel, [field]: value };
    
    // Calcular número de noches automáticamente
    if (field === 'fecha_checkin' || field === 'fecha_checkout') {
      if (updatedHotel.fecha_checkin && updatedHotel.fecha_checkout) {
        const checkin = new Date(updatedHotel.fecha_checkin);
        const checkout = new Date(updatedHotel.fecha_checkout);
        const diffTime = Math.abs(checkout.getTime() - checkin.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        updatedHotel.num_noches = diffDays;
      }
    }
    
    setHotel(updatedHotel);
  };

  const calcularTotal = () => {
    const noches = hotel.num_noches || 0;
    const habitaciones = hotel.num_habitaciones || 1;
    const costoPorNoche = hotel.costo_por_noche || 0;
    
    const costoTotal = noches * habitaciones * costoPorNoche;
    const totalConComision = costoTotal + (hotel.comision_hotel || 0);
    
    return { costoTotal, totalConComision };
  };

  const handleSubmit = () => {
    const { costoTotal, totalConComision } = calcularTotal();
    
    const hotelCompleto: Hotel = {
      id: Date.now().toString(),
      nombre_hotel: hotel.nombre_hotel || '',
      categoria: hotel.categoria || 3,
      ubicacion: hotel.ubicacion || '',
      direccion: hotel.direccion || '',
      fecha_checkin: hotel.fecha_checkin || '',
      fecha_checkout: hotel.fecha_checkout || '',
      num_noches: hotel.num_noches || 0,
      num_habitaciones: hotel.num_habitaciones || 1,
      tipo_habitacion: hotel.tipo_habitacion || '',
      plan_alimenticio: hotel.plan_alimenticio || '',
      costo_por_noche: hotel.costo_por_noche || 0,
      costo_total: costoTotal,
      comision_hotel: hotel.comision_hotel || 0,
      total_con_comision: totalConComision,
    };
    
    onAgregar(hotelCompleto);
  };

  const { costoTotal, totalConComision } = calcularTotal();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HotelIcon className="w-5 h-5 text-[#00D4D4]" />
          <h3 className="font-semibold text-lg">Agregar Hotel</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancelar}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Nombre del hotel *</Label>
          <Input
            value={hotel.nombre_hotel || ''}
            onChange={(e) => handleChange('nombre_hotel', e.target.value)}
            placeholder="Ej: Hotel Fiesta Americana"
          />
        </div>

        <div>
          <Label>Categoría (estrellas)</Label>
          <Input
            type="number"
            min="1"
            max="5"
            value={hotel.categoria || 3}
            onChange={(e) => handleChange('categoria', parseInt(e.target.value))}
          />
        </div>

        <div>
          <Label>Ubicación *</Label>
          <Input
            value={hotel.ubicacion || ''}
            onChange={(e) => handleChange('ubicacion', e.target.value)}
            placeholder="Ej: Zona Hotelera Cancún"
          />
        </div>

        <div>
          <Label>Dirección</Label>
          <Input
            value={hotel.direccion || ''}
            onChange={(e) => handleChange('direccion', e.target.value)}
            placeholder="Dirección completa"
          />
        </div>

        <div>
          <Label>Fecha check-in *</Label>
          <Input
            type="date"
            value={hotel.fecha_checkin || ''}
            onChange={(e) => handleChange('fecha_checkin', e.target.value)}
          />
        </div>

        <div>
          <Label>Fecha check-out *</Label>
          <Input
            type="date"
            value={hotel.fecha_checkout || ''}
            onChange={(e) => handleChange('fecha_checkout', e.target.value)}
          />
        </div>

        <div>
          <Label>Número de noches</Label>
          <Input
            type="number"
            min="1"
            value={hotel.num_noches || 0}
            onChange={(e) => handleChange('num_noches', parseInt(e.target.value))}
            disabled
            className="bg-gray-100"
          />
          <p className="text-xs text-gray-500 mt-1">Se calcula automáticamente</p>
        </div>

        <div>
          <Label>Número de habitaciones *</Label>
          <Input
            type="number"
            min="1"
            value={hotel.num_habitaciones || 1}
            onChange={(e) => handleChange('num_habitaciones', parseInt(e.target.value))}
          />
        </div>

        <div>
          <Label>Tipo de habitación</Label>
          <Input
            value={hotel.tipo_habitacion || ''}
            onChange={(e) => handleChange('tipo_habitacion', e.target.value)}
            placeholder="Ej: Doble vista al mar"
          />
        </div>

        <div>
          <Label>Plan alimenticio</Label>
          <select
            value={hotel.plan_alimenticio || ''}
            onChange={(e) => handleChange('plan_alimenticio', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Seleccionar...</option>
            <option value="solo_habitacion">Solo habitación</option>
            <option value="desayuno">Desayuno incluido</option>
            <option value="media_pension">Media pensión</option>
            <option value="pension_completa">Pensión completa</option>
            <option value="todo_incluido">Todo incluido</option>
          </select>
        </div>

        <div>
          <Label>Costo por noche (por habitación) *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={hotel.costo_por_noche || 0}
              onChange={(e) => handleChange('costo_por_noche', parseFloat(e.target.value) || 0)}
              className="pl-7"
            />
          </div>
        </div>

        <div>
          <Label>Comisión del hotel</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={hotel.comision_hotel || 0}
              onChange={(e) => handleChange('comision_hotel', parseFloat(e.target.value) || 0)}
              className="pl-7"
            />
          </div>
        </div>
      </div>

      {/* Totales */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Costo base</p>
            <p className="font-semibold text-lg">
              ${costoTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500">
              ${(hotel.costo_por_noche || 0).toFixed(2)} × {hotel.num_noches || 0} noches × {hotel.num_habitaciones || 1} hab
            </p>
          </div>
          <div>
            <p className="text-gray-600">Comisión</p>
            <p className="font-semibold text-lg text-green-600">
              +${(hotel.comision_hotel || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
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
          Agregar Hotel
        </Button>
        <Button onClick={onCancelar} variant="outline" className="flex-1">
          Cancelar
        </Button>
      </div>
    </Card>
  );
}

// Lista de hoteles agregados
interface HotelesListaProps {
  hoteles: Hotel[];
  onEliminar: (id: string) => void;
}

export function HotelesLista({ hoteles, onEliminar }: HotelesListaProps) {
  if (hoteles.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500">
        <HotelIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>No se han agregado hoteles</p>
      </Card>
    );
  }

  const totalHoteles = hoteles.reduce((sum, h) => sum + h.costo_total, 0);
  const totalComisiones = hoteles.reduce((sum, h) => sum + h.comision_hotel, 0);
  const totalGeneral = hoteles.reduce((sum, h) => sum + h.total_con_comision, 0);

  return (
    <div className="space-y-3">
      {hoteles.map((hotel) => (
        <Card key={hotel.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <HotelIcon className="w-4 h-4 text-[#00D4D4]" />
                <span className="font-semibold">{hotel.nombre_hotel}</span>
                <span className="text-yellow-500">{'⭐'.repeat(hotel.categoria)}</span>
              </div>
              
              <div className="text-sm space-y-1">
                <p className="text-gray-600">{hotel.ubicacion}</p>
                <p className="text-gray-600">
                  Check-in: {hotel.fecha_checkin} | Check-out: {hotel.fecha_checkout}
                </p>
                <p className="text-gray-600">
                  {hotel.num_noches} noche(s) • {hotel.num_habitaciones} habitación(es)
                </p>
                {hotel.tipo_habitacion && (
                  <p className="text-gray-600">Tipo: {hotel.tipo_habitacion}</p>
                )}
                {hotel.plan_alimenticio && (
                  <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1">
                    {hotel.plan_alimenticio}
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-right ml-4">
              <div className="mb-2">
                <p className="text-xs text-gray-500">Base</p>
                <p className="font-medium">${hotel.costo_total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="mb-2">
                <p className="text-xs text-gray-500">Comisión</p>
                <p className="font-medium text-green-600">+${hotel.comision_hotel.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="mb-3">
                <p className="text-xs text-gray-500">Total</p>
                <p className="font-bold text-lg text-[#00D4D4]">
                  ${hotel.total_con_comision.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEliminar(hotel.id)}
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
            <p className="text-sm text-gray-600">Total hoteles</p>
            <p className="text-lg font-bold">${totalHoteles.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
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
