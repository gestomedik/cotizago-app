'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Bus, X, DollarSign, Calculator, MapPin, Users } from 'lucide-react';

export interface TransporteItem {
  id: string;
  tipo_transporte: 'terrestre' | 'aereo' | 'maritimo';
  proveedor: string;
  origen: string;
  destino: string;
  capacidad_pasajeros: number;
  descripcion: string; // Campo importante según tu indicación
  
  // Costos (Lógica Adelante: Costo + Comisión = Precio)
  costo_total: number;
  comision_transporte: number;
  precio_venta_total: number; // Calculado

  notas?: string;
}

interface TransporteFormProps {
  onAgregar: (item: TransporteItem) => void;
  onCancelar: () => void;
  defaultOrigen?: string;
  defaultDestino?: string;
  numPasajeros?: number;
}

export function TransporteForm({ 
  onAgregar, 
  onCancelar,
  defaultOrigen = '',
  defaultDestino = '',
  numPasajeros = 1
}: TransporteFormProps) {

  const [item, setItem] = useState<Partial<TransporteItem>>({
    tipo_transporte: 'terrestre',
    proveedor: '',
    origen: defaultOrigen,
    destino: defaultDestino,
    capacidad_pasajeros: numPasajeros,
    descripcion: '',
    costo_total: 0,
    comision_transporte: 0,
  });

  const handleChange = (field: string, value: any) => {
    setItem(prev => ({ ...prev, [field]: value }));
  };

  // CÁLCULO HACIA ADELANTE
  const costo = item.costo_total || 0;
  const comision = item.comision_transporte || 0;
  const precioVenta = costo + comision;

  const handleSubmit = () => {
    if (!item.descripcion && !item.tipo_transporte) {
        alert("Por favor completa la descripción o tipo de transporte");
        return;
    }

    const nuevoTransporte: TransporteItem = {
        id: Date.now().toString(),
        ...item as TransporteItem,
        tipo_transporte: item.tipo_transporte || 'terrestre',
        costo_total: costo,
        comision_transporte: comision,
        precio_venta_total: precioVenta, // Guardamos el calculado
    };
    onAgregar(nuevoTransporte);
  };

  return (
    <Card className="p-6 border-[#00D4D4]/20 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-[#00D4D4]/10 p-2 rounded-full">
            <Bus className="w-5 h-5 text-[#00D4D4]" />
          </div>
          <h3 className="font-semibold text-lg">Agregar Transporte</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancelar} className="hover:bg-red-50 hover:text-red-500">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label>Tipo de Transporte</Label>
                <select 
                    value={item.tipo_transporte}
                    onChange={e => handleChange('tipo_transporte', e.target.value)}
                    className="w-full mt-1.5 p-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#00D4D4] outline-none"
                >
                    <option value="terrestre">Terrestre (Privado/Colectivo)</option>
                    <option value="aereo">Aéreo (Charter/Privado)</option>
                    <option value="maritimo">Marítimo (Ferry/Yate)</option>
                </select>
            </div>
            <div>
                <Label>Proveedor</Label>
                <Input value={item.proveedor || ''} onChange={e => handleChange('proveedor', e.target.value)} className="mt-1.5" placeholder="Ej: Gaviota Tours" />
            </div>
            <div className="md:col-span-2">
                <Label>Descripción del Servicio *</Label>
                <Input value={item.descripcion || ''} onChange={e => handleChange('descripcion', e.target.value)} className="mt-1.5" placeholder="Ej: Traslado Aeropuerto - Hotel (Redondo)" />
            </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3 grid grid-cols-2 gap-4">
                 <div>
                    <Label className="flex items-center gap-2 mb-1.5 text-xs font-medium text-slate-500"><MapPin className="w-3.5 h-3.5"/> ORIGEN</Label>
                    <Input value={item.origen || ''} onChange={e => handleChange('origen', e.target.value)} className="bg-white" placeholder="Ej: Aeropuerto CUN" />
                 </div>
                 <div>
                    <Label className="flex items-center gap-2 mb-1.5 text-xs font-medium text-slate-500"><MapPin className="w-3.5 h-3.5"/> DESTINO</Label>
                    <Input value={item.destino || ''} onChange={e => handleChange('destino', e.target.value)} className="bg-white" placeholder="Ej: Hotel Xcaret" />
                 </div>
            </div>
            <div>
                <Label className="flex items-center gap-2 mb-1.5 text-xs font-medium text-slate-500"><Users className="w-3.5 h-3.5"/> PASAJEROS</Label>
                <Input type="number" min="1" value={item.capacidad_pasajeros} onChange={e => handleChange('capacidad_pasajeros', parseInt(e.target.value) || 1)} className="bg-white" />
            </div>
        </div>

        {/* ✅ SECCIÓN DE COSTOS (Lógica Adelante: Costo + Comisión = Precio) */}
        <div className="bg-slate-800 p-5 rounded-xl text-white shadow-xl">
           <h4 className="font-medium mb-4 flex items-center gap-2 text-[#00D4D4]">
             <DollarSign className="w-5 h-5" /> Costos del Servicio
           </h4>
           
           <div className="grid grid-cols-2 gap-6">
             {/* INPUT 1: COSTO NETO */}
             <div>
               <label className="text-sm text-slate-400 font-medium mb-1.5 block">Costo Neto (Proveedor)</label>
               <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <Input 
                    type="number" min="0" step="0.01" 
                    value={item.costo_total || ''} 
                    onChange={e => handleChange('costo_total', parseFloat(e.target.value) || 0)}
                    className="bg-slate-700 border-slate-600 text-white pl-7 h-12 focus-visible:ring-[#00D4D4]"
                    placeholder="0.00"
                  />
               </div>
             </div>

             {/* INPUT 2: COMISIÓN */}
             <div>
               <label className="text-sm text-green-400 font-medium mb-1.5 block">Tu Comisión (A sumar)</label>
               <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">$</span>
                  <Input 
                    type="number" min="0" step="0.01" 
                    value={item.comision_transporte || ''} 
                    onChange={e => handleChange('comision_transporte', parseFloat(e.target.value) || 0)}
                    className="bg-green-900/20 border-green-500/50 text-green-400 font-bold pl-7 h-12 focus-visible:ring-green-500"
                    placeholder="0.00"
                  />
               </div>
             </div>
           </div>

           {/* Resultado Calculado (Precio Venta) */}
           <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between items-center">
                <span className="text-slate-400 text-sm flex items-center gap-2">
                    <Calculator className="w-4 h-4"/> Precio Final al Cliente:
                </span>
                <span className="text-2xl font-bold text-[#00D4D4]">
                    ${precioVenta.toLocaleString('es-MX', {minimumFractionDigits: 2})}
                </span>
           </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t flex justify-end gap-3">
         <Button variant="outline" onClick={onCancelar}>Cancelar</Button>
         <Button onClick={handleSubmit} className="bg-[#00D4D4] hover:bg-[#00B8B8] px-8">Agregar Transporte</Button>
      </div>
    </Card>
  );
}

// =====================================================================
// ✅ Componente TransportesLista
// =====================================================================

export function TransportesLista({ items, onEliminar }: { items: TransporteItem[], onEliminar: (id: string) => void }) {
    if (items.length === 0) {
      return (
        <Card className="p-6 text-center text-gray-500 border-dashed bg-gray-50/50 mb-6">
          <Bus className="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <p>No hay transportes agregados</p>
        </Card>
      );
    }
  
    return (
      <div className="space-y-3 mb-6">
        {items.map((t) => (
          <Card key={t.id} className="p-4 hover:border-[#00D4D4] transition-all group">
            <div className="flex justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Bus className="w-5 h-5 text-[#00D4D4]" />
                        <span className="font-bold text-slate-700 uppercase">{t.tipo_transporte}</span>
                        {t.proveedor && <span className="text-sm text-slate-500">• {t.proveedor}</span>}
                    </div>
                    <p className="text-base font-medium text-slate-800 ml-7">{t.descripcion}</p>
                    {(t.origen || t.destino) && (
                        <p className="text-sm text-gray-500 ml-7 flex items-center gap-1 mt-1">
                           <MapPin className="w-3 h-3"/> {t.origen} → {t.destino} ({t.capacidad_pasajeros} pax)
                        </p>
                    )}
                </div>

                <div className="text-right flex flex-col justify-between min-w-[120px]">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Precio Venta</p>
                        <p className="font-bold text-lg text-[#00D4D4]">
                            ${t.precio_venta_total.toLocaleString('es-MX', {minimumFractionDigits: 2})}
                        </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onEliminar(t.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity h-8 px-2 self-end">
                        <X className="w-4 h-4 mr-1" /> Eliminar
                    </Button>
                </div>
            </div>
          </Card>
        ))}
      </div>
    );
}