import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRole } from "@/lib/models/user";

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  const session = request.cookies.get("session");

  const publicPaths = ["/sign-in", "/sign-up"];
  const isPublicPath = publicPaths.includes(currentPath);
  const isNonVerifyPath = currentPath === "/non-verify";

  // If there's no session and the path is public or non-verify, allow access without redirection
  if (!session && (isPublicPath || isNonVerifyPath)) {
    return NextResponse.next();
  }

  // If there's no session and the path is not public or non-verify, redirect to sign-in
  if (!session && !isPublicPath && !isNonVerifyPath) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // If there's a session, verify it and get user role
  if (session) {
    const responseAPI = await fetch(`${request.nextUrl.origin}/api/auth`, {
      headers: {
        Cookie: `session=${session.value}`,
      },
    });

    const data = await responseAPI.json();

    // If the session is invalid and the path is not public or non-verify, redirect to sign-in
    if (!data.isLogged && !isPublicPath && !isNonVerifyPath) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // If the session is valid and the path is public, redirect to a default protected page
    if (data.isLogged && isPublicPath) {
      return NextResponse.redirect(new URL("/tuitions", request.url));
    }

    // If the user role is non-verified and not already on the non-verify page, redirect to non-verify
    if (data.role === UserRole.NON_VERIFIED && !isNonVerifyPath) {
      return NextResponse.redirect(new URL("/non-verify", request.url));
    }

    // If the user role is verified and on the non-verify page, redirect to tuitions
    if (data.role !== UserRole.NON_VERIFIED && isNonVerifyPath) {
      return NextResponse.redirect(new URL("/tuitions", request.url));
    }
  }

  // For all other cases, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};