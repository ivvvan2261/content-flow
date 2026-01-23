import { NextRequest, NextResponse } from 'next/server';
import { logtoClient } from '@/lib/logto';

export async function GET(request: NextRequest) {
  const { isAuthenticated, claims } = await logtoClient.getLogtoContext(request);
  
  if (!isAuthenticated || !claims?.sub) {
    return NextResponse.json({ userId: null });
  }
  
  return NextResponse.json({ userId: claims.sub });
}
