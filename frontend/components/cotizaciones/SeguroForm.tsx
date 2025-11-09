'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ShieldCheck, DollarSign, Calculator } from 'lucide-react';

// Definimos el tipo de datos para el seguro
export interface SeguroData {
  aseguradora: string;
  tipo_cobertura: string;
  costo_total: number;        // Costo Neto
  comision: number;           // Comisión
  precio_venta_total: number; // Calculado (Costo + Comisión)
  notas?: string;
}

interface SeguroFormProps {
  data: SeguroData;
  onChange: (newData: SeguroData) => void;
}

export function SeguroForm({ data, onChange }: SeguroFormProps) {
  
  // Función para actualizar el estado y recalcular el precio de venta automáticamente
  const handleChange = (field: keyof SeguroData, value: any) => {
    const newData = { ...data, [field]: value };
    
    // Si cambian los costos, recalculamos el total
    if (field === 'costo_total' || field === 'comision') {
        const costo = parseFloat(newData.costo_total as any) || 0;
        const comi = parseFloat(newData.comision as any) || 0;
        newData.precio_venta_total = costo + comi;
    }
    
    onChange(newData);
  };

  return (
    <Card className="p-6 border-blue-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b">
        <div className="bg-blue-100 p-2.5 rounded-full">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
        </div>
        <div>
            <h3 className="font-bold text-xl text-slate-800">Seguro de Viaje</h3>
            <p className="text-sm text-slate-500">Opcional: Agrega protección al viaje</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna Izquierda: Datos Básicos */}
        <div className="space-y-4">
            <div>
                <Label>Aseguradora</Label>
                <Input 
                    value={data.aseguradora} 
                    onChange={e => handleChange('aseguradora', e.target.value)} 
                    placeholder="Ej: Assist Card, Universal Assistance" 
                    className="mt-1.5" 
                />
            </div>
            <div>
                <Label>Tipo de Cobertura / Plan</Label>
                <Input 
                    value={data.tipo_cobertura} 
                    onChange={e => handleChange('tipo_cobertura', e.target.value)} 
                    placeholder="Ej: Cobertura Amplia COVID-19" 
                    className="mt-1.5" 
                />
            </div>
        </div>

        {/* Columna Derecha: Costos (Lógica Adelante) */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
           <h4 className="font-medium mb-4 flex items-center gap-2 text-slate-700">
             <DollarSign className="w-5 h-5" /> Costos del Seguro
           </h4>
           
           <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label className="text-xs text-slate-500 mb-1.5">Costo Neto</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <Input type="number" min="0" value={data.costo_total || ''} onChange={e => handleChange('costo_total', parseFloat(e.target.value) || 0)} className="pl-7 bg-white" placeholder="0.00" />
                    </div>
                </div>
                <div>
                    <Label className="text-xs text-green-600 mb-1.5">Tu Comisión</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600">$</span>
                        <Input type="number" min="0" value={data.comision || ''} onChange={e => handleChange('comision', parseFloat(e.target.value) || 0)} className="pl-7 bg-green-50 border-green-200 text-green-700 font-medium" placeholder="0.00" />
                    </div>
                </div>
             </div>

             {/* Total Calculado */}
             <div className="pt-3 border-t flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                      <Calculator className="w-4 h-4"/> Precio Venta Total:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                      ${(data.precio_venta_total || 0).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                  </span>
             </div>
           </div>
        </div>
      </div>
    </Card>
  );
}