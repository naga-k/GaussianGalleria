export const S3_BUCKET_ENDPOINTS = {
    splat: process.env.AWS_BUCKET_SPLAT_ENDPOINT || null,
    video: process.env.AWS_BUCKET_VIDEO_ENDPOINT || null,
    thumbnail: process.env.AWS_BUCKET_THUMBNAIL_ENDPOINT || null,
};

export const DEFAULT_CHUNK_SIZE = 20000000;