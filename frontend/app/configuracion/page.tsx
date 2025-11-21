"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UsuariosTab } from "@/components/configuracion/UsuariosTab"
import { PermisosTab } from "@/components/configuracion/PermisosTab"
import { usePermissions } from "@/hooks/usePermissions"
import {
  Users,
  Building2,
  Settings,
  Percent,
  Mail,
  Shield,
  Bell,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  User,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Upload,
  ChevronRight,
  ShieldCheck,
} from "lucide-react"


type Section = "users" | "company" | "general" | "commissions" | "email" | "security" | "notifications" | "roles"



export default function ConfiguracionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<Section>("users")
  const { esAdmin } = usePermissions()

  useEffect(() => {
    const section = searchParams.get("section") as Section
    if (section && ["users", "company", "general", "commissions", "email", "security", "notifications", "roles"].includes(section)) {
      setActiveSection(section)
    }
  }, [searchParams])

  const handleSectionChange = (sectionId: Section) => {
    setActiveSection(sectionId)
    router.push(`/configuracion?section=${sectionId}`)
  }

  const sections = [
    { id: "users" as Section, icon: Users, label: "Usuarios del Sistema" },
    { id: "company" as Section, icon: Building2, label: "Información de Empresa" },
    { id: "general" as Section, icon: Settings, label: "Configuración General" },
    { id: "commissions" as Section, icon: Percent, label: "Comisiones y Precios" },
    { id: "email" as Section, icon: Mail, label: "Plantillas de Email" },
    { id: "security" as Section, icon: Shield, label: "Seguridad" },
    { id: "roles" as Section, icon: ShieldCheck, label: "Roles y Permisos" },
    { id: "notifications" as Section, icon: Bell, label: "Notificaciones" },
  ]

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Administrador":
        return "bg-red-100 text-red-700"
      case "Agente":
        return "bg-blue-100 text-blue-700"
      case "Visor":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Configuración" />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <span>Dashboard</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Configuración</span>
            </div>



            <div className="flex gap-6">
              {/* Sidebar Navigation */}
              <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm p-2 sticky top-6">
                  {sections.map((section) => {
                    const Icon = section.icon
                    const isActive = activeSection === section.id
                    return (
                      <button
                        key={section.id}
                        onClick={() => handleSectionChange(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${isActive
                          ? "bg-[#00D4D4]/10 text-[#00D4D4] border-l-4 border-[#00D4D4]"
                          : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? "text-[#00D4D4]" : "text-gray-500"}`} />
                        <span className={isActive ? "font-semibold" : "font-medium"}>{section.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Mobile Tabs */}
              <div className="lg:hidden w-full mb-6 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                  {sections.map((section) => {
                    const Icon = section.icon
                    const isActive = activeSection === section.id
                    return (
                      <button
                        key={section.id}
                        onClick={() => handleSectionChange(section.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap ${isActive ? "bg-[#00D4D4] text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{section.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1">
                {/* SECTION 1: USUARIOS DEL SISTEMA */}
                {activeSection === "users" && (
                  <UsuariosTab />
                )}

                {/* SECTION 2: INFORMACIÓN DE EMPRESA */}
                {activeSection === "company" && (
                  <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Información de Empresa</h2>

                      {/* Datos Generales */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Datos Generales</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="company-name">Nombre de la empresa *</Label>
                            <Input id="company-name" defaultValue="Experiencias La Silla" />
                          </div>
                          <div>
                            <Label htmlFor="tax-id">RFC/Tax ID *</Label>
                            <Input id="tax-id" placeholder="RFC123456789" />
                          </div>
                          <div>
                            <Label htmlFor="phone">Teléfono principal *</Label>
                            <Input id="phone" placeholder="+52 81 1234 5678" />
                          </div>
                          <div>
                            <Label htmlFor="email">Email de contacto *</Label>
                            <Input id="email" type="email" placeholder="contacto@experienciasillasilla.com" />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor="website">Sitio web</Label>
                            <Input id="website" placeholder="https://www.experienciaslasilla.com" />
                          </div>
                        </div>
                      </div>

                      {/* Dirección */}
                      <div className="space-y-6 pt-8 border-t">
                        <h3 className="text-lg font-semibold text-gray-900">Dirección</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <Label htmlFor="street">Calle y número *</Label>
                            <Input id="street" placeholder="Av. Principal 123" />
                          </div>
                          <div>
                            <Label htmlFor="neighborhood">Colonia</Label>
                            <Input id="neighborhood" placeholder="Centro" />
                          </div>
                          <div>
                            <Label htmlFor="city">Ciudad *</Label>
                            <Input id="city" placeholder="Monterrey" />
                          </div>
                          <div>
                            <Label htmlFor="state">Estado/Provincia *</Label>
                            <Input id="state" placeholder="Nuevo León" />
                          </div>
                          <div>
                            <Label htmlFor="zip">Código postal *</Label>
                            <Input id="zip" placeholder="64000" />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor="country">País *</Label>
                            <Input id="country" defaultValue="México" />
                          </div>
                        </div>
                      </div>

                      {/* Logotipo */}
                      <div className="space-y-6 pt-8 border-t">
                        <h3 className="text-lg font-semibold text-gray-900">Logotipo</h3>
                        <div className="flex items-start gap-6">
                          <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                            <img
                              src="/images/logo-experiencias-la-silla.png"
                              alt="Logo"
                              className="max-w-full max-h-full object-contain p-4"
                            />
                          </div>
                          <div className="flex-1">
                            <Button variant="outline" className="mb-2 bg-transparent">
                              <Upload className="w-4 h-4 mr-2" />
                              Cambiar logotipo
                            </Button>
                            <p className="text-sm text-gray-600">
                              Formato PNG o JPG, máximo 2MB, recomendado 500x500px
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Redes Sociales */}
                      <div className="space-y-6 pt-8 border-t">
                        <h3 className="text-lg font-semibold text-gray-900">Redes Sociales</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="facebook">Facebook</Label>
                            <div className="relative">
                              <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input id="facebook" className="pl-10" placeholder="facebook.com/experienciaslasilla" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="instagram">Instagram</Label>
                            <div className="relative">
                              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input id="instagram" className="pl-10" placeholder="@experienciaslasilla" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="twitter">Twitter/X</Label>
                            <div className="relative">
                              <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input id="twitter" className="pl-10" placeholder="@experienciaslasilla" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <div className="relative">
                              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                id="linkedin"
                                className="pl-10"
                                placeholder="linkedin.com/company/experienciaslasilla"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6">
                        <Button className="bg-[#00D4D4] hover:bg-[#00D4D4]/90">Guardar Cambios</Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 3: CONFIGURACIÓN GENERAL */}
                {activeSection === "general" && (
                  <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                    <h2 className="text-xl font-bold text-gray-900">Configuración General</h2>

                    {/* Formato y Regionalización */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Formato y Regionalización</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="timezone">Zona horaria</Label>
                          <Input id="timezone" defaultValue="America/Monterrey (GMT-6)" />
                        </div>
                        <div>
                          <Label htmlFor="language">Idioma del sistema</Label>
                          <Input id="language" defaultValue="Español (México)" />
                        </div>
                      </div>
                      <div>
                        <Label>Formato de fecha</Label>
                        <div className="flex gap-4 mt-2">
                          <label className="flex items-center gap-2">
                            <input type="radio" name="date-format" defaultChecked />
                            <span className="text-sm">DD/MM/YYYY</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="date-format" />
                            <span className="text-sm">MM/DD/YYYY</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="date-format" />
                            <span className="text-sm">YYYY-MM-DD</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <Label>Formato de moneda</Label>
                        <div className="flex gap-4 mt-2">
                          <label className="flex items-center gap-2">
                            <input type="radio" name="currency" defaultChecked />
                            <span className="text-sm">$ (Pesos)</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="currency" />
                            <span className="text-sm">USD ($)</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="currency" />
                            <span className="text-sm">EUR (€)</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Cotizaciones */}
                    <div className="space-y-4 pt-6 border-t">
                      <h3 className="text-lg font-semibold text-gray-900">Cotizaciones</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="validity">Validez por defecto (días)</Label>
                          <Input id="validity" type="number" defaultValue="30" />
                        </div>
                        <div>
                          <Label htmlFor="folio-format">Formato de folio</Label>
                          <Input id="folio-format" defaultValue="CTZ-{YEAR}-{NUMBER}" />
                          <p className="text-xs text-gray-500 mt-1">Vista previa: CTZ-2025-001</p>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="terms">Términos y condiciones por defecto</Label>
                        <Textarea id="terms" rows={5} placeholder="Ingrese los términos y condiciones..." />
                      </div>
                    </div>

                    {/* Notificaciones del Sistema */}
                    <div className="space-y-4 pt-6 border-t">
                      <h3 className="text-lg font-semibold text-gray-900">Notificaciones del Sistema</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="w-4 h-4" defaultChecked />
                          <span className="text-sm text-gray-700">Notificar nueva cotización creada</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="w-4 h-4" defaultChecked />
                          <span className="text-sm text-gray-700">Notificar cuando cliente acepta cotización</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="w-4 h-4" defaultChecked />
                          <span className="text-sm text-gray-700">Notificar cuando cotización está por vencer</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm text-gray-700">Recordatorio de seguimiento automático</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Button className="bg-[#00D4D4] hover:bg-[#00D4D4]/90">Guardar Configuración</Button>
                    </div>
                  </div>
                )}

                {/* SECTION 4: COMISIONES Y PRECIOS */}
                {activeSection === "commissions" && (
                  <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                    <h2 className="text-xl font-bold text-gray-900">Comisiones y Precios</h2>

                    {/* Comisión Estándar */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Comisión Estándar</h3>
                      <div>
                        <Label htmlFor="default-commission">Comisión por defecto (%)</Label>
                        <Input id="default-commission" type="number" defaultValue="7" className="max-w-xs" />
                      </div>
                      <div>
                        <Label>Aplicar a:</Label>
                        <div className="flex gap-4 mt-2">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">Nacionales</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">Internacionales</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">Paquetes</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Comisiones por Tipo */}
                    <div className="space-y-4 pt-6 border-t">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Comisiones por Tipo</h3>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar tipo
                        </Button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tipo de viaje</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Comisión (%)</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            <tr>
                              <td className="px-4 py-3 text-sm">Nacional</td>
                              <td className="px-4 py-3 text-sm">7%</td>
                              <td className="px-4 py-3">
                                <button className="text-[#00D4D4] hover:text-[#00D4D4]/80">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm">Internacional</td>
                              <td className="px-4 py-3 text-sm">8%</td>
                              <td className="px-4 py-3">
                                <button className="text-[#00D4D4] hover:text-[#00D4D4]/80">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm">Paquetes</td>
                              <td className="px-4 py-3 text-sm">6%</td>
                              <td className="px-4 py-3">
                                <button className="text-[#00D4D4] hover:text-[#00D4D4]/80">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm">Cruceros</td>
                              <td className="px-4 py-3 text-sm">9%</td>
                              <td className="px-4 py-3">
                                <button className="text-[#00D4D4] hover:text-[#00D4D4]/80">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Márgenes de Ganancia */}
                    <div className="space-y-4 pt-6 border-t">
                      <h3 className="text-lg font-semibold text-gray-900">Márgenes de Ganancia</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="min-margin">Margen mínimo recomendado (%)</Label>
                          <Input id="min-margin" type="number" defaultValue="10" />
                        </div>
                        <div>
                          <Label htmlFor="max-margin">Margen máximo sugerido (%)</Label>
                          <Input id="max-margin" type="number" defaultValue="30" />
                        </div>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                        <Bell className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">Los agentes verán advertencias si salen de este rango</p>
                      </div>
                    </div>

                    {/* Descuentos */}
                    <div className="space-y-4 pt-6 border-t">
                      <h3 className="text-lg font-semibold text-gray-900">Descuentos</h3>
                      <div className="space-y-4">
                        <label className="flex items-center gap-3">
                          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#00D4D4]">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                          </button>
                          <span className="text-sm font-medium text-gray-700">Permitir descuentos</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="max-discount">Descuento máximo permitido (%)</Label>
                            <Input id="max-discount" type="number" defaultValue="15" />
                          </div>
                          <div>
                            <Label htmlFor="approval-threshold">Requiere aprobación si excede (%)</Label>
                            <Input id="approval-threshold" type="number" defaultValue="10" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Button className="bg-[#00D4D4] hover:bg-[#00D4D4]/90">Guardar Configuración de Precios</Button>
                    </div>
                  </div>
                )}

                {/* SECTION 5: PLANTILLAS DE EMAIL */}
                {activeSection === "email" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">Plantillas de Email</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { title: "Nueva Cotización", desc: "Email enviado cuando se crea una cotización" },
                        { title: "Cotización Aceptada", desc: "Email de confirmación cuando el cliente acepta" },
                        { title: "Recordatorio", desc: "Email de seguimiento automático" },
                        { title: "Confirmación de Pago", desc: "Email enviado al recibir el pago" },
                      ].map((template, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-[#00D4D4]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Mail className="w-6 h-6 text-[#00D4D4]" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{template.title}</h3>
                              <p className="text-sm text-gray-600 mb-3">{template.desc}</p>
                              <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                                Estimado/a {"{CLIENTE_NOMBRE}"}, le enviamos la cotización {"{FOLIO}"}...
                              </p>
                              <Button variant="outline" size="sm">
                                <Edit2 className="w-4 h-4 mr-2" />
                                Editar
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECTION 6: SEGURIDAD */}
                {activeSection === "security" && (
                  <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                    <h2 className="text-xl font-bold text-gray-900">Seguridad</h2>

                    {/* Contraseña */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Cambiar Contraseña</h3>
                      <div className="max-w-md space-y-4">
                        <div>
                          <Label htmlFor="current-password">Contraseña actual</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div>
                          <Label htmlFor="new-password">Nueva contraseña</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div>
                          <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                        <Button className="bg-[#00D4D4] hover:bg-[#00D4D4]/90">Cambiar Contraseña</Button>
                      </div>
                    </div>

                    {/* 2FA */}
                    <div className="space-y-4 pt-6 border-t">
                      <h3 className="text-lg font-semibold text-gray-900">Autenticación de Dos Factores</h3>
                      <label className="flex items-center gap-3">
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                        </button>
                        <span className="text-sm font-medium text-gray-700">
                          Habilitar autenticación de dos factores
                        </span>
                      </label>
                      <p className="text-sm text-gray-600">Agrega una capa adicional de seguridad a tu cuenta</p>
                    </div>

                    {/* Sesiones Activas */}
                    <div className="space-y-4 pt-6 border-t">
                      <h3 className="text-lg font-semibold text-gray-900">Sesiones Activas</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Chrome en Windows</p>
                            <p className="text-sm text-gray-600">192.168.1.1 • Monterrey, México</p>
                            <p className="text-xs text-gray-500">Última actividad: Hace 5 minutos</p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Actual
                          </span>
                        </div>
                      </div>
                    </div>


                  </div>
                )}

                {/* SECTION 8: ROLES Y PERMISOS */}
                {activeSection === "roles" && (
                  <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                    <h2 className="text-xl font-bold text-gray-900">Roles y Permisos</h2>
                    <p className="text-gray-600">Gestione los roles y permisos de acceso al sistema.</p>

                    {esAdmin() ? (
                      <PermisosTab />
                    ) : (
                      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                        No tiene permisos para ver esta sección.
                      </div>
                    )}
                  </div>
                )}

                {/* SECTION 7: NOTIFICACIONES */}
                {activeSection === "notifications" && (
                  <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Preferencias de Notificaciones</h2>
                      <label className="flex items-center gap-3">
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#00D4D4]">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                        </button>
                        <span className="text-sm font-medium text-gray-700">Recibir todas</span>
                      </label>
                    </div>

                    {/* Cotizaciones */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900">Cotizaciones</h3>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                        <span className="text-sm text-gray-700">Nueva cotización creada por otro usuario</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                        <span className="text-sm text-gray-700">Cotización aceptada por cliente</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                        <span className="text-sm text-gray-700">Cotización rechazada</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                        <span className="text-sm text-gray-700">Cotización próxima a vencer</span>
                      </label>
                    </div>

                    {/* Clientes y Ventas */}
                    <div className="space-y-3 pt-6 border-t">
                      <h3 className="text-lg font-semibold text-gray-900">Clientes y Ventas</h3>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                        <span className="text-sm text-gray-700">Nuevo cliente registrado</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                        <span className="text-sm text-gray-700">Venta completada</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                        <span className="text-sm text-gray-700">Pago recibido</span>
                      </label>
                    </div>

                    {/* Sistema */}
                    <div className="space-y-3 pt-6 border-t">
                      <h3 className="text-lg font-semibold text-gray-900">Sistema</h3>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-sm text-gray-700">Actualizaciones del sistema</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                        <span className="text-sm text-gray-700">Mantenimiento programado</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                        <span className="text-sm text-gray-700">Alertas de seguridad</span>
                      </label>
                    </div>

                    <div className="pt-6">
                      <Button className="bg-[#00D4D4] hover:bg-[#00D4D4]/90">Guardar Preferencias</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>


    </div>
  )
}
