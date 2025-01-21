import AuthHandler from "@/src/app/lib/auth/authHandler";
import S3Handler from "@/src/app/lib/cloud/s3";
import { S3_BUCKET_ENDPOINTS } from "@/src/app/lib/config";
import { db } from "@/src/app/lib/db/db";
import { splats } from "@/src/app/lib/db/schema";
import { SplatEditPayload } from "@/src/app/lib/definitions/SplatPayload";
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
        "Bucket Endpoints are not configured. Contact the administrator."
      );
    }

    const requestFormData: FormData = await request.formData();
    const splatPayload = toSplatEditPayload(requestFormData);
    const s3Handler: S3Handler = new S3Handler();

    const splatS3Url = splatPayload.splatFile
      ? await s3Handler.upload(
          splatPayload.splatFile.name,
          splatPayload.splatFile,
          S3_BUCKET_ENDPOINTS.splat
        )
      : null;

    const videoS3Url = splatPayload.videoFile
      ? await s3Handler.upload(
          splatPayload.videoFile.name,
          splatPayload.videoFile,
          S3_BUCKET_ENDPOINTS.video
        )
      : null;

    let editSplatQueryParams = {
      name: splatPayload.name,
      description: splatPayload.description,
    };

    if (splatS3Url) {
      editSplatQueryParams = Object.assign(editSplatQueryParams, {
        splat: splatS3Url,
      });
    }

    if (videoS3Url) {
      editSplatQueryParams = Object.assign(editSplatQueryParams, {
        video: videoS3Url,
      });
    }

    const splatId = await db
      .update(splats)
      .set(editSplatQueryParams)
      .where(eq(splats.id, splatPayload.id))
      .returning({ editedId: splats.id })
      .then((ids) => {
        if (ids.length === 1) {
          return ids[0].editedId;
        }
        return null;
      });

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

const toSplatEditPayload = (formData: FormData) => {
  const idEntry: FormDataEntryValue | null = formData.get("id");
  if (!idEntry) {
    throw new Error("Splat id not provided");
  }

  const id: number = parseInt(idEntry.toString());

  const name: string = formData.get("name")?.toString() || "";
  if (name.length == 0) {
    throw new Error("Splat name not provided.");
  }

  let description: string | null =
    formData.get("description")?.toString() || null;

  if (description && description.trim().length === 0) {
    description = null;
  }

  let splatFile = formData.get("splatFile") || null;
  if (!splatFile || !(splatFile instanceof File) || splatFile.size == 0) {
    splatFile = null;
  }

  let videoFile = formData.get("videoFile") || null;
  if (!videoFile || !(videoFile instanceof File) || videoFile.size == 0) {
    videoFile = null;
  }

  return {
    id: id,
    name: name.trim(),
    description: description ? description.trim() : description,
    splatFile: splatFile,
    videoFile: videoFile,
  } satisfies SplatEditPayload;
};
