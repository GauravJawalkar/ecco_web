import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const middleware = async (request: NextRequest) => {
    const path = request.nextUrl.pathname;

    // Skip middleware for static files and next internals
    if (
        path.startsWith("/_next/") ||
        path.startsWith("/api/") ||  // ← API routes protect themselves
        path.includes(".") ||
        path === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

    const refreshToken = request.cookies.get("refreshToken")?.value?.trim();

    // Define protected page routes (require authentication)
    const securePaths = [
        "/cart",
        "/checkout",
        "/profile",
        "/orders",
        "/dashboard",
        "/settings",
    ];

    const isSecurePath = securePaths.some(
        (securePath) =>
            path === securePath || path.startsWith(securePath + "/")
    );

    // Check if refresh token exists and is cryptographically valid
    let hasValidRefreshToken = false;
    if (refreshToken) {
        try {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
            hasValidRefreshToken = true;
        } catch {
            hasValidRefreshToken = false;
        }
    }

    // Scenario A: Protected page — no valid refresh token → redirect to login
    if (isSecurePath && !hasValidRefreshToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Scenario B: Already logged in — trying to access login/signup
    if ((path === "/login" || path === "/signup") && hasValidRefreshToken) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
};

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export default middleware;