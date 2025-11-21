import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Check, X, Save, RefreshCw, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

type Permiso = {
    id: number
    rol: string
    recurso: string
    puede_ver: number
    puede_crear: number
    puede_editar: number
    puede_eliminar: number
}

export function PermisosTab() {
    const [permisos, setPermisos] = useState<Permiso[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const { toast } = useToast()

    const loadData = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await api.permisos.getAll()
            if (response.success) {
                setPermisos(response.data)
            } else {
                throw new Error(response.error || 'Error desconocido al cargar permisos')
            }
        } catch (error: any) {
            console.error('Error cargando permisos:', error)
            setError(error.message || 'Error de conexión')
            toast({
                title: "Error",
                description: "No se pudieron cargar los permisos",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleToggle = (id: number, field: 'puede_ver' | 'puede_crear' | 'puede_editar' | 'puede_eliminar') => {
        setPermisos(prev => prev.map(p => {
            if (p.id === id) {
                return { ...p, [field]: p[field] === 1 ? 0 : 1 }
            }
            return p
        }))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const promises = permisos.map(p => api.permisos.update(p.id, {
                puede_ver: p.puede_ver,
                puede_crear: p.puede_crear,
                puede_editar: p.puede_editar,
                puede_eliminar: p.puede_eliminar
            }))

            await Promise.all(promises)

            toast({
                title: "Éxito",
                description: "Permisos actualizados correctamente",
            })
        } catch (error) {
            console.error('Error guardando permisos:', error)
            toast({
                title: "Error",
                description: "Hubo un problema al guardar los cambios",
                variant: "destructive"
            })
        } finally {
            setSaving(false)
        }
    }

    // Agrupar por recurso para mostrar en tabla
    const recursos = Array.from(new Set(permisos.map(p => p.recurso)))

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Cargando permisos...</div>
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-red-800">Error al cargar permisos</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadData} variant="outline" className="bg-white">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Intentar de nuevo
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Matriz de Permisos</h3>
                    <p className="text-sm text-gray-600">Define qué acciones puede realizar cada rol en el sistema</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={loadData} disabled={saving}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Recargar
                    </Button>
                    <Button onClick={handleSave} disabled={saving} className="bg-[#00D4D4] hover:bg-[#00D4D4]/90">
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto border rounded-lg">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-1/3">Recurso</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 w-1/3">Administrador</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 w-1/3">Agente</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {recursos.map(recurso => {
                            const adminPermiso = permisos.find(p => p.recurso === recurso && p.rol === 'administrador')
                            const agentePermiso = permisos.find(p => p.recurso === recurso && p.rol === 'agente')

                            return (
                                <tr key={recurso} className="hover:bg-gray-50">
                                    <td className="px-4 py-4">
                                        <span className="font-medium text-gray-900 capitalize">{recurso.replace('_', ' ')}</span>
                                    </td>

                                    {/* Columna Admin */}
                                    <td className="px-4 py-4">
                                        <div className="flex justify-center gap-2">
                                            {adminPermiso && (
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <PermissionToggle
                                                        label="Ver"
                                                        active={adminPermiso.puede_ver === 1}
                                                        onClick={() => handleToggle(adminPermiso.id, 'puede_ver')}
                                                    />
                                                    <PermissionToggle
                                                        label="Crear"
                                                        active={adminPermiso.puede_crear === 1}
                                                        onClick={() => handleToggle(adminPermiso.id, 'puede_crear')}
                                                    />
                                                    <PermissionToggle
                                                        label="Editar"
                                                        active={adminPermiso.puede_editar === 1}
                                                        onClick={() => handleToggle(adminPermiso.id, 'puede_editar')}
                                                    />
                                                    <PermissionToggle
                                                        label="Eliminar"
                                                        active={adminPermiso.puede_eliminar === 1}
                                                        onClick={() => handleToggle(adminPermiso.id, 'puede_eliminar')}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Columna Agente */}
                                    <td className="px-4 py-4">
                                        <div className="flex justify-center gap-2">
                                            {agentePermiso && (
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <PermissionToggle
                                                        label="Ver"
                                                        active={agentePermiso.puede_ver === 1}
                                                        onClick={() => handleToggle(agentePermiso.id, 'puede_ver')}
                                                    />
                                                    <PermissionToggle
                                                        label="Crear"
                                                        active={agentePermiso.puede_crear === 1}
                                                        onClick={() => handleToggle(agentePermiso.id, 'puede_crear')}
                                                    />
                                                    <PermissionToggle
                                                        label="Editar"
                                                        active={agentePermiso.puede_editar === 1}
                                                        onClick={() => handleToggle(agentePermiso.id, 'puede_editar')}
                                                    />
                                                    <PermissionToggle
                                                        label="Eliminar"
                                                        active={agentePermiso.puede_eliminar === 1}
                                                        onClick={() => handleToggle(agentePermiso.id, 'puede_eliminar')}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function PermissionToggle({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1 px-2 py-1 rounded border transition-colors ${active
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}
            title={`${label}: ${active ? 'Permitido' : 'Denegado'}`}
        >
            {active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            <span>{label}</span>
        </button>
    )
}
