import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const middleware = async (request: NextRequest) => {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    const path = request.nextUrl.pathname;

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

    // Define secure API routes --> These are the API routes that should only be accessible to authenticated users.(Logged In Users)
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

    // Check if current path matches any pattern
    const isPublicPath = publicPaths.some(publicPath =>
        path === publicPath || path.startsWith(publicPath + '/')
    );

    const isSecurePath = securePaths.some(securePath =>
        path === securePath || path.startsWith(securePath + '/')
    );

    const isSecureApiPath = secureApiPaths.some(apiPath =>
        path === apiPath || path.startsWith(apiPath + '/')
    );

    // User has tokens and tries to access login/signup → redirect to home
    if ((accessToken || refreshToken) && (path === '/login' || path === '/signup')) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    // User has no tokens and tries to access secure routes → redirect to login
    if ((!accessToken && !refreshToken) && (isSecurePath || isSecureApiPath)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // For all other cases, allow the request to continue
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
    ]
}

export default middleware;