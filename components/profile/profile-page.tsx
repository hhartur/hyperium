'use client'

import React from 'react'
import { useAuthContext } from '@/components/providers/auth-provider'
import Image from 'next/image'
import AccountSettings from './account-settings'

export default function ProfilePage() {
  const { user, loading } = useAuthContext()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please log in to view your profile.</div>

  return (
    <div className="max-w-4xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <h2 className="text-xl font-bold mb-4">Your Profile</h2>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32">
            <Image
              src={user?.avatar_url || 'https://via.placeholder.com/150'}
              alt="Avatar"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{user.username}</p>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>
      <div className="md:col-span-2">
        <h2 className="text-xl font-bold mb-4">Account Settings</h2>
        <AccountSettings />
      </div>
    </div>
  )
}