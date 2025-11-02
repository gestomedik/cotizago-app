"use client"

import { Bell, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface DashboardHeaderProps {
  title: string
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left: Spacer for mobile menu button */}
        <div className="w-10 lg:hidden" />

        {/* Center: Page Title */}
        <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">{title}</h1>

        {/* Right: Search, Notifications, User */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Search - Hidden on mobile */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input type="search" placeholder="Buscar..." className="w-48 pl-9 lg:w-64" />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
              3
            </Badge>
          </Button>

          {/* User Avatar */}
          <Button variant="ghost" className="gap-2 px-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
              <AvatarFallback className="bg-[#00D4D4] text-white text-xs">AS</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  )
}
