'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plane, X } from 'lucide-react';

interface Vuelo {
  id: string;
  aerolinea: string;
  numero_vuelo: string;
  origen: string;
  destino: string;
  fecha_salida: string;
  hora_salida: string;
  fecha_llegada: string;
  hora_llegada: string;
  clase: string;
  tipo_vuelo: string;
  escalas: number;
  costo_unitario: number;
  cantidad_pasajeros: number;
  
  // Nuevos campos de equipaje
  incluye_equipaje_mano: boolean;
  incluye_equipaje_documentado: boolean;
  kg_equipaje_documentado: number;
  piezas_equipaje_documentado: number;
  incluye_seleccion_asiento: boolean;
  incluye_tua: boolean;
  
  // Comisión
  comision_vuelo: number;
  
  // Calculados
  costo_total: number;
  total_con_comision: number;
}

interface VueloFormProps {
  onAgregar: (vuelo: Vuelo) => void;
  onCancelar: () => void;
  numPasajeros: number;
}

export function VueloForm({ onAgregar, onCancelar, numPasajeros }: VueloFormProps) {
  const [vuelo, setVuelo] = useState<Partial<Vuelo>>({
    cantidad_pasajeros: numPasajeros,
    escalas: 0,
    costo_unitario: 0,
    incluye_equipaje_mano: true,
    incluye_equipaje_documentado: false,
    kg_equipaje_documentado: 0,
    piezas_equipaje_documentado: 0,
    incluye_seleccion_asiento: false,
    incluye_tua: true,
    comision_vuelo: 0,
  });

  const handleChange = (field: string, value: any) => {
    setVuelo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calcularTotal = () => {
    const costoTotal = (vuelo.costo_unitario || 0) * (vuelo.cantidad_pasajeros || 1);
    const totalConComision = costoTotal + (vuelo.comision_vuelo || 0);
    return { costoTotal, totalConComision };
  };

  const handleSubmit = () => {
    const { costoTotal, totalConComision } = calcularTotal();
    
    const vueloCompleto: Vuelo = {
      id: Date.now().toString(),
      aerolinea: vuelo.aerolinea || '',
      numero_vuelo: vuelo.numero_vuelo || '',
      origen: vuelo.origen || '',
      destino: vuelo.destino || '',
      fecha_salida: vuelo.fecha_salida || '',
      hora_salida: vuelo.hora_salida || '',
      fecha_llegada: vuelo.fecha_llegada || '',
      hora_llegada: vuelo.hora_llegada || '',
      clase: vuelo.clase || 'economica',
      tipo_vuelo: vuelo.tipo_vuelo || 'redondo',
      escalas: vuelo.escalas || 0,
      costo_unitario: vuelo.costo_unitario || 0,
      cantidad_pasajeros: vuelo.cantidad_pasajeros || numPasajeros,
      incluye_equipaje_mano: vuelo.incluye_equipaje_mano ?? true,
      incluye_equipaje_documentado: vuelo.incluye_equipaje_documentado ?? false,
      kg_equipaje_documentado: vuelo.kg_equipaje_documentado || 0,
      piezas_equipaje_documentado: vuelo.piezas_equipaje_documentado || 0,
      incluye_seleccion_asiento: vuelo.incluye_seleccion_asiento ?? false,
      incluye_tua: vuelo.incluye_tua ?? true,
      comision_vuelo: vuelo.comision_vuelo || 0,
      costo_total: costoTotal,
      total_con_comision: totalConComision,
    };
    
    onAgregar(vueloCompleto);
  };

  const { costoTotal, totalConComision } = calcularTotal();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Plane className="w-5 h-5 text-[#00D4D4]" />
          <h3 className="font-semibold text-lg">Agregar Vuelo</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancelar}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Información básica */}
        <div>
          <Label>Aerolínea *</Label>
          <Input
            value={vuelo.aerolinea || ''}
            onChange={(e) => handleChange('aerolinea', e.target.value)}
            placeholder="Ej: Aeroméxico"
          />
        </div>

        <div>
          <Label>Número de vuelo</Label>
          <Input
            value={vuelo.numero_vuelo || ''}
            onChange={(e) => handleChange('numero_vuelo', e.target.value)}
            placeholder="Ej: AM123"
          />
        </div>

        <div>
          <Label>Origen *</Label>
          <Input
            value={vuelo.origen || ''}
            onChange={(e) => handleChange('origen', e.target.value)}
            placeholder="Ej: Ciudad de México"
          />
        </div>

        <div>
          <Label>Destino *</Label>
          <Input
            value={vuelo.destino || ''}
            onChange={(e) => handleChange('destino', e.target.value)}
            placeholder="Ej: Cancún"
          />
        </div>

        {/* Fechas y horas */}
        <div>
          <Label>Fecha de salida *</Label>
          <Input
            type="date"
            value={vuelo.fecha_salida || ''}
            onChange={(e) => handleChange('fecha_salida', e.target.value)}
          />
        </div>

        <div>
          <Label>Hora de salida *</Label>
          <Input
            type="time"
            value={vuelo.hora_salida || ''}
            onChange={(e) => handleChange('hora_salida', e.target.value)}
          />
        </div>

        <div>
          <Label>Fecha de llegada *</Label>
          <Input
            type="date"
            value={vuelo.fecha_llegada || ''}
            onChange={(e) => handleChange('fecha_llegada', e.target.value)}
          />
        </div>

        <div>
          <Label>Hora de llegada *</Label>
          <Input
            type="time"
            value={vuelo.hora_llegada || ''}
            onChange={(e) => handleChange('hora_llegada', e.target.value)}
          />
        </div>

        {/* Tipo y clase */}
        <div>
          <Label>Tipo de vuelo</Label>
          <select
            value={vuelo.tipo_vuelo || 'redondo'}
            onChange={(e) => handleChange('tipo_vuelo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="redondo">Redondo</option>
            <option value="sencillo">Sencillo</option>
            <option value="multidestino">Multidestino</option>
          </select>
        </div>

        <div>
          <Label>Clase</Label>
          <select
            value={vuelo.clase || 'economica'}
            onChange={(e) => handleChange('clase', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="economica">Económica</option>
            <option value="premium_economy">Premium Economy</option>
            <option value="ejecutiva">Ejecutiva</option>
            <option value="primera_clase">Primera Clase</option>
          </select>
        </div>

        <div>
          <Label>Escalas</Label>
          <Input
            type="number"
            min="0"
            value={vuelo.escalas || 0}
            onChange={(e) => handleChange('escalas', parseInt(e.target.value))}
          />
        </div>

        <div>
          <Label>Cantidad de pasajeros *</Label>
          <Input
            type="number"
            min="1"
            value={vuelo.cantidad_pasajeros || numPasajeros}
            onChange={(e) => handleChange('cantidad_pasajeros', parseInt(e.target.value))}
          />
        </div>
      </div>

      {/* Equipaje e inclusiones */}
      <div className="mt-6">
        <h4 className="font-medium mb-3">Equipaje e Inclusiones</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="equipaje_mano"
              checked={vuelo.incluye_equipaje_mano ?? true}
              onChange={(e) => handleChange('incluye_equipaje_mano', e.target.checked)}
              className="w-4 h-4 text-[#00D4D4] rounded"
            />
            <Label htmlFor="equipaje_mano" className="cursor-pointer">
              Incluye equipaje de mano
            </Label>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="equipaje_documentado"
                checked={vuelo.incluye_equipaje_documentado ?? false}
                onChange={(e) => handleChange('incluye_equipaje_documentado', e.target.checked)}
                className="w-4 h-4 text-[#00D4D4] rounded"
              />
              <Label htmlFor="equipaje_documentado" className="cursor-pointer">
                Incluye equipaje documentado
              </Label>
            </div>

            {vuelo.incluye_equipaje_documentado && (
              <div className="ml-6 grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Kilogramos permitidos</Label>
                  <Input
                    type="number"
                    min="0"
                    value={vuelo.kg_equipaje_documentado || 0}
                    onChange={(e) => handleChange('kg_equipaje_documentado', parseInt(e.target.value))}
                    placeholder="Ej: 23"
                  />
                </div>
                <div>
                  <Label className="text-sm">Piezas permitidas</Label>
                  <Input
                    type="number"
                    min="0"
                    value={vuelo.piezas_equipaje_documentado || 0}
                    onChange={(e) => handleChange('piezas_equipaje_documentado', parseInt(e.target.value))}
                    placeholder="Ej: 2"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="seleccion_asiento"
              checked={vuelo.incluye_seleccion_asiento ?? false}
              onChange={(e) => handleChange('incluye_seleccion_asiento', e.target.checked)}
              className="w-4 h-4 text-[#00D4D4] rounded"
            />
            <Label htmlFor="seleccion_asiento" className="cursor-pointer">
              Incluye selección de asiento
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="tua"
              checked={vuelo.incluye_tua ?? true}
              onChange={(e) => handleChange('incluye_tua', e.target.checked)}
              className="w-4 h-4 text-[#00D4D4] rounded"
            />
            <Label htmlFor="tua" className="cursor-pointer">
              Incluye TUA (Tarifa de Uso de Aeropuerto)
            </Label>
          </div>
        </div>
      </div>

      {/* Costos */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Costo por pasajero *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={vuelo.costo_unitario || 0}
              onChange={(e) => handleChange('costo_unitario', parseFloat(e.target.value) || 0)}
              className="pl-7"
            />
          </div>
        </div>

        <div>
          <Label>Comisión del vuelo</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={vuelo.comision_vuelo || 0}
              onChange={(e) => handleChange('comision_vuelo', parseFloat(e.target.value) || 0)}
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
              ${(vuelo.costo_unitario || 0).toFixed(2)} × {vuelo.cantidad_pasajeros || 1} pax
            </p>
          </div>
          <div>
            <p className="text-gray-600">Comisión</p>
            <p className="font-semibold text-lg text-green-600">
              +${(vuelo.comision_vuelo || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
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
          Agregar Vuelo
        </Button>
        <Button onClick={onCancelar} variant="outline" className="flex-1">
          Cancelar
        </Button>
      </div>
    </Card>
  );
}

// Lista de vuelos agregados
interface VuelosListaProps {
  vuelos: Vuelo[];
  onEliminar: (id: string) => void;
}

export function VuelosLista({ vuelos, onEliminar }: VuelosListaProps) {
  if (vuelos.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500">
        <Plane className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>No se han agregado vuelos</p>
      </Card>
    );
  }

  const totalVuelos = vuelos.reduce((sum, v) => sum + v.costo_total, 0);
  const totalComisiones = vuelos.reduce((sum, v) => sum + v.comision_vuelo, 0);
  const totalGeneral = vuelos.reduce((sum, v) => sum + v.total_con_comision, 0);

  return (
    <div className="space-y-3">
      {vuelos.map((vuelo) => (
        <Card key={vuelo.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Plane className="w-4 h-4 text-[#00D4D4]" />
                <span className="font-semibold">{vuelo.aerolinea}</span>
                {vuelo.numero_vuelo && (
                  <span className="text-sm text-gray-500">({vuelo.numero_vuelo})</span>
                )}
              </div>
              
              <div className="text-sm space-y-1">
                <p className="font-medium">{vuelo.origen} → {vuelo.destino}</p>
                <p className="text-gray-600">
                  Salida: {vuelo.fecha_salida} {vuelo.hora_salida} | 
                  Llegada: {vuelo.fecha_llegada} {vuelo.hora_llegada}
                </p>
                <p className="text-gray-600">
                  {vuelo.clase} • {vuelo.tipo_vuelo} • {vuelo.escalas} escala(s)
                </p>
                <p className="text-gray-600">
                  {vuelo.cantidad_pasajeros} pasajero(s)
                </p>
                
                {/* Inclusiones */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {vuelo.incluye_equipaje_mano && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Equipaje de mano
                    </span>
                  )}
                  {vuelo.incluye_equipaje_documentado && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {vuelo.piezas_equipaje_documentado} maleta(s) de {vuelo.kg_equipaje_documentado} kg
                    </span>
                  )}
                  {vuelo.incluye_seleccion_asiento && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Selección de asiento
                    </span>
                  )}
                  {vuelo.incluye_tua && (
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      TUA incluido
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-right ml-4">
              <div className="mb-2">
                <p className="text-xs text-gray-500">Base</p>
                <p className="font-medium">${vuelo.costo_total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="mb-2">
                <p className="text-xs text-gray-500">Comisión</p>
                <p className="font-medium text-green-600">+${vuelo.comision_vuelo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="mb-3">
                <p className="text-xs text-gray-500">Total</p>
                <p className="font-bold text-lg text-[#00D4D4]">
                  ${vuelo.total_con_comision.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEliminar(vuelo.id)}
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
            <p className="text-sm text-gray-600">Total vuelos</p>
            <p className="text-lg font-bold">${totalVuelos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
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
