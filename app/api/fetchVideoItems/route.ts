import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db } from '../../db/db';
import { splats } from '../../db/schema';

interface VideoItem {
  src: string;
  splatSrc: string;
}

interface DbItem {
  id: number;
  name: string | null;
  splat: string | null;
  video: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export async function GET() {
  try {
    // Fetch data from JSON file
    const filePath = path.join(process.cwd(), 'public', 'splatData.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const jsonData: VideoItem[] = JSON.parse(fileContents);

    // Fetch data from database
    const dbData: DbItem[] = await db.select().from(splats);

    // Combine data
    const combinedData: VideoItem[] = jsonData.concat(dbData.map((item: DbItem) => ({
      src: item.video || '',
      splatSrc: item.splat || ''
    })));

    return NextResponse.json(combinedData);
  } catch (error) {
    console.error("Error fetching video items:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}