export interface GalleryItem {
    id: number;
    name: string;
    description: string | null,
    thumbnailUrl: string | null;
}
export interface GalleryDetails {
    name: string;
    description: string | null;
  }

  export type GallerySplat = {
    id: number;
    video: string | null;
    splat: string | null;
  }
  