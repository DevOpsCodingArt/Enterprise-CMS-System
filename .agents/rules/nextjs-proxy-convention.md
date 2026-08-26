# Next.js 16+ Edge Routing Rule: Use Proxy, No Middleware

- **STRICT PROHIBITION**: Never create or use `middleware.ts` or `src/middleware.ts` in this project. The `middleware` file convention is deprecated in Next.js 16+.
- **MANDATORY REQUIREMENT**: Always use `src/proxy.ts` exporting `export function proxy(request: NextRequest)` for all Edge routing interception, JWT decoding, and route permission gating.
- **CENTRAL ROUTE CONFIG**: Always maintain and reference `src/config/route-permissions.ts` as the single source of truth for route RBAC access.
