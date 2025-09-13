'use client'

import React from 'react'
import { useAuthContext } from '@/components/providers/auth-provider'

export default function ProfilePage() {
  const { user, loading } = useAuthContext()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please log in to view your profile.</div>

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="flex items-center space-x-4 mb-4">
                <img src={user?.avatar_url || 'https://via.placeholder.com/150'} alt="Avatar" className="w-24 h-24 rounded-full" />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <p className="text-gray-700">{user.email}</p>
      </div>
      <div className="mb-4">
        <label className="block mb-1">Username</label>
        <p className="text-gray-700">{user.username}</p>
      </div>
      <div className="mb-4">
        <label className="block mb-1">Email Verified</label>
        <p className="text-gray-700">{user.email_verified ? 'Yes' : 'No'}</p>
      </div>
      <div className="mb-4">
        <label className="block mb-1">Admin</label>
        <p className="text-gray-700">{user.is_admin ? 'Yes' : 'No'}</p>
      </div>
    </div>
  )
}