import UserCredentials from "@/src/app/lib/definitions/auth/UserCredentials";
import AuthHandler from "@/src/app/lib/auth/authHandler";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const userCredentials: UserCredentials = await request.json();

  const authHandler: AuthHandler = new AuthHandler();

  try {
    if (await authHandler.verifyAuth()) {
      return NextResponse.json(
        { message: "Existing Session is Valid" },
        { status: 200 }
      );
    }

    return authHandler.login(userCredentials).then((result: boolean) => {
      if (!result) {
        return NextResponse.json(
          { error: "Auth Error: Invalid Credentials" },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { message: "Authentication Successful" },
        { status: 200 }
      );
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
