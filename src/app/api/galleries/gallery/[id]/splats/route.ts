// src/app/api/gallery/[id]/splats/route.ts
import { NextResponse } from "next/server";
import { fetchGallerySplats } from "@/src/app/lib/db/gallery_tb_utils";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const galleryId = parseInt(params.id);
    const gallerySplats = await fetchGallerySplats(galleryId);

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