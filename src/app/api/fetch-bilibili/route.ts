import { getBilibiliSubtitles } from '@/lib/bilibili';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic'; // Force dynamic rendering to prevent caching

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: '请输入视频链接' }, { status: 400 });
    }

    const videoContent = await getBilibiliSubtitles(url);
    
    return NextResponse.json({ content: videoContent });

  } catch (error) {
    console.error('Fetch Bilibili Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取视频内容失败，请检查链接是否有效' },
      { status: 500 }
    );
  }
}
