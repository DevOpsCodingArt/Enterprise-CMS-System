import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTE_PERMISSIONS, hasRouteAccess } from "./config/route-permissions";
import { getRoleHomeRoute } from "./config/role-routing";

const JWT_SECRET =
  process.env.JWT_ACCESS_SECRET ||
  "prime_one_access_secret_key_2026_super_secure_entropy_string";

interface TokenVerificationResult {
  valid: boolean;
  payload?: any;
  reason?: string;
}

/**
 * Zero-Trust Cryptographic HMAC-SHA256 Token Verification at the Edge.
 * Employs Web Crypto API (crypto.subtle) to verify token integrity and signature.
 * Strictly blocks forged, tampered, or fabricated tokens.
 */
async function verifyEdgeJwt(token: string | undefined): Promise<TokenVerificationResult> {
  if (!token || typeof token !== "string") {
    return { valid: false, reason: "Missing token" };
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return { valid: false, reason: "Malformed token structure" };
  }

  const [headerB64, payloadB64, signatureB64] = parts;
  if (!headerB64 || !payloadB64 || !signatureB64) {
    return { valid: false, reason: "Incomplete token segments" };
  }

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const data = encoder.encode(`${headerB64}.${payloadB64}`);

    // Normalize Base64URL to standard Base64
    let b64 = signatureB64.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";

    const signature = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const isValid = await crypto.subtle.verify("HMAC", key, signature, data);

    if (!isValid) {
      return { valid: false, reason: "Invalid cryptographic HMAC signature" };
    }

    // Decode and parse payload safely
    let payloadStr = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    while (payloadStr.length % 4) payloadStr += "=";
    const payload = JSON.parse(atob(payloadStr));

    // Check expiration (exp is in seconds)
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return { valid: false, reason: "Token expired", payload };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, reason: err?.message || "Cryptographic verification failed" };
  }
}

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

export async function proxy(request: NextRequest) {
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
      return NextResponse.next();
    }

    const verification = await verifyEdgeJwt(token);
    if (!verification.valid || !verification.payload) {
      // Forged or expired session hitting root: wipe cookie and let user log in
      const res = NextResponse.next();
      res.cookies.delete("prime_access_token");
      return res;
    }

    // Valid authenticated session hitting root: redirect to role's dashboard
    const userRole: string = (verification.payload.role || verification.payload.role_code || "").toLowerCase();
    const userType: string = (verification.payload.userType || "").toLowerCase();
    const homeRoute = getUserHomeRoute(userRole, userType);
    return NextResponse.redirect(new URL(homeRoute, request.url));
  }

  // 5. Protected Routes: Strict Cryptographic Verification
  if (!token) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const verification = await verifyEdgeJwt(token);

  if (!verification.valid || !verification.payload) {
    console.warn(`[Proxy Edge Zero-Trust] Access blocked on ${pathname}: ${verification.reason}`);
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete("prime_access_token");
    return res;
  }

  const decodedPayload = verification.payload;
  const userPermissions: string[] = decodedPayload.permissions || [];
  const userRole: string = (decodedPayload.role || decodedPayload.role_code || "").toLowerCase();
  const userType: string = (decodedPayload.userType || "").toLowerCase();
  const homeRoute = getUserHomeRoute(userRole, userType);

  // 6. Portal Tier Isolation Rules
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
