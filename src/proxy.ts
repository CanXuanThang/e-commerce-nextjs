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

const ADMIN_ROUTE = "/admin";

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const pathnameWithoutLocale =
    pathname.replace(/^\/(en|vi)(?=\/|$)/, "") || "/";

  if (!pathnameWithoutLocale.startsWith(ADMIN_ROUTE)) {
    return intlMiddleware(req);
  }

  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET_KEY),
    );

    if (payload.role !== "admin") {
      return NextResponse.redirect(new URL("/403", req.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
