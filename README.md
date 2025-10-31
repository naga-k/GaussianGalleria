# GaussianGalleria

A Next.js-based portfolio website for showcasing interactive 3D scenes using [Gaussian Splatting](https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/) and web viewers.

Demo: [Hosted on Vercel](https://3-d-portfolio-tau-three.vercel.app)

## Overview

This Gallery website features:
- Grid-based pages displaying 3D scenes
- Interactive viewer for each scene using Splat technology
- Integration with NeonDB for data storage
- S3 storage for 3D assets

## Getting Started

### Prerequisites
- Node.js
- npm, yarn, pnpm, or bun
- NeonDB account
- AWS S3 bucket for asset storage

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Copy environment variables:
```bash
cp example.env.local .env.local
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Setup

### Using NeonDB

1. Set up environment variables:
   - Ensure `DATABASE_URL` is configured in `.env.local`

2. Generate migration files:
```bash
npx drizzle-kit generate
```

3. Run migrations:
```bash
npx drizzle-kit migrate
```

4. Insert dummy data:
   - Use the SQL script located at `script/insertSplat.sql`
   - Execute the script against your Postgres database in NeonDB

## Technical Stack

### Viewer Technology
- Primary viewer: [antimatter15's Splat Viewer](https://antimatter15.com/splat/)
- Wrapper: [drei-vanilla](https://github.com/pmndrs/drei-vanilla)

### Asset Storage
- Currently configured for S3 URLs
- Viewer supports any public URL (upcoming feature)
- The database will be storing the S3 keys instead of the full path to support dynamic URL signing and easier migration between storage buckets

#### S3 Multipart Upload CORS
Multipart uploads rely on reading the ETag from each presigned `PUT` response. Update your bucket CORS rule to expose that header:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

After saving the policy, wait for it to propagate and verify in your browser devtools that each part response now includes the `ETag` header before calling the completion endpoint.

### Framework
- [Next.js](https://nextjs.org)
- Uses [Geist](https://vercel.com/font) font family via `next/font`

## Deployment

Deploy on Vercel (recommended):
1. Visit the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
2. Follow the deployment steps

For more deployment options, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub repository](https://github.com/vercel/next.js)
