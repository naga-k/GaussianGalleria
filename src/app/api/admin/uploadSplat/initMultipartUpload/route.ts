import AuthHandler from "@/src/app/lib/auth/authHandler";
import S3Handler from "@/src/app/lib/cloud/s3";
import { S3_BUCKET_ENDPOINTS } from "@/src/app/lib/configs/splatUpload";
import { MultipartUploadConfig, UploadType } from "@/src/app/lib/definitions/SplatPayload";
import { NextResponse } from "next/server";

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
    
    if (!config.fileName || !config.numberOfParts || !config.uploadType) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const { fileName, numberOfParts, uploadType } = config;
    const bucketEndpoint = uploadType === UploadType.SPLAT ? S3_BUCKET_ENDPOINTS.splat : S3_BUCKET_ENDPOINTS.video;
    
    // Fix: Use numeric timestamp and clean filename
    const timestamp = Date.now(); // Use numeric timestamp instead of ISO string
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_'); // Clean filename
    const key = `${bucketEndpoint}${timestamp}_${cleanFileName}`;

    console.log("Generated S3 key:", key); // Debug log
    console.log("Bucket endpoint:", bucketEndpoint); // Debug log

    const s3Handler = new S3Handler();
    const result = await s3Handler.initiateMultipartUpload(key, numberOfParts);

    if (!result || !result.presignedUrls) {
        return NextResponse.json({ error: 'Failed to generate presigned URLs' }, { status: 500 });
    }

    return NextResponse.json({
      key: key, 
      presignedUrls: result.presignedUrls, 
      uploadId: result.uploadId 
    });
  } catch (error) {
    console.error("Error initializing multipart upload:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}