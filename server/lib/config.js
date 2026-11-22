import { existsSync } from 'node:fs';
import path from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

const DEFAULT_DATA_DIR = fileURLToPath(new URL('../data', import.meta.url));
const DIST_DIR = fileURLToPath(new URL('../../dist', import.meta.url));
const HASH_PATTERN = /^[a-f0-9]{64}$/;

/** Load .env then .env.local without adding a dotenv dependency (Node 20.12+). */
export function loadEnvFiles(files = ['.env', '.env.local']) {
  if (typeof loadEnvFile !== 'function') return;

  for (const file of files) {
    if (!existsSync(file)) continue;
    try {
      loadEnvFile(file);
    } catch (error) {
      console.warn(`Could not load ${file}: ${error.message}`);
    }
  }
}

export function loadConfig(env = process.env) {
  const adminEmail = String(env.ADMIN_EMAIL ?? '').trim().toLowerCase();
  const adminPasswordHash = String(env.ADMIN_PASSWORD_HASH ?? '').trim().toLowerCase();
  const sessionHours = Math.max(1, Number(env.ADMIN_SESSION_HOURS) || 8);

  return {
    port: Number(env.PORT) || 4000,
    nodeEnv: env.NODE_ENV || 'development',
    adminEmail,
    adminPasswordHash,
    configured: Boolean(adminEmail) && HASH_PATTERN.test(adminPasswordHash),
    sessionHours,
    sessionTtlMs: sessionHours * 60 * 60 * 1000,
    dataDir: env.DATA_DIR ? path.resolve(env.DATA_DIR) : DEFAULT_DATA_DIR,
    distDir: env.DIST_DIR ? path.resolve(env.DIST_DIR) : DIST_DIR,
    secureCookies: env.NODE_ENV === 'production',
  };
}
