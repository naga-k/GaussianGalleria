import AuthHandler from "@/src/app/lib/auth/authHandler";
import S3Handler from "@/src/app/lib/cloud/s3";
import { S3_BUCKET_ENDPOINTS } from "@/src/app/lib/configs/splatUpload";
import { deleteRowWithID, getSplatUrlWithId } from "@/src/app/lib/db/splat_tb_utils";
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

    if (!S3_BUCKET_ENDPOINTS.splat || !S3_BUCKET_ENDPOINTS.video) {
      throw new Error(
        "Cloud Bucket Endpoints are not configured."
      );
    }

    const requestPayload = await request.json();
    if (!requestPayload.id) {
      throw new Error("No splat ID provided.");
    }

    const oldSplatUrl = await getSplatUrlWithId(requestPayload.id);
    const oldVideoUrl = await getSplatUrlWithId(requestPayload.id);

    const splatId = await deleteRowWithID(requestPayload.id);

    const s3Handler = new S3Handler();
    if (oldSplatUrl) {
      s3Handler.deleteFileWithUrl(oldSplatUrl);
    }
    if (oldVideoUrl) {
      s3Handler.deleteFileWithUrl(oldVideoUrl);
    }

    if (!splatId) {
      throw new Error("Unable to fetch deleted Id");
    }

    return NextResponse.json(
      {
        message: `Splat deleted at id: ${splatId}`,
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
