import AuthHandler from "@/src/app/lib/auth/authHandler";
import { addSplatRecordToDB } from "@/src/app/lib/db/splatTableUtils";
import { SplatUploadMetaData } from "@/src/app/lib/definitions/SplatPayload";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Restore auth check
    const authHandler = new AuthHandler();
    if (!(await authHandler.verifyAuth())) {
      return NextResponse.json(
        { error: "Endpoint accessed without authenticated session." },
        { status: 403 }
      );
    }

    const splatUploadMetaData: SplatUploadMetaData = await request.json();
    
    if (!splatUploadMetaData.splatFileUrl || !splatUploadMetaData.videoFileUrl) {
      return NextResponse.json(
        { error: "Missing required file URLs" },
        { status: 400 }
      );
    }

    const insertedId = await addSplatRecordToDB(splatUploadMetaData);
    
    if (insertedId === null) {
      return NextResponse.json(
        { error: "Failed to create splat record" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: insertedId }, { status: 200 });
  } catch (error) {
    console.error("Error creating splat entry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
