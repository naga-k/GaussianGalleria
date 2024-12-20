import AuthHandler from "@/src/app/lib/auth/authHandler";
import { NextResponse } from "next/server";

export async function GET() {
  const authHandler: AuthHandler = new AuthHandler();

  try {
    const result = await authHandler.verifyAuth();
    if (!result) {
      return NextResponse.json(
        { error: "Auth Error: No valid Admin session. Log in for access." },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { message: "Existing Session is Valid" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
