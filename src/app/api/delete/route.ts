import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }
  
  try {
    await del(url);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting from Vercel Blob:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}