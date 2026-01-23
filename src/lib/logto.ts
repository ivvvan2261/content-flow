import LogtoClient from '@logto/next/edge';

export const logtoConfig = {
  endpoint: process.env.LOGTO_ENDPOINT!,
  appId: process.env.LOGTO_APP_ID!,
  appSecret: process.env.LOGTO_APP_SECRET!,
  baseUrl: process.env.LOGTO_BASE_URL!, // e.g. http://localhost:3000
  cookieSecret: process.env.LOGTO_COOKIE_SECRET!, // Auto-generated 32 chars secret
  cookieSecure: process.env.NODE_ENV === 'production',
};

export const logtoClient = new LogtoClient(logtoConfig);
