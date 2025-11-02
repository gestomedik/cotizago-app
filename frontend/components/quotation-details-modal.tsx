"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Mail, Phone, MapPin, Calendar, User, Edit, Send, Download, DollarSign } from "lucide-react"

interface Cotizacion {
  id: number
  folio: string
  cliente_id: number
  cliente_nombre: string
  agente_id?: number
  usuario_nombre?: string
  origen: string
  destino: string
  fecha_salida: string
  fecha_regreso: string
  num_noches: number
  tipo_viaje: string
  num_adultos: number
  num_ninos: number
  num_infantes: number
  costo_total: number
  utilidad_total: number
  precio_venta_total: number
  porcentaje_comision_agente: number
  comision_total: number
  estado: 'cotizacion' | 'reservacion' | 'cancelada' | 'completada'
  estado_pago: 'pendiente' | 'anticipo' | 'pagado' | 'reembolso'
  fecha_creacion: string
}

interface QuotationDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  quotation: Cotizacion | null
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "cotizacion":
      return "bg-orange-50 text-orange-600"
    case "reservacion":
      return "bg-blue-50 text-blue-600"
    case "completada":
      return "bg-green-50 text-[#7CB342]"
    case "cancelada":
      return "bg-red-50 text-red-600"
    default:
      return "bg-gray-100 text-gray-600"
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "cotizacion":
      return "Pendiente"
    case "reservacion":
      return "Enviada"
    case "completada":
      return "Aceptada"
    case "cancelada":
      return "Rechazada"
    default:
      return status
  }
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

export default function QuotationDetailsModal({ isOpen, onClose, quotation }: QuotationDetailsModalProps) {
  // ✅ VALIDACIÓN CRÍTICA: Si quotation es null, no renderizar nada
  if (!quotation) {
    return null
  }

  const totalPasajeros = quotation.num_adultos + quotation.num_ninos + quotation.num_infantes

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">{quotation.folio}</h2>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(quotation.estado)}`}
            >
              {getStatusLabel(quotation.estado)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Edit className="w-4 h-4" />
              Editar
            </Button>
            <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Send className="w-4 h-4" />
              Enviar Email
            </Button>
            <Button size="sm" className="gap-2 bg-[#00D4D4] hover:bg-[#00B8B8] text-white">
              <Download className="w-4 h-4" />
              Descargar PDF
            </Button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Client Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">INFORMACIÓN DEL CLIENTE</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#00D4D4] text-white flex items-center justify-center text-lg font-medium">
                      {getInitials(quotation.cliente_nombre)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{quotation.cliente_nombre}</p>
                    </div>
                  </div>
                  {/* Nota: Email y teléfono se pueden agregar cuando tengas esa info del cliente */}
                </div>
              </div>

              {/* Trip Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">DETALLES DEL VIAJE</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>Origen: {quotation.origen}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-4 h-4 text-[#00D4D4]" />
                    <span className="font-medium">Destino: {quotation.destino}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Salida: {formatDate(quotation.fecha_salida)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Regreso: {formatDate(quotation.fecha_regreso)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Duración: {quotation.num_noches} {quotation.num_noches === 1 ? 'noche' : 'noches'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>
                      {totalPasajeros} {totalPasajeros === 1 ? 'pasajero' : 'pasajeros'}
                      {' '}({quotation.num_adultos} {quotation.num_adultos === 1 ? 'adulto' : 'adultos'}
                      {quotation.num_ninos > 0 && `, ${quotation.num_ninos} ${quotation.num_ninos === 1 ? 'niño' : 'niños'}`}
                      {quotation.num_infantes > 0 && `, ${quotation.num_infantes} ${quotation.num_infantes === 1 ? 'infante' : 'infantes'}`})
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>Tipo: {quotation.tipo_viaje === 'individual' ? 'Individual' : 'Grupo'}</span>
                  </div>
                </div>
              </div>

              {/* Important Dates */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">FECHAS IMPORTANTES</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Creada:</span>
                    <span className="text-gray-900">{formatDate(quotation.fecha_creacion)}</span>
                  </div>
                </div>
              </div>

              {/* Agent Info */}
              {quotation.usuario_nombre && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AGENTE</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#7CB342] text-white flex items-center justify-center text-sm font-medium">
                      {getInitials(quotation.usuario_nombre)}
                    </div>
                    <span className="text-gray-700">{quotation.usuario_nombre}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Financial Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">RESUMEN FINANCIERO</h3>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">Costo Total:</span>
                    </div>
                    <span className="font-medium text-gray-900">{formatCurrency(quotation.costo_total)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">Utilidad:</span>
                    </div>
                    <span className="font-medium text-green-600">{formatCurrency(quotation.utilidad_total)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700">Comisión ({quotation.porcentaje_comision_agente}%):</span>
                    </div>
                    <span className="font-medium text-blue-600">{formatCurrency(quotation.comision_total)}</span>
                  </div>

                  <div className="border-t border-gray-300 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Precio Final:</span>
                      <span className="text-2xl font-bold text-[#00D4D4]">{formatCurrency(quotation.precio_venta_total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">ESTADO DE PAGO</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    quotation.estado_pago === 'pendiente' ? 'bg-gray-100 text-gray-800' :
                    quotation.estado_pago === 'anticipo' ? 'bg-orange-100 text-orange-800' :
                    quotation.estado_pago === 'pagado' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {quotation.estado_pago === 'pendiente' ? 'Pendiente' :
                     quotation.estado_pago === 'anticipo' ? 'Anticipo Pagado' :
                     quotation.estado_pago === 'pagado' ? 'Pagado' :
                     'Reembolso'}
                  </span>
                </div>
              </div>

              {/* Notes Section - Placeholder para cuando se agreguen notas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">NOTAS</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 italic">
                    Sin notas adicionales
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            ID: {quotation.id} • Cliente ID: {quotation.cliente_id}
          </div>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
