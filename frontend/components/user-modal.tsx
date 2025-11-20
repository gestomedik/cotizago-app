"use client"

import { useState, useEffect } from "react"
import { X, Shield, User, Eye, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  user?: any
  onSave?: (userData: any) => Promise<void>
}

export default function UserModal({ isOpen, onClose, user, onSave }: UserModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [changePassword, setChangePassword] = useState(false)
  
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "", // ✅ Nuevo campo
    email: "",
    telefono: "",
    fecha_nacimiento: "",
    password: "",
    confirm_password: "",
    rol: "Agente",
    activo: true,
    permisos: {
      gestionar_clientes: true,
      gestionar_pasajeros: true,
      crear_cotizaciones: true,
      editar_cotizaciones: true,
      eliminar_cotizaciones: false,
      ver_reportes: false,
    }
  })

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellido: user.apellido || "", // ✅ Cargar apellido
        email: user.email || "",
        telefono: user.telefono || "",
        fecha_nacimiento: user.fecha_nacimiento || "",
        password: "",
        confirm_password: "",
        rol: user.rol || "Agente",
        activo: user.activo !== undefined ? user.activo : true,
        permisos: user.permisos || formData.permisos
      })
      setChangePassword(false)
    } else {
      setFormData({
        nombre: "", apellido: "", email: "", telefono: "", fecha_nacimiento: "",
        password: "", confirm_password: "", rol: "Agente", activo: true,
        permisos: {
            gestionar_clientes: true, gestionar_pasajeros: true, crear_cotizaciones: true,
            editar_cotizaciones: true, eliminar_cotizaciones: false, ver_reportes: false,
        }
      })
      setChangePassword(true)
    }
  }, [user, isOpen])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePermissionChange = (permiso: string, value: boolean) => {
      setFormData(prev => ({
          ...prev,
          permisos: { ...prev.permisos, [permiso]: value }
      }))
  }

  const handleSubmit = async () => {
    console.log("1. Inicio handleSubmit");
    
    // Validar campos obligatorios
    if (!formData.nombre || !formData.apellido || !formData.email) {
        console.log("ERROR: Faltan campos obligatorios", formData);
        alert("Por favor completa Nombre, Apellido y Email.");
        return;
    }

    // Validar contraseñas si aplica
    if (changePassword) {
        if (formData.password !== formData.confirm_password) {
            alert("Las contraseñas no coinciden");
            return;
        }
        if (!user && !formData.password) {
             alert("Debes asignar una contraseña al nuevo usuario");
             return;
        }
    }

    console.log("2. Validaciones pasaron. Intentando guardar...");

    try {
        setIsLoading(true);
        if (onSave) {
            console.log("3. Llamando a onSave del padre...");
            await onSave({ ...formData, id: user?.id });
            console.log("4. onSave terminó con éxito");
        } else {
            console.error("ERROR CRÍTICO: No se pasó la función onSave al modal");
            alert("Error de configuración: No se puede guardar.");
        }
    } catch (error) {
        console.error("5. Error durante el guardado:", error);
        alert("Ocurrió un error al intentar guardar.");
    } finally {
        setIsLoading(false);
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">{user ? "Editar Usuario" : "Nuevo Usuario"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ✅ NOMBRE Y APELLIDO SEPARADOS */}
              <div>
                <Label htmlFor="nombre">Nombre(s) *</Label>
                <Input id="nombre" value={formData.nombre} onChange={e => handleChange('nombre', e.target.value)} placeholder="Ej: María" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="apellido">Apellido(s) *</Label>
                <Input id="apellido" value={formData.apellido} onChange={e => handleChange('apellido', e.target.value)} placeholder="Ej: González" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} placeholder="maria@cotizago.com" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" value={formData.telefono} onChange={e => handleChange('telefono', e.target.value)} placeholder="+52..." className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="birthdate">Fecha de nacimiento</Label>
                <Input id="birthdate" type="date" value={formData.fecha_nacimiento} onChange={e => handleChange('fecha_nacimiento', e.target.value)} className="mt-1.5" />
              </div>
            </div>
          </div>

          {/* ... (El resto del componente: Credenciales, Roles, Permisos, Estado y Footer SIGUE IGUAL que la versión anterior) ... */}
          {/* ... COPIA Y PEGA EL RESTO DEL CÓDIGO DE LA RESPUESTA ANTERIOR SI LO NECESITAS, ES IDÉNTICO DESDE AQUÍ ... */}
           <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-semibold text-gray-900">Acceso y Seguridad</h3>
                {user && (
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                    type="checkbox"
                    checked={changePassword}
                    onChange={(e) => setChangePassword(e.target.checked)}
                    className="w-4 h-4 accent-[#00D4D4]"
                    />
                    <span className="text-sm text-gray-700">Cambiar contraseña</span>
                </label>
                )}
            </div>

            {(changePassword) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border">
                <div>
                  <Label htmlFor="password">Nueva Contraseña *</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={formData.password}
                    onChange={e => handleChange('password', e.target.value)}
                    className="mt-1.5 bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirmar contraseña *</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    value={formData.confirm_password}
                    onChange={e => handleChange('confirm_password', e.target.value)}
                    className="mt-1.5 bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Rol y Permisos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['Administrador', 'Agente', 'Visor'].map((rolOption) => (
                  <label key={rolOption} className={`flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.rol === rolOption ? 'border-[#00D4D4] bg-[#00D4D4]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <input type="radio" name="role" value={rolOption} checked={formData.rol === rolOption} onChange={(e) => handleChange('rol', e.target.value)} className="accent-[#00D4D4]" />
                        <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                            {rolOption === 'Administrador' && <Shield className="w-4 h-4 text-red-600"/>}
                            {rolOption === 'Agente' && <User className="w-4 h-4 text-blue-600"/>}
                            {rolOption === 'Visor' && <Eye className="w-4 h-4 text-gray-600"/>}
                            {rolOption}
                        </span>
                    </div>
                  </label>
              ))}
            </div>
             {formData.rol === "Agente" && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-900 mb-3">Permisos Específicos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {Object.entries(formData.permisos).map(([key, value]) => (
                       <label key={key} className="flex items-center gap-2 cursor-pointer">
                         <input type="checkbox" checked={value as boolean} onChange={e => handlePermissionChange(key, e.target.checked)} className="w-4 h-4 accent-blue-600" />
                         <span className="text-sm text-slate-700 capitalize">{key.replace('_', ' ')}</span>
                       </label>
                   ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold text-gray-900">Estado</h3>
            <div className="bg-gray-50 p-4 rounded-lg border flex items-center justify-between">
                <span className="font-medium text-gray-900">Usuario Activo</span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={formData.activo} onChange={e => handleChange('activo', e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D4D4]"></div>
                </label>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancelar</Button>
          <Button onClick={handleSubmit} className="bg-[#00D4D4] hover:bg-[#00B8B8] min-w-[140px]" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : (user ? "Actualizar" : "Crear")}
          </Button>
        </div>
      </div>
    </div>
  )
}