#!/usr/bin/env node
/**
 * Print the SHA-256 hash of a password for ADMIN_PASSWORD_HASH (server env).
 *
 *   npm run auth:hash -- "my super secret password"
 */
import { createHash } from 'node:crypto';

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run auth:hash -- "your-password"');
  process.exit(1);
}

console.log(createHash('sha256').update(password).digest('hex'));
