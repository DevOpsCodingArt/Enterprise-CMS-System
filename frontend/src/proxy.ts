import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTE_PERMISSIONS } from "./config/route-permissions";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public & static routes through without interception
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname === "/" ||
    pathname.startsWith("/portal")
  ) {
    return NextResponse.next();
  }

  // 2. Extract Auth Token from cookie (if present)
  const token = request.cookies.get("prime_access_token")?.value;

  if (token) {
    try {
      // Decode JWT payload (Edge-safe atob)
      const payloadBase64 = token.split(".")[1];
      if (payloadBase64) {
        const decodedPayload = JSON.parse(atob(payloadBase64));
        const userPermissions: string[] = decodedPayload.permissions || [];
        const userRole = decodedPayload.role || decodedPayload.role_code;

        // Platform Owners & Company Owners bypass standard route blocks
        if (
          userRole === "PLATFORM_OWNER" ||
          userRole === "platform_owner" ||
          userRole === "company_owner" ||
          userPermissions.includes("*.*")
        ) {
          return NextResponse.next();
        }

        // Check if route requires specific permissions
        const matchingRoute = Object.keys(ROUTE_PERMISSIONS).find(
          (route) => pathname === route || pathname.startsWith(`${route}/`)
        );

        if (matchingRoute) {
          const requiredPermissions = ROUTE_PERMISSIONS[matchingRoute];
          const hasAccess = requiredPermissions.some((perm) =>
            userPermissions.includes(perm)
          );

          if (!hasAccess) {
            console.warn(
              `[Security Edge] Unauthorized access attempt to ${pathname} by user ${decodedPayload.sub || decodedPayload.id}`
            );
            return NextResponse.redirect(new URL("/company", request.url));
          }
        }
      }
    } catch (error) {
      console.error("[Proxy] Invalid token payload:", error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
