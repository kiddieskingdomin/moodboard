import { NextRequest, NextResponse } from 'next/server'
import products from '@/data/products.json'

export const runtime = 'nodejs'

// GET /api/products — fetch all or filtered products
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const ageRange = searchParams.get('ageRange')
    const skill = searchParams.get('skill')
    const search = searchParams.get('search')?.toLowerCase()

    let filtered = [...products.products]

    // Filter by category
    if (category) {
      filtered = filtered.filter(p => p.category === category)
    }

    // Filter by age range
    if (ageRange) {
      filtered = filtered.filter(p => p.ageRange.includes(ageRange))
    }

    // Filter by skill
    if (skill) {
      filtered = filtered.filter(p => p.skill.includes(skill))
    }

    // Filter by search term
    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.slug.includes(search) ||
        p.description.toLowerCase().includes(search)
      )
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      products: filtered,
    })
  } catch (err) {
    console.error('Products fetch error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
