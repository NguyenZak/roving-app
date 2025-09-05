import createMiddleware from "next-intl/middleware";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { defaultLocale, locales } from "@/i18n/routing";

const intl = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export default withAuth(
  (req) => {
    const path = req.nextUrl.pathname;
    // Skip locale handling for /admin, /login, and all /api routes
    if (path.startsWith("/admin") || path.startsWith("/login") || path.startsWith("/api")) {
      return NextResponse.next();
    }
    return intl(req);
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith("/admin")) return !!token; // require auth for admin
        return true;
      },
    },
  }
);

export const config = { matcher: ["/", "/(vi|en)/:path*", "/admin/:path*"] };


