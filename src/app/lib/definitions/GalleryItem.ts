export interface GallerySplat {
  id: number;
  name: string | null;
  videoKey: string | null;
  splatKey: string | null;
}

export interface GalleryItem {
  id: number;
  name: string;
  description: string | null;
  thumbnailKey: string | null;
}

export interface GalleryDetails {
  name: string;
  description: string | null;
}

export type GalleryMeta = {
  id: number;
  name: string;
  description?: string;
  splatIds: number[];
};