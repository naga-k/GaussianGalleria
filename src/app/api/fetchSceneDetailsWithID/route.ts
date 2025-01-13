import { NextResponse } from "next/server";
import { db } from "../../lib/db/db";
import { splats } from "../../lib/db/schema";
import { eq } from "drizzle-orm";
import SceneItem from "../../lib/definitions/SceneItem";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// app/api/fetchSceneDetailsWithID/route.ts

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawId: string | null = searchParams.get("id");

    if (!rawId) {
      return NextResponse.json({ error: "Id does not exist" }, { status: 404 });
    }

    const id = parseInt(rawId);
    const sceneItems: SceneItem[] = await db
      .select({
        id: splats.id,
        name: splats.name,
        description: splats.description,
        splatUrl: splats.splat,
        videoUrl: splats.video
      })
      .from(splats)
      .where(eq(splats.id, id))
      .then((data: SceneItem[]) => {
        return data.map((item: SceneItem) => ({
          id: item.id,
          name: item.name || "Untitled",
          description: item.description || "No description available",
          splatUrl: item.splatUrl || "",
          videoUrl: item.videoUrl || ""
        }));
      });

    if (!sceneItems.length) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(sceneItems[0], {
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
