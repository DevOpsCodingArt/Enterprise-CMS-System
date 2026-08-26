import { NextResponse, NextRequest } from "next/server";
import { getRequiredPermissionsForRoute } from "@/lib/route-permissions";

interface DecodedToken {
  id?: string;
  role?: string;
  permissions?: string[];
  companyId?: string;
  branchId?: string;
  exp?: number;
}

/**
 * Safely decodes a JWT payload on Next.js Edge Runtime without Node.js dependencies.
 */
function decodeJwtPayload(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    
    // Base64Url decode
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Checks if a set of user permissions satisfies required route permissions.
 */
function hasPermission(userPermissions: string[], required: string[]): boolean {
  if (userPermissions.includes("*")) return true;

  return required.some((req) => {
    if (req === "*") return true;
    if (userPermissions.includes(req)) return true;

    // Check module wildcard (e.g., user has "chat.*" and route requires "chat.view")
    const [module] = req.split(".");
    if (userPermissions.includes(`${module}.*`)) return true;

    return false;
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets, API routes, and public files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // 2. Extract Token / Auth state from cookies or headers
  const tokenCookie = request.cookies.get("prime_access_token")?.value;
  const authStorageCookie = request.cookies.get("prime-one-auth-storage")?.value;

  let userRole: string | null = null;
  let userPermissions: string[] = [];
  let isAuthenticated = false;

  if (tokenCookie) {
    const decoded = decodeJwtPayload(tokenCookie);
    if (decoded) {
      userRole = decoded.role || null;
      userPermissions = decoded.permissions || [];
      isAuthenticated = true;
    } else if (tokenCookie.startsWith("mock-jwt-token")) {
      // Mock development token fallback
      isAuthenticated = true;
      userPermissions = ["*"]; // Default mock full access unless overridden
    }
  }

  // Also support Zustand persisted cookie if available in hybrid SSR mode
  if (!isAuthenticated && authStorageCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(authStorageCookie));
      if (parsed?.state?.user && parsed?.state?.isAuthenticated) {
        userRole = parsed.state.user.role;
        userPermissions = parsed.state.user.permissions || [];
        isAuthenticated = true;
      }
    } catch {
      // Ignore parse failure
    }
  }

  // 3. Platform Owner Portal Protection (/platform)
  if (pathname.startsWith("/platform")) {
    // If not authenticated or not platform owner in strict mode
    if (isAuthenticated && userRole && userRole !== "platform_owner" && !userPermissions.includes("*")) {
      // Unauthorized staff trying to access Platform Super-Admin
      return NextResponse.redirect(new URL("/company", request.url));
    }
    return NextResponse.next();
  }

  // 4. Company Portal Protection (/company)
  if (pathname.startsWith("/company")) {
    const requiredPermissions = getRequiredPermissionsForRoute(pathname);

    if (requiredPermissions && isAuthenticated && userPermissions.length > 0) {
      const allowed = hasPermission(userPermissions, requiredPermissions);
      if (!allowed) {
        // Redirect unauthorized URL access back to default safe company dashboard
        return NextResponse.redirect(new URL("/company", request.url));
      }
    }

    return NextResponse.next();
  }

  // 5. Customer Self-Service Portal Protection (/portal)
  if (pathname.startsWith("/portal")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
