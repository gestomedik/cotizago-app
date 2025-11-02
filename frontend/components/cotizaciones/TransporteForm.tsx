'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Bus, X } from 'lucide-react';

interface Transporte {
  id: string;
  tipo_transporte: string;
  proveedor: string;
  origen: string;
  destino: string;
  fecha_servicio: string;
  hora: string;
  capacidad_pasajeros: number;
  costo_total: number;
  comision_transporte: number;
  total_con_comision: number;
}

interface TransporteFormProps {
  onAgregar: (transporte: Transporte) => void;
  onCancelar: () => void;
}

export function TransporteForm({ onAgregar, onCancelar }: TransporteFormProps) {
  const [transporte, setTransporte] = useState<Partial<Transporte>>({
    tipo_transporte: 'terrestre',
    capacidad_pasajeros: 1,
    costo_total: 0,
    comision_transporte: 0,
  });

  const handleChange = (field: string, value: any) => {
    setTransporte(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calcularTotal = () => {
    const costoBase = transporte.costo_total || 0;
    const comision = transporte.comision_transporte || 0;
    const total = costoBase + comision;
    
    return { costoBase, comision, total };
  };

  const handleSubmit = () => {
    const { costoBase, comision, total } = calcularTotal();
    
    const transporteCompleto: Transporte = {
      id: Date.now().toString(),
      tipo_transporte: transporte.tipo_transporte || 'terrestre',
      proveedor: transporte.proveedor || '',
      origen: transporte.origen || '',
      destino: transporte.destino || '',
      fecha_servicio: transporte.fecha_servicio || '',
      hora: transporte.hora || '',
      capacidad_pasajeros: transporte.capacidad_pasajeros || 1,
      costo_total: costoBase,
      comision_transporte: comision,
      total_con_comision: total,
    };
    
    onAgregar(transporteCompleto);
  };

  const { costoBase, comision, total } = calcularTotal();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bus className="w-5 h-5 text-[#00D4D4]" />
          <h3 className="font-semibold text-lg">Agregar Transporte</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancelar}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Tipo de transporte *</Label>
          <select
            value={transporte.tipo_transporte || 'terrestre'}
            onChange={(e) => handleChange('tipo_transporte', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="terrestre">Terrestre</option>
            <option value="aereo">Aéreo</option>
            <option value="maritimo">Marítimo</option>
          </select>
        </div>

        <div>
          <Label>Proveedor</Label>
          <Input
            value={transporte.proveedor || ''}
            onChange={(e) => handleChange('proveedor', e.target.value)}
            placeholder="Nombre del proveedor"
          />
        </div>

        <div>
          <Label>Origen *</Label>
          <Input
            value={transporte.origen || ''}
            onChange={(e) => handleChange('origen', e.target.value)}
            placeholder="Ej: Aeropuerto"
          />
        </div>

        <div>
          <Label>Destino *</Label>
          <Input
            value={transporte.destino || ''}
            onChange={(e) => handleChange('destino', e.target.value)}
            placeholder="Ej: Hotel"
          />
        </div>

        <div>
          <Label>Fecha del servicio *</Label>
          <Input
            type="date"
            value={transporte.fecha_servicio || ''}
            onChange={(e) => handleChange('fecha_servicio', e.target.value)}
          />
        </div>

        <div>
          <Label>Hora</Label>
          <Input
            type="time"
            value={transporte.hora || ''}
            onChange={(e) => handleChange('hora', e.target.value)}
          />
        </div>

        <div>
          <Label>Capacidad de pasajeros</Label>
          <Input
            type="number"
            min="1"
            value={transporte.capacidad_pasajeros || 1}
            onChange={(e) => handleChange('capacidad_pasajeros', parseInt(e.target.value))}
          />
        </div>

        <div>
          <Label>Costo del transporte *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={transporte.costo_total || 0}
              onChange={(e) => handleChange('costo_total', parseFloat(e.target.value) || 0)}
              className="pl-7"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <Label>Comisión del transporte</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={transporte.comision_transporte || 0}
              onChange={(e) => handleChange('comision_transporte', parseFloat(e.target.value) || 0)}
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
              ${costoBase.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Comisión</p>
            <p className="font-semibold text-lg text-green-600">
              +${comision.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Total</p>
            <p className="font-semibold text-xl text-[#00D4D4]">
              ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="mt-6 flex gap-3">
        <Button onClick={handleSubmit} className="flex-1 bg-[#00D4D4] hover:bg-[#00B8B8]">
          Agregar Transporte
        </Button>
        <Button onClick={onCancelar} variant="outline" className="flex-1">
          Cancelar
        </Button>
      </div>
    </Card>
  );
}

// Lista de transportes agregados
interface TransportesListaProps {
  transportes: Transporte[];
  onEliminar: (id: string) => void;
}

export function TransportesLista({ transportes, onEliminar }: TransportesListaProps) {
  if (transportes.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500">
        <Bus className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>No se han agregado transportes</p>
      </Card>
    );
  }

  const totalTransportes = transportes.reduce((sum, t) => sum + t.costo_total, 0);
  const totalComisiones = transportes.reduce((sum, t) => sum + t.comision_transporte, 0);
  const totalGeneral = transportes.reduce((sum, t) => sum + t.total_con_comision, 0);

  return (
    <div className="space-y-3">
      {transportes.map((transporte) => (
        <Card key={transporte.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Bus className="w-4 h-4 text-[#00D4D4]" />
                <span className="font-semibold">{transporte.tipo_transporte}</span>
                {transporte.proveedor && (
                  <span className="text-sm text-gray-500">• {transporte.proveedor}</span>
                )}
              </div>
              
              <div className="text-sm space-y-1">
                <p className="font-medium">{transporte.origen} → {transporte.destino}</p>
                <p className="text-gray-600">
                  Fecha: {transporte.fecha_servicio} {transporte.hora && `• ${transporte.hora}`}
                </p>
                <p className="text-gray-600">
                  Capacidad: {transporte.capacidad_pasajeros} pasajero(s)
                </p>
              </div>
            </div>
            
            <div className="text-right ml-4">
              <div className="mb-2">
                <p className="text-xs text-gray-500">Base</p>
                <p className="font-medium">${transporte.costo_total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="mb-2">
                <p className="text-xs text-gray-500">Comisión</p>
                <p className="font-medium text-green-600">+${transporte.comision_transporte.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="mb-3">
                <p className="text-xs text-gray-500">Total</p>
                <p className="font-bold text-lg text-[#00D4D4]">
                  ${transporte.total_con_comision.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEliminar(transporte.id)}
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
            <p className="text-sm text-gray-600">Total transportes</p>
            <p className="text-lg font-bold">${totalTransportes.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
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
