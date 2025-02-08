import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const VALID_ROLE = {
  ADMIN: "ADMIN",
  USER: "USER",
};

const VALID_PATHS = ["/", "/auth", "/admin", "/user", "/notfound"];

export function middleware(req: NextRequest) {
  const token = getCookie("accessToken", { req });
  const url = req.nextUrl.pathname;

  if (!VALID_PATHS.some((path) => url === path || url.startsWith(`${path}/`))) {
    return NextResponse.redirect(new URL("/notfound", req.url));
  }

  if (!token && (url === "/" || url.startsWith("/auth"))) {
    return NextResponse.next();
  }

  try {
    const decoded: any = jwtDecode(token as any);
    const userRole =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (url === "/" || url.startsWith("/auth")) {
      return NextResponse.redirect(
        new URL(userRole === VALID_ROLE.ADMIN ? "/admin" : "/user", req.url),
      );
    }

    if (url.startsWith("/admin") && userRole !== VALID_ROLE.ADMIN) {
      return NextResponse.redirect(new URL("/notfound", req.url));
    }

    if (url.startsWith("/user") && userRole !== VALID_ROLE.USER) {
      return NextResponse.redirect(new URL("/notfound", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/notfound", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next|notfound).*)"],
};
