import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserCredits, getGuestUsage } from '@/lib/credits';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(/, /)[0] : "127.0.0.1";
    const guestUsage = await getGuestUsage(ip);
    return NextResponse.json({ balance: Math.max(0, 10 - guestUsage.count), isGuest: true });
  }
  
  const credits = await getUserCredits(userId);
  return NextResponse.json({ ...credits, isGuest: false });
}
