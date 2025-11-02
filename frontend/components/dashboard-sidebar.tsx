"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, UserPlus, FileText, Package, DollarSign, BarChart, Settings, LogOut, Menu, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Clientes", href: "/clientes" },
  { icon: UserPlus, label: "Pasajeros", href: "/pasajeros" },
  { icon: FileText, label: "Cotizaciones", href: "/cotizaciones" },
  { icon: Package, label: "Plantillas", href: "/plantillas" },
  { icon: DollarSign, label: "Comisiones", href: "/comisiones" },
  { icon: BarChart, label: "Reportes", href: "/reportes" },
  { icon: Settings, label: "Configuración", href: "/configuracion" },
]

export function DashboardSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[#1F2937]">
      {/* Logo Section */}
      <div className="flex flex-col items-center gap-2 border-b border-gray-700 p-6">
        <Image
          src="/images/logo-experiencias-la-silla.png"
          alt="Experiencias La Silla"
          width={100}
          height={40}
          className="object-contain"
        />
        <h2 className="text-xl font-bold text-[#00D4D4]">CotizaGO</h2>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                "hover:bg-gray-700/50",
                isActive
                  ? "border-l-4 border-[#00D4D4] bg-gray-700/50 text-[#00D4D4]"
                  : "border-l-4 border-transparent text-gray-300",
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-[#00D4D4]")} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-700 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-gray-700/50 p-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-user.jpg" alt="Admin Sistema" />
            <AvatarFallback className="bg-[#00D4D4] text-white">AS</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-white">Admin Sistema</p>
            <p className="truncate text-xs text-gray-400">Administrador</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-gray-300 hover:bg-gray-700/50 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar Sesión</span>
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-60 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="fixed left-0 top-0 z-50 h-screen w-60 lg:hidden">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  )
}
