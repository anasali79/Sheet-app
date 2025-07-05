"use client"

import { ChevronRight, Search, Bell, Menu, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import type { User } from "@/types/spreadsheet"

interface SpreadsheetHeaderProps {
  searchText: string
  onSearchChange: (text: string) => void
  currentUser: User
  onLogout: () => void
}

export function SpreadsheetHeader({ searchText, onSearchChange, currentUser, onLogout }: SpreadsheetHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 px-2 sm:px-4 py-2 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="w-5 h-5" />
        </Button>

        {/* Breadcrumb - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
          <span>Workspace</span>
          <ChevronRight className="w-4 h-4" />
          <span>Folder 5</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Spreadsheet 3</span>
        </div>

        {/* Mobile breadcrumb */}
        <div className="md:hidden text-sm font-medium text-gray-900">Spreadsheet 3</div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search - Responsive */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search with sheet"
              className="pl-10 w-32 sm:w-48 md:w-64 h-8 text-sm"
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative p-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          </Button>

          {/* User profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm text-gray-700">{currentUser.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex flex-col items-start">
                <div className="font-medium">{currentUser.name}</div>
                <div className="text-sm text-gray-500">{currentUser.email}</div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Workspace</span>
            <ChevronRight className="w-4 h-4" />
            <span>Folder 5</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Spreadsheet 3</span>
          </div>
        </div>
      )}
    </header>
  )
}
