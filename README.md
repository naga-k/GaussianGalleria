# 3D Portfolio

A Next.js-based portfolio website for showcasing interactive 3D scenes using Splat visualization technology.

## Overview

This portfolio website features:
- Grid-based homepage displaying 3D scenes
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

### Alternative: Local JSON Data

You can alternatively add items directly to `public/splatData.json`:
```json
{
  "items": [
    {
      "src": "s3://your-bucket/path",
      "splatSrc": "s3://your-bucket/splat-path"
    }
  ]
}
```

## Technical Stack

### Viewer Technology
- Primary viewer: [antimatter15's Splat Viewer](https://antimatter15.com/splat/)
- Wrapper: [drei-vanilla](https://github.com/pmndrs/drei-vanilla)

### Asset Storage
- Currently configured for S3 URLs
- Viewer supports any public URL (upcoming feature)

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