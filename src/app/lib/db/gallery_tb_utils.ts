import { eq } from "drizzle-orm";
import {GalleryItem,  GalleryDetails, GallerySplat } from "../definitions/GalleryItem";
import { db } from "./db";
import { galleries, splats, splatsToGalleries } from "./schema";

export async function fetchGalleries(): Promise<GalleryItem[]> {
    const galleriesData = await db
      .select({
        id: galleries.id,
        name: galleries.name,
        description: galleries.description,
        thumbnailUrl: galleries.thumbnailUrl
      })
      .from(galleries);
      
    return galleriesData;
  }

  export async function fetchGalleryDetails(galleryId: number): Promise<GalleryDetails | null> {
    const galleryData = await db
      .select({
        id: galleries.id,
        name: galleries.name,
        description: galleries.description,
      })
      .from(galleries)
      .where(eq(galleries.id, galleryId))
      .limit(1);
  
    return galleryData[0] || null;
  }


export async function fetchGallerySplats(galleryId: number): Promise<GallerySplat[]> {
  const gallerySplats = await db
    .select({
      id: splats.id,
      video: splats.video,
      splat: splats.splat,
    })
    .from(splatsToGalleries)
    .innerJoin(splats, eq(splats.id, splatsToGalleries.splatId))
    .where(eq(splatsToGalleries.galleryId, galleryId));

  return gallerySplats;
}