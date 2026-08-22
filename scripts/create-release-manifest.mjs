import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const files = [
  'package.json',
  'docker-compose.production.yml',
  '.env.production.example',
  'infra/api/Dockerfile',
  'infra/api/entrypoint.sh',
  'infra/web/Dockerfile',
  'infra/worker/Dockerfile',
];
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
const manifest = {
  product: 'SahlBiz Business OS',
  version: pkg.version,
  generatedAt: new Date().toISOString(),
  files: Object.fromEntries(files.map(file=>[file,sha256(file)])),
};
fs.mkdirSync(path.join(root,'release'), {recursive:true});
fs.writeFileSync(path.join(root,'release','manifest.json'), JSON.stringify(manifest,null,2)+'\n');
console.log(`Created release/manifest.json for ${pkg.version}`);
