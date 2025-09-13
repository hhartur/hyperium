import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { reporter_id, reported_game_id, reason, description } = body

    if (!reporter_id || !reported_game_id || !reason) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const report = await prisma.report.create({
        data: {
            reporter_id: reporter_id,
            game_id: reported_game_id,      // ← aqui é o nome correto
            reason,
            description: description || null,
            status: 'pending',
        },
        })

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error('Failed to create report:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
