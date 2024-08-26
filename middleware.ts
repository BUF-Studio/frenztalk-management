import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  const session = request.cookies.get("session");

  const publicPaths = ["/sign-in", "/sign-up"];
  const isPublicPath = publicPaths.includes(currentPath);

  // If there's no session and the path is public, allow access without redirection
  if (!session && isPublicPath) {
    console.log("No session retrieved...")
    return NextResponse.next();
  }

  // If there's no session and the path is not public, redirect to sign-in
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // If there's a session, verify it
  if (session) {
    const responseAPI = await fetch(`${request.nextUrl.origin}/api/auth`, {
      headers: {
        Cookie: `session=${session.value}`,
      },
    });

    // If the session is invalid and the path is not public, redirect to sign-in
    if (responseAPI.status !== 200 && !isPublicPath) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // If the session is valid and the path is public, redirect to a default protected page
    if (responseAPI.status === 200 && isPublicPath) {
      return NextResponse.redirect(new URL("/tuitions", request.url)); // Adjust this URL as needed
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