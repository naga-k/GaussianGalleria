import { eq } from "drizzle-orm";
import { SplatEditMetaData, SplatUploadMetaData } from "../definitions/SplatPayload";
import { db } from "./db";
import { splats } from "./schema";
import SceneItem from "../definitions/SceneItem";
import VideoItem from "../definitions/VideoItem";

export async function insertNewRowInDB(splatUploadMetaData: SplatUploadMetaData): Promise<number | null> {
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

export async function fetchVideoItems(): Promise<VideoItem[]> {
  const combinedData = await db
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
        .map((item) => ({
          id: item.id,
          name: item.name || "",
          src: item.video || "",
          splatUrl: item.splat || "",
        }))
        .sort((a, b) => a.id - b.id);
    });

  return combinedData;
}

export async function getSceneItemById(id: number): Promise<SceneItem | null> {
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
        name: item.name || "",
        description: item.description || "",
        splatUrl: item.splatUrl || "",
        videoUrl: item.videoUrl || ""
      }));
    });

  return sceneItems.length ? sceneItems[0] : null;
}

export async function updateRowWithID(splatEditMetaData: SplatEditMetaData): Promise<number | null> {
  try {
    let editSplatQueryParams = {
      name: splatEditMetaData.name,
      description: splatEditMetaData.description,
    };

    if (splatEditMetaData.splatFileUrl) {
      editSplatQueryParams = Object.assign(editSplatQueryParams, {
        splat: splatEditMetaData.splatFileUrl,
      });
    }
    if (splatEditMetaData.videoFileUrl) {
      editSplatQueryParams = Object.assign(editSplatQueryParams, {
        video: splatEditMetaData.videoFileUrl,
      });
    }

    const result = await db.update(splats)
      .set(editSplatQueryParams)
      .where(eq(splats.id, splatEditMetaData.id))
      .returning({ editedId: splats.id });

    return result.length === 1 ? result[0].editedId : null;
  } catch (error) {
    console.error('Error updating row:', error);
    return null;
  }
}

export async function deleteRowWithID(id: number): Promise<number | null> {

  return db.delete(splats)
    .where(eq(splats.id, id))
    .returning({ deletedId: splats.id })
    .then((ids) => {
      if (ids.length === 1) {
        return ids[0].deletedId;
      }
      return null;
    });
}

// export async function getSplatUrlWithId(id: number): Promise <string | null> {
//   return db.select(splats).where(eq(splats.id, id)).returning({splatUrl: splats.splat}).then(())
// }