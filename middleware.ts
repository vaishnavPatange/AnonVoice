import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    try {

        const token = await getToken({ req: request });
        const url = request.nextUrl;

        if (token && (
            url.pathname.startsWith("/login") ||
            url.pathname.startsWith("/sign-up") ||
            url.pathname.startsWith("/verify") ||
            url.pathname.startsWith("/")
        )) {
            return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
        }

        if (!token && url.pathname.startsWith("/dashboard")) {
            return NextResponse.redirect(new URL('/login', request.nextUrl));
        }

        return NextResponse.next();

    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({
                message: error.message,
                success: false,
            }, { status: 500 })
        }
    }
}

export const config = {
    matcher: [
        "/login",
        "/sign-up",
        "/dashboard/:path*",
        "/",
        "/verify/:path*"
    ]
}

