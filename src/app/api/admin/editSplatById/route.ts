import AuthHandler from "@/src/app/lib/auth/authHandler";
import { updateRowWithID } from "@/src/app/lib/db/splat_tb_utils";
import { SplatEditMetaData } from "@/src/app/lib/definitions/SplatPayload";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const authHandler = new AuthHandler();
    if (!(await authHandler.verifyAuth())) {
      return NextResponse.json(
        { error: "Endpoint accessed without authenticated session." },
        { status: 403 }
      );
    }
    const splatEditMetaData: SplatEditMetaData  = await request.json();
    const splatId = await updateRowWithID(splatEditMetaData);
    
    if (!splatId) {
      throw new Error("Unable to fetch edited Id");
    }

    return NextResponse.json(
      {
        message: `Splat edited at id: ${splatId}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Upload Splat Error: ${error}` },
      { status: 500 }
    );
  }
}
