
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function PATCH(req: Request) {
  const cookieStore = cookies()
  const sessionToken = (await cookieStore).get('session_token')?.value

  if (!sessionToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const user = await getSession(sessionToken)

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { username, avatar_url } = await req.json()

  try {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        username,
        avatar_url,
      },
    })

    // The session doesn't need to be updated manually, as the next
    // request will fetch the updated user data from the database.

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 },
    )
  }
}
