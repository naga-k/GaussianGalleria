import {
  S3Client,
  GetObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface CompletedPart {
  ETag: string;
  PartNumber: number;
}

export default class S3Handler {
  client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async getSignedS3Url(s3Url: string) {
    if (!s3Url) return null;
    let bucketName = process.env.AWS_BUCKET_NAME!;
    let objectKey = "";

    // Handle different URL formats
    if (s3Url.startsWith("s3://")) {
      const bucketAndKey = s3Url.substring(5); // Remove 's3://'
      const [bucket, ...keyParts] = bucketAndKey.split("/");
      bucketName = bucket;
      objectKey = keyParts.join("/");
    } else if (s3Url.startsWith("https://")) {
      // Handle full HTTPS URL
      const url = new URL(s3Url);
      bucketName = url.hostname.split(".")[0];
      objectKey = url.pathname.substring(1); // Remove leading '/'
    } else {
      // Handle plain object key
      objectKey = s3Url;
    }

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });
    try {
      return await getSignedUrl(this.client, command, { expiresIn: 3600 });
    } catch (error) {
      console.error("Error generating presigned URL:", error);
      return null;
    }
  }

  async upload(filename: string, fileBlob: Blob, bucket_endpoint: string): Promise<string | null> {
    try {
      const key = `${bucket_endpoint}${filename}`;
      const bucketName = process.env.AWS_BUCKET_NAME;

      const upload = new Upload({
        client: this.client,
        params: {
          Bucket: bucketName,
          Key: key,
          Body: fileBlob,
        },
      });
      
      return await upload.done().then(() => {
        // Return the key instead of the full URL
        return key;
      });
    } catch (error) {
      console.error("Error during upload:", error);
      return null;
    }
  }

  async initiateMultipartUpload(key: string, numberOfParts: number) {

    try {

      const createMultipartUploadCommand = new CreateMultipartUploadCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
      });

      const startUploadResponse = await this.client.send(createMultipartUploadCommand);

      const uploadId = startUploadResponse.UploadId;

      const presignedUrls: string[] = [];

      for (let i = 0; i < numberOfParts; i++) {
        const presignedUrl = await getSignedUrl(
          this.client,
          new UploadPartCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: key,
            UploadId: uploadId,
            PartNumber: i + 1,
          }),
          {},
        );

        presignedUrls.push(presignedUrl);

      }

      return { presignedUrls, uploadId };
    }
    catch (error) {
      console.error("Error during upload:", error);
      return null;
    }
  }

  async completeMultipartUpload(uploadId: string, key: string, parts: CompletedPart[]): Promise<string | null> {
    try {
      const command = new CompleteMultipartUploadCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: parts
        }
      });

      const response = await this.client.send(command);
      if (!response) {
        throw new Error("Error completing multipart upload");
      }
      
      // Return the key instead of full URL
      return key;
    } catch (error) {
      console.error("Error completing multipart upload:", error);
      return null;
    }
  }

  async deleteFileWithUrl(url: string): Promise<boolean> {
    try {
      let bucket = process.env.AWS_BUCKET_NAME!;
      let key = "";
  
      if (url.startsWith('https://')) {
        const parsedUrl = new URL(url);
        // Extract key from pathname (remove leading slash)
        key = parsedUrl.pathname.substring(1);
      } else if (url.startsWith('s3://')) {
        const path = url.substring(5); // Remove 's3://'
        const [bucketName, ...keyParts] = path.split('/');
        bucket = bucketName;
        key = keyParts.join('/');
      } else {
        // Treat as direct key
        key = url;
      }
  
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      });
  
      await this.client.send(deleteCommand);
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  }
}
