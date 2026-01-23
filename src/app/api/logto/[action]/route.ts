import { NextRequest } from 'next/server';
import { logtoClient } from '@/lib/logto';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;

  if (action === 'sign-in') {
    return logtoClient.handleSignIn()(request);
  }

  if (action === 'sign-in-callback') {
    return logtoClient.handleSignInCallback()(request);
  }

  if (action === 'sign-out') {
    return logtoClient.handleSignOut()(request);
  }

  if (action === 'user') {
    return logtoClient.handleUser()(request);
  }

  return new Response('Not Found', { status: 404 });
}
