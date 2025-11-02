"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { GripVertical, Hotel, Plane, Car, Activity, Utensils, User, Trash2, Plus } from "lucide-react"

interface TemplateModalProps {
  isOpen: boolean
  onClose: () => void
  template?: any
}

interface Service {
  id: number
  type: string
  name: string
  description: string
  price: number
  icon: string
}

export default function TemplateModal({ isOpen, onClose, template }: TemplateModalProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      type: "Hotel",
      name: "Hotel todo incluido 7 noches",
      description: "",
      price: 15000,
      icon: "hotel",
    },
    {
      id: 2,
      type: "Vuelo",
      name: "Vuelo redondo",
      description: "",
      price: 8500,
      icon: "plane",
    },
    {
      id: 3,
      type: "Traslados",
      name: "Aeropuerto-Hotel-Aeropuerto",
      description: "",
      price: 1200,
      icon: "car",
    },
    {
      id: 4,
      type: "Tour",
      name: "Tour por la zona hotelera",
      description: "",
      price: 2500,
      icon: "activity",
    },
    {
      id: 5,
      type: "Seguro",
      name: "Seguro de viaje",
      description: "",
      price: 800,
      icon: "user",
    },
  ])

  const getServiceIcon = (icon: string) => {
    switch (icon) {
      case "hotel":
        return <Hotel className="w-5 h-5 text-gray-500" />
      case "plane":
        return <Plane className="w-5 h-5 text-gray-500" />
      case "car":
        return <Car className="w-5 h-5 text-gray-500" />
      case "activity":
        return <Activity className="w-5 h-5 text-gray-500" />
      case "food":
        return <Utensils className="w-5 h-5 text-gray-500" />
      case "user":
        return <User className="w-5 h-5 text-gray-500" />
      default:
        return <Hotel className="w-5 h-5 text-gray-500" />
    }
  }

  const totalPrice = services.reduce((sum, service) => sum + service.price, 0)

  const addService = () => {
    const newService: Service = {
      id: services.length + 1,
      type: "Hotel",
      name: "",
      description: "",
      price: 0,
      icon: "hotel",
    }
    setServices([...services, newService])
  }

  const removeService = (id: number) => {
    setServices(services.filter((service) => service.id !== id))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{template ? "Editar Plantilla" : "Nueva Plantilla"}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Información Básica</TabsTrigger>
            <TabsTrigger value="services">Servicios Incluidos</TabsTrigger>
            <TabsTrigger value="config">Configuración</TabsTrigger>
          </TabsList>

          {/* TAB 1: INFORMACIÓN BÁSICA */}
          <TabsContent value="basic" className="space-y-4 mt-6">
            <div>
              <Label htmlFor="name">
                Nombre de la plantilla <span className="text-red-500">*</span>
              </Label>
              <Input id="name" placeholder="Ej: Cancún Todo Incluido" className="mt-1" />
            </div>

            <div>
              <Label htmlFor="description">
                Descripción corta <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe brevemente esta plantilla..."
                rows={2}
                className="mt-1"
              />
            </div>

            <div>
              <Label>
                Categoría <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="category" value="nacional" className="w-4 h-4 text-[#00D4D4]" />
                  <span>Nacional</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="category" value="internacional" className="w-4 h-4 text-[#00D4D4]" />
                  <span>Internacional</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="category" value="paquete" className="w-4 h-4 text-[#00D4D4]" />
                  <span>Paquete</span>
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="type">Tipo de viaje</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="playa">Playa</SelectItem>
                  <SelectItem value="ciudad">Ciudad</SelectItem>
                  <SelectItem value="aventura">Aventura</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="romantico">Romántico</SelectItem>
                  <SelectItem value="familiar">Familiar</SelectItem>
                  <SelectItem value="crucero">Crucero</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="days">Duración estimada (Días)</Label>
                <Input id="days" type="number" placeholder="7" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="nights">Duración estimada (Noches)</Label>
                <Input id="nights" type="number" placeholder="6" className="mt-1" />
              </div>
            </div>

            <div>
              <Label>Icono</Label>
              <div className="flex gap-3 mt-2">
                {[
                  { icon: <Plane className="w-6 h-6" />, value: "plane" },
                  { icon: <Hotel className="w-6 h-6" />, value: "hotel" },
                  { icon: <Car className="w-6 h-6" />, value: "car" },
                  { icon: <Activity className="w-6 h-6" />, value: "activity" },
                  { icon: <Utensils className="w-6 h-6" />, value: "food" },
                  { icon: <User className="w-6 h-6" />, value: "guide" },
                ].map((item) => (
                  <button
                    key={item.value}
                    className="p-3 border-2 rounded-lg hover:border-[#00D4D4] hover:bg-[#00D4D4]/5 transition-colors"
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: SERVICIOS INCLUIDOS */}
          <TabsContent value="services" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Servicios de esta plantilla</h3>
              <Button onClick={addService} size="sm" className="bg-[#00D4D4] hover:bg-[#00B8B8] text-white">
                <Plus className="w-4 h-4 mr-1" />
                Agregar Servicio
              </Button>
            </div>

            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.id} className="flex items-start gap-3 p-4 border rounded-lg bg-gray-50">
                  <button className="cursor-grab mt-2">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                  </button>

                  <div className="mt-2">{getServiceIcon(service.icon)}</div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Input placeholder="Tipo de servicio" value={service.type} className="text-sm" />
                    </div>
                    <div>
                      <Input placeholder="Nombre del servicio" value={service.name} className="text-sm" />
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <Input type="number" placeholder="0" value={service.price} className="pl-7 text-sm" />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeService(service.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total estimado</p>
                <p className="text-2xl font-bold text-gray-900">${totalPrice.toLocaleString()}</p>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: CONFIGURACIÓN */}
          <TabsContent value="config" className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="commission">Comisión (%)</Label>
                <Input id="commission" type="number" placeholder="7" defaultValue="7" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="margin">Margen de ganancia (%)</Label>
                <Input id="margin" type="number" placeholder="15" className="mt-1" />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notas internas</Label>
              <Textarea id="notes" placeholder="Notas o instrucciones para el equipo..." rows={4} className="mt-1" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="active" defaultChecked />
                <Label htmlFor="active" className="cursor-pointer">
                  Plantilla activa
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="featured" />
                <Label htmlFor="featured" className="cursor-pointer">
                  Mostrar en destacados
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" placeholder="cancun, playa, familiar (separados por coma)" className="mt-1" />
              <p className="text-xs text-gray-500 mt-1">Separa los tags con comas</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t mt-6">
          <p className="text-sm text-gray-500">Última modificación: {new Date().toLocaleDateString()}</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button className="bg-[#00D4D4] hover:bg-[#00B8B8] text-white">Guardar Plantilla</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
