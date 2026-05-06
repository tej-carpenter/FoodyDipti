import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const nextDir = resolve(process.cwd(), '.next');

try {
  await rm(nextDir, { recursive: true, force: true });
} catch (error) {
  if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
    process.exit(0);
  }

  throw error;
}