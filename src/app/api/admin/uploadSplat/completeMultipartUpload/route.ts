import { NextResponse } from "next/server";
import S3Handler from "@/src/app/lib/cloud/s3";
import AuthHandler from "@/src/app/lib/auth/authHandler";

interface CompletedPart {
    ETag: string;
    PartNumber: number;
}

interface CompleteUploadRequest {
    key: string;
    uploadId: string;
    parts: CompletedPart[];
}

export async function POST(request: Request) {
    try {

        const authHandler = new AuthHandler();
        if (!(await authHandler.verifyAuth())) {
            return NextResponse.json(
                { error: "Endpoint accessed without authenticated session." },
                { status: 403 }
            );
        }
        const { uploadId, key, parts } = await request.json() as CompleteUploadRequest;

        if (!uploadId || !key || !parts) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        const s3Handler = new S3Handler();
        const result = await s3Handler.completeMultipartUpload(uploadId, key, parts);


        if (!result) {
            return NextResponse.json(
                { error: "Failed to complete multipart upload" },
                { status: 500 }
            );
        }

        return NextResponse.json({ location: result });

    } catch (error) {
        console.error("Error completing multipart upload:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}