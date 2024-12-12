import { NextResponse } from "next/server";
import { db } from "../../lib/db/db";
import { splats } from "../../lib/db/schema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// app/api/fetchVideoItems/route.ts
interface VideoItem {
  id?: number;
  src: string;
  splatSrc: string;
  name: string | null;
  description: string | null;
}

interface DbItem {
  id: number;
  name: string | null;
  splat: string | null;
  video: string | null;
  description: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export async function GET() {
  try {
    const combinedData: VideoItem[] = await db
      .select()
      .from(splats)
      .then((data) => {
        return data.map((item: DbItem) => ({
          id: item.id,
          src: item.video || "",
          splatSrc: item.splat || "",
          name: item.name || "Untitled",
          description: item.description || "No description available",
        }));
      });

    return NextResponse.json(combinedData, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error fetching video items:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
