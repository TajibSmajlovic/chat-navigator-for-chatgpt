import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

function writeJson(filePath, data) {
  writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

function bumpPatch(version) {
  const parts = version.split('.').map(Number);
  parts[2] += 1;
  return parts.join('.');
}

const packageJsonPath = resolve(root, 'package.json');
const manifestJsonPath = resolve(root, 'manifest.json');

const packageJson = readJson(packageJsonPath);
const manifestJson = readJson(manifestJsonPath);

const currentVersion = packageJson.version;
const newVersion = bumpPatch(currentVersion);

packageJson.version = newVersion;
manifestJson.version = newVersion;

writeJson(packageJsonPath, packageJson);
writeJson(manifestJsonPath, manifestJson);

console.log(`Bumped version: ${currentVersion} → ${newVersion}`);
