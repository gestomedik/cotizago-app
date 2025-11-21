import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export type Permiso = {
    id: number
    rol: string
    recurso: string
    puede_ver: number
    puede_crear: number
    puede_editar: number
    puede_eliminar: number
}

export function usePermissions() {
    const [permisos, setPermisos] = useState<Permiso[]>([])
    const [loading, setLoading] = useState(true)
    const [userRole, setUserRole] = useState<string>('')

    useEffect(() => {
        const loadPermissions = async () => {
            try {
                // Obtener rol del usuario del localStorage
                const userStr = localStorage.getItem('user')
                if (userStr) {
                    const user = JSON.parse(userStr)
                    setUserRole(user.rol)
                }

                // Cargar permisos desde API
                const response = await api.permisos.getMisPermisos()
                if (response.success) {
                    setPermisos(response.data)
                }
            } catch (error) {
                console.error('Error al cargar permisos:', error)
            } finally {
                setLoading(false)
            }
        }

        loadPermissions()
    }, [])

    const tienePermiso = (recurso: string, accion: 'ver' | 'crear' | 'editar' | 'eliminar') => {
        // Si es admin, siempre tiene permiso (fallback frontend, backend valida real)
        if (userRole === 'administrador') return true

        const permiso = permisos.find(p => p.recurso === recurso)
        if (!permiso) return false

        switch (accion) {
            case 'ver': return permiso.puede_ver === 1
            case 'crear': return permiso.puede_crear === 1
            case 'editar': return permiso.puede_editar === 1
            case 'eliminar': return permiso.puede_eliminar === 1
            default: return false
        }
    }

    const esAdmin = () => {
        console.log('Rol detectado:', userRole) // Debug
        return userRole?.toLowerCase() === 'administrador' || userRole?.toLowerCase() === 'admin'
    }

    return {
        permisos,
        loading,
        tienePermiso,
        esAdmin,
        userRole
    }
}
