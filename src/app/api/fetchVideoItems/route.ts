import { NextResponse } from "next/server";
import { db } from "../../lib/db/db";
import { splats } from "../../lib/db/schema";
import VideoItem from "../../lib/definitions/VideoItem";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// app/api/fetchVideoItems/route.ts

interface VideoQueryResult {
  id: number;
  name: string | null;
  video: string | null;
  splat: string | null;
}

export async function GET() {
  try {
    const combinedData: VideoItem[] = await db
      .select({
        id: splats.id,
        name: splats.name,
        video: splats.video,
        splat: splats.splat,
      })
      .from(splats)
      .orderBy(splats.id)
      .then((data) => {
        return data
          .map((item: VideoQueryResult) => ({
            id: item.id,
            name: item.name || "",
            src: item.video || "",
            splatUrl: item.splat || "",
          }))
          .sort((a, b) => a.id - b.id);
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
