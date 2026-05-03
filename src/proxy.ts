import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const middleware = async (request: NextRequest) => {
    const path = request.nextUrl.pathname;

    // Skip middleware for static files and next internals
    if (
        path.startsWith('/_next/') ||
        path.startsWith('/api/public/') ||
        path.includes('.') ||
        path === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;


    // Define public paths (accessible without authentication)
    const publicPaths = [
        '/login',
        '/signup',
        '/',
        '/products',
        '/stores',
        '/about',
        '/contact'
    ];

    // Define secure paths (require authentication)
    const securePaths = [
        '/cart',
        '/checkout',
        '/cart/checkout',
        '/profile',
        '/orders',
        '/dashboard',
        '/dashboard/specialShow',
        '/dashboard/kyc-details',
        '/dashboard/ordersAction',
        '/dashboard/requests',
        '/dashboard/ordersProcess',
        '/settings'
    ];

    // Define secure API routes
    const secureApiPaths = [
        '/api/auth/sessionCookies',
        '/api/auth/refreshToken',
        '/api/auth/logout',
        '/api/kyc',
        '/api/createOrder',
        '/api/getOrders',
        '/api/getSellerOrders',
        '/api/updateOrders',
        '/api/updateSellerOrderState',
        '/api/order',
        '/api/verify',
        '/api/getCart',
        '/api/addToCart',
        '/api/deleteCart',
        '/api/removeCartItem',
        '/api/updateCart',
        '/api/addCategory',
        '/api/addProduct',
        '/api/deleteProduct',
        '/api/editProductDetails',
        '/api/authorizeSeller',
        '/api/getSellerProducts',
        '/api/updateSellerDetails',
        '/api/authorizeSeller',
        '/api/getSplAppReq',
        '/api/reqSplAppear',
        '/api/setSplAppearence',
        '/api/unSetSplAppearence',
        '/api/createStore',
        '/api/deleteStore',
        '/api/updateStore',
    ];

    const isPublicPath = publicPaths.some(publicPath =>
        path === publicPath || path.startsWith(publicPath + '/')
    );

    const isSecurePath = securePaths.some(securePath =>
        path === securePath || path.startsWith(securePath + '/')
    );

    const isSecureApiPath = secureApiPaths.some(apiPath =>
        path === apiPath || path.startsWith(apiPath + '/')
    );

    // Check if refresh token exists and is valid
    let hasValidRefreshToken = false;

    if (refreshToken && refreshToken.trim() !== "") {
        try {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
            hasValidRefreshToken = true;
        } catch {
            hasValidRefreshToken = false;
        }
    }

    // MAIN LOGIC - Check all scenarios

    // Scenario A: User trying to access SECURE PATH or SECURE API
    if (isSecurePath || isSecureApiPath) {
        // NO REFRESH TOKEN → Must redirect to login
        if (!hasValidRefreshToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        // Has valid refresh token → Allow (SessionInitializer will sync user data)
        return NextResponse.next();
    }

    // Scenario B: User trying to access LOGIN/SIGNUP while ALREADY LOGGED IN
    if ((path === '/login' || path === '/signup') && hasValidRefreshToken) {
        // Redirect authenticated users away from login page
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    // Scenario C: Public paths or other routes
    return NextResponse.next();
};

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};

export default middleware;