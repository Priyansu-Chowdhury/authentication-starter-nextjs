import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// const DEFAULT_PATHS = ["/"];
const PUBLIC_PATHS = ["/login", "/api/**"];
const PROTECTED_PATHS = ["/dashboard", "/settings", "/profile"];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // const isDefaultPath = DEFAULT_PATHS.some((path) => matchPath(path, pathname));
  const isPublicPath = PUBLIC_PATHS.some((path) => matchPath(path, pathname));
  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    matchPath(path, pathname)
  );

  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

function matchPath(pattern: string, pathname: string) {
  const regex = new RegExp(
    `^${pattern.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*")}$`
  );
  return regex.test(pathname);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?:on)?|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/api/:path*",
  ],
};
