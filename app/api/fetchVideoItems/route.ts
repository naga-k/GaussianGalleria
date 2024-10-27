// app/api/fetchVideoItems/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface VideoItem {
  src: string;
  splatSrc: string;
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'videoItems.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data: VideoItem[] = JSON.parse(fileContents);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching video items:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}