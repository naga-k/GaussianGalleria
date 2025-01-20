export interface SplatUploadPayload {
    name: string,
    description: string | null,
    splatFile: File,
    videoFile: File,
}

export interface SplatEditPayload {
    id: number,
    name: string,
    description: string | null,
    splatFile: File | null,
    videoFile: File | null,
}