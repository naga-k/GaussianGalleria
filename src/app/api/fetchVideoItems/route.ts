import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db } from '../../db/db';
import { splats } from '../../db/schema';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// app/api/fetchVideoItems/route.ts
interface VideoItem {
  id?: number;
  src: string;
  splatSrc: string;
  name: string | null;
  description: string | null;
}

interface DbItem {
  id: number;
  name: string | null;
  splat: string | null;
  video: string | null;
  description: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'splatData.json');
    let jsonData: VideoItem[] = [];

    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      jsonData = JSON.parse(fileContents);
    }

    const dbData: DbItem[] = await db.select().from(splats);

    const combinedData: VideoItem[] = jsonData.concat(dbData.map((item: DbItem) => ({
      id: item.id,
      src: item.video || '',
      splatSrc: item.splat || '',
      name: item.name || 'Untitled',
      description: item.description || 'No description available'
    })));

    return NextResponse.json(combinedData, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error("Error fetching video items:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}