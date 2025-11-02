"use client"

import { useState, useEffect } from "react"
import { X, User, FileText, Heart, Phone, Loader2 } from "lucide-react"
import { api } from "@/lib/api"

interface Cliente {
  id: number
  nombre: string
  apellido: string
}

interface Pasajero {
  id?: number
  cliente_id: number
  nombre: string
  apellido: string
  fecha_nacimiento: string
  edad?: number
  tipo_pasajero: 'adulto' | 'nino' | 'infante'
  genero: 'masculino' | 'femenino' | 'otro'
  tipo_documento?: string
  numero_documento?: string
  pais_emision?: string
  fecha_emision?: string
  fecha_vencimiento?: string
  nacionalidad?: string
  alergias?: string
  condiciones_medicas?: string
  contacto_emergencia?: string
  telefono_emergencia?: string
  notas?: string
}

interface PassengerModalProps {
  isOpen: boolean
  onClose: (shouldReload?: boolean) => void
  passenger?: Pasajero | null
}

export default function PassengerModal({ isOpen, onClose, passenger }: PassengerModalProps) {
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [formData, setFormData] = useState<Pasajero>({
    cliente_id: 0,
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    tipo_pasajero: 'adulto',
    genero: 'masculino',
    nacionalidad: 'Mexicana',
    tipo_documento: '',
    numero_documento: '',
    pais_emision: '',
    fecha_emision: '',
    fecha_vencimiento: '',
    alergias: '',
    condiciones_medicas: '',
    contacto_emergencia: '',
    telefono_emergencia: '',
    notas: ''
  })

  const isEditing = !!passenger

  useEffect(() => {
    if (isOpen) {
      loadClientes()
    }
  }, [isOpen])

  useEffect(() => {
    if (passenger) {
      setFormData({
        cliente_id: passenger.cliente_id,
        nombre: passenger.nombre || '',
        apellido: passenger.apellido || '',
        fecha_nacimiento: passenger.fecha_nacimiento || '',
        tipo_pasajero: passenger.tipo_pasajero || 'adulto',
        genero: passenger.genero || 'masculino',
        nacionalidad: passenger.nacionalidad || 'Mexicana',
        tipo_documento: passenger.tipo_documento || '',
        numero_documento: passenger.numero_documento || '',
        pais_emision: passenger.pais_emision || '',
        fecha_emision: passenger.fecha_emision || '',
        fecha_vencimiento: passenger.fecha_vencimiento || '',
        alergias: passenger.alergias || '',
        condiciones_medicas: passenger.condiciones_medicas || '',
        contacto_emergencia: passenger.contacto_emergencia || '',
        telefono_emergencia: passenger.telefono_emergencia || '',
        notas: passenger.notas || ''
      })
    } else {
      setFormData({
        cliente_id: 0,
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        tipo_pasajero: 'adulto',
        genero: 'masculino',
        nacionalidad: 'Mexicana',
        tipo_documento: '',
        numero_documento: '',
        pais_emision: '',
        fecha_emision: '',
        fecha_vencimiento: '',
        alergias: '',
        condiciones_medicas: '',
        contacto_emergencia: '',
        telefono_emergencia: '',
        notas: ''
      })
    }
  }, [passenger, isOpen])

  const loadClientes = async () => {
    try {
      const response = await api.clientes.list()
      if (response.success && response.data) {
        setClientes(response.data)
      }
    } catch (error) {
      console.error('Error cargando clientes:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!formData.cliente_id || formData.cliente_id === 0) {
        alert('Por favor selecciona un cliente')
        setIsLoading(false)
        return
      }
      
      if (!formData.nombre || !formData.apellido || !formData.fecha_nacimiento) {
        alert('Por favor completa todos los campos requeridos')
        setIsLoading(false)
        return
      }

      if (isEditing && passenger?.id) {
        const response = await api.pasajeros.update(passenger.id, formData)
        console.log('Pasajero actualizado:', response)
        alert('Pasajero actualizado exitosamente')
      } else {
        const response = await api.pasajeros.create(formData)
        console.log('Pasajero creado:', response)
        alert('Pasajero creado exitosamente')
      }
      
      onClose(true)
    } catch (error: any) {
      console.error('Error guardando pasajero:', error)
      alert(error.message || 'Error al guardar el pasajero')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-[#00D4D4] to-[#7CB342] p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{isEditing ? "Editar Pasajero" : "Nuevo Pasajero"}</h2>
            <button
              onClick={() => onClose(false)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              type="button"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex">
            <button
              type="button"
              onClick={() => setActiveTab("personal")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "personal"
                  ? "border-b-2 border-[#00D4D4] text-[#00D4D4] bg-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <User className="w-4 h-4 inline-block mr-2" />
              Información Personal
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("documento")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "documento"
                  ? "border-b-2 border-[#00D4D4] text-[#00D4D4] bg-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FileText className="w-4 h-4 inline-block mr-2" />
              Documentos
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("medico")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "medico"
                  ? "border-b-2 border-[#00D4D4] text-[#00D4D4] bg-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Heart className="w-4 h-4 inline-block mr-2" />
              Info Médica
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("emergencia")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "emergencia"
                  ? "border-b-2 border-[#00D4D4] text-[#00D4D4] bg-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Phone className="w-4 h-4 inline-block mr-2" />
              Emergencia
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {activeTab === "personal" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cliente <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="cliente_id"
                      value={formData.cliente_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D4D4] focus:border-transparent"
                      required
                    >
                      <option value="0">Seleccionar cliente...</option>
                      {clientes.map(cliente => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nombre} {cliente.apellido}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Pasajero <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="tipo_pasajero"
                      value={formData.tipo_pasajero}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D4D4] focus:border-transparent"
                      required
                    >
                      <option value="adulto">Adulto (12+ años)</option>
                      <option value="nino">Menor (2-12 años)</option>
                      <option value="infante">Infante (0-2 años)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Ej: María"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D4D4] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellidos <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      placeholder="Ej: González López"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D4D4] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Nacimiento <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fecha_nacimiento"
                      value={formData.fecha_nacimiento}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D4D4] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Género <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="genero"
                      value={formData.genero}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D4D4] focus:border-transparent"
                      required
                    >
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nacionalidad</label>
                  <input
                    type="text"
                    name="nacionalidad"
                    value={formData.nacionalidad}
                    onChange={handleInputChange}
                    placeholder="Ej: Mexicana"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D4D4] focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {activeTab === "documento" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                    <select 
                      name="tipo_documento"
                      value={formData.tipo_documento}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D4D4] focus:border-transparent"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="pasaporte">Pasaporte</option>
                      <option value="ine">INE</option>
                      <option value="licencia">Licencia</option>
                      <option value="acta_nacimiento">Acta de Nacimiento</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de Documento</label>
                    <input
                      type="text"
                      name="numero_documento"
                      value={formData.numero_documento}
                      onChange={handleInputChange}
                      placeholder="Ej: MX123456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D4D4] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">País de Emisión</label>
                    <input
                      type="text"
                      name="pais_emision"
                      value={formData.pais_emision}
                      onChange={handleInputChange}
                      placeholder="Ej: México"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D4D4] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Emisión</label>
                    <input
                      type="date"
                      name="fecha_emision"
                      value={formData.fecha_emision}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D4D4] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento</label>
                    <input
                      type="date"
                      name="fecha_vencimiento"
                      value={formData.fecha_vencimiento}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D4D4] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "medico" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alergias</label>
                  <textarea
                    name="alergias"
                    value={formData.alergias}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Indique cualquier alergia conocida..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D4D4] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condiciones Médicas</label>
                  <textarea
                    name="condiciones_medicas"
                    value={formData.condiciones_medicas}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Indique cualquier condición médica relevante..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D4D4] focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {activeTab === "emergencia" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contacto de Emergencia
                  </label>
                  <input
                    type="text"
                    name="contacto_emergencia"
                    value={formData.contacto_emergencia}
                    onChange={handleInputChange}
                    placeholder="Nombre completo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D4D4] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono de Emergencia
                  </label>
                  <input
                    type="tel"
                    name="telefono_emergencia"
                    value={formData.telefono_emergencia}
                    onChange={handleInputChange}
                    placeholder="+52 81 1234 5678"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D4D4] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notas Adicionales</label>
                  <textarea
                    name="notas"
                    value={formData.notas}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Cualquier información adicional relevante..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D4D4] focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 mt-6 pt-6 bg-gray-50 -mx-6 -mb-6 px-6 pb-6">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => onClose(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#00D4D4] text-white rounded-lg hover:bg-[#00B8B8] transition-colors font-medium disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  isEditing ? "Actualizar Pasajero" : "Guardar Pasajero"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}