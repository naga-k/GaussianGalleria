import AuthHandler from "@/src/app/lib/auth/authHandler";
import { updateRowWithID } from "@/src/app/lib/db/splatTableUtils";
import { SplatEditMetaData } from "@/src/app/lib/definitions/SplatPayload";
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

    const splatEditMetaData: SplatEditMetaData = await request.json();
    
    if (!splatEditMetaData.id) {
      return NextResponse.json(
        { error: "Splat ID is required" },
        { status: 400 }
      );
    }

    const editedId = await updateRowWithID(splatEditMetaData);
    
    if (editedId === null) {
      return NextResponse.json(
        { error: "Failed to update splat record" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: editedId }, { status: 200 });
  } catch (error) {
    console.error("Error editing splat:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
