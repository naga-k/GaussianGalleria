import AuthHandler from "@/src/app/lib/auth/authHandler";
import { NextResponse } from "next/server";
import { SplatUploadMetaData } from "@/src/app/lib/definitions/SplatPayload";
import { insertNewRowInDB } from "@/src/app/lib/db/splatTableUtils";

export async function POST(request: Request) {
  try {
    const authHandler = new AuthHandler();
    if (!(await authHandler.verifyAuth())) {
      return NextResponse.json(
        { error: "Endpoint accessed without authenticated session." },
        { status: 403 }
      );
    }

    const body = await request.json(); 
    const splatUploadMetaData: SplatUploadMetaData = body.splatUploadMetaData;
    const splatId = await insertNewRowInDB(splatUploadMetaData);

    if (!splatId) {
      throw new Error("Unable to fetch inserted Id");
    }

    return NextResponse.json(
      {
        message: `Splat inserted at id: ${splatId}`,
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
