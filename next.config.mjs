// next.config.mjs

// Validate required AWS environment variables at build time
if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_REGION) {
  throw new Error(
    'Missing required AWS environment variables: AWS_BUCKET_NAME and AWS_REGION must be set for image optimization to work correctly.'
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
    {
      protocol: "https",
      hostname: `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
      pathname: "/**",
    }],
  },
}

export default nextConfig
