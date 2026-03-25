import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import type { MoodboardDB } from '@/types/moodboard'

export const runtime = 'nodejs'

// POST /api/moodboard/save
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await req.json()
    const { id, title, background, items, drawingData } = body

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title required and must be non-empty' }, { status: 400 })
    }

    // If user is logged in, save to Supabase
    if (user) {
      const { data, error } = await supabase
        .from('moodboards')
        .upsert({
          id: id || undefined,
          user_id: user.id,
          title: title.trim(),
          background: background || '',
          items: JSON.stringify(items || []),
          drawing_data: drawingData || null,
          updated_at: new Date().toISOString(),
        } as MoodboardDB)
        .select()
        .single()

      if (error) {
        console.error('Supabase upsert error:', error)
        throw error
      }

      return NextResponse.json({ success: true, id: data.id, moodboard: data })
    }

    // Guest — no server save (client handles localStorage)
    return NextResponse.json({ success: true, guest: true })
  } catch (err) {
    console.error('Save error:', err)
    return NextResponse.json(
      { error: 'Save failed', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET /api/moodboard/save?id=xxx — load from Supabase
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    const baseQuery = supabase
      .from('moodboards')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    const queryWithId = id ? baseQuery.eq('id', id).single() : baseQuery

    const { data, error } = await queryWithId
    if (error) {
      console.error('Supabase query error:', error)
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('Load error:', err)
    return NextResponse.json(
      { error: 'Load failed', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
