import { NextResponse } from "next/server";
import VideoItem from "../../lib/definitions/VideoItem";
import { fetchVideoItems } from "../../lib/db/splatTableUtils";
import S3Handler from "../../lib/cloud/s3";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// app/api/fetchVideoItems/route.ts
export async function GET() {
  try {
    const combinedData: VideoItem[] = await fetchVideoItems();
    const s3 = new S3Handler();

    const signedItems = await Promise.all(
      combinedData.map(async (it) => {
        try {
          const [signedSrc, signedSplat] = await Promise.all([
            it.srcKey ? s3.getSignedS3Url(it.srcKey) : null,
            it.splatKey ? s3.getSignedS3Url(it.splatKey) : null,
          ]);

          return {
            id: it.id,
            name: it.name,
            src: signedSrc ?? it.srcKey ?? "",
            splatUrl: signedSplat ?? it.splatKey ?? "",
          };
        } catch (signErr) {
          console.error("Error signing URLs for item", it.id, signErr);
          // fallback to original DB key values if signing fails
          return {
            id: it.id,
            name: it.name,
            src: it.srcKey ?? "",
            splatUrl: it.splatKey ?? "",
          };
        }
      })
    );

    return NextResponse.json(signedItems, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error fetching or signing video items:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
