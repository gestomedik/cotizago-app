import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import {
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Upload,
    Loader2,
} from 'lucide-react'

type EmpresaData = {
    nombre_empresa: string
    telefono: string
    email: string
    sitio_web: string
    calle: string
    colonia: string
    ciudad: string
    estado: string
    codigo_postal: string
    pais: string
    logo_url: string
    facebook: string
    instagram: string
    twitter: string
    linkedin: string
}

export function EmpresaTab() {
    const [formData, setFormData] = useState<EmpresaData>({
        nombre_empresa: '',
        telefono: '',
        email: '',
        sitio_web: '',
        calle: '',
        colonia: '',
        ciudad: '',
        estado: '',
        codigo_postal: '',
        pais: 'México',
        logo_url: '',
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const response = await api.configuracionEmpresa.get()
            if (response.success && response.data) {
                setFormData(response.data)
            }
        } catch (error: any) {
            console.error('Error cargando configuración:', error)
            toast({
                title: 'Error',
                description: 'No se pudo cargar la configuración de empresa',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field: keyof EmpresaData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        // Validar campos requeridos
        if (!formData.nombre_empresa.trim()) {
            toast({
                title: 'Error',
                description: 'El nombre de la empresa es requerido',
                variant: 'destructive',
            })
            return
        }

        setSaving(true)
        try {
            console.log('Guardando configuración:', formData)
            const response = await api.configuracionEmpresa.update(formData)
            console.log('Respuesta del servidor:', response)

            // Mostrar toast de éxito con variante success
            toast({
                title: '✓ Éxito',
                description: response.message || 'Configuración guardada correctamente',
                variant: 'success',
            })

            // Actualizar con los datos del servidor si existen
            if (response.data) {
                setFormData(response.data)
            }
        } catch (error: any) {
            console.error('Error guardando configuración:', error)
            toast({
                title: 'Error',
                description: error.message || 'No se pudo guardar la configuración',
                variant: 'destructive',
            })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#00D4D4]" />
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Información de Empresa</h2>

                {/* Datos Generales */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Datos Generales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="company-name">Nombre de la empresa *</Label>
                            <Input
                                id="company-name"
                                value={formData.nombre_empresa}
                                onChange={(e) => handleChange('nombre_empresa', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Teléfono principal *</Label>
                            <Input
                                id="phone"
                                value={formData.telefono}
                                onChange={(e) => handleChange('telefono', e.target.value)}
                                placeholder="+52 81 1234 5678"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email de contacto *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="contacto@experienciaslasilla.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="website">Sitio web</Label>
                            <Input
                                id="website"
                                value={formData.sitio_web}
                                onChange={(e) => handleChange('sitio_web', e.target.value)}
                                placeholder="https://www.experienciaslasilla.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Dirección */}
                <div className="space-y-6 pt-8 border-t">
                    <h3 className="text-lg font-semibold text-gray-900">Dirección</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <Label htmlFor="street">Calle y número *</Label>
                            <Input
                                id="street"
                                value={formData.calle}
                                onChange={(e) => handleChange('calle', e.target.value)}
                                placeholder="Av. Principal 123"
                            />
                        </div>
                        <div>
                            <Label htmlFor="neighborhood">Colonia</Label>
                            <Input
                                id="neighborhood"
                                value={formData.colonia}
                                onChange={(e) => handleChange('colonia', e.target.value)}
                                placeholder="Centro"
                            />
                        </div>
                        <div>
                            <Label htmlFor="city">Ciudad *</Label>
                            <Input
                                id="city"
                                value={formData.ciudad}
                                onChange={(e) => handleChange('ciudad', e.target.value)}
                                placeholder="Monterrey"
                            />
                        </div>
                        <div>
                            <Label htmlFor="state">Estado/Provincia *</Label>
                            <Input
                                id="state"
                                value={formData.estado}
                                onChange={(e) => handleChange('estado', e.target.value)}
                                placeholder="Nuevo León"
                            />
                        </div>
                        <div>
                            <Label htmlFor="zip">Código postal *</Label>
                            <Input
                                id="zip"
                                value={formData.codigo_postal}
                                onChange={(e) => handleChange('codigo_postal', e.target.value)}
                                placeholder="64000"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <Label htmlFor="country">País *</Label>
                            <Input
                                id="country"
                                value={formData.pais}
                                onChange={(e) => handleChange('pais', e.target.value)}
                            />
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
                                <Input
                                    id="facebook"
                                    className="pl-10"
                                    value={formData.facebook}
                                    onChange={(e) => handleChange('facebook', e.target.value)}
                                    placeholder="facebook.com/experienciaslasilla"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="instagram">Instagram</Label>
                            <div className="relative">
                                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="instagram"
                                    className="pl-10"
                                    value={formData.instagram}
                                    onChange={(e) => handleChange('instagram', e.target.value)}
                                    placeholder="@experienciaslasilla"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="twitter">Twitter/X</Label>
                            <div className="relative">
                                <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="twitter"
                                    className="pl-10"
                                    value={formData.twitter}
                                    onChange={(e) => handleChange('twitter', e.target.value)}
                                    placeholder="@experienciaslasilla"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <div className="relative">
                                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="linkedin"
                                    className="pl-10"
                                    value={formData.linkedin}
                                    onChange={(e) => handleChange('linkedin', e.target.value)}
                                    placeholder="linkedin.com/company/experienciaslasilla"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-[#00D4D4] hover:bg-[#00D4D4]/90"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            'Guardar Cambios'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
