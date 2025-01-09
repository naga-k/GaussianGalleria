// src/app/api/gallery/[id]/splats/route.ts
import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db/db";
import { splats, splatsToGalleries } from "../../../../../lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const galleryId = parseInt(params.id);
    const gallerySplats = await db
      .select({
        id: splats.id,
        video: splats.video,
        splat: splats.splat,
      })
      .from(splatsToGalleries)
      .innerJoin(splats, eq(splats.id, splatsToGalleries.splatId))
      .where(eq(splatsToGalleries.galleryId, galleryId));

    const formattedSplats = gallerySplats.map((item) => ({
      id: item.id,
      src: item.video || "",
      splatUrl: item.splat || "",
    }));

    return NextResponse.json(formattedSplats, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
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