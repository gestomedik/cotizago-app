// types/vuelo.ts
// Interface ampliada para Vuelos - Compatible con BD MySQL

/**
 * Interface completa para un vuelo
 * Incluye todos los campos de la tabla cotizacion_vuelos
 */
export interface VueloAmpliado {
  // ========== INFORMACIÓN BÁSICA ==========
  aerolinea: string
  numero_vuelo: string
  ruta: string // Ej: "TIJ → LAP" o "MTY → CUN"
  
  // ========== FECHAS Y HORARIOS ==========
  fecha_salida: string // DATETIME: "2026-02-16"
  hora_salida: string // TIME: "09:00"
  fecha_regreso: string // DATETIME: "2026-02-16"
  hora_regreso: string // TIME: "11:30"
  duracion_vuelo: string // Texto: "2h 30m"
  
  // ========== ESCALAS ==========
  tiene_escala: boolean
  duracion_escala: string // Texto: "45m"
  
  // ========== CLASE Y PASAJEROS ==========
  clase: 'economica' | 'premium_economy' | 'ejecutiva' | 'primera_clase'
  num_pasajeros: number // Auto-calculado de pasajeros seleccionados
  
  // ========== COSTOS (BIDIRECCIONAL) ==========
  costo_unitario: number // Costo por persona
  costo_total: number // costo_unitario × num_pasajeros
  
  // ========== PRECIO DE VENTA (BIDIRECCIONAL) ==========
  precio_venta_unitario: number // Precio venta por persona
  precio_venta_total: number // precio_venta_unitario × num_pasajeros
  
  // ========== UTILIDAD Y COMISIÓN (AUTO-CALCULADOS) ==========
  utilidad: number // precio_venta_total - costo_total
  comision_vuelo: number // Opcional, puede ser 0
  
  // ========== EQUIPAJE ==========
  incluye_equipaje_mano: boolean
  incluye_equipaje_documentado: boolean
  kg_equipaje_documentado: number
  piezas_equipaje_documentado: number
  
  // ========== OTROS SERVICIOS ==========
  incluye_seleccion_asiento: boolean
  incluye_tua: boolean // Tarifa de Uso de Aeropuerto
  
  // ========== NOTAS ==========
  notas: string
}

/**
 * Valores por defecto para un nuevo vuelo
 */
export const defaultVueloAmpliado: VueloAmpliado = {
  aerolinea: "",
  numero_vuelo: "",
  ruta: "",
  fecha_salida: "",
  hora_salida: "",
  fecha_regreso: "",
  hora_regreso: "",
  duracion_vuelo: "",
  tiene_escala: false,
  duracion_escala: "",
  clase: 'economica',
  num_pasajeros: 0,
  costo_unitario: 0,
  costo_total: 0,
  precio_venta_unitario: 0,
  precio_venta_total: 0,
  utilidad: 0,
  comision_vuelo: 0,
  incluye_equipaje_mano: false,
  incluye_equipaje_documentado: false,
  kg_equipaje_documentado: 0,
  piezas_equipaje_documentado: 0,
  incluye_seleccion_asiento: false,
  incluye_tua: false,
  notas: "",
}

/**
 * Opciones para el dropdown de Clase
 */
export const CLASES_VUELO = [
  { value: 'economica', label: 'Económica' },
  { value: 'premium_economy', label: 'Premium Economy' },
  { value: 'ejecutiva', label: 'Ejecutiva' },
  { value: 'primera_clase', label: 'Primera Clase' },
] as const

/**
 * Helper para convertir VueloAmpliado a payload de backend
 */
export function vueloToBackendPayload(vuelo: VueloAmpliado) {
  return {
    aerolinea: vuelo.aerolinea,
    ruta: vuelo.ruta,
    fecha_salida: `${vuelo.fecha_salida} ${vuelo.hora_salida}:00`,
    hora_salida: `${vuelo.hora_salida}:00`,
    fecha_regreso: vuelo.fecha_regreso ? `${vuelo.fecha_regreso} ${vuelo.hora_regreso}:00` : null,
    hora_regreso: vuelo.hora_regreso ? `${vuelo.hora_regreso}:00` : null,
    clase: vuelo.clase,
    num_pasajeros: vuelo.num_pasajeros,
    costo_unitario: vuelo.costo_unitario,
    costo_total: vuelo.costo_total,
    precio_venta_unitario: vuelo.precio_venta_unitario,
    precio_venta_total: vuelo.precio_venta_total,
    comision_vuelo: vuelo.comision_vuelo,
    utilidad: vuelo.utilidad,
    notas: buildNotasVuelo(vuelo),
    incluye_equipaje_mano: vuelo.incluye_equipaje_mano ? 1 : 0,
    incluye_equipaje_documentado: vuelo.incluye_equipaje_documentado ? 1 : 0,
    kg_equipaje_documentado: vuelo.kg_equipaje_documentado,
    piezas_equipaje_documentado: vuelo.piezas_equipaje_documentado,
    incluye_seleccion_asiento: vuelo.incluye_seleccion_asiento ? 1 : 0,
    incluye_tua: vuelo.incluye_tua ? 1 : 0,
  }
}

/**
 * Helper para construir las notas automáticas
 */
function buildNotasVuelo(vuelo: VueloAmpliado): string {
  const parts: string[] = []
  
  if (vuelo.numero_vuelo) {
    parts.push(`Vuelo #${vuelo.numero_vuelo}`)
  }
  
  if (vuelo.duracion_vuelo) {
    parts.push(`Duración: ${vuelo.duracion_vuelo}`)
  }
  
  if (vuelo.tiene_escala && vuelo.duracion_escala) {
    parts.push(`Escala: ${vuelo.duracion_escala}`)
  }
  
  if (vuelo.notas) {
    parts.push(vuelo.notas)
  }
  
  return parts.join(' • ')
}
