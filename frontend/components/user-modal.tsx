"use client"

import { useState, useEffect } from "react"
import { X, Shield, User, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  user?: any
}

export default function UserModal({ isOpen, onClose, user }: UserModalProps) {
  const [selectedRole, setSelectedRole] = useState("Agente")
  const [changePassword, setChangePassword] = useState(false)

  useEffect(() => {
    if (user) {
      setSelectedRole(user.role)
      setChangePassword(false)
    } else {
      setSelectedRole("Agente")
      setChangePassword(true)
    }
  }, [user])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{user ? "Editar Usuario" : "Nuevo Usuario"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullname">Nombre completo *</Label>
                <Input id="fullname" defaultValue={user?.name} placeholder="Ej: María González" />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" defaultValue={user?.email} placeholder="maria@cotizago.com" />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" placeholder="+52 81 1234 5678" />
              </div>
              <div>
                <Label htmlFor="birthdate">Fecha de nacimiento</Label>
                <Input id="birthdate" type="date" />
              </div>
            </div>
          </div>

          {/* Credenciales de Acceso */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900">Credenciales de Acceso</h3>

            {user && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={changePassword}
                  onChange={(e) => setChangePassword(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Cambiar contraseña</span>
              </label>
            )}

            {(!user || changePassword) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Contraseña *</Label>
                  <Input id="password" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirmar contraseña *</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500">Mínimo 8 caracteres, incluir mayúsculas y números</p>
                </div>
              </div>
            )}
          </div>

          {/* Rol y Permisos */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900">Rol y Permisos</h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="Administrador"
                  checked={selectedRole === "Administrador"}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-red-600" />
                    <span className="font-semibold text-gray-900">Administrador</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">Admin</span>
                  </div>
                  <p className="text-sm text-gray-600">Acceso total al sistema, gestión de usuarios, configuración</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="Agente"
                  checked={selectedRole === "Agente"}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-gray-900">Agente</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">Agente</span>
                  </div>
                  <p className="text-sm text-gray-600">Crear cotizaciones, gestionar clientes, ver reportes propios</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="Visor"
                  checked={selectedRole === "Visor"}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold text-gray-900">Visor</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">Visor</span>
                  </div>
                  <p className="text-sm text-gray-600">Solo lectura, ver cotizaciones y reportes, sin edición</p>
                </div>
              </label>
            </div>

            {/* Permisos Detallados (solo para Agente) */}
            {selectedRole === "Agente" && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg space-y-3">
                <h4 className="font-semibold text-gray-900 mb-3">Permisos Detallados</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-gray-700">Gestionar clientes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-gray-700">Gestionar pasajeros</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-gray-700">Crear cotizaciones</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-gray-700">Editar cotizaciones</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm text-gray-700">Eliminar cotizaciones</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-gray-700">Ver reportes generales</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm text-gray-700">Ver comisiones de otros</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-gray-700">Gestionar plantillas</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Estado y Notificaciones */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900">Estado y Notificaciones</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#00D4D4]">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                </button>
                <span className="text-sm font-medium text-gray-700">Usuario activo</span>
              </label>
              <label className="flex items-center gap-3">
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#00D4D4]">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                </button>
                <span className="text-sm font-medium text-gray-700">Recibir notificaciones por email</span>
              </label>
              <label className="flex items-center gap-3">
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                </button>
                <span className="text-sm font-medium text-gray-700">Recibir notificaciones push</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="bg-[#00D4D4] hover:bg-[#00D4D4]/90">Guardar Usuario</Button>
        </div>
      </div>
    </div>
  )
}
