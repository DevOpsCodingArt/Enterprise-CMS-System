import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTE_PERMISSIONS, hasRouteAccess } from "./config/route-permissions";
import { getRoleHomeRoute } from "./config/role-routing";

function getUserHomeRoute(role: string, userType: string): string {
  if (role === "customer" || userType === "customer") {
    return "/portal";
  }
  if (role === "platform_owner" || role === "super_admin") {
    return "/platform";
  }
  if (role === "field_engineer") {
    return "/company/tickets";
  }
  return getRoleHomeRoute(role);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public & static routes through without interception
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".webp")
  ) {
    return NextResponse.next();
  }

  // 2. Permanently redirect any legacy /login requests to clean root /
  if (pathname === "/login" || pathname.startsWith("/login/")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Extract Auth Token from cookie
  const token = request.cookies.get("prime_access_token")?.value;

  // 4. Handle Root Landing Gateway (pathname === "/")
  if (pathname === "/") {
    if (!token) {
      // Unauthenticated visitor: allow them to see the login gateway
      return NextResponse.next();
    }

    try {
      const payloadBase64 = token.split(".")[1];
      if (!payloadBase64) return NextResponse.next();

      const decodedPayload = JSON.parse(atob(payloadBase64));
      // If token expired, let them log in at root
      if (decodedPayload.exp && decodedPayload.exp * 1000 < Date.now()) {
        const res = NextResponse.next();
        res.cookies.delete("prime_access_token");
        return res;
      }

      // Valid session hitting root: bounce directly to user's dashboard!
      const userRole: string = (decodedPayload.role || decodedPayload.role_code || "").toLowerCase();
      const userType: string = (decodedPayload.userType || "").toLowerCase();
      const homeRoute = getUserHomeRoute(userRole, userType);
      return NextResponse.redirect(new URL(homeRoute, request.url));
    } catch {
      return NextResponse.next();
    }
  }

  // 5. Protected Routes: Check for missing token
  if (!token) {
    const loginUrl = new URL("/", request.url);
    if (pathname !== "/" && !pathname.startsWith("/login")) {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  try {
    // 6. Decode JWT payload (Edge-safe atob)
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) {
      const loginUrl = new URL("/", request.url);
      if (pathname !== "/" && !pathname.startsWith("/login")) {
        loginUrl.searchParams.set("redirect", pathname);
      }
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("prime_access_token");
      return res;
    }

    const decodedPayload = JSON.parse(atob(payloadBase64));
    const userPermissions: string[] = decodedPayload.permissions || [];
    const userRole: string = (decodedPayload.role || decodedPayload.role_code || "").toLowerCase();
    const userType: string = (decodedPayload.userType || "").toLowerCase();

    // 7. Check Token Expiration (exp is in seconds)
    if (decodedPayload.exp && decodedPayload.exp * 1000 < Date.now()) {
      const loginUrl = new URL("/", request.url);
      if (pathname !== "/" && !pathname.startsWith("/login")) {
        loginUrl.searchParams.set("redirect", pathname);
      }
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("prime_access_token");
      return res;
    }

    const homeRoute = getUserHomeRoute(userRole, userType);

    // 7. Portal Tier Isolation Rules
    // A) Platform Owner Portal (/platform/*)
    if (pathname.startsWith("/platform")) {
      if (userRole !== "platform_owner" && userRole !== "super_admin") {
        return NextResponse.redirect(new URL(homeRoute, request.url));
      }
      return NextResponse.next();
    }

    // B) Customer Portal (/portal/*)
    if (pathname.startsWith("/portal")) {
      if (userRole !== "customer" && userType !== "customer" && userRole !== "platform_owner") {
        return NextResponse.redirect(new URL(homeRoute, request.url));
      }
      return NextResponse.next();
    }

    // C) Company Operations Portal (/company/*)
    if (pathname.startsWith("/company")) {
      if (userRole === "customer" || userType === "customer") {
        return NextResponse.redirect(new URL("/portal", request.url));
      }

      // Company Owners and Super Admins bypass permission checks
      if (
        userRole === "company_owner" ||
        userRole === "platform_owner" ||
        userRole === "super_admin" ||
        userPermissions.includes("*") ||
        userPermissions.includes("*.*")
      ) {
        return NextResponse.next();
      }

      // Check granular route permissions for staff
      if (!hasRouteAccess(pathname, userPermissions)) {
        return NextResponse.redirect(new URL(homeRoute, request.url));
      }
    }
  } catch (error) {
    console.error("[Proxy Edge] Failed to parse JWT payload:", error);
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete("prime_access_token");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
