import { NextResponse } from "next/server";
import VideoItem from "../../lib/definitions/VideoItem";
import { fetchVideoItems } from "../../lib/db/splatTableUtils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// app/api/fetchVideoItems/route.ts

export async function GET() {
  try {
    const combinedData: VideoItem[] = await fetchVideoItems();

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
