import AuthHandler from "@/src/app/lib/auth/authHandler";
import { S3_BUCKET_ENDPOINTS } from "@/src/app/lib/configs/splatUpload";
import { deleteRowWithID } from "@/src/app/lib/db/utils";
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

    const splatId = await deleteRowWithID(requestPayload.id);

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
