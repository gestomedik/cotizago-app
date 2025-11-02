"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { api } from "@/lib/api"

interface Cliente {
  id?: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  telefono_secundario?: string
  direccion?: string
  ciudad?: string
  estado?: string
  pais?: string
  codigo_postal?: string
  es_recurrente?: number
  notas?: string
}

interface ClientModalProps {
  isOpen: boolean
  onClose: (shouldReload?: boolean) => void
  client?: Cliente | null
}

export function ClientModal({ isOpen, onClose, client }: ClientModalProps) {
  const isEditing = !!client
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Cliente>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    telefono_secundario: '',
    direccion: '',
    ciudad: '',
    estado: '',
    pais: 'México',
    codigo_postal: '',
    es_recurrente: 0,
    notas: ''
  })

  // Cargar datos del cliente cuando se abre el modal para editar
  useEffect(() => {
    if (client) {
      setFormData({
        nombre: client.nombre || '',
        apellido: client.apellido || '',
        email: client.email || '',
        telefono: client.telefono || '',
        telefono_secundario: client.telefono_secundario || '',
        direccion: client.direccion || '',
        ciudad: client.ciudad || '',
        estado: client.estado || '',
        pais: client.pais || 'México',
        codigo_postal: client.codigo_postal || '',
        es_recurrente: client.es_recurrente || 0,
        notas: client.notas || ''
      })
    } else {
      // Resetear formulario para nuevo cliente
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        telefono_secundario: '',
        direccion: '',
        ciudad: '',
        estado: '',
        pais: 'México',
        codigo_postal: '',
        es_recurrente: 0,
        notas: ''
      })
    }
  }, [client, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      es_recurrente: checked ? 1 : 0
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isEditing && client?.id) {
        // Actualizar cliente existente
        const response = await api.clientes.update(client.id, formData)
        console.log('Cliente actualizado:', response)
        alert('Cliente actualizado exitosamente')
      } else {
        // Crear nuevo cliente
        const response = await api.clientes.create(formData)
        console.log('Cliente creado:', response)
        alert('Cliente creado exitosamente')
      }
      
      onClose(true) // Cerrar modal y recargar lista
    } catch (error: any) {
      console.error('Error guardando cliente:', error)
      alert(error.message || 'Error al guardar el cliente')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditing ? "Editar Cliente" : "Nuevo Cliente"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two column grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombre">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="nombre" 
                name="nombre"
                placeholder="Ej: María" 
                value={formData.nombre}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido">
                Apellido <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="apellido" 
                name="apellido"
                placeholder="Ej: González" 
                value={formData.apellido}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                placeholder="ejemplo@email.com" 
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">
                Teléfono <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="telefono" 
                name="telefono"
                placeholder="+52 81 1234 5678" 
                value={formData.telefono}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono_secundario">Teléfono Secundario</Label>
              <Input 
                id="telefono_secundario" 
                name="telefono_secundario"
                placeholder="+52 81 8765 4321" 
                value={formData.telefono_secundario}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input 
                id="ciudad" 
                name="ciudad"
                placeholder="Ej: Monterrey" 
                value={formData.ciudad}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado/Provincia</Label>
              <Input 
                id="estado" 
                name="estado"
                placeholder="Ej: Nuevo León" 
                value={formData.estado}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pais">País</Label>
              <Input 
                id="pais" 
                name="pais"
                placeholder="México" 
                value={formData.pais}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input 
                id="direccion" 
                name="direccion"
                placeholder="Calle, número, colonia" 
                value={formData.direccion}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigo_postal">Código Postal</Label>
              <Input 
                id="codigo_postal" 
                name="codigo_postal"
                placeholder="64000" 
                value={formData.codigo_postal}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Full width textarea */}
          <div className="space-y-2">
            <Label htmlFor="notas">Notas</Label>
            <Textarea 
              id="notas" 
              name="notas"
              placeholder="Notas adicionales sobre el cliente..." 
              rows={4}
              value={formData.notas}
              onChange={handleInputChange}
            />
          </div>

          {/* Recurrent checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="es_recurrente" 
              checked={formData.es_recurrente === 1}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="es_recurrente" className="cursor-pointer font-normal">
              Cliente recurrente
            </Label>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onClose(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-[#00D4D4] hover:bg-[#00D4D4]/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Cliente'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}