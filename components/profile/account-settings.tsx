
'use client'

import { useState } from 'react'
import { useAuthContext } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AccountSettings() {
  const { user, setUser } = useAuthContext()
  const [username, setUsername] = useState(user?.username || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, avatar_url: avatarUrl }),
      })

      if (res.json) {
        const updatedUser = await res.json()
        setUser(updatedUser)
        setSuccess('Profile updated successfully!')
      } else {
        const errorData = await res.json()
        setError(errorData.error || 'Failed to update profile.')
      }
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      <div>
        <label htmlFor="username" className="block mb-1">
          Username
        </label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="avatarUrl" className="block mb-1">
          Avatar URL
        </label>
        <Input
          id="avatarUrl"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Profile'}
      </Button>
    </form>
  )
}
