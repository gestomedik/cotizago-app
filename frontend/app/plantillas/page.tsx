"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, TrendingUp, FileText, Search, Plane, MapPin, MoreVertical, List, BarChart } from "lucide-react"
import TemplateModal from "@/components/template-modal"

interface Template {
  id: number
  name: string
  description: string
  category: "Nacional" | "Internacional" | "Paquete"
  services: number
  uses: number
  icon: "plane" | "map" | "package"
}

const templates: Template[] = [
  {
    id: 1,
    name: "Cancún Todo Incluido",
    description: "7 días en resort todo incluido",
    category: "Nacional",
    services: 8,
    uses: 45,
    icon: "plane",
  },
  {
    id: 2,
    name: "Tour Europa Clásico",
    description: "15 días por Europa occidental",
    category: "Internacional",
    services: 12,
    uses: 32,
    icon: "plane",
  },
  {
    id: 3,
    name: "Playa del Carmen Express",
    description: "Fin de semana en la Riviera Maya",
    category: "Nacional",
    services: 5,
    uses: 28,
    icon: "map",
  },
  {
    id: 4,
    name: "Crucero Caribe",
    description: "7 noches navegando el Caribe",
    category: "Internacional",
    services: 10,
    uses: 23,
    icon: "plane",
  },
  {
    id: 5,
    name: "Los Cabos Romántico",
    description: "Escapada para parejas",
    category: "Nacional",
    services: 6,
    uses: 38,
    icon: "map",
  },
  {
    id: 6,
    name: "Nueva York Cultural",
    description: "5 días explorando la Gran Manzana",
    category: "Internacional",
    services: 9,
    uses: 19,
    icon: "plane",
  },
  {
    id: 7,
    name: "Riviera Maya Familiar",
    description: "Vacaciones en familia",
    category: "Nacional",
    services: 11,
    uses: 41,
    icon: "map",
  },
  {
    id: 8,
    name: "Paquete Disney",
    description: "Experiencia completa Disney",
    category: "Paquete",
    services: 15,
    uses: 56,
    icon: "package",
  },
  {
    id: 9,
    name: "Puerto Vallarta Básico",
    description: "Paquete económico",
    category: "Nacional",
    services: 4,
    uses: 22,
    icon: "map",
  },
  {
    id: 10,
    name: "Tour Sudamérica",
    description: "20 días por Sudamérica",
    category: "Internacional",
    services: 18,
    uses: 12,
    icon: "plane",
  },
  {
    id: 11,
    name: "Mazatlán Todo Incluido",
    description: "Resort frente al mar",
    category: "Nacional",
    services: 7,
    uses: 31,
    icon: "map",
  },
  {
    id: 12,
    name: "Aventura Costa Rica",
    description: "Naturaleza y aventura",
    category: "Internacional",
    services: 13,
    uses: 27,
    icon: "plane",
  },
]

export default function PlantillasPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("Todas")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Nacional":
        return "bg-blue-500"
      case "Internacional":
        return "bg-green-500"
      case "Paquete":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getIcon = (icon: string) => {
    switch (icon) {
      case "plane":
        return <Plane className="w-12 h-12 text-[#00D4D4]" />
      case "map":
        return <MapPin className="w-12 h-12 text-[#00D4D4]" />
      case "package":
        return <Package className="w-12 h-12 text-[#00D4D4]" />
      default:
        return <Package className="w-12 h-12 text-[#00D4D4]" />
    }
  }

  const handleNewTemplate = () => {
    setSelectedTemplate(null)
    setIsModalOpen(true)
  }

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setIsModalOpen(true)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Plantillas" />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              Dashboard &gt; <span className="text-gray-900">Plantillas</span>
            </p>
          </div>

          {/* Page Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Plantillas de Cotización</h1>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar plantillas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas</SelectItem>
                <SelectItem value="Nacionales">Nacionales</SelectItem>
                <SelectItem value="Internacionales">Internacionales</SelectItem>
                <SelectItem value="Paquetes">Paquetes</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleNewTemplate} className="bg-[#00D4D4] hover:bg-[#00B8B8] text-white">
              + Nueva Plantilla
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Total Plantillas</p>
                  <p className="text-3xl font-bold text-gray-900">24</p>
                  <p className="text-gray-400 text-sm mt-1">plantillas activas</p>
                </div>
                <div className="bg-[#00D4D4]/10 p-3 rounded-lg">
                  <Package className="w-8 h-8 text-[#00D4D4]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Más Usadas</p>
                  <p className="text-3xl font-bold text-gray-900">8</p>
                  <p className="text-gray-400 text-sm mt-1">uso frecuente</p>
                </div>
                <div className="bg-[#7CB342]/10 p-3 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-[#7CB342]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Este Mes</p>
                  <p className="text-3xl font-bold text-gray-900">5</p>
                  <p className="text-gray-400 text-sm mt-1">nuevas plantillas</p>
                </div>
                <div className="bg-[#00D4D4]/10 p-3 rounded-lg">
                  <FileText className="w-8 h-8 text-[#00D4D4]" />
                </div>
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-[#00D4D4]"
                onClick={() => handleEditTemplate(template)}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className={`${getCategoryColor(template.category)} text-white text-xs px-3 py-1 rounded-full`}
                    >
                      {template.category}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-4">{getIcon(template.icon)}</div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{template.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center line-clamp-2 min-h-[40px]">
                    {template.description}
                  </p>

                  <hr className="my-4" />

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <List className="w-4 h-4" />
                      <span>{template.services} servicios incluidos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart className="w-4 h-4" />
                      <span>Usado {template.uses} veces</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    variant="outline"
                    className="w-full border-[#00D4D4] text-[#00D4D4] hover:bg-[#00D4D4] hover:text-white bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle use template
                    }}
                  >
                    Usar Plantilla
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Template Modal */}
      <TemplateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} template={selectedTemplate} />
    </div>
  )
}
