import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname

    // Public routes that don't require authentication
    const isPublicRoute =
      pathname === '/' ||
      pathname.startsWith('/moodboard') ||
      pathname.startsWith('/api/moodboard')

    // Skip Supabase entirely for public routes — no auth needed
    if (isPublicRoute) {
      return NextResponse.next({ request })
    }

    // For auth-protected routes, check the session
    let supabaseResponse = NextResponse.next({ request })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // If credentials missing, treat as logged out
    if (!url || !anonKey) {
      return NextResponse.next({ request })
    }

    const supabase = createServerClient(url, anonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set(name, value)
          supabaseResponse = NextResponse.next({ request })
          supabaseResponse.cookies.set(name, value, options)
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set(name, '')
          supabaseResponse = NextResponse.next({ request })
          supabaseResponse.cookies.set(name, '', { ...options, maxAge: 0 })
        },
      },
    })

    let user = null
    try {
      const { data } = await supabase.auth.getUser()
      user = data.user
    } catch {
      // Supabase unreachable — treat as logged out
    }

    return supabaseResponse
  } catch (error) {
    // On any middleware error, allow request to proceed
    return NextResponse.next({ request })
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
