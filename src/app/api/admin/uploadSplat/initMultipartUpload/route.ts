import S3Handler from "@/src/app/lib/cloud/s3";
import { NextResponse } from "next/server";
import { S3_BUCKET_ENDPOINTS } from "@/src/app/lib/config";
import AuthHandler from "@/src/app/lib/auth/authHandler";
import { MultipartUploadConfig } from "@/src/app/lib/definitions/SplatPayload";

export async function POST(request: Request) {
    try {
        const authHandler = new AuthHandler();
            if (!(await authHandler.verifyAuth())) {
              return NextResponse.json(
                { error: "Endpoint accessed without authenticated session." },
                { status: 403 }
              );
            }

        const config: MultipartUploadConfig = await request.json(); 
        const { fileName, numberOfParts, uploadType } = config;

        if (!fileName || !uploadType || !numberOfParts) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const bucketEndpoint =  uploadType === "splat"? S3_BUCKET_ENDPOINTS.splat: S3_BUCKET_ENDPOINTS.video;
        const key = `${bucketEndpoint}${new Date().toISOString()}${fileName}`;

        const s3Handler = new S3Handler();
        const result = await s3Handler.initiateMultipartUpload(
            key,
            numberOfParts,
        );

        if (!result || !result.presignedUrls) {
            return NextResponse.json({ error: 'Failed to generate presigned URLs' }, { status: 500 });
        }

        return NextResponse.json({key:key, presignedUrls: result.presignedUrls, uploadId: result.uploadId });
    } catch (error) {
        console.error('Error in initMultipartUpload:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}