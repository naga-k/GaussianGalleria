import AuthHandler from "@/src/app/lib/auth/authHandler";
import { NextResponse } from "next/server";

export async function POST() {
  const authHandler = new AuthHandler();
  try {
    await authHandler.logout();
    
    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
