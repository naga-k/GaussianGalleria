import { NextResponse } from "next/server";
import SceneItem from "../../lib/definitions/SceneItem";
import { getSceneItemById } from "../../lib/db/splatTableUtils";
import S3Handler from "@/src/app/lib/cloud/s3";

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

    // --- Step 1: fetch done above (sceneItem)
    // --- Step 2: presign splat and video keys (DB stores plain object keys)
    const s3 = new S3Handler();
    const [signedSplat, signedVideo] = await Promise.all([
      sceneItem.splatKey ? s3.getSignedS3Url(sceneItem.splatKey) : null,
      sceneItem.videoKey ? s3.getSignedS3Url(sceneItem.videoKey) : null,
    ]);

    // Return response with client-expected property names
    const out = {
      id: sceneItem.id,
      name: sceneItem.name,
      description: sceneItem.description,
      splatUrl: signedSplat ?? null,
      videoUrl: signedVideo ?? null,
    };

    return NextResponse.json(out, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error fetching SceneItem items:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
