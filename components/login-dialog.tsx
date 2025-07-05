"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { User } from "@/types/spreadsheet"

interface LoginDialogProps {
  open: boolean
  onLogin: (user: User) => void
}

export function LoginDialog({ open, onLogin }: LoginDialogProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user: User = {
      email: email.toLowerCase(),
      name: name.trim(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
    }

    onLogin(user)
    setIsLoading(false)
  }

  const quickLogin = (userData: User) => {
    onLogin(userData)
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideClose>
        <DialogHeader>
          <DialogTitle className="text-center">Welcome to Spreadsheet</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">Or quick login as</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => quickLogin({ email: "john@company.com", name: "John Doe" })}
          >
            John Doe
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => quickLogin({ email: "jane@company.com", name: "Jane Smith" })}
          >
            Jane Smith
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
