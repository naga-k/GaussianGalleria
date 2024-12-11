import { NextResponse } from 'next/server';
import { db } from '../../db/db';
import { splats } from '../../db/schema';
import { eq } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// app/api/fetchSceneDetailsWithID/route.ts
interface SceneItem {
  id?: number;
  src: string;
  splatSrc: string;
  name: string | null;
  description: string | null;
}

// Replace DbItem with inferred type
type DbItem = InferSelectModel<typeof splats>;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let rawId: string | null = searchParams.get('id');
    
    if (!rawId) {
      return NextResponse.json(
        { error: 'Id does not exist' },
        { status: 404 }
      );
    }

    const id = parseInt(rawId);
    const dbData: DbItem[] = await db.select()
      .from(splats)
      .where(eq(splats.id, id));

      if (!dbData.length) {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        );
      }

      const item = dbData[0];
      const sceneItem: SceneItem = {
        id: item.id,
        src: item.video || '',
        splatSrc: item.splat || '',
        name: item.name || 'Untitled',
        description: item.description || 'No description available'
      };
  

      return NextResponse.json(sceneItem, {
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