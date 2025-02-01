import AuthHandler from "@/src/app/lib/auth/authHandler";
import S3Handler from "@/src/app/lib/cloud/s3";
import { S3_BUCKET_ENDPOINTS } from "@/src/app/lib/configs/splatUpload";
import { createGallery } from "@/src/app/lib/db/galleryTableUtils";
import { CreateGalleryPayload } from "@/src/app/lib/definitions/GalleryPayload";
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

    const payload: CreateGalleryPayload = await request
      .formData()
      .then((formData) => {
        const name = formData.get("name")?.toString();
        if (name === undefined) {
          throw new Error("Gallery Name is not provided!");
        }

        const splatIds: number[] = JSON.parse(
          formData.get("splatIds")?.toString() || "[]"
        );

        return {
          name: name,
          description: formData.get("description")?.toString() || undefined,
          splatIds: splatIds,
          thumbnail: (formData.get("thumbnail") as File) || undefined,
        };
      });

    let thumbnailUrl: string | null = null;

    if (payload.thumbnail) {
      if (!S3_BUCKET_ENDPOINTS.thumbnail) {
        throw new Error("S3 Bucket Endpoints are not configured.");
      }

      const s3Handler = new S3Handler();
      thumbnailUrl = await s3Handler.upload(
        payload.thumbnail.name,
        payload.thumbnail,
        S3_BUCKET_ENDPOINTS.thumbnail
      );
    }

    const galleryId: number = await createGallery(
      payload.name,
      payload.splatIds,
      payload.description,
      thumbnailUrl || undefined
    );

    return NextResponse.json({ message: galleryId }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Upload Splat Error: ${error}` },
      { status: 500 }
    );
  }
}
