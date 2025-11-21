import { usePermissions } from '@/hooks/usePermissions'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ProtectedRouteProps {
    children: React.ReactNode
    recurso: string
    accion?: 'ver' | 'crear' | 'editar' | 'eliminar'
    fallback?: React.ReactNode
}

export function ProtectedRoute({
    children,
    recurso,
    accion = 'ver',
    fallback
}: ProtectedRouteProps) {
    const { loading, tienePermiso } = usePermissions()

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Verificando permisos...</div>
    }

    if (!tienePermiso(recurso, accion)) {
        if (fallback) return <>{fallback}</>

        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <ShieldAlert className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Restringido</h2>
                <p className="text-gray-600 max-w-md mb-6">
                    No tienes permisos suficientes para acceder a esta sección ({recurso}).
                    Si crees que es un error, contacta al administrador.
                </p>
                <Link href="/dashboard">
                    <Button>Volver al Dashboard</Button>
                </Link>
            </div>
        )
    }

    return <>{children}</>
}
