import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const middleware = async (request: NextRequest) => {

    const cookieStore: any = await cookies();

    const token = cookieStore.get('accessToken')?.value;

    const path = request.nextUrl.pathname;

    const publicPath = path === '/login' || path === "/signup"
    const securePath = path === '/cart' || path === "/checkout" || path === '/profile' || path === '/orders' || path === '/dashboard' || path === '/dashboard/specialShow' || path === '/dashboard/requests' || path === '/checkout' || path === '/dashboard/ordersProcess' || path === "/api/addToCart" || path === "/api/getCart" || path === "/api/createOrder"

    if (token && publicPath) {
        NextResponse.next()
        return NextResponse.redirect(new URL('/', request.nextUrl))
    }

    if (!token && securePath) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }


}

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        "/",
        '/login',
        '/signup',
    ]
}

export default middleware;