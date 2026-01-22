import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const prismaClientSingleton = () => {
  // Use DATABASE_URL for connection pooling (recommended for Vercel/serverless)
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  // Optimized pool configuration for serverless environments
  const pool = new Pool({
    connectionString,
    max: 1, // Reduce max connections for serverless (each instance gets 1 connection)
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 10000, // Connection timeout: 10 seconds
    allowExitOnIdle: true, // Allow process to exit when all connections are idle
  });
  
  // Handle pool errors to prevent crashes
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });
  
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
  var pgPool: undefined | Pool;
}

const db = globalThis.prisma ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}
