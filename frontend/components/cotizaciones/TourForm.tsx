'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Ticket, X, Calendar, Clock, MapPin, Users, DollarSign, Calculator, Baby } from 'lucide-react';

export interface TourItem {
  id: string;
  nombre_tour: string;
  proveedor: string;
  ubicacion: string;
  duracion_horas: number;
  fecha_tour: string;
  hora_inicio: string;
  incluye: string;
  no_incluye: string;
  
  // Cantidades
  cantidad_adultos: number;
  cantidad_ninos: number;

  // Costos (Nueva Lógica Inversa)
  precio_venta_adulto: number; // Precio por adulto (con comisión incluida)
  precio_venta_nino: number;   // Precio por niño (con comisión incluida)
  precio_venta_total: number;  // (PxA * QA) + (PxN * QN)
  comision_tour: number;       // Comisión TOTAL del tour
  costo_total: number;         // Calculado: Precio Venta Total - Comisión Total

  notas?: string;
}

interface TourFormProps {
  onAgregar: (tour: TourItem) => void;
  onCancelar: () => void;
  // Defaults que vienen del wizard
  defaultUbicacion?: string;
  defaultFecha?: string;
  defaultNumAdultos?: number;
  defaultNumNinos?: number;
}

export function TourForm({ 
  onAgregar, 
  onCancelar, 
  defaultUbicacion = '',
  defaultFecha = '',
  defaultNumAdultos = 1,
  defaultNumNinos = 0
}: TourFormProps) {

  const [tour, setTour] = useState<Partial<TourItem>>({
    ubicacion: defaultUbicacion,
    fecha_tour: defaultFecha,
    cantidad_adultos: defaultNumAdultos,
    cantidad_ninos: defaultNumNinos,
    duracion_horas: 0,
    precio_venta_adulto: 0,
    precio_venta_nino: 0,
    comision_tour: 0,
  });

  const handleChange = (field: string, value: any) => {
    setTour(prev => ({ ...prev, [field]: value }));
  };

  // --- CÁLCULOS EN TIEMPO REAL ---
  const cantAdultos = tour.cantidad_adultos || 0;
  const cantNinos = tour.cantidad_ninos || 0;
  const precioAdulto = tour.precio_venta_adulto || 0;
  const precioNino = tour.precio_venta_nino || 0;
  
  // 1. Calculamos el Venta Total sumando pax * precio
  const totalVenta = (precioAdulto * cantAdultos) + (precioNino * cantNinos);
  
  // 2. Obtenemos la comisión total capturada
  const comisionTotal = tour.comision_tour || 0;
  
  // 3. Calculamos el costo neto (hacia atrás)
  const costoNetoTotal = totalVenta - comisionTotal;

  const handleSubmit = () => {
    // Validar que haya al menos 1 pasajero
    if (cantAdultos + cantNinos === 0) {
        alert("Debes incluir al menos un pasajero para el tour.");
        return;
    }

    const nuevoTour: TourItem = {
        id: Date.now().toString(),
        ...tour as TourItem,
        // Guardamos todos los valores calculados y saneados
        cantidad_adultos: cantAdultos,
        cantidad_ninos: cantNinos,
        precio_venta_adulto: precioAdulto,
        precio_venta_nino: precioNino,
        precio_venta_total: totalVenta,
        comision_tour: comisionTotal,
        costo_total: costoNetoTotal,
    };
    onAgregar(nuevoTour);
  };

  return (
    <Card className="p-6 border-[#00D4D4]/20 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-[#00D4D4]/10 p-2 rounded-full">
            <Ticket className="w-5 h-5 text-[#00D4D4]" />
          </div>
          <h3 className="font-semibold text-lg">Agregar Tour / Actividad</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancelar} className="hover:bg-red-50 hover:text-red-500">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Datos Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <Label>Nombre del Tour *</Label>
                <Input 
                    value={tour.nombre_tour || ''} 
                    onChange={e => handleChange('nombre_tour', e.target.value)} 
                    placeholder="Ej: Excursión a Chichen Itzá Clásico" 
                    className="mt-1.5"
                />
            </div>
            <div>
                <Label>Proveedor</Label>
                <Input 
                    value={tour.proveedor || ''} 
                    onChange={e => handleChange('proveedor', e.target.value)} 
                    placeholder="Ej: Xcaret / Civitatis"
                    className="mt-1.5"
                />
            </div>
            <div>
                <Label>Ubicación</Label>
                <div className="relative mt-1.5">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <Input 
                        value={tour.ubicacion || ''} 
                        onChange={e => handleChange('ubicacion', e.target.value)} 
                        placeholder="Ej: Riviera Maya"
                        className="pl-9"
                    />
                </div>
            </div>
        </div>

        {/* Fecha, Hora y Duración */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-3 gap-4">
            <div>
                <Label className="flex items-center gap-2 mb-1.5 text-xs font-medium text-slate-500"><Calendar className="w-3.5 h-3.5"/> FECHA</Label>
                <Input type="date" value={tour.fecha_tour || ''} onChange={e => handleChange('fecha_tour', e.target.value)} className="bg-white" />
            </div>
            <div>
                <Label className="flex items-center gap-2 mb-1.5 text-xs font-medium text-slate-500"><Clock className="w-3.5 h-3.5"/> HORA INICIO</Label>
                <Input type="time" value={tour.hora_inicio || ''} onChange={e => handleChange('hora_inicio', e.target.value)} className="bg-white" />
            </div>
            <div>
                <Label className="flex items-center gap-2 mb-1.5 text-xs font-medium text-slate-500"><Clock className="w-3.5 h-3.5"/> DURACIÓN (H)</Label>
                <Input type="number" min="0" step="0.5" placeholder="Ej: 8" value={tour.duracion_horas || ''} onChange={e => handleChange('duracion_horas', parseFloat(e.target.value) || 0)} className="bg-white" />
            </div>
        </div>

        {/* Inclusiones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label className="mb-1.5 block">¿Qué incluye?</Label>
                <Textarea 
                    value={tour.incluye || ''} 
                    onChange={e => handleChange('incluye', e.target.value)} 
                    placeholder="Transporte, comida, entradas..." 
                    rows={3}
                    className="resize-none"
                />
            </div>
            <div>
                <Label className="mb-1.5 block">¿Qué NO incluye?</Label>
                <Textarea 
                    value={tour.no_incluye || ''} 
                    onChange={e => handleChange('no_incluye', e.target.value)} 
                    placeholder="Propinas, impuestos de muelle..." 
                    rows={3}
                    className="resize-none"
                />
            </div>
        </div>

        {/* ✅ SECCIÓN DE COSTOS (NUEVA LÓGICA) */}
        <div className="bg-slate-800 p-5 rounded-xl text-white shadow-xl">
           <h4 className="font-medium mb-4 flex items-center gap-2 text-[#00D4D4]">
             <DollarSign className="w-5 h-5" /> Definición de Precios (Por Persona)
           </h4>
           
           <div className="space-y-4 bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
                {/* Renglón Adultos */}
                <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-4 md:col-span-3">
                        <Label className="text-xs text-slate-300 flex items-center gap-1.5 mb-1.5"><Users className="w-3.5 h-3.5 text-[#00D4D4]"/> Cant. Adultos</Label>
                        <Input type="number" min="0" value={tour.cantidad_adultos} onChange={e => handleChange('cantidad_adultos', parseInt(e.target.value) || 0)} className="bg-slate-900 border-slate-600 text-white h-10" />
                    </div>
                    <div className="col-span-8 md:col-span-5">
                        <Label className="text-xs text-slate-300 mb-1.5">Precio Venta Adulto (c/u)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                            <Input type="number" min="0" step="0.01" value={tour.precio_venta_adulto || ''} onChange={e => handleChange('precio_venta_adulto', parseFloat(e.target.value) || 0)} className="bg-slate-900 border-slate-600 text-white pl-7 h-10 focus-visible:ring-[#00D4D4]" placeholder="0.00" />
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-4 flex items-center justify-end md:justify-start gap-2 pb-2">
                        <span className="text-slate-500">=</span>
                        <span className="text-lg font-medium text-[#00D4D4]">${(precioAdulto * cantAdultos).toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                    </div>
                </div>

                {/* Renglón Niños */}
                <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-4 md:col-span-3">
                        <Label className="text-xs text-slate-300 flex items-center gap-1.5 mb-1.5"><Baby className="w-3.5 h-3.5 text-[#00D4D4]"/> Cant. Niños</Label>
                        <Input type="number" min="0" value={tour.cantidad_ninos} onChange={e => handleChange('cantidad_ninos', parseInt(e.target.value) || 0)} className="bg-slate-900 border-slate-600 text-white h-10" />
                    </div>
                    <div className="col-span-8 md:col-span-5">
                        <Label className="text-xs text-slate-300 mb-1.5">Precio Venta Niño (c/u)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                            <Input type="number" min="0" step="0.01" value={tour.precio_venta_nino || ''} onChange={e => handleChange('precio_venta_nino', parseFloat(e.target.value) || 0)} className="bg-slate-900 border-slate-600 text-white pl-7 h-10 focus-visible:ring-[#00D4D4]" placeholder="0.00" />
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-4 flex items-center justify-end md:justify-start gap-2 pb-2">
                        <span className="text-slate-500">=</span>
                        <span className="text-lg font-medium text-[#00D4D4]">${(precioNino * cantNinos).toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                    </div>
                </div>
           </div>

           {/* Totales y Comisión */}
           <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-[#00D4D4]/10 p-4 rounded-lg border border-[#00D4D4]/30">
               <p className="text-sm text-[#00D4D4] font-bold mb-1">PRECIO VENTA TOTAL</p>
               <p className="text-3xl font-bold text-white">
                 ${totalVenta.toLocaleString('es-MX', {minimumFractionDigits: 2})}
               </p>
               <p className="text-xs text-[#00D4D4]/70 mt-1">
                  {cantAdultos + cantNinos} pasajeros en total
               </p>
             </div>

             <div>
               <Label className="text-green-400 font-bold mb-2 block">Tu Comisión Total (Incluida)</Label>
               <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 font-bold">$</span>
                  <Input 
                    type="number" min="0" step="0.01" 
                    value={tour.comision_tour || ''} 
                    onChange={e => handleChange('comision_tour', parseFloat(e.target.value) || 0)}
                    className="bg-green-900/20 border-green-500/50 text-green-400 font-bold pl-7 h-14 text-lg focus-visible:ring-green-500"
                    placeholder="0.00"
                  />
               </div>
             </div>
           </div>

           {/* Costo Neto Calculado */}
           <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between items-center px-2">
                <span className="text-slate-400 text-sm flex items-center gap-2">
                    <Calculator className="w-4 h-4"/> Costo Neto (a pagar al proveedor):
                </span>
                <span className="text-xl font-medium text-slate-200">
                    ${costoNetoTotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}
                </span>
           </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t flex justify-end gap-3">
         <Button variant="outline" onClick={onCancelar}>Cancelar</Button>
         <Button onClick={handleSubmit} className="bg-[#00D4D4] hover:bg-[#00B8B8] px-8">Agregar Tour</Button>
      </div>
    </Card>
  );
}

// =====================================================================
// Componente ToursLista (Actualizado)
// =====================================================================

interface ToursListaProps {
  tours: TourItem[];
  onEliminar: (id: string) => void;
}

export function ToursLista({ tours, onEliminar }: ToursListaProps) {
  if (tours.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500 border-dashed bg-gray-50/50">
        <Ticket className="w-10 h-10 mx-auto mb-2 text-gray-300" />
        <p>No hay tours agregados</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {tours.map((tour) => (
        <Card key={tour.id} className="p-4 hover:border-[#00D4D4] transition-all group">
          <div className="flex justify-between">
              <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                      <div className="bg-[#00D4D4]/10 p-1.5 rounded-md">
                          <Ticket className="w-5 h-5 text-[#00D4D4]" />
                      </div>
                      <h4 className="font-bold text-lg text-slate-700">{tour.nombre_tour}</h4>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1 ml-9">
                      {tour.proveedor && <p className="text-slate-500 flex items-center gap-1"><Users className="w-3.5 h-3.5"/> Prov: {tour.proveedor}</p>}
                      <p className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" /> {tour.ubicacion}
                      </p>
                      <p className="flex items-center gap-1 mt-1 text-slate-500">
                          <Calendar className="w-3.5 h-3.5" /> 
                          {new Date(tour.fecha_tour).toLocaleDateString('es-MX', {day: 'numeric', month: 'long'})}
                          {tour.hora_inicio && <> • <Clock className="w-3.5 h-3.5 ml-1" /> {tour.hora_inicio}</>}
                          {tour.duracion_horas > 0 && ` (${tour.duracion_horas}h)`}
                      </p>
                      <div className="flex gap-2 mt-2">
                         <span className="text-xs bg-slate-100 px-2 py-1 rounded font-medium text-slate-700 flex items-center gap-1">
                            <Users className="w-3 h-3"/> {tour.cantidad_adultos} Adultos
                         </span>
                         {tour.cantidad_ninos > 0 && (
                             <span className="text-xs bg-slate-100 px-2 py-1 rounded font-medium text-slate-700 flex items-center gap-1">
                                <Baby className="w-3.5 h-3.5"/> {tour.cantidad_ninos} Niños
                             </span>
                         )}
                      </div>
                  </div>
              </div>

              <div className="text-right flex flex-col justify-between min-w-[130px]">
                  <div>
                      <p className="text-xs text-slate-500 mb-1">Precio Total</p>
                      <p className="font-bold text-xl text-[#00D4D4]">
                          ${tour.precio_venta_total.toLocaleString('es-MX', {minimumFractionDigits: 2})}
                      </p>
                      {tour.comision_tour > 0 && (
                           <p className="text-xs text-green-600 font-medium mt-1">
                              (Ganancia: ${tour.comision_tour.toLocaleString('es-MX', {minimumFractionDigits: 2})})
                          </p>
                      )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => onEliminar(tour.id)} className="text-red-500 hover:bg-red-50 self-end opacity-0 group-hover:opacity-100 transition-opacity px-2 h-8">
                      <X className="w-4 h-4 mr-1" /> Eliminar
                  </Button>
              </div>
          </div>
        </Card>
      ))}
    </div>
  );
}