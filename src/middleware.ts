import { NextRequest, NextResponse } from "next/server";

// Simple Edge-safe JWT decoder to check expiration and user role
function decodeJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    // Decode base64url
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Protect checkout and orders
  if (pathname.startsWith("/checkout") || pathname.startsWith("/orders")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = decodeJwt(token);
    if (!payload || (payload.exp && Date.now() >= payload.exp * 1000)) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // Protect admin dashboard
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const payload = decodeJwt(token);
    if (
      !payload || 
      (payload.exp && Date.now() >= payload.exp * 1000) || 
      payload.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*", "/admin/:path*"],
};
