import AuthHandler from "@/src/app/lib/auth/authHandler";
import S3Handler from "@/src/app/lib/cloud/s3";
import { db } from "@/src/app/lib/db/db";
import { splats } from "@/src/app/lib/db/schema";
import { SplatUploadPayload } from "@/src/app/lib/definitions/SplatPayload";
import { NextResponse } from "next/server";
import { S3_BUCKET_ENDPOINTS } from "@/src/app/lib/config";

export async function POST(request: Request) {
  const authHandler = new AuthHandler();
  if (!(await authHandler.verifyAuth())) {
    return NextResponse.json(
      { error: "Endpoint accessed without authenticated session." },
      { status: 403 }
    );
  }

  try {
    if (!S3_BUCKET_ENDPOINTS.splat || !S3_BUCKET_ENDPOINTS.video) {
      throw new Error(
        "Bucket Endpoints are not configured. Contact the administrator."
      );
    }

    const requestFormData: FormData = await request.formData();
    const splatPayload = toSplatUploadPayload(requestFormData);
    const s3Handler: S3Handler = new S3Handler();

    const splatS3Url = await s3Handler.upload(
      splatPayload.splatFile.name,
      splatPayload.splatFile,
      S3_BUCKET_ENDPOINTS.splat
    );

    if (!splatS3Url) {
      throw new Error("Error occured while uploading splat.");
    }

    const videoS3Url = await s3Handler.upload(
      splatPayload.videoFile.name,
      splatPayload.videoFile,
      S3_BUCKET_ENDPOINTS.video
    );

    if (!videoS3Url) {
      throw new Error("Error occured while uploading video.");
    }

    const splatId = await db
      .insert(splats)
      .values({
        name: splatPayload.name,
        description: splatPayload.description,
        splat: splatS3Url,
        video: videoS3Url,
      })
      .returning({ insertedId: splats.id })
      .then((ids) => {
        if (ids.length == 1) {
          return ids[0].insertedId;
        }
        return null;
      });

    if (splatId) {
      return NextResponse.json(
        {
          message: `Splat inserted at id: ${splatId}`,
        },
        { status: 200 }
      );
    } else {
      throw new Error("Unable to fetch inserted Id");
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Upload Splat Error: ${error}` },
      { status: 500 }
    );
  }
}

const toSplatUploadPayload = (formData: FormData) => {
  const name: string = formData.get("name")?.toString() || "";
  if (name.length == 0) {
    throw new Error("Splat name not provided.");
  }

  const description: string | null =
    formData.get("description")?.toString() || null;

  const splatFile = formData.get("splatFile") || null;
  if (!splatFile || !(splatFile instanceof File) || splatFile.size == 0) {
    throw new Error("Splat File not provided.");
  }

  const videoFile = formData.get("videoFile") || null;
  if (!videoFile || !(videoFile instanceof File) || videoFile.size == 0) {
    throw new Error("Video File not provided.");
  }

  return {
    name: name,
    description: description,
    splatFile: splatFile,
    videoFile: videoFile,
  } satisfies SplatUploadPayload;
};
