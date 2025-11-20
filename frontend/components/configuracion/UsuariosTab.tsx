"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit2, Trash2, Shield, User, Eye, Loader2, AlertCircle } from "lucide-react"
import UserModal from "@/components/user-modal"
import { api } from "@/lib/api"

// Definimos la interfaz según lo que devuelve tu backend PHP
interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fecha_nacimiento?: string;
  rol: 'Administrador' | 'Agente' | 'Visor';
  activo: boolean;
  ultimo_acceso?: string;
  permisos?: any;
}

export function UsuariosTab() {
  const [users, setUsers] = useState<Usuario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchUser, setSearchUser] = useState("")
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<Usuario | null>(null)
  const [error, setError] = useState<string | null>(null)

  // --- CARGAR USUARIOS ---
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const res = await api.usuarios.list()
      if (res.success) {
        setUsers(res.data)
      } else {
        setError("No se pudieron cargar los usuarios")
      }
    } catch (err) {
      console.error(err)
      setError("Error de conexión al cargar usuarios")
    } finally {
      setIsLoading(false)
    }
  }

  // --- GUARDAR (CREAR / EDITAR) ---
  // Esta función se pasa al UserModal para que él la llame al guardar
  const handleSaveUser = async (userData: any) => {
    try {
      let res;
      console.log("📦 DATOS RECIBIDOS DEL MODAL:", userData);
      // Si tiene ID, es una actualización
      if (userData.id) {
        res = await api.usuarios.update(userData.id, userData);
      } else {
        // Si no, es creación
        res = await api.usuarios.create(userData);
      }

      if (res.success) {
        await loadUsers(); // Recargar la lista para ver los cambios
        setIsUserModalOpen(false);
        setEditingUser(null);
      } else {
        alert("Error al guardar: " + (res.error || "Error desconocido"));
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al guardar usuario");
    }
  }

  // --- ELIMINAR ---
  const handleDeleteUser = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar al usuario "${nombre}"?`)) return;

    try {
      const res = await api.usuarios.delete(id);
      if (res.success) {
        // Actualizar UI optimista (quitándolo de la lista local)
        setUsers(users.filter(u => u.id !== id));
      } else {
        alert("No se pudo eliminar: " + res.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error al intentar eliminar");
    }
  }

  // --- HELPERS VISUALES ---
  const getInitials = (nombre: string, apellido: string) => {
    return (nombre[0] + (apellido ? apellido[0] : '')).toUpperCase();
  }

  const formatLastLogin = (dateStr?: string) => {
    if (!dateStr) return 'Nunca';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Nunca';

    return new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Administrador": return "bg-red-100 text-red-800 border border-red-200"
      case "Agente": return "bg-blue-100 text-blue-800 border border-blue-200"
      default: return "bg-gray-100 text-gray-800 border border-gray-200"
    }
  }

  // Filtrado local para la búsqueda
  const filteredUsers = users.filter(user =>
    `${user.nombre} ${user.apellido}`.toLowerCase().includes(searchUser.toLowerCase()) ||
    user.email.toLowerCase().includes(searchUser.toLowerCase())
  )

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#00D4D4]" /></div>

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}

        {/* ENCABEZADO Y BÚSQUEDA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <Button onClick={() => { setEditingUser(null); setIsUserModalOpen(true); }} className="bg-[#00D4D4] hover:bg-[#00B8B8] w-full sm:w-auto">
            <Plus className="w-5 h-5 mr-2" /> Nuevo Usuario
          </Button>
        </div>

        {/* TABLA DE USUARIOS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Última sesión</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${user.activo ? 'bg-[#00D4D4]/10 text-[#00D4D4]' : 'bg-gray-100 text-gray-400'}`}>
                          {getInitials(user.nombre, user.apellido)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.nombre} {user.apellido}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.rol)}`}>
                        {user.rol === "Administrador" && <Shield className="w-3.5 h-3.5" />}
                        {user.rol === "Agente" && <User className="w-3.5 h-3.5" />}
                        {user.rol === "Visor" && <Eye className="w-3.5 h-3.5" />}
                        {user.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.activo ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatLastLogin(user.ultimo_acceso)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingUser(user); setIsUserModalOpen(true); }} className="hover:text-[#00D4D4] hover:bg-[#00D4D4]/10">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id, user.nombre)} className="hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL DE USUARIO CONECTADO */}
        <UserModal
          isOpen={isUserModalOpen}
          onClose={() => { setIsUserModalOpen(false); setEditingUser(null); }}
          user={editingUser}
          onSave={handleSaveUser}
        />
      </div>
    </div>
  )
}