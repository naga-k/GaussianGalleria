// src/app/api/gallery/[id]/splats/route.ts
import { NextResponse } from "next/server";
import { fetchGallerySplats } from "@/src/app/lib/db/galleryTableUtils";
import S3Handler from "@/src/app/lib/cloud/s3";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const galleryId = parseInt(params.id);
    const gallerySplats = await fetchGallerySplats(galleryId);
    const s3Handler = new S3Handler();

    // Sign the keys from DB and return with VideoItem-compatible property names
    const signedSplats = await Promise.all(
      gallerySplats.map(async (splat) => {
        try {
          const [signedVideo, signedSplat] = await Promise.all([
            splat.videoKey ? s3Handler.getSignedS3Url(splat.videoKey) : null,
            splat.splatKey ? s3Handler.getSignedS3Url(splat.splatKey) : null,
          ]);

          return {
            id: splat.id,
            name: splat.name,
            // Return as VideoItem-compatible property names (what VideoCard expects)
            srcKey: signedVideo ?? splat.videoKey ?? "",
            splatKey: signedSplat ?? splat.splatKey ?? "",
          };
        } catch (signErr) {
          console.error("Error signing URLs for splat", splat.id, signErr);
          return {
            id: splat.id,
            name: splat.name,
            srcKey: splat.videoKey ?? "",
            splatKey: splat.splatKey ?? "",
          };
        }
      })
    );

    return NextResponse.json(signedSplats, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error fetching gallery splats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}