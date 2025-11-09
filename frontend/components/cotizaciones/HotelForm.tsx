'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Hotel, X, Calendar, DollarSign, BedDouble, Calculator, MapPin, Clock } from 'lucide-react';

export interface HotelItem {
  id: string;
  nombre: string;
  destino: string;
  fecha_checkin: string;
  fecha_checkout: string;
  num_noches: number;
  num_habitaciones: number;
  tipo_habitacion: string;
  plan_alimentacion: string;
  
  // Costos
  precio_venta_total: number;
  comision_hotel: number;
  costo_total: number;
  costo_por_noche: number;    
  precio_venta_por_noche: number;
  
  notas?: string;
}

interface HotelFormProps {
  onAgregar: (hotel: HotelItem) => void;
  onCancelar: () => void;
  // ✅ Props para los defaults
  defaultDestino?: string;
  defaultCheckin?: string;
  defaultCheckout?: string;
}

export function HotelForm({ 
  onAgregar, 
  onCancelar, 
  defaultDestino = '',
  defaultCheckin = '',
  defaultCheckout = ''
}: HotelFormProps) {

  const [hotel, setHotel] = useState<Partial<HotelItem>>({
    destino: defaultDestino,
    // ✅ Usamos los defaults aquí
    fecha_checkin: defaultCheckin,
    fecha_checkout: defaultCheckout,
    num_habitaciones: 1,
    tipo_habitacion: '',
    plan_alimentacion: 'sin_alimentos',
    precio_venta_total: 0,
    comision_hotel: 0,
    num_noches: 0,
  });

  // Efecto: Calcular noches automáticamente al cargar o cambiar fechas
  useEffect(() => {
    if (hotel.fecha_checkin && hotel.fecha_checkout) {
      const start = new Date(hotel.fecha_checkin);
      const end = new Date(hotel.fecha_checkout);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      setHotel(prev => ({ ...prev, num_noches: diffDays > 0 ? diffDays : 0 }));
    }
  }, [hotel.fecha_checkin, hotel.fecha_checkout]);

  const handleChange = (field: string, value: any) => {
    setHotel(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const noches = hotel.num_noches || 1;
    const precioVentaTotal = hotel.precio_venta_total || 0;
    const comision = hotel.comision_hotel || 0;
    const costoNetoTotal = precioVentaTotal - comision;

    const nuevoHotel: HotelItem = {
        id: Date.now().toString(),
        ...hotel as HotelItem,
        precio_venta_total: precioVentaTotal,
        comision_hotel: comision,
        costo_total: costoNetoTotal,
        precio_venta_por_noche: precioVentaTotal / noches,
        costo_por_noche: costoNetoTotal / noches,
        num_noches: hotel.num_noches || 0,
    };
    onAgregar(nuevoHotel);
  };

  // Cálculos para la UI
  const noches = hotel.num_noches || 0;
  const precioVenta = hotel.precio_venta_total || 0;
  const comision = hotel.comision_hotel || 0;
  const costoNeto = precioVenta - comision;
  const precioPorNoche = noches > 0 ? (precioVenta / noches) : 0;

  return (
    <Card className="p-6 border-[#00D4D4]/20 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-[#00D4D4]/10 p-2 rounded-full">
            <Hotel className="w-5 h-5 text-[#00D4D4]" />
          </div>
          <h3 className="font-semibold text-lg">Agregar Hotel</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancelar} className="hover:bg-red-50 hover:text-red-500">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <Label>Nombre del Hotel *</Label>
                <Input value={hotel.nombre || ''} onChange={e => handleChange('nombre', e.target.value)} placeholder="Ej: Hotel Xcaret Arte" className="mt-1.5" />
            </div>
            <div>
                <Label>Destino/Ubicación</Label>
                <Input value={hotel.destino || ''} onChange={e => handleChange('destino', e.target.value)} placeholder="Ej: Riviera Maya" className="mt-1.5" />
            </div>
             <div>
                <Label>Plan de Alimentación</Label>
                <select value={hotel.plan_alimentacion} onChange={e => handleChange('plan_alimentacion', e.target.value)} className="w-full mt-1.5 p-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#00D4D4] outline-none">
                    <option value="sin_alimentos">Solo Habitación (EP)</option>
                    <option value="desayuno">Con Desayuno (BB)</option>
                    <option value="media_pension">Media Pensión (MAP)</option>
                    <option value="pension_completa">Pensión Completa (AP)</option>
                    <option value="todo_incluido">Todo Incluido (AI)</option>
                </select>
            </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <Label className="flex items-center gap-2 mb-1.5 text-xs font-medium text-slate-500"><Calendar className="w-3.5 h-3.5"/> CHECK-IN</Label>
                <Input type="date" value={hotel.fecha_checkin || ''} onChange={e => handleChange('fecha_checkin', e.target.value)} className="bg-white" />
            </div>
            <div>
                <Label className="flex items-center gap-2 mb-1.5 text-xs font-medium text-slate-500"><Calendar className="w-3.5 h-3.5"/> CHECK-OUT</Label>
                <Input type="date" value={hotel.fecha_checkout || ''} onChange={e => handleChange('fecha_checkout', e.target.value)} className="bg-white" />
            </div>
             <div>
                <Label className="mb-1.5 block text-xs font-medium text-slate-500 text-center">DURACIÓN</Label>
                <div className="bg-white text-slate-700 font-bold py-2 px-3 rounded-md border border-slate-200 text-center flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 text-[#00D4D4]" />
                    {noches} noches
                </div>
            </div>
            <div className="md:col-span-2">
                <Label className="flex items-center gap-2 mb-1.5"><BedDouble className="w-4 h-4 text-slate-500"/> Tipo de Habitación</Label>
                <Input value={hotel.tipo_habitacion || ''} onChange={e => handleChange('tipo_habitacion', e.target.value)} placeholder="Ej: Suite Vista al Mar" className="bg-white" />
            </div>
            <div>
                <Label className="mb-1.5">No. Habitaciones</Label>
                <Input type="number" min="1" value={hotel.num_habitaciones} onChange={e => handleChange('num_habitaciones', parseInt(e.target.value) || 1)} className="bg-white" />
            </div>
        </div>

        <div className="bg-slate-800 p-5 rounded-xl text-white shadow-xl">
           <h4 className="font-medium mb-4 flex items-center gap-2 text-[#00D4D4]"><DollarSign className="w-5 h-5" /> Costos de la Estancia</h4>
           <div className="grid grid-cols-2 gap-6">
             <div>
               <label className="text-sm text-[#00D4D4] font-bold mb-1.5 block">Precio Total (Venta al Cliente)</label>
               <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00D4D4] font-bold">$</span>
                  <Input type="number" min="0" step="0.01" value={hotel.precio_venta_total || ''} onChange={e => handleChange('precio_venta_total', parseFloat(e.target.value) || 0)} className="bg-slate-900/50 border-[#00D4D4] text-white pl-7 font-bold text-xl focus-visible:ring-[#00D4D4] h-12" placeholder="0.00" />
               </div>
             </div>
             <div>
               <label className="text-sm text-green-400 font-bold mb-1.5 block">Tu Comisión (Incluida)</label>
               <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">$</span>
                  <Input type="number" min="0" step="0.01" value={hotel.comision_hotel || ''} onChange={e => handleChange('comision_hotel', parseFloat(e.target.value) || 0)} className="bg-green-900/20 border-green-500/50 text-green-400 font-bold pl-7 h-12 focus-visible:ring-green-500" placeholder="0.00" />
               </div>
             </div>
           </div>
           <div className="mt-6 pt-4 border-t border-slate-700 grid grid-cols-2 gap-4">
                <div className="bg-slate-700/50 p-3 rounded-lg">
                    <p className="text-slate-400 text-xs uppercase font-bold flex items-center gap-1"><Calculator className="w-3 h-3" /> Costo Neto (Base)</p>
                    <p className="text-lg font-medium text-white mt-1">${costoNeto.toLocaleString('es-MX', {minimumFractionDigits: 2})}</p>
                </div>
                <div className="bg-slate-700/50 p-3 rounded-lg">
                    <p className="text-slate-400 text-xs uppercase font-bold">Precio Promedio por Noche</p>
                    <p className="text-lg font-medium text-[#00D4D4] mt-1">${precioPorNoche.toLocaleString('es-MX', {minimumFractionDigits: 2})}</p>
                </div>
           </div>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t flex justify-end gap-3">
         <Button variant="outline" onClick={onCancelar}>Cancelar</Button>
         <Button onClick={handleSubmit} className="bg-[#00D4D4] hover:bg-[#00B8B8] px-8">Agregar Hotel</Button>
      </div>
    </Card>
  );
}

export function HotelesLista({ hoteles, onEliminar }: { hoteles: HotelItem[], onEliminar: (id: string) => void }) {
  if (!hoteles || hoteles.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500 border-dashed bg-gray-50/50">
        <Hotel className="w-10 h-10 mx-auto mb-2 text-gray-300" />
        <p>No hay hoteles agregados</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {hoteles.map((hotel) => (
        <Card key={hotel.id} className="p-4 hover:border-[#00D4D4] transition-all group">
          <div className="flex justify-between">
              <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                      <div className="bg-[#00D4D4]/10 p-1.5 rounded-md"><Hotel className="w-5 h-5 text-[#00D4D4]" /></div>
                      <h4 className="font-bold text-lg text-slate-700">{hotel.nombre}</h4>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1 ml-9">
                      <p className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {hotel.destino}</p>
                      <p><span className="font-medium text-slate-900">{hotel.tipo_habitacion}</span> {' • '} {hotel.num_noches} noches</p>
                      <div className="flex gap-2 mt-1">
                         <span className="text-xs bg-slate-100 px-2 py-0.5 rounded uppercase font-medium text-slate-500">{hotel.plan_alimentacion.replace('_', ' ')}</span>
                         <span className="text-xs text-slate-400 flex items-center"><Calendar className="w-3 h-3 mr-1"/>{new Date(hotel.fecha_checkin).toLocaleDateString('es-MX', {day: '2-digit', month: 'short'})} - {new Date(hotel.fecha_checkout).toLocaleDateString('es-MX', {day: '2-digit', month: 'short'})}</span>
                      </div>
                  </div>
              </div>
              <div className="text-right flex flex-col justify-between min-w-[120px]">
                  <div>
                      <p className="text-xs text-slate-500 mb-1">Precio Total</p>
                      <p className="font-bold text-xl text-[#00D4D4]">${hotel.precio_venta_total.toLocaleString('es-MX', {minimumFractionDigits: 2})}</p>
                      {hotel.comision_hotel > 0 && (<p className="text-xs text-green-600 font-medium mt-1">(Ganancia: ${hotel.comision_hotel.toLocaleString('es-MX', {minimumFractionDigits: 2})})</p>)}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onEliminar(hotel.id)} className="text-red-500 hover:bg-red-50 self-end opacity-0 group-hover:opacity-100 transition-opacity px-2"><X className="w-4 h-4 mr-1" /> Eliminar</Button>
              </div>
          </div>
        </Card>
      ))}
    </div>
  );
}