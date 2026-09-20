import { mkdir, mkdtemp, rename, rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const prismaDir = resolve(process.cwd(), "prisma");
const migrationsDir = resolve(prismaDir, "migrations");
const backupDir = await mkdtemp(resolve(prismaDir, ".migrations-backup-"));
const backupMigrationsDir = resolve(backupDir, "migrations");
let hasBackup = false;

try {
  await rename(migrationsDir, backupMigrationsDir);
  hasBackup = true;
} catch (error) {
  if (error?.code !== "ENOENT") {
    await rm(backupDir, { recursive: true, force: true });
    throw error;
  }

  await rm(backupDir, { recursive: true, force: true });
}

let migrationFile;

try {
  await mkdir(migrationsDir, { recursive: true });

  execFileSync(
    "npx",
    [
      "prisma",
      "migrate",
      "dev",
      "--schema=prisma/schema.prisma",
      "--name",
      "init",
      "--create-only",
    ],
    { stdio: "inherit" },
  );

  const stdout = execFileSync(
    "find",
    [migrationsDir, "-maxdepth", "2", "-type", "f", "-name", "migration.sql"],
    { encoding: "utf8" },
  );
  const files = stdout.trim().split("\n").filter(Boolean);
  if (files.length !== 1) {
    throw new Error(
      `Expected exactly one fresh migration.sql, found ${files.length}`,
    );
  }

  migrationFile = files[0];
} catch (error) {
  await rm(migrationsDir, { recursive: true, force: true });
  if (hasBackup) {
    await rename(backupMigrationsDir, migrationsDir);
  } else {
    await rm(backupDir, { recursive: true, force: true });
  }
  throw error;
}

if (hasBackup) {
  await rm(backupDir, { recursive: true, force: true });
}
console.log(`Fresh Prisma migration created: ${migrationFile}`);
