// app/api/s3-presign/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSignedS3Url } from '@/src/app/lib/cloud/s3';

export async function GET(request: NextRequest) {
  const s3Url = request.nextUrl.searchParams.get('url')!;
  const signedUrl = await getSignedS3Url(s3Url);
  return NextResponse.json({ signedUrl });
}

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json();
    
    if (!Array.isArray(urls)) {
      return NextResponse.json({ error: 'urls must be an array' }, { status: 400 });
    }

    const signedUrls = await Promise.all(
      urls.map(url => getSignedS3Url(url))
    );

    return NextResponse.json({ signedUrls });
  } catch {
    return NextResponse.json({ error: 'Failed to sign URLs' }, { status: 500 });
  }
}