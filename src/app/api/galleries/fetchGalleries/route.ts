// src/app/api/fetchGalleries/route.ts
import { NextResponse } from "next/server";
import { galleries } from "@/src/app/lib/db/schema";
import { db } from "@/src/app/lib/db/db";
import GalleryItem from "@/src/app/lib/definitions/GalleryItem";
import S3Handler from "@/src/app/lib/cloud/s3";




export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const s3Handler = new S3Handler();
    
    const galleriesData: GalleryItem[] = await db
      .select({
        id: galleries.id,
        name: galleries.name,
        description: galleries.description,
        thumbnailUrl: galleries.thumbnailUrl
      })
      .from(galleries);

    // Presign all thumbnail URLs
    const galleriesWithSignedUrls = await Promise.all(
      galleriesData.map(async (gallery) => ({
        ...gallery,
        thumbnailUrl: gallery.thumbnailUrl ? await s3Handler.getSignedS3Url(gallery.thumbnailUrl) : gallery.thumbnailUrl
      }))
    );

    return NextResponse.json(galleriesWithSignedUrls, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error fetching galleries:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}