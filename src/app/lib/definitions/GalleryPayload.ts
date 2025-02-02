export interface CreateGalleryPayload {
    name: string;
    description?: string;
    thumbnail?: File;
    splatIds: number[];
}