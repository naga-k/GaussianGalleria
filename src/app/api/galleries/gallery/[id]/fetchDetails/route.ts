// src/app/api/gallery/[id]/description/route.ts
import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db/db";
import { galleries } from "../../../../../lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const galleryId = parseInt(params.id);
    const galleryData = await db
      .select({
        id: galleries.id,
        name: galleries.name,
        description: galleries.description,
      })
      .from(galleries)
      .where(eq(galleries.id, galleryId))
      .limit(1);

    if (!galleryData.length) {
      return NextResponse.json(
        { error: "Gallery not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(galleryData[0], {
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