import AuthHandler from "@/src/app/lib/auth/authHandler";
import S3Handler from "@/src/app/lib/cloud/s3";
import { S3_BUCKET_ENDPOINTS } from "@/src/app/lib/configs/splatUpload";
import {
  editGallery,
  fetchGalleryDetails,
  fetchGallerySplats,
} from "@/src/app/lib/db/galleryTableUtils";
import {
  GalleryItem,
  GalleryMeta,
} from "@/src/app/lib/definitions/GalleryItem";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHandler = new AuthHandler();
    if (!(await authHandler.verifyAuth())) {
      return NextResponse.json(
        { error: "Endpoint accessed without authenticated session." },
        { status: 403 }
      );
    }

    const galleryId: number = parseInt(params.id);
    const galleryDetails = await fetchGalleryDetails(galleryId);
    const oldSplatIds = await fetchGallerySplats(galleryId).then((splats) =>
      splats.map((splat) => splat.id)
    );

    if (galleryDetails === null) {
      return NextResponse.json(
        { error: "Gallery does not exist." },
        { status: 404 }
      );
    }

    const formData: FormData = await request.formData();
    const galleryMeta = toGalleryMeta(galleryId, formData);

    const thumbnail = formData.has("thumbnail")
      ? (formData.get("thumbnail") as File)
      : undefined;

    let thumbnailUrl = galleryDetails.thumbnailUrl;

    if (thumbnail && thumbnail.size > 0) {
      if (!S3_BUCKET_ENDPOINTS.thumbnail) {
        throw new Error("S3 Bucket Endpoints are not configured.");
      }
      const filenameWithTimestamp = `${new Date().getTime().toString()}_${
        thumbnail.name
      }`;

      const s3Handler = new S3Handler();
      thumbnailUrl = await s3Handler.upload(
        filenameWithTimestamp,
        thumbnail,
        S3_BUCKET_ENDPOINTS.thumbnail
      );
    }

    const galleryItem: GalleryItem = {
      ...galleryMeta,
      thumbnailUrl: thumbnailUrl,
    };

    const editedId: number = await editGallery(
      galleryItem,
      oldSplatIds,
      galleryMeta.splatIds
    );

    if (
      galleryDetails.thumbnailUrl &&
      galleryDetails.thumbnailUrl !== thumbnailUrl
    ) {
      const s3Handler = new S3Handler();
      await s3Handler.deleteFileWithUrl(galleryDetails.thumbnailUrl);
    }

    return NextResponse.json(
      { message: `Gallery (ID: ${editedId}) has been edited.` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Upload Splat Error: ${error}` },
      { status: 500 }
    );
  }
}

function toGalleryMeta(id: number, formData: FormData) {
  const name = formData.get("name")?.toString();
  if (!name || name.length === 0) {
    throw new Error("Gallery name not provided");
  }

  const description = formData.get("description")?.toString() || "";
  const splatIds = JSON.parse(formData.get("splatIds")?.toString() || "[]");

  return {
    id: id,
    name: name,
    description: description,
    splatIds: splatIds,
  } satisfies GalleryMeta;
}
