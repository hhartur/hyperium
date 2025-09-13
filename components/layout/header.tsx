'use client'

import Link from 'next/link'
import { Search, ShoppingCart, User, Moon, Sun, Plus, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTheme } from 'next-themes'
import { useAuthContext } from '@/components/providers/auth-provider'
import { AuthDialog } from '@/components/auth/auth-dialog'
import { useState } from 'react'

export function Header() {
  const { theme, setTheme } = useTheme()
  const { user, logout, loading } = useAuthContext()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="text-xl font-bold text-primary-600">Hyperium</span>
          </Link>
        </div>

        <div className="flex-1 max-w-lg mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-2 h-11 bg-background/50 backdrop-blur-sm border-2 border-border/50 focus:border-primary-500 transition-colors rounded-full shadow-sm hover:shadow-md focus:shadow-lg"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle theme"
            className="relative"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
          </Button>

          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
              <div className="h-8 w-20 bg-muted rounded-md animate-pulse" />
            </div>
          ) : user ? (
            <>
              {user.is_admin && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
              {user.email_verified && (
                <Link href="/games/add">
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Game
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="icon" onClick={() => alert('Cart page not implemented yet')}>
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button onClick={logout} variant="outline" size="sm">
                Sign Out
              </Button>
            </>
          ) : (
            <AuthDialog />
          )}
        </div>
      </div>
    </header>
  )
}
