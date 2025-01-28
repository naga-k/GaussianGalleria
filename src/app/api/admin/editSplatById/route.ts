import AuthHandler from "@/src/app/lib/auth/authHandler";
import S3Handler from "@/src/app/lib/cloud/s3";
import { getSplatUrlWithId, getVideoUrlWithId, updateRowWithID } from "@/src/app/lib/db/splatTableUtils";
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

    let oldSplatUrl: string | null = null;
    if(splatEditMetaData.splatFileUrl !== null) {
      oldSplatUrl = await getSplatUrlWithId(splatEditMetaData.id);
    }

    let oldVideoUrl: string | null = null;
    if(splatEditMetaData.videoFileUrl !== null){
      oldVideoUrl = await getVideoUrlWithId(splatEditMetaData.id);
    }

    const splatId = await updateRowWithID(splatEditMetaData);

    const s3Handler = new S3Handler();
    

    if (oldSplatUrl !== null){
      s3Handler.deleteFileWithUrl(oldSplatUrl);
    }

    if (oldVideoUrl !== null){
      s3Handler.deleteFileWithUrl(oldVideoUrl);
    }
    
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

