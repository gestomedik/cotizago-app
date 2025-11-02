// components/vuelo-form-ampliado.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Plane,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { 
  VueloAmpliado, 
  defaultVueloAmpliado, 
  CLASES_VUELO,
  vueloToBackendPayload 
} from "@/types/vuelo"
import {
  actualizarPorCostoUnitario,
  actualizarPorCostoTotal,
  actualizarPorPrecioVentaUnitario,
  actualizarPorPrecioVentaTotal,
  construirRuta,
  validarVuelo,
  formatearMoneda,
  getColorUtilidad,
} from "@/lib/vuelo-calculations"

interface VueloFormAmpliadoProps {
  vuelos: VueloAmpliado[]
  setVuelos: (vuelos: VueloAmpliado[]) => void
  origen: string // Del paso de Destino
  destino: string // Del paso de Destino
  numPasajeros: number // Calculado de pasajeros seleccionados
  fechaSalida: string // Del paso de Destino
  fechaRegreso: string // Del paso de Destino
}

export function VueloFormAmpliado({
  vuelos,
  setVuelos,
  origen,
  destino,
  numPasajeros,
  fechaSalida,
  fechaRegreso,
}: VueloFormAmpliadoProps) {
  const [newVuelo, setNewVuelo] = useState<VueloAmpliado>(defaultVueloAmpliado)
  const [errores, setErrores] = useState<string[]>([])
  
  // Secciones colapsables
  const [seccionBasica, setSeccionBasica] = useState(true)
  const [seccionFechas, setSeccionFechas] = useState(true)
  const [seccionEscalas, setSeccionEscalas] = useState(false)
  const [seccionEquipaje, setSeccionEquipaje] = useState(false)
  const [seccionCostos, setSeccionCostos] = useState(true)
  const [seccionNotas, setSeccionNotas] = useState(false)

  // Inicializar con datos del paso de Destino
  useEffect(() => {
    console.log('✈️ Inicializando formulario de vuelo con:', {
      origen,
      destino,
      numPasajeros,
      fechaSalida,
      fechaRegreso
    })
    
    const ruta = construirRuta(origen, destino)
    
    setNewVuelo(prev => ({
      ...prev,
      ruta,
      fecha_salida: fechaSalida,
      fecha_regreso: fechaRegreso,
      num_pasajeros: numPasajeros,
    }))
  }, [origen, destino, numPasajeros, fechaSalida, fechaRegreso])

  // Handlers para cambios en campos
  const handleChange = (field: keyof VueloAmpliado, value: any) => {
    setNewVuelo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handlers para cálculos bidireccionales
  const handleCostoUnitarioChange = (value: number) => {
    const actualizado = actualizarPorCostoUnitario(newVuelo, value)
    setNewVuelo(actualizado)
  }

  const handleCostoTotalChange = (value: number) => {
    const actualizado = actualizarPorCostoTotal(newVuelo, value)
    setNewVuelo(actualizado)
  }

  const handlePrecioVentaUnitarioChange = (value: number) => {
    const actualizado = actualizarPorPrecioVentaUnitario(newVuelo, value)
    setNewVuelo(actualizado)
  }

  const handlePrecioVentaTotalChange = (value: number) => {
    const actualizado = actualizarPorPrecioVentaTotal(newVuelo, value)
    setNewVuelo(actualizado)
  }

  // Agregar vuelo
  const handleAddVuelo = () => {
    const validacion = validarVuelo(newVuelo)
    
    if (!validacion.valido) {
      console.error('❌ Errores de validación:', validacion.errores)
      setErrores(validacion.errores)
      return
    }
    
    console.log('✅ Agregando vuelo:', newVuelo)
    setVuelos([...vuelos, newVuelo])
    setNewVuelo({
      ...defaultVueloAmpliado,
      ruta: construirRuta(origen, destino),
      fecha_salida: fechaSalida,
      fecha_regreso: fechaRegreso,
      num_pasajeros: numPasajeros,
    })
    setErrores([])
  }

  // Eliminar vuelo
  const handleRemoveVuelo = (index: number) => {
    console.log('🗑️ Eliminando vuelo en índice:', index)
    setVuelos(vuelos.filter((_, i) => i !== index))
  }

  // Calcular total de vuelos
  const totalVuelos = vuelos.reduce((sum, v) => sum + v.precio_venta_total, 0)

  return (
    <div className="space-y-6">
      {/* Errores de validación */}
      {errores.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 mb-2">
                Por favor corrige los siguientes errores:
              </p>
              <ul className="list-disc list-inside space-y-1">
                {errores.map((error, i) => (
                  <li key={i} className="text-sm text-red-700">{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Lista de vuelos agregados */}
      {vuelos.length > 0 && (
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Vuelos agregados</h3>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {vuelos.length} vuelo{vuelos.length !== 1 ? 's' : ''} • {numPasajeros} pasajero{numPasajeros !== 1 ? 's' : ''}
              </p>
              <p className="text-lg font-bold text-[#00D4D4]">
                {formatearMoneda(totalVuelos)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {vuelos.map((vuelo, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Plane className="w-5 h-5 text-[#00D4D4]" />
                      <h4 className="font-semibold text-gray-900">
                        {vuelo.aerolinea} {vuelo.numero_vuelo && `#${vuelo.numero_vuelo}`}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{vuelo.ruta}</p>
                    <p className="text-sm text-gray-600">
                      Salida: {vuelo.fecha_salida} {vuelo.hora_salida}
                    </p>
                    {vuelo.tiene_escala && (
                      <p className="text-sm text-orange-600">
                        Con escala ({vuelo.duracion_escala})
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-4">
                      <p className="text-sm font-medium text-gray-900">
                        {formatearMoneda(vuelo.precio_venta_unitario)} × {vuelo.num_pasajeros} = {formatearMoneda(vuelo.precio_venta_total)}
                      </p>
                      <p className={`text-sm font-medium ${getColorUtilidad(vuelo.utilidad)}`}>
                        Utilidad: {formatearMoneda(vuelo.utilidad)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveVuelo(index)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Formulario para agregar nuevo vuelo */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Agregar nuevo vuelo
        </h3>

        <div className="space-y-6">
          {/* ========== SECCIÓN: Información Básica ========== */}
          <div className="border rounded-lg">
            <button
              onClick={() => setSeccionBasica(!seccionBasica)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">📝 Información Básica</span>
              {seccionBasica ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {seccionBasica && (
              <div className="p-4 border-t space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aerolinea">
                      Aerolínea <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="aerolinea"
                      placeholder="Ej: Aeroméxico"
                      value={newVuelo.aerolinea}
                      onChange={(e) => handleChange('aerolinea', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="numero_vuelo">Número de Vuelo</Label>
                    <Input
                      id="numero_vuelo"
                      placeholder="Ej: AM123"
                      value={newVuelo.numero_vuelo}
                      onChange={(e) => handleChange('numero_vuelo', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="ruta">Ruta (automático)</Label>
                  <Input
                    id="ruta"
                    value={newVuelo.ruta}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <Label htmlFor="clase">Clase</Label>
                  <select
                    id="clase"
                    value={newVuelo.clase}
                    onChange={(e) => handleChange('clase', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#00D4D4] focus:border-transparent"
                  >
                    {CLASES_VUELO.map((clase) => (
                      <option key={clase.value} value={clase.value}>
                        {clase.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* ========== SECCIÓN: Fechas y Horarios ========== */}
          <div className="border rounded-lg">
            <button
              onClick={() => setSeccionFechas(!seccionFechas)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">📅 Fechas y Horarios</span>
              {seccionFechas ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {seccionFechas && (
              <div className="p-4 border-t space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fecha_salida">
                      Fecha Salida <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fecha_salida"
                      type="date"
                      value={newVuelo.fecha_salida}
                      onChange={(e) => handleChange('fecha_salida', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="hora_salida">
                      Hora Salida <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="hora_salida"
                      type="time"
                      value={newVuelo.hora_salida}
                      onChange={(e) => handleChange('hora_salida', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fecha_regreso">Fecha Regreso</Label>
                    <Input
                      id="fecha_regreso"
                      type="date"
                      value={newVuelo.fecha_regreso}
                      onChange={(e) => handleChange('fecha_regreso', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="hora_regreso">Hora Regreso</Label>
                    <Input
                      id="hora_regreso"
                      type="time"
                      value={newVuelo.hora_regreso}
                      onChange={(e) => handleChange('hora_regreso', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="duracion_vuelo">Duración del Vuelo</Label>
                  <Input
                    id="duracion_vuelo"
                    placeholder="Ej: 2h 30m"
                    value={newVuelo.duracion_vuelo}
                    onChange={(e) => handleChange('duracion_vuelo', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formato sugerido: "2h 30m" o "3 horas"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ========== SECCIÓN: Escalas ========== */}
          <div className="border rounded-lg">
            <button
              onClick={() => setSeccionEscalas(!seccionEscalas)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">✈️ Escalas</span>
              {seccionEscalas ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {seccionEscalas && (
              <div className="p-4 border-t space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    id="tiene_escala"
                    type="checkbox"
                    checked={newVuelo.tiene_escala}
                    onChange={(e) => handleChange('tiene_escala', e.target.checked)}
                    className="w-4 h-4 text-[#00D4D4] border-gray-300 rounded focus:ring-[#00D4D4]"
                  />
                  <Label htmlFor="tiene_escala" className="cursor-pointer">
                    ¿Tiene escala?
                  </Label>
                </div>

                {newVuelo.tiene_escala && (
                  <div>
                    <Label htmlFor="duracion_escala">
                      Duración de Escala <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="duracion_escala"
                      placeholder="Ej: 45m, 1h 15m"
                      value={newVuelo.duracion_escala}
                      onChange={(e) => handleChange('duracion_escala', e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ========== SECCIÓN: Equipaje ========== */}
          <div className="border rounded-lg">
            <button
              onClick={() => setSeccionEquipaje(!seccionEquipaje)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">💼 Equipaje y Servicios</span>
              {seccionEquipaje ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {seccionEquipaje && (
              <div className="p-4 border-t space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      id="incluye_equipaje_mano"
                      type="checkbox"
                      checked={newVuelo.incluye_equipaje_mano}
                      onChange={(e) => handleChange('incluye_equipaje_mano', e.target.checked)}
                      className="w-4 h-4 text-[#00D4D4] border-gray-300 rounded focus:ring-[#00D4D4]"
                    />
                    <Label htmlFor="incluye_equipaje_mano" className="cursor-pointer">
                      Incluye equipaje de mano
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="incluye_equipaje_documentado"
                      type="checkbox"
                      checked={newVuelo.incluye_equipaje_documentado}
                      onChange={(e) => handleChange('incluye_equipaje_documentado', e.target.checked)}
                      className="w-4 h-4 text-[#00D4D4] border-gray-300 rounded focus:ring-[#00D4D4]"
                    />
                    <Label htmlFor="incluye_equipaje_documentado" className="cursor-pointer">
                      Incluye equipaje documentado
                    </Label>
                  </div>

                  {newVuelo.incluye_equipaje_documentado && (
                    <div className="grid grid-cols-2 gap-4 ml-6">
                      <div>
                        <Label htmlFor="kg_equipaje">Kilogramos</Label>
                        <Input
                          id="kg_equipaje"
                          type="number"
                          min="0"
                          placeholder="25"
                          value={newVuelo.kg_equipaje_documentado}
                          onChange={(e) => handleChange('kg_equipaje_documentado', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="piezas_equipaje">Piezas</Label>
                        <Input
                          id="piezas_equipaje"
                          type="number"
                          min="0"
                          placeholder="1"
                          value={newVuelo.piezas_equipaje_documentado}
                          onChange={(e) => handleChange('piezas_equipaje_documentado', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      id="incluye_seleccion_asiento"
                      type="checkbox"
                      checked={newVuelo.incluye_seleccion_asiento}
                      onChange={(e) => handleChange('incluye_seleccion_asiento', e.target.checked)}
                      className="w-4 h-4 text-[#00D4D4] border-gray-300 rounded focus:ring-[#00D4D4]"
                    />
                    <Label htmlFor="incluye_seleccion_asiento" className="cursor-pointer">
                      Incluye selección de asiento
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="incluye_tua"
                      type="checkbox"
                      checked={newVuelo.incluye_tua}
                      onChange={(e) => handleChange('incluye_tua', e.target.checked)}
                      className="w-4 h-4 text-[#00D4D4] border-gray-300 rounded focus:ring-[#00D4D4]"
                    />
                    <Label htmlFor="incluye_tua" className="cursor-pointer">
                      Incluye TUA (Tarifa de Uso de Aeropuerto)
                    </Label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========== SECCIÓN: Costos y Precios ========== */}
          <div className="border rounded-lg border-[#00D4D4]">
            <button
              onClick={() => setSeccionCostos(!seccionCostos)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">💰 Costos y Precios</span>
              {seccionCostos ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {seccionCostos && (
              <div className="p-4 border-t space-y-4">
                {/* Número de pasajeros (read-only) */}
                <div>
                  <Label>Número de Pasajeros</Label>
                  <Input
                    value={newVuelo.num_pasajeros}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Calculado automáticamente de los pasajeros seleccionados
                  </p>
                </div>

                {/* Costos */}
                <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                  <h4 className="font-medium text-gray-900">Costos</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="costo_unitario">
                        Costo por Persona
                        <span className="text-xs text-gray-500 ml-2">(editable)</span>
                      </Label>
                      <Input
                        id="costo_unitario"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={newVuelo.costo_unitario}
                        onChange={(e) => handleCostoUnitarioChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="costo_total">
                        Costo Total
                        <span className="text-xs text-gray-500 ml-2">(editable)</span>
                      </Label>
                      <Input
                        id="costo_total"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={newVuelo.costo_total}
                        onChange={(e) => handleCostoTotalChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 bg-white p-2 rounded">
                    ℹ️ Puedes editar cualquiera de los dos. El otro se calculará automáticamente.
                  </div>
                </div>

                {/* Precios de Venta */}
                <div className="bg-green-50 p-4 rounded-lg space-y-4">
                  <h4 className="font-medium text-gray-900">Precio de Venta</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="precio_venta_unitario">
                        Precio por Persona
                        <span className="text-xs text-gray-500 ml-2">(editable)</span>
                      </Label>
                      <Input
                        id="precio_venta_unitario"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={newVuelo.precio_venta_unitario}
                        onChange={(e) => handlePrecioVentaUnitarioChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="precio_venta_total">
                        Precio Total
                        <span className="text-xs text-gray-500 ml-2">(editable)</span>
                      </Label>
                      <Input
                        id="precio_venta_total"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={newVuelo.precio_venta_total}
                        onChange={(e) => handlePrecioVentaTotalChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>

                {/* Utilidad (auto-calculada) */}
                <div className={`${getColorUtilidad(newVuelo.utilidad) === 'text-green-600' ? 'bg-green-50' : 'bg-red-50'} p-4 rounded-lg`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <Label>Utilidad</Label>
                      <p className="text-xs text-gray-600">
                        Precio Venta - Costo (calculado automáticamente)
                      </p>
                    </div>
                    <p className={`text-2xl font-bold ${getColorUtilidad(newVuelo.utilidad)}`}>
                      {formatearMoneda(newVuelo.utilidad)}
                    </p>
                  </div>
                </div>

                {/* Comisión Vuelo (opcional) */}
                <div>
                  <Label htmlFor="comision_vuelo">
                    Comisión Vuelo (opcional)
                  </Label>
                  <Input
                    id="comision_vuelo"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={newVuelo.comision_vuelo}
                    onChange={(e) => handleChange('comision_vuelo', parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Comisión específica de este vuelo (si aplica)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ========== SECCIÓN: Notas ========== */}
          <div className="border rounded-lg">
            <button
              onClick={() => setSeccionNotas(!seccionNotas)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">📝 Notas Adicionales</span>
              {seccionNotas ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {seccionNotas && (
              <div className="p-4 border-t">
                <Textarea
                  placeholder="Notas u observaciones adicionales sobre este vuelo..."
                  value={newVuelo.notas}
                  onChange={(e) => handleChange('notas', e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* Botón Agregar */}
          <Button
            onClick={handleAddVuelo}
            className="w-full bg-[#00D4D4] hover:bg-[#00D4D4]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Vuelo
          </Button>
        </div>
      </Card>
    </div>
  )
}
