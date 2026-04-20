import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const intlMiddleware = createMiddleware({
  ...routing,
  localeCookie: {
    name: "locale",
  },
});

const authRoutes = ["/login"];
const protectedRoutes = ["/dashboard", "/profile", "/admin"];
const adminRoutes = ["/admin"];

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  let role = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET_KEY),
      );

      role = payload.role;
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  const pathname = req.nextUrl.pathname;

  const pathnameWithoutLocale = pathname.replace(/^\/(en|vi)/, "") || "/";

  if (
    !token &&
    protectedRoutes.some((r) => pathnameWithoutLocale.startsWith(r))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && authRoutes.includes(pathnameWithoutLocale)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (
    role !== "admin" &&
    adminRoutes.some((r) => pathnameWithoutLocale.startsWith(r))
  ) {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
