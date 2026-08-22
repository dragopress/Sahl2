import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'apps/api/src/main.ts',
  'apps/api/src/common/auth.guard.ts',
  'apps/api/src/common/tenant-context.guard.ts',
  'apps/api/src/common/rbac.ts',
  'apps/api/src/common/http-exception.filter.ts',
  'apps/api/src/common/health.controller.ts',
  'packages/database/prisma/schema.prisma',
  'docker-compose.yml'
];
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing required file: ${file}`);
}
const migrationRoot = path.join(root, 'packages/database/prisma/migrations');
const migrations = fs.readdirSync(migrationRoot, {withFileTypes:true}).filter(x=>x.isDirectory());
if (!migrations.length) throw new Error('No Prisma migrations found');
for (const dir of migrations) {
  const sql = path.join(migrationRoot, dir.name, 'migration.sql');
  if (!fs.existsSync(sql)) throw new Error(`Migration ${dir.name} has no migration.sql`);
}
const schema = fs.readFileSync(path.join(root,'packages/database/prisma/schema.prisma'),'utf8');
for (const model of ['Organization','User','Membership','Session','AuditLog']) {
  if (!new RegExp(`^model\\s+${model}\\s*\\{`, 'm').test(schema)) throw new Error(`Schema missing ${model}`);
}
const main = fs.readFileSync(path.join(root,'apps/api/src/main.ts'),'utf8');
for (const marker of ['ValidationPipe','securityHeadersMiddleware','requestContextMiddleware','HttpExceptionFilter']) {
  if (!main.includes(marker)) throw new Error(`API bootstrap missing ${marker}`);
}
const appModule = fs.readFileSync(path.join(root,'apps/api/src/app.module.ts'),'utf8');
for (const marker of ['RateLimitGuard','CsrfGuard']) {
  if (!appModule.includes(marker)) throw new Error(`API module missing ${marker}`);
}
console.log(`Repository validation passed: ${migrations.length} Prisma migrations, security bootstrap present.`);
