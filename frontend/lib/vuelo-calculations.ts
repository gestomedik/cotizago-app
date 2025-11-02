// lib/vuelo-calculations.ts
// Funciones helper para cálculos automáticos de vuelos

import { VueloAmpliado } from "@/types/vuelo"

/**
 * Calcula el costo total basado en costo unitario y número de pasajeros
 */
export function calcularCostoTotal(costoUnitario: number, numPasajeros: number): number {
  const total = costoUnitario * numPasajeros
  return parseFloat(total.toFixed(2))
}

/**
 * Calcula el costo unitario basado en costo total y número de pasajeros
 */
export function calcularCostoUnitario(costoTotal: number, numPasajeros: number): number {
  if (numPasajeros === 0) return 0
  const unitario = costoTotal / numPasajeros
  return parseFloat(unitario.toFixed(2))
}

/**
 * Calcula el precio de venta total basado en unitario y número de pasajeros
 */
export function calcularPrecioVentaTotal(precioUnitario: number, numPasajeros: number): number {
  const total = precioUnitario * numPasajeros
  return parseFloat(total.toFixed(2))
}

/**
 * Calcula el precio de venta unitario basado en total y número de pasajeros
 */
export function calcularPrecioVentaUnitario(precioTotal: number, numPasajeros: number): number {
  if (numPasajeros === 0) return 0
  const unitario = precioTotal / numPasajeros
  return parseFloat(unitario.toFixed(2))
}

/**
 * Calcula la utilidad: Precio Venta - Costo
 */
export function calcularUtilidad(precioVentaTotal: number, costoTotal: number): number {
  const utilidad = precioVentaTotal - costoTotal
  return parseFloat(utilidad.toFixed(2))
}

/**
 * Calcula el margen de utilidad en porcentaje
 */
export function calcularMargenUtilidad(utilidad: number, costoTotal: number): number {
  if (costoTotal === 0) return 0
  const margen = (utilidad / costoTotal) * 100
  return parseFloat(margen.toFixed(2))
}

/**
 * Actualiza el vuelo cuando cambia el costo unitario
 */
export function actualizarPorCostoUnitario(
  vuelo: VueloAmpliado,
  nuevoCostoUnitario: number
): VueloAmpliado {
  const costoTotal = calcularCostoTotal(nuevoCostoUnitario, vuelo.num_pasajeros)
  const utilidad = calcularUtilidad(vuelo.precio_venta_total, costoTotal)
  
  console.log('💰 Actualizando por costo unitario:', {
    costoUnitario: nuevoCostoUnitario,
    numPasajeros: vuelo.num_pasajeros,
    costoTotal,
    utilidad
  })
  
  return {
    ...vuelo,
    costo_unitario: nuevoCostoUnitario,
    costo_total: costoTotal,
    utilidad: utilidad,
  }
}

/**
 * Actualiza el vuelo cuando cambia el costo total
 */
export function actualizarPorCostoTotal(
  vuelo: VueloAmpliado,
  nuevoCostoTotal: number
): VueloAmpliado {
  const costoUnitario = calcularCostoUnitario(nuevoCostoTotal, vuelo.num_pasajeros)
  const utilidad = calcularUtilidad(vuelo.precio_venta_total, nuevoCostoTotal)
  
  console.log('💰 Actualizando por costo total:', {
    costoTotal: nuevoCostoTotal,
    numPasajeros: vuelo.num_pasajeros,
    costoUnitario,
    utilidad
  })
  
  return {
    ...vuelo,
    costo_unitario: costoUnitario,
    costo_total: nuevoCostoTotal,
    utilidad: utilidad,
  }
}

/**
 * Actualiza el vuelo cuando cambia el precio de venta unitario
 */
export function actualizarPorPrecioVentaUnitario(
  vuelo: VueloAmpliado,
  nuevoPrecioUnitario: number
): VueloAmpliado {
  const precioTotal = calcularPrecioVentaTotal(nuevoPrecioUnitario, vuelo.num_pasajeros)
  const utilidad = calcularUtilidad(precioTotal, vuelo.costo_total)
  
  console.log('💵 Actualizando por precio venta unitario:', {
    precioUnitario: nuevoPrecioUnitario,
    numPasajeros: vuelo.num_pasajeros,
    precioTotal,
    utilidad
  })
  
  return {
    ...vuelo,
    precio_venta_unitario: nuevoPrecioUnitario,
    precio_venta_total: precioTotal,
    utilidad: utilidad,
  }
}

/**
 * Actualiza el vuelo cuando cambia el precio de venta total
 */
export function actualizarPorPrecioVentaTotal(
  vuelo: VueloAmpliado,
  nuevoPrecioTotal: number
): VueloAmpliado {
  const precioUnitario = calcularPrecioVentaUnitario(nuevoPrecioTotal, vuelo.num_pasajeros)
  const utilidad = calcularUtilidad(nuevoPrecioTotal, vuelo.costo_total)
  
  console.log('💵 Actualizando por precio venta total:', {
    precioTotal: nuevoPrecioTotal,
    numPasajeros: vuelo.num_pasajeros,
    precioUnitario,
    utilidad
  })
  
  return {
    ...vuelo,
    precio_venta_unitario: precioUnitario,
    precio_venta_total: nuevoPrecioTotal,
    utilidad: utilidad,
  }
}

/**
 * Actualiza todos los cálculos cuando cambia el número de pasajeros
 */
export function actualizarPorNumPasajeros(
  vuelo: VueloAmpliado,
  nuevoNumPasajeros: number
): VueloAmpliado {
  // Recalcula basándose en los valores unitarios (preferencia por defecto)
  const costoTotal = calcularCostoTotal(vuelo.costo_unitario, nuevoNumPasajeros)
  const precioTotal = calcularPrecioVentaTotal(vuelo.precio_venta_unitario, nuevoNumPasajeros)
  const utilidad = calcularUtilidad(precioTotal, costoTotal)
  
  console.log('👥 Actualizando por número de pasajeros:', {
    numPasajeros: nuevoNumPasajeros,
    costoTotal,
    precioTotal,
    utilidad
  })
  
  return {
    ...vuelo,
    num_pasajeros: nuevoNumPasajeros,
    costo_total: costoTotal,
    precio_venta_total: precioTotal,
    utilidad: utilidad,
  }
}

/**
 * Construye la ruta automáticamente desde origen y destino
 */
export function construirRuta(origen: string, destino: string): string {
  if (!origen || !destino) return ""
  
  // Extrae las primeras 3 letras de cada ciudad para el código IATA
  const origenCode = origen.substring(0, 3).toUpperCase()
  const destinoCode = destino.substring(0, 3).toUpperCase()
  
  return `${origenCode} → ${destinoCode}`
}

/**
 * Valida que un vuelo esté completo antes de agregarlo
 */
export function validarVuelo(vuelo: VueloAmpliado): { 
  valido: boolean
  errores: string[] 
} {
  const errores: string[] = []
  
  // Campos obligatorios
  if (!vuelo.aerolinea.trim()) {
    errores.push("La aerolínea es obligatoria")
  }
  
  if (!vuelo.ruta.trim()) {
    errores.push("La ruta es obligatoria")
  }
  
  if (!vuelo.fecha_salida) {
    errores.push("La fecha de salida es obligatoria")
  }
  
  if (!vuelo.hora_salida) {
    errores.push("La hora de salida es obligatoria")
  }
  
  if (vuelo.num_pasajeros <= 0) {
    errores.push("Debe haber al menos 1 pasajero")
  }
  
  if (vuelo.costo_unitario < 0) {
    errores.push("El costo no puede ser negativo")
  }
  
  if (vuelo.precio_venta_unitario < 0) {
    errores.push("El precio de venta no puede ser negativo")
  }
  
  // Validación de escala
  if (vuelo.tiene_escala && !vuelo.duracion_escala.trim()) {
    errores.push("Debe especificar la duración de la escala")
  }
  
  // Validación de equipaje
  if (vuelo.incluye_equipaje_documentado) {
    if (vuelo.kg_equipaje_documentado <= 0) {
      errores.push("Debe especificar los kg de equipaje documentado")
    }
    if (vuelo.piezas_equipaje_documentado <= 0) {
      errores.push("Debe especificar las piezas de equipaje documentado")
    }
  }
  
  return {
    valido: errores.length === 0,
    errores
  }
}

/**
 * Formatea un valor monetario para mostrar
 */
export function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor)
}

/**
 * Obtiene el color de la utilidad (verde si positiva, rojo si negativa)
 */
export function getColorUtilidad(utilidad: number): string {
  if (utilidad > 0) return 'text-green-600'
  if (utilidad < 0) return 'text-red-600'
  return 'text-gray-600'
}
