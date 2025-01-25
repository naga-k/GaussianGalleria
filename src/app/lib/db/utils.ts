import { SplatUploadMetaData } from "../definitions/SplatPayload";
import { db } from "./db";
import { splats } from "./schema";

export async function insertNewRowInDB(name: string, description: string, splat: string, video: string): Promise<number | null> {
    const splatUploadMetaData: SplatUploadMetaData = { name, description, splatFileUrl: splat, videoFileUrl: video };
    console.log(splatUploadMetaData);
    const ids = await db
          .insert(splats)
          .values({
            name: splatUploadMetaData.name,
            description: splatUploadMetaData.description,
            splat: splatUploadMetaData.splatFileUrl,
            video: splatUploadMetaData.videoFileUrl,
          })
          .returning({ insertedId: splats.id });

    if (ids.length === 1) {
        return ids[0].insertedId;
    }
    return null;
}