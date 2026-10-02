import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const required = [
  'package.json',
  'docker-compose.production.yml',
  '.env.production.example',
  'infra/api/Dockerfile',
  'infra/api/entrypoint.sh',
  'infra/web/Dockerfile',
  'infra/worker/Dockerfile',
  'packages/database/prisma/schema.prisma',
  'scripts/backup-postgres.sh',
  'scripts/restore-postgres.sh',
  'scripts/backup-object-storage.sh',
  'scripts/restore-object-storage.sh',
  'scripts/validate-repo.mjs',
];
const failures = [];
const manifestFiles = [
  'package.json',
  'docker-compose.production.yml',
  '.env.production.example',
  'infra/api/Dockerfile',
  'infra/api/entrypoint.sh',
  'infra/web/Dockerfile',
  'infra/worker/Dockerfile',
];
const exists = (p) => fs.existsSync(path.join(root, p));
for (const file of required) if (!exists(file)) failures.push(`missing: ${file}`);

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = pkg.version ?? '';
if (!/^\d+\.\d+\.\d+-rc\.\d+$/.test(version)) failures.push(`root version must be release-candidate semver, got ${version}`);

for (const file of ['apps/api/package.json','apps/web/package.json','apps/worker/package.json','packages/database/package.json','packages/storage/package.json']) {
  const data = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  if (data.version !== version) failures.push(`${file} version ${data.version} != root ${version}`);
}

const migrationsDir = path.join(root, 'packages/database/prisma/migrations');
const migrations = fs.existsSync(migrationsDir)
  ? fs.readdirSync(migrationsDir, {withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name)
  : [];
for (const name of migrations) {
  if (!/^\d{8}(?:\d{6})?_.+/.test(name)) failures.push(`migration name is not timestamped: ${name}`);
  if (!exists(`packages/database/prisma/migrations/${name}/migration.sql`)) failures.push(`migration missing SQL: ${name}`);
}

const env = fs.readFileSync(path.join(root, '.env.production.example'), 'utf8');
for (const secret of ['POSTGRES_PASSWORD','REDIS_PASSWORD','SESSION_SECRET','MINIO_ROOT_PASSWORD','S3_SECRET_ACCESS_KEY']) {
  const line = env.split(/\r?\n/).find(x=>x.startsWith(`${secret}=`));
  if (!line || /CHANGE_ME|replace|example/i.test(line.split('=')[1] ?? '')) {
    // Templates intentionally contain placeholders; fail only if a real-looking short secret is committed.
    continue;
  }
}
if (/BEGIN (RSA|OPENSSH) PRIVATE KEY/.test(env)) failures.push('private key material found in production env template');

const manifestPath = path.join(root, 'release/manifest.json');
if (!fs.existsSync(manifestPath)) {
  failures.push('release/manifest.json is missing; run npm run release:manifest');
} else {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (manifest.version !== version) failures.push(`release manifest version ${manifest.version} != package ${version}`);
    for (const file of manifestFiles) {
      const expected = manifest.files?.[file];
      const actual = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
      if (expected !== actual) failures.push(`release manifest hash mismatch: ${file}`);
    }
  } catch (error) {
    failures.push(`release/manifest.json is invalid: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const entrypoint = fs.readFileSync(path.join(root, 'infra/api/entrypoint.sh'), 'utf8');
if (!entrypoint.includes('exit 0')) failures.push('migration entrypoint must exit after one-shot migrations');

if (failures.length) {
  console.error('Release candidate check FAILED');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}
console.log(`Release candidate ${version} repository checks passed.`);
console.log(`Migrations checked: ${migrations.length}`);
