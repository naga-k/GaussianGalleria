import { and, eq, inArray } from "drizzle-orm";
import { GalleryItem, GallerySplat } from "../definitions/GalleryItem";
import { db } from "./db";
import { galleries, splats, splatsToGalleries } from "./schema";

export async function fetchGalleries(): Promise<GalleryItem[]> {
  const galleriesData = await db
    .select({
      id: galleries.id,
      name: galleries.name,
      description: galleries.description,
      thumbnailUrl: galleries.thumbnailUrl,
    })
    .from(galleries)
    .orderBy(galleries.id);

  return galleriesData;
}

export async function fetchGalleryDetails(
  galleryId: number
): Promise<GalleryItem | null> {
  const galleryData = await db
    .select({
      id: galleries.id,
      name: galleries.name,
      description: galleries.description,
      thumbnailUrl: galleries.thumbnailUrl,
    })
    .from(galleries)
    .where(eq(galleries.id, galleryId));

  return galleryData[0] || null;
}

export async function fetchGallerySplats(
  galleryId: number
): Promise<GallerySplat[]> {
  const gallerySplats = await db
    .select({
      id: splats.id,
      name: splats.name,
      video: splats.video,
      splat: splats.splat,
    })
    .from(splatsToGalleries)
    .innerJoin(splats, eq(splats.id, splatsToGalleries.splatId))
    .where(eq(splatsToGalleries.galleryId, galleryId));

  return gallerySplats;
}

export async function createGallery(
  name: string,
  splatIds: number[],
  description?: string,
  thumbnailUrl?: string
): Promise<number> {
  const ids = await db
    .insert(galleries)
    .values({
      name: name,
      description: description || null,
      thumbnailUrl: thumbnailUrl || null,
    })
    .returning({ insertedId: galleries.id });

  if (ids.length !== 1) {
    throw new Error("An error occurred while fetching gallery ID.");
  }

  const galleryId = ids[0].insertedId;

  const relationIds = await db
    .insert(splatsToGalleries)
    .values(
      splatIds.map((id) => {
        return { splatId: id, galleryId: galleryId };
      })
    )
    .returning({ insertedId: splatsToGalleries.id });

  if (relationIds.length !== splatIds.length) {
    throw new Error("Uploaded Splat count does not match Splat Id length.");
  }

  return galleryId;
}

export async function editGallery(
  galleryData: GalleryItem,
  oldSplatIds: number[],
  newSplatIds: number[]
) {
  const additionIds = newSplatIds.filter((id) => !oldSplatIds.includes(id));
  let isAdded = false;
  if (additionIds.length > 0) {
    isAdded = await db
      .insert(splatsToGalleries)
      .values(
        additionIds.map((id) => {
          return { splatId: id, galleryId: galleryData.id };
        })
      )
      .returning({ addedIds: splatsToGalleries.id })
      .then((ids) => {
        if (ids.length === additionIds.length) {
          return true;
        } else {
          return false;
        }
      });
  } else {
    isAdded = true;
  }

  if (!isAdded) {
    throw new Error("An error occurred while adding new splats to gallery.");
  }

  const removalIds = oldSplatIds.filter((id) => !newSplatIds.includes(id));
  let isRemoved = false;
  if (removalIds.length > 0) {
    isRemoved = await db
      .delete(splatsToGalleries)
      .where(
        and(
          eq(splatsToGalleries.galleryId, galleryData.id),
          inArray(splatsToGalleries.splatId, removalIds)
        )
      )
      .returning({ removedIds: splatsToGalleries.id })
      .then((ids) => {
        if (ids.length === removalIds.length) {
          return true;
        }
        return false;
      });
  } else {
    isRemoved = true;
  }

  if (!isRemoved) {
    throw new Error("An error occurred while removing splats from gallery.");
  }

  const editedIds = await db
    .update(galleries)
    .set({
      name: galleryData.name,
      description: galleryData.description,
      thumbnailUrl: galleryData.thumbnailUrl,
      updatedAt: new Date(),
    })
    .where(eq(galleries.id, galleryData.id))
    .returning({ editedId: galleries.id });

  if (editedIds.length !== 1) {
    throw new Error("An error occurred while fetching gallery ID.");
  }

  return editedIds[0].editedId;
}

export async function deleteGallery(galleryId: number) {
  await db
    .delete(splatsToGalleries)
    .where(eq(splatsToGalleries.galleryId, galleryId));
  await db.delete(galleries).where(eq(galleries.id, galleryId));
}
