import { neon, neonConfig } from '@neondatabase/serverless';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';

// Configure Neon for local development with self-signed certificates
if (process.env.NODE_ENV === 'development') {
  neonConfig.fetchEndpoint = process.env.DATABASE_URL?.replace('postgres://', 'http://').replace('?sslmode=require', '') + '/sql';
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

const sql = neon(process.env.DATABASE_URL, {
  // For development with Neon Local, we need to handle self-signed certificates
  fetchOptions: process.env.NODE_ENV === 'development' ? {
    rejectUnauthorized: false
  } : {}
});

const db = drizzle(sql);

export { db, sql };
