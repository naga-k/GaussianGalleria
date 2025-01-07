// src/app/api/fetchGalleries/route.ts
import { NextResponse } from "next/server";
import { db } from "../../../lib/db/db";
import { galleries } from "../../../lib/db/schema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface GalleryItem {
  id: number;
  name: string;
  description: string | null;
}

export async function GET() {
  try {
    const galleriesData: GalleryItem[] = await db
      .select({
        id: galleries.id,
        name: galleries.name,
        description: galleries.description,
      })
      .from(galleries);

    return NextResponse.json(galleriesData, {
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