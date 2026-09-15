import { rm, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const prismaDir = resolve(process.cwd(), 'prisma');
const migrationsDir = resolve(prismaDir, 'migrations');

await rm(migrationsDir, { recursive: true, force: true });
await mkdir(migrationsDir, { recursive: true });

execFileSync('npx', [
  'prisma', 'migrate', 'dev',
  '--schema=prisma/schema.prisma',
  '--name', 'init',
  '--create-only',
], { stdio: 'inherit' });

const stdout = execFileSync('find', [migrationsDir, '-maxdepth', '2', '-type', 'f', '-name', 'migration.sql'], { encoding: 'utf8' });
const files = stdout.trim().split('\n').filter(Boolean);
if (files.length !== 1) {
  throw new Error(`Expected exactly one fresh migration.sql, found ${files.length}`);
}
console.log(`Fresh Prisma migration created: ${files[0]}`);
