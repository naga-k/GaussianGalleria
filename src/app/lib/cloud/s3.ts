import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const getSignedS3Url = async (s3Url: string) => {
  if (!s3Url) return null;

  const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION!,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
    },
  });

  let bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!;
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

  const command = new GetObjectCommand({ Bucket: bucketName, Key: objectKey });
  try {
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return null;
  }
};