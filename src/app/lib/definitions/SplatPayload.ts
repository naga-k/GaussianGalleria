export interface SplatUploadMetaData {
    name: string,
    description: string | null,
    splatFileUrl: string,
    videoFileUrl: string,
}

export interface SplatEditPayload {
    id: number,
    name: string,
    description: string | null,
    splatFile: File | null,
    videoFile: File | null,
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
    uploadType: string;
    numberOfParts: number;
}