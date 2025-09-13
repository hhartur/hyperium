'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { UserTable } from '@/components/admin/user-table'
import { GameModeration } from '@/components/admin/game-moderation'
import { ReportManagement } from '@/components/admin/report-management'
import { Users, Gamepad2, Flag, Shield } from 'lucide-react'

export default function AdminPage() {
  const { user: profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!profile || !profile.is_admin)) {
      router.push('/')
    }
  }, [profile, loading, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!profile?.is_admin) {
    return null // Will redirect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, games, and reports across the platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Users className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <CardTitle className="text-lg">User Management</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Manage Users
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Gamepad2 className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <CardTitle className="text-lg">Game Moderation</CardTitle>
              <CardDescription>Approve or reject games</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Moderate Games
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Flag className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <CardTitle className="text-lg">Report Management</CardTitle>
              <CardDescription>Review and resolve reports</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Manage Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-6 w-6 mr-2" />
            Admin Overview
          </CardTitle>
          <CardDescription>
            Quick statistics and recent activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary-600">0</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary-600">0</div>
              <div className="text-sm text-muted-foreground">Active Games</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary-600">0</div>
              <div className="text-sm text-muted-foreground">Pending Reports</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 space-y-8">
        <UserTable />
        <GameModeration />
        <ReportManagement />
      </div>
    </div>
  )
}
