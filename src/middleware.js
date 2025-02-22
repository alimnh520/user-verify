import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(request) {
    const path = request.nextUrl.pathname;
    const token = request.cookies;
    const verifyToken = token.get('verify')?.value;
    const userVerified = token.get('user-verified')?.value;
    const setPass = token.get('set-pass')?.value;
    const isAdmin = token.get('is_admin')?.value;

    if (!verifyToken && path === '/verify-user') {
        return NextResponse.redirect(new URL('/', request.url))
    }
    if (!userVerified && path === '/homepage') {
        return NextResponse.redirect(new URL('/', request.url))
    }
    if (userVerified && path === '/') {
        return NextResponse.redirect(new URL('/homepage', request.url))
    }
    if (!verifyToken && path === '/forget-verify') {
        return NextResponse.redirect(new URL('/', request.url))
    }
    if (!setPass && path === '/new-pass') {
        return NextResponse.redirect(new URL('/', request.url))
    }
    if (!isAdmin && path === '/admin-page') {
        return NextResponse.redirect(new URL('/homepage', request.url))
    }
}

export const config = {
    matcher: [
        '/',
        '/verify-user',
        '/homepage',
        '/forget-verify',
        '/new-pass',
        '/admin-page'
    ],
}