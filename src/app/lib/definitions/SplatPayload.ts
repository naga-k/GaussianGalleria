export enum UploadType {
    SPLAT = "SPLAT",
    VIDEO = "VIDEO"
}

export interface SplatUploadMetaData {
    name: string,
    description: string | null,
    splatFileUrl: string,
    videoFileUrl: string,
}

export interface SplatEditMetaData {
    id: number,
    name: string,
    description: string | null,
    splatFileUrl: string | null,
    videoFileUrl: string | null,
}

export interface CompletedPart {
    PartNumber: number;
    ETag: string;
}

export interface MultipartUploadResponse {
    key: string;
    presignedUrls: string[];
    uploadId: string;
}

export interface MultipartUploadConfig {
    fileName: string;
    uploadType: UploadType;
    numberOfParts: number;
}