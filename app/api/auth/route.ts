import { auth } from "@/lib/firebase/service/serverApp";
import { cookies, headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = cookies().get("session")?.value || "";
  if (!session) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(session, true);
    return NextResponse.json({ isLogged: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }
}

export async function POST(request: NextRequest, response: NextResponse) {
  const authorization = headers().get("Authorization");
  
  if (authorization?.startsWith("Bearer ")) {
    const idToken = authorization.split("Bearer ")[1];
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      const expiresIn = 60 * 60 * 24 * 5 * 1000;
      const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn,
      });
      const options = {
        name: "session",
        value: sessionCookie,
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
      };

      cookies().set(options);
      return NextResponse.json({}, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  }

  return NextResponse.json({ error: "Missing token" }, { status: 401 });
}

export async function DELETE(request: NextRequest, response: NextResponse) {
  const token = cookies().get("session")?.value || "";
  if (!token) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }
  await invalidateLogin(token);
  return NextResponse.json({}, { status: 200 });
}

async function invalidateLogin(token: string) {
  try {
    const decodedClaims = await auth.verifySessionCookie(token, true);
    await auth.revokeRefreshTokens(decodedClaims.uid);
    cookies().delete("session");
  } catch (error) {
    console.error("Error invalidating login:", error);
  }
}