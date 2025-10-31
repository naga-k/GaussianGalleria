import AuthHandler from "@/src/app/lib/auth/authHandler";
import S3Handler from "@/src/app/lib/cloud/s3";
import {
  deleteGallery,
  fetchGalleryDetails,
} from "@/src/app/lib/db/galleryTableUtils";
import { NextResponse } from "next/server";

export async function DELETE(
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

    if (galleryDetails === null) {
      return NextResponse.json(
        { error: "Gallery does not exist." },
        { status: 404 }
      );
    }

    if (galleryDetails.thumbnailKey) {
      const s3Handler = new S3Handler();
      await s3Handler.deleteFileWithUrl(galleryDetails.thumbnailKey);
    }

    await deleteGallery(galleryId);

    return NextResponse.json(
      { message: `Gallery (ID:${galleryId}) has been deleted.` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in galleries/[id]/delete:', error);
    return NextResponse.json(
      { error: `Delete Gallery Error: ${error}` },
      { status: 500 }
    );
  }
}
