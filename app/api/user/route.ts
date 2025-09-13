import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies(); // Await the cookies() function
  const isLoggedOut = cookieStore.get("isLoggedOut")?.value === "true";

  if (isLoggedOut) {
    return NextResponse.json({ message: "User is logged out" }, { status: 401 });
  }

  return NextResponse.json({
    name: "Demo User",
    email: "mail@example.com",
    avatar: "/avatar.png",
  });
}
