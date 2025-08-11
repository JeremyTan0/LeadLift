import { NextResponse } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('access_token');
    
    if (!token) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/search', '/businesses/:path*']
};