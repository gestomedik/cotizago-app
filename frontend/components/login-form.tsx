"use client"

import { api } from "@/lib/api"  // ✅ CORREGIDO: Agregadas las llaves
import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, MapPin, Plane, Compass, Globe } from "lucide-react"
import Image from "next/image"

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log('🔐 Iniciando login...')
    console.log('📧 Email:', email)

    try {
      // Llamar al backend
      const response = await api.auth.login(email, password)
      
      console.log('✅ Respuesta del backend:', response)
      
      // El backend devuelve { success, message, data: { token, usuario } }
      if (response.success && response.data) {
        // Guardar token
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
          console.log('✅ Token guardado:', response.data.token.substring(0, 30) + '...')
        } else {
          throw new Error('No se recibió token del servidor')
        }
        
        // Guardar datos del usuario
        if (response.data.usuario) {
          localStorage.setItem('user', JSON.stringify(response.data.usuario))
          console.log('✅ Usuario guardado:', response.data.usuario.nombre)
        } else {
          throw new Error('No se recibieron datos del usuario')
        }
        
        // Verificar que se guardó correctamente
        const tokenGuardado = localStorage.getItem('token')
        const userGuardado = localStorage.getItem('user')
        console.log('🔍 Verificación:')
        console.log('   Token en localStorage:', tokenGuardado ? 'SÍ ✅' : 'NO ❌')
        console.log('   Usuario en localStorage:', userGuardado ? 'SÍ ✅' : 'NO ❌')
        
        // Redirigir al dashboard
        console.log('🚀 Redirigiendo al dashboard...')
        router.push("/dashboard")
      } else {
        throw new Error(response.message || 'Error desconocido en el login')
      }
    } catch (error: any) {
      console.error('❌ Error de login:', error)
      setError(error.message || 'Credenciales incorrectas. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - CotizaGO System Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#00D4D4] via-[#00B8B8] to-[#7CB342] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          <div className="max-w-md space-y-8">
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <Plane className="w-16 h-16 text-white" />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <Compass className="w-16 h-16 text-white" />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <Globe className="w-16 h-16 text-white" />
              </div>
            </div>

            {/* Brand Name */}
            <div className="text-center space-y-2">
              <h1 className="text-5xl font-bold tracking-tight text-balance">CotizaGO</h1>
              <p className="text-xl font-light tracking-wide">Sistema de Gestión de Cotizaciones</p>
            </div>

            {/* Tagline */}
            <div className="text-center space-y-4 pt-8">
              <p className="text-lg leading-relaxed text-balance">
                Gestiona tus cotizaciones de viaje de manera eficiente y profesional
              </p>
              <div className="flex flex-col items-center gap-3 pt-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm">Gestión completa de clientes y cotizaciones</span>
                </div>
                <div className="flex items-center gap-2">
                  <Plane className="w-5 h-5" />
                  <span className="text-sm">Seguimiento en tiempo real</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <span className="text-sm">Reportes y análisis detallados</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Agency Logo + Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex flex-col items-center justify-center gap-4 mb-8">
            <div className="bg-white rounded-xl p-2 shadow-lg">
              <Image
                src="/images/logo-experiencias-la-silla.png"
                alt="Experiencias La Silla"
                width={180}
                height={180}
                className="w-44 h-auto"
                priority
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-primary">CotizaGO</h1>
              <p className="text-sm text-muted-foreground">Sistema de Gestión</p>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-center justify-center mb-8">
            <Image
              src="/images/logo-experiencias-la-silla.png"
              alt="Experiencias La Silla"
              width={200}
              height={200}
              className="w-48 h-auto"
              priority
            />
          </div>

          {/* Form Header */}
          <div className="space-y-2 text-center lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Bienvenido</h2>
            <p className="text-muted-foreground">Ingresa tus credenciales para acceder al sistema</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer text-foreground">
                  Recordarme
                </Label>
              </div>
              <button 
                type="button" 
                className="text-sm text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pt-4">
            <p>
              ¿No tienes una cuenta?{" "}
              <button className="text-primary hover:underline font-medium">Contacta al administrador</button>
            </p>
          </div>

          {/* Debug info (solo en desarrollo) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
              <p className="font-bold mb-1">Debug:</p>
              <p>Abre la consola (F12) para ver logs detallados del login</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
