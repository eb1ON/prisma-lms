import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData()
    const title = data.get('title') as string | null
    const description = data.get('description') as string | null
    const course = data.get('course') ? parseInt(data.get('course') as string) : null
    const teacherId = data.get('teacherId') as string | null
    const file = data.get('file') as File | null

    if (!title || !description || !course || !teacherId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let fileUrl: string | null = null
    if (file && file.name) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const uploadPath = path.join(process.cwd(), 'public/uploads', file.name)
      await writeFile(uploadPath, buffer)
      fileUrl = `/uploads/${file.name}`
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        course,
        teacherId,
        fileUrl: fileUrl ?? undefined,
      },
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 })
    }

    return NextResponse.json(assignment)
  } catch (err) {
    console.error('POST /api/assignments error:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
