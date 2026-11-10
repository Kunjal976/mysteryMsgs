import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const url = request.nextUrl
    const pathname = url.pathname

    const isAuthPage = 
        pathname.startsWith('/sign-in') ||
        pathname.startsWith('/sign-up') ||
        pathname.startsWith('/verify')

    // 1. If logged in and trying to access sign-in/up pages, send them to dashboard
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // 2. If NOT logged in and trying to access the dashboard, send them to sign-in
    if (!token && pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/sign-in',
        '/sign-up',
        '/',
        '/verify/:path*'
    ]
}