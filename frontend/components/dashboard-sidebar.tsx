"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import {
  Home, Users, UserPlus, FileText, Package, DollarSign,
  BarChart, Settings, LogOut, Menu, X, ChevronDown, ChevronRight,
  UserCog, Building2, Shield, Bell, Mail, ShieldCheck
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Definición de la estructura del menú
const menuItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Clientes", href: "/clientes" },
  { icon: UserPlus, label: "Pasajeros", href: "/pasajeros" },
  { icon: FileText, label: "Cotizaciones", href: "/cotizaciones" },
  { icon: Package, label: "Plantillas", href: "/plantillas" },
  { icon: DollarSign, label: "Comisiones", href: "/comisiones" },
  { icon: BarChart, label: "Reportes", href: "/reportes" },
  {
    icon: Settings,
    label: "Configuración",
    href: "/configuracion",
    // ✅ AQUÍ DEFINIMOS LOS SUBMENÚS
    // Usamos parámetros URL (?section=...) para navegar dentro de la misma página
    submenu: [
      { label: "Usuarios", href: "/configuracion?section=users", icon: UserCog },
      { label: "Empresa", href: "/configuracion?section=company", icon: Building2 },
      { label: "Seguridad", href: "/configuracion?section=security", icon: Shield },
      { label: "Roles y Permisos", href: "/configuracion?section=roles", icon: ShieldCheck },
      { label: "Notificaciones", href: "/configuracion?section=notifications", icon: Bell },
    ]
  },
]

export function DashboardSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Estado para controlar qué menús están expandidos
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  // Efecto para auto-expandir el menú si estamos en esa sección
  useEffect(() => {
    if (pathname.startsWith('/configuracion')) {
      setExpandedMenus(prev => prev.includes('/configuracion') ? prev : [...prev, '/configuracion'])
    }
  }, [pathname])

  const toggleSubmenu = (href: string) => {
    setExpandedMenus(prev =>
      prev.includes(href) ? prev.filter(item => item !== href) : [...prev, href]
    );
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[#1F2937] text-gray-300">
      {/* Logo Section */}
      <div className="flex flex-col items-center gap-2 border-b border-gray-700 p-6 flex-shrink-0">
        {/* Asegúrate de que la ruta del logo sea correcta */}
        {/* <Image src="/images/logo-experiencias-la-silla.png" alt="Logo" width={100} height={40} className="object-contain"/> */}
        <h2 className="text-xl font-bold text-[#00D4D4]">CotizaGO</h2>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isExpanded = expandedMenus.includes(item.href)
          // Está activo si la ruta coincide base
          const isActiveBase = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <div key={item.label}>
              {item.submenu ? (
                // --- ÍTEM CON SUBMENÚ ---
                <button
                  onClick={() => toggleSubmenu(item.href)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-gray-700/50",
                    isActiveBase ? "text-[#00D4D4]" : "text-gray-300"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              ) : (
                // --- ÍTEM NORMAL ---
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-gray-700/50",
                    isActiveBase
                      ? "bg-gray-700/50 text-[#00D4D4] border-l-4 border-[#00D4D4]"
                      : "border-l-4 border-transparent"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActiveBase && "text-[#00D4D4]")} />
                  <span>{item.label}</span>
                </Link>
              )}

              {/* --- RENDERIZADO DE SUBMENÚS --- */}
              {item.submenu && isExpanded && (
                <div className="ml-4 mt-1 pl-3 border-l border-gray-700 space-y-1">
                  {item.submenu.map((sub) => {
                    const SubIcon = sub.icon
                    // Verificamos si este submenú está activo mirando los parámetros URL
                    const currentSection = searchParams.get('section')
                    const isSubActive = sub.href.includes(`section=${currentSection}`)

                    return (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-all hover:bg-gray-700/30",
                          isSubActive ? "text-[#00D4D4] bg-gray-700/30 font-medium" : "text-gray-400"
                        )}
                      >
                        <SubIcon className="h-4 w-4 opacity-75" />
                        <span>{sub.label}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-700 p-4 flex-shrink-0">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-gray-700/50 p-3">
          <Avatar className="h-10 w-10 border border-gray-600">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="bg-[#00D4D4] text-white font-bold">AS</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-white">Admin Sistema</p>
            <p className="truncate text-xs text-gray-400">Administrador</p>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start gap-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors">
          <LogOut className="h-4 w-4" />
          <span>Cerrar Sesión</span>
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Trigger */}
      <Button variant="ghost" size="icon" className="fixed left-4 top-3 z-50 lg:hidden bg-white shadow-sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block shadow-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 shadow-2xl z-50">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}