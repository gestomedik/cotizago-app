'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plane, X, Clock, ArrowRight, ArrowRightLeft, DollarSign, Package, MapPin } from 'lucide-react';

export interface Vuelo {
  id: string;
  tipo_vuelo: 'sencillo' | 'redondo' | 'multidestino';
  clase: string;
  cantidad_pasajeros: number;

  // --- TRAYECTO IDA ---
  aerolinea: string;
  numero_vuelo: string;
  origen: string;
  destino: string;
  fecha_salida: string;
  hora_salida: string;
  fecha_llegada: string;
  hora_llegada: string;
  tiene_escala_ida: boolean;
  lugar_escala_ida?: string;
  duracion_escala_ida?: string;

  // --- TRAYECTO REGRESO ---
  aerolinea_regreso?: string;
  numero_vuelo_regreso?: string;
  origen_regreso?: string;
  destino_regreso?: string;
  fecha_regreso?: string;       
  hora_regreso?: string;        
  fecha_regreso_llegada?: string; 
  hora_regreso_llegada?: string;  
  tiene_escala_regreso?: boolean;
  lugar_escala_regreso?: string;
  duracion_escala_regreso?: string;

  // --- EXTRAS Y COSTOS ---
  incluye_equipaje_mano: boolean;
  incluye_equipaje_documentado: boolean;
  kg_equipaje_documentado: number;
  piezas_equipaje_documentado: number;
  incluye_seleccion_asiento: boolean;
  incluye_tua: boolean;
  costo_unitario: number;
  comision_vuelo: number;
  costo_total: number;
  total_con_comision: number;
  notas?: string;
}

interface VueloFormProps {
  onAgregar: (vuelo: Vuelo) => void;
  onCancelar: () => void;
  numPasajeros: number;
  // ✅ Props para defaults inteligentes
  defaultOrigen?: string;
  defaultDestino?: string;
  fechaInicioViaje?: string;
  fechaFinViaje?: string;
}

// ... (imports e interfaces siguen igual)

export function VueloForm({ 
  onAgregar, 
  onCancelar, 
  numPasajeros,
  defaultOrigen = '',
  defaultDestino = '',
  fechaInicioViaje = '',
  fechaFinViaje = ''
}: VueloFormProps) {

  const [vuelo, setVuelo] = useState<Partial<Vuelo>>({
    tipo_vuelo: 'sencillo',
    cantidad_pasajeros: numPasajeros,
    clase: 'economica',
    origen: defaultOrigen,
    destino: defaultDestino,
    fecha_salida: fechaInicioViaje,
    // ✅ Iniciamos la llegada con la misma fecha de salida si existe
    fecha_llegada: fechaInicioViaje,
    incluye_equipaje_mano: true,
    incluye_tua: true,
    costo_unitario: 0,
    comision_vuelo: 0,
  });

  // ✅ EFECTO 1: Si cambia la fecha de salida, y NO hay fecha de llegada, poner la misma.
  useEffect(() => {
    if (vuelo.fecha_salida && !vuelo.fecha_llegada) {
      setVuelo(prev => ({ ...prev, fecha_llegada: vuelo.fecha_salida }));
    }
  }, [vuelo.fecha_salida]);

  // ✅ EFECTO 2: Lo mismo para el regreso
  useEffect(() => {
    if (vuelo.fecha_regreso && !vuelo.fecha_regreso_llegada) {
      setVuelo(prev => ({ ...prev, fecha_regreso_llegada: vuelo.fecha_regreso }));
    }
  }, [vuelo.fecha_regreso]);

  // Efecto para pre-llenar datos de regreso al cambiar a 'redondo'
  useEffect(() => {
    if (vuelo.tipo_vuelo === 'redondo') {
      setVuelo(prev => ({
        ...prev,
        origen_regreso: prev.origen_regreso || prev.destino || defaultDestino,
        destino_regreso: prev.destino_regreso || prev.origen || defaultOrigen,
        fecha_regreso: prev.fecha_regreso || fechaFinViaje,
        // ✅ También pre-llenamos la llegada del regreso
        fecha_regreso_llegada: prev.fecha_regreso_llegada || fechaFinViaje, 
        aerolinea_regreso: prev.aerolinea_regreso || prev.aerolinea
      }));
    }
  }, [vuelo.tipo_vuelo, defaultOrigen, defaultDestino, fechaFinViaje, vuelo.aerolinea, vuelo.origen, vuelo.destino]);

  // ... (el resto del componente: handleChange, calcularDuracion, handleSubmit, return... sigue IGUAL)

  const handleChange = (field: string, value: any) => {
    setVuelo(prev => ({ ...prev, [field]: value }));
  };

  const calcularDuracion = (f1?: string, h1?: string, f2?: string, h2?: string) => {
    if (!f1 || !h1 || !f2 || !h2) return null;
    const inicio = new Date(`${f1}T${h1}`);
    const fin = new Date(`${f2}T${h2}`);
    const diff = fin.getTime() - inicio.getTime();
    if (diff < 0) return 'Revisar fechas';
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hrs}h ${mins}m`;
  };

  const handleSubmit = () => {
    const cantidad = vuelo.cantidad_pasajeros || 1;
    const costoU = vuelo.costo_unitario || 0;
    const comisionU = vuelo.comision_vuelo || 0;

    const nuevoVuelo: Vuelo = {
        id: Date.now().toString(),
        ...vuelo as Vuelo, // Cast rápido, idealmente validar
        cantidad_pasajeros: cantidad,
        costo_unitario: costoU,
        comision_vuelo: comisionU,
        costo_total: costoU * cantidad,
        total_con_comision: (costoU + comisionU) * cantidad,
        // Asegurar booleanos
        tiene_escala_ida: !!vuelo.tiene_escala_ida,
        tiene_escala_regreso: !!vuelo.tiene_escala_regreso,
        incluye_equipaje_mano: !!vuelo.incluye_equipaje_mano,
        incluye_equipaje_documentado: !!vuelo.incluye_equipaje_documentado,
        incluye_seleccion_asiento: !!vuelo.incluye_seleccion_asiento,
        incluye_tua: !!vuelo.incluye_tua,
        kg_equipaje_documentado: vuelo.kg_equipaje_documentado || 0,
        piezas_equipaje_documentado: vuelo.piezas_equipaje_documentado || 0,
    };
    onAgregar(nuevoVuelo);
  };

  const duracionIda = calcularDuracion(vuelo.fecha_salida, vuelo.hora_salida, vuelo.fecha_llegada, vuelo.hora_llegada);
  const duracionRegreso = calcularDuracion(vuelo.fecha_regreso, vuelo.hora_regreso, vuelo.fecha_regreso_llegada, vuelo.hora_regreso_llegada);

  return (
    <Card className="p-6 border-[#00D4D4]/20 shadow-lg">
      {/* --- ENCABEZADO DEL FORMULARIO --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-slate-50 p-4 rounded-xl">
        <div>
          <Label className="mb-2 block text-slate-700">Tipo de Viaje</Label>
          <div className="flex gap-1 bg-white p-1 rounded-lg border">
            {['sencillo', 'redondo'].map((tipo) => (
              <button
                key={tipo}
                onClick={() => handleChange('tipo_vuelo', tipo)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  vuelo.tipo_vuelo === tipo 
                    ? 'bg-[#00D4D4] text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tipo === 'sencillo' ? 'Sencillo (Solo Ida)' : 'Redondo (Ida y Vuelta)'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
           <div>
              <Label>Pasajeros</Label>
              <Input 
                type="number" 
                min="1" 
                value={vuelo.cantidad_pasajeros} 
                onChange={e => handleChange('cantidad_pasajeros', parseInt(e.target.value))} 
                className="w-24 mt-1"
              />
           </div>
           <div>
              <Label>Clase</Label>
              <select 
                value={vuelo.clase} 
                onChange={e => handleChange('clase', e.target.value)}
                className="h-10 px-3 py-2 mt-1 rounded-md border border-input bg-background text-sm"
              >
                <option value="economica">Económica</option>
                <option value="premium">Premium</option>
                <option value="ejecutiva">Ejecutiva</option>
              </select>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ================= COLUMNA IDA ================= */}
        <div className="space-y-4">
          <h4 className="font-bold text-blue-900 flex items-center gap-2 border-b pb-2">
            <Plane className="w-5 h-5 rotate-45" /> ITINERARIO DE IDA
            {duracionIda && <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-normal">{duracionIda}</span>}
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Aerolínea</Label><Input placeholder="Ej. Aeroméxico" value={vuelo.aerolinea || ''} onChange={e => handleChange('aerolinea', e.target.value)} /></div>
            <div><Label>No. Vuelo</Label><Input placeholder="Ej. AM123" value={vuelo.numero_vuelo || ''} onChange={e => handleChange('numero_vuelo', e.target.value)} /></div>
            <div><Label>Origen</Label><div className="relative"><MapPin className="w-4 h-4 absolute left-2.5 top-3 text-gray-400"/><Input className="pl-8" placeholder="Origen" value={vuelo.origen || ''} onChange={e => handleChange('origen', e.target.value)} /></div></div>
            <div><Label>Destino</Label><div className="relative"><MapPin className="w-4 h-4 absolute left-2.5 top-3 text-gray-400"/><Input className="pl-8" placeholder="Destino" value={vuelo.destino || ''} onChange={e => handleChange('destino', e.target.value)} /></div></div>
          </div>

          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
  {/* CAMBIO AQUÍ: grid-cols-1 para que estén en un solo renglón vertical */}
  <div className="grid grid-cols-1 gap-4">
    
    {/* Renglón 1: SALIDA */}
    <div>
      <Label className="text-blue-800 text-xs mb-1 block">SALIDA</Label>
      <div className="flex gap-2">
        <Input 
          type="date" 
          value={vuelo.fecha_salida || ''} 
          onChange={e => handleChange('fecha_salida', e.target.value)} 
          className="bg-white flex-1"
        />
        <Input 
          type="time" 
          value={vuelo.hora_salida || ''} 
          onChange={e => handleChange('hora_salida', e.target.value)} 
          className="bg-white w-28" 
        />
      </div>
    </div>

    {/* Renglón 2: LLEGADA (Ahora aparecerá abajo) */}
    <div>
      <Label className="text-blue-800 text-xs mb-1 block">LLEGADA</Label>
      <div className="flex gap-2">
        <Input 
          type="date" 
          value={vuelo.fecha_llegada || ''} 
          onChange={e => handleChange('fecha_llegada', e.target.value)} 
          className="bg-white flex-1"
        />
        <Input 
          type="time" 
          value={vuelo.hora_llegada || ''} 
          onChange={e => handleChange('hora_llegada', e.target.value)} 
          className="bg-white w-28" 
        />
      </div>
    </div>

  </div>
</div>

          {/* Escalas IDA */}
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-orange-500" checked={vuelo.tiene_escala_ida || false} onChange={e => handleChange('tiene_escala_ida', e.target.checked)} /><span className="text-sm font-medium text-orange-900">¿Tiene escala?</span></label>
            {vuelo.tiene_escala_ida && (
              <div className="grid grid-cols-2 gap-3 mt-3 pl-4 border-l-2 border-orange-300">
                <div><Label className="text-xs">¿Dónde?</Label><Input placeholder="Ej. MEX" value={vuelo.lugar_escala_ida || ''} onChange={e => handleChange('lugar_escala_ida', e.target.value)} className="bg-white h-8 text-sm" /></div>
                <div><Label className="text-xs">Duración</Label><Input placeholder="Ej. 2h 30m" value={vuelo.duracion_escala_ida || ''} onChange={e => handleChange('duracion_escala_ida', e.target.value)} className="bg-white h-8 text-sm" /></div>
              </div>
            )}
          </div>
        </div>

        {/* ================= COLUMNA REGRESO (Condicional) ================= */}
        {vuelo.tipo_vuelo === 'redondo' ? (
          <div className="space-y-4">
            <h4 className="font-bold text-purple-900 flex items-center gap-2 border-b pb-2">
              <Plane className="w-5 h-5 -rotate-135" /> ITINERARIO DE REGRESO
              {duracionRegreso && <span className="ml-auto text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-normal">{duracionRegreso}</span>}
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div><Label>Aerolínea</Label><Input placeholder="Ej. Aeroméxico" value={vuelo.aerolinea_regreso || ''} onChange={e => handleChange('aerolinea_regreso', e.target.value)} /></div>
              <div><Label>No. Vuelo</Label><Input placeholder="Ej. AM405" value={vuelo.numero_vuelo_regreso || ''} onChange={e => handleChange('numero_vuelo_regreso', e.target.value)} /></div>
              <div><Label>Origen (Regreso)</Label><div className="relative"><MapPin className="w-4 h-4 absolute left-2.5 top-3 text-gray-400"/><Input className="pl-8" value={vuelo.origen_regreso || ''} onChange={e => handleChange('origen_regreso', e.target.value)} /></div></div>
              <div><Label>Destino (Regreso)</Label><div className="relative"><MapPin className="w-4 h-4 absolute left-2.5 top-3 text-gray-400"/><Input className="pl-8" value={vuelo.destino_regreso || ''} onChange={e => handleChange('destino_regreso', e.target.value)} /></div></div>
            </div>

            <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
  {/* CAMBIO AQUÍ: grid-cols-1 para apilarlos verticalmente */}
  <div className="grid grid-cols-1 gap-4">
    
    {/* Renglón 1: SALIDA (Regreso) */}
    <div>
      <Label className="text-purple-800 text-xs mb-1 block">SALIDA (Regreso)</Label>
      <div className="flex gap-2">
        <Input 
          type="date" 
          value={vuelo.fecha_regreso || ''} 
          onChange={e => handleChange('fecha_regreso', e.target.value)} 
          className="bg-white border-purple-200 flex-1" 
        />
        <Input 
          type="time" 
          value={vuelo.hora_regreso || ''} 
          onChange={e => handleChange('hora_regreso', e.target.value)} 
          className="bg-white border-purple-200 w-28" 
        />
      </div>
    </div>

    {/* Renglón 2: LLEGADA (Regreso) */}
    <div>
      <Label className="text-purple-800 text-xs mb-1 block">LLEGADA (Regreso)</Label>
      <div className="flex gap-2">
        <Input 
          type="date" 
          value={vuelo.fecha_regreso_llegada || ''} 
          onChange={e => handleChange('fecha_regreso_llegada', e.target.value)} 
          className="bg-white border-purple-200 flex-1" 
        />
        <Input 
          type="time" 
          value={vuelo.hora_regreso_llegada || ''} 
          onChange={e => handleChange('hora_regreso_llegada', e.target.value)} 
          className="bg-white border-purple-200 w-28" 
        />
      </div>
    </div>

  </div>
</div>

            {/* Escalas REGRESO */}
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-orange-500" checked={vuelo.tiene_escala_regreso || false} onChange={e => handleChange('tiene_escala_regreso', e.target.checked)} /><span className="text-sm font-medium text-orange-900">¿Tiene escala al regreso?</span></label>
              {vuelo.tiene_escala_regreso && (
                <div className="grid grid-cols-2 gap-3 mt-3 pl-4 border-l-2 border-orange-300">
                  <div><Label className="text-xs">¿Dónde?</Label><Input placeholder="Ej. MTY" value={vuelo.lugar_escala_regreso || ''} onChange={e => handleChange('lugar_escala_regreso', e.target.value)} className="bg-white h-8 text-sm" /></div>
                  <div><Label className="text-xs">Duración</Label><Input placeholder="Ej. 1h 45m" value={vuelo.duracion_escala_regreso || ''} onChange={e => handleChange('duracion_escala_regreso', e.target.value)} className="bg-white h-8 text-sm" /></div>
                </div>
              )}
            </div>

          </div>
        ) : (
          // Placeholder cuando es sencillo para mantener el grid balanceado
          <div className="hidden lg:flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 text-gray-400">
            <div className="text-center">
              <ArrowRightLeft className="w-10 h-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm">Selecciona "Redondo" para agregar regreso</p>
            </div>
          </div>
        )}
      </div>

      {/* --- SECCIÓN INFERIOR: EXTRAS Y COSTOS --- */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t">
        
        {/* Columna 1: Equipaje */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-medium flex items-center gap-2"><Package className="w-4 h-4" /> Equipaje y Servicios</h4>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={vuelo.incluye_equipaje_mano ?? true} onChange={e => handleChange('incluye_equipaje_mano', e.target.checked)} className="accent-[#00D4D4]"/> <span className="text-sm">Equipaje Mano</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={vuelo.incluye_tua ?? true} onChange={e => handleChange('incluye_tua', e.target.checked)} className="accent-[#00D4D4]"/> <span className="text-sm">TUA Incluido</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={vuelo.incluye_seleccion_asiento ?? false} onChange={e => handleChange('incluye_seleccion_asiento', e.target.checked)} className="accent-[#00D4D4]"/> <span className="text-sm">Selección Asiento</span></label>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap"><input type="checkbox" checked={vuelo.incluye_equipaje_documentado ?? false} onChange={e => handleChange('incluye_equipaje_documentado', e.target.checked)} className="accent-[#00D4D4]"/> <span className="text-sm font-medium">Equipaje Documentado</span></label>
            {vuelo.incluye_equipaje_documentado && (
               <div className="flex gap-2 w-full">
                 <Input type="number" min="0" placeholder="Piezas" className="h-8 text-sm" value={vuelo.piezas_equipaje_documentado || ''} onChange={e => handleChange('piezas_equipaje_documentado', parseInt(e.target.value))} />
                 <Input type="number" min="0" placeholder="Kg máx" className="h-8 text-sm" value={vuelo.kg_equipaje_documentado || ''} onChange={e => handleChange('kg_equipaje_documentado', parseInt(e.target.value))} />
               </div>
            )}
          </div>
        </div>

        {/* Columna 2: Costos (¡Rediseñado!) */}
        <div className="bg-slate-800 p-5 rounded-xl text-white shadow-xl">
           <h4 className="font-medium mb-4 flex items-center gap-2 text-[#00D4D4]">
             <DollarSign className="w-5 h-5" /> Definición de Costos
           </h4>
           <div className="space-y-4">
             <div>
               <label className="text-xs text-slate-400">Costo Neto (Unitario)</label>
               <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <Input 
                    type="number" min="0" step="0.01" 
                    value={vuelo.costo_unitario || ''} 
                    onChange={e => handleChange('costo_unitario', parseFloat(e.target.value) || 0)}
                    className="bg-slate-700 border-slate-600 text-white pl-7 focus-visible:ring-[#00D4D4]"
                    placeholder="0.00"
                  />
               </div>
             </div>
             <div>
               <label className="text-xs text-green-400 font-medium">Tu Comisión (Unitario)</label>
               <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">$</span>
                  <Input 
                    type="number" min="0" step="0.01" 
                    value={vuelo.comision_vuelo || ''} 
                    onChange={e => handleChange('comision_vuelo', parseFloat(e.target.value) || 0)}
                    className="bg-green-900/30 border-green-800 text-green-400 font-bold pl-7 focus-visible:ring-green-500"
                    placeholder="0.00"
                  />
               </div>
             </div>
             <div className="pt-3 border-t border-slate-700">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-slate-400">Precio Venta Unitario</p>
                    <p className="text-lg font-bold text-[#00D4D4]">
                      ${((vuelo.costo_unitario||0) + (vuelo.comision_vuelo||0)).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Total ({vuelo.cantidad_pasajeros} pax)</p>
                    <p className="text-xl font-bold text-white">
                      ${(((vuelo.costo_unitario||0) + (vuelo.comision_vuelo||0)) * (vuelo.cantidad_pasajeros||1)).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                    </p>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </div>

      {/* Botones Finales */}
      <div className="mt-6 pt-4 border-t flex justify-end gap-3">
         <Button variant="outline" onClick={onCancelar}>Cancelar</Button>
         <Button onClick={handleSubmit} className="bg-[#00D4D4] hover:bg-[#00B8B8] px-8">Agregar Vuelo al Viaje</Button>
      </div>
    </Card>
  );
}

// Componente VuelosLista: Solo necesita una pequeña actualización para mostrar si es redondo
export function VuelosLista({ vuelos, onEliminar }: { vuelos: Vuelo[], onEliminar: (id: string) => void }) {
    if (vuelos.length === 0) return null; // O tu estado vacío
    return (
        <div className="space-y-3">
            {vuelos.map(v => (
                <Card key={v.id} className="p-4 flex justify-between items-center hover:border-[#00D4D4] transition-all">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${v.tipo_vuelo === 'redondo' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{v.tipo_vuelo}</span>
                            <span className="font-bold">{v.aerolinea}</span>
                        </div>
                        <div className="text-sm mt-1">
                            {v.origen} <ArrowRight className="w-3 h-3 inline mx-1 text-gray-400"/> {v.destino}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-[#00D4D4]">${v.total_con_comision.toLocaleString()}</p>
                        <Button variant="ghost" size="sm" onClick={() => onEliminar(v.id)} className="text-red-500 h-auto p-1"><X className="w-4 h-4"/></Button>
                    </div>
                </Card>
            ))}
        </div>
    )
}