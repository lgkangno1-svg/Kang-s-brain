import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const manifestPath = resolve(projectRoot, 'package.json');
const lockfilePath = resolve(projectRoot, 'package-lock.json');

const readJson = async (path, label) => {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    console.error(`Unable to read ${label}: ${error.message}`);
    process.exit(1);
  }
};

const manifest = await readJson(manifestPath, 'package.json');
const lockfile = await readJson(lockfilePath, 'package-lock.json');
const failures = [];

if (lockfile.lockfileVersion !== 3) {
  failures.push(`Expected npm lockfileVersion 3, received ${lockfile.lockfileVersion ?? 'missing'}.`);
}

const root = lockfile.packages?.[''];
if (!root) {
  failures.push('Lockfile is missing the root package entry.');
} else {
  for (const field of ['dependencies', 'devDependencies']) {
    const expected = manifest[field] ?? {};
    const locked = root[field] ?? {};

    for (const [name, specifier] of Object.entries(expected)) {
      if (locked[name] !== specifier) {
        failures.push(`${field}.${name} differs: package.json=${specifier}, lockfile=${locked[name] ?? 'missing'}.`);
      }
    }

    for (const name of Object.keys(locked)) {
      if (!(name in expected)) {
        failures.push(`Lockfile root contains unexpected ${field}.${name}.`);
      }
    }
  }
}

for (const [packagePath, entry] of Object.entries(lockfile.packages ?? {})) {
  if (!packagePath || !entry || typeof entry !== 'object') continue;

  if (typeof entry.resolved === 'string') {
    let url;
    try {
      url = new URL(entry.resolved);
    } catch {
      failures.push(`${packagePath} has a non-URL resolved value: ${entry.resolved}`);
      continue;
    }

    if (url.protocol !== 'https:' || url.hostname !== 'registry.npmjs.org') {
      failures.push(`${packagePath} resolves outside https://registry.npmjs.org: ${entry.resolved}`);
    }
  }

  if (entry.resolved && typeof entry.integrity !== 'string') {
    failures.push(`${packagePath} has a resolved tarball but no integrity hash.`);
  } else if (typeof entry.integrity === 'string' && !entry.integrity.startsWith('sha512-')) {
    failures.push(`${packagePath} uses a non-sha512 integrity value.`);
  }
}

if (failures.length > 0) {
  console.error('Lockfile policy check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Lockfile policy passed for ${Object.keys(lockfile.packages ?? {}).length - 1} installed package entries.`);
