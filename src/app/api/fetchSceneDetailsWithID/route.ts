import { NextResponse } from "next/server";
import { db } from "../../lib/db/db";
import { splats } from "../../lib/db/schema";
import { eq } from "drizzle-orm";
import SceneItem from "../../models/SceneItem";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// app/api/fetchSceneDetailsWithID/route.ts

interface SceneQueryResult {
  id: number;
  name: string | null;
  description: string | null;
  splat: string | null;
}

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
        splat: splats.splat,
      })
      .from(splats)
      .where(eq(splats.id, id))
      .then((data: SceneQueryResult[]) => {
        return data.map((item: SceneQueryResult) => ({
          id: item.id,
          name: item.name || "Untitled",
          description: item.description || "No description available",
          splatUrl: item.splat || "",
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
