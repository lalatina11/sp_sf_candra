import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest,) {
    const cookie = cookies()
    const token = (await cookie).get("user_token")?.value as string
    const recognition = request.headers.get('Recognition')
    if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/projects/*')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')) {
        if (token) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }
    if (request.nextUrl.pathname.startsWith('/api')) {
        if (recognition !== process.env.NEXT_PUBLIC_SECRET_KEY) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }
    }
}
