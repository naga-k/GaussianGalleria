// src/app/api/gallery/[id]/description/route.ts
import { NextResponse } from "next/server";
import { fetchGalleryDetails } from "@/src/app/lib/db/gallery_tb_utils";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const galleryId = parseInt(params.id);
    const galleryData = await fetchGalleryDetails(galleryId);

    if (galleryData == null) {
      return NextResponse.json(
        { error: "Gallery not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(galleryData, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Error fetching gallery description:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}