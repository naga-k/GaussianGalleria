import { eq } from "drizzle-orm";
import { SplatEditMetaData, SplatUploadMetaData } from "../definitions/SplatPayload";
import { db } from "./db";
import { splats } from "./schema";

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