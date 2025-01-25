import { CompletedPart, MultipartUploadConfig, MultipartUploadResponse } from "@/src/app/lib/definitions/SplatPayload";

const DEFAULT_CHUNK_SIZE = 10000000; // 10MB


export async function initializeMultipartUpload( config: MultipartUploadConfig): Promise<MultipartUploadResponse> {
   
    try {
        const response = await fetch("/api/admin/uploadSplat/initMultipartUpload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(config)
        });
        if (!response.ok) {
            throw new Error(`Failed to initialize multipart upload: ${response.statusText}`);
        }
        return await response.json() as MultipartUploadResponse;
    } catch (error) {
        console.error("Error initializing multipart upload:", error);
        throw error;
    }
}

export async function uploadParts(
    file: File, 
    presignedUrls: string[], 
    chunkSize: number = DEFAULT_CHUNK_SIZE
): Promise<CompletedPart[]> {
    const uploadPart = async (blob: Blob, url: string, partNumber: number): Promise<CompletedPart> => {
        try {
            const response = await fetch(url, { method: "PUT", body: blob });
            if (!response.ok) throw new Error(`Failed to upload part ${partNumber}: ${response.statusText}`);
            return { PartNumber: partNumber, ETag: response.headers.get("ETag") || "" };
        } catch (error) {
            console.error(`Error uploading part ${partNumber}:`, error);
            throw error;
        }
    };

    try {
        const uploads = presignedUrls.map((url, index) => {
            const start = index * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            return uploadPart(file.slice(start, end), url, index + 1);
        });

        return await Promise.all(uploads);
    } catch (error) {
        console.error("Error uploading parts:", error);
        throw error;
    }
}

export async function completeMultipartUpload(
    key: string,
    uploadId: string,
    parts: CompletedPart[]
): Promise<{ success: boolean, location: string }> {
    try {
        const response = await fetch("/api/admin/uploadSplat/completeMultipartUpload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                key,
                uploadId,
                parts
            })
        });
        if (!response.ok) {
            throw new Error(`Failed to complete multipart upload: ${response.statusText}`);
        }

        const data = await response.json();
        return { success: response.ok, location: data.location};
    } catch (error) {
        console.error("Error completing multipart upload:", error);
        throw error;
    }
}

export async function handleMultipartUpload(file: File, uploadType: string): Promise<{success: boolean, location: string}> {
    
    try {

        const numberOfParts =  Math.ceil(file.size / (DEFAULT_CHUNK_SIZE));

        const config: MultipartUploadConfig = {
            fileName: file.name,
            numberOfParts: numberOfParts,
            uploadType: uploadType,
        }
        
        const { key, presignedUrls, uploadId } = await initializeMultipartUpload(config);
        const parts = await uploadParts(file, presignedUrls, DEFAULT_CHUNK_SIZE);
        const { success,location } = await completeMultipartUpload(key, uploadId, parts);
        return { success, location };
    } catch (error) {
        console.error("Error handling multipart upload:", error);
        throw error;
    }
}