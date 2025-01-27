import { NextResponse } from "next/server";
import SceneItem from "../../lib/definitions/SceneItem";
import { getSceneItemById } from "../../lib/db/splat_tb_utils";

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
      const sceneItem: SceneItem | null = await getSceneItemById(parseInt(rawId));

    if (sceneItem === null) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(sceneItem, {
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
