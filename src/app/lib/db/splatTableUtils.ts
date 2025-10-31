import { eq } from "drizzle-orm";
import {
  SplatEditMetaData,
  SplatUploadMetaData,
} from "../definitions/SplatPayload";
import { db } from "./db";
import { splats } from "./schema";
import SceneItem from "../definitions/SceneItem";
import VideoItem from "../definitions/VideoItem";

type SplatUpdateInput = Partial<typeof splats.$inferInsert>;

export async function addSplatRecordToDB(
  splatUploadMetaData: SplatUploadMetaData
): Promise<number | null> {
  const ids = await db
    .insert(splats)
    .values({
      name: splatUploadMetaData.name,
      description: splatUploadMetaData.description,
      // store keys in DB columns 'splat' and 'video' via schema mapping
      splatKey: splatUploadMetaData.splatFileUrl,
      videoKey: splatUploadMetaData.videoFileUrl,
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
      videoKey: splats.videoKey,
      splatKey: splats.splatKey,
    })
    .from(splats)
    .orderBy(splats.id)
    .then((data) => {
      return data
        .map((item) => ({
          id: item.id,
          name: item.name || "",
          srcKey: item.videoKey || "",
          splatKey: item.splatKey || "",
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
      splatKey: splats.splatKey,
      videoKey: splats.videoKey,
    })
    .from(splats)
    .where(eq(splats.id, id))
    .then((data: SceneItem[]) => {
      return data.map((item: SceneItem) => ({
        id: item.id,
        name: item.name || "",
        description: item.description || "",
        splatKey: item.splatKey || "",
        videoKey: item.videoKey || "",
      }));
    });

  return sceneItems.length ? sceneItems[0] : null;
}

export async function updateRowWithID(
  splatEditMetaData: SplatEditMetaData
): Promise<number | null> {
  try {
    const editSplatQueryParams: SplatUpdateInput = {
      name: splatEditMetaData.name,
      description: splatEditMetaData.description,
    };

    if (splatEditMetaData.splatFileUrl) {
      editSplatQueryParams.splatKey = splatEditMetaData.splatFileUrl;
    }
    if (splatEditMetaData.videoFileUrl) {
      editSplatQueryParams.videoKey = splatEditMetaData.videoFileUrl;
    }

    editSplatQueryParams.updatedAt = new Date();

    const result = await db
      .update(splats)
      .set(editSplatQueryParams)
      .where(eq(splats.id, splatEditMetaData.id))
      .returning({ editedId: splats.id });

    return result.length === 1 ? result[0].editedId : null;
  } catch (error) {
    console.error("Error updating row:", error);
    return null;
  }
}

export async function deleteRowWithID(id: number): Promise<number | null> {
  return db
    .delete(splats)
    .where(eq(splats.id, id))
    .returning({ deletedId: splats.id })
    .then((ids) => {
      if (ids.length === 1) {
        return ids[0].deletedId;
      }
      return null;
    });
}

// New: get key helpers
export async function getSplatKeyWithId(id: number): Promise<string | null> {
  const result = await db
    .select({ splatKey: splats.splatKey })
    .from(splats)
    .where(eq(splats.id, id))
    .then((data) => data);

  return result.length === 1 ? result[0].splatKey : null;
}

export async function getVideoKeyWithId(id: number): Promise<string | null> {
  const result = await db
    .select({ videoKey: splats.videoKey })
    .from(splats)
    .where(eq(splats.id, id))
    .then((data) => data);

  return result.length === 1 ? result[0].videoKey : null;
}

// Keep compatibility wrappers (deprecated names)
export async function getSplatUrlWithId(id: number): Promise<string | null> {
  return getSplatKeyWithId(id);
}

export async function getVideoUrlWithId(id: number): Promise<string | null> {
  return getVideoKeyWithId(id);
}
