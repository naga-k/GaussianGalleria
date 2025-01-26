import AuthHandler from "@/src/app/lib/auth/authHandler";
import { S3_BUCKET_ENDPOINTS } from "@/src/app/lib/configs/splatUpload";
import { db } from "@/src/app/lib/db/db";
import { splats } from "@/src/app/lib/db/schema";
import { eq } from "drizzle-orm";
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

    const splatId = await db
      .delete(splats)
      .where(eq(splats.id, requestPayload.id))
      .returning({ deletedId: splats.id })
      .then((ids) => {
        if (ids.length === 1) {
          return ids[0].deletedId;
        }
        return null;
      });

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
